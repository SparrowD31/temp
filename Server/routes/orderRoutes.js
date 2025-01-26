const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

console.log('Setting up admin order routes');

// Admin routes should be first
router.get('/admin/orders', async (req, res) => {
  console.log('Admin orders route hit');
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    console.log('Found orders:', orders);
    res.json(orders);
  } catch (error) {
    console.error('Error in /admin/orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Test route to verify routing is working
router.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Order routes are working' });
});

// Create new order
router.post('/orders', async (req, res) => {
  try {
    const {
      userId,
      paymentId,
      items,
      shippingAddress,
      total
    } = req.body;

    console.log('Received order data:', JSON.stringify(req.body, null, 2));


    console.log(shippingAddress,'dbjd');
    
    // Validate required fields
    if (!userId || !paymentId || !items || !total) {
      return res.status(400).json({
        message: 'Missing required fields',
        received: { userId, paymentId, itemsCount: items?.length, total }
      });
    }

    // Validate userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: 'Invalid userId format',
        received: userId
      });
    }

    // Validate items array
    const validatedItems = items.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size
    }));

    // Generate unique order ID
    const orderId = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;

    const order = new Order({
      orderId,
      userId,
      paymentId,
      items: validatedItems,
      shippingAddress,
      total
    });

    console.log('Order object before save:', order);

    const savedOrder = await order.save();
    console.log('Order saved successfully:', savedOrder);

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create order',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get user's orders
router.get('/orders', async (req, res) => {
  try {
    const { userId } = req.query;
    
    console.log('Attempting to fetch orders for userId:', userId);

    // Validate if userId is provided
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        message: 'Invalid userId format',
        received: userId,
        expectedFormat: '24 character hex string'
      });
    }

    console.log('Executing database query for userId:', userId);
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean(); // Add lean() for better performance

    console.log('Query results:', orders);

    // Check if any orders were found
    if (!orders || orders.length === 0) {
      return res.status(404).json({ 
        message: 'No orders found for this user',
        userId: userId
      });
    }

    res.json(orders);
  } catch (error) {
    console.error('Detailed error in /orders route:', {
      error: error.message,
      stack: error.stack,
      userId: req.query.userId
    });

    res.status(500).json({ 
      message: 'Failed to fetch orders',
      error: error.message,
      details: {
        userId: req.query.userId,
        errorName: error.name
      },
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Add this route to update order status (admin only)
router.patch('/admin/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findOneAndUpdate(
      { orderId: orderId },
      { status: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order' });
  }
});

module.exports = router; 