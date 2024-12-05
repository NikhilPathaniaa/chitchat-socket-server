'use client';

import React from 'react';
import { useSocket } from '@/lib/socket/context';
import { Paper, Typography, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessage from '@/components/chat/ChatMessage';
import { Message } from '@/lib/socket/context';

const ChatPage = () => {
  const { socket, messages } = useSocket();

  if (!socket) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          p: 3,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Connecting to chat...
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        borderRadius: 0,
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((message: Message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <ChatMessage
                message={message}
                isOwnMessage={message.username === socket.auth.username}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
      <ChatInput />
    </Paper>
  );
};

export default ChatPage;
