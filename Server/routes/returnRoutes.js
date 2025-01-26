const express = require('express');
const router = express.Router();
const Return = require('../models/Return');

console.log('Setting up return routes');

// Create new return request (for users)
router.post('/returns', async (req, res) => {
  console.log('Return request received:', req.body);
  try {
    const { orderId, email, reason, message, userId } = req.body;

    // Validate required fields
    if (!orderId || !email || !reason) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newReturn = new Return({
      orderId,
      userId,
      email,
      reason,
      message,
      status: 'pending'
    });

    const savedReturn = await newReturn.save();
    console.log('Return saved:', savedReturn);
    res.status(201).json(savedReturn);
  } catch (error) {
    console.error('Error creating return:', error);
    res.status(500).json({ message: 'Failed to create return request' });
  }
});

// Get all returns (admin only)
router.get('/admin/returns', async (req, res) => {
  console.log('Fetching returns');
  try {
    const returns = await Return.find({}).sort({ createdAt: -1 });
    res.json(returns);
  } catch (error) {
    console.error('Error fetching returns:', error);
    res.status(500).json({ message: 'Failed to fetch returns' });
  }
});

// Update return status (admin only)
router.patch('/admin/returns/:returnId', async (req, res) => {
  try {
    const { returnId } = req.params;
    const { status } = req.body;

    const updatedReturn = await Return.findByIdAndUpdate(
      returnId,
      { status },
      { new: true }
    );

    if (!updatedReturn) {
      return res.status(404).json({ message: 'Return request not found' });
    }

    res.json(updatedReturn);
  } catch (error) {
    console.error('Error updating return request:', error);
    res.status(500).json({ message: 'Failed to update return request' });
  }
});

// Get single return request details
router.get('/admin/returns/:returnId', async (req, res) => {
  try {
    const { returnId } = req.params;
    const returnRequest = await Return.findById(returnId);

    if (!returnRequest) {
      return res.status(404).json({ message: 'Return request not found' });
    }

    res.json(returnRequest);
  } catch (error) {
    console.error('Error fetching return request:', error);
    res.status(500).json({ message: 'Failed to fetch return request' });
  }
});

module.exports = router; 