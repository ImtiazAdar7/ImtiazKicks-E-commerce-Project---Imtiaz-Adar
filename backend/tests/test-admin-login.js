require('dotenv').config({ path: '../.env' });
const axios = require('axios');
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const API_URL = 'http://localhost:5000/api';

const testAdminLogin = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/admin/login`, {
      email: 'admin.imtiaz@gmail.com',
      password: 'imtiazadar1234'
    });
    
    console.log('Admin login successful');
    console.log('Admin:', response.data.user);
    console.log('Token:', response.data.token.substring(0, 20) + '...');
  } catch (error) {
    console.error('Admin login failed:', error.response?.data || error.message);
  }
};

testAdminLogin();