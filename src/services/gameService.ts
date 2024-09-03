import { apiClient } from '@/services/fetch';
import {
  GameProps,
  GameStatusProps,
  Card,
  Scores,
  CardPlayable,
} from '@/types/types';
export async function fetchGameStatusData(
  gameId: number | null
): Promise<{ success: boolean; message: string; data: GameStatusProps }> {
  const result = await apiClient().post(`/api/game/statusGeral`, {
    game_id: gameId,
  });
  return {
    success: result.status === 200,
    message: result.data.message,
    data: result.data,
  };
}

export async function fetchGameData(
  gameId: number | null
): Promise<{ success: boolean; message: string; data: GameProps }> {
  const result = await apiClient().post(`/api/games/${gameId}`, {});
  return {
    success: result.status === 200,
    message: result.data.message,
    data: result.data,
  };
}

export async function exitGame(
  gameId: number | null
): Promise<{ success: boolean; message: string; data: any }> {
  const result = await apiClient().post(`/api/game/leave`, { game_id: gameId });
  return {
    success: result.status === 200,
    message: result.data.message,
    data: result.data,
  };
}

export async function startGame(
  gameId: number | null
): Promise<{ success: boolean; message: string; data: any }> {
  const result = await apiClient().post(`/api/game/start`, { game_id: gameId });
  return {
    success: result.status === 200,
    message: result.data.message,
    data: result.data,
  };
}

export async function challenge(
  gameId: number | null,
  challengePlayer: string
): Promise<{ success: boolean; message: string; data: any }> {
  const result = await apiClient().post(`/api/game/challengeUno`, {
    game_id: gameId,
    challengePlayer: challengePlayer,
  });
  return {
    success: result.status === 200,
    message: result.data.message,
    data: result.data,
  };
}

export async function dealerCards(
  gameId: number | null,
  players: string[]
): Promise<{ success: boolean; message: string; data: any }> {
  const result = await apiClient().post(`/api/game/dealCards/${gameId}`, {
    players: players,
    cardsPerPlayer: 7,
  });
  return {
    success: result.status === 200,
    message: result.data.message,
    data: result.data,
  };
}

export async function getTopCard(
  gameId: number | null
): Promise<{ success: boolean; message: string; data: any }> {
  const result = await apiClient().post(`/api/game/topCard`, {
    game_id: gameId,
  });
  return {
    success: result.status === 200,
    message: result.data.message,
    data: result.data,
  };
}

export async function fetchCardsData(
  gameId: number | null
): Promise<{ success: boolean; message: string; data: Card[] }> {
  const result = await apiClient().post(`/api/game/hand`, { game_id: gameId });
  return {
    success: result.status === 200,
    message: result.data.message,
    data: result.data.hand,
  };
}

export async function fetchCardsPlayableData(
  gameId: number | null
): Promise<{ success: boolean; message: string; data: CardPlayable[] }> {
  const result = await apiClient().post(`/api/game/checkHand`, {
    game_id: gameId,
  });
  return {
    success: result.status === 200,
    message: result.data.message,
    data: result.data.validCards,
  };
}

export async function enterGame(
  gameId: number | null
): Promise<{ success: boolean; message: string; data: any }> {
  const join = await apiClient().post(`/api/game/join`, { game_id: gameId });
  if (join.status === 200) {
    const ready = await readyGame(gameId);

    return {
      success: ready.success,
      message: ready.message,
      data: ready.data,
    };
  }
  return {
    success: join.status === 200,
    message: join.data.message,
    data: join.data,
  };
}

export async function readyGame(
  gameId: number | null
): Promise<{ success: boolean; message: string; data: any }> {
  const result = await apiClient().post(`/api/game/ready`, { game_id: gameId });
  return {
    success: result.status === 200,
    message: result.data.message,
    data: result.data,
  };
}

export async function getGames(): Promise<{
  success: boolean;
  message: string;
  data: any;
}> {
  const game = await apiClient().get(`/api/games`);
  return {
    success: game.status === 200,
    message: game.data.message,
    data: game.data,
  };
}

export async function createGame(
  data: any
): Promise<{ success: boolean; message: string; data: any }> {
  const createdGame = await apiClient().post(`/api/games`, data);
  return {
    success: createdGame.status === 201,
    message: createdGame.data.message,
    data: createdGame.data,
  };
}

export async function sayUno(
  gameId: number | null
): Promise<{ success: boolean; message: string; data: any }> {
  const result = await apiClient().post(`/api/game/uno`, { game_id: gameId });
  return {
    success: result.status === 200,
    message: result.data.message,
    data: result.data,
  };
}

export async function skip(
  gameId: number | null
): Promise<{ success: boolean; message: string; data: any }> {
  const result = await apiClient().post(`/api/game/skip`, { game_id: gameId });
  return {
    success: result.status === 200,
    message: result.data.message,
    data: result.data,
  };
}

export async function fetchScoreData(
  gameId: number | null
): Promise<{ success: boolean; message: string; data: Scores[] }> {
  const result = await apiClient().post(`/api/getScore`, { game_id: gameId });
  return {
    success: result.status === 200,
    message: result.data.message,
    data: result.data.scores,
  };
}
