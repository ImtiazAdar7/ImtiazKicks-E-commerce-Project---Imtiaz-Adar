require('dotenv').config({ path: '../.env' });
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const testRegister = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    });
    
    console.log('Registration successful');
    console.log('User:', response.data.user);
    console.log('Token:', response.data.token.substring(0, 20) + '...');
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
  }
};

testRegister();