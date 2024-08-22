import jwt from 'jsonwebtoken';
import Player from '../models/player.js';
import { hashPassword } from '../utils/passwordUtils.js';
import 'dotenv/config';
const { sign } = jwt;

export const authenticateLogin = async (username, password) => {
  if (!username || !password) {
    throw new Error('Invalid credentials or User not found');
  }

  const player = await Player.findOne({ where: { username: username, auditExcluded: false } });

  if (!player) {
    throw new Error('Invalid credentials or User not found');
  }

  const hashedPassword = hashPassword(password);

  const serverPasswordNotHashed = player.password;
  const serverPasswordHashed = player.password.toLowerCase();

  if (
    serverPasswordHashed === hashedPassword ||
    serverPasswordNotHashed === hashedPassword ||
    serverPasswordHashed === password ||
    serverPasswordNotHashed === password
  ) {
    return player;
  } else {
    throw new Error('Invalid credentials');
  }
};

export const generateToken = (player) => {
  const salt = process.env.JWT_SALT;
  const access_token = sign(
    {
      id: player.id,
      username: player.username,
      email: player.email,
    },
    salt,
    { expiresIn: '7d' },
  );

  return access_token;
};
