import { gql } from '@/__generated__/gql'

const GET_TOKEN = gql(/* GraphQL */ `
  query Token($collectionAddr: String!, $tokenId: String!) {
    token(collectionAddr: $collectionAddr, tokenId: $tokenId) {
      id
      tokenId
      name
      owner {
        address
      }
      collection {
        name
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
    }
  }
`)

export default GET_TOKEN
