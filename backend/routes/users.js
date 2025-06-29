const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/auth");

// GET /users - Return all users except the logged-in one
router.get("/", authMiddleware, (req, res) => {
  const currentUserId = req.user.id;

  db.all(
    `SELECT id, username, email FROM users WHERE id != ?`,
    [currentUserId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Database error", details: err.message });
      }
      res.json({ users: rows });
    }
  );
});

module.exports = router;
