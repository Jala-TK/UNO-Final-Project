import Player from '../models/player.js';

export const createPlayer = async (req, res, next) => {
  try {
    const { name, age, email } = req.body;
    const newPlayer = await Player.create({ name, age, email });
    res.status(201).json(newPlayer);
  } catch (error) {
    next(error);
  }
};

export const getPlayer = async (req, res, next) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player || player?.auditExcluded) {
      return res.status(404).json({ message: 'Player not found' });
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
      return res.status(404).json({ message: 'Player not found' });
    }
    const { name, age, email } = req.body;
    await player.update({ name, age, email });
    res.status(200).json(player);
  } catch (error) {
    next(error);
  }
};

export const deletePlayer = async (req, res, next) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player || player?.auditExcluded) {
      return res.status(404).json({ message: 'Player not found' });
    }
    await player.update({ auditExcluded: true });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
