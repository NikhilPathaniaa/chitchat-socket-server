'use client';

import { Box, Typography, Paper, IconButton, Tooltip, Menu, MenuItem, Avatar, Link } from '@mui/material';
import Image from 'next/image';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import ImageIcon from '@mui/icons-material/Image';
import DownloadIcon from '@mui/icons-material/Download';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import { format } from 'date-fns';
import { useState } from 'react';
import { Message } from '@/server/socket';
import { useSocket } from '@/lib/socket/context';
import toast from 'react-hot-toast';

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
  currentUser: string;
}

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage, currentUser }) => {
  const { socket } = useSocket();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getFileIcon = () => {
    if (!message.attachment?.type) return null;
    if (message.attachment.type.startsWith('image/')) return <ImageIcon />;
    if (message.attachment.type.startsWith('video/')) return <VideoFileIcon />;
    return <FileIcon />;
  };

  const handleReactionClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setShowReactions(true);
  };

  const handleReactionClose = () => {
    setAnchorEl(null);
    setShowReactions(false);
  };

  const handleReaction = (emoji: string) => {
    if (socket) {
      const hasReacted = message.reactions.findIndex(reaction => 
        reaction.emoji === emoji && reaction.username === currentUser
      ) !== -1;
      socket.emit('messageReaction', {
        messageId: message.id,
        emoji,
        type: hasReacted ? 'remove' : 'add'
      });
      handleReactionClose();
    }
  };

  const getReactionCount = (emoji: string) => {
    return message.reactions.filter(reaction => reaction.emoji === emoji).length;
  };

  const hasUserReacted = (emoji: string) => {
    return message.reactions.some(reaction => 
      reaction.emoji === emoji && reaction.username === currentUser
    );
  };

  const getReactingUsers = (emoji: string) => {
    return message.reactions
      .filter(reaction => reaction.emoji === emoji)
      .map(reaction => reaction.username);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const renderReactionBadges = () => {
    const reactionGroups = message.reactions.reduce((acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = [];
      }
      acc[reaction.emoji].push(reaction.username);
      return acc;
    }, {} as Record<string, string[]>);

    return Object.entries(reactionGroups).map(([emoji, users]) => (
      <Tooltip
        key={emoji}
        title={users.join(', ')}
        arrow
      >
        <Paper
          onClick={() => handleReaction(emoji)}
          sx={{
            p: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            bgcolor: hasUserReacted(emoji)
              ? 'primary.light' 
              : 'background.paper',
            '&:hover': {
              bgcolor: hasUserReacted(emoji)
                ? 'primary.main'
                : 'action.hover',
            },
            color: hasUserReacted(emoji)
              ? 'primary.contrastText'
              : 'text.primary',
          }}
        >
          <Typography variant="body2">{emoji}</Typography>
          <Typography variant="caption">{users.length}</Typography>
        </Paper>
      </Tooltip>
    ));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isOwnMessage ? 'row-reverse' : 'row',
        gap: 1,
        mb: 2,
        maxWidth: '70%',
        alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
      }}
    >
      <Avatar sx={{ width: 32, height: 32 }}>
        {message.username[0].toUpperCase()}
      </Avatar>
      <Box sx={{ maxWidth: 'calc(100% - 40px)' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isOwnMessage ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 1,
            mb: 0.5,
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            {message.username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {format(message.timestamp, 'HH:mm')}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
          }}
        >
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              bgcolor: isOwnMessage ? 'primary.main' : 'background.paper',
              color: isOwnMessage ? 'primary.contrastText' : 'text.primary',
              borderRadius: 2,
              maxWidth: '100%',
              wordBreak: 'break-word',
            }}
          >
            <Typography variant="body1" component="div">
              {message.content}
            </Typography>
            {message.attachment && (
              <Box sx={{ mt: 1 }}>
                {message.attachment.type.startsWith('image/') && !imageError ? (
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      maxWidth: 300,
                      height: 200,
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={message.attachment.data}
                      alt={message.attachment.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      onError={handleImageError}
                    />
                  </Box>
                ) : (
                  <Link
                    href={message.attachment.data}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'inherit',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {getFileIcon()}
                    <Typography variant="body2" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {message.attachment.name}
                    </Typography>
                    <DownloadIcon />
                  </Link>
                )}
              </Box>
            )}
          </Paper>
          {message.reactions && message.reactions.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
              {renderReactionBadges()}
            </Box>
          )}
          <IconButton
            size="small"
            onClick={handleReactionClick}
            sx={{
              mt: 0.5,
              opacity: 0.6,
              '&:hover': {
                opacity: 1,
              },
            }}
          >
            <AddReactionIcon />
          </IconButton>
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={showReactions}
        onClose={handleReactionClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ display: 'flex', p: 1, gap: 0.5 }}>
          {REACTION_EMOJIS.map((emoji) => (
            <MenuItem
              key={emoji}
              onClick={() => handleReaction(emoji)}
              sx={{
                minWidth: 'auto',
                p: 0.5,
              }}
            >
              {emoji}
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </Box>
  );
};

export default ChatMessage;
