import express from 'express';
import http from 'http';
import path from "path";
import { fileURLToPath } from "url";
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
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
    socket.on("register", async (client) => {
        const exists = await prisma.user.findUnique({ where: { handle: client.handle } });
        if (exists)
            return;
        await prisma.user.create({
            data: {
                handle: client.handle,
                nickname: client.nickname,
                profilePicture: client.profilPicture,
            }
        });
    });
    socket.on("befriend", async (myHandle, fHandle) => {
        const exists = await prisma.user.findUnique({ where: { handle: fHandle } });
        if (!exists)
            return;
        await prisma.user.update({
            where: { handle: myHandle },
            data: {
                PendingRelations: {
                    set: { pendingHandle: fHandle }
                }
            }
        });
    });
    socket.on('authenticate', (client) => {
        clients.set(client.handle, socket.id);
    });
    socket.on('sendMessage', async (msg) => {
        console.log(msg.content);
        console.log(clients);
        console.log(await prisma.pendingRelations.findMany());
        if (clients.get(msg.to)) {
            console.log(clients.get(msg.to));
            io.to(clients.get(msg.to)).emit('receiveMessage', msg);
        }
    });
});
server.listen(8080, () => {
    console.log('listening on *:8080');
});
