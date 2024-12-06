'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Avatar, Paper, Modal, IconButton, Fade } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/lib/socket/context';
import { getRelativeTime } from '@/utils/timeUtils';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    username: string;
    timestamp: number;
    reactions: { [key: string]: string[] };
    private?: boolean;
    to?: string;
    attachment?: {
      type: string;
      name: string;
      data: string;
    };
  };
  isOwnMessage: boolean;
}

const REACTION_HOVER_DELAY = 500; // ms

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => {
  const { sendReaction, socket } = useSocket();
  const [showReactions, setShowReactions] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const reactionPanelRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<NodeJS.Timeout>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        reactionPanelRef.current &&
        !reactionPanelRef.current.contains(event.target as Node) &&
        messageRef.current &&
        !messageRef.current.contains(event.target as Node)
      ) {
        setShowReactions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
    }
    hoverTimer.current = setTimeout(() => {
      setShowReactions(true);
    }, REACTION_HOVER_DELAY);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
    }
    
    // Don't hide if moving to reaction panel
    const rect = reactionPanelRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return;
      }
    }
    
    setShowReactions(false);
  };

  const handleReaction = (emoji: string) => {
    sendReaction(message.id, emoji);
  };

  const handleMediaClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const isImage = message.attachment?.type?.startsWith('image/');
  const isVideo = message.attachment?.type?.startsWith('video/');

  const renderMedia = () => {
    if (!message.attachment || mediaError) return null;

    if (isImage) {
      return (
        <>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: { xs: '100%', sm: 300 },
              borderRadius: 2,
              overflow: 'hidden',
              mb: message.text ? 1 : 0,
              cursor: 'pointer',
              '&:hover .zoom-overlay': {
                opacity: 1,
              },
            }}
            onClick={handleMediaClick}
          >
            <img
              src={message.attachment.data}
              alt={message.attachment.name}
              style={{ 
                width: '100%',
                height: 'auto',
                maxHeight: '300px',
                objectFit: 'contain',
                backgroundColor: 'rgba(0,0,0,0.03)',
                borderRadius: '8px'
              }}
              onError={() => setMediaError(true)}
            />
            <Box
              className="zoom-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.3)',
                opacity: 0,
                transition: 'opacity 0.2s',
              }}
            >
              <ZoomInIcon sx={{ color: 'white', fontSize: '2rem' }} />
            </Box>
          </Box>

          <Modal
            open={openModal}
            onClose={handleCloseModal}
            closeAfterTransition
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
            }}
          >
            <Fade in={openModal}>
              <Box
                sx={{
                  position: 'relative',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 24,
                  p: 1,
                }}
              >
                <IconButton
                  onClick={handleCloseModal}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    bgcolor: 'rgba(0,0,0,0.4)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.6)',
                    },
                    zIndex: 1,
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <img
                  src={message.attachment.data}
                  alt={message.attachment.name}
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '80vh',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            </Fade>
          </Modal>
        </>
      );
    }

    if (isVideo) {
      return (
        <>
          <Box
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', sm: 300 },
              borderRadius: 2,
              overflow: 'hidden',
              mb: message.text ? 1 : 0,
              cursor: 'pointer',
              position: 'relative',
              '&:hover .zoom-overlay': {
                opacity: 1,
              },
            }}
            onClick={handleMediaClick}
          >
            <video
              ref={videoRef}
              style={{ 
                width: '100%',
                height: 'auto',
                maxHeight: '300px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0,0,0,0.03)',
                objectFit: 'contain'
              }}
              onError={() => setMediaError(true)}
            >
              <source src={message.attachment.data} type={message.attachment.type} />
              Your browser does not support the video tag.
            </video>
            <Box
              className="zoom-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.3)',
                opacity: 0,
                transition: 'opacity 0.2s',
              }}
            >
              <ZoomInIcon sx={{ color: 'white', fontSize: '2rem' }} />
            </Box>
          </Box>

          <Modal
            open={openModal}
            onClose={handleCloseModal}
            closeAfterTransition
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
            }}
          >
            <Fade in={openModal}>
              <Box
                sx={{
                  position: 'relative',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 24,
                  p: 1,
                }}
              >
                <IconButton
                  onClick={handleCloseModal}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    bgcolor: 'rgba(0,0,0,0.4)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.6)',
                    },
                    zIndex: 1,
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <video
                  controls
                  autoPlay
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '80vh',
                    borderRadius: '8px'
                  }}
                >
                  <source src={message.attachment.data} type={message.attachment.type} />
                  Your browser does not support the video tag.
                </video>
              </Box>
            </Fade>
          </Modal>
        </>
      );
    }

    return (
      <Box
        sx={{
          mt: message.text ? 1 : 0,
          p: 1,
          bgcolor: 'action.hover',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
          📎 {message.attachment.name}
        </Typography>
      </Box>
    );
  };

  const hasUserReacted = (emoji: string) => {
    return message.reactions[emoji]?.includes(socket?.auth.username || '') || false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
          mb: 2,
          mx: 2,
          maxWidth: { xs: '85%', sm: '70%' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: isOwnMessage ? 'row-reverse' : 'row',
            alignItems: 'flex-end',
            gap: 1,
            position: 'relative',
          }}
        >
          {!isOwnMessage && (
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: theme => theme.palette.primary.main,
                fontSize: '1rem',
              }}
            >
              {message.username[0].toUpperCase()}
            </Avatar>
          )}

          <Box sx={{ position: 'relative' }} ref={messageRef}>
            {!isOwnMessage && (
              <Typography
                variant="caption"
                sx={{
                  ml: 1.5,
                  mb: 0.5,
                  color: 'text.secondary',
                  fontWeight: 500,
                  display: 'block',
                }}
              >
                {message.username}
              </Typography>
            )}

            <Box
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              sx={{
                bgcolor: isOwnMessage ? 'primary.main' : 'background.paper',
                color: isOwnMessage ? 'primary.contrastText' : 'text.primary',
                position: 'relative',
                maxWidth: '100%',
                p: 1.5,
                borderRadius: isOwnMessage ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                boxShadow: theme => 
                  isOwnMessage 
                    ? `0 2px 12px ${theme.palette.primary.main}40`
                    : '0 2px 12px rgba(0, 0, 0, 0.08)',
                backdropFilter: 'blur(10px)',
                minWidth: message.text ? '60px' : 'auto',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-end',
                gap: 1,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  [isOwnMessage ? 'right' : 'left']: -10,
                  width: 20,
                  height: 20,
                  bgcolor: 'inherit',
                  clipPath: isOwnMessage 
                    ? 'polygon(0 0, 100% 0, 100% 100%)'
                    : 'polygon(0 0, 100% 0, 0 100%)',
                },
              }}
            >
              {renderMedia()}
              {message.text && (
                <Typography
                  variant="body1"
                  sx={{
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {message.text}
                </Typography>
              )}
            </Box>

            <AnimatePresence>
              {showReactions && (
                <motion.div
                  ref={reactionPanelRef}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => setShowReactions(true)}
                  onMouseLeave={() => setShowReactions(false)}
                  style={{
                    position: 'absolute',
                    top: -45,
                    [isOwnMessage ? 'right' : 'left']: 0,
                    zIndex: 1,
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      display: 'flex',
                      p: 0.5,
                      borderRadius: 3,
                      gap: 0.5,
                      bgcolor: 'background.paper',
                    }}
                  >
                    {['👍', '❤️', '😊', '😂', '😮'].map(emoji => (
                      <Box
                        key={emoji}
                        onClick={() => handleReaction(emoji)}
                        sx={{
                          cursor: 'pointer',
                          p: 0.5,
                          borderRadius: 1,
                          transition: 'all 0.2s',
                          bgcolor: hasUserReacted(emoji) ? 'action.selected' : 'transparent',
                          '&:hover': {
                            bgcolor: 'action.hover',
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        {emoji}
                      </Box>
                    ))}
                  </Paper>
                </motion.div>
              )}
            </AnimatePresence>

            {Object.keys(message.reactions).length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.5,
                  mt: 0.5,
                  justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                  position: 'absolute',
                  bottom: -24,
                  [isOwnMessage ? 'right' : 'left']: 0,
                  minWidth: '100%',
                  maxWidth: 'none',
                  width: 'auto',
                  whiteSpace: 'nowrap',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 0.5,
                    flexWrap: 'nowrap',
                  }}
                >
                  {Object.entries(message.reactions).map(([emoji, users]) => (
                    <Box
                      key={`${message.id}-${emoji}`}
                      onClick={() => handleReaction(emoji)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        bgcolor: hasUserReacted(emoji) ? 'action.selected' : 'action.hover',
                        borderRadius: 4,
                        px: 1,
                        py: 0.25,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.selected',
                        },
                      }}
                    >
                      <span>{emoji}</span>
                      <span>{users.length}</span>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            mt: Object.keys(message.reactions).length > 0 ? 3 : 0.5,
            [isOwnMessage ? 'mr' : 'ml']: 1.5,
            fontSize: '0.75rem',
          }}
        >
          {getRelativeTime(message.timestamp)}
        </Typography>
      </Box>
    </motion.div>
  );
};

export default ChatMessage;
