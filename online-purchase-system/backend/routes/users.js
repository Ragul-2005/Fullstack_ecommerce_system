// 👤 User Module
// Handles user registration, login, profile management, and authentication using secure tokens.

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');

// Register user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, address, city, zipCode, isAdmin } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            name,
            email,
            password,
            phone,
            address,
            city,
            zipCode,
            isAdmin: isAdmin || false
        });

        await user.save();

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Register shop owner
router.post('/register-shop-owner', async (req, res) => {
    try {
        const { name, email, password, phone, address, city, zipCode, shopName } = req.body;

        // Validate required fields
        if (!name || !email || !password || !phone || !address || !city || !zipCode || !shopName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new shop owner
        user = new User({
            name,
            email,
            password,
            phone,
            address,
            city,
            zipCode,
            isShopOwner: true,
            shopName
        });

        await user.save();

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, isShopOwner: user.isShopOwner },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            message: 'Shop owner registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                shopName: user.shopName,
                isShopOwner: true
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, isAdmin: user.isAdmin, isShopOwner: user.isShopOwner },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isShopOwner: user.isShopOwner,
                shopName: user.shopName
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        let user = await User.findById(req.user.id);

        if (req.body.name) user.name = req.body.name;
        if (req.body.phone) user.phone = req.body.phone;
        if (req.body.address) user.address = req.body.address;
        if (req.body.city) user.city = req.body.city;
        if (req.body.zipCode) user.zipCode = req.body.zipCode;

        user = await user.save();
        res.json({ message: 'Profile updated', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all users (Admin only)
router.get('/', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
