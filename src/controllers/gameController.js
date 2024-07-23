import Game from '../models/game.js';
import GamePlayer from '../models/gamePlayer.js';
import Player from '../models/player.js';
import VerifyToken from '../utils/verifyToken.js';
import { Op } from 'sequelize';

export const createGame = async (req, res, next) => {
  try {
    let { title, maxPlayers } = req.body;
    const { name, access_token } = req.body;
    if (name != null) title = name;

    if (!title || !access_token || !maxPlayers) return res.status(400).json({ message: 'Invalid params' });
    const user = VerifyToken(access_token);

    const newGame = await Game.create({ title, status: 'Waiting for players', maxPlayers, creatorId: user.id, auditExcluded: false });
    await GamePlayer.create({ gameId: newGame.id, playerId: user.id, status: false })

    res.status(201).json({ message: 'Game created successfully', game_id: newGame.id });
  } catch (error) {
    next(error);
  }
};

export const getGame = async (req, res, next) => {
  try {
    const game_id = req.params.id;
    if (!game_id) return res.status(400).json({ message: 'Invalid params' });

    const game = await Game.findByPk(game_id);
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
    const { title, status, maxPlayers } = req.body;
    const { name, access_token } = req.body;
    if (name != null) title = name;

    const game = await Game.findByPk(req.params.id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }
    const user = VerifyToken(access_token);

    if (game.creatorId !== user.id) {
      return res.status(403).json({ error: 'Only the creator can edit the game' });
    }
    await game.update({ title, status, maxPlayers });
    res.status(200).json(game);
  } catch (error) {
    next(error);
  }
};

export const deleteGame = async (req, res, next) => {
  try {
    const { access_token } = req.body;

    const game = await Game.findByPk(req.params.id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }
    const user = VerifyToken(access_token);

    if (game.creatorId !== user.id) {
      return res.status(403).json({ error: 'Only the creator can edit the game' });
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

    const playerInGame = await GamePlayer.findOne({ where: { gameId: game_id, playerId: user.id } });
    if (playerInGame) return res.status(400).json({ error: 'User is already in the game' });

    await GamePlayer.create({ gameId: game_id, playerId: user.id, status: false })

    return res.status(200).json({ message: 'User joined the game successfully' });
  } catch (err) {
    if (err.statusCode = 401) return res.status(401).json({ error: 'Token is not valid' });
    next(err);
  }
};


export const getReady = async (req, res, next) => {
  try {
    const { game_id, access_token } = req.body;
    if (!game_id || !access_token) return res.status(400).json({ message: 'Invalid params' });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) return res.status(404).json({ message: 'Game not found' });

    const user = VerifyToken(access_token);

    const playerInGame = await GamePlayer.findOne({ where: { gameId: game_id, playerId: user.id } });
    if (!playerInGame) return res.status(400).json({ error: 'The player is not in this game' });

    if(playerInGame.status == true) return res.status(400).json({ error: 'The player was ready' });
    playerInGame.status = true;
    await playerInGame.save();

    return res.status(200).json({ message: 'The player is ready' });
  } catch (err) {
    if (err.statusCode = 401) return res.status(401).json({ error: 'Token is not valid' });
    next(err);
  }
};


export const startGame = async (req, res, next) => {
  try {
    const { game_id, access_token } = req.body;
    if (!game_id || !access_token) return res.status(400).json({ message: 'Invalid params' });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) return res.status(404).json({ message: 'Game not found' });

    const user = VerifyToken(access_token);

    if (game.creatorId !== user.id) {
      return res.status(403).json({ error: 'Only the creator can start the game' });
    }

    const players = await GamePlayer.findAll({where: { gameId: game_id }});
    const allReady = players.every(player => player.status === true);
    if (!allReady) return res.status(400).json({ message: 'Some players are not ready' });
    if (game.status == 'In progress') return res.status(400).json({ message: 'The game has already started' });
    game.status = 'In progress';
    game.currentPlayer = user.id;
    await game.save();

    return res.status(200).json({ message: 'Game started successfully' });
  } catch (err) {
    if (err.statusCode = 401) return res.status(401).json({ error: 'Token is not valid' });
    next(err);
  }
};

