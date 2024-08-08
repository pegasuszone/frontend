import { BLOCK_EXPLORER, CHAIN_ID } from '@/utils/constants'
import { calculateFee, isDeliverTxSuccess } from '@cosmjs/stargate'
import { ArrowTopRightOnSquareIcon as LinkIcon } from '@heroicons/react/24/outline'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { useAccount, useCosmWasmSigningClient } from 'graz'
import { createContext, ReactNode, useContext } from 'react'
import useToaster, { ToastPayload, ToastTypes } from './toast'

// Context to handle simple signingClient transactions
export interface Msg {
  typeUrl: string
  value: any
}

export interface TxOptions {
  toast?: {
    title?: ToastPayload['title']
    message?: ToastPayload['message']
    type?: ToastTypes
    actions?: JSX.Element
  }
}

export interface TxContext {
  tx: (msgs: Msg[], options: TxOptions, callback?: () => void) => Promise<void>
}

export const Tx = createContext<TxContext>({
  tx: () => new Promise(() => {}),
})

export function TxProvider({ children }: { children: ReactNode }) {
  const { data: account } = useAccount()
  const { data: signingCosmWasmClient, refetch } = useCosmWasmSigningClient({
    chainId: CHAIN_ID,
  })

  const toaster = useToaster()

  // Method to sign & broadcast transaction
  const tx = async (msgs: Msg[], options: TxOptions, callback?: () => void) => {
    if (!signingCosmWasmClient) await refetch()
    console.log('signingCosmWasmClient', signingCosmWasmClient)

    if (!account || !signingCosmWasmClient) return

    let simulateToastId = ''

    simulateToastId = toaster.toast(
      {
        title: 'Simulating transaction...',
        type: ToastTypes.Pending,
      },
      { duration: 999999 }
    )

    const gas = await signingCosmWasmClient.simulate(
      account.bech32Address,
      msgs,
      undefined
    )

    const fee = calculateFee(Math.round(gas * 1.4), '0ustars')

    toaster.dismiss(simulateToastId)

    let signed
    try {
      signed = await signingCosmWasmClient.sign(
        account.bech32Address,
        msgs,
        fee,
        ''
      )
    } catch (e: any) {
      toaster.toast({
        title: 'Error',
        dismissable: true,
        message: e.message as string,
        type: ToastTypes.Error,
      })
    }

    let broadcastToastId = ''

    broadcastToastId = toaster.toast(
      {
        title: 'Broadcasting transaction...',
        type: ToastTypes.Pending,
      },
      { duration: 999999 }
    )

    if (signed) {
      await signingCosmWasmClient
        .broadcastTx(Uint8Array.from(TxRaw.encode(signed).finish()))
        .then((res) => {
          toaster.dismiss(broadcastToastId)
          if (isDeliverTxSuccess(res)) {
            // Run callback
            if (callback) callback()

            toaster.toast({
              title: options.toast?.title || 'Transaction Successful',
              type: options.toast?.type || ToastTypes.Success,
              dismissable: true,
              actions: options.toast?.actions || <></>,
              message:
                options.toast?.message ||
                (BLOCK_EXPLORER && (
                  <>
                    View{' '}
                    <a
                      href={`${BLOCK_EXPLORER}/tx/${res.transactionHash}`}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="inline"
                    >
                      transaction in explorer{' '}
                      <LinkIcon className="inline w-3 h-3 text-gray-400 hover:text-gray-500" />
                    </a>
                    .
                  </>
                )),
            })
          } else {
            toaster.toast({
              title: 'Error',
              message: res.rawLog,
              type: ToastTypes.Error,
            })
          }
        })
    } else {
      toaster.dismiss(broadcastToastId)
    }
  }

  return <Tx.Provider value={{ tx }}>{children}</Tx.Provider>
}

export const useTx = (): TxContext => useContext(Tx)
