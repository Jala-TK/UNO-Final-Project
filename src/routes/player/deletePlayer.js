import Player from '../../models/player.js';

export const deletePlayer = async (req, res, next) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player || player?.auditExcluded) {
      return res.status(404).json({ message: 'Player not found' });
    }
    await player.update({ auditExcluded: true });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
