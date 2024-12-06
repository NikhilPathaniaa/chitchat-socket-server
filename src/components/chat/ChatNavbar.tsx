'use client';

import { AppBar, Toolbar, Typography, IconButton, Box, Badge } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSocket } from '@/lib/socket/context';
import { useRouter } from 'next/navigation';

export default function ChatNavbar() {
  const { username, disconnect, onlineUsers } = useSocket();
  const router = useRouter();

  const handleLogout = () => {
    disconnect();
    router.push('/chat');
  };

  return (
    <AppBar position="fixed" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary' }}>
          ChitChat
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge 
            badgeContent={onlineUsers.length} 
            color="success"
            sx={{ mr: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Online Users
            </Typography>
          </Badge>
          
          <Typography variant="body2" color="text.secondary">
            {username}
          </Typography>

          <IconButton 
            color="primary" 
            onClick={handleLogout}
            sx={{ 
              ml: 1,
              '&:hover': {
                color: 'error.main',
                bgcolor: 'error.light',
              }
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
