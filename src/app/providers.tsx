'use client';

import { SocketProvider } from '@/context/SocketContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SocketProvider>
        {children}
      </SocketProvider>
    </ThemeProvider>
  );
}
