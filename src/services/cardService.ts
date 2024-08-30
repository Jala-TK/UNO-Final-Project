import { apiClient } from '@/services/fetch';

export async function drawCard(
  gameId: number
): Promise<{ success: boolean; message: string; data: any }> {
  const response = await apiClient().post(`/api/cards/draw`, {
    game_id: gameId,
  });
  return {
    success: response.status === 200,
    message: response.data.message,
    data: response.data,
  };
}

export async function playCard(
  gameId: number,
  cardId: number
): Promise<{ success: boolean; message: string; data: any }> {
  const response = await apiClient().post(`/api/cards/play`, {
    game_id: gameId,
    card_id: cardId,
  });

  return {
    success: response.status === 200,
    message: response.data.message,
    data: response.data,
  };
}

export async function playWildCard(
  gameId: number,
  cardId: number,
  color: string
): Promise<{ success: boolean; message: string; data: any }> {
  const response = await apiClient().post(`/api/cards/play`, {
    game_id: gameId,
    card_id: cardId,
    color: color,
  });

  return {
    success: response.status === 200,
    message: response.data.message,
    data: response.data,
  };
}
