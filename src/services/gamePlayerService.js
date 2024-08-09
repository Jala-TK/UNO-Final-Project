import GamePlayer from '../models/gamePlayer.js';
import Card from '../models/card.js';
import { Op } from 'sequelize';

export const createGamePlayer = async (gameId, playerId) => {
  const gamePlayer = await GamePlayer.create({
    gameId: gameId,
    playerId: playerId,
  });

  return gamePlayer;
};

export const addPlayerToGame = async (game_id, user_id) => {
  await GamePlayer.create({ gameId: game_id, playerId: user_id });
};

export const findGamePlayer = async (gameId, playerId) => {
  const gamePlayer = await GamePlayer.findOne({
    where: { gameId, playerId },
  });
  return gamePlayer;
};

export const getPlayersInGame = async (game_id) => {
  return await GamePlayer.findAll({
    where: { gameId: game_id, auditExcluded: false },
  });
};

export const getPlayerInGame = async (game_id, player_id) => {
  return await GamePlayer.findOne({
    where: { gameId: game_id, playerId: player_id, auditExcluded: false },
  });
};

export const getTopDiscardedCard = async (game_id) => {
  const topCard = await Card.findOne({
    where: {
      gameId: game_id,
      orderDiscarded: { [Op.ne]: null },
    },
    order: [['orderDiscarded', 'DESC']],
  });

  return topCard;
};

export const updateGamePlayerScore = async (gamePlayer, points) => {
  gamePlayer.score += points;
  await gamePlayer.save();
};

export const updatePlayerStatus = async (playerInGame, status) => {
  playerInGame.status = status;
  await playerInGame.save();
};

export const removeGamePlayers = async (gameId) => {
  await GamePlayer.update({ auditExcluded: true }, { where: { gameId } });
};

export const handleGameCreatorLeaving = async (game, user) => {
  const otherPlayers = await GamePlayer.findAll({
    where: {
      gameId: game.id,
      playerId: { [Op.not]: user.id },
      auditExcluded: false,
    },
  });

  if (otherPlayers.length === 0) {
    await game.update({ auditExcluded: true });
    return 'Game deleted successfully';
  } else {
    const newCreator = otherPlayers[0];
    await game.update({ creatorId: newCreator.playerId });
    return 'Player left the game successfully';
  }
};

export const verifyPlayersReady = async (game_id) => {
  return await GamePlayer.findAll({
    where: { gameId: game_id, auditExcluded: false },
  });
};

export const deleteGamePlayer = async (gamePlayer, auditExcluded) => {
  await gamePlayer.update({ auditExcluded });
};
