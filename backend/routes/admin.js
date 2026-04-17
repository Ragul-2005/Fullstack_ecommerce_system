// Admin Dashboard Stats
// Provides total users, orders, revenue

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, admin } = require('../middleware/auth');

// Get admin stats
router.get('/stats', auth, admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ isAdmin: false });
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalProducts = await Product.countDocuments();

        res.json({
            totalUsers,
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalProducts
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

module.exports = router;