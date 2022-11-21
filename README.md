# Remix Edu Stack

![The Remix Blues Stack](https://repository-images.githubusercontent.com/461012689/37d5bd8b-fa9c-4ab0-893c-f0a199d5012d)

Learn more about [Remix Stacks](https://remix.run/stacks).

```
npx create-remix@latest --template chanzuckerberg/edu-stack
```

## Table of contents

- [What's in the stack](#what-s-in-the-stack)
- [Requirements](#requirements)
- [Development](#development)
- [Managing the database](#managing-the-database)

## What's in the stack

- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Email/Password Authentication with [cookie-based sessions](https://remix.run/docs/en/v1/api/remix#createcookiesessionstorage)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Requirements

- [Docker](https://www.docker.com/) (see [Getting started on Docker Desktop](https://czi.atlassian.net/wiki/x/FgAzk))
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
  cp .env.example .env && sed -i '' -e "s/postgres:postgres@/$USER:postgres@/g" .env
  ```

  > **Note:** This uses `sed` to add your host system's username to the DB url, to work around https://github.com/prisma/prisma/issues/13384 on MacOS systems.

- Start the Postgres Database in [Docker](https://www.docker.com/get-started):

  ```sh
  npm run docker
  ```

  > **Note:** Ensure that Docker has finished and your container is running before proceeding.

- Initial database setup:

  ```sh
  npm run setup
  ```

- Run the build, which generates the Node server + some other files:

  ```sh
  npm run build
  ````

- Start dev server:

  ```sh
  npm start
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get started:

- Email: `rachel@remix.run`
- Password: `racheliscool`

## Managing the database

Ccreating, seeding, migrating, etc., is similar Rails.

Use the Prisma CLI commands at https://www.prisma.io/docs/reference/api-reference/command-reference.

For example, some common operations are:

| Goal | Command(s) |
| ---- | ---------- |
| Apply pending migrations | `npx prisma migrate dev` |
| Add a new model | Modify prisma/schema.prisma and run `npx prisma migrate dev` |
| Explore the db | `npx prisma studio` |
| Make the db reflect your current schema | `npx prisma db push` |
