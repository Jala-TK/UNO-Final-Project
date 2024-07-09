import Game from '../models/game.js';

export const createGame = async (req, res, next) => {
  try {
    const { title, status, maxPlayers } = req.body;
    const newGame = await Game.create({ title, status, maxPlayers, auditExcluded: false });
    res.status(201).json(newGame);
  } catch (error) {
    next(error);
  }
};

export const getGame = async (req, res, next) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.status(200).json(game);
  } catch (error) {
    next(error);
  }
};

export const updateGame = async (req, res, next) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }
    const { title, status, maxPlayers } = req.body;
    await game.update({ title, status, maxPlayers });
    res.status(200).json(game);
  } catch (error) {
    next(error);
  }
};

export const deleteGame = async (req, res, next) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }
    await game.update({ auditExcluded: true });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
