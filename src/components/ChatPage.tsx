import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, Container } from '@mui/material';
import { useSocket } from '@/lib/socket/context';
import ChatRoom from './chat/ChatRoom';

export default function ChatPage() {
  const [inputUsername, setInputUsername] = useState('');
  const { username, connect } = useSocket();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      connect(inputUsername.trim());
    }
  };

  if (!username) {
    return (
      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleJoin}
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
            <Typography variant="h5" gutterBottom textAlign="center">
              Join Chat
            </Typography>
            <TextField
              fullWidth
              label="Enter your username"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={!inputUsername.trim()}
              sx={{ mt: 2 }}
            >
              Join
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ height: '100vh', bgcolor: 'background.default' }}>
      <ChatRoom />
    </Box>
  );
}
