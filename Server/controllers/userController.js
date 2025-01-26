const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    // Explicitly select role field
    const user = await User.findById(req.user.userId).select('+role');
    
    console.log('Profile fetch for user:', { // Debug log
      id: user._id,
      role: user.role,
      email: user.email
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // Explicitly include role
      // ... other user data
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  // ... other exports
}; 