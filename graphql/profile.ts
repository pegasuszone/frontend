import { gql } from '../__generated__/gql'

const GET_PROFILE = gql(/* GraphQL */ `
  query ProfileWallet($address: String!) {
    wallet(address: $address) {
      address
      name {
        name
        associatedAddr
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
              __typename
            }
            __typename
          }
          __typename
        }
        records {
          name
          value
          verified
          __typename
        }
        __typename
      }
      stats {
        address
      }
      __typename
    }
  }
`)

export default GET_PROFILE
