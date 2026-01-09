import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
