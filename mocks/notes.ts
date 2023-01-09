import {graphql} from 'msw';
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefaultQuery = Record<string, any>;

type GetNoteQuery = {
  note: {
    id: string;
    userId: string;
    title: string;
    body: string;
  };
};

type GetNoteVariables = {
  id: string;
};

type GetNoteListItemsQuery = {
  notes: {
    id: string;
    userId: string;
    title: string;
    body: string;
  }[];
};

type GetNoteListItemsVariables = {
  userId: string;
};

type CreateNoteVariables = {
  body: string;
  title: string;
  userId: string;
};

export default [
  // Get one
  graphql.query<GetNoteQuery, GetNoteVariables>('GetNote', (req, res, ctx) => {
    const note = notes[req.variables.id];

    if (note) {
      return res(ctx.data({note}));
    }

    return res(ctx.status(404));
  }),
  // Get all
  graphql.query<GetNoteListItemsQuery, GetNoteListItemsVariables>(
    'GetNoteListItems',
    (req, res, ctx) => {
      const userId = req.variables.userId;
      const userNotes = Object.values(notes).filter(
        (note) => note.userId === userId,
      );

      return res(ctx.data({notes: userNotes}));
    },
  ),
  // Create
  graphql.mutation<GetNoteQuery, CreateNoteVariables>(
    'CreateNote',
    (req, res, ctx) => {
      const ids = Object.keys(notes).map(Number);
      const maxId = ids.length > 0 ? Math.max(...ids) : 0;
      const nextId = String(maxId + 1);

      const note: Note = {
        id: nextId,
        title: req.variables.title,
        body: req.variables.body,
        userId: req.variables.userId,
      };

      notes[nextId] = note;

      return res(ctx.data({note}));
    },
  ),
  // Delete
  graphql.mutation<DefaultQuery, GetNoteVariables>(
    'DeleteNote',
    (req, res, ctx) => {
      const noteId = req.variables.id;

      if (notes[noteId]) {
        delete notes[noteId];
        return res(ctx.data({}));
      }

      return res(ctx.status(404));
    },
  ),
];
