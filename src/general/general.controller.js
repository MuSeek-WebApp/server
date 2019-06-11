import logger from '../utils/logger';
import EventService from '../event/event.srv';
import UserService from '../user/user.srv';

exports.searchItem = async (req, res) => {
  try {
    const searchedText = req.params.text;
    const result = [
      {
        itemType: 'Bands',
        values: await UserService.getUsersByNameAndType(searchedText, 'band')
      },
      {
        itemType: 'Businesses',
        values: await UserService.getUsersByNameAndType(
          searchedText,
          'business'
        )
      },
      {
        itemType: 'Events',
        values: await EventService.getEventsByName(searchedText)
      }
    ];

    res.json(result);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};
