import {
  findGameById,
  deleteGame as deleteGameService,
} from '../../services/gameService.js';

export const deleteGame = async (req, res, next) => {
  try {
    const game = await findGameById(req.params.id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.creatorId !== req.user.id) {
      return res
        .status(401)
        .json({ error: 'Only the creator can delete the game' });
    }

    await deleteGameService(game);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
