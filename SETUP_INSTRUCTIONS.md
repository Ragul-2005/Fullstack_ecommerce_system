# Setup Instructions for Online Purchase System

## 📋 Complete Setup Guide

### Prerequisites
- Node.js v14+ (Download from nodejs.org)
- MongoDB (Local or Atlas Cloud)
- Git (optional)
- VS Code

---

## Part 1: MongoDB Setup

### Option A: Local MongoDB (Recommended for testing)

#### Windows
1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the wizard
3. Choose "Install MongoDB as a Service"
4. Open Command Prompt and verify:
   ```bash
   mongosh
   ```

#### Mac
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
mongosh
```

#### Linux
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongod
mongosh
```

### Option B: MongoDB Atlas (Cloud - No Installation)
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (Select M0 free tier)
4. Add security: Create database user
5. Whitelist IP: 0.0.0.0/0 (for development)
6. Get connection string
7. Update your `.env` file with the connection string

---

## Part 2: Backend Setup

### Step 1: Install Backend Dependencies
```bash
cd online-purchase-system/backend
npm install
```

Expected output shows all packages installed.

### Step 2: Configure Environment

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/online-purchase-system
JWT_SECRET=your_secret_key_12345
NODE_ENV=development
```

If using MongoDB Atlas, replace MONGODB_URI:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/online-purchase-system?retryWrites=true&w=majority
```

### Step 3: Start Backend Server
```bash
npm start
```

Expected output:
```
Server running on port 5000
MongoDB connected
```

**Backend is now running at:** http://localhost:5000

### Step 4: Test Backend
Open new terminal:
```bash
curl http://localhost:5000/api/test
```

Expected response:
```json
{"message":"Server is running!"}
```

---

## Part 3: Frontend Setup

### Step 1: Open Frontend in Browser

**Option A: Direct File**
- Navigate to `online-purchase-system/frontend/index.html`
- Open with browser (Right-click → Open with → Browser)
- Or drag & drop into browser

**Option B: Local Server (Recommended)**
```bash
cd online-purchase-system/frontend
python -m http.server 8000
```

Then visit: http://localhost:8000

---

## Part 4: First Run

### Step 1: Register Account
1. Click "Register" tab
2. Fill all fields:
   - Name: John Doe
   - Email: test@example.com
   - Password: password123
   - Phone: 1234567890
   - Address: 123 Main St
   - City: New York
   - Zip Code: 10001
3. Click Register

### Step 2: Add Products (Admin Required)

First, make yourself admin in MongoDB:
```bash
mongosh
use online-purchase-system
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { isAdmin: true } }
)
```

Then in app:
1. Refresh the page
2. You should see "Admin Panel" in navigation
3. Go to Admin Panel → Manage Products
4. Add sample products:

**Product 1:**
```
Name: Laptop
Description: High-performance laptop
Price: 999.99
Category: Electronics
Stock: 5
Image: https://via.placeholder.com/300?text=Laptop
```

**Product 2:**
```
Name: Headphones
Description: Wireless headphones
Price: 199.99
Category: Electronics
Stock: 10
Image: https://via.placeholder.com/300?text=Headphones
```

### Step 3: Test Shopping Flow
1. Go to Products
2. Add items to cart
3. Go to Cart
4. Click "Proceed to Checkout"
5. Fill shipping address
6. Click "Place Order"
7. View order in "My Orders"

### Step 4: Test Admin Features
1. Admin Panel → Manage Orders
2. Update order status from "pending" → "confirmed" → "shipped" → "delivered"

---

## 🔑 Troubleshooting

### Issue: Cannot connect to MongoDB
**Solution:**
- Windows: Check MongoDB service is running (Services.msc)
- Mac/Linux: Run `sudo systemctl start mongod`
- If using Atlas: Check firewall allows 0.0.0.0/0

### Issue: CORS Error
**Solution:**
- Backend must be running
- Frontend port must be different from backend
- Ensure frontend loads from http://localhost:8000 or similar

### Issue: "Port 5000 already in use"
**Solution:**
- Change PORT in .env to 5001
- Or kill process: `lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9`

### Issue: "Cannot find module"
**Solution:**
```bash
cd backend
npm install
```

### Issue: Products show placeholder images
**Solution:**
- This is normal - use real image URLs
- Or keep placeholder images for testing

---

## 📊 Verify Installation

### Terminal 1: MongoDB
```bash
mongosh
show dbs
```
Should show: `online-purchase-system`

### Terminal 2: Backend
```bash
cd backend
npm start
```
Should show: `Server running on port 5000`

### Browser: Frontend
Visit: http://localhost:8000
Should see: Login page

---

## 🎯 Next Steps

1. ✅ Verify all three parts are running
2. ✅ Create test account
3. ✅ Make account admin (MongoDB)
4. ✅ Add sample products
5. ✅ Test complete shopping flow
6. ✅ Explore admin panel

---

## 📚 Useful Commands

### Stop Services
```bash
# Stop backend (Ctrl+C in terminal)
# Stop MongoDB
mongosh
```

### View Database
```bash
mongosh
use online-purchase-system
db.products.find()
db.users.find()
db.orders.find()
```

### Reset Database
```bash
mongosh
use online-purchase-system
db.dropDatabase()
```

### Reset Cart (Browser DevTools)
```javascript
localStorage.removeItem('cart')
```

---

## 🚀 Production Checklist

- [ ] Change JWT_SECRET to secure value
- [ ] Update MONGODB_URI to production database
- [ ] Set NODE_ENV=production
- [ ] Add HTTPS/SSL certificates
- [ ] Configure proper CORS origins
- [ ] Add rate limiting
- [ ] Implement email notifications
- [ ] Set up payment gateway integration
- [ ] Add logging system
- [ ] Create backup strategy

---

## 📞 Support

For issues:
1. Check MongoDB is running
2. Check backend is running (npm start)
3. Check browser console for errors
4. Verify env file is correctly set
5. Review MONGODB_SETUP.md for database help

---

## 🎉 Congratulations!

Your Online Purchase System is ready to use!

**Happy Coding! 🚀**
