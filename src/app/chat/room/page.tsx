'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatRoom from '@/components/chat/ChatRoom';
import { useSocket } from '@/lib/socket/context';
import { Box, CircularProgress } from '@mui/material';

export default function ChatRoomPage() {
  const router = useRouter();
  const { username, socket } = useSocket();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Wait for socket context to be fully initialized
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!username || !socket) {
        console.log('No username or socket, redirecting to chat page');
        router.replace('/chat');
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [username, socket, router]);

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!username || !socket) {
    return null;
  }

  return <ChatRoom />;
}
