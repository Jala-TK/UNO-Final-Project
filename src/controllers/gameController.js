import Game from '../models/game.js';
import GamePlayer from '../models/gamePlayer.js';
import Player from '../models/player.js';
import VerifyToken from '../utils/verifyToken.js';

export const createGame = async (req, res, next) => {
  try {
    let { title, maxPlayers } = req.body;
    const { name } = req.body;
    if (name != null) title = name;
    const newGame = await Game.create({ title, status: 'In progress', maxPlayers, auditExcluded: false });
    res.status(201).json({ message: 'Game created successfully', game_id: newGame.id });
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

export const joinGame = async (req, res, next) => {
  try {
    const { game_id, access_token } = req.body;
    if (!game_id || !access_token) return res.status(400).json({ message: 'Invalid params' });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) return res.status(404).json({ message: 'Game not found' });

    const user = VerifyToken(access_token);

    const playerInGame = await GamePlayer.findOne({ where: { gameId: game_id, playerId: user.id, } });
    if (playerInGame) return res.status(400).json({ error: 'User is already in the game' });

    await GamePlayer.create({ gameId: game_id, playerId: user.id })
    return res.status(200).json({ message: 'User joined the game successfully' });
  } catch (err) {
    if (err.statusCode = 401) return res.status(401).json({ error: 'Token is not valid' });
    next(err);
  }
};

