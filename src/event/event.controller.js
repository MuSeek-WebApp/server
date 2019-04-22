import { EventModel } from './event.model';

import logger from '../utils/logger';

exports.findAll = async (req, res) => {
  try {
    logger.info('getting all events');
    res.json(await EventModel.find({}).exec());
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

exports.findById = (req, res) => {
  // TODO: call SRV
  res.sendStatus(200);
};

exports.insertEvent = async (req, res) => {
  try {
    const newEvent = new EventModel(req.body);
    res.json(await newEvent.save());
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

exports.updateEvent = async (req, res) => {
  try {
    await eventModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (err, event) => {
        if (err) throw err;
        return res.json(event);
      }
    );
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

exports.removeEvent = async (req, res) => {
  try {
    await eventModel.findByIdAndRemove(req.params.id, (err, event) => {
      if (err) throw err;
      return res.sendStatus(200);
    });
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};
