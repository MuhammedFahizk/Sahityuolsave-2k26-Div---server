import { activeTokens } from '../utils/index.js';

export const protect = (req, res, next) => {
  // Get token from request header
  const token = req.headers['x-admin-token'];

  // No token sent
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Token exists but not in our active tokens Set
  if (!activeTokens.has(token)) {
    return res.status(401).json({ message: 'Access denied. Invalid or expired token.' });
  }

  // Token is valid — allow request to continue
  next();
};