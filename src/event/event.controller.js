import logger from '../utils/logger';
import EventService from './event.srv';
import { readdirSync } from 'fs';
import { BandModel } from '../band/band.model';
import { BusinessModel } from '../business/businessModel';

exports.findAll = async (req, res) => {
  try {
    res.json(EventService.all());
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

exports.bandFeed = async (req, res) => {
  try {
    logger.info(
      'User ' +
        req.reqUser._id +
        ' requested filtered events with this filter: ' +
        JSON.stringify(req.body, null, 2)
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

exports.insertEvent = async (req, res) => {
  try {
    const newEvent = await EventService.insert(req.body, req.reqUser);
    res.json(newEvent);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await EventService.update(req.body);
    res.json(updatedEvent);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

exports.removeEvent = async (req, res) => {
  try {
    await EventService.remove(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

exports.registerBand = async (req, res) => {
  const { event, band } = req.body;
  const { reqUser } = req;

  if (reqUser instanceof BandModel) {
    try {
      await EventService.addRequest(
        event._id,
        reqUser,
        'WAITING_FOR_BUSINESS_APPROVAL'
      );
      res.sendStatus(200);
    } catch (error) {
      logger.error(error);
      res.sendStatus(500);
    }
  } else if (reqUser._id == event.business._id) {
    try {
      res.json(
        await EventService.addRequest(
          event._id,
          band,
          'WAITING_FOR_BAND_APPROVAL'
        )
      );
    } catch (error) {
      logger.error(error);
      res.sendStatus(500);
    }
  } else {
    res.send(
      400,
      'User has not been recognized as a band or as the event owner'
    );
  }
};

exports.approveBand = async (req, res) => {
  const { reqUser } = req;
  const { event, bandId } = req.body;

  if (reqUser instanceof BandModel) {
    try {
      await EventService.updateRequeset(
        event._id,
        reqUser._id,
        'WAITING_FOR_BAND_APPROVAL',
        'WAITING_FOR_BUISNESS_APPROVAL'
      );
      res.sendStatus(200);
    } catch (error) {
      logger.error(error);
      res.sendStatus(500);
    }
  } else if (reqUser._id == event.business._id) {
    try {
      res.json(
        await EventService.updateRequeset(
          event._id,
          bandId,
          'WAITING_FOR_BUISNESS_APPROVAL',
          'APPROVED'
        )
      );
    } catch (error) {
      logger.error(error);
      res.sendStatus(500);
    }
  } else {
    res.send(
      400,
      'User has not been recognized as a band or as the event owner'
    );
  }
};

exports.denyBand = async (req, res) => {
  const { reqUser } = req;
  const { event, bandId } = req.body;

  if (reqUser instanceof BandModel) {
    try {
      await EventService.updateRequeset(event._id, reqUser._id, 'DENIED');
      res.sendStatus(200);
    } catch (error) {
      logger.error(error);
      res.sendStatus(500);
    }
  } else if (reqUser._id == event.business._id) {
    try {
      res.json(await EventService.updateRequeset(event._id, bandId, 'DENIED'));
    } catch (error) {
      logger.error(error);
      res.sendStatus(500);
    }
  } else {
    res.send(
      400,
      'User has not been recognized as a band or as the event owner'
    );
  }
};
