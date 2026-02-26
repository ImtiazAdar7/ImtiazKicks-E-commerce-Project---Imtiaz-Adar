const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 1000
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('Comparing password...');
    console.log('Candidate password:', candidatePassword);
    console.log('Stored hash:', this.password);
    
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('bcrypt.compare result:', isMatch);
    
    return isMatch;
  } catch (error) {
    console.error('Error in comparePassword:', error);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);