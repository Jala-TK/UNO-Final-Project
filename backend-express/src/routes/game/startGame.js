import { validateParams } from '../../utils/validation.js';
import { findGameById, updateGame } from '../../services/gameService.js';
import { verifyPlayersReady } from '../../services/gamePlayerService.js';
import { initializeDeck, setTopCard } from '../../services/dealerService.js';

export const startGame = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    const user = req.user;

    validateParams({ game_id }, res);
    const game = await findGameById(game_id);
    if (!game || game?.auditExcluded)
      return res.status(404).json({ message: 'Game not found' });

    if (game.creatorId !== user.id) {
      return res
        .status(403)
        .json({ error: 'Only the creator can start the game' });
    }

    const players = await verifyPlayersReady(game_id);
    if (players.length <= 1)
      return res.status(400).json({ message: 'Only one player in the room' });
    const allReady = players.every((player) => player.status === true);
    if (!allReady)
      return res.status(400).json({ message: 'Some players are not ready' });

    if (game.status == 'In progress')
      return res.status(400).json({ message: 'The game has already started' });

    await initializeDeck(game_id);
    await setTopCard(game_id);
    await updateGame(game, {
      status: 'In progress',
      currentPlayer: user.id,
    });

    res.status(200).json({ message: 'Game started successfully' });
  } catch (err) {
    next(err);
  }
};
