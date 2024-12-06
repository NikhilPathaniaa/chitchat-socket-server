'use client';

import { useRef, useEffect } from 'react';
import { Box, Paper, Typography, Badge, Avatar, Divider } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/lib/socket/context';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatNavbar from './ChatNavbar';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';

const userListVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const userItemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  },
  hover: { 
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const messageVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  },
  exit: { 
    x: -20, 
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  }
};

export default function ChatRoom() {
  const { messages, username, onlineUsers } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!messages || !username) return null;

  const otherUsers = onlineUsers.filter(user => user.username !== username);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ChatNavbar />
      
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex',
          mt: 8,
          position: 'relative',
          bgcolor: 'background.default'
        }}
      >
        {/* Fixed Online Users List - Now on Left */}
        <Paper
          component={motion.div}
          variants={userListVariants}
          initial="hidden"
          animate="visible"
          elevation={0}
          sx={{
            width: 240,
            height: 'calc(100vh - 64px)',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white'
          }}>
            <PeopleAltRoundedIcon />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Online Users
            </Typography>
            <Badge 
              badgeContent={otherUsers.length} 
              color="error"
              sx={{ 
                ml: 'auto',
                '& .MuiBadge-badge': { 
                  fontSize: '0.8rem',
                  background: 'linear-gradient(45deg, #FF512F 30%, #F09819 90%)'
                }
              }}
            />
          </Box>

          <Divider />
          
          <Box sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 2,
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0,0,0,0.1)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(0,0,0,0.2)',
            }
          }}>
            <AnimatePresence mode="popLayout">
              {otherUsers.map((user, index) => (
                <motion.div
                  key={user.username}
                  variants={userItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: -20 }}
                  whileHover="hover"
                  layout
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.05) 30%, rgba(33, 203, 243, 0.05) 90%)',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1) 30%, rgba(33, 203, 243, 0.1) 90%)',
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: `linear-gradient(45deg, ${
                          ['#FF512F', '#DD2476', '#4A00E0', '#8E2DE2'][index % 4]
                        } 30%, ${
                          ['#F09819', '#FF512F', '#8E2DE2', '#4A00E0'][index % 4]
                        } 90%)`,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      {user.username[0].toUpperCase()}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {user.username}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="success.main"
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: 'success.main',
                            boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)'
                          }}
                        />
                        Online
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        </Paper>

        {/* Main Chat Area */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          sx={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 64px)',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              padding: '24px',
              paddingTop: '40px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
            ref={messagesEndRef}
          >
            {messages
              .filter(msg => !msg.private || (msg.private && (msg.to === username || msg.username === username)))
              .map((message) => (
                <Box
                  component={motion.div}
                  key={`${message.id}-${message.timestamp}`}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.username === username ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <ChatMessage message={message} isOwnMessage={message.username === username} />
                </Box>
              ))}
          </Box>
          <ChatInput />
        </Box>
      </Box>
    </Box>
  );
}
