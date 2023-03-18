import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { IMessage, ISender } from "types/conversation";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

type socketId = string;
type handle = string;

const clients: Map<handle, socketId> = new Map();

app.use(express.static("client"));
// app.get('/', (_, res) => {
//   res.sendFile(__dirname+ "/client/index.html")
// })

io.on("connection", (socket) => {
  console.log(`[ID]: ${socket.id}`);

  socket.emit("healthCheck", socket.id);

  socket.on("register", async (client: ISender) => {
    const exists = await prisma.user.findUnique({
      where: { handle: client.handle },
    });
    if (exists) return;
    await prisma.user.create({
      data: {
        handle: client.handle,
        nickname: client.nickname,
        profilePicture: client.profilPicture,
      },
    });
  });

  socket.on(
    "sendContactRequest",
    async (myHandle: handle, contactHandle: handle) => {
      const exists = await prisma.user.findUnique({
        where: { handle: contactHandle },
        include: {
          contacts: true,
          contactRequestsSent: true,
          contactRequestsReceived: true,
        },
      });
      if (!exists) return;
      if (exists.contacts.find((user) => user.handle === myHandle)) return;
      if (
        exists.contactRequestsSent.find(
          (s) => s.contactHandle === contactHandle && s.userHandle === myHandle
        )
      )
        return;
      if (
        exists.contactRequestsReceived.find(
          (r) => r.contactHandle === contactHandle && r.userHandle === myHandle
        )
      )
        return;

      await prisma.userContactRequest.create({
        data: { userHandle: myHandle, contactHandle },
      });

      console.log(
        await prisma.user.findMany({
          where: { handle: myHandle, AND: { handle: contactHandle } },
          include: { contactRequestsSent: true, contactRequestsReceived: true },
        })
      );

      socket.emit("sendContactRequestRes");

      //TODO: Send notification
      socket.to(clients.get(contactHandle)!).emit("contactRequestReceived");
    }
  );

  socket.on(
    "cancelContactRequest",
    async (myHandle: handle, contactHandle: handle) => {
      const exists = await prisma.user.findUnique({
        where: { handle: contactHandle },
        include: {
          contacts: true,
          contactRequestsSent: true,
          contactRequestsReceived: true,
        },
      });
      if (!exists) return;
      if (
        !exists.contactRequestsReceived.find(
          (r) => r.contactHandle === contactHandle && r.userHandle === myHandle
        )
      )
        return;
      await prisma.user.update({
        where: { handle: myHandle },
        data: {
          contactRequestsSent: {
            delete: {
              contactHandle_userHandle: { userHandle: myHandle, contactHandle },
            },
          },
        },
      });

      socket.emit("cancelContactRequestRes");
      socket.to(clients.get(contactHandle)!).emit("contactRequestCanceled");
    }
  );

  socket.on(
    "acceptContactRequest",
    async (myHandle: handle, contactHandle: handle) => {
      const exists = await prisma.user.findUnique({
        where: { handle: contactHandle },
        include: {
          contacts: true,
          contactRequestsSent: true,
          contactRequestsReceived: true,
        },
      });
      if (!exists) return;
      if (
        !exists.contactRequestsSent.find(
          (r) => r.contactHandle === myHandle && r.userHandle === contactHandle
        )
      )
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

      socket.emit("acceptContactRequestRes");
      socket.to(clients.get(contactHandle)!).emit("contactRequestAccepted");
    }
  );

  socket.on(
    "refuseContactRequest",
    async (myHandle: handle, contactHandle: handle) => {
      const exists = await prisma.user.findUnique({
        where: { handle: contactHandle },
        include: {
          contacts: true,
          contactRequestsSent: true,
          contactRequestsReceived: true,
        },
      });
      if (!exists) return;
      if (exists.contacts.find((user) => user.handle === myHandle)) return;
      if (
        !exists.contactRequestsReceived.find(
          (r) => r.contactHandle === contactHandle && r.userHandle === myHandle
        )
      )
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

      socket.emit("refuseContactRequestRes");
      socket.to(clients.get(contactHandle)!).emit("contactRequestRefused");
    }
  );

  socket.on(
    "deleteContact",
    async (myHandle: handle, contactHandle: handle) => {
      const exists = await prisma.user.findUnique({
        where: { handle: contactHandle },
        include: {
          contacts: true,
        },
      });
      if (!exists) return;
      if (!exists.contacts.find((user) => user.handle === myHandle)) return;
      await prisma.user.update({
        where: { handle: myHandle },
        data: { contacts: { disconnect: { handle: contactHandle } } },
      });
      await prisma.user.update({
        where: { handle: contactHandle },
        data: { contacts: { disconnect: { handle: myHandle } } },
      });

      socket.emit("deleteContactRes");
      socket.to(clients.get(contactHandle)!).emit("contactDeleted");
    }
  );

  socket.on("listContacts", async (myHandle: handle) => {
    const userSelected = await prisma.user.findUnique({
      where: { handle: myHandle },
      select: { contacts: true },
    });
    if (!userSelected) return;

    socket.emit("listContactsRes", userSelected.contacts);
  });

  socket.on("listRequestsReceived", async (myHandle: handle) => {
    const userSelected = await prisma.user.findUnique({
      where: { handle: myHandle },
      select: { contactRequestsReceived: true },
    });
    if (!userSelected) return;

    const users = await Promise.all(
      userSelected.contactRequestsReceived.map(
        async (r) =>
          await prisma.user.findUnique({ where: { handle: r.userHandle } })
      )
    );

    socket.emit("listRequestsReceivedRes", users);
  });

  socket.on("listRequestsSent", async (myHandle: handle) => {
    const userSelected = await prisma.user.findUnique({
      where: { handle: myHandle },
      select: { contactRequestsSent: true },
    });
    if (!userSelected) return;
    const users = await Promise.all(
      userSelected.contactRequestsSent.map(
        async (s) =>
          await prisma.user.findUnique({ where: { handle: s.contactHandle } })
      )
    );

    socket.emit("listRequestsSentRes", users);
  });

  socket.on("authenticate", (client: { handle: string; nickname: string }) => {
    clients.set(client.handle, socket.id);
  });

  socket.on("sendMessage", async (msg: IMessage) => {
    console.log(msg.content);
    console.log(clients);
    console.log(
      await prisma.user.findUnique({ where: { handle: msg.sender.handle } })
    );
    if (clients.get(msg.to)) {
      console.log(clients.get(msg.to));
      io.to(clients.get(msg.to)!).emit("receiveMessage", msg);
    }
  });
});

server.listen(8080, () => {
  console.log("listening on *:8080");
});
