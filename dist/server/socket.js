"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
const socket_io_1 = require("socket.io");
const users = [];
const messages = [];
function generateMessageId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
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
        console.log('User connected:', socket.username);
        // Add user to online users
        const user = {
            id: socket.id,
            username: socket.username,
            lastSeen: Date.now()
        };
        users.push(user);
        // Send previous messages and current online users to the newly connected user
        socket.emit('previousMessages', messages);
        io.emit('onlineUsers', users);
        socket.on('message', (messageData) => {
            const newMessage = {
                id: generateMessageId(),
                text: messageData.text || '',
                username: socket.username,
                timestamp: Date.now(),
                reactions: {},
                ...messageData,
            };
            messages.push(newMessage);
            if (newMessage.private && newMessage.to) {
                // Send private message only to sender and recipient
                const recipientSocket = Array.from(io.sockets.sockets.values())
                    .find((s) => s.username === newMessage.to);
                if (recipientSocket) {
                    recipientSocket.emit('message', newMessage);
                    socket.emit('message', newMessage);
                }
            }
            else {
                // Broadcast public message to all users
                io.emit('message', newMessage);
            }
        });
        socket.on('reaction', (data) => {
            const message = messages.find(m => m.id === data.messageId);
            if (message) {
                if (!message.reactions[data.emoji]) {
                    message.reactions[data.emoji] = [];
                }
                const userIndex = message.reactions[data.emoji].indexOf(data.username);
                if (data.remove && userIndex !== -1) {
                    message.reactions[data.emoji].splice(userIndex, 1);
                    if (message.reactions[data.emoji].length === 0) {
                        delete message.reactions[data.emoji];
                    }
                }
                else if (!data.remove && userIndex === -1) {
                    message.reactions[data.emoji].push(data.username);
                }
                io.emit('messageReaction', {
                    messageId: data.messageId,
                    reactions: message.reactions
                });
            }
        });
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.username);
            const index = users.findIndex(u => u.id === socket.id);
            if (index !== -1) {
                users.splice(index, 1);
                io.emit('onlineUsers', users);
            }
        });
    });
    return io;
}
