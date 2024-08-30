import { AxiosError } from 'axios';
export function handleError(error: unknown): string {
  if (error instanceof AxiosError) {
    const errorMessage =
      error.response?.data.error ||
      error.response?.data.message ||
      'Erro desconhecido';
    console.log(errorMessage);
    return errorMessage;
  }
  return 'Erro desconhecido';
}
