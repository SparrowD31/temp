const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function verifyAndUpdateAdmin() {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('MongoDB URI loaded:', uri ? 'Yes' : 'No');
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Find the admin user first
    const adminEmail = 'adminAH@sector91';
    let adminUser = await User.findOne({ email: adminEmail });

    if (adminUser) {
      // If user exists, update their role to admin if not already
      if (adminUser.role !== 'admin') {
        adminUser = await User.findOneAndUpdate(
          { email: adminEmail },
          { $set: { role: 'admin' } },
          { new: true }
        );
        console.log('Updated existing user to admin:', adminUser);
      } else {
        console.log('Admin user already exists with correct role');
      }
    } else {
      // Only create if user doesn't exist
      adminUser = await User.create({
        email: adminEmail,
        password: 'your_admin_password', // Replace with actual password
        role: 'admin',
        username: 'AdminAH'
      });
      console.log('Created new admin user:', adminUser);
    }

  } catch (error) {
    console.error('Error managing admin user:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}

verifyAndUpdateAdmin();