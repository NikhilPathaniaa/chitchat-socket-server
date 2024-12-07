'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useSocket } from '@/lib/socket/context';

export default function ChatPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { connect, isConnected, isLoading, error: socketError } = useSocket();

  useEffect(() => {
    if (isConnected) {
      router.push('/chat/room');
    }
  }, [isConnected, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    try {
      await connect(username);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Welcome to ChitChat
          </Typography>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <TextField
              fullWidth
              label="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!error}
              helperText={error || socketError}
              disabled={isLoading}
            />
            
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Join Chat'
              )}
            </Button>
          </form>
        </Paper>
      </motion.div>
    </Container>
  );
}
