import type {User} from './user.server';

export type Note = {
  id: string;
  userId: User['id'];
  title: string;
  body: string;
};

export async function createNote({
  body,
  title,
  userId,
}: Pick<Note, 'body' | 'title'> & {
  userId: User['id'];
}) {
  const response = await fetch(`https://example.com/users/${userId}/notes`, {
    method: 'POST',
    body: JSON.stringify({body, title, userId}),
  });

  const data = (await response.json()) as Note;

  return data;
}
