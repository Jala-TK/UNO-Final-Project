import { getPlayerHand as getPlayerHandService } from '../../services/playerService.js';

export const getPlayerHand = async (req, res, next) => {
  const { game_id } = req.body;

  try {
    const hand = await getPlayerHandService(game_id, req.user);

    const response = {
      player: req.user.username,
      hand: hand.map((entry) => `${entry.color} ${entry.value}`),
    };

    res.status(200).json(response);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      next(error);
    }
  }
};
