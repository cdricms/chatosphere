import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));
const clients = new Map();
app.use(express.static("client"));
// app.get('/', (_, res) => {
//   res.sendFile(__dirname+ "/client/index.html")
// })
io.on("connection", (socket) => {
    console.log(`[ID]: ${socket.id}`);
    socket.emit("healthCheck", socket.id);
    socket.on("register", async (client) => {
        const exists = await prisma.user.findUnique({
            where: { handle: client.handle },
        });
        if (exists)
            return;
        await prisma.user.create({
            data: {
                handle: client.handle,
                nickname: client.nickname,
                profilePicture: client.profilPicture,
            },
        });
    });
    //TODO: Change all the relation stuff to a same name, be consistent
    socket.on("sendContactRequest", async (myHandle, contactHandle) => {
        const exists = await prisma.user.findUnique({
            where: { handle: contactHandle },
            include: {
                contacts: true,
                contactRequestsSent: true,
                contactRequestsReceived: true,
            },
        });
        if (!exists)
            return;
        if (exists.contacts.find((user) => user.handle === myHandle))
            return;
        if (exists.contactRequestsSent.find((s) => s.contactHandle === contactHandle && s.userHandle === myHandle))
            return;
        if (exists.contactRequestsReceived.find((r) => r.contactHandle === contactHandle && r.userHandle === myHandle))
            return;
        await prisma.userContactRequest.create({
            data: { userHandle: myHandle, contactHandle },
        });
        console.log(await prisma.user.findMany({
            where: { handle: myHandle, AND: { handle: contactHandle } },
            include: { contactRequestsSent: true, contactRequestsReceived: true },
        }));
        //TODO: Send notification
        if (clients.get(contactHandle)) {
            socket.to(clients.get(contactHandle)).emit("contactRequestReceived");
        }
    });
    socket.on("acceptContactRequest", async (myHandle, contactHandle) => {
        const exists = await prisma.user.findUnique({
            where: { handle: contactHandle },
            include: {
                contacts: true,
                contactRequestsSent: true,
                contactRequestsReceived: true,
            },
        });
        if (!exists)
            return;
        if (exists.contacts.find((user) => user.handle === myHandle))
            return;
        if (!exists.contactRequestsReceived.find((r) => r.contactHandle === contactHandle && r.userHandle === myHandle))
            return;
        await prisma.user.update({
            where: { handle: myHandle },
            data: {
                contactRequestsReceived: {
                    delete: {
                        contactHandle_userHandle: {
                            userHandle: contactHandle,
                            contactHandle: myHandle,
                        },
                    },
                },
                contacts: {
                    connect: { handle: contactHandle },
                },
            },
        });
        await prisma.user.update({
            where: { handle: contactHandle },
            data: {
                contacts: {
                    connect: { handle: myHandle },
                },
            },
        });
    });
    socket.on("refuseContactRequest", async (myHandle, contactHandle) => {
        const exists = await prisma.user.findUnique({
            where: { handle: contactHandle },
            include: {
                contacts: true,
                contactRequestsSent: true,
                contactRequestsReceived: true,
            },
        });
        if (!exists)
            return;
        if (exists.contacts.find((user) => user.handle === myHandle))
            return;
        if (!exists.contactRequestsReceived.find((r) => r.contactHandle === contactHandle && r.userHandle === myHandle))
            return;
        await prisma.user.update({
            where: { handle: myHandle },
            data: {
                contactRequestsReceived: {
                    delete: {
                        contactHandle_userHandle: {
                            userHandle: contactHandle,
                            contactHandle: myHandle,
                        },
                    },
                },
            },
        });
    });
    socket.on("deleteContact", async (myHandle, contactHandle) => {
        const exists = await prisma.user.findUnique({
            where: { handle: contactHandle },
            include: {
                contacts: true,
            },
        });
        if (!exists)
            return;
        if (!exists.contacts.find((user) => user.handle === myHandle))
            return;
        await prisma.user.update({
            where: { handle: myHandle },
            data: { contacts: { disconnect: { handle: contactHandle } } },
        });
        await prisma.user.update({
            where: { handle: contactHandle },
            data: { contacts: { disconnect: { handle: myHandle } } },
        });
    });
    socket.on("listContacts", async (myHandle) => {
        const userSelected = await prisma.user.findUnique({
            where: { handle: myHandle },
            select: { contacts: true },
        });
        if (!userSelected)
            return;
        return userSelected.contacts;
    });
    socket.on("listRequestsReceived", async (myHandle) => {
        const userSelected = await prisma.user.findUnique({
            where: { handle: myHandle },
            select: { contactRequestsReceived: true },
        });
        if (!userSelected)
            return;
        const users = await Promise.all(userSelected.contactRequestsReceived.map(async (r) => await prisma.user.findUnique({ where: { handle: r.userHandle } })));
        socket.emit("listRequestsReceivedRes", users);
    });
    socket.on("listRequestsSent", async (myHandle) => {
        const userSelected = await prisma.user.findUnique({
            where: { handle: myHandle },
            select: { contactRequestsSent: true },
        });
        if (!userSelected)
            return;
        const users = await Promise.all(userSelected.contactRequestsSent.map(async (s) => await prisma.user.findUnique({ where: { handle: s.contactHandle } })));
        socket.emit("listRequestsSentRes", users);
    });
    socket.on("authenticate", (client) => {
        clients.set(client.handle, socket.id);
    });
    socket.on("sendMessage", async (msg) => {
        console.log(msg.content);
        console.log(clients);
        console.log(await prisma.user.findUnique({ where: { handle: msg.sender.handle } }));
        if (clients.get(msg.to)) {
            console.log(clients.get(msg.to));
            io.to(clients.get(msg.to)).emit("receiveMessage", msg);
        }
    });
});
server.listen(8080, () => {
    console.log("listening on *:8080");
});
