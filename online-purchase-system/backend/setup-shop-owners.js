const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');

async function addShopOwners() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/online-purchase-system', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Create 3 test shop owners
        const shopOwners = [
            {
                name: 'Tech Store',
                email: 'techstore@shop.com',
                password: 'password123',
                phone: '9876543210',
                address: '123 Tech Street',
                city: 'San Francisco',
                zipCode: '94102',
                isShopOwner: true,
                shopName: 'Tech Store - Premium Electronics'
            },
            {
                name: 'Fashion Hub',
                email: 'fashionhub@shop.com',
                password: 'password123',
                phone: '9876543211',
                address: '456 Fashion Ave',
                city: 'New York',
                zipCode: '10001',
                isShopOwner: true,
                shopName: 'Fashion Hub - Latest Trends'
            },
            {
                name: 'Home Essentials',
                email: 'homeessentials@shop.com',
                password: 'password123',
                phone: '9876543212',
                address: '789 Home Street',
                city: 'Los Angeles',
                zipCode: '90001',
                isShopOwner: true,
                shopName: 'Home Essentials - Quality Living'
            }
        ];

        // Check if shop owners already exist
        const existingShopOwners = await User.find({ isShopOwner: true });
        if (existingShopOwners.length === 0) {
            const createdShopOwners = await User.insertMany(shopOwners);
            console.log('\nShop Owners Created:');
            createdShopOwners.forEach(owner => {
                console.log(`- ${owner.shopName} (${owner.email})`);
            });

            // Assign some products to shop owners
            const allShopOwners = await User.find({ isShopOwner: true });
            
            if (allShopOwners.length >= 2) {
                // Tech Store: Electronics products
                await Product.updateMany(
                    { category: 'Electronics' },
                    { 
                        seller: allShopOwners[0]._id, 
                        sellerName: allShopOwners[0].shopName 
                    }
                );
                console.log(`\nAssigned Electronics to ${allShopOwners[0].shopName}`);

                // Fashion Hub: Clothing, Footwear, Accessories
                await Product.updateMany(
                    { category: { $in: ['Clothing', 'Footwear', 'Accessories'] } },
                    { 
                        seller: allShopOwners[1]._id, 
                        sellerName: allShopOwners[1].shopName 
                    }
                );
                console.log(`Assigned Clothing/Footwear/Accessories to ${allShopOwners[1].shopName}`);
            }

            if (allShopOwners.length >= 3) {
                // Home Essentials: Home, Beauty, Sports, Toys, Groceries
                await Product.updateMany(
                    { category: { $in: ['Home', 'Beauty', 'Sports', 'Toys', 'Groceries'] } },
                    { 
                        seller: allShopOwners[2]._id, 
                        sellerName: allShopOwners[2].shopName 
                    }
                );
                console.log(`Assigned Home/Beauty/Sports/Toys/Groceries to ${allShopOwners[2].shopName}`);
            }

            console.log('\n✅ Shop owners and product assignments completed!');
        } else {
            console.log('Shop owners already exist in the database');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

addShopOwners();
