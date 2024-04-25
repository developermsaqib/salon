import { Server } from "socket.io";
import http from "http";

import express from "express";

const app = express();
// app.use(
//   cors({
//     origin: "http://localhost:5500",
//   })
// );
const server = new http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:5501", "*"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId !== undefined) userSocketMap[userId] = socket.id;

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export { app, io, server, getReceiverSocketId };
