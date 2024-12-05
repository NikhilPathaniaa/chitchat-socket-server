'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { SOCKET_URL, SOCKET_CONFIG } from './config';

export interface Message {
  id: string;
  text: string;
  username: string;
  timestamp: number;
  fileType?: string;
  fileName?: string;
  fileData?: string;
  reactions?: { [key: string]: string[] };
}

interface SocketAuth {
  username: string;
}

interface SocketWithAuth extends Socket {
  auth: SocketAuth;
}

interface SocketContextType {
  socket: SocketWithAuth | null;
  messages: Message[];
  onlineUsers: string[];
  connect: (username: string) => void;
  disconnect: () => void;
  sendMessage: (text: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  messages: [],
  onlineUsers: [],
  connect: () => {},
  disconnect: () => {},
  sendMessage: () => {},
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<SocketWithAuth | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const connect = (username: string) => {
    const newSocket = io(SOCKET_URL, {
      ...SOCKET_CONFIG,
      auth: { username },
    }) as SocketWithAuth;

    newSocket.on('connect', () => {
      toast.success('Connected to chat!');
    });

    newSocket.on('disconnect', () => {
      toast.error('Disconnected from chat');
    });

    newSocket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('users', (users: string[]) => {
      setOnlineUsers(users);
    });

    newSocket.on('connect_error', (error) => {
      toast.error('Failed to connect: ' + error.message);
    });

    setSocket(newSocket);
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setMessages([]);
      setOnlineUsers([]);
      toast.success('Disconnected from chat');
    }
  };

  const sendMessage = (text: string) => {
    if (socket) {
      const message: Omit<Message, 'id' | 'timestamp'> = {
        text,
        username: socket.auth.username,
      };
      socket.emit('message', message);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        messages,
        onlineUsers,
        connect,
        disconnect,
        sendMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
