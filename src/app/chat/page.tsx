'use client';

import { useState } from 'react';
import { Box, Container, TextField, Button, Typography } from '@mui/material';
import { useSocket } from '@/lib/socket/context';
import ChatRoom from '@/components/chat/ChatRoom';

export default function ChatPage() {
  const [username, setUsername] = useState('');
  const { socket, connect } = useSocket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      connect(username.trim());
    }
  };

  if (socket) {
    return (
      <Container maxWidth="lg" sx={{ height: 'calc(100vh - 64px)' }}>
        <Box sx={{ height: '100%', py: 2 }}>
          <ChatRoom />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem' },
            fontWeight: 700,
            textAlign: 'center',
            mb: 4,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Join the Chat
        </Typography>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!username.trim()}
          sx={{
            py: 1.5,
            px: 4,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #d946ef 100%)',
            },
          }}
        >
          Enter Chat
        </Button>
      </Box>
    </Container>
  );
}
