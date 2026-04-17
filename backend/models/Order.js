// 📦 Order Module
// Processes orders, stores order details, and enables order tracking with status updates.

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            name: String
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    shippingAddress: {
        street: String,
        city: String,
        zipCode: String,
        country: String
    },
    paymentMethod: {
        type: String,
        default: 'credit-card'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    sellers: [
        {
            seller: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            sellerName: String,
            items: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Product'
                    },
                    quantity: Number,
                    price: Number,
                    name: String
                }
            ],
            amount: Number,
            status: {
                type: String,
                enum: ['pending', 'confirmed', 'shipped', 'delivered'],
                default: 'pending'
            }
        }
    ],
    shippingDate: Date,
    deliveryDate: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-generate order number
orderSchema.pre('save', async function(next) {
    if (this.isNew) {
        this.orderNumber = 'ORD-' + Date.now();
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
