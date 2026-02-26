require('dotenv').config({ path: '../.env' });
const axios = require('axios');
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const API_URL = 'http://localhost:5000/api';

const testLogin = async () => {
  try {
    // First register a test user
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Login Test User',
      email: `login${Date.now()}@example.com`,
      password: 'password123'
    });
    
    console.log('Test user created');
    
    // Now try to login
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: registerRes.data.user.email,
      password: 'password123'
    });
    
    console.log('Login successful');
    console.log('User:', loginRes.data.user);
    console.log('Token:', loginRes.data.token.substring(0, 20) + '...');
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
  }
};

testLogin();