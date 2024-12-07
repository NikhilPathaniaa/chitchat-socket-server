import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  text: string;
  username: string;
  timestamp: number;
  to?: string;
  fileUrl?: string;
  reactions?: { [emoji: string]: string[] };
}

interface ConnectedUser {
  id: string;
  username: string;
}

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  methods: ['GET', 'POST'],
  credentials: true
}));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Debug route
app.get('/status', (req, res) => {
  res.json({ status: 'Server is running' });
});

const connectedUsers = new Map<string, ConnectedUser>();
const messages: Message[] = [];

io.use((socket: Socket, next) => {
  console.log('Connection middleware - Auth:', socket.handshake.auth);
  const username = socket.handshake.auth.username;
  
  if (!username) {
    console.log('Connection rejected: No username provided');
    return next(new Error('Username is required'));
  }

  if (Array.from(connectedUsers.values()).some(user => user.username === username)) {
    console.log('Connection rejected: Username already taken');
    return next(new Error('Username is already taken'));
  }

  socket.data.username = username;
  console.log('Connection authorized for username:', username);
  next();
});

io.on('connection', (socket: Socket) => {
  console.log('New connection:', {
    id: socket.id,
    username: socket.data.username,
    transport: socket.conn.transport.name,
    handshake: socket.handshake
  });
  
  const username = socket.data.username;
  
  // Add user to connected users
  connectedUsers.set(socket.id, { id: socket.id, username });
  console.log('User added to connected users:', { id: socket.id, username });
  
  // Broadcast updated user list
  const onlineUsers = Array.from(connectedUsers.values()).map(user => user.username);
  console.log('Broadcasting online users:', onlineUsers);
  io.emit('onlineUsers', onlineUsers);

  // Send existing messages to new user
  console.log('Sending previous messages to new user:', messages.length);
  socket.emit('previousMessages', messages);

  socket.on('message', (messageData: Partial<Message>) => {
    console.log('Received message:', messageData);
    if (!messageData.text) {
      console.log('Message rejected: No text');
      return;
    }

    const message: Message = {
      id: uuidv4(),
      text: messageData.text.trim(),
      username,
      timestamp: Date.now(),
      to: messageData.to || undefined,
      fileUrl: messageData.fileUrl || undefined,
      reactions: {},
    };

    messages.push(message);
    console.log('Broadcasting message:', message);
    io.emit('message', message);
  });

  socket.on('reaction:add', (messageId: string, emoji: string, username: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      if (!message.reactions) {
        message.reactions = {};
      }
      if (!message.reactions[emoji]) {
        message.reactions[emoji] = [];
      }
      if (!message.reactions[emoji].includes(username)) {
        message.reactions[emoji].push(username);
        io.emit('reaction:add', messageId, emoji, username);
      }
    }
  });

  socket.on('reaction:remove', (messageId: string, emoji: string, username: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message && message.reactions && message.reactions[emoji]) {
      message.reactions[emoji] = message.reactions[emoji].filter(u => u !== username);
      if (message.reactions[emoji].length === 0) {
        delete message.reactions[emoji];
      }
      io.emit('reaction:remove', messageId, emoji, username);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', { id: socket.id, username });
    // Remove user from connected users
    connectedUsers.delete(socket.id);
    
    // Broadcast updated user list
    const onlineUsers = Array.from(connectedUsers.values()).map(user => user.username);
    console.log('Broadcasting updated online users after disconnect:', onlineUsers);
    io.emit('onlineUsers', onlineUsers);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
