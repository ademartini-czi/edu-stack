import {graphql} from 'msw';
import {users} from './users';
import type {
  Note,
  CreateNoteMutationVariables,
  GetNoteQueryVariables,
  GetNoteListItemsQueryVariables,
  DeleteNoteMutationVariables,
} from '~/gql/graphql';

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
    user: users['666'],
  },
  2: {
    id: '2',
    title: "Prosecco's note",
    body: 'Feed me!',
    user: users['666'],
  },
};

type GetNoteQuery = {
  note: Note;
};

type GetNoteListItemsQuery = {
  notes: Note[];
};

type CreateNoteQuery = {
  createNote: Note;
};

type DeleteNoteQuery = {
  deleteNote: Note;
};

export default [
  // Get one
  graphql.query<GetNoteQuery, GetNoteQueryVariables>(
    'GetNote',
    (req, res, ctx) => {
      const note = notes[req.variables.id];

      if (note) {
        return res(ctx.data({note}));
      }

      return res(ctx.status(404));
    },
  ),
  // Get all
  graphql.query<GetNoteListItemsQuery, GetNoteListItemsQueryVariables>(
    'GetNoteListItems',
    (req, res, ctx) => {
      const userId = req.variables.userId;
      const userNotes = Object.values(notes).filter(
        (note) => note.user.id === userId,
      );

      return res(ctx.data({notes: userNotes}));
    },
  ),
  // Create
  graphql.mutation<CreateNoteQuery, CreateNoteMutationVariables>(
    'CreateNote',
    (req, res, ctx) => {
      const ids = Object.keys(notes).map(Number);
      const maxId = ids.length > 0 ? Math.max(...ids) : 0;
      const nextId = String(maxId + 1);

      const note: Note = {
        id: nextId,
        title: req.variables.title,
        body: req.variables.body,
        user: users[req.variables.userId],
      };

      notes[nextId] = note;

      return res(ctx.data({createNote: note}));
    },
  ),
  // Delete
  graphql.mutation<DeleteNoteQuery, DeleteNoteMutationVariables>(
    'DeleteNote',
    (req, res, ctx) => {
      const noteId = req.variables.id;
      const note = notes[noteId];

      if (notes[noteId]) {
        delete notes[noteId];
        return res(ctx.data({deleteNote: note}));
      }

      return res(ctx.status(404));
    },
  ),
];
