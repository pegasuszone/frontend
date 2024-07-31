import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: './graphql-schema.json',
  documents: ['graphql/*.{graphql,gql,ts,tsx}'],
  generates: {
    './__generated__/': {
      preset: 'client',
      plugins: ['typescript-react-apollo'],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
}

export default config
