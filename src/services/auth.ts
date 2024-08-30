import { SignInRequestData } from '@/types/login';
import { login } from '@/services/authService';

export async function signInRequest(data: SignInRequestData) {
  return await login(data).then((res) => {
    const { access_token } = res.data;
    return access_token;
  });
}
