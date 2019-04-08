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

  filter(bands, genre, city) {
    const result = {};
    for (const [id, band] of Object.entries(bands.val())) {
      const { genres, address } = band;
      if (
        genre in genres &&
        city.toLowerCase() === address.city.toLowerCase()
      ) {
        result[id] = band;
      }
    }
    logger.debug(`[bands.srv] [byGenre] ${JSON.stringify(result)}`);
    return result;
  }
}

export default new BandSrv();
