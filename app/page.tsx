'use client'

import { Collection } from '@/__generated__/graphql'
import NFT from '@/components/app/NFT'
import Profile from '@/components/app/Profile'
import Spinner from '@/components/app/Spinner'
import WalletModal from '@/components/app/WalletModal'
import { Button } from '@/components/catalyst/button'
import { Divider } from '@/components/catalyst/divider'
import { Heading } from '@/components/catalyst/heading'
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from '@/components/catalyst/pagination'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/catalyst/table'
import { Text } from '@/components/catalyst/text'
import { useTrade } from '@/contexts/trade'
import GET_OWNED_TOKENS from '@/graphql/owned-tokens'
import GET_PROFILE from '@/graphql/profile'
import { CHAIN_ID } from '@/utils/constants'
import { demod, formatCurrency, mod } from '@/utils/format'
import { useQuery } from '@apollo/client'
import clsx from 'clsx'
import { useAccount, useConnect, useSuggestChainAndConnect } from 'graz'
import { stargaze, stargazetestnet } from 'graz/chains'
import isMobile from 'is-mobile'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

export default function Home() {
  const { data: account, isConnected } = useAccount()
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const { connect } = useConnect()
  const router = useRouter()
  const { suggestAndConnect } = useSuggestChainAndConnect()

  const { data: profile } = useQuery(GET_PROFILE, {
    variables: { address: account?.bech32Address || '' },
  })

  const [tokenPage, setTokenPage] = useState<number>(1)
  const tokenOffset = useMemo(() => {
    return (tokenPage - 1) * 7
  }, [tokenPage])

  const { loading: isLoadingAllTokens, data: allTokens } = useQuery(
    GET_OWNED_TOKENS,
    {
      variables: { owner: account?.bech32Address || '', limit: 10000 },
    }
  )

  const { loading: isLoadingTokens, data: tokens } = useQuery(
    GET_OWNED_TOKENS,
    {
      variables: {
        owner: account?.bech32Address || '',
        limit: 7,
        offset: tokenOffset,
      },
    }
  )

  const collections: Collection[] = useMemo(() => {
    if (!allTokens) return []
    const rawCollections = allTokens.tokens?.tokens.map((token) => {
      return token.collection
    })
    if (!rawCollections) return []

    const reducedCollections = rawCollections.reduce<Collection[]>(
      (accumulator, current) => {
        if (
          !accumulator.some(
            (item) => item.contractAddress === current.contractAddress
          )
        ) {
          accumulator.push(current)
        }
        return accumulator
      },
      []
    )

    return reducedCollections
  }, [allTokens])

  const selectedCollections = useMemo(
    () => new Map<string, undefined>(),
    [account]
  )
  const [
    selectedCollectionsRefreshCounter,
    setSelectedCollectionsRefreshCounter,
  ] = useState<number>(0)
  const refreshSelectedCollections = useCallback(
    () =>
      setSelectedCollectionsRefreshCounter(
        selectedCollectionsRefreshCounter + 1
      ),
    [selectedCollectionsRefreshCounter, setSelectedCollectionsRefreshCounter]
  )

  const toggleCollection = (collectionAddress: string) => {
    setTokenPage(1)
    switch (selectedCollections.has(collectionAddress)) {
      case true:
        selectedCollections.delete(collectionAddress)
        break
      case false:
        selectedCollections.set(collectionAddress, undefined)
        break
    }
    refreshSelectedCollections()
  }

  const { loading: isLoadingTokensByCollection, data: tokensByCollection } =
    useQuery(GET_OWNED_TOKENS, {
      variables: {
        owner: account?.bech32Address || '',
        limit: 7,
        offset: tokenOffset,
        filterByCollectionAddrs: collections
          .filter((collection) =>
            selectedCollections.has(collection.contractAddress)
          )
          .map((collection) => collection.contractAddress),
      },
    })

  const filteredTokens = useMemo(
    () => (selectedCollections.size > 0 ? tokensByCollection : tokens),
    [selectedCollections, tokensByCollection, tokens]
  )

  const isLoadingFilteredTokens = useMemo(
    () =>
      selectedCollections.size > 0
        ? isLoadingTokensByCollection
        : isLoadingTokens,
    [selectedCollections, isLoadingTokensByCollection, isLoadingTokens]
  )

  const { selectedUserTokens: selectedTokens, toggleUserToken: toggleToken } =
    useTrade()

  return isConnected && !!profile ? (
    <main className="w-screen !mx-0 !max-w-full">
      <Profile profile={profile} />
      <Divider className="mt-8" />
      <div className="grid grid-cols-4">
        <div className="pr-8 pt-4 min-h-52 border-r border-zinc-950/10 dark:border-white/10">
          <Heading level={2}>Collections</Heading>
          {isLoadingAllTokens ? (
            <div className="flex col-span-2 justify-center items-center w-full h-full">
              <Spinner />
            </div>
          ) : (
            <div className="flex flex-col py-2 !space-y-1">
              {collections.map((collection) => (
                <button
                  onClick={() => toggleCollection(collection.contractAddress)}
                  key={collection.contractAddress}
                  className={clsx(
                    selectedCollections.has(collection.contractAddress)
                      ? '!bg-zinc-950/25 dark:!bg-white/25'
                      : 'hover:!bg-zinc-950/10 dark:hover:!bg-white/10',
                    'flex items-center !cursor-pointer gap-4 p-3 rounded-md'
                  )}
                >
                  <img
                    src={collection.media?.visualAssets?.lg?.staticUrl || ''}
                    alt={collection.name || ''}
                    className="w-12 h-12 aspect-square rounded-md"
                  />
                  <div className="flex flex-col">
                    <Text className="font-medium text-left !text-black dark:!text-white">
                      {collection.name}
                    </Text>
                    <Text className="text-black/50 dark:text-white/50 text-left">
                      {formatCurrency(collection.floorPrice, 'STARS')}
                    </Text>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {isLoadingFilteredTokens ? (
          <div className="flex col-span-2 justify-center items-center w-full h-full">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col col-span-2 space-y-2 border-r border-zinc-950/10 dark:border-white/10">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader className="text-black dark:text-white !pl-4">
                    {filteredTokens?.tokens?.tokens.length}{' '}
                    {(filteredTokens?.tokens?.tokens.length || 0) > 1
                      ? 'Tokens'
                      : 'Token'}
                  </TableHeader>
                  <TableHeader>Collection</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTokens?.tokens?.tokens.map((token) => (
                  <NFT
                    key={`${token.collection.contractAddress}-${token.tokenId}`}
                    token={token}
                    onClick={() =>
                      toggleToken(
                        token.collection.contractAddress,
                        token.tokenId,
                        token.media?.visualAssets?.lg?.staticUrl || ''
                      )
                    }
                    selected={selectedTokens.has(
                      mod(token.collection.contractAddress, token.tokenId)
                    )}
                  />
                ))}
              </TableBody>
            </Table>
            <Pagination className="mt-6 pb-3 px-3">
              <PaginationPrevious
                disabled={tokenPage <= 1}
                onClick={() => setTokenPage(tokenPage - 1)}
              />
              <PaginationList>
                {tokenPage > 1 && (
                  <PaginationPage onClick={() => setTokenPage(tokenPage - 1)}>
                    {tokenPage - 1}
                  </PaginationPage>
                )}
                <PaginationPage current>{tokenPage}</PaginationPage>
                {(filteredTokens?.tokens?.pageInfo?.total || 0) >
                  tokenPage * 7 && (
                  <PaginationPage onClick={() => setTokenPage(tokenPage + 1)}>
                    {tokenPage + 1}
                  </PaginationPage>
                )}
              </PaginationList>
              <PaginationNext
                disabled={
                  (filteredTokens?.tokens?.pageInfo?.total || 0) < tokenPage * 7
                }
                onClick={() => setTokenPage(tokenPage + 1)}
              />
            </Pagination>
          </div>
        )}
        <div className="pl-4 pt-4">
          <Heading level={2}>Selected</Heading>
          <div className="grid grid-cols-2 gap-4 grid-flow-row mt-4">
            {Array.from(selectedTokens.entries()).map(([tokenMod, image]) => {
              const { collectionAddress, tokenId } = demod(tokenMod)
              return (
                <button
                  onClick={() => toggleToken(collectionAddress, tokenId, image)}
                  key={tokenMod}
                  className="transform hover:scale-110 duration-150 ease-in-out transition"
                >
                  <img
                    src={image}
                    alt={tokenMod}
                    className="w-full h-full aspect-square rounded-md"
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <Divider />
      <div className="flex flex-row justify-between mt-4">
        <div></div>
        <Button
          onClick={() => router.push('/trade')}
          color="dark/white"
          className="cursor-pointer"
        >
          Create Trade
        </Button>
      </div>
    </main>
  ) : (
    <div className="border-zinc-950/10 dark:border-white/10 border rounded-md p-4 lg:py-4 lg:px-8 flex space-y-4 lg:space-y-0 flex-col lg:flex-row justify-between items-center">
      <div>
        <Heading>Connect a wallet to get started</Heading>
        <Text>Pegasus requires a connected wallet to trade NFTs.</Text>
      </div>
      <>
        <Button
          color="white"
          className="!cursor-pointer !w-full lg:!w-auto"
          onClick={() => setIsWalletModalOpen(true)}
        >
          Connect wallet
        </Button>
        <WalletModal
          isOpen={isWalletModalOpen}
          setIsOpen={setIsWalletModalOpen}
          callback={(walletType) => {
            if (isMobile()) {
              connect({ chainId: CHAIN_ID, walletType })
            } else {
              suggestAndConnect({
                chainInfo:
                  CHAIN_ID === 'stargaze-1' ? stargaze : stargazetestnet,
                walletType,
              })
            }
            setIsWalletModalOpen(false)
          }}
        />
      </>
    </div>
  )
}
