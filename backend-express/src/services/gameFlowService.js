import { updateGame } from '../services/gameService.js';
import { getPlayersInGame } from '../services/gamePlayerService.js';
import { getPlayerScores } from '../services/scoreService.js';
import { addActionToHistory } from '../services/historyService.js';
import {
  findExistPlayerByUsername,
  findPlayerById,
  updateWins,
} from './playerService.js';
import { io } from '../../../server.js';

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

  const player = await findExistPlayerByUsername(user.username);
  await updateWins(player, 1);

  io.emit('update', {
    type: 'winGame',
    updateGame: game.id,
    updatedHand: 'update',
    player: user.username,
    topCard: 'update',
  });

  io.emit('update', 'winGame');

  return res.status(200).json({
    message: `Card played successfully. ${user.username} has won the game!`,
    scores: scores,
    winner: user.username,
  });
};

export const checkEndGame = async (game, res) => {
  const gamePlayers = await getPlayersInGame(game.id);
  if (gamePlayers.length === 0) {
    return res.status(404).json({ message: 'No players found in this game' });
  }

  if (gamePlayers.length === 1) {
    const scores = await getPlayerScores(gamePlayers);
    const winner = findPlayerById(gamePlayers[0].playerId);
    if (winner) {
      await updateWins(winner, 1);
    }

    await updateGame(game, {
      status: 'Finished',
    });

    await addActionToHistory(
      game.id,
      `Won because all the other players left.`,
      winner.username,
    );

    io.emit('update', {
      type: 'winGame',
      updateGame: game.id,
      updatedHand: 'update',
      player: user.username,
      topCard: 'update',
    });
    io.emit('update', 'winGame');

    return res.status(200).json({
      message: `Game finished. ${winner.username} has won the game!`,
      scores: scores,
      winner: winner.username,
    });
  }
};
