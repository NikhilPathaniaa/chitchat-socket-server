'use client';

import { useEffect, useRef } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useSocket } from '@/lib/socket/context';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

export default function ChatRoom() {
  const { messages, socket } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!socket) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Messages Container */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography color="text.secondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwnMessage={message.username === socket.auth.username}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Chat Input */}
      <ChatInput />
    </Paper>
  );
}
