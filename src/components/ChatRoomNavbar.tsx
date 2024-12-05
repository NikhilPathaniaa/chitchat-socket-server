'use client';

import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSocket } from '@/lib/socket/context';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const MotionBox = motion(Box);

export default function ChatRoomNavbar() {
  const { socket } = useSocket();

  const handleLogout = () => {
    Cookies.remove('username');
    if (socket) {
      socket.disconnect();
    }
    window.location.href = '/';
  };

  return (
    <MotionBox
      component="nav"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        position: 'sticky',
        top: 0,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        px: 3,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {/* Logo and Title */}
      <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <MotionBox
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            cursor: 'pointer'
          }}
        >
          <MotionBox
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
              p: 1,
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(33, 150, 243, 0.15)',
            }}
          >
            <ChatBubbleOutlineIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
          </MotionBox>
          <Box>
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
        </MotionBox>
      </Link>

      {/* User Info and Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {socket && (
          <>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 600,
                color: 'text.secondary'
              }}
            >
              {socket.auth.username}
            </Typography>
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} size="small">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
    </MotionBox>
  );
}
