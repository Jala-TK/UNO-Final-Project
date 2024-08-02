import { getPlayerHandsService } from '../../services/playerHandService.js';

export const getPlayerHands = async (req, res, next) => {
  const { game_id } = req.body;

  try {
    const response = await getPlayerHandsService(game_id);
    res.status(200).json(response);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      next(error);
    }
  }
};
