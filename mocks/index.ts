import {setupServer} from 'msw/node';
import notesHandlers from './notes';
import usersHandlers from './users';

const server = setupServer(...notesHandlers, ...usersHandlers);

server.listen({onUnhandledRequest: 'bypass'});
console.info('🔶 Mock server running');

process.once('SIGINT', () => server.close());
process.once('SIGTERM', () => server.close());
