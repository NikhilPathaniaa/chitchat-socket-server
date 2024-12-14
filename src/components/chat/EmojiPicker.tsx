'use client';

import React from 'react';
import { Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const EMOJI_LIST = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🎉', '🔥', '👋', '🤔'];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const handleClick = (emoji: string) => {
    onEmojiSelect(emoji);
  };

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
        <div key={emoji}>
          <div
            onClick={() => handleClick(emoji)}
            style={{
              transition: 'transform 0.2s'
            }}
          >
            <Box
              component={motion.div}
              whileTap={{ scale: 0.9 }}
              sx={{
                cursor: 'pointer',
                p: 0.5,
                borderRadius: 1,
                bgcolor: 'action.hover',
              }}
            >
              {emoji}
            </Box>
          </div>
        </div>
      ))}
    </Paper>
  );
};

export default EmojiPicker;
