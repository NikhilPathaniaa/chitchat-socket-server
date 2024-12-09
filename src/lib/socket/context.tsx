import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-hot-toast';

// Extend Socket type to include custom properties
interface SocketWithAuth extends Socket {
  auth: { username?: string };
  connected: boolean;
}

export interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: number;
  to?: string;
  private?: boolean;
  reactions?: { emoji: string; username: string }[];
  attachment?: {
    type: 'image' | 'file' | 'video';
    url: string;
    name?: string;
    size?: number;
  };
}

interface SocketContextType {
  socket: SocketWithAuth | null;
  username: string;
  setUsername: (username: string) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  targetUsername: string | null;
  setTargetUsername: (username: string | null) => void;
  connect: () => boolean;
  disconnect: () => void;
  onlineUsers: string[];
  selectedUser: string | null;
  selectUser: (username: string | null) => void;
  requestOnlineUsers: () => void;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<SocketWithAuth | null>(null);
  const [username, _setUsername] = useState<string>('');
  const usernameRef = useRef<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [targetUsername, setTargetUsername] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Synchronize username with ref
  useEffect(() => {
    usernameRef.current = username;
  }, [username]);

  // Setter that updates both state and ref
  const setUsername = (newUsername: string) => {
    console.log('Setting username in context:', newUsername);
    _setUsername(newUsername);
    usernameRef.current = newUsername;
  };

