'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/lib/socket/context';
import ChatRoom from '@/components/chat/ChatRoom';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function ChatRoomPage() {
  const router = useRouter();
  const { isConnected, username } = useSocket();

  useEffect(() => {
    if (!isConnected || !username) {
      router.replace('/chat');
    }
  }, [isConnected, username, router]);

  if (!isConnected || !username) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Redirecting to login...
        </Typography>
      </Box>
    );
  }

  return <ChatRoom />;
}
