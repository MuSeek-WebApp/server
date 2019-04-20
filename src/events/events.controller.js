import admin from 'firebase-admin';
import { eventModel } from './events.model';

import logger from '../utils/logger';

exports.findAll = async (req, res) => {
  try {
    logger.info('getting all events');
    res.json(await eventModel.find({}).exec());
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
    var newEvent = new eventModel(req.body);
    await newEvent.save();
    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

exports.updateEvent = (req, res) => {
  // TODO: call SRV
  res.sendStatus(200);
};

exports.removeEvent = (req, res) => {
  // TODO: call SRV
  res.sendStatus(200);
};
