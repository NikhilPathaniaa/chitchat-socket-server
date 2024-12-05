'use client';

import { Box, Typography, Paper, IconButton, Tooltip, Menu, MenuItem, Avatar } from '@mui/material';
import Image from 'next/image';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import ImageIcon from '@mui/icons-material/Image';
import DownloadIcon from '@mui/icons-material/Download';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import { format } from 'date-fns';
import { useState } from 'react';
import { Message } from '@/lib/socket/context';
import { useSocket } from '@/lib/socket/context';
import toast from 'react-hot-toast';

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '👏'];

export default function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
  const { socket } = useSocket();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getFileIcon = () => {
    if (!message.fileType) return null;
    if (message.fileType.startsWith('image/')) return <ImageIcon />;
    if (message.fileType.startsWith('video/')) return <VideoFileIcon />;
    return <FileIcon />;
  };

  const handleFileDownload = () => {
    if (!message.fileData || !message.fileName) {
      toast.error('File data or name is missing');
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.href = message.fileData;
      link.download = message.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download file:', error);
      toast.error('Failed to download file');
    }
  };

  const handleReactionClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!socket) {
      toast.error('Not connected to chat');
      return;
    }
    setAnchorEl(event.currentTarget);
    setShowReactions(true);
  };

  const handleReactionClose = () => {
    setAnchorEl(null);
    setShowReactions(false);
  };

  const addReaction = (reaction: string) => {
    if (!socket) {
      toast.error('Not connected to chat');
      return;
    }
    socket.emit('add_reaction', {
      messageId: message.id,
      reaction,
    });
    handleReactionClose();
  };

  const removeReaction = (reaction: string) => {
    if (!socket) {
      toast.error('Not connected to chat');
      return;
    }
    socket.emit('remove_reaction', {
      messageId: message.id,
      reaction,
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const renderReactionBadges = () => {
    if (!message.reactions) return null;
    return Object.entries(message.reactions).map(([emoji, users]) => (
      <Tooltip
        key={emoji}
        title={users.join(', ')}
        placement="top"
        arrow
      >
        <Paper
          onClick={() => {
            if (!socket?.auth.username) return;
            const hasReacted = users.includes(socket.auth.username);
            if (hasReacted) {
              removeReaction(emoji);
            } else {
              addReaction(emoji);
            }
          }}
          sx={{
            px: 1,
            py: 0.5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: socket?.auth.username && users.includes(socket.auth.username) 
              ? 'primary.light' 
              : 'background.paper',
            '&:hover': {
              bgcolor: socket?.auth.username && users.includes(socket.auth.username)
                ? 'primary.main'
                : 'action.hover',
            },
            color: socket?.auth.username && users.includes(socket.auth.username)
              ? 'primary.contrastText'
              : 'text.primary',
          }}
        >
          <span>{emoji}</span>
          <Typography variant="caption">{users.length}</Typography>
        </Paper>
      </Tooltip>
    ));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mb: 0.5 }}>
        {!isOwnMessage && (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              fontSize: '0.875rem',
            }}
          >
            {message.username.charAt(0).toUpperCase()}
          </Avatar>
        )}
        <Paper
          elevation={1}
          sx={{
            p: 1.5,
            maxWidth: '70%',
            bgcolor: isOwnMessage ? 'primary.main' : 'background.paper',
            color: isOwnMessage ? 'primary.contrastText' : 'text.primary',
            borderRadius: 2,
            position: 'relative',
          }}
        >
          {!isOwnMessage && (
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
            >
              {message.username}
            </Typography>
          )}
          <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
            {message.text}
          </Typography>
          {message.fileType?.startsWith('image/') && !imageError && message.fileData && (
            <Box
              sx={{
                mt: 1,
                position: 'relative',
                width: '100%',
                maxWidth: 300,
                height: 200,
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <Image
                src={message.fileData}
                alt="Shared image"
                fill
                style={{ objectFit: 'cover' }}
                onError={handleImageError}
              />
            </Box>
          )}
          {message.fileType && (
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              {getFileIcon()}
              <Typography variant="body2" sx={{ flex: 1 }}>
                {message.fileName}
              </Typography>
              <IconButton size="small" onClick={handleFileDownload}>
                <DownloadIcon />
              </IconButton>
            </Box>
          )}
          <Typography
            variant="caption"
            sx={{
              color: isOwnMessage ? 'primary.contrastText' : 'text.secondary',
              opacity: 0.8,
              display: 'block',
              mt: 0.5,
            }}
          >
            {format(message.timestamp, 'HH:mm')}
          </Typography>
        </Paper>
        <IconButton
          size="small"
          onClick={handleReactionClick}
          sx={{
            opacity: 0,
            transition: 'opacity 0.2s',
            '&:hover': { opacity: 1 },
            '.MuiBox-root:hover &': { opacity: 0.5 },
          }}
        >
          <AddReactionIcon />
        </IconButton>
      </Box>
      {message.reactions && Object.keys(message.reactions).length > 0 && (
        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
          {renderReactionBadges()}
        </Box>
      )}
      <Menu
        anchorEl={anchorEl}
        open={showReactions}
        onClose={handleReactionClose}
        sx={{ '& .MuiPaper-root': { maxWidth: 320 } }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', p: 1, gap: 0.5 }}>
          {QUICK_REACTIONS.map((emoji) => (
            <IconButton
              key={emoji}
              size="small"
              onClick={() => addReaction(emoji)}
            >
              <Typography>{emoji}</Typography>
            </IconButton>
          ))}
        </Box>
      </Menu>
    </Box>
  );
}
