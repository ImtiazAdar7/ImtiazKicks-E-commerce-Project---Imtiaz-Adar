const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and balance management
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.name = name || user.name;
    await user.save();
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @swagger
 * /users/stats:
 *   get:
 *     summary: Get user order statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOrders:
 *                   type: number
 *                 totalSpent:
 *                   type: number
 *                 recentOrders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// Get user stats (orders count, total spent, recent orders)
router.get('/stats', auth, async (req, res) => {
  try {
    console.log('=== FETCHING STATS FOR USER ===');
    console.log('User ID:', req.userId);
    
    // Find all orders for this user
    const orders = await Order.find({ user: req.userId })
      .sort('-createdAt');
    
    console.log('Orders found:', orders.length);
    
    // Calculate total orders
    const totalOrders = orders.length;
    
    // Calculate total spent - MANUAL CALCULATION
    let totalSpent = 0;
    orders.forEach(order => {
      console.log('Order:', {
        id: order._id,
        amount: order.totalAmount,
        type: typeof order.totalAmount
      });
      totalSpent += Number(order.totalAmount) || 0;
    });
    
    console.log('Manual total spent calculation:', totalSpent);
    
    // Get recent orders (last 5)
    const recentOrders = orders.slice(0, 5);

    res.json({
      totalOrders,
      totalSpent,
      recentOrders
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @swagger
 * /users/deposit:
 *   post:
 *     summary: Deposit money to user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Deposit successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 newBalance:
 *                   type: number
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid amount
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// Deposit money
router.post('/deposit', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(req.userId);
    user.balance += amount;
    await user.save();

    // Create transaction
    const transaction = new Transaction({
      user: req.userId,
      type: 'deposit',
      amount,
      description: `Deposit of ৳${amount}`
    });
    await transaction.save();

    res.json({
      message: 'Deposit successful',
      newBalance: user.balance,
      transaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @swagger
 * /users/transactions:
 *   get:
 *     summary: Get user transaction history
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// Get transaction history
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId })
      .populate('order')
      .sort('-createdAt');
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrator exclusive endpoints
 */

/**
 * @swagger
 * /users/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */
// ========== ADMIN ROUTES ==========

// Get all users (admin only)
router.get('/admin/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @swagger
 * /users/admin/users/{id}/balance:
 *   put:
 *     summary: Update user balance (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - balance
 *             properties:
 *               balance:
 *                 type: number
 *     responses:
 *       200:
 *         description: Balance updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// Get user by ID (admin only)
router.get('/admin/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user balance (admin only)
router.put('/admin/users/:id/balance', adminAuth, async (req, res) => {
  try {
    const { balance } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.balance = balance;
    await user.save();
    
    // Create transaction record for admin adjustment
    const transaction = new Transaction({
      user: user._id,
      type: 'deposit',
      amount: balance - (user.balance - balance),
      description: 'Balance adjusted by admin'
    });
    await transaction.save();
    
    res.json({
      message: 'User balance updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /users/admin/users/{id}/balance:
 *   put:
 *     summary: Update user balance (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - balance
 *             properties:
 *               balance:
 *                 type: number
 *     responses:
 *       200:
 *         description: Balance updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// Get all orders (admin only)
router.get('/admin/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @swagger
 * /users/admin/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */
// Update order status with refund on cancellation
router.put('/admin/orders/:id', adminAuth, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // If cancelling an order that was previously confirmed/processing
    if (orderStatus === 'cancelled' && 
        ['confirmed', 'processing'].includes(order.orderStatus)) {
      
      // Refund the user
      const user = await User.findById(order.user);
      user.balance += order.totalAmount;
      await user.save();
      
      // Create refund transaction
      const transaction = new Transaction({
        user: order.user,
        type: 'deposit',
        amount: order.totalAmount,
        order: order._id,
        description: `Refund for cancelled order #${order._id}`
      });
      await transaction.save();
      
      toast.success(`Order cancelled and ৳${order.totalAmount} refunded to user`);
    }
    
    order.orderStatus = orderStatus;
    await order.save();
    
    res.json({
      message: 'Order status updated',
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @swagger
 * /users/admin/orders/{id}:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderStatus
 *             properties:
 *               orderStatus:
 *                 type: string
 *                 enum: [processing, confirmed, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
// Get admin stats (admin only)
router.get('/admin/dashboard-stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const recentOrders = await Order.find()
      .populate('user', 'name')
      .sort('-createdAt')
      .limit(10);

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      recentOrders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;