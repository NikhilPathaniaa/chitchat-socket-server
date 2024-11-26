const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS configuration for both development and production
const corsOrigin = process.env.NODE_ENV === 'production'
  ? [process.env.VERCEL_URL || 'https://chitchat-nine.vercel.app', /\.vercel\.app$/]
  : 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Basic route for health check
app.get('/', (req, res) => {
  res.send('Server is running');
});

const server = http.createServer(app);

// Socket.IO setup with error handling
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Store connected users
const users = new Map();

// Socket.IO error handling
io.engine.on('connection_error', (err) => {
  console.log('Connection error:', err);
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error('Invalid username'));
  }
  socket.username = username;
  next();
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Store user info
  users.set(socket.id, {
    username: socket.username,
    id: socket.id
  });

  // Send updated users list to all clients
  io.emit('users', Array.from(users.values()));

  // Handle private messages
  socket.on('private_message', ({ to, message }) => {
    try {
      const recipientSocket = Array.from(users.entries())
        .find(([_, u]) => u.username === to)?.[0];
      
      if (recipientSocket) {
        io.to(recipientSocket).emit('private_message', message);
      }
    } catch (error) {
      console.error('Error in private_message:', error);
      socket.emit('error', 'Failed to send message');
    }
  });

  socket.on('disconnect', () => {
    console.log(`${socket.username} left chat`);
    users.delete(socket.id);
    io.emit('users', Array.from(users.values()));
  });
});

// Error handling
server.on('error', (err) => {
  console.error('Server error:', err);
});

// Create public directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync(path.join(__dirname, 'public'))) {
  fs.mkdirSync(path.join(__dirname, 'public'));
}

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
