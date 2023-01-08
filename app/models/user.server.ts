import bcrypt from 'bcryptjs';

export type User = {id: string; email: string; password: string};

export async function getUserById(id: User['id']) {
  const response = await fetch(`https://example.com/users/${id}`);

  if (response.status === 200) {
    const data = (await response.json()) as User;
    return data;
  }

  return null;
}

export async function getUserByEmail(email: User['email']) {
  const response = await fetch(`https://example.com/users/email/${email}`);

  if (response.status === 200) {
    const data = (await response.json()) as User;
    return data;
  }

  return null;
}

export async function createUser(email: User['email'], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const response = await fetch('https://example.com/users', {
    method: 'POST',
    body: JSON.stringify({email, hashedPassword}),
  });

  const data = (await response.json()) as User;
  return data;
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
