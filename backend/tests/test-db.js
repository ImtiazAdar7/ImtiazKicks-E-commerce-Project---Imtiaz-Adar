require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const testConnection = async () => {
  try {
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in .env file');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connection successful');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

testConnection();