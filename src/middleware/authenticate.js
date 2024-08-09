import VerifyToken from '../utils/verifyToken.js';

export const authMiddleware = async (req, res, next) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  try {
    const user = await VerifyToken(access_token);
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
