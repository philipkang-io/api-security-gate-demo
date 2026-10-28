const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const router = express.Router();
const attempts = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

function clientIp(req) {
  return req.socket.remoteAddress;
}

function tooManyAttempts(ip) {
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > MAX_ATTEMPTS;
}

router.post('/login', (req, res) => {
  const ip = clientIp(req);
  if (tooManyAttempts(ip)) {
    return res.status(429).json({ error: { name: 'tooManyRequests', message: 'Too many login attempts' } });
  }
  const { email, password } = req.body || {};
  const user = db.findUserByEmail(email);
  if (!user || user.password !== password) {
    console.log(`login failed email=${email} ip=${ip}`);
    return res.status(401).json({ error: { name: 'unauthorized', message: 'Invalid credentials' } });
  }
  const token = jwt.sign(
    { sub: user.id, tenantId: user.tenantId, role: user.role },
    process.env.JWT_SECRET,
    { algorithm: 'HS256', expiresIn: '1h' }
  );
  console.log(`login ok user=${user.id} ip=${ip}`);
  res.json({ token, expiresIn: 3600 });
});

module.exports = router;
