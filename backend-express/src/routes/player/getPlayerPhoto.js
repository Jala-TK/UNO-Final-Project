import { findExistPlayerByUsername } from '../../services/playerService.js';
import { validateParams } from '../../utils/validation.js';

export const getPlayerPhoto = async (req, res, next) => {
  try {
    const { username } = req.body;
    validateParams({ username }, res);

    const player = await findExistPlayerByUsername(username);
    if (!player || player?.auditExcluded) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.status(200).json(player.photo);
  } catch (error) {
    next(error);
  }
};
