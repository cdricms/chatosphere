import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const clients = new Map();
app.get('/', (_, res) => {
    res.send('<h1>Hello world</h1>');
});
io.on('connection', (socket) => {
    console.log(`[ID]: ${socket.id}`);
    socket.emit('healthCheck', socket.id);
    socket.on('authenticate', (client) => {
        clients.set(client, socket.id);
    });
    socket.on('sendMessage', (msg) => {
        console.log(msg.content);
        console.log(clients);
        if (clients.get(msg.to)) {
            console.log(clients.get(msg.to));
            io.to(clients.get(msg.to)).emit('receiveMessage', msg);
        }
    });
});
server.listen(8080, () => {
    console.log('listening on *:8080');
});
