import admin from 'firebase-admin';
import logger from '../utils/logger';

class AuthSrv {
  constructor() {
    logger.info('AuthService initiated.');
  }

  async auth(token) {
    try {
      await admin.auth().verifyIdToken(token);
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  async login(token) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      logger.info(`User logged in with token=(${decodedToken})`);
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  async register(auth, userData) {
    try {
      const userRecord = await admin.auth().createUser({
        email: auth.email,
        password: auth.password
      });

      logger.info(`new user created (${userRecord.uid})`);
      const db = admin.database();
      const ref = db.ref(`users/${userRecord.uid}`);
      await ref.set(userData);
      logger.info(
        'data for new user successfully written to firebase database'
      );
      return userData;
    } catch (error) {
      return null;
    }
  }
}

export default new AuthSrv();
