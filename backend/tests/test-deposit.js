const axios = require('axios');
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const testDeposit = async () => {
  try {
    // First login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    const oldBalance = loginRes.data.user.balance;
    
    // Deposit money
    const depositRes = await axios.post('http://localhost:5000/api/users/deposit', 
      { amount: 500 },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    console.log('Deposit successful');
    console.log('Old balance:', oldBalance);
    console.log('New balance:', depositRes.data.newBalance);
    console.log('Transaction:', depositRes.data.transaction);
  } catch (error) {
    console.error('Deposit failed:', error.response?.data || error.message);
  }
};

testDeposit();