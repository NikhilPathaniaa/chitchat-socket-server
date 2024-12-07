'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useSocket } from '@/lib/socket/context';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function UserLogin() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { socket, connect } = useSocket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    setIsLoading(true);
    
    try {
      setError('');
      const trimmedUsername = username.trim();
      setUsername(trimmedUsername);
      await connect(trimmedUsername);
      Cookies.set('username', trimmedUsername);
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
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
          backgroundClip: 'text',
          color: 'transparent',
          mb: 4
        }}
      >
        ChitChat
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={!!error}
          helperText={error}
          disabled={isLoading}
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{
            background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            }
          }}
        >
          {isLoading ? 'Connecting...' : 'Join Chat'}
        </Button>
      </form>
    </Paper>
  );
}
