import axios, { AxiosInstance } from 'axios';
import 'dotenv/config';
import { GetServerSidePropsContext, NextPageContext, PreviewData } from 'next';
import { parseCookies } from 'nookies';
import { ParsedUrlQuery } from 'querystring';

export function apiClient(
  ctx?: NextPageContext | GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
): AxiosInstance {
  const { 'nextauth.token.uno': token } = parseCookies(ctx);

  const api = axios.create({ baseURL: 'http://localhost' });

  api.interceptors.request.use((config) => {
    if (token) {
      config.data = {
        ...config.data,
        access_token: token,
      };
    }
    config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    config.headers.Pragma = 'no-cache';
    config.headers.Expires = '0';
    config.headers['Timestamp'] = new Date().getTime().toString();

    return config;
  });

  return api;
}
