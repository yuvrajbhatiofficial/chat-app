const express = require("express");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { generateToken } = require("../utils/jwt");
const db = require("../db");

const router = express.Router();

// Register
router.post(
  "/register",
  body("username").isAlphanumeric(),
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;

    // Check username rules
    const noSpaces = /^\S+$/;
    if (!noSpaces.test(username)) {
      return res
        .status(400)
        .json({ error: "Username cannot contain spaces" });
    }

    if (username.length < 4) {
      return res
        .status(400)
        .json({ error: "Username must be at least 4 characters long" });
    }

    const hasNumber = /\d/.test(username);
    if (!hasNumber) {
      return res
        .status(400)
        .json({ error: "Username must contain at least one number" });
    }

    // Check if username or email exists
    db.get(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email],
      async (err, user) => {
        if (err) return res.status(500).json({ error: "DB error" });
        if (user) {
          return res
            .status(400)
            .json({ error: "Username or email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          [username, email, hashedPassword],
          function (err) {
            if (err)
              return res.status(500).json({ error: "Failed to register" });

            const newUser = {
              id: this.lastID,
              username,
              email,
              password: hashedPassword,
            };
            const token = generateToken(newUser);
            res.json({ token });
          }
        );
      }
    );
  }
);

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ token, username: user.username });
  });
});

module.exports = router;