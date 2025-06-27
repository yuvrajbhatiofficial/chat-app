const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;


function generateToken(user) {
  return jwt.sign({ id: user.id,username: user.username, email: user.email }, SECRET_KEY, { expiresIn: '7d' });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = { generateToken, verifyToken };
