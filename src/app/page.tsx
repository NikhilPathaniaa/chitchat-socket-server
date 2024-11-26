'use client';

import { useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import UserLogin from '@/components/UserLogin';
import ChatPage from '@/components/ChatPage';

export default function Home() {
  const { username, isConnected } = useSocket();

  useEffect(() => {
    console.log('Login state:', { username, isConnected });
  }, [username, isConnected]);

  if (!username) {
    return <UserLogin />;
  }

  return <ChatPage />;
}
