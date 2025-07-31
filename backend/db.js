const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve("/tmp/users.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Failed to connect to SQLite DB:", err.message);
  } else {
    console.log("✅ Connected to SQLite DB at", dbPath);
  }
});

module.exports = db;
