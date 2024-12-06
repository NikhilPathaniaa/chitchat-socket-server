import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

interface Message {
  id: string;
  text: string;
  username: string;
  timestamp: number;
  fileType?: string;
  fileName?: string;
  fileData?: string;
  reactions?: { [key: string]: string[] };
}

const messages: Message[] = [];
const onlineUsers = new Set<string>();

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error('Invalid username'));
  }
  (socket as any).username = username;
  next();
});

io.on('connection', (socket) => {
  const username = (socket as any).username;
  onlineUsers.add(username);
  
  // Broadcast online users
  io.emit('onlineUsers', Array.from(onlineUsers));

  // Handle new messages
  socket.on('message', (data: Omit<Message, 'id' | 'timestamp' | 'username'>) => {
    const message: Message = {
      id: uuidv4(),
      text: data.text,
      username,
      timestamp: Date.now(),
      fileType: data.fileType,
      fileName: data.fileName,
      fileData: data.fileData,
      reactions: {},
    };
    messages.push(message);
    io.emit('message', message);
  });

  // Handle reactions
  socket.on('reaction', ({ messageId, emoji }) => {
    const message = messages.find((m) => m.id === messageId);
    if (message) {
      if (!message.reactions) {
        message.reactions = {};
      }
      if (!message.reactions[emoji]) {
        message.reactions[emoji] = [];
      }
      
      // Remove previous reaction if exists
      message.reactions[emoji] = message.reactions[emoji].filter(
        (user) => user !== username
      );
      
      // Add new reaction
      message.reactions[emoji].push(username);
      
      // Broadcast the reaction
      io.emit('reaction', { messageId, emoji, username });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    onlineUsers.delete(username);
    io.emit('onlineUsers', Array.from(onlineUsers));
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
