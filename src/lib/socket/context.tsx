'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

interface LocalMessage {
  id: string;
  text: string;
  username: string;  // For backward compatibility
  from?: string;     // New field
  to?: string;       // New field
  timestamp: number;
  fileUrl?: string;
  reactions: Record<string, string[]>;
}

interface SocketContextType {
  socket: Socket | null;
  messages: LocalMessage[];
  username: string;
  onlineUsers: string[];
  selectedUser: string | null;
  setSelectedUser: (username: string | null) => void;
  sendMessage: (text: string, file?: File | null, to?: string | null) => Promise<void>;
  addReaction: (messageId: string, emoji: string) => void;
  removeReaction: (messageId: string, emoji: string) => void;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  disconnect: () => void;
  connect: (username: string) => Promise<void>;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Cleanup on unmount
  useEffect(() => {
    console.log('SocketProvider mounted');
    return () => {
      console.log('SocketProvider unmounting, cleaning up socket');
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const connect = useCallback(async (newUsername: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        console.log('Starting connection process for username:', newUsername);
        setIsLoading(true);
        setError(null);
        
        if (socket) {
          console.log('Disconnecting existing socket');
          socket.disconnect();
        }

        console.log('Creating new socket connection');
        const newSocket = io('http://localhost:3001', {
          auth: { username: newUsername },
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
          forceNew: true
        });

        console.log('Setting up connection timeout');
        const timeoutId = setTimeout(() => {
          console.log('Connection timeout reached');
          newSocket.disconnect();
          setError('Connection timeout');
          setIsLoading(false);
          reject(new Error('Connection timeout'));
        }, 10000);

        newSocket.on('connect_error', (error) => {
          console.error('Socket connect_error:', error);
          clearTimeout(timeoutId);
          setError(error.message);
          setIsLoading(false);
          reject(error);
        });

        newSocket.on('connect', () => {
          console.log('Socket connected successfully');
          clearTimeout(timeoutId);
          setIsConnected(true);
          setUsername(newUsername);
          setSocket(newSocket);
          setIsLoading(false);
          resolve();
        });

        newSocket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          setIsConnected(false);
          if (reason === 'io server disconnect') {
            setError('Disconnected by server');
          }
        });

        newSocket.on('message', (message: LocalMessage) => {
          console.log('Received message:', message);
          setMessages(prev => {
            // Check if message already exists to prevent duplicates
            if (prev.some(m => m.id === message.id)) {
              return prev;
            }
            return [...prev, {
              ...message,
              from: message.from || message.username, // Handle both new and old format
              reactions: message.reactions || {}
            }];
          });
        });

        newSocket.on('previousMessages', (prevMessages: LocalMessage[]) => {
          console.log('Received previous messages:', prevMessages);
          setMessages(prevMessages.map(msg => ({
            ...msg,
            from: msg.from || msg.username, // Handle both new and old format
            reactions: msg.reactions || {}
          })));
        });

        newSocket.on('onlineUsers', (users: string[]) => {
          console.log('Online users updated:', users);
          setOnlineUsers(users);
        });

        newSocket.on('error', (error: string) => {
          console.error('Socket error:', error);
          setError(error);
          reject(new Error(error));
        });

      } catch (err) {
        console.error('Connection setup error:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect');
        setIsLoading(false);
        reject(err);
      }
    });
  }, [socket]);

  const updateMessageReactions = useCallback((messageId: string, emoji: string, reactingUser: string, isAdd: boolean) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || {};
        const users = reactions[emoji] ?? [];
        
        if (isAdd && !users.includes(reactingUser)) {
          return {
            ...msg,
            reactions: {
              ...reactions,
              [emoji]: [...users, reactingUser]
            }
          };
        } else if (!isAdd && users.includes(reactingUser)) {
          const updatedUsers = users.filter(user => user !== reactingUser);
          const updatedReactions = { ...reactions };
          
          if (updatedUsers.length === 0) {
            delete updatedReactions[emoji];
          } else {
            updatedReactions[emoji] = updatedUsers;
          }
          
          return {
            ...msg,
            reactions: updatedReactions
          };
        }
      }
      return msg;
    }));
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);
      setIsLoading(false);
      reconnectAttempts.current = 0;
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
      setError('Disconnected from server');
    };

    const handleConnectError = (err: Error) => {
      console.error('Socket connect_error:', err);
      setError(err.message);
      setIsLoading(false);

      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current += 1;
        setTimeout(() => {
          connect(username);
        }, 1000 * reconnectAttempts.current);
      }
    };

    const handleMessage = (message: LocalMessage) => {
      console.log('Received message:', message);
      setMessages(prev => {
        // Check if message already exists to prevent duplicates
        if (prev.some(m => m.id === message.id)) {
          return prev;
        }
        return [...prev, {
          ...message,
          from: message.from || message.username, // Handle both new and old format
          reactions: message.reactions || {}
        }];
      });
    };

    const handleUserJoined = (user: string) => {
      console.log('User joined:', user);
      setOnlineUsers(prev => [...prev, user]);
    };

    const handleUserLeft = (user: string) => {
      console.log('User left:', user);
      setOnlineUsers(prev => prev.filter(u => u !== user));
    };

    const handleReaction = (messageId: string, emoji: string, reactingUser: string, isAdd: boolean) => {
      console.log('Reaction event:', messageId, emoji, reactingUser, isAdd);
      updateMessageReactions(messageId, emoji, reactingUser, isAdd);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('message', handleMessage);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);
    socket.on('reaction', handleReaction);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('message', handleMessage);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.off('reaction', handleReaction);
    };
  }, [socket, username, connect, maxReconnectAttempts, updateMessageReactions]);

  const sendMessage = useCallback(async (text: string, file?: File | null, to?: string | null) => {
    if (!socket || !text.trim()) return;

    let fileUrl = '';
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/upload` || 'http://localhost:3001/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        fileUrl = data.url;
      } catch (error) {
        console.error('Error uploading file:', error);
        return;
      }
    }

    const message = {
      text: text.trim(),
      username,  // Keep for backward compatibility
      from: username,
      to,
      fileUrl: fileUrl || undefined,
      timestamp: Date.now(),
      reactions: {}
    };

    console.log('Sending message:', message);
    socket.emit('message', message);
  }, [socket, username]);

  const addReaction = useCallback((messageId: string, emoji: string) => {
    if (!socket) return;
    
    console.log('Adding reaction:', { messageId, emoji, username });
    socket.emit('reaction', { 
      messageId, 
      emoji, 
      username,
      type: 'add'
    });

    // Optimistically update the UI
    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.id === messageId) {
          const reactions = { ...(msg.reactions || {}) };
          if (!reactions[emoji]) {
            reactions[emoji] = [];
          }
          if (!reactions[emoji].includes(username)) {
            reactions[emoji] = [...reactions[emoji], username];
          }
          return { ...msg, reactions };
        }
        return msg;
      })
    );
  }, [socket, username]);

  const removeReaction = useCallback((messageId: string, emoji: string) => {
    if (!socket) return;

    console.log('Removing reaction:', { messageId, emoji, username });
    socket.emit('reaction', { 
      messageId, 
      emoji, 
      username,
      type: 'remove'
    });

    // Optimistically update the UI
    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.id === messageId) {
          const reactions = { ...(msg.reactions || {}) };
          if (reactions[emoji]) {
            reactions[emoji] = reactions[emoji].filter(u => u !== username);
            if (reactions[emoji].length === 0) {
              delete reactions[emoji];
            }
          }
          return { ...msg, reactions };
        }
        return msg;
      })
    );
  }, [socket, username]);

  useEffect(() => {
    if (!socket) return;

    const handleReaction = ({ messageId, emoji, username: reactingUser, type }: any) => {
      console.log('Received reaction:', { messageId, emoji, reactingUser, type });
      setMessages(prevMessages => 
        prevMessages.map(msg => {
          if (msg.id === messageId) {
            const reactions = { ...(msg.reactions || {}) };
            if (type === 'add') {
              if (!reactions[emoji]) {
                reactions[emoji] = [];
              }
              if (!reactions[emoji].includes(reactingUser)) {
                reactions[emoji] = [...reactions[emoji], reactingUser];
              }
            } else if (type === 'remove') {
              if (reactions[emoji]) {
                reactions[emoji] = reactions[emoji].filter(u => u !== reactingUser);
                if (reactions[emoji].length === 0) {
                  delete reactions[emoji];
                }
              }
            }
            return { ...msg, reactions };
          }
          return msg;
        })
      );
    };

    socket.on('reaction', handleReaction);

    return () => {
      socket.off('reaction', handleReaction);
    };
  }, [socket]);

  const disconnect = useCallback(() => {
    if (socket) {
      console.log('Disconnecting socket');
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setMessages([]);
      setOnlineUsers([]);
      setSelectedUser(null);
    }
  }, [socket]);

  const value = {
    socket,
    messages,
    username,
    onlineUsers,
    selectedUser,
    setSelectedUser,
    sendMessage,
    addReaction,
    removeReaction,
    isConnected,
    isLoading,
    error,
    disconnect,
    connect,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
