import {
  validateToken,
  isTokenBlacklisted,
  blacklistToken,
} from '../../services/tokenService.js';

export const logout = async (req, res, next) => {
  const { access_token } = req.body;

  try {
    await validateToken(access_token);

    if (await isTokenBlacklisted(access_token)) {
      return res.status(200).json({ message: 'User already logged out' });
    }

    await blacklistToken(access_token);

    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    next(error);
  }
};
