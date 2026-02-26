const axios = require('axios');
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const testCreateOrder = async () => {
  try {
    // First login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    
    // Create order
    const orderRes = await axios.post('http://localhost:5000/api/orders', 
      {
        items: [{
          productId: 'PRODUCT_ID_HERE', // Replace with actual product ID
          name: 'Nike Air Max 270',
          price: 8999,
          size: 9,
          color: 'Black/White',
          quantity: 1
        }],
        shippingAddress: {
          street: '123 Test St',
          city: 'Dhaka',
          state: 'Dhaka',
          zipCode: '1200',
          country: 'Bangladesh'
        }
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    console.log('Order created successfully');
    console.log('Order:', orderRes.data.order);
    console.log('New balance:', orderRes.data.newBalance);
  } catch (error) {
    console.error('Order creation failed:', error.response?.data || error.message);
  }
};

testCreateOrder();