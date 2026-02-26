const axios = require('axios');
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const testGetStats = async () => {
  try {
    // First login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    
    // Get stats
    const statsRes = await axios.get('http://localhost:5000/api/users/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Stats fetched successfully');
    console.log('Total orders:', statsRes.data.totalOrders);
    console.log('Total spent:', statsRes.data.totalSpent);
    console.log('Recent orders:', statsRes.data.recentOrders);
  } catch (error) {
    console.error('Failed to fetch stats:', error.response?.data || error.message);
  }
};

testGetStats();