const express = require('express');
const router = express.Router();
const db = require('../db');

router.get("/search", (req, res) => {
    const query = req.query.q;
  
    if (!query) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }
  
    const sql = `
      SELECT id, username, email 
      FROM users 
      WHERE username LIKE ? OR email LIKE ?
    `;
  
    const likeQuery = `%${query}%`;
  
    db.all(sql, [likeQuery, likeQuery], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });
  
  module.exports = router;