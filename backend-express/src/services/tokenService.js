import BlacklistToken from '../models/blacklistToken.js';
import VerifyToken from '../utils/verifyToken.js';

export const validateToken = async (access_token) => {
  if (!access_token) {
    const error = new Error('Access token not provided');
    error.statusCode = 400;
    throw error;
  }

  await VerifyToken(access_token);
};

export const isTokenBlacklisted = async (access_token) => {
  const existingToken = await BlacklistToken.findOne({
    where: { token: access_token },
  });
  return !!existingToken;
};

export const blacklistToken = async (access_token) => {
  await BlacklistToken.create({ token: access_token });
};
