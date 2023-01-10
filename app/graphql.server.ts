import {GraphQLClient} from 'graphql-request';

export {graphql as gql} from '~/gql';

export const graphql = new GraphQLClient('https://example.com');
