'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/lib/socket/context';
import ChatRoom from '@/components/chat/ChatRoom';

export default function ChatRoomPage() {
  const { username } = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (!username) {
      router.push('/chat');
    }
  }, [username, router]);

  if (!username) return null;

  return <ChatRoom />;
}
