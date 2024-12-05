import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const users = new Set<string>();

io.on('connection', (socket) => {
  const username = socket.handshake.auth.username;
  users.add(username);

  // Broadcast updated user list
  io.emit('users', Array.from(users));

  socket.on('message', (message) => {
    const fullMessage = {
      ...message,
      id: uuidv4(),
      timestamp: Date.now(),
    };
    io.emit('message', fullMessage);
  });

  socket.on('disconnect', () => {
    users.delete(username);
    io.emit('users', Array.from(users));
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
