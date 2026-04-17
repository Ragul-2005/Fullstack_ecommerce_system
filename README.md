<div align="center">
  <h1>📘 Live Chat E-Commerce Platform</h1>
  <p>
    <a href="https://img.shields.io/badge/Status-Completed-brightgreen?style=for-the-badge"><img src="https://img.shields.io/badge/Status-Completed-brightgreen?style=for-the-badge" alt="Status"></a>
    <a href="https://img.shields.io/badge/Role-Customer%20%26%20Admin-blue?style=for-the-badge"><img src="https://img.shields.io/badge/Role-Customer%20%26%20Admin-blue?style=for-the-badge" alt="Role"></a>
    <a href="https://img.shields.io/badge/Backend-Node.js-brightgreen?style=for-the-badge"><img src="https://img.shields.io/badge/Backend-Node.js-brightgreen?style=for-the-badge" alt="Backend"></a>
    <a href="https://img.shields.io/badge/Database-MongoDB-lightgreen?style=for-the-badge"><img src="https://img.shields.io/badge/Database-MongoDB-lightgreen?style=for-the-badge" alt="Database"></a>
  </p>
</div>

## 📌 Overview
This repository contains a full-stack e-commerce web application built with a customer storefront and admin dashboard.

The platform includes:
- Customer shopping experience with product browsing, search, cart, and orders.
- Admin experience with product management and order status control.
- Backend API powered by Node.js and Express.
- MongoDB database for users, products, orders, payments, and wishlist data.

---

## ✅ Completed Work
### 🧪 Frontend Features
- Homepage product browsing
- Search and category filtering
- Shopping cart with quantity control
- Checkout flow with order creation
- Customer order history page
- Admin dashboard for products and orders

## 🧱 Modules and Responsibilities
This project is organized into frontend and backend modules so each responsibility stays clear.

### Frontend modules
- `frontend/js/app.js` — Manages product browsing, search, filters, and user interactions on the storefront.
- `frontend/js/cart.js` — Handles cart state, quantity updates, total price calculation, and checkout preparation.
- `frontend/js/admin.js` — Implements admin dashboard behavior for product and order management.

### Backend modules
- `backend/server.js` — Express server entrypoint, middleware setup, and route registration.
- `backend/middleware/auth.js` — Auth middleware for verifying JWT tokens and granting protected access.
- `backend/models/User.js` — User schema with registration, login, and profile fields.
- `backend/models/Product.js` — Product schema for storing catalog items and inventory data.
- `backend/models/Order.js` — Order schema for saving purchases, shipping details, and status.
- `backend/models/Payment.js` — Payment schema to track payment method and transaction state.
- `backend/models/Wishlist.js` — Wishlist schema for storing users’ saved items.
- `backend/routes/users.js` — User routes for registration, login, profile, and admin user listing.
- `backend/routes/products.js` — Product routes for catalog browsing and admin product CRUD.
- `backend/routes/orders.js` — Order routes for checkout, order history, and admin order control.
- `backend/routes/payments.js` — Payment routes for tracking and updating payment status.
- `backend/routes/wishlist.js` — Wishlist routes for adding, removing, and viewing saved items.
- `backend/routes/admin.js` — Admin-specific controls and aggregated management endpoints.

### Why modules matter
- Keeps frontend and backend responsibilities separated
- Makes maintenance easier by grouping related functionality
- Supports future expansion such as new payment gateways, product categories, or analytics

### 🧩 Backend Features
- User registration and JWT login
- Secure profile and order endpoints
- CRUD operations for products
- Order creation and management
- Admin-only access control
- Wishlist support and payment tracking

### 🛠️ Toolchain
- Node.js
- Express.js
- MongoDB
- HTML, CSS, JavaScript

---

## 🚀 Full Workflow
1. **Open the storefront**
   - The user lands on the homepage and sees available products.
2. **Register / Login**
   - Customers register or log in with email/password.
3. **Browse and search**
   - Products are filtered by category and searched by keyword.
4. **Add items to cart**
   - Selected products are added to cart with quantity updates.
5. **Checkout**
   - User submits shipping/payment details and places an order.
6. **Order tracking**
   - User views order history and payment status.
7. **Admin control**
   - Admin logs in, manages products, and updates order status.

---

## 📄 Website Pages
- `frontend/index.html` — Public landing/storefront page
- `frontend/home.html` — Customer shopping dashboard
- `frontend/customer.html` — Customer account/orders page
- `frontend/admin.html` — Admin product/order management panel
- `frontend/landing.html` — Marketing landing page

---

## ⚙️ Setup Instructions
### Prerequisites
- Node.js v14+
- MongoDB local or Atlas
- Browser for frontend

### Backend Setup
```bash
cd backend
npm install
```
Create `backend/.env` with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/online-purchase-system
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```
Start MongoDB (local):
```bash
mongod
```
Start backend:
```bash
npm start
```

### Frontend Setup
Open `frontend/index.html` directly in a browser, or run a local server:
```bash
cd frontend
python -m http.server 8000
```
Then open `http://localhost:8000`

---

## 🧱 API Summary
### User Routes
- `POST /api/users/register` — Register a new user
- `POST /api/users/login` — Login and receive token
- `GET /api/users/profile` — Get authenticated profile
- `PUT /api/users/profile` — Update profile
- `GET /api/users` — List users (admin only)

### Product Routes
- `GET /api/products` — List all products
- `GET /api/products/:id` — Get product details
- `GET /api/products/category/:category` — Filter by category
- `POST /api/products` — Create product (admin only)
- `PUT /api/products/:id` — Update product (admin only)
- `DELETE /api/products/:id` — Delete product (admin only)

### Order Routes
- `POST /api/orders` — Create order
- `GET /api/orders/my-orders` — Get user orders
- `GET /api/orders` — List all orders (admin only)
- `GET /api/orders/:id` — Get order by ID
- `PUT /api/orders/:id/status` — Update order status (admin only)
- `PUT /api/orders/:id/cancel` — Cancel order

---

## 🧪 Demo Accounts
### Customer
- Email: `user@test.com`
- Password: `password123`

### Admin
- Email: `admin@test.com`
- Password: `admin123`

---

## 📚 Resources
- `backend/server.js` — Express server and route setup
- `backend/models/` — Mongoose data models
- `backend/routes/` — API route definitions
- `frontend/js/` — Client-side logic for shop and admin
- `frontend/css/` — Styles for pages

---

## 🌟 Project Status
All core features are implemented and the platform is ready for full local testing.
- Customer shopping and checkout flow ✅
- Admin product and order management ✅
- Secure authentication and protected routes ✅
- MongoDB persistence ✅

---

<div align="center">
  <strong>Ready for review, testing, and further enhancement.</strong>
</div>

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and submit pull requests.

## 📞 Support

For issues or questions, please create an issue in the repository.

## 🎉 Conclusion

The Online Purchase System is a complete e-commerce solution demonstrating real-world application development practices. It's perfect for learning full-stack web development!
