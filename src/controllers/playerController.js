import { createHash } from "crypto";
import Player from "../models/player.js";

export const createPlayer = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    let user = await Player.findOne({
      where: { username: username },
    });

    if (user) res.status(400).json({ error: "User already exists" });

    const hashedPassword = createHash("sha256")
      .update(password)
      .digest("hex")
      .toLowerCase();

    await Player.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const getPlayer = async (req, res, next) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player || player?.auditExcluded) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.status(200).json(player);
  } catch (error) {
    next(error);
  }
};

export const updatePlayer = async (req, res, next) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player || player?.auditExcluded) {
      return res.status(404).json({ message: "Player not found" });
    }
    const { username, email, password } = req.body;
    await player.update({ username, email, password });
    res.status(200).json(player);
  } catch (error) {
    next(error);
  }
};

export const deletePlayer = async (req, res, next) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player || player?.auditExcluded) {
      return res.status(404).json({ message: "Player not found" });
    }
    await player.update({ auditExcluded: true });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
