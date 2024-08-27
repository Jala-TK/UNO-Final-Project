import axios from 'axios';
import { NextPageContext } from 'next';
import { SignInRequestData } from '@/types/login';
import { setCookie } from 'nookies';
import { User } from '@/context/AuthContext'; // Certifique-se de que o caminho esteja correto

export async function signInRequest(data: SignInRequestData) {
  return await axios
    .post('/api/login', {
      username: data.username,
      password: data.password,
    })
    .then((res) => {
      const { access_token } = res.data;
      return access_token;
    });
}
export async function recoverUserInformation(
  token: string,
  ctx?: NextPageContext
): Promise<{ user: User | null }> {
  try {
    const response = await axios.post('/api/getPerfil', {
      access_token: token,
    });

    const { username, email } = response.data;

    return {
      user: { username, email },
    };
  } catch (error) {
    console.error('Failed to recover user information:', error);
    return {
      user: null,
    };
  }
}
