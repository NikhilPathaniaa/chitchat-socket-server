'use client';

import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/lib/socket/context';

export default function ChatNavbar() {
  const { username, disconnect } = useSocket();
  const router = useRouter();

  const handleLogout = () => {
    disconnect();
    router.push('/chat');
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ChitChat - {username}
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
