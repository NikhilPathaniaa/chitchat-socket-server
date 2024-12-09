import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Tooltip,
  useTheme,
  styled,
  darken,
  lighten
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistance } from 'date-fns';
import toast from 'react-hot-toast'; // Import react-hot-toast

import { Message } from '@/lib/socket/context';
import { useSocketContext } from '@/lib/socket/context';

const EMOJI_LIST = ['👍', '❤️', '😂', '😮', '😢'];

// Styled Message Bubble Component
const MessageBubble = styled(Box, { 
  shouldForwardProp: (prop) => prop !== 'isOwnMessage' 
})<{ isOwnMessage?: boolean }>(({ theme, isOwnMessage }) => ({
  maxWidth: '90%',
  width: 'auto',
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  position: 'relative',
  display: 'inline-flex',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: theme.spacing(1),
  ...(isOwnMessage 
    ? {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
        borderBottomRightRadius: theme.spacing(1),
        boxShadow: `0 4px 6px ${lighten(theme.palette.primary.light, 0.3)}`
      }
    : {
        backgroundColor: theme.palette.grey[200],
        color: theme.palette.text.primary,
        borderBottomLeftRadius: theme.spacing(1),
        boxShadow: `0 4px 6px ${lighten(theme.palette.grey[300], 0.3)}`
      }
  ),
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    ...(isOwnMessage 
      ? { right: `-${theme.spacing(2)}` } 
      : { left: `-${theme.spacing(2)}` }
    ),
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: `0 0 ${theme.spacing(2)} ${theme.spacing(2)}`,
    ...(isOwnMessage 
      ? {
          borderColor: `transparent transparent ${theme.palette.primary.light} transparent`
        }
      : {
          borderColor: `transparent transparent ${theme.palette.grey[200]} transparent`
        }
    )
  }
}));

const EmojiButton = styled(IconButton)(({ theme }) => ({
  transition: theme.transitions.create(['transform', 'background-color'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    transform: 'scale(1.2)',
    backgroundColor: theme.palette.action.hover,
  },
  '&:active': {
    transform: 'scale(0.9)',
  }
}));

const messageVariants = {
  hidden: { opacity: 0, scale: 0.9, x: -50 },
  visible: { 
    opacity: 1, 
    scale: 1,
    x: 0,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 20 
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    x: 50,
    transition: { duration: 0.2 } 
  }
};

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
  currentUser: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage, currentUser }) => {
  const [hoveredMessage, setHoveredMessage] = useState(false);
  const { socket, messages, setMessages, username } = useSocketContext();
  const theme = useTheme();

  useEffect(() => {
    console.log('ChatMessage Component - Full Message Object:', {
      id: message.id,
      content: message.content,
      reactions: message.reactions,
      timestamp: message.timestamp,
      username: message.username
    });
  }, [message]);

  useEffect(() => {
    console.log('ChatMessage: Reaction State Changed', {
      messageId: message.id,
      reactions: message.reactions,
      reactionsLength: message.reactions?.length,
      messageContent: message.content
    });
  }, [message.reactions]);

  const formatDetailedTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours} hr ago`;
    return `${minutes} min ago`;
  };

  const renderReactionPanel = () => {
    console.log('Rendering Reaction Panel - Detailed', {
      messageId: message.id,
      messageContent: message.content,
      reactions: message.reactions,
      reactionsLength: message.reactions?.length,
      hasReactions: message.reactions && message.reactions.length > 0
    });

    // Force reactions to be an array if undefined
    const safeReactions = message.reactions || [];

    if (safeReactions.length === 0) {
      console.log('No reactions to render for message', message.id);
      return null;
    }

    const reactionCounts = safeReactions.reduce((acc, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('Reaction Counts Breakdown', {
      messageId: message.id,
      reactionCounts,
      reactionDetails: safeReactions
    });

    return (
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: theme.spacing(1),
          backgroundColor: theme.palette.background.paper,
          borderRadius: theme.spacing(2),
          padding: theme.spacing(0.5),
          boxShadow: theme.shadows[1],
          alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
          maxWidth: '90%',
        }}
      >
        {Object.entries(reactionCounts).map(([emoji, count]) => (
          <Tooltip key={emoji} title={`${count} reaction${count > 1 ? 's' : ''}`}>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
              {emoji} {count > 1 && count}
            </Typography>
          </Tooltip>
        ))}
      </Box>
    );
  };

  const handleReactionClick = (emoji: string) => {
    console.log('Reaction Click - Detailed', { 
      messageId: message.id, 
      emoji, 
      messageContent: message.content,
      currentReactions: message.reactions
    });

    // Fallback to localStorage if username is not available
    const currentUsername = username;

    if (!socket || !currentUsername) {
      console.error('Reaction Failed - Detailed', {
        socketAvailable: !!socket,
        username: currentUsername,
        messageId: message.id
      });
      toast.error('Unable to add reaction. Please log in again.');
      return;
    }

    try {
      // Optimistic update for better UX
      const currentReactions = message.reactions || [];
      const existingReactionIndex = currentReactions.findIndex(
        r => r.emoji === emoji && r.username === currentUsername
      );

      let updatedReactions;
      if (existingReactionIndex !== -1) {
        // Remove existing reaction
        updatedReactions = currentReactions.filter(
          (_, index) => index !== existingReactionIndex
        );
      } else {
        // Add new reaction
        updatedReactions = [
          ...currentReactions, 
          { emoji, username: currentUsername }
        ];
      }

      console.log('Reaction Update - Optimistic', {
        messageId: message.id,
        emoji,
        username: currentUsername,
        currentReactions,
        updatedReactions
      });

      // Update messages in socket context
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === message.id 
            ? { ...msg, reactions: updatedReactions } 
            : msg
        )
      );

      // Emit reaction event
      socket.emit('add_reaction', {
        messageId: message.id,
        emoji,
        username: currentUsername,
      });
    } catch (error) {
      console.error('Reaction Error - Detailed', {
        messageId: message.id,
        emoji,
        username: currentUsername,
        error: error instanceof Error ? error.message : error
      });
      toast.error('Failed to add reaction. Please try again.');
    }
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
        width: '100%',
        marginBottom: theme.spacing(2),
        px: theme.spacing(2),
      }}
      onMouseEnter={() => setHoveredMessage(true)}
      onMouseLeave={() => setHoveredMessage(false)}
    >
      {renderReactionPanel()}

      <MessageBubble isOwnMessage={isOwnMessage}>
        <Typography variant="body2">{message.content}</Typography>
      </MessageBubble>

      <Typography 
        variant="caption" 
        color="text.secondary" 
        sx={{ 
          marginTop: theme.spacing(0.5),
          alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
        }}
      >
        {formatDetailedTime(message.timestamp)}
      </Typography>

      <AnimatePresence>
        {hoveredMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20 
            }}
            style={{ 
              display: 'flex', 
              gap: theme.spacing(0.5),
              marginTop: theme.spacing(0.5),
              alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
              zIndex: 10 
            }}
          >
            {EMOJI_LIST.map((emoji) => (
              <motion.div
                key={emoji}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton 
                  onClick={() => handleReactionClick(emoji)}
                  sx={{
                    fontSize: '1rem',
                    padding: theme.spacing(0.5),
                    backgroundColor: theme.palette.background.paper,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  {emoji}
                </IconButton>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ChatMessage;
