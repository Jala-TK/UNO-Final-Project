import { apiClient } from '@/services/fetch';
import { User } from '@/context/AuthContext';
import { SignInRequestData } from '@/types/login';

export async function createUser(data: any) {
  return await apiClient().post(`/api/player`, data);
}

export async function login(data: SignInRequestData) {
  return await apiClient().post('/api/login', {
    username: data.username,
    password: data.password,
  });
}

export async function getPerfil(): Promise<User | null> {
  const result = await apiClient().post(`/api/getPerfil`, {});
  if (result.status === 200) {
    return result.data;
  } else {
    return null;
  }
}
