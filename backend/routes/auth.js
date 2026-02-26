const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and registration
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Imtiaz Adar"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "imtiaz@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 */
// Register
router.post('/register', [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    console.log('Registration attempt:', req.body.email);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      balance: 1000,
      role: 'user' // Default role is user
    });

    await user.save();
    console.log('User saved successfully');

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        role: user.role,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    });
  }
});
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "imtiaz@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    console.log('Login attempt:', req.body.email);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token with role
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        role: user.role,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @swagger
 * /auth/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: Admin login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Access denied - Admin only
 *       500:
 *         description: Server error
 */
// Admin Login - FINAL FIXED VERSION
router.post('/admin/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    console.log('\n=== ADMIN LOGIN ATTEMPT ===');
    console.log('Email received (raw):', req.body.email);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    // Try to find user with EXACT email as provided
    let user = await User.findOne({ email: email.trim() });
    console.log('Searching for exact email:', email.trim());
    console.log('Found:', user ? '✅ Yes' : '❌ No');

    // If not found and it's a Gmail address, try the version WITHOUT dots
    if (!user && email.includes('gmail.com')) {
      // Remove dots from the local part
      const localPart = email.split('@')[0];
      const withoutDots = localPart.replace(/\./g, '') + '@gmail.com';
      console.log('Trying without dots:', withoutDots);
      
      user = await User.findOne({ email: withoutDots });
      console.log('Found:', user ? '✅ Yes' : '❌ No');
    }

    // If still not found and it's a Gmail address, try the version WITH dots
    if (!user && email.includes('gmail.com')) {
      // This handles the case where the original email had dots removed
      // Your DB has: admin.imtiaz@gmail.com (with dot)
      // But normalized gave: adminimtiaz@gmail.com (without dot)
      
      // We need to try inserting dots intelligently
      // For "adminimtiaz", try "admin.imtiaz"
      const localPart = email.split('@')[0];
      
      // Try common dot placements (this is a simple approach)
      const possibleDots = [
        localPart.slice(0, 5) + '.' + localPart.slice(5), // admin.imtiaz
      ];
      
      for (const possible of possibleDots) {
        const withDotsEmail = possible + '@gmail.com';
        console.log('Trying with dots:', withDotsEmail);
        
        user = await User.findOne({ email: withDotsEmail });
        if (user) {
          console.log('✅ Found with dots!');
          break;
        }
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User role from DB:', user.role);

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Admin login successful!');

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        role: user.role,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;