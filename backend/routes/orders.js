const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - shippingAddress
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     size:
 *                       type: number
 *                     color:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *                 newBalance:
 *                   type: number
 *       400:
 *         description: Insufficient balance
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admins cannot place orders
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
// Create order
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (user.role === 'admin') {
      return res.status(403).json({ 
        message: 'Admins cannot place orders.' 
      });
    }

    const { items, shippingAddress } = req.body;
    
    // Calculate total - ensure it's a number
    let totalAmount = 0;
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      totalAmount += Number(product.price) * Number(item.quantity);
    }
    
    // Ensure totalAmount is a number
    totalAmount = Number(totalAmount.toFixed(2));

    // Check user balance
    if (user.balance < totalAmount) {
      return res.status(400).json({ 
        message: 'Insufficient balance',
        required: totalAmount,
        available: user.balance
      });
    }

    // Create order with explicit number type
    const order = new Order({
      user: req.userId,
      items: items.map(item => ({
        product: item.productId,
        name: item.name,
        price: Number(item.price),
        size: item.size,
        color: item.color,
        quantity: Number(item.quantity)
      })),
      totalAmount: totalAmount, // Ensure it's a number
      shippingAddress,
      paymentStatus: 'completed',
      orderStatus: 'confirmed'
    });

    await order.save();
    console.log('Order saved with totalAmount:', order.totalAmount, 'type:', typeof order.totalAmount);

    // Deduct balance
    user.balance -= totalAmount;
    await user.save();

    // Create transaction
    const transaction = new Transaction({
      user: req.userId,
      type: 'payment',
      amount: totalAmount,
      order: order._id,
      description: `Payment for order #${order._id}`
    });
    await transaction.save();

    res.status(201).json({
      order,
      newBalance: user.balance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('items.product')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;