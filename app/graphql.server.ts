import {GraphQLClient} from 'graphql-request';
import invariant from 'tiny-invariant';

export {graphql as gql} from '~/gql';

invariant(process.env.GRAPHQL_URL, 'GRAPHQL_URL must be set');

export const graphql = new GraphQLClient(process.env.GRAPHQL_URL);
