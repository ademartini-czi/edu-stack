import bcrypt from 'bcryptjs';
import {rest, type DefaultBodyType} from 'msw';
import type {User} from '~/models/user.server';

/*
  Mock API endpoint for the example app to talk to.
  - Once you have your own services to send requests to, you don't need this anymore and can delete.
  - Don't add too much logic here. No need to duplicate an entire server.
*/

const users: Record<string, User> = {
  666: {
    id: '666',
    email: 'jane@example.com',
    password: bcrypt.hashSync('password', 10),
  },
};

type GetUserParams = {
  id: string;
};

type CreateUserBody = {
  email: string;
  hashedPassword: string;
};

export default [
  // Get by id
  rest.get<DefaultBodyType, GetUserParams, DefaultBodyType>(
    'https://example.com/users/:id',
    (req, res, ctx) => {
      const user = users[req.params.id];

      if (user) {
        return res(ctx.json(user));
      }

      return res(ctx.status(404));
    },
  ),
  // Get by email
  rest.get<DefaultBodyType, GetUserParams, DefaultBodyType>(
    'https://example.com/users/email/:id',
    (req, res, ctx) => {
      const email = req.params.id;
      const user = Object.values(users).find((user) => user.email === email);

      if (user) {
        return res(ctx.json(user));
      }

      return res(ctx.status(404));
    },
  ),
  // Create user
  rest.post<CreateUserBody>(
    'https://example.com/users',
    async (req, res, ctx) => {
      const ids = Object.keys(users).map(Number);
      const maxId = ids.length > 0 ? Math.max(...ids) : 0;
      const nextId = String(maxId + 1);

      const requestBody = await req.json();

      const user: User = {
        id: nextId,
        email: requestBody.email,
        password: requestBody.hashedPassword,
      };

      users[nextId] = user;

      return res(ctx.json(user));
    },
  ),
];
