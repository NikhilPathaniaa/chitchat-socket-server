"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const uuid_1 = require("uuid");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
const messages = [];
const onlineUsers = new Set();
io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error('Invalid username'));
    }
    socket.username = username;
    next();
});
io.on('connection', (socket) => {
    const username = socket.username;
    onlineUsers.add(username);
    // Broadcast online users
    io.emit('onlineUsers', Array.from(onlineUsers));
    // Handle new messages
    socket.on('message', (data) => {
        const message = {
            id: (0, uuid_1.v4)(),
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
            message.reactions[emoji] = message.reactions[emoji].filter((user) => user !== username);
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
