import { EventModel } from './event.model';
import logger from '../utils/logger';
import { runInNewContext } from 'vm';

exports.findAll = async (req, res) => {
  try {
    logger.info('getting all events');
    res.json(await EventModel.find({}).exec());
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

exports.myEvents = async (req, res) => {
  try {
    if (req.reqUser.type === 'band') {
      res.json(
        await EventModel.find(
          { requests: { band: { _id: req.reqUser._id } } },
          { requests: { $elemMatch: { band: { _id: req.reqUser._id } } } }
        ).exec()
      );
    } else {
      res.json(
        await EventModel.find({ 'business._id': req.reqUser._id }).exec()
      );
    }
  } catch {
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
    await EventModel.findByIdAndUpdate(
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
    await EventModel.findByIdAndRemove(req.params.id, (err) => {
      if (err) throw err;
      return res.sendStatus(200);
    });
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};
