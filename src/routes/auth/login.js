import jwt from "jsonwebtoken";
import { createHash } from "crypto";
import "dotenv/config";
import Player from "../../models/player.js";

const { sign } = jwt;

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
    next(error);
  }
};
