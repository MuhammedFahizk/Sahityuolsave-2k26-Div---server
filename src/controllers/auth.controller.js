import { generateToken, activeTokens } from '../utils/index.js';

// POST /api/auth/login
export const login = (req, res) => {
  const { username, password } = req.body;

  // Check if username and password were sent
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Compare with .env values — plain text comparison
  const isMatch =
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS;

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Generate token and send it
  const token = generateToken();

  return res.status(200).json({
    message: 'Login successful',
    token,
  });
};

// POST /api/auth/logout
export const logout = (req, res) => {
  // Get token from request header
  const token = req.headers['x-admin-token'];

  if (token) {
    activeTokens.delete(token); // Remove from memory = logged out
  }

  return res.status(200).json({ message: 'Logged out successfully' });
};