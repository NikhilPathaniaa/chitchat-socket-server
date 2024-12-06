'use client';

import React from 'react';
import { Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const EMOJI_LIST = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🎉', '🔥', '👋', '🤔'];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  return (
    <Paper
      elevation={3}
      component={motion.div}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      sx={{
        p: 1,
        display: 'flex',
        gap: 0.5,
        flexWrap: 'wrap',
        maxWidth: '200px',
      }}
    >
      {EMOJI_LIST.map((emoji) => (
        <Box
          key={emoji}
          component={motion.div}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onEmojiSelect(emoji)}
          sx={{
            cursor: 'pointer',
            p: 0.5,
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          {emoji}
        </Box>
      ))}
    </Paper>
  );
};

export default EmojiPicker;
