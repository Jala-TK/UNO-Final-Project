import { createTheme } from '@mui/material/styles';
import Colors from './colors';
import localFont from 'next/font/local'

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
    }
  ],
})

const theme = createTheme({
  palette: {
    primary: Colors.whiteIce,
    secondary: Colors.blackShadown
  },
  typography: {
    fontFamily: satoshi.style.fontFamily,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: Colors.whiteIce.main,
        },
      },
    },
  },
});

export default theme;