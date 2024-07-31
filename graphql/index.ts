import { GRAPHQL } from '@/utils/constants'
import { ApolloClient, InMemoryCache } from '@apollo/client'

export default new ApolloClient({
  uri: GRAPHQL,
  cache: new InMemoryCache(),
  connectToDevTools: true,
})
