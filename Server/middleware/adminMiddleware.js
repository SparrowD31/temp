const User = require('../models/User');

const adminCheck = async (req, res, next) => {
  try {
    // Get user from database directly
    const user = await User.findById(req.user.id);
    
    console.log('Admin Check - User Data:', {
      id: user._id,
      email: user.email,
      role: user.role
    });

    if (user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied: Admin privileges required',
        isAdmin: false 
      });
    }

    // Add admin status to request
    req.isAdmin = true;
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = adminCheck; 