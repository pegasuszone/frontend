import { gql } from '@/__generated__/gql'

const GET_OWNED_TOKENS = gql(/* GraphQL */ `
  query OwnedTokens(
    $owner: String
    $limit: Int
    $offset: Int
    $filterByCollectionAddrs: [String!]
  ) {
    tokens(
      ownerAddrOrName: $owner
      limit: $limit
      offset: $offset
      filterByCollectionAddrs: $filterByCollectionAddrs
    ) {
      tokens {
        id
        tokenId
        name
        owner {
          address
        }
        media {
          type
          height
          width
          visualAssets {
            lg {
              type
              url
              height
              width
              staticUrl
            }
          }
        }
        collection {
          contractAddress
          contractUri
          name
          floorPrice
          media {
            type
            height
            width
            visualAssets {
              lg {
                type
                url
                height
                width
                staticUrl
              }
            }
          }
          tokenCounts {
            active
            total
          }
          mintStatus
        }
      }
      pageInfo {
        total
        limit
        offset
      }
    }
  }
`)

export default GET_OWNED_TOKENS
