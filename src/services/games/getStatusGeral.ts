import { parseCookies } from 'nookies';

import axios, { AxiosInstance, AxiosResponse } from 'axios';

export async function selectStatusGeral(
  axiosApi: AxiosInstance,
  data: { game_id: Number }
): Promise<AxiosResponse> {
  const { 'nextauth.token.rhmix': token } = parseCookies();

  const response = await axiosApi.post('/api/game/statusGeral', data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response;
}
