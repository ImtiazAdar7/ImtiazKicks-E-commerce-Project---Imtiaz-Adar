const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin.imtiaz@gmail.com' });
    if (existingAdmin) {
      console.log('Admin already exists, updating password...');
      existingAdmin.password = 'imtiazadar1234';
      existingAdmin.role = 'admin';
      existingAdmin.balance = 10000;
      await existingAdmin.save();
      console.log('Admin updated successfully!');
    } else {
      // Create new admin
      const admin = new User({
        name: 'Admin Imtiaz',
        email: 'admin.imtiaz@gmail.com',
        password: 'imtiazadar1234',
        balance: 10000,
        role: 'admin'
      });
      
      await admin.save();
      console.log('Admin created successfully!');
    }
    
    console.log('Email: admin.imtiaz@gmail.com');
    console.log('Password: imtiazadar1234');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

createAdmin();