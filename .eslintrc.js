/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  env: {
    node: true,
    es6: true,
  },
  plugins: ['@chanzuckerberg/eslint-plugin-edu-react', 'prettier'],
  extends: [
    '@chanzuckerberg/eslint-config-edu-js',
    '@chanzuckerberg/eslint-config-edu-ts',
    'plugin:@chanzuckerberg/eslint-plugin-edu-react/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['storybook-static/', 'build/', 'app/gql/'],
  overrides: [
    {
      files: ['**/routes/**/*.{js,jsx,ts,tsx}'],
      rules: {
        // Routes may use default exports without a name. At the route level
        // identifying components for debugging purposes is less of an issue, as
        // the route boundary is more easily identifiable.
        'react/display-name': 'off',
      },
    },
    {
      files: ['app/**/*.{spec,test}.{js,jsx,ts,tsx}'],
      extends: ['@remix-run/eslint-config/jest-testing-library'],
    },
  ],
};
