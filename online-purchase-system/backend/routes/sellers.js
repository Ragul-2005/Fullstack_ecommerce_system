const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth, admin } = require('../middleware/auth');

// Get all sellers (admin only)
router.get('/all-sellers', auth, admin, async (req, res) => {
    try {
        const sellers = await User.find({ isShopOwner: true }).select('-password');
        res.json(sellers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get seller's received orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        // Check if user is a shop owner
        const user = await User.findById(req.user.id);
        if (!user || !user.isShopOwner) {
            return res.status(403).json({ message: 'Only shop owners can access this' });
        }

        // Find orders that include this seller's products
        // Convert string ID to ObjectId for proper matching
        const sellerId = new mongoose.Types.ObjectId(req.user.id);
        
        const orders = await Order.find({
            'sellers.seller': sellerId
        }).populate('user', 'name email phone').sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order status (shop owner)
router.put('/:orderId/status', auth, async (req, res) => {
    try {
        const { sellerIndex, newStatus } = req.body;

        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify the seller owns this order
        const sellerId = new mongoose.Types.ObjectId(req.user.id);
        if (!order.sellers[sellerIndex] || order.sellers[sellerIndex].seller.toString() !== sellerId.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Update seller's order status
        order.sellers[sellerIndex].status = newStatus;
        
        // If all sellers confirm, update main order status
        const allConfirmed = order.sellers.every(s => s.status !== 'pending');
        if (allConfirmed && order.status === 'pending') {
            order.status = 'confirmed';
        }

        await order.save();

        // Real-time notifications
        const io = req.app.get('io');
        if (io) {
            // Notify the customer about status update
            io.to(`customer-${order.user.toString()}`).emit('order-status-updated', {
                orderId: order._id,
                sellerIndex: sellerIndex,
                newStatus: newStatus,
                order: order
            });

            // Notify all sellers about the status change (for dashboard updates)
            order.sellers.forEach((seller, index) => {
                if (seller.seller) {
                    io.to(`seller-${seller.seller.toString()}`).emit('order-status-changed', {
                        orderId: order._id,
                        sellerIndex: index,
                        newStatus: seller.status,
                        order: order
                    });
                }
            });
        }

        res.json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get seller profile
router.get('/profile', auth, async (req, res) => {
    try {
        const seller = await User.findById(req.user.id).select('-password');
        if (!seller || !seller.isShopOwner) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.json(seller);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get seller's products
router.get('/products', auth, async (req, res) => {
    try {
        const sellerId = new mongoose.Types.ObjectId(req.user.id);
        const products = await Product.find({ seller: sellerId });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get seller stats
router.get('/stats', auth, async (req, res) => {
    try {
        const seller = await User.findById(req.user.id);
        if (!seller || !seller.isShopOwner) {
            return res.status(403).json({ message: 'Not a shop owner' });
        }

        const sellerId = new mongoose.Types.ObjectId(req.user.id);
        const orders = await Order.find({ 'sellers.seller': sellerId });
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => {
            const sellerData = order.sellers.find(s => s.seller.toString() === sellerId.toString());
            return sum + (sellerData ? sellerData.amount : 0);
        }, 0);
        const products = await Product.countDocuments({ seller: sellerId });

        res.json({
            totalOrders,
            totalRevenue,
            totalProducts: products,
            sellerName: seller.shopName || seller.name
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
