'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message {
  from?: string;
  message: string;
  fileData?: string;
  fileName?: string;
  fileType?: string;
}

interface OnlineUser {
  id: string;
  username: string;
}

interface SocketContextType {
  socket: Socket | null;
  username: string | null;
  isConnected: boolean;
  messages: Message[];
  onlineUsers: OnlineUser[];
  login: (username: string) => void;
  sendMessage: (message: string, file?: File) => void;
  selectedUser: string | null;
  setSelectedUser: (username: string | null) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  username: null,
  isConnected: false,
  messages: [],
  onlineUsers: [],
  login: () => {},
  sendMessage: () => {},
  selectedUser: null,
  setSelectedUser: () => {},
});

export const useSocket = () => useContext(SocketContext);

const getSocketUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:3001';
  
  return process.env.NEXT_PUBLIC_SOCKET_URL || 
    (process.env.NODE_ENV === 'production' 
      ? window.location.origin 
      : 'http://localhost:3001');
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io(getSocketUrl(), {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('private_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('users', (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    newSocket.on('login_success', () => {
      console.log('Login successful');
    });

    newSocket.on('login_error', (error: string) => {
      console.error('Login error:', error);
      setUsername(null);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const login = useCallback((username: string) => {
    if (socket && username) {
      setUsername(username);
      socket.auth = { username };
      socket.connect();
    }
  }, [socket]);

  const sendMessage = useCallback(async (message: string, file?: File) => {
    if (!socket || !username || !selectedUser) return;

    let fileData: string | undefined;
    let fileName: string | undefined;
    let fileType: string | undefined;

    if (file) {
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        fileData = base64;
        fileName = file.name;
        fileType = file.type;
      } catch (error) {
        console.error('Error reading file:', error);
        return;
      }
    }

    const messageData: Message = {
      from: username,
      message,
      fileData,
      fileName,
      fileType,
    };

    socket.emit('private_message', {
      to: selectedUser,
      message: messageData,
    });

    setMessages(prev => [...prev, messageData]);
  }, [socket, username, selectedUser]);

  return (
    <SocketContext.Provider value={{
      socket,
      username,
      isConnected,
      messages,
      onlineUsers,
      login,
      sendMessage,
      selectedUser,
      setSelectedUser,
    }}>
      {children}
    </SocketContext.Provider>
  );
}
