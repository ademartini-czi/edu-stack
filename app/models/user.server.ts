import bcrypt from 'bcryptjs';

export type User = {id: string; email: string; password: string};

const users: Record<string, User> = {
  666: {
    id: '666',
    email: 'anakin@cats.com',
    password: bcrypt.hashSync('ilovetreats', 10),
  },
};

export async function getUserById(id: User['id']) {
  const user = users[id];

  if (user) {
    return Promise.resolve(user);
  }

  return Promise.reject();
}

export async function getUserByEmail(email: User['email']) {
  const user = Object.values(users).find((user) => user.email === email);

  if (user) {
    return Promise.resolve(user);
  }

  return Promise.reject();
}

export async function createUser(email: User['email'], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const ids = Object.keys(users).map(Number);
  const maxId = Math.max(...ids);
  const nextId = String(maxId + 1);

  const user: User = {
    id: nextId,
    email,
    password: hashedPassword,
  };

  users[nextId] = user;

  return Promise.resolve(user);
}

export async function deleteUserByEmail(email: User['email']) {
  const user = await getUserByEmail(email);

  if (user) {
    delete users[user.id];
    return Promise.resolve();
  }

  return Promise.reject();
}

export async function verifyLogin(
  email: User['email'],
  password: User['password'],
) {
  const user = await getUserByEmail(email);

  if (!user || !user.password) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return null;
  }

  const {password: _password, ...userWithoutPassword} = user;

  return userWithoutPassword;
}
