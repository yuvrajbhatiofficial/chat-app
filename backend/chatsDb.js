// db/chatsDb.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "chats.db");

const chatsDb = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Failed to connect to SQLite chats DB:", err.message);
  } else {
    console.log("✅ Connected to SQLite chats DB");
  }
});

module.exports = chatsDb;
