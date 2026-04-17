# Online Purchase System

## 📌 Overview

The Online Purchase System is a full-stack web-based e-commerce application designed to simulate real-world online shopping platforms. It enables users to browse products, manage their shopping cart, place orders, and track purchases efficiently.

The system also includes an admin interface for managing products, users, and orders, along with real-time updates using Socket.IO.

## 🎯 Objective

The main objective of this project is to develop a scalable and user-friendly e-commerce system that demonstrates:

- Frontend and backend integration
- Database management
- Secure user authentication
- Real-time communication

## 🧩 System Architecture

The application follows a client-server architecture:

### Frontend (Client):
Built using HTML, CSS, and JavaScript, providing an interactive user interface for customers.

### Backend (Server):
Developed using Node.js and Express.js to handle API requests, business logic, and authentication.

### Database:
MongoDB is used to store user data, product details, cart information, and orders.

### Real-Time Communication:
Socket.IO is integrated to provide instant notifications for order updates and system events.

## 🔄 Application Workflow

The system follows a structured e-commerce workflow:

1. Users access the home page and select their role (Customer/Admin).
2. Users register or log in using secure authentication.
3. Products are displayed with search and filtering options.
4. Users add items to their cart and manage quantities.
5. During checkout, users enter shipping and payment details.
6. Orders are placed and stored in the database.
7. Real-time notifications confirm order placement.
8. Users can track order status and manage their profile.
9. Admin users can manage products and monitor orders.

## 🗃️ Modules Description

### 👤 User Module
Handles user registration, login, profile management, and authentication using secure tokens.

### 🛍️ Product Module
Manages product listing, categorization, search functionality, and filtering options.

### 🛒 Cart Module
Allows users to add, remove, and update products in their cart with real-time price calculation.

### 📦 Order Module
Processes orders, stores order details, and enables order tracking with status updates.

### 🔑 Admin Module
Provides administrative control to manage products, users, and orders efficiently.

### 🔔 Notification Module
Implements real-time updates using Socket.IO for order confirmation and status changes.

## ⚙️ Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-Time**: Socket.IO
- **Development Tool**: Visual Studio Code

## ✨ Key Features

- User authentication and authorization
- Product browsing with search and filters
- Shopping cart management
- Order placement and tracking
- Admin dashboard for product management
- Real-time notifications using Socket.IO
- RESTful API architecture

## 🔐 Security Features

- Token-based authentication (JWT)
- Protected API routes
- Input validation and error handling

## 🚀 Future Enhancements

- Integration with real payment gateways (Razorpay/Stripe)
- AI-based product recommendation system
- Wishlist functionality
- Product reviews and ratings
- Mobile responsive design
- Advanced analytics dashboard

## 🧠 Conclusion

The Online Purchase System demonstrates a complete full-stack application with real-world features such as authentication, cart management, order processing, and real-time communication. It provides hands-on experience in building scalable web applications and understanding modern software development practices.

### Admin Features
- Product Management (Add, Edit, Delete)
- Order Management
- Status Updates
- Order History

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- VS Code

### Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure .env file**
   - Edit `backend/.env` and update:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/online-purchase-system
   JWT_SECRET=your_jwt_secret_key_change_this
   NODE_ENV=development
   ```

4. **Start MongoDB** (if local)
   ```bash
   mongod
   ```

5. **Start Backend Server**
   ```bash
   npm start
   ```
   Server will run on http://localhost:5000

### Frontend Setup

1. **Open `frontend/index.html` in a browser** or use a local server:
   ```bash
   cd frontend
   python -m http.server 8000
   ```
   Then visit http://localhost:8000

## 🔑 API Endpoints

### User Routes (`/api/users`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (Auth required)
- `PUT /profile` - Update user profile (Auth required)
- `GET /` - Get all users (Admin only)

### Product Routes (`/api/products`)
- `GET /` - Get all products
- `GET /:id` - Get product by ID
- `GET /category/:category` - Get products by category
- `POST /` - Create product (Admin only)
- `PUT /:id` - Update product (Admin only)
- `DELETE /:id` - Delete product (Admin only)
- `POST /:id/reviews` - Add review to product

### Order Routes (`/api/orders`)
- `POST /` - Create order (Auth required)
- `GET /my-orders` - Get user's orders (Auth required)
- `GET /` - Get all orders (Admin only)
- `GET /:id` - Get order by ID (Auth required)
- `PUT /:id/status` - Update order status (Admin only)
- `PUT /:id/payment` - Update payment status (Admin only)
- `PUT /:id/cancel` - Cancel order (Auth required)

## 👥 Test Credentials

### Regular User
- Email: user@test.com
- Password: password123

### Admin User
- Email: admin@test.com
- Password: admin123

## 📝 Default Products (Seed Data)

You can manually add products through the Admin Panel or via API calls.

### Sample Product
```json
{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "category": "Electronics",
  "stock": 10,
  "image": "https://via.placeholder.com/300"
}
```

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Admin-only protected routes
- Input validation
- CORS enabled

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify MongoDB is installed and configured

### CORS Error
- Backend already has CORS enabled
- Ensure frontend is running on different port

### JWT Error
- Check token is included in Authorization header
- Format: `Bearer <token>`

### Port Already in Use
- Change PORT in .env
- Or kill the process using the port

## 📦 Dependencies

### Backend
- express: Web framework
- mongoose: MongoDB ODM
- cors: Cross-Origin Resource Sharing
- dotenv: Environment variables
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication

### Frontend
- Vanilla JavaScript (No external dependencies)
- LocalStorage for cart/auth management

## 🎯 How to Use

1. **Register** as a new user
2. **Browse** products with search and filter
3. **Add items** to cart
4. **Checkout** with shipping details
5. **Track** your orders
6. **Manage profile** information

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
