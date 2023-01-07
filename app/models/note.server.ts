import type {User} from './user.server';

export type Note = {
  id: string;
  userId: User['id'];
  title: string;
  body: string;
};

const notes: Record<string, Note> = {
  1: {
    id: '1',
    title: "Anakin's note",
    body: 'Treats are the best',
    userId: '666',
  },
  2: {
    id: '2',
    title: "Prosecco's note",
    body: 'Feed me!',
    userId: '666',
  },
};

export function getNote({
  id,
  userId,
}: Pick<Note, 'id'> & {
  userId: User['id'];
}) {
  const note = notes[id];

  if (note && note.userId === userId) {
    return Promise.resolve(note);
  }

  return Promise.reject();
}

export function getNoteListItems({userId}: {userId: User['id']}) {
  return Promise.resolve(
    Object.values(notes).filter((note) => note.userId === userId),
  );
}

export function createNote({
  body,
  title,
  userId,
}: Pick<Note, 'body' | 'title'> & {
  userId: User['id'];
}) {
  const ids = Object.keys(notes).map(Number);
  const maxId = Math.max(...ids);
  const nextId = String(maxId + 1);

  const note: Note = {
    id: nextId,
    title,
    body,
    userId,
  };

  notes[nextId] = note;

  return Promise.resolve(note);
}

export function deleteNote({
  id,
  userId,
}: Pick<Note, 'id'> & {userId: User['id']}) {
  if (notes[id]?.userId === userId) {
    delete notes[id];
    return Promise.resolve();
  }

  return Promise.reject();
}
