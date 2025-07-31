const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve("/tmp/chats.db");

const chatsDb = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Failed to connect to SQLite chats DB:", err.message);
  } else {
    console.log("✅ Connected to SQLite chats DB at", dbPath);
  }
});

module.exports = chatsDb;
