'use client';

import React, { useState } from 'react';
import { Box, Typography, IconButton, Paper, Tooltip, Popper, ClickAwayListener, Fade } from '@mui/material';
import Image from 'next/image';
import { Message } from '@/types/message';
import { useSocket } from '@/lib/socket/context';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import { formatDistanceToNow } from 'date-fns';

const EMOJI_LIST = ['👍', '❤️', '😊', '😂', '🎉', '👏', '🔥', '💯'];

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { addReaction, removeReaction, username } = useSocket();

  const handleReactionClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setShowReactions(!showReactions);
  };

  const handleReaction = (emoji: string) => {
    if (!username) return;
    
    const reactions = message.reactions || {};
    const hasReacted = reactions[emoji]?.includes(username);
    
    if (hasReacted) {
      removeReaction(message.id, emoji);
    } else {
      addReaction(message.id, emoji);
    }
    setShowReactions(false);
  };

  const handleClickAway = () => {
    setShowReactions(false);
  };

  const renderReactions = () => {
    if (!message.reactions) return null;
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
        {Object.entries(message.reactions).map(([emoji, users]) => (
          users.length > 0 && (
            <Tooltip 
              key={emoji} 
              title={users.join(', ')}
              placement="top"
            >
              <Paper
                onClick={() => handleReaction(emoji)}
                sx={{
                  px: 1,
                  py: 0.5,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  bgcolor: username && users.includes(username) ? 'primary.light' : 'background.paper',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  }
                }}
              >
                <span>{emoji}</span>
                <Typography variant="caption">{users.length}</Typography>
              </Paper>
            </Tooltip>
          )
        ))}
      </Box>
    );
  };

  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isOwnMessage ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        position: 'relative',
        mb: 2,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 2,
          maxWidth: '70%',
          borderRadius: 3,
          position: 'relative',
          bgcolor: isOwnMessage ? 'primary.main' : 'background.paper',
          color: isOwnMessage ? 'primary.contrastText' : 'text.primary',
          ...(isOwnMessage
            ? { borderTopRightRadius: 0 }
            : { borderTopLeftRadius: 0 }),
        }}
      >
        {message.fileUrl ? (
          <Box sx={{ mt: 1, position: 'relative', width: '100%', maxWidth: 300 }}>
            <Image
              src={message.fileUrl}
              alt="Shared image"
              width={300}
              height={200}
              style={{ objectFit: 'contain', borderRadius: 8 }}
            />
          </Box>
        ) : (
          <Typography variant="body1" component="div" sx={{ wordBreak: 'break-word' }}>
            {message.text}
          </Typography>
        )}
        
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            color: isOwnMessage ? 'rgba(255,255,255,0.7)' : 'text.secondary',
          }}
        >
          {formattedTime}
        </Typography>

        {renderReactions()}
      </Paper>

      <IconButton
        size="small"
        onClick={handleReactionClick}
        sx={{
          opacity: showReactions ? 1 : 0,
          transition: 'opacity 0.2s',
          position: 'absolute',
          [isOwnMessage ? 'left' : 'right']: -40,
          bottom: '50%',
          transform: 'translateY(50%)',
          '&:hover': { opacity: 1 },
        }}
      >
        <AddReactionIcon fontSize="small" />
      </IconButton>

      <Popper
        open={showReactions}
        anchorEl={anchorEl}
        placement={isOwnMessage ? 'left-start' : 'right-start'}
        transition
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClickAway}>
            <Fade {...TransitionProps} timeout={200}>
              <Paper
                elevation={3}
                sx={{
                  p: 1,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.5,
                  maxWidth: 200,
                  bgcolor: 'background.paper',
                }}
              >
                {EMOJI_LIST.map((emoji) => (
                  <IconButton
                    key={emoji}
                    size="small"
                    onClick={() => handleReaction(emoji)}
                    sx={{
                      width: 32,
                      height: 32,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    {emoji}
                  </IconButton>
                ))}
              </Paper>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
    </Box>
  );
}
