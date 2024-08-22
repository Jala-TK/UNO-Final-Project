import axios, { AxiosInstance } from 'axios';
import 'dotenv/config';
import { GetServerSidePropsContext, NextPageContext, PreviewData } from 'next';
import { parseCookies } from 'nookies';
import { ParsedUrlQuery } from 'querystring';

export function getAPIClient(
  ctx?: NextPageContext | GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
): AxiosInstance {
  const { 'nextauth.token.uno': token } = parseCookies(ctx);

  const api = axios.create({});

  api.interceptors.request.use((config) => {
    if (token) {
      config.data = {
        ...config.data,
        access_token: token,
      };
    }
    return config;
  });

  return api;
}
