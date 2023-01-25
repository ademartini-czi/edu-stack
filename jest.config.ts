/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/app/$1',
    'tests/(.*)': '<rootDir>/tests/$1',
  },
  resetMocks: true,
  roots: ['<rootDir>/app'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/tests/setup-test-env.ts'],
  testEnvironment: '@happy-dom/jest-environment',
  watchPathIgnorePatterns: ['.*\\/node_modules\\/.*', '.*\\/build\\/.*'],
};
