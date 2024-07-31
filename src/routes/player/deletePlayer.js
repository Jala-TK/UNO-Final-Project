import Player from '../../models/player.js';
import VerifyToken from '../../utils/verifyToken.js';

export const deletePlayer = async (req, res, next) => {
  try {
    const id = req.params.id;
    const player = await Player.findByPk(id);

    if (!player || player?.auditExcluded) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const { access_token } = req.body;
    if (!access_token) {
      return res.status(400).json({ error: 'Invalid params' });
    }

    const user = await VerifyToken(access_token);
    if (user?.id != id) {
      return res.status(401).json({ error: 'Unauthorized delete this user' });
    }

    await player.update({ auditExcluded: true });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
