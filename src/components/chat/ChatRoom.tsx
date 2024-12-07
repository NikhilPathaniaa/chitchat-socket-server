'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, Container, List, ListItem, ListItemAvatar, ListItemText, Button, AppBar, Toolbar, TextField, Chip, Avatar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import { useSocket } from '@/lib/socket/context';
import { Message } from '../../types/message';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import { useRouter } from 'next/navigation';

export default function ChatRoom() {
  const { messages, username, onlineUsers, sendMessage, addReaction, removeReaction, disconnect } = useSocket();
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showUserList, setShowUserList] = useState(true);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter messages for private chat
  const filteredMessages = messages.filter(message => 
    (message.from === username && message.to === selectedUser) ||
    (message.username === username && message.to === selectedUser) || // For backward compatibility
    (message.from === selectedUser && message.to === username) ||
    (message.username === selectedUser && message.to === username)    // For backward compatibility
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && selectedUser) {
      await sendMessage(messageText, null, selectedUser);
      setMessageText('');
      setShowEmojiPicker(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedUser) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        await sendMessage('', file, selectedUser);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleLogout = () => {
    disconnect();
    router.push('/chat');
  };

  const REACTION_EMOJIS = ['👍', '❤️', '😊', '😂', '🎉', '👏'];

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days} days ago`;
    
    return new Date(timestamp).toLocaleDateString();
  };

  const MessageBubble = ({ message }: { message: Message }) => {
    const isOwnMessage = message.from === username || message.username === username;
    const [showReactions, setShowReactions] = useState(false);

    const handleReaction = (emoji: string) => {
      const reactions = message.reactions || {};
      const hasReacted = reactions[emoji]?.includes(username);
      
      if (hasReacted) {
        removeReaction(message.id, emoji);
      } else {
        addReaction(message.id, emoji);
      }
    };

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
          mb: 2,
          maxWidth: '70%',
          alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
          position: 'relative',
        }}
        onMouseEnter={() => setShowReactions(true)}
        onMouseLeave={() => setShowReactions(false)}
      >
        {/* Sender Name */}
        <Typography
          variant="caption"
          sx={{
            ml: isOwnMessage ? 0 : 2,
            mr: isOwnMessage ? 2 : 0,
            mb: 0.5,
            color: 'text.secondary',
          }}
        >
          {isOwnMessage ? 'You' : (message.from ?? message.username ?? 'Unknown Sender')}
        </Typography>

        <Box sx={{ position: 'relative' }}>
          {/* Message Content */}
          <Paper
            elevation={2}
            sx={{
              p: 1.5,
              bgcolor: isOwnMessage ? 'primary.main' : 'grey.100',
              color: isOwnMessage ? 'primary.contrastText' : 'text.primary',
              borderRadius: isOwnMessage ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.01)',
                boxShadow: 3,
              }
            }}
          >
            <Typography 
              variant="body1" 
              component="div"
              sx={{
                '& .emoji-text': {
                  fontSize: '2.5rem',
                  verticalAlign: 'middle',
                  display: 'inline-block',
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.1) translateY(-2px)',
                  }
                },
                '& .text-word': {
                  fontSize: '1rem',
                }
              }}
            >
              {message.text.split(' ').map((word, index) => {
                // Check if the word consists only of emojis
                const isOnlyEmojis = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F100}-\u{1F1FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}]+$/u.test(word);
                return isOnlyEmojis ? (
                  <span key={index} className="emoji-text">{word} </span>
                ) : (
                  <span key={index} className="text-word">{word} </span>
                );
              })}
              {message.fileUrl && (
                <Box 
                  component="img" 
                  src={message.fileUrl} 
                  alt="Uploaded content" 
                  sx={{ 
                    maxWidth: '100%', 
                    mt: 1,
                    borderRadius: 1,
                    boxShadow: 1
                  }} 
                />
              )}
            </Typography>

            {/* Display Reactions Count */}
            {message.reactions && Object.keys(message.reactions).length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.5,
                  mt: 1,
                }}
              >
                {(Object.entries(message.reactions) as [string, string[]][]).map(([emoji, users]) => (
                  <Chip
                    key={emoji}
                    label={
                      <span style={{ fontSize: '1.2rem' }}>
                        {emoji} <span style={{ fontSize: '0.8rem' }}>{users.length}</span>
                      </span>
                    }
                    size="small"
                    onClick={() => handleReaction(emoji)}
                    sx={{
                      bgcolor: users.includes(username) ? 'primary.light' : 'background.paper',
                      color: users.includes(username) ? 'white' : 'text.primary',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        bgcolor: users.includes(username) ? 'primary.main' : 'primary.light',
                        color: 'white',
                        transform: 'scale(1.1)',
                      }
                    }}
                  />
                ))}
              </Box>
            )}
          </Paper>

          {/* Quick Reaction Panel */}
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: -40,
              left: isOwnMessage ? 'auto' : 0,
              right: isOwnMessage ? 0 : 'auto',
              transform: showReactions 
                ? 'translateY(0) scale(1)' 
                : 'translateY(0) scale(0.8)',
              display: 'flex',
              flexDirection: 'row',
              gap: 0.5,
              p: 0.5,
              bgcolor: 'background.paper',
              borderRadius: 3,
              opacity: showReactions ? 1 : 0,
              visibility: showReactions ? 'visible' : 'hidden',
              transition: 'all 0.2s ease-in-out',
              zIndex: 1000,
              boxShadow: 2,
              transformOrigin: isOwnMessage ? 'right center' : 'left center',
            }}
          >
            {REACTION_EMOJIS.map((emoji) => {
              const hasReacted = message.reactions?.[emoji]?.includes(username);
              return (
                <IconButton
                  key={emoji}
                  size="small"
                  onClick={() => handleReaction(emoji)}
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: '1.1rem',
                    color: hasReacted ? 'primary.main' : 'text.secondary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      transform: 'scale(1.1)',
                      color: 'primary.main',
                    },
                    '@keyframes float': {
                      '0%': {
                        transform: 'translateY(0px)',
                      },
                      '50%': {
                        transform: 'translateY(-3px)',
                      },
                      '100%': {
                        transform: 'translateY(0px)',
                      },
                    },
                    '&:hover > .emoji': {
                      animation: 'float 1s ease-in-out infinite',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <span className="emoji">{emoji}</span>
                </IconButton>
              );
            })}
          </Paper>
        </Box>

        {/* Timestamp */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            mt: 0.5,
            ml: isOwnMessage ? 0 : 2,
            mr: isOwnMessage ? 2 : 0,
            fontSize: '0.7rem',
            opacity: 0.8,
            fontStyle: 'italic',
          }}
        >
          {formatRelativeTime(message.timestamp)}
        </Typography>
      </Box>
    );
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        p: { xs: 0, sm: 2 },
      }}
    >
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          {isMobile ? (
            <IconButton edge="start" onClick={() => router.push('/chat')}>
              <ArrowBackIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                p: 1,
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(33, 150, 243, 0.15)',
              }}>
                <ChatBubbleOutlineIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                  letterSpacing: '-0.5px'
                }}
              >
                ChitChat
              </Typography>
            </Box>
          )}
          
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', ml: 2 }}>
            {selectedUser && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                  {selectedUser[0].toUpperCase()}
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {selectedUser}
                </Typography>
              </Box>
            )}
          </Box>
          <IconButton onClick={handleLogout} sx={{ ml: 2 }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ 
        flex: 1, 
        display: 'flex',
        overflow: 'hidden',
      }}>
        {/* Messages Section */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: 'background.paper',
          borderRadius: { xs: 0, sm: 1 },
        }}>
          {selectedUser ? (
            <>
              {/* Messages List */}
              <Box sx={{ 
                flex: 1, 
                overflow: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
              }}>
                {filteredMessages.map((message, index) => (
                  <MessageBubble key={index} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </Box>

              {/* Input Section */}
              <Box 
                component="form" 
                onSubmit={handleSend}
                sx={{ 
                  p: 2, 
                  borderTop: 1, 
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  gap: 1,
                  alignItems: 'flex-end',
                  position: 'relative', 
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  accept="image/*,video/*,application/*"
                />
                <IconButton onClick={() => fileInputRef.current?.click()}>
                  <AttachFileIcon />
                </IconButton>
                <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                  <EmojiEmotionsIcon color={showEmojiPicker ? "primary" : "inherit"} />
                </IconButton>
                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '0',
                        zIndex: 1000,
                        marginBottom: '8px',
                      }}
                    >
                      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <EmojiPicker
                          onEmojiClick={(emojiObject) => {
                            setMessageText(prev => prev + emojiObject.emoji);
                            setShowEmojiPicker(false);
                          }}
                          width={300}
                          height={400}
                        />
                      </Paper>
                    </motion.div>
                  )}
                </AnimatePresence>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                />
                <IconButton 
                  type="submit" 
                  disabled={!messageText.trim()}
                  color="primary"
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
              p: 3,
              textAlign: 'center'
            }}>
              <Typography variant="h6" color="text.secondary">
                Select a user to start chatting
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose from the online users list to begin a private conversation
              </Typography>
            </Box>
          )}
        </Box>

        {/* Online Users Section */}
        {(!isMobile || showUserList) && (
          <Paper sx={{ 
            width: { xs: '100%', sm: 240 },
            ml: { xs: 0, sm: 2 },
            display: { xs: showUserList ? 'block' : 'none', sm: 'block' },
            position: { xs: 'absolute', sm: 'relative' },
            height: '100%',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: { xs: 0, sm: 1 },
          }}>
            <List>
              {onlineUsers
                .filter(user => user !== username)
                .map((user, index) => (
                  <ListItem 
                    key={index}
                    button
                    selected={selectedUser === user}
                    onClick={() => setSelectedUser(user)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: selectedUser === user ? 'primary.main' : 'grey.400' }}>
                        {user[0].toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user} />
                  </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </Container>
  );
}
