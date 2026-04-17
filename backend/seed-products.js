const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const sampleProducts = [
    // ELECTRONICS
    {
        name: "Laptop",
        description: "High-performance laptop with latest processor",
        price: 899.99,
        category: "Electronics",
        stock: 20,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop"
    },
    {
        name: "Smartphone",
        description: "Latest smartphone with advanced camera",
        price: 799.99,
        category: "Electronics",
        stock: 40,
        image: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=400&fit=crop"
    },
    {
        name: "Tablet",
        description: "10-inch tablet for work and entertainment",
        price: 499.99,
        category: "Electronics",
        stock: 30,
        image: "https://images.unsplash.com/photo-1526045612519-fbb3d1ac9caf?w=400&h=400&fit=crop"
    },
    {
        name: "Smart Watch",
        description: "Smartwatch with fitness tracking features",
        price: 249.99,
        category: "Electronics",
        stock: 35,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"
    },
    {
        name: "Bluetooth Speaker",
        description: "Portable waterproof Bluetooth speaker",
        price: 79.99,
        category: "Electronics",
        stock: 50,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop"
    },
    {
        name: "Wireless Earbuds",
        description: "True wireless earbuds with noise cancellation",
        price: 129.99,
        category: "Electronics",
        stock: 60,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
    },
    {
        name: "Headphones",
        description: "Over-ear headphones with superior sound",
        price: 149.99,
        category: "Electronics",
        stock: 45,
        image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop"
    },
    {
        name: "Power Bank",
        description: "20000mAh portable power bank",
        price: 29.99,
        category: "Electronics",
        stock: 100,
        image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop"
    },
    {
        name: "USB Cable",
        description: "High-speed USB charging cable",
        price: 9.99,
        category: "Electronics",
        stock: 150,
        image: "https://images.unsplash.com/photo-1625948515291-cf613b0d63ad?w=400&h=400&fit=crop"
    },
    {
        name: "Charger",
        description: "Fast charging adapter",
        price: 19.99,
        category: "Electronics",
        stock: 80,
        image: "https://images.unsplash.com/photo-1591290619762-b1e3c01ba56b?w=400&h=400&fit=crop"
    },

    // CLOTHING
    {
        name: "T-Shirt",
        description: "Comfortable cotton t-shirt in various colors",
        price: 19.99,
        category: "Clothing",
        stock: 100,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
    },
    {
        name: "Jeans",
        description: "Classic blue denim jeans",
        price: 49.99,
        category: "Clothing",
        stock: 60,
        image: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop"
    },
    {
        name: "Jacket",
        description: "Stylish winter jacket",
        price: 129.99,
        category: "Clothing",
        stock: 40,
        image: "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=400&fit=crop"
    },
    {
        name: "Shirt",
        description: "Formal business shirt",
        price: 39.99,
        category: "Clothing",
        stock: 50,
        image: "https://images.unsplash.com/photo-1607622814075-e51df1bdc82f?w=400&h=400&fit=crop"
    },
    {
        name: "Hoodie",
        description: "Comfortable hoodie sweatshirt",
        price: 59.99,
        category: "Clothing",
        stock: 70,
        image: "https://images.unsplash.com/photo-1556821552-5f75b42fc4d1?w=400&h=400&fit=crop"
    },
    {
        name: "Sweater",
        description: "Cozy knit sweater",
        price: 49.99,
        category: "Clothing",
        stock: 55,
        image: "https://images.unsplash.com/photo-1572886165447-f4f41e294d70?w=400&h=400&fit=crop"
    },
    {
        name: "Shorts",
        description: "Casual shorts for summer",
        price: 29.99,
        category: "Clothing",
        stock: 80,
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop"
    },
    {
        name: "Track Pants",
        description: "Comfortable track pants for sports",
        price: 39.99,
        category: "Clothing",
        stock: 65,
        image: "https://images.unsplash.com/photo-1506629082632-401017062422?w=400&h=400&fit=crop"
    },

    // FOOTWEAR
    {
        name: "Running Shoes",
        description: "Professional running shoes",
        price: 119.99,
        category: "Footwear",
        stock: 50,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"
    },
    {
        name: "Casual Shoes",
        description: "Comfortable everyday casual shoes",
        price: 79.99,
        category: "Footwear",
        stock: 60,
        image: "https://images.unsplash.com/photo-1564506592746-a59e64b96423?w=400&h=400&fit=crop"
    },
    {
        name: "Sandals",
        description: "Summer sandals",
        price: 29.99,
        category: "Footwear",
        stock: 80,
        image: "https://images.unsplash.com/photo-1572099160767-da2aee6b0914?w=400&h=400&fit=crop"
    },
    {
        name: "Slippers",
        description: "Soft indoor slippers",
        price: 19.99,
        category: "Footwear",
        stock: 100,
        image: "https://images.unsplash.com/photo-1582194979521-51bb10da8e4a?w=400&h=400&fit=crop"
    },
    {
        name: "Boots",
        description: "Leather boots for winter",
        price: 149.99,
        category: "Footwear",
        stock: 35,
        image: "https://images.unsplash.com/photo-1608533860975-6d7a6f20a93e?w=400&h=400&fit=crop"
    },

    // BEAUTY
    {
        name: "Face Cream",
        description: "Moisturizing face cream",
        price: 24.99,
        category: "Beauty",
        stock: 75,
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop"
    },
    {
        name: "Perfume",
        description: "Premium fragrance perfume",
        price: 49.99,
        category: "Beauty",
        stock: 50,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop"
    },
    {
        name: "Lipstick",
        description: "Long-lasting lipstick",
        price: 14.99,
        category: "Beauty",
        stock: 100,
        image: "https://images.unsplash.com/photo-1586167753519-9d532264b3a2?w=400&h=400&fit=crop"
    },
    {
        name: "Shampoo",
        description: "Hair care shampoo",
        price: 12.99,
        category: "Beauty",
        stock: 90,
        image: "https://images.unsplash.com/photo-1556228241-b0410d43ae73?w=400&h=400&fit=crop"
    },
    {
        name: "Conditioner",
        description: "Hair conditioning treatment",
        price: 12.99,
        category: "Beauty",
        stock: 85,
        image: "https://images.unsplash.com/photo-1556228241-b0410d43ae73?w=400&h=400&fit=crop"
    },
    {
        name: "Body Lotion",
        description: "Nourishing body lotion",
        price: 16.99,
        category: "Beauty",
        stock: 70,
        image: "https://images.unsplash.com/photo-1609270268529-1b0a3ca46489?w=400&h=400&fit=crop"
    },

    // SPORTS
    {
        name: "Cricket Bat",
        description: "Professional cricket bat",
        price: 79.99,
        category: "Sports",
        stock: 30,
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop"
    },
    {
        name: "Football",
        description: "Official football ball",
        price: 34.99,
        category: "Sports",
        stock: 50,
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop"
    },
    {
        name: "Basketball",
        description: "Professional basketball",
        price: 39.99,
        category: "Sports",
        stock: 45,
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop"
    },
    {
        name: "Badminton Racket",
        description: "Badminton racket set",
        price: 44.99,
        category: "Sports",
        stock: 40,
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop"
    },
    {
        name: "Tennis Ball",
        description: "Professional tennis ball set",
        price: 14.99,
        category: "Sports",
        stock: 80,
        image: "https://images.unsplash.com/photo-1449246908059-42a90143e232?w=400&h=400&fit=crop"
    },
    {
        name: "Yoga Mat",
        description: "Non-slip yoga mat",
        price: 24.99,
        category: "Sports",
        stock: 60,
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop"
    },

    // TOYS
    {
        name: "Toy Car",
        description: "Miniature toy car",
        price: 9.99,
        category: "Toys",
        stock: 100,
        image: "https://images.unsplash.com/photo-1530309592189-fd82f42fbb47?w=400&h=400&fit=crop"
    },
    {
        name: "Doll",
        description: "Fashion doll toy",
        price: 19.99,
        category: "Toys",
        stock: 70,
        image: "https://images.unsplash.com/photo-1518895333857-b7b52e2b6b16?w=400&h=400&fit=crop"
    },
    {
        name: "Puzzle Game",
        description: "Challenging puzzle game",
        price: 14.99,
        category: "Toys",
        stock: 60,
        image: "https://images.unsplash.com/photo-1500504442352-b2379c05eece?w=400&h=400&fit=crop"
    },
    {
        name: "Building Blocks",
        description: "Colorful building block set",
        price: 24.99,
        category: "Toys",
        stock: 80,
        image: "https://images.unsplash.com/photo-1517329433159-fbbf370cf1a7?w=400&h=400&fit=crop"
    },
    {
        name: "Remote Control Car",
        description: "RC car with remote control",
        price: 34.99,
        category: "Toys",
        stock: 50,
        image: "https://images.unsplash.com/photo-1530309592189-fd82f42fbb47?w=400&h=400&fit=crop"
    },

    // GROCERIES
    {
        name: "Rice",
        description: "1kg bag of basmati rice",
        price: 4.99,
        category: "Groceries",
        stock: 200,
        image: "https://images.unsplash.com/photo-1599599810694-52d5a08b26a3?w=400&h=400&fit=crop"
    },
    {
        name: "Wheat Flour",
        description: "1kg wheat flour",
        price: 3.99,
        category: "Groceries",
        stock: 180,
        image: "https://images.unsplash.com/photo-1599599810694-52d5a08b26a3?w=400&h=400&fit=crop"
    },
    {
        name: "Cooking Oil",
        description: "1 liter cooking oil",
        price: 8.99,
        category: "Groceries",
        stock: 150,
        image: "https://images.unsplash.com/photo-1599599810694-52d5a08b26a3?w=400&h=400&fit=crop"
    },
    {
        name: "Sugar",
        description: "1kg sugar",
        price: 3.49,
        category: "Groceries",
        stock: 200,
        image: "https://images.unsplash.com/photo-1599599810694-52d5a08b26a3?w=400&h=400&fit=crop"
    },
    {
        name: "Salt",
        description: "Sea salt 500g",
        price: 2.49,
        category: "Groceries",
        stock: 250,
        image: "https://images.unsplash.com/photo-1599599810694-52d5a08b26a3?w=400&h=400&fit=crop"
    },
    {
        name: "Milk",
        description: "1 liter fresh milk",
        price: 3.99,
        category: "Groceries",
        stock: 100,
        image: "https://images.unsplash.com/photo-1599599810694-52d5a08b26a3?w=400&h=400&fit=crop"
    },
    {
        name: "Tea Powder",
        description: "250g premium tea",
        price: 5.99,
        category: "Groceries",
        stock: 120,
        image: "https://images.unsplash.com/photo-1599599810694-52d5a08b26a3?w=400&h=400&fit=crop"
    },
    {
        name: "Coffee",
        description: "250g coffee powder",
        price: 7.99,
        category: "Groceries",
        stock: 100,
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=400&h=400&fit=crop"
    },

    // FURNITURE
    {
        name: "Chair",
        description: "Comfortable office chair",
        price: 99.99,
        category: "Furniture",
        stock: 30,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"
    },
    {
        name: "Table",
        description: "Sturdy dining table",
        price: 199.99,
        category: "Furniture",
        stock: 20,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"
    },
    {
        name: "Sofa",
        description: "Comfortable 3-seater sofa",
        price: 399.99,
        category: "Furniture",
        stock: 15,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"
    },
    {
        name: "Bed",
        description: "Queen size bed frame",
        price: 349.99,
        category: "Furniture",
        stock: 18,
        image: "https://images.unsplash.com/photo-1540932239986-310128078ceb?w=400&h=400&fit=crop"
    },
    {
        name: "Cupboard",
        description: "Wooden storage cupboard",
        price: 149.99,
        category: "Furniture",
        stock: 25,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"
    },
    {
        name: "Study Desk",
        description: "Modern study desk",
        price: 129.99,
        category: "Furniture",
        stock: 35,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"
    },

    // AUTOMOBILE
    {
        name: "Car Cover",
        description: "Universal car cover",
        price: 29.99,
        category: "Automobile",
        stock: 50,
        image: "https://images.unsplash.com/photo-1581274455760-ad1ebf63ce96?w=400&h=400&fit=crop"
    },
    {
        name: "Bike Helmet",
        description: "Safety bike helmet",
        price: 39.99,
        category: "Automobile",
        stock: 60,
        image: "https://images.unsplash.com/photo-1552820728-8ac41f1122a8?w=400&h=400&fit=crop"
    },
    {
        name: "Car Vacuum Cleaner",
        description: "Portable car vacuum",
        price: 49.99,
        category: "Automobile",
        stock: 35,
        image: "https://images.unsplash.com/photo-1558618667-67e22f3a1f09?w=400&h=400&fit=crop"
    },
    {
        name: "Seat Cover",
        description: "Car seat cover set",
        price: 34.99,
        category: "Automobile",
        stock: 45,
        image: "https://images.unsplash.com/photo-1581274455760-ad1ebf63ce96?w=400&h=400&fit=crop"
    },
    {
        name: "Car Perfume",
        description: "Car air freshener",
        price: 9.99,
        category: "Automobile",
        stock: 100,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop"
    },

    // STATIONERY
    {
        name: "Notebook",
        description: "100 page notebook",
        price: 5.99,
        category: "Stationery",
        stock: 150,
        image: "https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=400&h=400&fit=crop"
    },
    {
        name: "Pen",
        description: "Ball point pen pack of 10",
        price: 4.99,
        category: "Stationery",
        stock: 200,
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop"
    },
    {
        name: "Pencil",
        description: "Pencil set 12 pieces",
        price: 6.99,
        category: "Stationery",
        stock: 180,
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop"
    },
    {
        name: "Eraser",
        description: "Rubber eraser",
        price: 1.99,
        category: "Stationery",
        stock: 250,
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop"
    },
    {
        name: "Marker",
        description: "Marker pen set",
        price: 7.99,
        category: "Stationery",
        stock: 120,
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop"
    },
    {
        name: "Highlighter",
        description: "Highlighter marker pack",
        price: 5.99,
        category: "Stationery",
        stock: 140,
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop"
    },

    // ACCESSORIES
    {
        name: "Water Bottle",
        description: "1 liter water bottle",
        price: 14.99,
        category: "Accessories",
        stock: 100,
        image: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?w=400&h=400&fit=crop"
    },
    {
        name: "Backpack",
        description: "School/travel backpack",
        price: 44.99,
        category: "Accessories",
        stock: 60,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"
    },
    {
        name: "Handbag",
        description: "Stylish leather handbag",
        price: 69.99,
        category: "Accessories",
        stock: 40,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop"
    },
    {
        name: "Sunglasses",
        description: "UV protection sunglasses",
        price: 34.99,
        category: "Accessories",
        stock: 80,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop"
    },
    {
        name: "Watch",
        description: "Analog wristwatch",
        price: 49.99,
        category: "Accessories",
        stock: 70,
        image: "https://images.unsplash.com/photo-1505856217317-d7b92b8de0be?w=400&h=400&fit=crop"
    },

    // HOME
    {
        name: "Mixer Grinder",
        description: "3-in-1 mixer grinder",
        price: 89.99,
        category: "Home",
        stock: 25,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop"
    },
    {
        name: "LED Bulb",
        description: "Energy-efficient LED bulb",
        price: 4.99,
        category: "Home",
        stock: 200,
        image: "https://images.unsplash.com/photo-1540932239986-310128078ceb?w=400&h=400&fit=crop"
    },
    {
        name: "Ceiling Fan",
        description: "3-blade ceiling fan",
        price: 79.99,
        category: "Home",
        stock: 35,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
    },
    {
        name: "Electric Kettle",
        description: "1.5 liter electric kettle",
        price: 24.99,
        category: "Home",
        stock: 60,
        image: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop"
    },
    {
        name: "Iron Box",
        description: "Steam iron box",
        price: 39.99,
        category: "Home",
        stock: 40,
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop"
    },

    // BOOKS
    {
        name: "Java Programming Book",
        description: "Comprehensive Java programming guide",
        price: 34.99,
        category: "Books",
        stock: 40,
        image: "https://images.unsplash.com/photo-1507842955343-583cf152b692?w=400&h=400&fit=crop"
    },
    {
        name: "Data Structures Book",
        description: "Data structures and algorithms reference",
        price: 39.99,
        category: "Books",
        stock: 35,
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=400&fit=crop"
    },
    {
        name: "Python Programming Book",
        description: "Python for beginners and professionals",
        price: 29.99,
        category: "Books",
        stock: 50,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop"
    },
    {
        name: "Machine Learning Book",
        description: "Introduction to Machine Learning",
        price: 49.99,
        category: "Books",
        stock: 30,
        image: "https://images.unsplash.com/photo-1507842955343-583cf152b692?w=400&h=400&fit=crop"
    },
    {
        name: "Operating System Book",
        description: "Operating Systems concepts and design",
        price: 44.99,
        category: "Books",
        stock: 25,
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=400&fit=crop"
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
