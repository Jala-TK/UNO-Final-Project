import { findGameById, isCurrentPlayer } from '../../services/gameService.js';
import { setNextPlayer } from '../../services/dealerService.js';
import { validateParams } from '../../utils/validation.js';
import { addActionToHistory } from '../../services/historyService.js';

export const skipSelfPlayer = async (req, res, next) => {
  try {
    const { game_id } = req.body;

    validateParams({ game_id }, res);

    const user = req.user;
    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (!isCurrentPlayer(game, user.id)) {
      return res
        .status(400)
        .json({ message: 'It is not the players turn yet' });
    }

    await setNextPlayer(game_id, 1, res);
    await addActionToHistory(game_id, `Skipped turn`, user.username);

    res.status(200).json({
      message: `${user.username} skip your turn`,
    });
  } catch (error) {
    next(error);
  }
};
