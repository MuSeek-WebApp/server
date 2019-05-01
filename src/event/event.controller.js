import logger from '../utils/logger';
import EventService from './event.srv';

exports.findAll = async (req, res) => {
  try {
    res.json(EventService.all());
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
