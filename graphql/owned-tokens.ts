import { gql } from '@/__generated__/gql'

const GET_OWNED_TOKENS = gql(/* GraphQL */ `
  query OwnedTokens(
    $owner: String
    $seller: String
    $limit: Int
    $offset: Int
    $filterByCollectionAddrs: [String!]
    $filterForSale: SaleType
    $sortBy: TokenSort
  ) {
    tokens(
      ownerAddrOrName: $owner
      sellerAddrOrName: $seller
      limit: $limit
      offset: $offset
      filterForSale: $filterForSale
      filterByCollectionAddrs: $filterByCollectionAddrs
      sortBy: $sortBy
    ) {
      tokens {
        id
        tokenId
        name
        rarityOrder
        rarityScore
        mintedAt
        saleType
        id
        owner {
          address
          __typename
        }
        listPrice {
          amount
          denom
          symbol
          __typename
        }
        listedAt
        expiresAtDateTime
        highestOffer {
          id
          offerPrice {
            amount
            amountUsd
            denom
            symbol
            __typename
          }
          __typename
        }
        __typename
        media {
          type
          url
          height
          width
          visualAssets {
            lg {
              type
              url
              height
              width
              staticUrl
              __typename
            }
            __typename
          }
          __typename
        }
        collection {
          contractAddress
          contractUri
          name
          isExplicit
          floorPrice
          media {
            type
            url
            height
            width
            visualAssets {
              lg {
                type
                url
                height
                width
                staticUrl
                __typename
              }
              __typename
            }
            __typename
          }
          tokenCounts {
            active
            total
            __typename
          }
          mintStatus
          __typename
        }
        __typename
      }
      pageInfo {
        total
        limit
        offset
        __typename
      }
      __typename
    }
  }
`)

export default GET_OWNED_TOKENS
