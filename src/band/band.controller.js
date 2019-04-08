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

exports.filter = async (req, res) => {
  try {
    const { genre, city } = req.query;
    logger.debug(`[band.controller] [filter] genre=${genre} city=${city}`);
    res.json(BandSrv.filter(await BandSrv.all(), genre, city));
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};
