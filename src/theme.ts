'use client';
import { createTheme } from '@mui/material/styles';
import localFont from 'next/font/local';
import Colors from '@/utils/layout/colors';

const satoshi = localFont({
  src: [
    {
      path: '../../../public/assets/fonts/satoshi/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/assets/fonts/satoshi/Satoshi-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../../public/assets/fonts/satoshi/Satoshi-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
});
const theme = createTheme({
  palette: {
    primary: Colors.whiteIce,
    secondary: Colors.blackShadown,
  },
  typography: {
    fontFamily: satoshi.style.fontFamily,
  },
});

export default theme;
