const axios = require('axios');
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const testAdminRoutes = async () => {
  try {
    // Admin login
    const loginRes = await axios.post('http://localhost:5000/api/auth/admin/login', {
      email: 'admin.imtiaz@gmail.com',
      password: 'imtiazadar1234'
    });
    
    const token = loginRes.data.token;
    console.log('Admin login successful');
    
    // Get all users
    const usersRes = await axios.get('http://localhost:5000/api/users/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`Fetched ${usersRes.data.length} users`);
    
    // Get all orders
    const ordersRes = await axios.get('http://localhost:5000/api/users/admin/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`Fetched ${ordersRes.data.length} orders`);
    
  } catch (error) {
    console.error('Admin route test failed:', error.response?.data || error.message);
  }
};

testAdminRoutes();