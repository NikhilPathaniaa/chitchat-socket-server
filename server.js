const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Store connected users
const users = new Map();

// Socket.IO error handling
io.engine.on("connection_error", (err) => {
  console.log('Connection error:', err);
});

io.on('connect_error', (err) => {
  console.log('Socket connect error:', err);
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('login', ({ username }) => {
    try {
      // Store user info
      users.set(socket.id, {
        username,
        id: socket.id
      });

      // Send updated users list to all clients
      io.emit('users', Array.from(users.values()));
      
      // Send login success to the user
      socket.emit('login_success');

      console.log(`${username} joined chat`);
    } catch (error) {
      console.error('Error in login:', error);
      socket.emit('login_error', error.message);
    }
  });

  socket.on('private_message', ({ to, message }) => {
    try {
      const user = users.get(socket.id);
      if (!user) {
        socket.emit('error', 'User not found');
        return;
      }

      // Send to recipient
      const recipientSocket = Array.from(users.entries())
        .find(([_, u]) => u.username === to)?.[0];
      
      if (recipientSocket) {
        io.to(recipientSocket).emit('message', message);
      }

      console.log(`Private message from ${user.username} to ${to}`);
    } catch (error) {
      console.error('Error in private_message:', error);
      socket.emit('error', 'Failed to send message');
    }
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      console.log(`${user.username} left chat`);
      users.delete(socket.id);
      io.emit('users', Array.from(users.values()));
    }
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

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
