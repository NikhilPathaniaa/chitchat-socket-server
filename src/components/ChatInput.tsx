'use client';

import { useState, useRef } from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useSocket } from '@/context/SocketContext';

export default function ChatInput() {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useSocket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current?.files?.[0];
      await sendMessage(message.trim(), file);
      setMessage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        await sendMessage('', file);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'flex-end',
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*,video/*"
      />
      
      <IconButton
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        sx={{ color: 'primary.main' }}
      >
        <AttachFileIcon />
      </IconButton>

      <TextField
        fullWidth
        multiline
        maxRows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        disabled={isUploading}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.paper',
          }
        }}
      />

      <IconButton
        type="submit"
        disabled={(!message.trim() && !fileInputRef.current?.files?.[0]) || isUploading}
        color="primary"
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
}
