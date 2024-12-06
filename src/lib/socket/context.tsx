'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

interface SocketAuth {
  username: string;
}

interface SocketWithAuth extends Socket {
  auth: SocketAuth;
}

export interface Message {
  id: string;
  text: string;
  username: string;
  timestamp: number;
  reactions: { [key: string]: string[] };
  private?: boolean;
  to?: string;
  attachment?: {
    type: string;
    name: string;
    data: string;
  };
}

interface User {
  id: string;
  username: string;
  lastSeen: number;
}

interface FileAttachment {
  type: string;
  name: string;
  data: string;
}

interface SocketContextType {
  socket: SocketWithAuth | null;
  username: string | null;
  messages: Message[];
  onlineUsers: User[];
  sendMessage: (text: string, attachment?: FileAttachment, to?: string) => void;
  sendReaction: (messageId: string, emoji: string) => void;
  selectUser: (user: string | null) => void;
  setUsername: (username: string) => void;
  connect: () => void;
  disconnect: () => void;
  selectedUser: string | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<SocketWithAuth | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const connect = () => {
    if (username) {
      const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        autoConnect: false,
        reconnection: true,
        reconnectionDelayMax: 5000,
        randomizationFactor: 0.5
      });
      
      socketInstance.auth = { username };

      socketInstance.on('connect', () => {
        console.log('Connected to socket server');
        socketInstance.emit('join', username);
        toast.success('Connected to chat server');
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        toast.error('Failed to connect to chat server. Retrying...');
      });

      socketInstance.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
          socketInstance.connect();
        }
        toast.error('Disconnected from chat server');
      });

      socketInstance.on('previousMessages', (previousMessages: Message[]) => {
        console.log('Received previous messages:', previousMessages);
        setMessages(previousMessages);
      });

      socketInstance.on('message', (message: Message) => {
        console.log('Received message:', message);
        setMessages(prev => {
          // Check if message already exists (for sender's optimistic update)
          if (prev.some(m => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
      });

      socketInstance.on('userJoined', (users: User[]) => {
        setOnlineUsers(users);
        toast.success(`${users[users.length - 1]?.username} joined the chat`);
      });

      socketInstance.on('userLeft', (leftUsername: string) => {
        setOnlineUsers(prev => prev.filter(user => user.username !== leftUsername));
        toast.error(`${leftUsername} left the chat`);
      });

      socketInstance.on('messageReaction', ({ messageId, emoji, username, remove }) => {
        console.log('Reaction received:', { messageId, emoji, username, remove });
        setMessages(prev => prev.map(msg => {
          if (msg.id === messageId) {
            const reactions = { ...(msg.reactions || {}) };
            if (!reactions[emoji]) reactions[emoji] = [];
            
            if (remove) {
              reactions[emoji] = reactions[emoji].filter(u => u !== username);
              if (reactions[emoji].length === 0) delete reactions[emoji];
            } else {
              if (!reactions[emoji].includes(username)) {
                reactions[emoji] = [...reactions[emoji], username];
              }
            }
            
            return { ...msg, reactions };
          }
          return msg;
        }));
      });

      socketInstance.on('error', (error: any) => {
        console.error('Socket error:', error);
        toast.error('Socket error: ' + error.message);
      });

      // Keep user active
      const activityInterval = setInterval(() => {
        if (socketInstance.connected) {
          socketInstance.emit('activity');
        }
      }, 30000);

      setSocket(socketInstance as SocketWithAuth);

      socketInstance.connect();

      return () => {
        clearInterval(activityInterval);
        socketInstance.disconnect();
      };
    }
  };

  useEffect(() => {
    const savedUsername = Cookies.get('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  useEffect(() => {
    if (username) {
      connect();
    }
  }, [username]);

  const sendMessage = (text: string, attachment?: FileAttachment, to?: string) => {
    if (socket && (text.trim() || attachment)) {
      const messageId = Math.random().toString(36).substr(2, 9);
      const messageData: Message = {
        id: messageId,
        text: text.trim(),
        username: socket.auth.username,
        timestamp: Date.now(),
        reactions: {},
      };

      if (to) {
        messageData.private = true;
        messageData.to = to;
      }

      if (attachment) {
        messageData.attachment = attachment;
      }

      // Optimistically add message to state
      setMessages(prev => [...prev, messageData]);

      // Send to server
      socket.emit('message', messageData);
    }
  };

  const sendReaction = (messageId: string, emoji: string) => {
    if (socket) {
      const username = socket.auth.username;
      
      // Find the message to check current reaction state
      const message = messages.find(m => m.id === messageId);
      const hasReacted = message?.reactions[emoji]?.includes(username) || false;
      
      // Update messages state optimistically
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const reactions = { ...(msg.reactions || {}) };
          if (!reactions[emoji]) reactions[emoji] = [];
          
          // Toggle reaction
          const userIndex = reactions[emoji].indexOf(username);
          if (userIndex === -1) {
            reactions[emoji].push(username);
          } else {
            reactions[emoji] = reactions[emoji].filter(u => u !== username);
            if (reactions[emoji].length === 0) {
              delete reactions[emoji];
            }
          }
          
          return { ...msg, reactions };
        }
        return msg;
      }));

      // Send to server
      socket.emit('messageReaction', {
        messageId,
        emoji,
        username,
        remove: hasReacted
      });
    }
  };

  const selectUser = (user: string | null) => {
    setSelectedUser(user);
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setUsername(null);
      Cookies.remove('username');
    }
  };

  return (
    <SocketContext.Provider value={{
      socket,
      username,
      messages,
      onlineUsers,
      sendMessage,
      sendReaction,
      selectUser,
      setUsername,
      connect,
      disconnect,
      selectedUser
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
