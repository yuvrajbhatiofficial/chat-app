const express = require("express");
const chatsDb = require("../chatsDb");
const router = express.Router(); // <-- YOU MISSED THIS

router.get("/history/:user1/:user2", (req, res) => {
  const { user1, user2 } = req.params;

  chatsDb.all(
    `SELECT * FROM chats
     WHERE (sender_id = ? AND receiver_id = ?)
        OR (sender_id = ? AND receiver_id = ?)
     ORDER BY timestamp ASC`,
    [user1, user2, user2, user1],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ messages: rows });
    }
  );
});

module.exports = router; // <-- Don't forget to export it
