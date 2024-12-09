'use client';

import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Avatar, 
  Box, 
  IconButton, 
  useMediaQuery, 
  useTheme 
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  MoreVert as MoreVertIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSocket } from '@/lib/socket/context';
import { useRouter } from 'next/navigation';

interface ChatNavbarProps {
  activeChat: string | null;
  onMenuClick: () => void;
}

export default function ChatNavbar({ activeChat, onMenuClick }: ChatNavbarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { username, disconnect } = useSocket();
  const router = useRouter();

  const handleLogout = () => {
    disconnect();
    router.push('/');
  };

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={0}
      sx={{ 
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper'
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="menu" 
            sx={{ mr: 2 }}
            onClick={onMenuClick}
          >
            <MenuIcon />
          </IconButton>
        )}

        {activeChat ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{ display: 'flex', alignItems: 'center', width: '100%' }}
          >
            <Avatar sx={{ width: 40, height: 40, mr: 2 }}>
              {activeChat[0].toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div">
                {activeChat}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Online
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
              <IconButton onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Box>
          </motion.div>
        ) : (
          <Typography variant="h6" color="text.secondary" sx={{ ml: isMobile ? 0 : 3 }}>
            ChitChat
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}
