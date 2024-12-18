import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'https://chitchat-socket-server.onrender.com';

const socket = io(SOCKET_SERVER_URL, {
  transports: ['websocket', 'polling'],
  path: '/socket.io/',
  secure: true,
  rejectUnauthorized: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000
});

export default socket;
