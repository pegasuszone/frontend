import { gql } from '@/__generated__/gql'

const GET_NAME = gql(/* GraphQL */ `
  query Name($name: String!) {
    name(name: $name) {
      associatedAddr
    }
  }
`)

export default GET_NAME
