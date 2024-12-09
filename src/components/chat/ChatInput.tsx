'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Box, TextField, IconButton, Tooltip, Typography } from '@mui/material';
import { Send as SendIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSocket } from '@/lib/socket/context';
import toast from 'react-hot-toast'; // Assuming you have react-hot-toast installed

interface ChatInputProps {
  privateChat?: boolean;
  recipient?: string | null;
  onTyping?: (isTyping: boolean) => void;
}

export default function ChatInput({ privateChat, recipient, onTyping }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { socket } = useSocket();
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
    if (!socket) {
      toast.error('Socket connection lost. Please reconnect.');
      return;
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      toast.error('Cannot send empty message');
      return;
    }

    try {
      socket.emit('message', {
        content: trimmedMessage,
        to: recipient
      });
      
      // Clear input after successful send
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        socket?.emit('message', {
          content: `Sent ${file.type.startsWith('image/') ? 'an image' : 'a file'}: ${file.name}`,
          to: recipient,
          attachment: {
            type: file.type,
            name: file.name,
            data: base64Data
          }
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error reading file:', error);
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
            onChange={handleFileSelect}
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
