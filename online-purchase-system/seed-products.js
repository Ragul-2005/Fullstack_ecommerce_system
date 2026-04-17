const mongoose = require('./backend/node_modules/mongoose');
require('dotenv').config({ path: './backend/.env' });

const Product = require('./backend/models/Product');

const sampleProducts = [
    {
        name: "Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 99.99,
        category: "Electronics",
        stock: 50,
        image: "https://via.placeholder.com/300?text=Wireless+Headphones"
    },
    {
        name: "Smart Watch",
        description: "Advanced smartwatch with health monitoring features",
        price: 249.99,
        category: "Electronics",
        stock: 30,
        image: "https://via.placeholder.com/300?text=Smart+Watch"
    },
    {
        name: "USB-C Cable",
        description: "Durable 6ft USB-C charging and data cable",
        price: 12.99,
        category: "Electronics",
        stock: 100,
        image: "https://via.placeholder.com/300?text=USB-C+Cable"
    },
    {
        name: "Cotton T-Shirt",
        description: "Comfortable 100% cotton t-shirt in various colors",
        price: 19.99,
        category: "Clothing",
        stock: 75,
        image: "https://via.placeholder.com/300?text=Cotton+T-Shirt"
    },
    {
        name: "Jeans",
        description: "Classic blue denim jeans with perfect fit",
        price: 49.99,
        category: "Clothing",
        stock: 60,
        image: "https://via.placeholder.com/300?text=Jeans"
    },
    {
        name: "JavaScript Guide",
        description: "Comprehensive guide to mastering JavaScript programming",
        price: 29.99,
        category: "Books",
        stock: 40,
        image: "https://via.placeholder.com/300?text=JavaScript+Guide"
    },
    {
        name: "Node.js Bible",
        description: "Complete reference for Node.js development",
        price: 34.99,
        category: "Books",
        stock: 35,
        image: "https://via.placeholder.com/300?text=Node.js+Bible"
    },
    {
        name: "Coffee Maker",
        description: "Automatic coffee maker with brew schedule",
        price: 79.99,
        category: "Home",
        stock: 25,
        image: "https://via.placeholder.com/300?text=Coffee+Maker"
    },
    {
        name: "Table Lamp",
        description: "Modern LED table lamp with adjustable brightness",
        price: 39.99,
        category: "Home",
        stock: 45,
        image: "https://via.placeholder.com/300?text=Table+Lamp"
    },
    {
        name: "Bed Sheets Set",
        description: "Soft cotton bed sheets set with 4 pieces",
        price: 59.99,
        category: "Home",
        stock: 50,
        image: "https://via.placeholder.com/300?text=Bed+Sheets"
    }
];

async function seedProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/online-purchase-system', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert new products
        const result = await Product.insertMany(sampleProducts);
        console.log(`Successfully inserted ${result.length} products`);

        console.log('\nProducts added:');
        result.forEach(product => {
            console.log(`- ${product.name} ($${product.price}) - Category: ${product.category}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
}

seedProducts();
