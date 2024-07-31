import { createHash } from 'crypto';
import Player from '../../models/player.js';
import { Op } from 'sequelize';

export const createPlayer = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: 'Invalid params' });

    let user = await Player.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }],
      },
    });

    if (user) {
      if (user.username === username) {
        return res.status(400).json({ error: 'User already exists' });
      } else if (user.email === email) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    const hashedPassword = createHash('sha256')
      .update(password)
      .digest('hex')
      .toLowerCase();

    await Player.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};
