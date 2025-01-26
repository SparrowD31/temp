const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function createAdminUser() {
  try {
    // Log the MongoDB URI to verify it's loaded
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Connect to your database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'common@sector91' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user with your specific credentials
    const hashedPassword = await bcrypt.hash('20202020', 10);
    const adminUser = new User({
      name: 'Admin common',
      email: 'common@sector91',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully with:');
    console.log('Email:', 'adminAH@sector91');
    console.log('Password:', 'sector91-2025');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    if (mongoose.connection.readyState === 1) { // if connected
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}

createAdminUser(); 