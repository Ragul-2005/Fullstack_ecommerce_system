const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

// Generate fake transaction ID
function generateTransactionId() {
    return 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Generate payment ID
function generatePaymentId() {
    return 'PAY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Validate card number (simple fake validation - accepts any 16 digit number)
function validateCardNumber(cardNumber) {
    return cardNumber && cardNumber.replace(/\s/g, '').length === 16 && /^\d+$/.test(cardNumber.replace(/\s/g, ''));
}

// Validate expiry date
function validateExpiryDate(expiryDate) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return regex.test(expiryDate);
}

// Validate CVV
function validateCVV(cvv) {
    return cvv && cvv.length >= 3 && cvv.length <= 4 && /^\d+$/.test(cvv);
}

// Process fake payment
router.post('/process', auth, async (req, res) => {
    try {
        const { orderId, amount, paymentMethod, cardDetails } = req.body;

        // Validate payment method
        if (!['credit-card', 'debit-card', 'paypal'].includes(paymentMethod)) {
            return res.status(400).json({ message: 'Invalid payment method' });
        }

        // Validate order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify order belongs to user
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Verify amount matches
        if (amount !== order.totalAmount) {
            return res.status(400).json({ message: 'Amount mismatch' });
        }

        const paymentId = generatePaymentId();
        const transactionId = generateTransactionId();

        // Validate card details for card payments
        if (paymentMethod === 'credit-card' || paymentMethod === 'debit-card') {
            if (!cardDetails || !cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
                return res.status(400).json({ message: 'Missing card details' });
            }

            if (!validateCardNumber(cardDetails.cardNumber)) {
                return res.status(400).json({ message: 'Invalid card number' });
            }

            if (!validateExpiryDate(cardDetails.expiryDate)) {
                return res.status(400).json({ message: 'Invalid expiry date (MM/YY)' });
            }

            if (!validateCVV(cardDetails.cvv)) {
                return res.status(400).json({ message: 'Invalid CVV' });
            }
        }

        // Create payment record
        const payment = new Payment({
            paymentId,
            order: orderId,
            user: req.user.id,
            amount,
            paymentMethod,
            cardDetails: paymentMethod !== 'paypal' ? {
                cardNumber: '****' + cardDetails.cardNumber.slice(-4),
                expiryDate: cardDetails.expiryDate,
                cvv: '***'
            } : undefined,
            status: 'success',
            transactionId,
            processedAt: new Date()
        });

        await payment.save();

        // Update order status to confirmed
        order.status = 'confirmed';
        order.paymentMethod = paymentMethod;
        await order.save();

        res.status(201).json({
            success: true,
            message: 'Payment processed successfully',
            payment: {
                paymentId,
                transactionId,
                amount,
                paymentMethod,
                status: 'success'
            },
            order
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get payment details
router.get('/:paymentId', auth, async (req, res) => {
    try {
        const payment = await Payment.findOne({ paymentId: req.params.paymentId });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Verify user owns this payment
        if (payment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all payments for user
router.get('/', auth, async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