  const connect = useCallback(() => {
    // Disconnect any existing socket
    if (socket) {
      socket.disconnect();
    }

    // Validate username before connecting
    const currentUsername = usernameRef.current || localStorage.getItem('username');
    
    console.log('Connection Attempt Details:', {
      usernameRefCurrent: usernameRef.current,
      localStorageUsername: localStorage.getItem('username'),
      finalUsername: currentUsername
    });

    if (!currentUsername) {
      console.error('No username available for connection');
      toast.error('Username is required');
      return false;
    }

    try {
      // Detailed logging for connection attempt
      console.log('Attempting to connect with username:', currentUsername);
      console.log('Socket URL:', SOCKET_URL);

      // Create socket with extensive configuration
      const newSocket = io(SOCKET_URL, {
        auth: { 
          username: currentUsername 
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 15000,
        forceNew: true,
        withCredentials: false,
      }) as SocketWithAuth & { auth: NonNullable<SocketWithAuth['auth']> };

      // Enhanced connection event handling
      newSocket.on('connect', () => {
        console.log('Detailed Connection Success:', {
          id: newSocket.id,
          connected: newSocket.connected,
          username: newSocket.auth.username || currentUsername,
          transportUsed: newSocket.io.engine.transport.name
        });
        
        // Ensure username is set in both state and ref
        _setUsername(currentUsername);
        usernameRef.current = currentUsername;
        localStorage.setItem('username', currentUsername);
        
        if (!newSocket.connected) {
          console.error('Socket reports not connected despite connect event');
          toast.error('Connection established but not fully connected');
        }
        
        setSocket(newSocket);
        (window as any).socket = newSocket;
        
        return true;
      });

      // Comprehensive error handling
      newSocket.on('connect_error', (error: Error) => {
        console.error('Comprehensive Connection Error:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        
        toast.error(`Connection failed: ${error.message}. Check server status.`);
        
        setSocket(null);
        (window as any).socket = null;
        
        return false;
      });

      return true;
    } catch (error) {
      console.error('Fatal socket connection error:', error);
      toast.error('Failed to establish socket connection');
      return false;
    }
  }, [socket]);

  const disconnect = useCallback(() => {
    if (socket) {
      console.log('Disconnecting socket:', {
        socketId: socket.id,
        currentUsername: username
      });
      socket.disconnect();
      setSocket(null);
      (window as any).socket = null;
    }
  }, [socket, username]);

  const selectUser = useCallback((username: string | null) => {
    setSelectedUser(username);
    setTargetUsername(username);
  }, []);

  const requestOnlineUsers = useCallback(() => {
    if (socket) {
      socket.emit('requestOnlineUsers');
    }
  }, [socket]);

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

    // Comprehensive event logging
    const eventTypes = [
      'connect', 
      'disconnect', 
      'message', 
      'message_updated', 
      'previousMessages', 
      'reaction_error'
    ];

    eventTypes.forEach(eventType => {
      socket.on(eventType, (data: any) => {
        console.log(`SOCKET EVENT: ${eventType}`, {
          eventData: data,
          timestamp: new Date().toISOString()
        });
      });
    });

    // Error handling
    socket.on('connect_error', (error) => {
      console.error('Socket Connection Error:', error);
    });

    socket.on('reaction_error', (errorData) => {
      console.error('Reaction Error:', errorData);
      toast.error('Failed to process reaction. Please try again.');
    });

    // Handle user events
    const handleUserJoined = (users: string[]) => {
      console.log('Context: Received online users:', users);
      setOnlineUsers(users);
    };

    const handleUserLeft = (leftUsername: string) => {
      console.log('Context: User left:', leftUsername);
      setOnlineUsers(prev => prev.filter(u => u !== leftUsername));
    };

    const handleOnlineUsers = (users: string[]) => {
      console.log('Context: Received online users from explicit request:', users);
      setOnlineUsers(users);
    };

    // Handle messages
    const handlePreviousMessages = (msgs: Message[]) => {
      console.log('Context: Received previous messages:', msgs.length);
      setMessages(msgs);
    };

    const handleNewMessage = (msg: Message) => {
      console.log('Context: Received new message:', {
        username: msg.username, 
        to: msg.to, 
        private: msg.private, 
        content: msg.content
      });
      
      // Add the new message to the messages array
      setMessages(prevMessages => {
        // Prevent duplicate messages
        const isDuplicate = prevMessages.some(m => m.id === msg.id);
        if (isDuplicate) return prevMessages;

        // Always add the message if it's a public message
        if (!msg.private) return [...prevMessages, msg];

        // For private messages, only add if it's between the current user and the target user
        const isRelevantPrivateMessage = 
          (msg.username === username && msg.to === selectedUser) ||
          (msg.username === selectedUser && msg.to === username);

        return isRelevantPrivateMessage 
          ? [...prevMessages, msg] 
          : prevMessages;
      });
    };

    const handleMessageError = (error: string) => {
      console.error('Context: Message sending error:', error);
      toast.error(error);
    };

    const handleMessageUpdated = (updatedMessage: Message) => {
      console.log('Context: Detailed Message Update', {
        event: 'message_updated',
        messageId: updatedMessage.id,
        content: updatedMessage.content,
        reactions: updatedMessage.reactions,
        reactionsLength: updatedMessage.reactions?.length
      });
      
      setMessages(prevMessages => {
        const messageIndex = prevMessages.findIndex(msg => msg.id === updatedMessage.id);
        
        if (messageIndex === -1) {
          console.warn('Context: Updated message not found', {
            updatedMessageId: updatedMessage.id
          });
          return prevMessages;
        }

        const newMessages = [...prevMessages];
        newMessages[messageIndex] = {
          ...prevMessages[messageIndex],
          ...updatedMessage,
          reactions: updatedMessage.reactions || []
        };

        return newMessages;
      });
    };

    const handleReactionError = (data: { messageId: string; error: string }) => {
      console.error('Context: Reaction error:', data);
      toast.error(`Failed to add reaction: ${data.error}`);
    };

    // Register event listeners
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);
    socket.on('onlineUsers', handleOnlineUsers);
    socket.on('previousMessages', handlePreviousMessages);
    socket.on('message', handleNewMessage);
    socket.on('message_error', handleMessageError);
    socket.on('message_updated', handleMessageUpdated);
    socket.on('reaction_error', handleReactionError);

    // Cleanup on unmount or socket change
    return () => {
      eventTypes.forEach(eventType => {
        socket.off(eventType);
      });
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.off('onlineUsers', handleOnlineUsers);
      socket.off('previousMessages', handlePreviousMessages);
      socket.off('message', handleNewMessage);
      socket.off('message_error', handleMessageError);
      socket.off('message_updated', handleMessageUpdated);
      socket.off('reaction_error', handleReactionError);
    };
  }, [socket, username, selectedUser]);

  // Provide context value
  const value = {
    socket,
    username,
    setUsername,
    messages,
    setMessages,
    targetUsername,
    setTargetUsername,
    connect,
    disconnect,
    onlineUsers,
    selectedUser,
    selectUser,
    requestOnlineUsers
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);
