'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Box, TextField, IconButton, Tooltip, Typography } from '@mui/material';
import { Send as SendIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSocket } from '@/lib/socket/context';

interface ChatInputProps {
  privateChat?: boolean;
  recipient?: string | null;
  onTyping?: (isTyping: boolean) => void;
}

export default function ChatInput({ privateChat, recipient, onTyping }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { sendMessage } = useSocket();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      onTyping?.(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping?.(false);
    }, 1000);
  };

  const handleSend = () => {
    if (message.trim()) {
      if (privateChat && recipient) {
        sendMessage(message.trim(), undefined, recipient);
      } else {
        sendMessage(message.trim());
      }
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        if (privateChat && recipient) {
          sendMessage('', {
            type: file.type,
            name: file.name,
            data: base64
          }, recipient);
        } else {
          sendMessage('', {
            type: file.type,
            name: file.name,
            data: base64
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'flex-end',
        p: 2,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      {privateChat && !recipient && (
        <Typography
          variant="body2"
          sx={{
            flex: 1,
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          Select a user to start private chat
        </Typography>
      )}
      
      {(!privateChat || recipient) && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept="image/*,video/*,audio/*"
          />
          
          <Tooltip title="Attach file">
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              sx={{ color: 'text.secondary' }}
            >
              <AttachFileIcon />
            </IconButton>
          </Tooltip>

          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={handleKeyPress}
            placeholder={privateChat ? `Message ${recipient}` : "Type a message"}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />

          <IconButton
            onClick={handleSend}
            disabled={!message.trim()}
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
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
        </>
      )}
    </Box>
  );
}
