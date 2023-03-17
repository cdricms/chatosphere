import express from 'express';
import http from 'http';
import path from "path";
import { fileURLToPath } from "url";
import { Server } from 'socket.io';
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));
const clients = new Map();
app.use(express.static('client'));
// app.get('/', (_, res) => {
//   res.sendFile(__dirname+ "/client/index.html")
// })
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
