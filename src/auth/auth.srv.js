import admin from 'firebase-admin';
import logger from '../utils/logger';
import { BandModel } from '../band/band.model';
import { BusinessModel } from '../business/businessModel';
import { UserModel } from './user.model';

class AuthSrv {
  constructor() {
    logger.info('AuthService initiated.');
  }

  async auth(token) {
    try {
      return admin.auth().verifyIdToken(token);
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  async login(token) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      logger.info(
        `User logged in with token=(${JSON.stringify(decodedToken)})`
      );
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
  async getUserData(token) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return await UserModel.findById(decodedToken.uid).exec();
    } catch (error) {
      logger.error(error);
    }
  }
  /**
   * @param userData._id
   * @param userData.type.band
   */
  async register(auth, userData) {
    try {
      const userRecord = await admin.auth().createUser({
        email: auth.email,
        password: auth.password
      });

      logger.info(`new user created (${userRecord.uid})`);
      userData._id = userRecord.uid;

      let userObj;
      const isBand = !!userData.type.band;
      delete userData.type;
      if (isBand) {
        userObj = new BandModel(userData);
      } else {
        userObj = new BusinessModel(userData);
      }
      logger.info(JSON.stringify(userData));
      await userObj.save();
      logger.info('data for new user successfully written to mongo database');
      return userData;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }
}

export default new AuthSrv();
