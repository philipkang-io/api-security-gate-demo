const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: { name: 'unauthorized', message: 'Missing bearer token' } });
  }
  try {
    const claims = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.user = { id: claims.sub, tenantId: claims.tenantId, role: claims.role };
    next();
  } catch (err) {
    res.status(401).json({ error: { name: 'unauthorized', message: 'Invalid or expired token' } });
  }
}

module.exports = { requireAuth };
