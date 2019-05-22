import { wsServer } from '../server.ws.route';
import logger from '../utils/logger';

exports.broadcastRefreshEvents = async () => {
  const wsClients = wsServer.getWss('/ws/event').clients;
  logger.info(`Broadcast updating events to ${wsClients.size} clients`);
  wsClients.forEach((client) => {
    client.send('UPDATE_EVENTS');
  });
};
