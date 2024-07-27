import jwt from "jsonwebtoken";
import { createHash } from "crypto";
const { sign } = jwt;
import "dotenv/config";
import Player from "../models/player.js";
import VerifyToken from "../utils/verifyToken.js";
import BlacklistToken from "../models/blacklistToken.js";

export const login = async (req, res, next) => {
  const username = req?.body?.username;
  const password = req?.body?.password;

  if (!username || !password) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  try {
    const player = await Player.findOne({
      where: { username: username },
    });

    if (!player) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const salt = process.env.JWT_SALT;

    const hashedPassword = createHash("sha256")
      .update(password)
      .digest("hex")
      .toLowerCase();
    const serverPasswordNotHashed = player.password;
    const serverPasswordHashed = player.password.toLowerCase();

    if (
      serverPasswordHashed === hashedPassword ||
      serverPasswordNotHashed === hashedPassword ||
      serverPasswordHashed === password ||
      serverPasswordNotHashed === password
    ) {
      const access_token = sign(
        {
          id: player.id,
          username: player.username,
          email: player.email,
        },
        salt,
        {
          expiresIn: "7d",
        }
      );

      return res.status(200).json({
        access_token,
      });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    next(err);
  }
};


export const logout = async (req, res, next) => {
  const { access_token } = req.body;

  if (!access_token)
    return res.status(400).json({ error: "Access token not provided" });

  try {
    await VerifyToken(access_token);

    const existingToken = await BlacklistToken.findOne({ where: { token: access_token } });
    if (existingToken) {
      return res.status(200).json({ message: "User already logged out" });
    }

    await BlacklistToken.create({ token: access_token });

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const getPerfil = async (req, res, next) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(404).json({ error: "Invalid credentials" });
  }

  const responsePerfil = await VerifyToken(access_token).catch((error) => {
    next(error);
  });

  if (responsePerfil?.username && responsePerfil?.email) {
    res.status(200).json({
      username: responsePerfil.username,
      email: responsePerfil.email,
    });
  }
};
