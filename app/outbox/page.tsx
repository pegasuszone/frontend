'use client'

import NFTImage from '@/components/app/NFTImage'
import Profile from '@/components/app/Profile'
import Spinner from '@/components/app/Spinner'
import { Button } from '@/components/catalyst/button'
import { Divider } from '@/components/catalyst/divider'
import { Heading } from '@/components/catalyst/heading'
import { Text } from '@/components/catalyst/text'
import { useTx } from '@/contexts/tx'
import GET_PROFILE from '@/graphql/profile'
import { PegasusQueryClient } from '@/types/Pegasus.client'
import { PegasusMsgComposer } from '@/types/Pegasus.message-composer'
import { usePegasusOffersBySenderQuery } from '@/types/Pegasus.react-query'
import { Offer } from '@/types/Pegasus.types'
import { CHAIN_ID, CONTRACT_ADDRESS } from '@/utils/constants'
import { mod, truncateAddress } from '@/utils/format'
import { useQuery } from '@apollo/client'
import { toUtf8 } from '@cosmjs/encoding'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import ReactTooltip from '@huner2/react-tooltip'
import clsx from 'clsx'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { useAccount, useCosmWasmClient } from 'graz'
import { useCallback } from 'react'

export default function Outbox() {
  const { data: account, isConnected } = useAccount()
  const { data: cosmWasmClient } = useCosmWasmClient({ chainId: CHAIN_ID })

  const { tx } = useTx()

  const { data: profile } = useQuery(GET_PROFILE, {
    variables: { address: account?.bech32Address || '' },
  })

  const {
    data: offers,
    isFetched,
    refetch,
  } = usePegasusOffersBySenderQuery({
    client: new PegasusQueryClient(cosmWasmClient!, CONTRACT_ADDRESS),
    args: {
      sender: account?.bech32Address!,
    },
    options: {
      enabled: !!cosmWasmClient && !!account,
    },
  })

  const handleRetractOffer = useCallback(
    (offer: Offer) => {
      if (!account) return

      const messageComposer = new PegasusMsgComposer(
        account.bech32Address,
        CONTRACT_ADDRESS
      )

      const revokeMsgs = offer.offered_nfts.map((nft) => {
        return {
          typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
          value: MsgExecuteContract.fromPartial({
            sender: account.bech32Address,
            msg: toUtf8(
              JSON.stringify({
                revoke: {
                  spender: CONTRACT_ADDRESS,
                  token_id: nft.token_id.toString(),
                },
              })
            ),
            contract: nft.collection,
          }),
        }
      })

      const retractOffer = messageComposer.removeOffer({ id: offer.id })

      tx(
        [...revokeMsgs, retractOffer],
        {
          toast: {
            title: 'Offer Retracted',
            message: 'Your offer has been succesfully retracted',
          },
        },
        refetch
      )
    },
    [account]
  )

  return isConnected && profile && isFetched ? (
    <main className="w-screen !mx-0 !max-w-full">
      <Profile profile={profile} />
      <Divider className="my-8" />
      <div>
        <Heading className="mb-4">Outbox</Heading>
        {offers?.offers.length === 0 && (
          <div className="border-zinc-950/10 dark:border-white/10 border rounded-md p-4 lg:py-4 lg:px-8 flex space-y-4 lg:space-y-0 flex-col lg:flex-row justify-between items-center">
            <div>
              <Heading>Make an offer to get started</Heading>
              <Text>You do not have any outgoing trade offers.</Text>
            </div>
            <Button
              color="white"
              className="!cursor-pointer !w-full lg:!w-auto"
              href="/"
            >
              Get Started
            </Button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers?.offers.map((offer) => {
            const expiresAt = new Date(parseInt(offer.expires_at) / 1000000)
            const expired = expiresAt < new Date()
            return (
              <div
                key={offer.id}
                className="p-4 border border-zinc-950/10 dark:border-white/10 rounded-lg"
              >
                <div className="flex flex-row items-center space-x-2">
                  <PaperAirplaneIcon className="text-black dark:text-white w-5 h-5" />
                  <Heading level={3}>{truncateAddress(offer.peer)}</Heading>
                </div>
                <Divider className="my-4" />
                <ReactTooltip
                  effect="solid"
                  type="info"
                  className="tooltip"
                  arrowColor="rgba(0,0,0,0)"
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Heading level={4} className="mb-2">
                      Yours
                    </Heading>
                    <div className="grid grid-flow-row grid-cols-3 gap-2">
                      {offer.offered_nfts.map((nft) => (
                        <NFTImage
                          key={mod(nft.collection, nft.token_id.toString())}
                          collectionAddress={nft.collection}
                          tokenId={nft.token_id.toString()}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Heading level={4} className="mb-2">
                      Theirs
                    </Heading>
                    <div className="grid grid-flow-row grid-cols-3 gap-2">
                      {offer.wanted_nfts.map((nft) => (
                        <NFTImage
                          key={mod(nft.collection, nft.token_id.toString())}
                          collectionAddress={nft.collection}
                          tokenId={nft.token_id.toString()}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <Divider className="my-4" />
                <div className="flex flex-col lg:flex-row lg:justify-between items-center">
                  <p
                    className={clsx(
                      expired
                        ? 'text-red-500'
                        : 'text-zinc-950 dark:text-white/80',
                      'text-sm'
                    )}
                  >
                    {expired ? 'Expired' : 'Expires'}{' '}
                    {expiresAt.toLocaleString()}
                  </p>
                  <Button
                    className="cursor-pointer mt-2 lg:mt-0 w-full lg:w-auto"
                    onClick={() => handleRetractOffer(offer)}
                  >
                    Retract Offer
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  ) : (
    <div className="grow overflow-hidden flex justify-center items-center">
      <Spinner className="w-16 h-16" />
    </div>
  )
}
