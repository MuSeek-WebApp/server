import logger from '../utils/logger';
import BandSrv from './band.srv';

exports.all = async (req, res) => {
  try {
    const bands = await BandSrv.all();
    logger.debug(`[band.controller] [all] bands=${JSON.stringify(bands)}`);
    res.json(bands);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

exports.findBands = async (req, res) => {
  try {
    let bands;
    const { name } = req.query;
    let { genres } = req.query;
    if (name) {
      bands = await BandSrv.findByName(name);
    } else {
      if (typeof genres === 'string' || genres instanceof String) {
        genres = [genres];
      }
      bands = await BandSrv.findByAttributes(genres);
    }
    logger.debug(
      `[band.controller] [filter] name=${name} genres=${genres} 
      bands=${JSON.stringify(bands)}`
    );
    res.json(bands);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};
