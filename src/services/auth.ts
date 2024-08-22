import axios from 'axios';
import { NextPageContext } from 'next';
import { SignInRequestData } from '@/types/login';

export async function signInRequest(data: SignInRequestData) {
  return await axios
    .post('/api/auth/login', {
      username: data.username,
      password: data.password,
    })
    .then((res) => {
      return res.data;
    });
}

export async function recoverUserInformation(
  token: string,
  ctx: NextPageContext
) {
  let user;
  await axios
    .post('/api/auth/token', { token })
    .then((res) => {
      user = res.data;
    })
    .catch((err) => {});
  return {
    user,
  };
}
