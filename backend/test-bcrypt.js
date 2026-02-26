const bcrypt = require('bcryptjs');

async function testBcrypt() {
  try {
    console.log('Testing bcrypt...');
    const password = 'test123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log('Password:', password);
    console.log('Salt:', salt);
    console.log('Hash:', hash);
    
    const isMatch = await bcrypt.compare(password, hash);
    console.log('Password match:', isMatch);
    console.log('✅ bcrypt is working correctly!');
  } catch (error) {
    console.error('❌ bcrypt error:', error);
  }
}

testBcrypt();