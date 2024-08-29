"use client"
import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import Head from 'next/head';
import createEmotionCache from '../utils/layout/createEmotionCache';
import theme from '../utils/layout/theme';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';

import '../styles/colors.css';
import '../styles/globals.css';

const clientSideEmotionCache = createEmotionCache();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SocketProvider>
        <CacheProvider value={clientSideEmotionCache}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
            <meta name="theme-color" content={theme.palette.primary.main} />
            <link rel="shortcut icon" href="/favicon.ico" />
          </Head>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <html lang="pt-BR" suppressHydrationWarning>
              <body style={{ backgroundColor: 'var(--gray-main)' }}>
                {children}
              </body>
            </html>
          </ThemeProvider>
        </CacheProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
