import logger from '../utils/logger';
import EventService from './event.srv';
import { BandModel } from '../band/band.model';
import RecommendationService from '../recommendation/recommendation.srv';
import BandSrv from '../band/band.srv';

exports.findAll = async (req, res) => {
  try {
    res.json(EventService.all());
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

exports.findById = async (req, res) => {
  try {
    res.json(await EventService.findById(req.params.id));
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

exports.getReviews = async (req, res) => {
  try {
    res.json(await EventService.getReviews(req.params.id));
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

exports.bandFeed = async (req, res) => {
  try {
    logger.info(
      `User ${
        req.reqUser._id
      } requested filtered events with this filter: ${JSON.stringify(
        req.body,
        null,
        2
      )}`
    );

    res.json(await EventService.getFilteredEvents(req.body, req.reqUser._id));
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

exports.myEvents = async (req, res) => {
  try {
    if (req.reqUser.type === 'band') {
      res.json(await EventService.getArtistEvents(req.reqUser._id));
    } else {
      res.json(await EventService.getBusinessEvents(req.reqUser._id));
    }
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

exports.insertEvent = async (req, res, next) => {
  try {
    const newEvent = await EventService.insert(req.body, req.reqUser);
    res.json(newEvent);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }

  next();
};

exports.updateEvent = async (req, res, next) => {
  try {
    const updatedEvent = await EventService.update(req.body);
    res.json(updatedEvent);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }

  next();
};

exports.removeEvent = async (req, res, next) => {
  try {
    await EventService.remove(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }

  next();
};

exports.registerBand = async (req, res, next) => {
  const { event, band } = req.body;
  const { reqUser } = req;
  let status;
  let registeredBand;

  if (reqUser instanceof BandModel) {
    status = 'WAITING_FOR_BUSINESS_APPROVAL';
    registeredBand = reqUser;
  } else if (reqUser._id === event.business._id) {
    status = 'WAITING_FOR_BAND_APPROVAL';
    registeredBand = band;
  } else {
    res.send(
      400,
      'User has not been recognized as a band or as the event owner'
    );
  }

  try {
    await EventService.addRequest(event._id, registeredBand, status);
    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }

  next();
};

exports.approveBand = async (req, res, next) => {
  const { reqUser } = req;
  const { event, bandId } = req.body;
  let status;
  let oldStatus;
  let approvedBandId;

  if (reqUser instanceof BandModel) {
    approvedBandId = reqUser._id;
    status = 'WAITING_FOR_BUSINESS_APPROVAL';
    oldStatus = 'WAITING_FOR_BAND_APPROVAL';
  } else if (reqUser._id === event.business._id) {
    status = 'APPROVED';
    oldStatus = 'WAITING_FOR_BUSINESS_APPROVAL';
    approvedBandId = bandId;
  } else {
    res.send(
      400,
      'User has not been recognized as a band or as the event owner'
    );
  }

  try {
    await EventService.updateRequest(
      event._id,
      approvedBandId,
      status,
      oldStatus
    );
    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }

  next();
};

exports.denyBand = async (req, res, next) => {
  const { reqUser } = req;
  const { event, bandId } = req.body;
  let deniedBandId;

  if (reqUser instanceof BandModel) {
    deniedBandId = reqUser._id;
  } else if (reqUser._id === event.business._id) {
    deniedBandId = bandId;
  } else {
    res.send(
      400,
      'User has not been recognized as a band or as the event owner'
    );
  }

  try {
    await EventService.updateRequest(event._id, deniedBandId, 'DENIED');
    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }

  next();
};

exports.uploadImage = async (req, res) => {
  try {
    const { files } = req;
    const result = await EventService.uploadImage(files[0]);
    res.json(result);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

exports.recommendBands = async (req, res) => {
  RecommendationService.getRecommendation(req.body.bands).then(
    (recommendedBands) => {
      const bandIds = Object.keys(recommendedBands);

      BandSrv.findByIds(bandIds)
        .then((bands) => {
          bands.forEach((band, idx) => {
            bands[idx].shows_in_similar_events = recommendedBands[band._id];
          });

          bands.sort((a, b) => {
            return b.shows_in_similar_events - a.shows_in_similar_events;
          });

          res.json(bands);
        })
        .catch((err) => {
          logger.error(err);
        });
    }
  );
};
