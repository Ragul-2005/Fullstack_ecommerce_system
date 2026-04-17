# Online Purchase System - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: MongoDB
```bash
mongod
```
Or use MongoDB Atlas cloud service.

### Step 2: Backend
```bash
cd backend
npm install
npm start
```
Server runs on http://localhost:5000

### Step 3: Frontend
Open `frontend/index.html` in browser or use:
```bash
cd frontend
python -m http.server 8000
```
Visit http://localhost:8000

## 📝 Create Sample Admin Account

1. Register with email: `admin@test.com` and password: `admin123`
2. Update in MongoDB (mongosh):
```javascript
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { isAdmin: true } }
)
```

## ✨ Key Features

- ✅ Product Browsing
- ✅ Shopping Cart
- ✅ Order Management
- ✅ User Accounts
- ✅ Admin Panel
- ✅ Search & Filter

## 🎯 Test the App

1. **Register** new account
2. **Browse** products
3. **Add** to cart
4. **Checkout** with address
5. **View** orders in "My Orders"
6. **Admin**: Manage products & orders

---

See README.md for detailed documentation.
