import { io, Socket } from 'socket.io-client';

// Define socket connection configuration
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://chitchat-socket-server.onrender.com';

// Socket connection configuration interface
interface SocketConfig {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
  onConnect: (callback: () => void) => void;
  onDisconnect: (callback: (reason: string) => void) => void;
}

// Create socket connection utility
export const createSocketConnection = (): SocketConfig => {
  let socket: Socket | null = null;

  const connect = () => {
    if (socket) return;

    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      timeout: 20000,
      autoConnect: true,
      forceNew: true,
      multiplex: false
    });

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

  const onConnect = (callback: () => void) => {
    if (socket) {
      socket.on('connect', callback);
    }
  };

  const onDisconnect = (callback: (reason: string) => void) => {
    if (socket) {
      socket.on('disconnect', callback);
    }
  };

  return {
    socket,
    connect,
    disconnect,
    onConnect,
    onDisconnect
  };
};

// Singleton socket connection
export const socketConnection = createSocketConnection();
