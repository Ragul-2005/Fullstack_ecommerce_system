# Live Chat E-Commerce Platform

## 🎉 Welcome
This project is a modern full-stack e-commerce website built to showcase a real online shopping experience for customers and administrators.

It includes a polished storefront, user authentication, shopping cart flow, order processing, and an admin dashboard for product and order management.

---

## 🌐 What the Website Does
- Customers can browse products, search and filter, add items to the cart, checkout, and view past orders.
- Admin users can add, edit, and delete products, manage order status, and monitor customer orders.
- The application keeps product, order, user, and payment data in MongoDB.
- The frontend is built with HTML, CSS, and vanilla JavaScript.
- The backend uses Node.js with Express and exposes a REST API.

---

## 👀 Website Pages
- `frontend/index.html` — Public storefront and landing page.
- `frontend/home.html` — Main customer dashboard for browsing and shopping.
- `frontend/customer.html` — Customer account view, cart, and order history.
- `frontend/admin.html` — Admin panel for managing products and orders.
- `frontend/landing.html` — Marketing-style landing page for the store.

---

## 🚀 Full Workflow
### 1. Customer visits the storefront
- User opens the website and lands on the homepage.
- Products are displayed with images, names, prices, and quick action controls.

### 2. User registration and login
- New users register using email and password.
- Returning users log in and receive a JWT token for secure access.

### 3. Browse products
- Customers can explore the product catalog.
- Search and filter controls help find the right items quickly.

### 4. Add to cart
- Products are added to the shopping cart.
- Cart totals and item quantities update immediately.

### 5. Checkout process
- Customer completes checkout with shipping details and payment info.
- Order details are captured and stored in MongoDB.

### 6. Order confirmation and tracking
- After placing an order, users can view their orders in `My Orders`.
- Order status updates are visible to customers.

### 7. Admin operations
- Admins log in to the admin dashboard.
- Admins create, edit, and delete products.
- Admins update order status and manage order fulfillment.

---

## 🧠 Why This App Matters
This project demonstrates how to build a complete e-commerce workflow from end to end:
- Storefront browsing
- Secure login and authorization
- Cart and checkout management
- Order processing and admin control
- API-driven backend with MongoDB persistence

---

## 🧩 Architecture Overview
### Frontend
- Built with HTML, CSS, and JavaScript
- Uses browser storage and API calls to maintain session state
- Includes separate views for customers and admins

### Backend
- Node.js + Express
- Authentication with JWT
- REST API routes for users, products, orders, payments, and wishlist
- Middleware for auth protection and admin access control

### Database
- MongoDB stores:
  - users
  - products
  - orders
  - payments
  - wishlists

---

## ✅ Key Features
- Customer registration and secure login
- Product catalog browsing
- Cart management and quantity updates
- Order checkout and history
- Admin product management
- Admin order status updates
- Wishlist support
- API-based backend
- Local storage integration for cart/auth state

---

## ⚙️ Setup Instructions
### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- A browser to open HTML files

### Backend setup
1. Open a terminal in the project root.
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Create or update `backend/.env` with:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/online-purchase-system
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```
4. Start MongoDB if using a local server:
   ```bash
   mongod
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
6. API is available at `http://localhost:5000`

### Frontend setup
1. Open the frontend directly in a browser by launching `frontend/index.html`, or run a quick static server:
   ```bash
   cd frontend
   python -m http.server 8000
   ```
2. Visit `http://localhost:8000`

---

## 🔌 API Overview
### User routes
- `POST /api/users/register` — Register a new user
- `POST /api/users/login` — Authenticate and receive a token
- `GET /api/users/profile` — Get user profile (requires auth)
- `PUT /api/users/profile` — Update profile (requires auth)
- `GET /api/users` — Get all users (admin only)

### Product routes
- `GET /api/products` — List products
- `GET /api/products/:id` — Product details
- `GET /api/products/category/:category` — Filter by category
- `POST /api/products` — Create product (admin only)
- `PUT /api/products/:id` — Update product (admin only)
- `DELETE /api/products/:id` — Delete product (admin only)

### Order routes
- `POST /api/orders` — Create a new order
- `GET /api/orders/my-orders` — Get current user orders
- `GET /api/orders` — Get all orders (admin only)
- `GET /api/orders/:id` — Get order by ID
- `PUT /api/orders/:id/status` — Update order status (admin only)
- `PUT /api/orders/:id/cancel` — Cancel an order

---

## 🧪 Demo Accounts
Use these credentials to test the app quickly:

### Customer
- Email: `user@test.com`
- Password: `password123`

### Admin
- Email: `admin@test.com`
- Password: `admin123`

---

## 💡 Notes
- Admin access must be enabled in the database if needed.
- Use the admin panel to seed products or manage store inventory.
- If the frontend does not connect, verify backend is running and CORS is enabled.

---

## 📌 Project Structure
- `backend/` — API server, models, routes, auth middleware
- `frontend/` — UI pages, styles, and JavaScript logic
- `seed-products.js` — Seed product data script
- `MONGODB_SETUP.md` — MongoDB setup info
- `SETUP_INSTRUCTIONS.md` — Installation guide

---

## 🎯 Final Summary
This platform delivers a complete buyer and seller workflow with easy setup, clean UI pages, secure auth, and an admin dashboard. It is a ready-to-run proof of concept for a real e-commerce website.


## 👨‍💼 Admin Panel

1. Login as admin
2. Click **Admin Panel** in navigation
3. **Manage Products**: Add, edit, delete products
4. **Manage Orders**: View and update order statuses

## 📚 Learning Outcomes

This project demonstrates:
- Full-stack development
- Frontend-Backend integration
- REST API design
- Database modeling
- Authentication & Authorization
- CRUD operations
- Component-based UI

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and submit pull requests.

## 📞 Support

For issues or questions, please create an issue in the repository.

## 🎉 Conclusion

The Online Purchase System is a complete e-commerce solution demonstrating real-world application development practices. It's perfect for learning full-stack web development!