export const leaveGame = async (req, res, next) => {
  try {
    const { game_id, access_token } = req.body;
    if (!game_id || !access_token) return res.status(400).json({ message: 'Invalid params' });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) return res.status(404).json({ message: 'Game not found' });

    const user = VerifyToken(access_token);

    const gamePlayer = await GamePlayer.findOne({ where: { gameId: game_id, playerId: user.id } });
    if (!gamePlayer) {
      return res.status(404).json({ error: 'Player not found in this game' });
    }

    if (game.creatorId === user.id) {
      const otherPlayers = await GamePlayer.findAll({ where: { gameId: game_id, playerId: {
        [Op.not]: user.id
      } }});

      if (otherPlayers.length > 0) {
        game.creatorId = otherPlayers[0].dataValues.playerId;
        await game.save();
        await gamePlayer.destroy();
        return res.json({ message: 'Player removed from game and creator transferred successfully' });
      } else {
        await GamePlayer.destroy({ where: { gameId: game_id } });
        await game.update({ auditExcluded: true });
        return res.json({ message: 'Game and all players removed successfully' });
      }
    } else {
      await gamePlayer.destroy();
      return res.status(200).json({ message: 'User left the game successfully' });
    }

  } catch (err) {
    if (err.statusCode = 401) return res.status(401).json({ error: 'Token is not valid' });
    next(err);
  }
};

export const endGame = async (req, res, next) => {
  try {
    const { game_id, access_token } = req.body;
    if (!game_id || !access_token) return res.status(400).json({ message: 'Invalid params' });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) return res.status(404).json({ message: 'Game not found' });

    const user = VerifyToken(access_token);

    if (game.creatorId !== user.id) {
      return res.status(403).json({ error: 'Only the creator can end the game' });
    }

    if (game.status == 'In progress') {
      game.status = 'Ended';
      await game.save();
      return res.status(200).json({ message: 'Game ended successfully' });
    }else{
      return res.status(400).json({ error: 'The game is not running' });
    }

  } catch (err) {
    if (err.statusCode = 401) return res.status(401).json({ error: 'Token is not valid' });
    next(err);
  }
};

export const getStatusGame = async (req, res, next) => {
  try {
    const { game_id } = req.body;

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }
    const response = {game_id: game.id, state: game.status};
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getPlayersInGame = async (req, res, next) => {
  try {
    const { game_id } = req.body;

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }
    const players = await GamePlayer.findAll({ where: { gameId: game_id }});
    console.log(players)
    const userIds = players.map(player => player.dataValues.playerId);
    const users = await Player.findAll({
      where: {
        id: userIds
      }
    });
    const usernames = users.map(user => user.username);

    const response = {game_id: game.id, players: usernames};
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getCurrentPlayer = async (req, res, next) => {
  try {
    const { game_id } = req.body;

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: 'Game not found' });
    }
    const currentPlayer = game.currentPlayer;
    if(!currentPlayer) return res.status(400).json({ message: 'Start the game first' });
    const player = await Player.findOne({
      where: {
        id: currentPlayer
      }
    });
    
    // Setando proximo jogador
    const playersInGame = await GamePlayer.findAll({
      where: {
        gameId: game_id
      },
      order: [['createdAt', 'ASC']]
    });

    let nextPlayerIndex = playersInGame.findIndex(player => player.id === currentPlayer) + 1;
    if (nextPlayerIndex >= playersInGame.length) {
      nextPlayerIndex = 0;
    }
    game.currentPlayerId = playersInGame[nextPlayerIndex];
    await game.save();

    
    const response = {game_id: game.id, current_player: player.username};
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};