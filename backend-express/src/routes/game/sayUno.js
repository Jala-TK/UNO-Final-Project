import { getPlayerHand } from '../../services/playerService.js';
import { validateParams } from '../../utils/validation.js';
import { findGameById } from '../../services/gameService.js';
import { updatePlayerUNO } from '../../services/gamePlayerService.js';
import { addActionToHistory } from '../../services/historyService.js';
import { io } from '../../../../server.js';

export const sayUNO = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    validateParams({ game_id }, res);

    const user = req.user;
    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const playerHand = await getPlayerHand(game_id, user);

    if (playerHand.length !== 1) {
      return res
        .status(400)
        .json({ message: 'Player must have only one card to say UNO.' });
    }

    await updatePlayerUNO(game_id, user.id, true);

    await addActionToHistory(
      game_id,
      `Played said UNO successfully`,
      user.username,
    );

    io.emit('update', {
      type: 'sayUno',
      updateGame: game.id,
      updatedHand: 'update',
      player: user.username,
    });

    res
      .status(200)
      .json({ message: `${user.username} said UNO successfully.` });
  } catch (error) {
    next(error);
  }
};
