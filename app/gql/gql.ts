/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n      query GetNoteListItems($userId: String!) {\n        notes(userId: $userId) {\n          id\n          title\n          body\n        }\n      }\n    ": types.GetNoteListItemsDocument,
    "\n      query GetNote($id: String!) {\n        note(id: $id) {\n          id\n          title\n          body\n        }\n      }\n    ": types.GetNoteDocument,
    "\n      mutation DeleteNote($id: String!) {\n        deleteNote(id: $id) {\n          id\n        }\n      }\n    ": types.DeleteNoteDocument,
    "\n      mutation CreateNote($title: String!, $body: String!, $userId: String!) {\n        createNote(title: $title, body: $body, userId: $userId) {\n          id\n        }\n      }\n    ": types.CreateNoteDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query GetNoteListItems($userId: String!) {\n        notes(userId: $userId) {\n          id\n          title\n          body\n        }\n      }\n    "): (typeof documents)["\n      query GetNoteListItems($userId: String!) {\n        notes(userId: $userId) {\n          id\n          title\n          body\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query GetNote($id: String!) {\n        note(id: $id) {\n          id\n          title\n          body\n        }\n      }\n    "): (typeof documents)["\n      query GetNote($id: String!) {\n        note(id: $id) {\n          id\n          title\n          body\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation DeleteNote($id: String!) {\n        deleteNote(id: $id) {\n          id\n        }\n      }\n    "): (typeof documents)["\n      mutation DeleteNote($id: String!) {\n        deleteNote(id: $id) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation CreateNote($title: String!, $body: String!, $userId: String!) {\n        createNote(title: $title, body: $body, userId: $userId) {\n          id\n        }\n      }\n    "): (typeof documents)["\n      mutation CreateNote($title: String!, $body: String!, $userId: String!) {\n        createNote(title: $title, body: $body, userId: $userId) {\n          id\n        }\n      }\n    "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;