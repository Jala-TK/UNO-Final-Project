import Game from '../../models/game.js';
import VerifyToken from '../../utils/verifyToken.js';

export const updateGame = async (req, res, next) => {
  try {
    let { title, status, maxPlayers } = req.body;

    const { name, access_token } = req.body;
    if (name != null) title = name;

    if (!title || !access_token || !maxPlayers || !status)
      return res.status(400).json({ message: 'Invalid params' });

    const game = await Game.findByPk(req.params.id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }
    const user = await VerifyToken(access_token);

    if (game.creatorId !== user.id) {
      return res
        .status(403)
        .json({ error: 'Only the creator can edit the game' });
    }
    await game.update({ title, status, maxPlayers });
    res.status(200).json(game);
  } catch (error) {
    next(error);
  }
};
