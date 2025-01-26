const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminCheck = require('../middleware/adminMiddleware');

// Base admin route with role check
router.get('/', auth, adminCheck, async (req, res) => {
  try {
    res.json({ 
      message: 'Welcome to admin dashboard', 
      isAdmin: true 
    });
  } catch (error) {
    console.error('Admin route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected admin routes
router.get('/users', auth, adminCheck, async (req, res) => {
  // Admin-only functionality
});

module.exports = router; 