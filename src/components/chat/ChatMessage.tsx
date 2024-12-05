'use client';

import { Box, Typography, Avatar } from '@mui/material';
import { Message } from '@/lib/socket/context';
import { formatDistanceToNow } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: isOwnMessage ? 'row-reverse' : 'row',
            alignItems: 'flex-end',
            gap: 1,
            maxWidth: '70%',
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: isOwnMessage ? 'primary.main' : 'secondary.main',
            }}
          >
            {message.username[0].toUpperCase()}
          </Avatar>
          <Box>
            <Box
              sx={{
                bgcolor: isOwnMessage ? 'primary.main' : 'grey.100',
                color: isOwnMessage ? 'white' : 'text.primary',
                p: 1.5,
                borderRadius: 2,
                maxWidth: '100%',
                wordBreak: 'break-word',
              }}
            >
              <Typography variant="body1">{message.text}</Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                mt: 0.5,
                display: 'block',
                textAlign: isOwnMessage ? 'right' : 'left',
              }}
            >
              {message.username} • {formatDistanceToNow(new Date(message.timestamp))}
            </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
