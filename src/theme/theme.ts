import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const baseTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4263F7',
      light: '#6B86F9',
      dark: '#3B5AE0',
    },
    secondary: {
      main: '#7C4EFF',
      light: '#9B7AFF',
      dark: '#6A42E0',
    },
    background: {
      default: '#f5f7fb',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  components: {
    MuiFab: {
      styleOverrides: {
        root: {
          '&:hover': {
            transform: 'scale(1.05)',
          },
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.875rem',
          backgroundColor: 'rgba(33, 150, 243, 0.9)',
          backdropFilter: 'blur(4px)',
          borderRadius: '8px',
          padding: '8px 16px',
        },
        arrow: {
          color: 'rgba(33, 150, 243, 0.9)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '3px',
            '&:hover': {
              backgroundColor: '#555',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
  },
});

export const theme = responsiveFontSizes(baseTheme);
