// ⭐ Wishlist System
// API routes for managing user wishlists

const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { auth } = require('../middleware/auth');

// Get user's wishlist
router.get('/', auth, async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ user: req.user.id }).populate('product');
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishlist' });
    }
});

// Add product to wishlist
router.post('/:productId', auth, async (req, res) => {
    try {
        const existing = await Wishlist.findOne({ user: req.user.id, product: req.params.productId });
        if (existing) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        const wishlistItem = new Wishlist({
            user: req.user.id,
            product: req.params.productId
        });

        await wishlistItem.save();
        res.json({ message: 'Added to wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to wishlist' });
    }
});

// Remove from wishlist
router.delete('/:productId', auth, async (req, res) => {
    try {
        await Wishlist.findOneAndDelete({ user: req.user.id, product: req.params.productId });
        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from wishlist' });
    }
});

// Move from wishlist to cart
router.post('/:productId/move-to-cart', auth, async (req, res) => {
    try {
        // Remove from wishlist
        await Wishlist.findOneAndDelete({ user: req.user.id, product: req.params.productId });

        // Add to cart logic (assuming cart is in localStorage on frontend)
        res.json({ message: 'Moved to cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error moving to cart' });
    }
});

module.exports = router;