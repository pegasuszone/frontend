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
            }
          }
        }
        records {
          name
          value
          verified
        }
      }
      stats {
        address
      }
    }
  }
`)

export default GET_PROFILE
