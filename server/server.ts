import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

const httpServer = createServer(app);

// Configure Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['my-custom-header'],
  },
  allowEIO3: true, // Enable compatibility mode
  transports: ['websocket', 'polling']
});

interface User {
  id: string;
  username: string;
  lastSeen: number;
}

interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: number;
  reactions: { emoji: string; username: string }[];
  private?: boolean;
  to?: string;
  attachment?: {
    type: 'image' | 'file' | 'video';
    url: string;
    name?: string;
    size?: number;
  };
}

const users = new Map<string, User>();
const messages: Message[] = [];

// Cleanup inactive users every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, user] of users.entries()) {
    if (now - user.lastSeen > 300000) { // Remove after 5 minutes of inactivity
      users.delete(id);
      io.emit('userLeft', user.username);
    }
  }
}, 300000);

io.on('connection', (socket) => {
  console.log('User connected');

  // Handle authentication
  const username = socket.handshake.auth.username;
  if (!username) {
    console.log('No username provided');
    socket.emit('auth_error', 'No username provided');
    socket.disconnect(true);
    return;
  }

  // Check if username is already taken
  const isUsernameTaken = Array.from(users.values()).some(
    user => user.username === username
  );

  if (isUsernameTaken) {
    console.log(`Username ${username} is already taken`);
    socket.emit('auth_error', 'Username is already taken');
    socket.disconnect(true);
    return;
  }

  // Add user to users map
  users.set(socket.id, { 
    id: socket.id, 
    username, 
    lastSeen: Date.now() 
  });
  
  console.log(`User ${username} authenticated and added to users`);
  
  // Notify all clients about the new user
  io.emit('userJoined', Array.from(users.values()).map(u => u.username));
  socket.emit('auth_success', username);

  // Send previous messages to the new user
  socket.emit('previousMessages', messages);

  // Modify message creation to include reactions
  const createMessage = (content: string, username: string) => {
    const newMessage = {
      id: uuidv4(),
      content,
      username,
      timestamp: Date.now(),
      reactions: []  // Initialize with empty reactions array
    };
    messages.push(newMessage);
    return newMessage;
  };

  socket.on('message', (data: { 
    content: string, 
    to?: string, 
    attachment?: {
      type: 'image' | 'file' | 'video';
      data?: string;
      url?: string;
      name?: string;
      size?: number;
    } 
  }) => {
    const user = users.get(socket.id);
    if (!user) {
      console.error('Message from unknown user');
      socket.emit('message_error', 'Authentication required');
      return;
    }

    console.log('Server: Received message', {
      username: user.username,
      content: data.content,
      to: data.to,
      hasAttachment: !!data.attachment
    });

    const message = createMessage(data.content, user.username);

    console.log('Server: Constructed message', message);

    try {
      if (data.to) {
        // Send private message only to sender and recipient
        const recipientSocket = Array.from(users.entries())
          .find(([_, u]) => u.username === data.to)?.[0];
        
        if (recipientSocket) {
          console.log('Server: Sending private message to', data.to);
          io.to(recipientSocket).emit('message', message);
          socket.emit('message', message);
        } else {
          console.warn(`Recipient ${data.to} not found`);
          socket.emit('message_error', `Recipient ${data.to} not online`);
        }
      } else {
        console.log('Server: Broadcasting message to all users');
        io.emit('message', message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', 'Failed to send message');
    }
  });

  socket.on('add_reaction', (data: { messageId: string; emoji: string; username: string }) => {
    console.log('SERVER: Detailed Reaction Event', {
      event: 'add_reaction',
      socketId: socket.id,
      data: JSON.stringify(data, null, 2),
      totalMessagesCount: messages.length
    });

    const { messageId, emoji, username } = data;

    // Find the message by ID
    const message = messages.find(m => m.id === messageId);
    
    if (!message) {
      console.error('SERVER: Message not found for reaction', {
        messageId,
        emoji,
        username
      });
      socket.emit('reaction_error', { 
        messageId, 
        error: 'Message not found'
      });
      return;
    }

    // Ensure reactions array exists
    message.reactions = message.reactions || [];

    // Check if user already reacted with this emoji
    const existingReactionIndex = message.reactions.findIndex(
      r => r.emoji === emoji && r.username === username
    );

    if (existingReactionIndex !== -1) {
      // Remove reaction if already exists
      message.reactions.splice(existingReactionIndex, 1);
      console.log('SERVER: Removed existing reaction', {
        messageId,
        emoji,
        username
      });
    } else {
      // Add new reaction
      const newReaction = { emoji, username };
      message.reactions.push(newReaction);
      console.log('SERVER: Added new reaction', {
        messageId,
        emoji,
        username
      });
    }

    // Broadcast updated message to all clients
    io.emit('message_updated', {
      ...message,
      reactions: message.reactions  // Explicitly send reactions
    });

    console.log('SERVER: Emitted message_updated event', {
      messageId: message.id,
      reactionsCount: message.reactions.length
    });
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      // Remove user from users map
      users.delete(socket.id);
      
      // Remove user's messages
      const userMessages = messages.filter(m => 
        m.username === user.username || 
        m.to === user.username
      );
      userMessages.forEach(msg => {
        const index = messages.findIndex(m => m.id === msg.id);
        if (index !== -1) {
          messages.splice(index, 1);
        }
      });
      
      // Notify all clients about user leaving
      io.emit('userLeft', user.username);
      io.emit('userMessages', messages);
      
      console.log(`User ${user.username} disconnected and data cleaned up`);
    }
  });

  // Handle explicit logout
  socket.on('logout', () => {
    const user = users.get(socket.id);
    if (user) {
      // Remove user from users map
      users.delete(socket.id);
      
      // Remove user's messages
      const userMessages = messages.filter(m => 
        m.username === user.username || 
        m.to === user.username
      );
      userMessages.forEach(msg => {
        const index = messages.findIndex(m => m.id === msg.id);
        if (index !== -1) {
          messages.splice(index, 1);
        }
      });
      
      // Notify all clients
      io.emit('userLeft', user.username);
      io.emit('userMessages', messages);
      
      console.log(`User ${user.username} logged out and data cleaned up`);
    }
    
    // Disconnect the socket
    socket.disconnect(true);
  });

  // Update user's last seen timestamp on any activity
  socket.on('activity', () => {
    const user = users.get(socket.id);
    if (user) {
      user.lastSeen = Date.now();
    }
  });

  socket.on('requestOnlineUsers', () => {
    const onlineUsernames = Array.from(users.values()).map(u => u.username);
    console.log('Sending online users to client:', onlineUsernames);
    socket.emit('onlineUsers', onlineUsernames);
  });
});

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
