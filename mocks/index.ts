import {setupServer} from 'msw/node';
import notesHandlers from './notes';

const server = setupServer(...notesHandlers);

server.listen({onUnhandledRequest: 'bypass'});
console.info('🔶 Mock server running');

process.once('SIGINT', () => server.close());
process.once('SIGTERM', () => server.close());
