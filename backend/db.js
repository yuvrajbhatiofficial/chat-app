// db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Resolve the database path relative to your root folder
const dbPath = path.resolve(__dirname, "users.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Failed to connect to SQLite DB:", err.message);
  } else {
    console.log("✅ Connected to SQLite DB");
  }
});

module.exports = db;
