"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
const connectedUsers = new Map();
const messages = [];
io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error('Invalid username'));
    }
    socket.data.username = username;
    next();
});
io.on('connection', (socket) => {
    const username = socket.data.username;
    // Add user to connected users
    connectedUsers.set(socket.id, { id: socket.id, username });
    // Broadcast updated user list
    const onlineUsers = Array.from(connectedUsers.values()).map(user => user.username);
    io.emit('onlineUsers', onlineUsers);
    // Send existing messages to new user
    socket.emit('previousMessages', messages);
    socket.on('message', (messageData) => {
        const message = {
            id: (0, uuid_1.v4)(),
            text: messageData.text || '',
            username,
            timestamp: new Date().toISOString(),
            to: messageData.to || null,
            fileUrl: messageData.fileUrl || null,
            reactions: {},
        };
        messages.push(message);
        // If it's a private message, send only to sender and recipient
        if (message.to) {
            const recipientSocket = Array.from(connectedUsers.entries())
                .find(([_, user]) => user.username === message.to)?.[0];
            if (recipientSocket) {
                io.to(recipientSocket).emit('message', message);
                if (socket.id !== recipientSocket) {
                    socket.emit('message', message);
                }
            }
        }
        else {
            // Broadcast to all for group chat
            io.emit('message', message);
        }
    });
    socket.on('reaction:add', (messageId, emoji, username) => {
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
    socket.on('reaction:remove', (messageId, emoji, username) => {
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
        // Remove user from connected users
        connectedUsers.delete(socket.id);
        // Broadcast updated user list
        const onlineUsers = Array.from(connectedUsers.values()).map(user => user.username);
        io.emit('onlineUsers', onlineUsers);
    });
});
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
