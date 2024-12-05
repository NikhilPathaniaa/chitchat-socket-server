'use client';

import { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useSocket } from '@/lib/socket/context';

export default function ChatInput() {
  const [message, setMessage] = useState('');
  const { sendMessage } = useSocket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        gap: 1,
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />
      <IconButton
        type="submit"
        color="primary"
        disabled={!message.trim()}
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
          '&.Mui-disabled': {
            bgcolor: 'action.disabledBackground',
            color: 'action.disabled',
          },
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
}
