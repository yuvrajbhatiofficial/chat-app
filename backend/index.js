// backend/index.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors());

app.get('/', (req, res) => {
  res.send("Server running...");
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5001, () => {
  console.log("Server is running on port 5000");
});
