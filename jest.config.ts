import type {JestConfigWithTsJest} from 'ts-jest';

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

const config: JestConfigWithTsJest = {
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/app/$1',
    'tests/(.*)': '<rootDir>/tests/$1',
  },
  resetMocks: true,
  roots: ['<rootDir>/app'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/tests/setup-test-env.ts'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    // Ensure we get CJS builds of packages with conditional exports, not ESM or browser builds.
    // Overrides jest-environment-jsdom's default value of 'browser' (see https://github.com/facebook/jest/blob/836157f4807893bb23a4758a60998fbd61cb184c/packages/jest-environment-jsdom/src/index.ts#L40).
    // Without this, we get the browser builds of the @remix-run/web-* packages, which don't work
    // since our tests run in Node.
    customExportConditions: ['require'],
  },
  watchPathIgnorePatterns: ['.*\\/node_modules\\/.*', '.*\\/build\\/.*'],
};

export default config;
