# Online Purchase System - MongoDB Setup Guide

## 📦 Installing MongoDB

### Option 1: MongoDB Community Edition (Local)

#### Windows
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer (.msi file)
3. Follow installation wizard
4. MongoDB will be installed as a service
5. Start service: Open Services and find "MongoDB Server"

#### MacOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list
apt-get update
apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new project
4. Create a cluster (free tier available)
5. Add database user
6. Get connection string
7. Update MONGODB_URI in .env:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/online-purchase-system?retryWrites=true&w=majority
   ```

## ✅ Verify MongoDB Installation

### Local MongoDB
```bash
mongosh
```
If you see `>` prompt, MongoDB is running correctly.

### MongoDB Atlas
Test connection from VS Code terminal:
```bash
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/test"
```

## 🗄️ Create Database

```bash
mongosh
use online-purchase-system
db.createCollection("products")
db.createCollection("users")
db.createCollection("orders")
```

## 📊 Sample Data (Optional)

Run these commands in mongolsh to add sample data:

```javascript
db.products.insertMany([
  {
    name: "Laptop",
    description: "High-performance business laptop",
    price: 999.99,
    category: "Electronics",
    stock: 5,
    image: "https://via.placeholder.com/300?text=Laptop",
    rating: 0
  },
  {
    name: "Headphones",
    description: "Wireless noise-cancelling headphones",
    price: 199.99,
    category: "Electronics",
    stock: 15,
    image: "https://via.placeholder.com/300?text=Headphones",
    rating: 0
  },
  {
    name: "Running Shoes",
    description: "Comfortable athletic running shoes",
    price: 89.99,
    category: "Clothing",
    stock: 20,
    image: "https://via.placeholder.com/300?text=Shoes",
    rating: 0
  },
  {
    name: "JavaScript Book",
    description: "Learn JavaScript programming",
    price: 39.99,
    category: "Books",
    stock: 10,
    image: "https://via.placeholder.com/300?text=Book",
    rating: 0
  }
])
```

## 🔧 Database Configuration in Code

Update `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/online-purchase-system
```

## 📝 Useful MongoDB Commands

```javascript
// Check current database
db

// List all collections
show collections

// Count documents
db.products.countDocuments()

// Find all products
db.products.find()

// Find by category
db.products.find({ category: "Electronics" })

// Delete collection
db.products.deleteMany({})

// Exit
exit
```

## 🐛 Troubleshooting

### "MongoServerSelectionError"
- Ensure MongoDB is running
- Check MONGODB_URI is correct
- Verify firewall settings (if using cloud)

### "Connection refused"
- MongoDB service not running
- Try: `sudo systemctl start mongod` (Linux/Mac)
- Or restart MongoDB from Services (Windows)

### "Authentication failed"
- Check username and password
- Verify user has access to database
- Check whitelist IP (Atlas)

## 📚 More Resources

- MongoDB Docs: https://docs.mongodb.com/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- MongoDB Tutorials: https://docs.mongodb.com/manual/tutorial/
