import Player from '../../models/player.js';
import VerifyToken from '../../utils/verifyToken.js';
import { Op } from 'sequelize';

export const updatePlayer = async (req, res, next) => {
  try {
    const id = req.params.id;
    const player = await Player.findByPk(id);
    if (!player || player?.auditExcluded) {
      return res.status(404).json({ message: 'Player not found' });
    }
    const { username, email, password, access_token } = req.body;

    if (!username || !email || !password || !access_token) {
      return res.status(400).json({ error: 'Invalid params' });
    }

    const user = await VerifyToken(access_token);
    if (user?.id != id) {
      return res.status(401).json({ error: 'Unauthorized update this user' });
    }

    const existingPlayer = await Player.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }],
      },
    });
    if (existingPlayer && existingPlayer?.id !== user.id) {
      return res
        .status(400)
        .json({ message: 'There is already a player with this data' });
    }

    await player.update({ username, email, password });
    res.status(200).json({ message: 'User updated sucessfully' });
  } catch (error) {
    next(error);
  }
};
