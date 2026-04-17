// 🔔 Notification Module
// Implements real-time updates using Socket.IO for order confirmation and status changes.

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Redirect root to landing page before static fallback
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/landing.html'));
});

app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Socket.IO Connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join seller room for real-time updates
    socket.on('join-seller-room', (sellerId) => {
        socket.join(`seller-${sellerId}`);
        console.log(`Seller ${sellerId} joined room`);
    });

    // Join customer room
    socket.on('join-customer-room', (customerId) => {
        socket.join(`customer-${customerId}`);
        console.log(`Customer ${customerId} joined room`);
    });

    // Join admin room for real-time order updates
    socket.on('join-admin-room', () => {
        socket.join('admin-room');
        console.log('Admin joined room');
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Make io accessible in routes
app.set('io', io);

// Redirect root to landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/landing.html'));
});

// Import Routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');
const sellerRoutes = require('./routes/sellers');
const wishlistRoutes = require('./routes/wishlist');
const adminRoutes = require('./routes/admin');

// Use Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);

// Test Route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
