import issueOfferReceivedNotification from '@/server/issueOfferReceivedNotification'
import issueOfferSentNotification from '@/server/issueOfferSentNotification'
import { PegasusMsgComposer } from '@/types/Pegasus.message-composer'
import { TokenMsg } from '@/types/Pegasus.types'
import { CONTRACT_ADDRESS } from '@/utils/constants'
import { demod, mod, Mod } from '@/utils/format'
import { toUtf8 } from '@cosmjs/encoding'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { useAccount } from 'graz'
import { useRouter } from 'next/navigation'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useTx } from './tx'

type SelectedTokens = Map<Mod, string>
type ToggleTokenFunction = (
  collectionAddress: string,
  tokenId: string,
  image: string
) => void

export interface TradeContext {
  selectedUserTokens: SelectedTokens
  toggleUserToken: ToggleTokenFunction
  selectedPeerTokens: SelectedTokens
  togglePeerToken: ToggleTokenFunction
  peer: string | undefined
  setPeer: (peer: string) => void
  clearPeer: () => void
  clearSelectedPeerTokens: () => void
  confirmTrade: () => Promise<void>
}

export const Trade = createContext<TradeContext>({
  selectedUserTokens: new Map<Mod, string>(),
  toggleUserToken: () => {},
  selectedPeerTokens: new Map<Mod, string>(),
  togglePeerToken: () => {},
  peer: undefined,
  setPeer: () => {},
  clearPeer: () => {},
  clearSelectedPeerTokens: () => {},
  confirmTrade: () => new Promise(() => {}),
})

export function TradeProvider({ children }: { children: ReactNode }) {
  const { data: account } = useAccount()
  const router = useRouter()
  const { tx } = useTx()

  const [peer, setPeer] = useState<string | undefined>()
  const clearPeer = () => setPeer(undefined)

  const selectedUserTokens = useMemo(() => new Map<Mod, string>(), [account])
  const [
    selectedUserTokensRefreshCounter,
    setSelectedUserTokensRefreshCounter,
  ] = useState<number>(0)
  const refreshSelectedUserTokens = useCallback(
    () =>
      setSelectedUserTokensRefreshCounter(selectedUserTokensRefreshCounter + 1),
    [selectedUserTokensRefreshCounter, setSelectedUserTokensRefreshCounter]
  )

  const toggleUserToken = (
    collectionAddress: string,
    tokenId: string,
    image: string
  ) => {
    const tokenMod = mod(collectionAddress, tokenId)
    switch (selectedUserTokens.has(tokenMod)) {
      case true:
        selectedUserTokens.delete(tokenMod)
        break
      case false:
        if (selectedUserTokens.size >= 5) return
        selectedUserTokens.set(tokenMod, image)
        break
    }
    refreshSelectedUserTokens()
  }

  const selectedPeerTokens = useMemo(() => new Map<Mod, string>(), [account])
  const [
    selectedPeerTokensRefreshCounter,
    setSelectedPeerTokensRefreshCounter,
  ] = useState<number>(0)
  const refreshSelectedPeerTokens = useCallback(
    () =>
      setSelectedPeerTokensRefreshCounter(selectedPeerTokensRefreshCounter + 1),
    [selectedPeerTokensRefreshCounter, setSelectedPeerTokensRefreshCounter]
  )

  const togglePeerToken = (
    collectionAddress: string,
    tokenId: string,
    image: string
  ) => {
    const tokenMod = mod(collectionAddress, tokenId)
    switch (selectedPeerTokens.has(tokenMod)) {
      case true:
        selectedPeerTokens.delete(tokenMod)
        break
      case false:
        if (selectedPeerTokens.size >= 5) return
        selectedPeerTokens.set(tokenMod, image)
        break
    }
    refreshSelectedPeerTokens()
  }

  const clearSelectedPeerTokens = () => {
    selectedPeerTokens.clear()
    refreshSelectedPeerTokens()
  }

  const tokenMsg = (map: Map<Mod, string>): TokenMsg[] => {
    return Array.from(map.entries()).map(([mod, image]) => {
      const { collectionAddress: collection, tokenId } = demod(mod)
      return {
        collection,
        token_id: parseInt(tokenId),
      }
    })
  }

  const confirmTrade = async () => {
    if (!account || !peer) return

    const messageComposer = new PegasusMsgComposer(
      account.bech32Address,
      CONTRACT_ADDRESS
    )

    const approveMsgs = Array.from(selectedUserTokens.keys()).map((mod) => {
      const { collectionAddress, tokenId } = demod(mod)
      return {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: account.bech32Address,
          msg: toUtf8(
            JSON.stringify({
              approve: {
                spender: CONTRACT_ADDRESS,
                token_id: tokenId,
              },
            })
          ),
          contract: collectionAddress,
        }),
      }
    })

    const createOffer = messageComposer.createOffer({
      offeredNfts: tokenMsg(selectedUserTokens),
      peer,
      wantedNfts: tokenMsg(selectedPeerTokens),
    })
    await tx([...approveMsgs, createOffer], {}, () => {
      issueOfferSentNotification(account.bech32Address, peer)
      issueOfferReceivedNotification(account.bech32Address, peer)
      router.push('/offers')
    })
  }

  return (
    <Trade.Provider
      value={{
        selectedUserTokens,
        toggleUserToken,
        selectedPeerTokens,
        togglePeerToken,
        clearSelectedPeerTokens,
        peer,
        setPeer,
        clearPeer,
        confirmTrade,
      }}
    >
      {children}
    </Trade.Provider>
  )
}

export const useTrade = (): TradeContext => useContext(Trade)
