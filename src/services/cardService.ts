import { apiClient } from '@/services/fetch';

export async function drawCard(gameId: number) {
  return await apiClient().post(`/api/cards/draw`, { game_id: gameId });
}

export async function playCard(gameId: number, cardId: number) {
  return await apiClient().post(`/api/cards/play`, {
    game_id: gameId,
    card_id: cardId,
  });
}

export async function playWildCard(
  gameId: number,
  cardId: number,
  color: string
) {
  return await apiClient().post(`/api/cards/play`, {
    game_id: gameId,
    card_id: cardId,
    color: color,
  });
}
