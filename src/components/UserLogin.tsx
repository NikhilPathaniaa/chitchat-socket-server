'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useSocket } from '@/lib/socket/context';
import toast from 'react-hot-toast';

export default function UserLogin() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { socket, connect } = useSocket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!username.trim()) {
      setError('Username is required');
      setIsLoading(false);
      return;
    }
    
    try {
      setError('');
      const trimmedUsername = username.trim();
      setUsername(trimmedUsername);
      connect();
      router.push('/chat/room');
      toast.success('Connected successfully!');
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to connect. Please try again.');
      toast.error('Connection failed!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper 
      elevation={3}
      sx={{
        p: 4,
        width: '100%',
        maxWidth: 400,
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        align="center"
        sx={{ mb: 4 }}
      >
        Welcome to ChitChat
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Enter your username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={!!error}
          helperText={error}
          disabled={isLoading}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ mb: 2 }}
        >
          {isLoading ? 'Connecting...' : 'Join Chat'}
        </Button>
      </form>

      <Typography 
        variant="body2" 
        color="text.secondary" 
        align="center"
        sx={{ mt: 2 }}
      >
        Start chatting with people around the world!
      </Typography>
    </Paper>
  );
}
