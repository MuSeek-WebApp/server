import * as admin from 'firebase-admin';
import logger from '../utils/logger';

class BandSrv {
  async all() {
    return admin
      .database()
      .ref('users')
      .orderByChild('band')
      .equalTo(true)
      .once('value', (bands) => {
        logger.debug(`[bands.srv] [all] ${JSON.stringify(bands)}`);
        return bands;
      });
  }
}

export default new BandSrv();
