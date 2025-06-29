const db = require("./db"); // users.db

const initializeUsersDB = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT,
        password TEXT
      )
    `);
  });
};

module.exports = initializeUsersDB;
