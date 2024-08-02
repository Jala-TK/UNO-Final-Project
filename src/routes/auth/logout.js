import VerifyToken from '../../utils/verifyToken.js';
import BlacklistToken from '../../models/blacklistToken.js';

export const logout = async (req, res, next) => {
  const { access_token } = req.body;

  if (!access_token)
    return res.status(400).json({ error: 'Access token not provided' });

  try {
    await VerifyToken(access_token);

    const existingToken = await BlacklistToken.findOne({
      where: { token: access_token },
    });
    if (existingToken) {
      return res.status(200).json({ message: 'User already logged out' });
    }

    await BlacklistToken.create({ token: access_token });

    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    next(error);
  }
};
