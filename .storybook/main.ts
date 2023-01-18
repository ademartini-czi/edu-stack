import path from 'node:path';
import type {StorybookConfig} from '@storybook/react-webpack5';

const config: StorybookConfig = {
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  stories: ['../app'],
  webpackFinal: (theirConfig) => {
    theirConfig.resolve = {
      ...theirConfig.resolve,

      alias: {
        ...theirConfig.resolve?.alias,
        // Custom path aliases. Keep this in sync with `paths` in the tsconfig.json.
        '~': path.resolve(__dirname, '../app'),
        tests: path.resolve(__dirname, '../tests'),
      },
    };

    theirConfig.module = {
      ...theirConfig.module,

      rules: [
        ...(theirConfig.module?.rules || []),
        // Replace @remix-run/node with an empty file, so that its node dependencies aren't loaded.
        // It should never be used by browser code.
        {
          test: require.resolve('@remix-run/node'),
          use: 'null-loader',
        },
        // Replace `.server.ts` files with an empty file. Remix will never send these to the
        // browser.
        {
          test: /\.server/,
          use: 'null-loader',
        }
      ],
    };

    return theirConfig;
  },
};

export default config;
