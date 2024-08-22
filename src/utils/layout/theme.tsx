import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import Colors from './colors'
export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

const theme = createTheme({
  palette: {
    primary: Colors.whiteIce,
    secondary: Colors.blackShadown
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
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