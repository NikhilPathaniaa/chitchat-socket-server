'use client';

import { SocketProvider } from '@/lib/socket/context';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4ECDC4',
    },
    background: {
      default: '#1A1A1A',
      paper: 'rgba(255, 255, 255, 0.05)',
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SocketProvider>
        {children}
      </SocketProvider>
    </ThemeProvider>
  );
}
