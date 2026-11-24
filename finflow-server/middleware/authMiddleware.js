const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, access denied' });

  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not set in environment variables');
    return res.status(500).json({ message: 'Server authentication configuration error' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};