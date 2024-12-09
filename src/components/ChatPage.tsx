'use client';

import React from 'react';
import { useSocket, type Message } from '@/lib/socket/context';
import { Paper, Typography, Box, Tabs, Tab, List, ListItem, ListItemText, ListItemButton, Avatar, Badge } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessage from '@/components/chat/ChatMessage';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
      style={{ height: '100%', display: value === index ? 'flex' : 'none', flexDirection: 'column' }}
    >
      {value === index && children}
    </div>
  );
}

const ChatPage = () => {
  const { socket, messages, onlineUsers, username, selectedUser, selectUser, ...rest } = useSocket();
  const [tabValue, setTabValue] = React.useState(0);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const typedOnlineUsers: string[] = onlineUsers || [];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 0) {
      selectUser(null); // Reset selected user when switching to public chat
    }
  };

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!socket) {
    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          p: 3,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Connecting to chat...
        </Typography>
      </Box>
    );
  }

  const publicMessages = messages.filter(m => !m.to);
  const privateMessages = messages.filter(m => 
    m.to && ((m.username === username && m.to === selectedUser) || 
    (m.username === selectedUser && m.to === username))
  );

  const currentMessages = tabValue === 0 ? publicMessages : privateMessages;

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
        borderRadius: 0,
      }}
    >
      {/* Left sidebar with tabs and user list */}
      <Box
        sx={{
          width: 280,
          borderRight: 1,
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="chat tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<PublicIcon />} 
            label="Public" 
            sx={{ flexGrow: 1 }}
          />
          <Tab 
            icon={<PersonIcon />} 
            label="Private" 
            sx={{ flexGrow: 1 }}
          />
        </Tabs>

        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <TabPanel value={tabValue} index={0}>
            <Typography variant="subtitle2" sx={{ p: 2, color: 'text.secondary' }}>
              Public Chat Room
            </Typography>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <List>
              {typedOnlineUsers
                .filter((user: string) => user !== username)
                .map((user: string) => (
                  <ListItem key={user} disablePadding>
                    <ListItemButton
                      selected={selectedUser === user}
                      onClick={() => selectUser(user)}
                    >
                      <Avatar sx={{ mr: 2 }}>{user.charAt(0).toUpperCase()}</Avatar>
                      <ListItemText primary={user} />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          </TabPanel>
        </Box>
      </Box>

      {/* Main chat area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <AnimatePresence>
            {currentMessages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwnMessage={message.username === username}
                currentUser={username}
              />
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <ChatInput privateChat={tabValue === 1} recipient={selectedUser} />
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatPage;
