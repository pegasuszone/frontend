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
import { usePegasusOffersByPeerQuery } from '@/types/Pegasus.react-query'
import { Offer } from '@/types/Pegasus.types'
import { CHAIN_ID, CONTRACT_ADDRESS } from '@/utils/constants'
import { mod, truncateAddress } from '@/utils/format'
import { useQuery } from '@apollo/client'
import { toUtf8 } from '@cosmjs/encoding'
import { InboxArrowDownIcon } from '@heroicons/react/24/outline'
import ReactTooltip from '@huner2/react-tooltip'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { useAccount, useCosmWasmClient } from 'graz'
import { useCallback } from 'react'

export default function Inbox() {
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
  } = usePegasusOffersByPeerQuery({
    client: new PegasusQueryClient(cosmWasmClient!, CONTRACT_ADDRESS),
    args: {
      peer: account?.bech32Address!,
    },
    options: {
      enabled: !!cosmWasmClient && !!account,
    },
  })

  const handleRejectOffer = useCallback(
    (offer: Offer) => {
      if (!account) return

      const messageComposer = new PegasusMsgComposer(
        account.bech32Address,
        CONTRACT_ADDRESS
      )

      const rejectOffer = messageComposer.rejectOffer({ id: offer.id })

      tx(
        [rejectOffer],
        {
          toast: {
            title: 'Offer Rejected',
            message: 'You have succesfully rejected the offer.',
          },
        },
        refetch
      )
    },
    [account]
  )

  const handleAcceptOffer = useCallback(
    (offer: Offer) => {
      if (!account) return

      const messageComposer = new PegasusMsgComposer(
        account.bech32Address,
        CONTRACT_ADDRESS
      )

      const approveMsgs = offer.wanted_nfts.map((nft) => {
        return {
          typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
          value: MsgExecuteContract.fromPartial({
            sender: account.bech32Address,
            msg: toUtf8(
              JSON.stringify({
                approve: {
                  spender: CONTRACT_ADDRESS,
                  token_id: nft.token_id.toString(),
                },
              })
            ),
            contract: nft.collection,
          }),
        }
      })

      const acceptOffer = messageComposer.acceptOffer({ id: offer.id })

      tx(
        [...approveMsgs, acceptOffer],
        {
          toast: {
            title: 'Offer Accepted',
            message:
              'You have accepted the offer. The NFTs have been transferred succesfully.',
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
        <Heading className="mb-4">Inbox</Heading>
        {offers?.offers.length === 0 && (
          <div className="border-zinc-950/10 dark:border-white/10 border rounded-md p-4 lg:py-4 lg:px-8 flex space-y-4 lg:space-y-0 flex-col lg:flex-row justify-between items-center">
            <div>
              <Heading>Your inbox is empty</Heading>
              <Text>You do not have any incoming trade offers.</Text>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers?.offers
            .filter((offer) => {
              const expiresAt = new Date(parseInt(offer.expires_at) / 1000000)
              return expiresAt > new Date()
            })
            .map((offer) => {
              const expiresAt = new Date(parseInt(offer.expires_at) / 1000000)
              return (
                <div
                  key={offer.id}
                  className="p-4 border border-zinc-950/10 dark:border-white/10 rounded-lg"
                >
                  <div className="flex flex-row items-center space-x-2">
                    <InboxArrowDownIcon className="text-black dark:text-white w-5 h-5" />
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
                        {offer.wanted_nfts.map((nft) => (
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
                        {offer.offered_nfts.map((nft) => (
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
                    <p className="text-zinc-950 dark:text-white/80 text-sm">
                      Expires {expiresAt.toLocaleString()}
                    </p>
                    <div className="flex flex-col lg:flex-row w-full lg:w-auto items-center space-y-2 lg:space-y-2 lg:space-x-4 mt-2">
                      <Button
                        color="red"
                        className="cursor-pointer w-full lg:w-auto"
                        onClick={() => handleRejectOffer(offer)}
                      >
                        Reject Offer
                      </Button>
                      <Button
                        color="dark/white"
                        className="cursor-pointer w-full lg:w-auto"
                        onClick={() => handleAcceptOffer(offer)}
                      >
                        Accept Offer
                      </Button>
                    </div>
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
