const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'eventhub-secret-key-charusat-itue301';

/**
 * authGuard middleware
 * Validates Bearer token and returns 401 if missing or invalid.
 * Sets req.user = decoded payload on success.
 */
const authGuard = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No Bearer token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid or expired token.'
    });
  }
};

module.exports = authGuard;
