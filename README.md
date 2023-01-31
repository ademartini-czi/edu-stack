# Remix Edu Stack

![The Remix Blues Stack](https://repository-images.githubusercontent.com/461012689/37d5bd8b-fa9c-4ab0-893c-f0a199d5012d)

Learn more about about using Remix at CZI's Education initiative at [Intro to Remix](https://czi.atlassian.net/wiki/x/EYCOnQ).

Create a new Remix app from this template by running:

```
npx create-remix@latest --template chanzuckerberg/edu-stack
```

## Table of contents

- [What's in the stack](#what-s-in-the-stack)
- [Requirements](#requirements)
- [Development](#development)

## What's in the stack

- [GitHub Actions](https://github.com/features/actions) for CI
- Code formatting with [Prettier](https://prettier.io)
- Component explorer with [Storybook](https://storybook.js.org/)
- Email/Password Authentication with [cookie-based sessions](https://remix.run/docs/en/v1/api/remix#createcookiesessionstorage)
- Linting with [ESLint](https://eslint.org)
- Local third party request mocking with [MSW](https://mswjs.io)
- Query external services with [GraphQL](https://graphql.org/)
- Static Types with [TypeScript](https://typescriptlang.org)
- Styling with [Tailwind](https://tailwindcss.com/)
- Unit testing with [Jest](https://jestjs.io/) and [Testing Library](https://testing-library.com)

## Requirements

- [nodenv](https://github.com/nodenv/nodenv)

## Development

- Install the required Node version

  ```sh
  nodenv install
  ```

- Install dependencies

  ```sh
  npm install
  ```

- Create `.env` file for local development

  ```sh
  cp .env.example .env && sed -i '' -e "s/super-duper-s3cret/$(openssl rand -base64 16)/g" .env
  ```

  *Note: this uses `sed` and `openssl` to generate a unique secret token for development. Doing so doesn't really matter, but it's nice to validate that the app works with different tokens.*

- Run the build, which generates the Node server + some other files:

  ```sh
  npm run build
  ```

- If you ever change the GraphQL schema or queries, generate new types with

  ```sh
  npm run codegen
  ```

- Start dev server:

  ```sh
  npm start
  ```

This starts your app in development mode, rebuilding assets on file changes.

By default there is a new user with some data you can use to get started:

- Email: jane@example.com
- Password: password
