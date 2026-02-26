const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function debugAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the admin user
    const admin = await User.findOne({ email: 'admin.imtiaz@gmail.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('  Name:', admin.name);
    console.log('  Email:', admin.email);
    console.log('  Role:', admin.role);
    console.log('  Balance:', admin.balance);
    console.log('  Password hash:', admin.password.substring(0, 20) + '...');

    // Test password comparison
    const testPassword = 'imtiazadar1234';
    console.log('\n🔐 Testing password:', testPassword);
    
    const isMatch = await admin.comparePassword(testPassword);
    console.log('  Password match:', isMatch ? '✅ YES' : '❌ NO');

    if (!isMatch) {
      // Let's try direct bcrypt compare
      const directCompare = await bcrypt.compare(testPassword, admin.password);
      console.log('  Direct bcrypt compare:', directCompare ? '✅ YES' : '❌ NO');
      
      if (!directCompare) {
        console.log('\n⚠️ Password mismatch! Let\'s reset it...');
        
        // Reset password
        admin.password = testPassword;
        await admin.save();
        console.log('✅ Password reset successfully!');
        
        // Test again
        const newMatch = await admin.comparePassword(testPassword);
        console.log('  New password test:', newMatch ? '✅ YES' : '❌ NO');
      }
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

debugAdmin();