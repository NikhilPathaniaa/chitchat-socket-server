'use client';

import { useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { useSocket } from '@/context/SocketContext';

export default function UserLogin() {
  const [username, setUsername] = useState('');
  const { login } = useSocket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper 
        elevation={3}
        sx={{ 
          width: '100%',
          p: 4,
          textAlign: 'center',
          background: '#ffffff',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            mb: 3
          }}
        >
          Welcome to ChitChat
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="Enter your username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!username.trim()}
            sx={{
              py: 1.5,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Join Chat
          </Button>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            width: '60px',
            height: '60px',
            background: 'linear-gradient(45deg, #7C3AED 30%, #C4B5FD 90%)',
            top: '20%',
            left: '10%',
            opacity: 0.2,
            zIndex: 0,
            borderRadius: '50%'
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(45deg, #7C3AED 30%, #C4B5FD 90%)',
            bottom: '20%',
            right: '10%',
            opacity: 0.2,
            zIndex: 0,
            borderRadius: '50%'
          }}
        />
      </Paper>
    </Container>
  );
}
