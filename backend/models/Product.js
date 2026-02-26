const mongoose = require('mongoose');
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Running', 'Basketball', 'Casual', 'Training', 'Lifestyle']
  },
  sizes: [{
    size: Number,
    quantity: Number
  }],
  colors: [{
    name: String,
    hexCode: String
  }],
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);