const express = require("express");
const router = express.Router();
const db = require("../db"); // users.db
const chatsDb = require("../chatsDb"); // chats.db
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, (req, res) => {
  const currentUserId = req.user.id;

  // Step 1: Fetch unique user IDs you’ve chatted with
  chatsDb.all(
    `
    SELECT DISTINCT 
      CASE 
        WHEN sender_id = ? THEN receiver_id 
        WHEN receiver_id = ? THEN sender_id 
      END AS user_id
    FROM chats
    WHERE sender_id = ? OR receiver_id = ?
    `,
    [currentUserId, currentUserId, currentUserId, currentUserId],
    (err, chatRows) => {
      if (err) {
        console.error("DB error [chats]:", err.message);
        return res.status(500).json({ error: "Chats DB error", details: err.message });
      }

      const userIds = chatRows.map(row => row.user_id).filter(Boolean);

      if (userIds.length === 0) {
        return res.json({ users: [] });
      }

      // Step 2: Use those user IDs to query users.db
      const placeholders = userIds.map(() => "?").join(",");
      const query = `SELECT id, username, email FROM users WHERE id IN (${placeholders})`;

      db.all(query, userIds, (err, userRows) => {
        if (err) {
          console.error("DB error [users]:", err.message);
          return res.status(500).json({ error: "Users DB error", details: err.message });
        }

        // console.log("Users you've chatted with:", userRows);
        res.json({ users: userRows });
      });
    }
  );
});

module.exports = router;
