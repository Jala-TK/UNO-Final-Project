import axios from 'axios';
import { NextPageContext } from 'next';
import { SignInRequestData } from '@/types/login';
import { setCookie } from 'nookies';

export async function signInRequest(data: SignInRequestData) {
  return await axios
    .post('/api/login', {
      username: data.username,
      password: data.password,
    })
    .then((res) => {
      const { access_token } = res.data;
      setCookie(undefined, 'nextauth.token.uno', access_token, {
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });
      return res.data;
    });
}

export async function recoverUserInformation(
  token: string,
  ctx: NextPageContext
) {
  let user: any;
  await axios
    .post('/api/getPerfil', { access_token: token })
    .then((res) => {
      user = res.data;
    })
    .catch((err) => {});
  return {
    user,
  };
}
