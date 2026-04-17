// 📦 Order Module
// Processes orders, stores order details, and enables order tracking with status updates.

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, admin } = require('../middleware/auth');

// Create new order
router.post('/', auth, async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total amount and group items by seller
        let totalAmount = 0;
        const orderItems = [];
        const sellerMap = new Map();

        for (let item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.product} not found` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            const itemPrice = product.price * item.quantity;
            totalAmount += itemPrice;
            
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
                name: product.name
            });

            // Group by seller
            const sellerId = product.seller ? product.seller.toString() : 'default';
            if (!sellerMap.has(sellerId)) {
                sellerMap.set(sellerId, {
                    seller: product.seller || null,
                    sellerName: product.sellerName || 'Store Owner',
                    items: [],
                    amount: 0
                });
            }
            
            const sellerData = sellerMap.get(sellerId);
            sellerData.items.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
                name: product.name
            });
            sellerData.amount += itemPrice;

            // Reduce stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Generate unique order number
        const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        // Convert seller map to array
        const sellers = Array.from(sellerMap.values());

        const order = new Order({
            orderNumber,
            user: req.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            sellers: sellers
        });

        await order.save();

        // Reduce stock for ordered products
        for (let item of items) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
        }

        // Real-time notifications to sellers
        const io = req.app.get('io');
        if (io) {
            // Notify each seller about the new order
            sellers.forEach(sellerData => {
                if (sellerData.seller) {
                    io.to(`seller-${sellerData.seller.toString()}`).emit('new-order', {
                        order: order,
                        sellerData: sellerData
                    });
                }
            });

            // Notify admin about the new order
            io.to('admin-room').emit('new-order', {
                order: order,
                customer: req.user
            });

            // Notify customer about order confirmation
            io.to(`customer-${req.user.id}`).emit('order-confirmed', {
                order: order
            });
        }

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user')
            .populate('items.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is the owner or admin
        if (order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all orders (Admin only)
router.get('/', auth, admin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order status (Admin only)
router.put('/:id/status', auth, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        if (status === 'shipped') {
            order.shippingDate = new Date();
        }

        await order.save();

        const io = req.app.get('io');
        if (io) {
            io.to(`customer-${order.user.toString()}`).emit('order-status-updated', {
                orderId: order._id,
                newStatus: status,
                order: order
            });
        }

        res.json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update payment status (Admin only)
router.put('/:id/payment', auth, admin, async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        const validStatuses = ['pending', 'completed', 'failed'];

        if (!validStatuses.includes(paymentStatus)) {
            return res.status(400).json({ message: 'Invalid payment status' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { paymentStatus },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Payment status updated', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Cancel order
router.put('/:id/cancel', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (order.status === 'shipped' || order.status === 'delivered') {
            return res.status(400).json({ message: 'Cannot cancel shipped/delivered orders' });
        }

        order.status = 'cancelled';
        await order.save();

        res.json({ message: 'Order cancelled', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
