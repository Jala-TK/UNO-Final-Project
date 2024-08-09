import Player from '../models/player.js';
import Card from '../models/card.js';
import GamePlayer from '../models/gamePlayer.js';
import { hashPassword } from '../utils/passwordUtils.js';
import { Op } from 'sequelize';

export const createNewPlayer = async (username, email, password) => {
  const hashedPassword = hashPassword(password);
  await Player.create({ username, email, password: hashedPassword });
};

export const findPlayerById = async (playerId) => {
  return await Player.findByPk(playerId);
};

export const findExistPlayerById = async (playerId) => {
  return await Player.findOne({
    where: { id: playerId, auditExcluded: false },
  });
};

export const findExistingPlayer = async (username, email) => {
  const player = await Player.findOne({
    where: {
      [Op.or]: [{ username: username }, { email: email }],
    },
  });
  if (player) {
    if (player.username === username) {
      return { error: 'User already exists' };
    } else if (player.email === email) {
      return { error: 'Email already exists' };
    }
  }
  return null;
};

export const findExistingPlayerUpdate = async (user, username, email) => {
  const player = await Player.findOne({
    where: {
      id: { [Op.not]: user.id },
      [Op.or]: [{ username: username }, { email: email }],
    },
  });

  if (player) {
    if (player.username === username) {
      return { error: 'User already exists' };
    } else if (player.email === email) {
      return { error: 'Email already exists' };
    }
  }
  return null;
};

export const getPlayerHands = async (game_id, playersInGame) => {
  const playerIds = playersInGame.map((player) => player.playerId);

  const playerHands = {};
  for (const playerId of playerIds) {
    const cards = await Card.findAll({
      where: {
        gameId: game_id,
        whoOwnerCard: playerId,
        orderDiscarded: null,
      },
    });
    playerHands[playerId] = cards.map((card) => ({
      id: card.id,
      points: card.points,
      description: card.value,
    }));
  }
  return playerHands;
};

export const getPlayerNames = async (playersInGame) => {
  const playerIds = playersInGame.map((player) => player.playerId);

  const players = await Player.findAll({
    where: {
      id: playerIds,
    },
  });

  return players.reduce((acc, player) => {
    acc[player.id] = player.username;
    return acc;
  }, {});
};

export const getPlayersInGameData = async (gamePlayers) => {
  const userIds = gamePlayers.map((player) => player.dataValues.playerId);

  const users = await Player.findAll({
    where: {
      id: userIds,
    },
  });
  const usernames = users.map((user) => user.username);

  return { userIds, usernames };
};

export const verifyPlayerInGame = async (user, game_id) => {
  return await GamePlayer.findOne({
    where: { gameId: game_id, playerId: user.id, auditExcluded: false },
  });
};

export const updatePlayer = async (player, updateData) => {
  updateData.password = hashPassword(updateData.password);
  await player.update(updateData);
};

export const deletePlayer = async (player) => {
  await player.update({ auditExcluded: true });
};
