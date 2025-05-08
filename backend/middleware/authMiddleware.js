const jwt = require('jsonwebtoken');
const db = require('../db');

// 🔐 Verify JWT and attach user to request
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(400).json({ error: 'Invalid token: user ID missing' });
    }

    const [rows] = await db.execute(
      'SELECT id, name, email, role, is_verified FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!rows.length) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = rows[0];

    if (!user.is_verified) {
      return res.status(403).json({ error: 'Email not verified' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// 🛡️ Restrict access to users with specific roles
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Allowed roles: ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRole
};
