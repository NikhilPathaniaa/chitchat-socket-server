'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Tooltip, Popper, ClickAwayListener } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
}

export default function ChatInput({ value, onChange, onSubmit, placeholder }: ChatInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEmojiSelect = (emoji: any) => {
    const cursorPosition = inputRef.current?.selectionStart || value.length;
    const newValue = value.slice(0, cursorPosition) + emoji.native + value.slice(cursorPosition);
    onChange(newValue);
    setShowEmojiPicker(false);
  };

  const handleEmojiButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleClickAway = () => {
    setShowEmojiPicker(false);
  };

  // Focus input when emoji picker closes
  useEffect(() => {
    if (!showEmojiPicker) {
      inputRef.current?.focus();
    }
  }, [showEmojiPicker]);

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: 'flex',
        gap: 1,
        width: '100%',
        alignItems: 'flex-end',
      }}
    >
      <Tooltip title="Add emoji" placement="top">
        <IconButton
          onClick={handleEmojiButtonClick}
          size="small"
          color="primary"
          sx={{ mb: 1 }}
        >
          <EmojiEmotionsIcon />
        </IconButton>
      </Tooltip>

      <ClickAwayListener onClickAway={handleClickAway}>
        <Box sx={{ position: 'relative', flex: 1 }}>
          <TextField
            inputRef={inputRef}
            fullWidth
            multiline
            maxRows={4}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'background.paper',
                '&:hover': {
                  '& > fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              },
            }}
          />

          <Popper
            open={showEmojiPicker}
            anchorEl={anchorEl}
            placement="top-start"
            sx={{
              zIndex: 1000,
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '&[data-popper-placement*="top"] .arrow': {
                bottom: 0,
                ml: -1,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  transform: 'translateY(50%) rotate(45deg)',
                  backgroundColor: 'background.paper',
                  width: 10,
                  height: 10,
                },
              },
            }}
          >
            <Box sx={{ bgcolor: 'background.paper', p: 1, borderRadius: 1 }}>
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme="light"
                previewPosition="none"
                skinTonePosition="none"
              />
            </Box>
          </Popper>
        </Box>
      </ClickAwayListener>

      <Tooltip title="Send message" placement="top">
        <IconButton
          type="submit"
          color="primary"
          disabled={!value.trim()}
          sx={{
            mb: 1,
            bgcolor: value.trim() ? 'primary.main' : 'action.disabledBackground',
            color: value.trim() ? 'common.white' : 'action.disabled',
            '&:hover': {
              bgcolor: value.trim() ? 'primary.dark' : 'action.disabledBackground',
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
