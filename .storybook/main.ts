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
    /**
     * Ignore node dependencies, they seem to be comming from `@remix-run/node`. Maybe
     * there's a way to change the webpack config.
     */
    if (!theirConfig.resolve) {
      theirConfig.resolve = {};
    }
    theirConfig.resolve['fallback'] = {
      ...theirConfig.resolve['fallback'],
      os: false,
      fs: false,
      stream: false,
    };

    /**
     * Kept in sync with `paths` from tsconfig.json and resolves import statements.
     */
    theirConfig.resolve['alias'] = {
      ...theirConfig.resolve['alias'],
      '~': path.resolve(__dirname, '../app'),
      mocks: path.resolve(__dirname, '../mocks'),
    };

    /**
     * replace `.server` files with empty files so environment variables like
     * `SESSION_SECRET` don't have to be loaded when running `npm run storybook`.
     */
    theirConfig.module!.rules!.push({
      test: /\.server/,
      use: 'null-loader',
    });

    return theirConfig;
  },
};

export default config;
