/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  env: {
    node: true,
    es6: true,
    'cypress/globals': true,
  },
  // We're using vitest which has a very similar API to jest
  // (so the linting plugins work nicely), but we have to
  // set the jest version explicitly.
  settings: {
    jest: {
      version: 28,
    },
  },
  plugins: ['@chanzuckerberg/eslint-plugin-edu-react', 'cypress', 'prettier'],
  extends: [
    '@chanzuckerberg/eslint-config-edu-js',
    '@chanzuckerberg/eslint-config-edu-ts',
    '@remix-run/eslint-config/jest-testing-library',
    'plugin:@chanzuckerberg/eslint-plugin-edu-react/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['storybook-static/', 'build/'],
  rules: {
    'jsx-a11y/no-autofocus': 'off',
  },
  overrides: [
    {
      files: ['**/routes/**/*.js?(x)', '**/routes/**/*.tsx'],
      rules: {
        // Routes may use default exports without a name. At the route level
        // identifying components for debugging purposes is less of an issue, as
        // the route boundary is more easily identifiable.
        'react/display-name': 'off',
      },
    },
  ],
};
