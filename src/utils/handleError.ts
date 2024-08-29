import { AxiosError } from 'axios';

export function handleError(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data.error || 'Erro desconhecido';
  }
  return 'Erro desconhecido';
}
