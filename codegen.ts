import type {CodegenConfig} from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './app/schema.graphql',
  documents: 'app/**/*.{ts,tsx}',
  generates: {
    './app/gql/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        // Turn off fragment masking, which is used via React hooks. Our queries are made from the
        // server and can't use hooks.
        // https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#fragment-masking
        fragmentMasking: false,
      },
    },
  },
};

export default config;
