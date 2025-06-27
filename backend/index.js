const express = require('express');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const { verifyToken } = require("./utils/jwt");
const initDb = require('./initDB');




const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

initDb();
app.use(cors());
app.use(express.json());

// Auth routes
app.use("/auth", authRoutes);

// Test protected route
app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

app.get('/', (req, res) => {
  res.send("Server running...");
});

// Socket.io connection

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("No token provided"));
  }

  try {
    const user = verifyToken(token);     // verify JWT token
    socket.user = user;                  // attach user info to socket
    next();                              // allow connection
  } catch (err) {
    return next(new Error("Invalid token"));
  }
});


io.on("connection", (socket) => {
  console.log("✅ Authenticated user connected:", socket.user.email);

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user.email);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

