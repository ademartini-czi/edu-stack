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

- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Email/Password Authentication with [cookie-based sessions](https://remix.run/docs/en/v1/api/remix#createcookiesessionstorage)
- Styling with [Tailwind](https://tailwindcss.com/)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)
- Query external services with [GraphQL](https://graphql.org/)

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
  cp .env.example .env
  ```

- Run the build, which generates the Node server + some other files:

  ```sh
  npm run build
  ````

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
