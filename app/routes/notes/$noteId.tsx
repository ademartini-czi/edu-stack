import type {ActionArgs, LoaderArgs} from '@remix-run/node';
import {json, redirect} from '@remix-run/node';
import {Form, useCatch, useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {graphql, gql} from '~/graphql.server';
import {requireUserId} from '~/session.server';

export async function loader({request, params}: LoaderArgs) {
  await requireUserId(request);
  invariant(params.noteId, 'noteId not found');

  const {note} = await graphql.request(
    gql(`
      query GetNote($id: String!) {
        note(id: $id) {
          id
          title
          body
        }
      }
    `),
    {id: params.noteId},
  );

  if (!note) {
    throw new Response('Not Found', {status: 404});
  }

  return json({note});
}

export async function action({request, params}: ActionArgs) {
  await requireUserId(request);
  invariant(params.noteId, 'noteId not found');

  await graphql.request(
    gql(`
      mutation DeleteNote($id: String!) {
        deleteNote(id: $id) {
          id
        }
      }
    `),
    {id: params.noteId},
  );

  return redirect('/notes');
}

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.note.title}</h3>
      <p className="py-6">{data.note.body}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          className="rounded bg-blue-700  py-2 px-4 text-white hover:bg-blue-800 focus:bg-blue-400"
          type="submit"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({error}: {error: Error}) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
