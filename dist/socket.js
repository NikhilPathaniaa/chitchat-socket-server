"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
const socket_io_1 = require("socket.io");
const users = [];
const messages = [];
function initSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        },
        pingTimeout: 60000,
        pingInterval: 25000,
        transports: ['websocket', 'polling'],
        allowEIO3: true
    });
    io.use((socket, next) => {
        const username = socket.handshake.auth?.username;
        if (!username) {
            return next(new Error("Invalid username"));
        }
        socket.username = username;
        next();
    });
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id, socket.username);
        socket.on('join', (username) => {
            const user = {
                id: socket.id,
                username,
                lastSeen: Date.now()
            };
            users.push(user);
            socket.emit('previousMessages', messages);
            io.emit('userJoined', users);
            console.log(`${username} joined the chat`);
        });
        socket.on('message', (message) => {
            try {
                console.log('Message received:', message);
                messages.push(message);
                io.emit('message', message);
            }
            catch (error) {
                console.error('Error handling message:', error);
                socket.emit('error', { message: 'Failed to process message' });
            }
        });
        socket.on('reaction', ({ messageId, emoji, username, remove }) => {
            try {
                console.log('Reaction:', { messageId, emoji, username, remove });
                const message = messages.find(m => m.id === messageId);
                if (message) {
                    if (!message.reactions)
                        message.reactions = {};
                    if (!message.reactions[emoji])
                        message.reactions[emoji] = [];
                    if (remove) {
                        message.reactions[emoji] = message.reactions[emoji].filter(u => u !== username);
                        if (message.reactions[emoji].length === 0)
                            delete message.reactions[emoji];
                    }
                    else {
                        if (!message.reactions[emoji].includes(username)) {
                            message.reactions[emoji].push(username);
                        }
                    }
                    io.emit('messageReaction', { messageId, emoji, username, remove });
                }
            }
            catch (error) {
                console.error('Error handling reaction:', error);
                socket.emit('error', { message: 'Failed to process reaction' });
            }
        });
        socket.on('activity', () => {
            try {
                const user = users.find(u => u.id === socket.id);
                if (user) {
                    user.lastSeen = Date.now();
                }
            }
            catch (error) {
                console.error('Error handling activity:', error);
            }
        });
        socket.on('disconnect', () => {
            try {
                const index = users.findIndex(u => u.id === socket.id);
                if (index !== -1) {
                    const user = users[index];
                    users.splice(index, 1);
                    io.emit('userLeft', user.username);
                    console.log(`${user.username} left the chat`);
                }
            }
            catch (error) {
                console.error('Error handling disconnect:', error);
            }
        });
        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    });
    return io;
}
