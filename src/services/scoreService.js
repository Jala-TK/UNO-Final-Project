import GamePlayer from '../models/gamePlayer.js';
import Player from '../models/player.js';
import Card from '../models/card.js';

export const createScore = async (gameId, playerId, score) => {
  return await GamePlayer.create({
    playerId: playerId,
    gameId: gameId,
    score: score,
  });
};

export const findScoreById = async (scoreId) => {
  return await GamePlayer.findByPk(scoreId);
};

export const getPlayerScores = async (gamePlayers) => {
  const playerIds = gamePlayers.map((gp) => gp.playerId);

  const players = await Player.findAll({
    where: {
      id: playerIds,
      auditExcluded: false
    },
  });

  const scores = {};
  for (const gp of gamePlayers) {
    const player = players.find((p) => p.id === gp.playerId);
    if (player) {
      scores[player.username] = gp.score;
    }
  }

  return scores;
};

export const updateScoreAutomatic = async (game_id, player) => {
  const cards = await Card.findAll({
    where: {
      gameId: game_id,
      whoOwnerCard: player.id,
      orderDiscarded: null,
      auditExcluded: false
    },
  });

  let totalPoints = 0;
  for (const card of cards) {
    totalPoints += card.points;
  }
  const gamePlayer = await GamePlayer.findOne({
    where: { gameId: game_id, playerId: player.id, auditExcluded: false },
  });

  return await updateScore(gamePlayer, totalPoints);
};

export const updateScore = async (gamePlayer, score) => {
  await gamePlayer.update({ score: score });
};

export const deleteScore = async (gamePlayer) => {
  await gamePlayer.update({ score: 0 });
};
