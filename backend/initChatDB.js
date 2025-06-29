const chatsDb = require("./chatsDb"); // chats.db

const initializeChatsDB = () => {
  chatsDb.serialize(() => {
    chatsDb.run(`
      CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER,
        receiver_id INTEGER,
        message TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
};

module.exports = initializeChatsDB;
