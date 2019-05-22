import express from 'express';
import expressWs from 'express-ws';

const wsServer = expressWs(express());
const router = express.Router(); // eslint-disable-line new-cap

// eslint-disable-next-line no-unused-vars
router.ws('/event', (ws, req) => {
  // TODO: here will come all the client->server methods - on message, on connected, on close, etc (if needed);
});

export { wsServer, router as wsRouter };
