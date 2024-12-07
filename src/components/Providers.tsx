'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SocketProvider } from '@/lib/socket/context';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Typography, Button } from '@mui/material';
import { Toaster } from 'react-hot-toast';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#7C4EFF',
      light: '#9e7bff',
      dark: '#5c35cc',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Segoe UI Emoji", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" color="error" gutterBottom>
        Something went wrong
      </Typography>
      <Typography color="textSecondary" sx={{ mb: 2 }}>
        {error.message}
      </Typography>
      <Button variant="contained" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </Box>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SocketProvider>
          {children}
          <Toaster position="top-right" />
        </SocketProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
