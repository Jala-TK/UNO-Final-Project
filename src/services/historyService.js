import History from '../models/history.js';

export const addActionToHistory = async (gameId, action, player) => {
  await History.create({
    gameId: gameId,
    player: player,
    action: action,
  });
};
export const getGameHistory = async (gameId) => {
  const history = await History.findAll({
    where: {
      gameId: gameId,
    },
    order: [['createdAt', 'ASC']],
  });
  return history;
};
