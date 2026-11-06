const jwt = require('jsonwebtoken');
const db = require('../config/db');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access denied. No authentication token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'eventora_jwt_secret_key_2026_super_secure');

    // Fetch user from DB
    const [rows] = await db.query(
      'SELECT user_id, full_name, email, role, status FROM users WHERE user_id = ?',
      [decoded.user_id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid token. User no longer exists.' });
    }

    const user = rows[0];
    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Account is inactive or suspended.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.', error: error.message });
  }
};

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Requires one of the following roles: ${roles.join(', ')}` 
      });
    }
    next();
  };
};

module.exports = { verifyToken, checkRole };
