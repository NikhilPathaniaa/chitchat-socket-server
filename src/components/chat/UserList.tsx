'use client';

import React from 'react';
import { Box, Typography, Avatar, Badge } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import TagIcon from '@mui/icons-material/Tag';

interface UserListProps {
  users: string[];
  selectedUser: string | null;
  currentUsername: string;
  onSelectUser: (username: string | null) => void;
}

export default function UserList({
  users,
  selectedUser,
  currentUsername,
  onSelectUser,
}: UserListProps) {
  const otherUsers = users.filter((user) => user !== currentUsername);

  return (
    <Box sx={{ p: 2 }}>
      <Box
        onClick={() => onSelectUser(null)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          borderRadius: 2,
          cursor: 'pointer',
          bgcolor: !selectedUser ? 'primary.light' : 'transparent',
          transition: 'background-color 0.2s',
          '&:hover': {
            bgcolor: !selectedUser ? 'primary.light' : 'action.hover',
          },
        }}
      >
        <Avatar sx={{ bgcolor: 'secondary.main' }}>
          <TagIcon />
        </Avatar>
        <Box>
          <Typography variant="body1" fontWeight={500}>
            Group Chat
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {users.length} members
          </Typography>
        </Box>
      </Box>

      <Typography
        variant="overline"
        sx={{
          display: 'block',
          color: 'text.secondary',
          px: 2,
          mt: 3,
          mb: 1,
        }}
      >
        Direct Messages
      </Typography>

      <AnimatePresence initial={false}>
        {otherUsers.map((username, index) => (
          <motion.div
            key={username}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.1 }}
          >
            <Box
              onClick={() => onSelectUser(username)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2,
                cursor: 'pointer',
                bgcolor: selectedUser === username ? 'primary.light' : 'transparent',
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: selectedUser === username ? 'primary.light' : 'action.hover',
                },
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                color="success"
              >
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {username[0].toUpperCase()}
                </Avatar>
              </Badge>
              <Box>
                <Typography variant="body1" fontWeight={500}>
                  {username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Online
                </Typography>
              </Box>
            </Box>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
}
