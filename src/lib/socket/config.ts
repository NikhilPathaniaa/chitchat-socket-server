export const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? 'https://chitchat-socket-server.onrender.com'
  : 'http://localhost:3001';

export const SOCKET_CONFIG = {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ['websocket', 'polling'],
  forceNew: true,
  path: '/socket.io/',
};
