import {rest, type DefaultBodyType} from 'msw';
import type {Note} from '~/models/note.server';

/*
  Mock API endpoint for the example app to talk to.
  - Once you have your own services to send requests to, you don't need this anymore and can delete.
  - Don't add too much logic here. No need to duplicate an entire server.
*/

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

type GetNoteParams = {
  noteId: string;
};

type GetNotesParams = {
  userId: string;
};

type CreateNoteBody = {
  body: string;
  title: string;
};

export default [
  // Get one
  rest.get<DefaultBodyType, GetNoteParams, DefaultBodyType>(
    'https://example.com/notes/:noteId',
    (req, res, ctx) => {
      const note = notes[req.params.noteId];

      if (note) {
        return res(ctx.json(note));
      }

      return res(ctx.status(404));
    },
  ),
  // Get all
  rest.get<DefaultBodyType, GetNotesParams, DefaultBodyType>(
    'https://example.com/users/:userId/notes',
    (req, res, ctx) => {
      const userId = req.params.userId;
      const userNotes = Object.values(notes).filter(
        (note) => note.userId === userId,
      );

      return res(ctx.json(userNotes));
    },
  ),
  // Create
  rest.post<CreateNoteBody, GetNotesParams, DefaultBodyType>(
    'https://example.com/users/:userId/notes',
    async (req, res, ctx) => {
      const ids = Object.keys(notes).map(Number);
      const maxId = ids.length > 0 ? Math.max(...ids) : 0;
      const nextId = String(maxId + 1);

      const requestBody = await req.json();

      const note: Note = {
        id: nextId,
        title: requestBody.title,
        body: requestBody.body,
        userId: req.params.userId,
      };

      notes[nextId] = note;

      return res(ctx.json(note));
    },
  ),
  // Delete
  rest.delete<DefaultBodyType, GetNoteParams, DefaultBodyType>(
    'https://example.com/notes/:noteId',
    (req, res, ctx) => {
      const noteId = req.params.noteId;

      if (notes[noteId]) {
        delete notes[noteId];
        return res(ctx.status(200));
      }

      return res(ctx.status(404));
    },
  ),
];
