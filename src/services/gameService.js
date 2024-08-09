import Game from '../models/game.js';
import GamePlayer from '../models/gamePlayer.js';

export const createGame = async (title, maxPlayers, creatorId) => {
  const newGame = await Game.create({
    title,
    status: 'Waiting for players',
    maxPlayers,
    creatorId,
    auditExcluded: false,
  });

  return newGame;
};

export const findGameById = async (gameId) => {
  return await Game.findByPk(gameId);
};

export const isCurrentPlayer = (game, playerId) => {
  return game.currentPlayer === playerId;
};

export const updateGame = async (game, updateData) => {
  return game.update(updateData);
};

export const endGame = async (gameId) => {
  const game = await findGameById(gameId);
  if (game) {
    await game.update({ status: 'Finished', auditExcluded: true });
  }
};

export const deleteGame = async (game) => {
  if (game) {
    await game.update({ auditExcluded: true });
  }
};
