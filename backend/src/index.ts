import express from 'express'
import http from 'http'
import path from "path"
import {fileURLToPath} from "url"
import { IMessage, ISender } from 'types/conversation'
import { Server } from 'socket.io'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


const app = express()
const server = http.createServer(app)
const io = new Server(server)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(path.dirname(__filename))

type socketId = string
type handle = string

const clients: Map<handle, socketId> = new Map()

app.use(express.static('client'))
// app.get('/', (_, res) => {
//   res.sendFile(__dirname+ "/client/index.html")
// })

io.on('connection', (socket) => {
  console.log(`[ID]: ${socket.id}`)

  socket.emit('healthCheck', socket.id)

  socket.on("register", async (client: ISender) => {
    const exists = await prisma.user.findUnique({where: {handle: client.handle}});
    if (exists) return;
    await prisma.user.create({
      data: {
        handle: client.handle,
        nickname: client.nickname,
        profilePicture: client.profilPicture,
      }
    })
  })

  //TODO: Change all the relation stuff to a same name, be consistent
  socket.on("befriend", async (myHandle: handle, fHandle: handle) => {

    const exists = await prisma.user.findUnique({where: {handle: fHandle}});

    if (!exists) return;

    await prisma.user.update({
      where: {handle: myHandle},
      data: {
       PendingRelations: {
          set: {pendingHandle: fHandle}
        } 
      }
    }) 
  })

  socket.on('authenticate', (client: {handle: string, nickname: string}) => {
    clients.set(client.handle, socket.id)
  })

  socket.on('sendMessage', async (msg: IMessage) => {
    console.log(msg.content)
    console.log(clients)
    console.log(await prisma.pendingRelations.findMany())
    if (clients.get(msg.to)) {
      console.log(clients.get(msg.to))
      io.to(clients.get(msg.to)!).emit('receiveMessage', msg)
    }
  })
})

server.listen(8080, () => {
  console.log('listening on *:8080')
})
