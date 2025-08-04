const express = require('express');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const { verifyToken } = require("./utils/jwt");
const initDb = require('./initDB');
const userRoutes = require('./routes/users');
const chatRoutes = require("./routes/chat");
const db = require('./db');
const initializeChatsDB = require("./initChatDB");
const chatsDb = require('./chatsDb');
const searchRouter = require('./routes/search');


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

initDb();
initializeChatsDB();
app.use(cors());
app.use(express.json());

// Auth routes
app.use("/auth", authRoutes);

//users routes 
app.use("/users", userRoutes);

// chat routes
app.use("/chat", chatRoutes);

//search routes
app.use("/api/users", searchRouter);


// Test protected route
app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

app.get('/', (req, res) => {
  res.send("Server running...");
});
app.get('/ping',(req,res)=>{
  res.send('ping for monitoring')
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


const onlineUsers = new Map();

io.on("connection", (socket) => {
  const user = socket.user;
  console.log("✅ Authenticated user connected:", user.email);
  
  onlineUsers.set(user.id, socket);
  
  io.emit("online_users", Array.from(onlineUsers.keys()));

  // 🔥 Updated: Save to DB + Send to receiver
  socket.on("send_private_message", ({ toUserId, message }) => {
    const targetSocket = onlineUsers.get(toUserId);

    // 1. Insert into DB
    chatsDb.run(
      `INSERT INTO chats (sender_id, receiver_id, message) VALUES (?, ?, ?)`,
      [user.id, toUserId, message],
      (err) => {
        if (err) {
          console.error("❌ Error saving message to DB:", err);
        } else {
          console.log("💾 Message saved to chats DB.");
        }
      }
    );

    // 2. Emit to receiver if online
    if (targetSocket) {
      targetSocket.emit("receive_message", {
        sender: user.username,
        senderId: user.id,
        message,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", user.email);
    io.emit("online_users", Array.from(onlineUsers));
    onlineUsers.delete(user.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
