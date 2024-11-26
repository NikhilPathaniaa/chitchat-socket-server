'use client';

import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSocket } from '@/context/SocketContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import OnlineUsers from './OnlineUsers';

export default function ChatPage() {
  const { messages, username, selectedUser, setSelectedUser } = useSocket();

  const handleSelectUser = (username: string) => {
    setSelectedUser(username);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* Online Users List - Always visible on desktop, toggles on mobile */}
      <Box
        sx={{
          width: { xs: selectedUser ? '0' : '100%', md: '300px' },
          borderRight: 1,
          borderColor: 'divider',
          display: { xs: selectedUser ? 'none' : 'block', md: 'block' },
          overflow: 'hidden',
        }}
      >
        <OnlineUsers
          selectedUser={selectedUser}
          onSelectUser={handleSelectUser}
        />
      </Box>

      {/* Chat Area - Shows when user is selected */}
      <Box
        sx={{
          flex: 1,
          display: { xs: selectedUser ? 'flex' : 'none', md: 'flex' },
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* Chat Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: 'background.paper',
          }}
        >
          <IconButton 
            sx={{ display: { xs: 'block', md: 'none' } }}
            onClick={() => setSelectedUser(null)}
          >
            <ArrowBackIcon />
          </IconButton>
          {selectedUser && (
            <Typography variant="h6">
              {selectedUser}
            </Typography>
          )}
        </Box>

        {/* Messages Area */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              isOwnMessage={message.from === username}
            />
          ))}
        </Box>

        {/* Chat Input */}
        {selectedUser && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <ChatInput />
          </Box>
        )}
      </Box>
    </Box>
  );
}
