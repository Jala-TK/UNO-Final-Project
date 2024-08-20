import { updateGame } from '../services/gameService.js';
import { getPlayersInGame } from '../services/gamePlayerService.js';
import { getPlayerScores } from '../services/scoreService.js';
import { addActionToHistory } from '../services/historyService.js';

export const processEndOfGame = async (game, user, card, res) => {
  await updateGame(game, {
    status: 'Finished',
  });

  const gamePlayers = await getPlayersInGame(game.id);
  if (gamePlayers.length === 0) {
    return res.status(404).json({ message: 'No players found in this game' });
  }

  const scores = await getPlayerScores(gamePlayers);

  await addActionToHistory(
    game.id,
    `Played ${card.color} ${card.value} and won the game!`,
    user.username,
  );

  return res.status(200).json({
    message: `Card played successfully. ${user.username} has won the game!`,
    scores: scores,
    winner: user.username,
  });
};
