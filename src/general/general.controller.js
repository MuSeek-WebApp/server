import logger from '../utils/logger';
import EventService from '../event/event.srv';
import UserService from '../user/user.srv';

exports.searchItem = async (req, res) => {
  try {
    const searchedText = req.params.text;
    const result = {
      searchedBands: await UserService.getUsersByNameAndType(
        searchedText,
        'band'
      ),
      searchedBusinesses: await UserService.getUsersByNameAndType(
        searchedText,
        'business'
      ),
      searchedEvents: await EventService.getEventsByName(searchedText)
    };

    res.json(result);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};
