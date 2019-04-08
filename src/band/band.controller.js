import logger from '../utils/logger';
import BandSrv from './band.srv';

exports.all = async (req, res) => {
  try {
    logger.debug('[band.controller] [all]');
    res.json(await BandSrv.all());
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};
