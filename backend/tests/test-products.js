require('dotenv').config({ path: '../.env' });
const axios = require('axios');
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const API_URL = 'http://localhost:5000/api';

const testGetProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    
    console.log('Products fetched successfully');
    console.log(`Total products: ${response.data.length}`);
    if (response.data.length > 0) {
      console.log('First product:', response.data[0]);
    }
  } catch (error) {
    console.error('Failed to fetch products:', error.message);
  }
};

testGetProducts();