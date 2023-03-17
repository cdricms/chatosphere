import express from "express";
import http from "http";
import {Server} from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (_, res) => {
  res.send('<h1>Hello world</h1>');
});


io.on("connection", socket => {
  console.log(`Hello {socket.id}`);
});


server.listen(8080, () => {
  console.log('listening on *:8080');
});
