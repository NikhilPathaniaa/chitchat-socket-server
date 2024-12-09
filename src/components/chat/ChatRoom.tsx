import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Paper, 
  IconButton, 
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Chat as ChatIcon, 
  People as PeopleIcon, 
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

import ChatNavbar from './ChatNavbar';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { useSocketContext } from '@/lib/socket/context';

const SIDEBAR_WIDTH = 300;

export default function ChatRoom() {
  const { socket, username, onlineUsers, messages, selectedUser } = useSocketContext();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessages = () => {
    // Filter messages based on active chat
    const filteredMessages = messages.filter(message => {
      // Public messages or messages between current user and active chat
      const isPublicMessage = !message.private;
      const isSentByCurrentUser = message.username === username;
      const isSentToCurrentUser = message.to === username;
      const isSentToActiveChat = message.to === activeChat;
      const isSentByActiveChat = message.username === activeChat;

      console.log('Message Filtering:', {
        message,
        username,
        activeChat,
        isPublicMessage,
        isSentByCurrentUser,
        isSentToCurrentUser,
        isSentToActiveChat,
        isSentByActiveChat
      });

      return (
        isPublicMessage || 
        (message.private && (
          (isSentByCurrentUser && isSentToActiveChat) ||
          (isSentByActiveChat && isSentToCurrentUser)
        ))
      );
    });

    console.log('Filtered Messages:', filteredMessages);

    return filteredMessages.map((message, index) => {
      // Determine if the message is from the current user
      const isOwnMessage = message.username === username;
      
      console.log('Rendering Message:', {
        username: message.username,
        currentUser: username,
        isOwnMessage
      });

      return (
        <ChatMessage 
          key={message.id} 
          message={message} 
          isOwnMessage={isOwnMessage} 
          currentUser={username}
        />
      );
    });
  };

  const renderUserList = () => {
    return (
      <List>
        {onlineUsers
          .filter((user: string) => user !== username)
          .map((user: string) => (
            <motion.div
              key={user}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ListItem 
                button 
                onClick={() => {
                  setActiveChat(user);
                  if (isMobile) setIsSidebarOpen(false);
                }}
                selected={activeChat === user}
              >
                <ListItemAvatar>
                  <Avatar>{user.charAt(0).toUpperCase()}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={user} />
              </ListItem>
            </motion.div>
          ))}
      </List>
    );
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        height: '100vh', 
        bgcolor: 'background.default' 
      }}
    >
      {/* Sidebar for Mobile */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? isSidebarOpen : true}
        onClose={() => setIsSidebarOpen(false)}
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: `1px solid ${theme.palette.divider}`
          }
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2,
            justifyContent: 'space-between' 
          }}
        >
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <PeopleIcon sx={{ mr: 1 }} /> Online Users
          </Typography>
          {isMobile && (
            <IconButton onClick={() => setIsSidebarOpen(false)}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        <Divider />
        {renderUserList()}
      </Drawer>

      {/* Main Chat Area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Navbar */}
        <ChatNavbar 
          activeChat={activeChat} 
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Messages Area */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            py: 2,
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {activeChat ? (
            <AnimatePresence>
              {renderMessages()}
            </AnimatePresence>
          ) : (
            <Box 
              sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                flexDirection: 'column'
              }}
            >
              <ChatIcon 
                sx={{ 
                  fontSize: 100, 
                  color: 'text.secondary', 
                  mb: 2 
                }} 
              />
              <Typography variant="h6" color="text.secondary">
                Select a user to start chatting
              </Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Chat Input */}
        {activeChat && (
          <ChatInput 
            privateChat={true} 
            recipient={activeChat} 
          />
        )}
      </Box>
    </Box>
  );
}
