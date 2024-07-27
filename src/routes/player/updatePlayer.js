import Player from '../../models/player.js';

export const updatePlayer = async (req, res, next) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player || player?.auditExcluded) {
      return res.status(404).json({ message: 'Player not found' });
    }
    const { username, email, password } = req.body;
    await player.update({ username, email, password });
    res.status(200).json(player);
  } catch (error) {
    next(error);
  }
};
