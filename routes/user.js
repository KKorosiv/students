const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const router = express.Router();

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userData } = user.toObject();
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

module.exports = router;
