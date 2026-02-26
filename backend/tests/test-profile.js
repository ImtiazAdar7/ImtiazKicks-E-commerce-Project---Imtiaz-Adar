require('dotenv').config({ path: '../.env' });
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const testGetProfile = async () => {
  try {
    // First register/login to get token
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Profile Test User',
      email: `profile${Date.now()}@example.com`,
      password: 'password123'
    });
    
    const token = registerRes.data.token;
    console.log('Test user created');
    
    // Get profile
    const profileRes = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Profile fetched successfully');
    console.log('User:', profileRes.data);
  } catch (error) {
    console.error('Failed to fetch profile:', error.response?.data || error.message);
  }
};

testGetProfile();