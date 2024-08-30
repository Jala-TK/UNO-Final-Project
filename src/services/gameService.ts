import { apiClient } from '@/services/fetch';
import { GameProps, GameStatusProps, Card } from '@/types/types';
export async function fetchGameStatusData(
  gameId: number | null
): Promise<GameStatusProps | null> {
  const result = await apiClient().post(`/api/game/statusGeral`, {
    game_id: gameId,
  });
  if (!result) {
    throw new Error('Erro ao buscar status do jogo');
  }
  return result.data;
}

export async function fetchGameData(
  gameId: number | null
): Promise<GameProps | null> {
  const result = await apiClient().post(`/api/games/${gameId}`, {});
  return result.data;
}

export async function exitGame(gameId: number | null): Promise<boolean> {
  const result = await apiClient().post(`/api/game/leave`, { game_id: gameId });
  return result.status === 200;
}

export async function startGame(gameId: number | null): Promise<boolean> {
  const result = await apiClient().post(`/api/game/start`, { game_id: gameId });
  return result.status === 200;
}

export async function dealerCards(
  gameId: number | null,
  players: string[]
): Promise<boolean> {
  const result = await apiClient().post(`/api/game/dealCards/${gameId}`, {
    players: players,
    cardsPerPlayer: 7,
  });
  return result.status === 200;
}

export async function getTopCard(gameId: number | null): Promise<any> {
  const result = await apiClient().post(`/api/game/topCard`, {
    game_id: gameId,
  });
  return result.data;
}

export async function fetchCardsData(gameId: number | null): Promise<Card[]> {
  const result = await apiClient().post(`/api/game/hand`, { game_id: gameId });
  return result.data.hand;
}

export async function enterGame(gameId: number | null): Promise<boolean> {
  const join = await apiClient().post(`/api/game/join`, { game_id: gameId });
  if (join.status === 200) {
    return readyGame(gameId);
  }
  return false;
}

export async function readyGame(gameId: number | null): Promise<boolean> {
  const result = await apiClient().post(`/api/game/ready`, { game_id: gameId });
  return result.status === 200;
}

export async function getGames() {
  return await apiClient().get(`/api/games`);
}

export async function createGame(data: any) {
  return await apiClient().post(`/api/games`, data);
}
