import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await user.matchPassword(password)) {
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  // For stateless JWT, just delete token from client side
  res.json({ message: 'Logout successful' });
};

export {
  login,
  logout,
};