const API_BASE = 'http://localhost:5000/api';
let currentUser = null;
let allProducts = [];

// 🔔 Notification Module - Socket.IO connection for real-time updates
let socket = null;

function initSocket() {
    if (socket) return;

    if (typeof io === 'undefined') {
        console.error('Socket.IO client library not loaded');
        return;
    }

    socket = io('http://localhost:5000');

    socket.on('order-confirmed', (data) => {
        console.log('Order confirmed:', data);
        alert(`🎉 Order ${data.order.orderNumber} has been placed successfully!`);
        if (document.getElementById('ordersSection').classList.contains('active')) {
            loadUserOrders();
        }
    });

    socket.on('order-status-updated', (data) => {
        console.log('Order status updated:', data);
        alert(`📦 Order status updated to: ${data.newStatus.toUpperCase()}`);
        if (document.getElementById('ordersSection').classList.contains('active')) {
            loadUserOrders();
        }
    });

    // Listen for product updates from admin
    socket.on('product-updated', () => {
        console.log('Products updated by admin');
        loadProducts(); // Reload products automatically
        const successMsg = document.createElement('div');
        successMsg.style.cssText = 'position:fixed;top:20px;right:20px;background:#27ae60;color:white;padding:15px;border-radius:8px;z-index:10000;';
        successMsg.textContent = '✨ New products available!';
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
    });
}

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        currentUser = JSON.parse(user);
        initSocket();
        socket?.emit('join-customer-room', currentUser.id);
        showMain();
        loadProducts();
        updateCartCount();
    }
});

// ==================== Auth Functions ====================

function switchToLogin() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
    document.querySelector('.auth-tab-btn:nth-child(1)').classList.add('active');
    document.querySelector('.auth-tab-btn:nth-child(2)').classList.remove('active');
}

function switchToRegister() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
    document.querySelector('.auth-tab-btn:nth-child(1)').classList.remove('active');
    document.querySelector('.auth-tab-btn:nth-child(2)').classList.add('active');
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageEl = document.getElementById('loginMessage');

    if (!email || !password) {
        messageEl.textContent = 'Please fill all fields';
        messageEl.classList.add('error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            messageEl.textContent = data.message || 'Login failed';
            messageEl.classList.add('error');
            return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        currentUser = data.user;

        initSocket();
        socket?.emit('join-customer-room', data.user.id);

        messageEl.textContent = 'Login successful!';
        messageEl.classList.remove('error');
        messageEl.classList.add('success');

        setTimeout(() => {
            showMain();
            loadProducts();
        }, 1000);
    } catch (error) {
        messageEl.textContent = 'Error: ' + error.message;
        messageEl.classList.add('error');
    }
}

async function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const phone = document.getElementById('regPhone').value;
    const address = document.getElementById('regAddress').value;
    const city = document.getElementById('regCity').value;
    const zipCode = document.getElementById('regZipCode').value;
    const messageEl = document.getElementById('regMessage');

    if (!name || !email || !password || !phone || !address || !city || !zipCode) {
        messageEl.textContent = 'Please fill all fields';
        messageEl.classList.add('error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone, address, city, zipCode })
        });

        const data = await response.json();

        if (!response.ok) {
            messageEl.textContent = data.message || 'Registration failed';
            messageEl.classList.add('error');
            return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        currentUser = data.user;

        messageEl.textContent = 'Registration successful!';
        messageEl.classList.remove('error');
        messageEl.classList.add('success');

        setTimeout(() => {
            showMain();
            loadProducts();
        }, 1000);
    } catch (error) {
        messageEl.textContent = 'Error: ' + error.message;
        messageEl.classList.add('error');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    currentUser = null;
    document.getElementById('authContainer').style.display = 'flex';
    document.getElementById('mainContainer').style.display = 'none';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    switchToLogin();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const btn = document.querySelector('.dark-mode-btn');
    btn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Load dark mode preference
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        const btn = document.querySelector('.dark-mode-btn');
        if (btn) btn.textContent = '☀️';
    }
});

function showAuth() {
    document.getElementById('mainContainer').style.display = 'none';
    document.getElementById('authContainer').style.display = 'flex';
}

function showSection(sectionId) {
    if (!currentUser) {
        showAuth();
        return;
    }

    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('mainContainer').style.display = 'block';
    hideAllSections();
    const section = document.getElementById(sectionId);
    if (section) section.classList.add('active');

    if (sectionId === 'wishlistSection') {
        loadWishlist();
    }
    if (sectionId === 'cartSection') {
        displayCart();
    }
    if (sectionId === 'ordersSection') {
        loadOrders();
    }
    if (sectionId === 'profileSection') {
        loadProfile();
    }
}

// ==================== Section Navigation ====================

function showMain() {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('mainContainer').style.display = 'block';
    
    // Show admin link if user is admin
    if (currentUser && currentUser.isAdmin) {
        document.getElementById('adminLink').style.display = 'block';
    }
}

function showProducts() {
    hideAllSections();
    document.getElementById('productsSection').classList.add('active');
}

function showCart() {
    hideAllSections();
    document.getElementById('cartSection').classList.add('active');
    displayCart();
}

function showWishlist() {
    hideAllSections();
    document.getElementById('wishlistSection').classList.add('active');
    loadWishlist();
}

function showOrders() {
    hideAllSections();
    document.getElementById('ordersSection').classList.add('active');
    loadOrders();
}

function showProfile() {
    hideAllSections();
    document.getElementById('profileSection').classList.add('active');
    loadProfile();
}

function showAdmin() {
    if (!currentUser || !currentUser.isAdmin) {
        alert('Admin access required');
        return;
    }
    hideAllSections();
    document.getElementById('adminSection').classList.add('active');
    loadAdminStats();
    loadAdminProducts();
    loadAdminOrders();
}

function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Cart is empty');
        return;
    }
    hideAllSections();
    document.getElementById('checkoutSection').classList.add('active');
    displayCheckoutReview();
}

function hideAllSections() {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
}

// ==================== Products Functions ====================

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        allProducts = await response.json();
        populateShopFilter();
        displayProducts(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>No products found</p></div>';
        return;
    }

    grid.innerHTML = products.map(product => {
        const safeStock = Math.max(0, product.stock || 0);
        const isOutOfStock = safeStock === 0;
        return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div style="font-size: 0.85rem; color: #666; margin: 0.3rem 0; font-weight: 500;">🏪 ${product.sellerName || 'Store Owner'}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-stock ${isOutOfStock ? 'out-of-stock' : ''}">${isOutOfStock ? 'Out of stock' : `Stock: ${safeStock}`}</div>
                <div class="product-actions">
                    <input type="number" id="qty-${product._id}" value="${isOutOfStock ? 0 : 1}" min="1" max="${safeStock}" ${isOutOfStock ? 'disabled' : ''}>
                    <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})" ${isOutOfStock ? 'disabled' : ''}>
                        Add to Cart
                    </button>
                    <button onclick="addToWishlist('${product._id}')" class="wishlist-btn">
                        ❤️ Wishlist
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const shop = document.getElementById('shopFilter').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    
    let filtered = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );

    filtered = filtered.filter(product => product.price >= minPrice && product.price <= maxPrice);

    if (category) {
        filtered = filtered.filter(product => product.category === category);
    }
    if (shop) {
        filtered = filtered.filter(product => product.sellerName === shop);
    }

    displayProducts(filtered);
}

function filterByCategory() {
    const category = document.getElementById('categoryFilter').value;
    const shop = document.getElementById('shopFilter').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    let filtered = allProducts;

    filtered = filtered.filter(product => product.price >= minPrice && product.price <= maxPrice);

    if (category) {
        filtered = filtered.filter(product => product.category === category);
    }
    if (shop) {
        filtered = filtered.filter(product => product.sellerName === shop);
    }

    displayProducts(filtered);
}

function populateShopFilter() {
    const shopFilter = document.getElementById('shopFilter');
    const uniqueShops = [...new Set(allProducts.map(product => product.sellerName || 'Store Owner'))];
    
    shopFilter.innerHTML = '<option value="">All Shops</option>';
    uniqueShops.forEach(shop => {
        const option = document.createElement('option');
        option.value = shop;
        option.textContent = shop;
        shopFilter.appendChild(option);
    });
}

function filterByShop() {
    const shop = document.getElementById('shopFilter').value;
    const category = document.getElementById('categoryFilter').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    let filtered = allProducts;

    filtered = filtered.filter(product => product.price >= minPrice && product.price <= maxPrice);

    if (shop) {
        filtered = filtered.filter(product => product.sellerName === shop);
    }
    if (category) {
        filtered = filtered.filter(product => product.category === category);
    }

    displayProducts(filtered);
}

function filterByPrice() {
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    const category = document.getElementById('categoryFilter').value;
    const shop = document.getElementById('shopFilter').value;
    let filtered = allProducts;

    filtered = filtered.filter(product => product.price >= minPrice && product.price <= maxPrice);

    if (category) {
        filtered = filtered.filter(product => product.category === category);
    }
    if (shop) {
        filtered = filtered.filter(product => product.sellerName === shop);
    }

    displayProducts(filtered);
}

// ==================== Cart Functions ====================

function addToCart(productId, productName, price) {
    const quantity = parseInt(document.getElementById(`qty-${productId}`).value);
    const product = allProducts.find(p => p._id === productId);
    const safeStock = Math.max(0, product?.stock || 0);

    if (!product || safeStock === 0) {
        alert('This product is out of stock.');
        return;
    }

    if (!quantity || quantity < 1 || quantity > safeStock) {
        alert('Please choose a valid quantity.');
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const sellerName = product.sellerName || 'Store Owner';
    const existingItem = cart.find(item => item.product === productId);
    
    if (existingItem) {
        existingItem.quantity = Math.min(existingItem.quantity + quantity, safeStock);
    } else {
        cart.push({
            product: productId,
            name: productName,
            price: price,
            quantity: quantity,
            sellerName: sellerName
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Added to cart!');
}

async function addToWishlist(productId) {
    try {
        const response = await fetch(`${API_BASE}/wishlist/${productId}`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        alert('Error adding to wishlist');
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsEl = document.getElementById('cartItems');

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<div class="empty-state"><p>Your cart is empty</p></div>';
        document.getElementById('subtotal').textContent = '$0.00';
        document.getElementById('total').textContent = '$10.00';
        return;
    }

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 10;
    const total = subtotal + shipping;

    cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div style="font-size: 0.85rem; color: #666;">🏪 ${item.sellerName || 'Store Owner'}</div>
                <div>Quantity: ${item.quantity}</div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.product}')">Remove</button>
        </div>
    `).join('');

    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('total').textContent = '$' + total.toFixed(2);
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.product !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// ==================== Checkout Functions ====================

function displayCheckoutReview() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutItemsEl = document.getElementById('checkoutItems');
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 10;
    const total = subtotal + shipping;

    // Group items by seller
    const itemsByShop = {};
    cart.forEach(item => {
        const shopName = item.sellerName || 'Store Owner';
        if (!itemsByShop[shopName]) {
            itemsByShop[shopName] = [];
        }
        itemsByShop[shopName].push(item);
    });

    // Display items grouped by shop
    checkoutItemsEl.innerHTML = Object.entries(itemsByShop).map(([shopName, items]) => `
        <div style="margin-bottom: 1.5rem;">
            <div style="background: #f0f0f0; padding: 0.8rem; border-radius: 5px; margin-bottom: 0.8rem; font-weight: bold; color: #333;">
                🏪 Shop: ${shopName}
            </div>
            ${items.map(item => `
                <div class="order-item" style="padding-left: 1rem; margin-bottom: 0.5rem;">
                    ${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}
                </div>
            `).join('')}
        </div>
    `).join('');

    document.getElementById('checkoutTotal').textContent = '$' + total.toFixed(2);
}

async function placeOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Cart is empty');
        return;
    }

    const street = document.getElementById('checkoutStreet').value;
    const city = document.getElementById('checkoutCity').value;
    const zipCode = document.getElementById('checkoutZip').value;
    const country = document.getElementById('checkoutCountry').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    if (!street || !city || !zipCode || !country) {
        alert('Please fill all shipping details');
        return;
    }

    try {
        // Step 1: Create the order first
        const orderResponse = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                items: cart,
                shippingAddress: { street, city, zipCode, country },
                paymentMethod: paymentMethod
            })
        });

        const orderData = await orderResponse.json();

        if (!orderResponse.ok) {
            alert('Error creating order: ' + orderData.message);
            return;
        }

        const orderId = orderData.order._id;
        const totalAmount = orderData.order.totalAmount;

        // Step 2: Process payment
        const cardDetails = {};
        
        if (paymentMethod === 'credit-card' || paymentMethod === 'debit-card') {
            const cardNumber = document.getElementById('cardNumber').value.trim();
            const expiryDate = document.getElementById('expiryDate').value.trim();
            const cvv = document.getElementById('cvv').value.trim();

            if (!cardNumber || !expiryDate || !cvv) {
                alert('Please fill all card details');
                // Cancel the order if payment details incomplete
                await fetch(`${API_BASE}/orders/${orderId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                return;
            }

            cardDetails.cardNumber = cardNumber;
            cardDetails.expiryDate = expiryDate;
            cardDetails.cvv = cvv;
        }

        const paymentResponse = await fetch(`${API_BASE}/payments/process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                orderId,
                amount: totalAmount,
                paymentMethod,
                cardDetails: cardDetails
            })
        });

        const paymentData = await paymentResponse.json();

        if (!paymentResponse.ok) {
            alert('Payment failed: ' + paymentData.message);
            return;
        }

        // Success!
        alert('Order placed successfully!\n\nOrder Number: ' + orderData.order.orderNumber + '\nTransaction ID: ' + paymentData.payment.transactionId);
        
        // Clear checkout form
        document.getElementById('checkoutStreet').value = '';
        document.getElementById('checkoutCity').value = '';
        document.getElementById('checkoutZip').value = '';
        document.getElementById('checkoutCountry').value = '';
        document.getElementById('cardNumber').value = '';
        document.getElementById('expiryDate').value = '';
        document.getElementById('cvv').value = '';

        localStorage.removeItem('cart');
        updateCartCount();
        showProducts();
        loadProducts();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function updatePaymentForm() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const cardForm = document.getElementById('cardPaymentForm');
    const paypalForm = document.getElementById('paypalPaymentForm');

    if (paymentMethod === 'paypal') {
        cardForm.style.display = 'none';
        paypalForm.style.display = 'block';
    } else {
        cardForm.style.display = 'block';
        paypalForm.style.display = 'none';
    }
}

// ==================== Wishlist Functions ====================

async function loadWishlist() {
    try {
        const response = await fetch(`${API_BASE}/wishlist`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        const wishlist = await response.json();
        displayWishlist(wishlist);
    } catch (error) {
        console.error('Error loading wishlist:', error);
    }
}

function displayWishlist(wishlist) {
    const container = document.getElementById('wishlistContainer');

    if (wishlist.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Your wishlist is empty</p></div>';
        return;
    }

    container.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
            <img src="${item.product.image}" alt="${item.product.name}" class="wishlist-image">
            <div class="wishlist-info">
                <div class="wishlist-name">${item.product.name}</div>
                <div class="wishlist-price">$${item.product.price.toFixed(2)}</div>
                <div class="wishlist-stock">Stock: ${item.product.stock}</div>
            </div>
            <div class="wishlist-actions">
                <button onclick="moveToCart('${item.product._id}')">Move to Cart</button>
                <button onclick="removeFromWishlist('${item.product._id}')">Remove</button>
            </div>
        </div>
    `).join('');
}

async function moveToCart(productId) {
    try {
        const response = await fetch(`${API_BASE}/wishlist/${productId}/move-to-cart`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        alert('Moved to cart!');
        loadWishlist();
        updateCartCount();
    } catch (error) {
        alert('Error moving to cart');
    }
}

async function removeFromWishlist(productId) {
    try {
        await fetch(`${API_BASE}/wishlist/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        loadWishlist();
    } catch (error) {
        alert('Error removing from wishlist');
    }
}

// ==================== Orders Functions ====================

async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE}/orders/my-orders`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function displayOrders(orders) {
    const container = document.getElementById('ordersContainer');

    if (orders.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No orders yet</p></div>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-number">${order.orderNumber}</div>
                    <div style="color: #7f8c8d; font-size: 0.9rem;">Placed: ${new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <span class="order-status ${order.status}">${order.status.toUpperCase()}</span>
            </div>
            
            <!-- Order Tracking Progress -->
            <div class="order-tracking">
                ${getOrderProgress(order.status)}
            </div>
            
            ${order.sellers && order.sellers.length > 0 ? `
                <div class="sellers-section">
                    <h4>Order from:</h4>
                    ${order.sellers.map(seller => `
                        <div class="seller-info">
                            <strong>${seller.sellerName}</strong>
                            <div class="seller-items">
                                ${seller.items.map(item => `
                                    <div class="seller-item">
                                        ${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                `).join('')}
                            </div>
                            <div class="seller-amount">Amount: $${seller.amount.toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            ${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
                        </div>
                    `).join('')}
                </div>
            `}
            
            <div class="order-total">Total: $${order.totalAmount.toFixed(2)}</div>
            ${order.status !== 'delivered' && order.status !== 'cancelled' ? `
                <div class="order-actions">
                    <button class="cancel-order-btn" onclick="cancelOrder('${order._id}')">Cancel Order</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

async function cancelOrder(orderId) {
    if (confirm('Are you sure you want to cancel this order?')) {
        try {
            const response = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
                method: 'PUT',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            });

            if (response.ok) {
                alert('Order cancelled successfully');
                loadOrders();
            } else {
                alert('Error cancelling order');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

function getOrderProgress(status) {
    const steps = ['pending', 'confirmed', 'shipped', 'out-for-delivery', 'delivered'];
    const currentIndex = steps.indexOf(status);
    
    return `
        <div class="progress-container">
            ${steps.map((step, index) => `
                <div class="progress-step ${index <= currentIndex ? 'active' : ''}">
                    <div class="step-circle">${index + 1}</div>
                    <div class="step-label">${step.replace('-', ' ')}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// ==================== Profile Functions ====================

async function loadProfile() {
    try {
        const response = await fetch(`${API_BASE}/users/profile`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        const user = await response.json();
        document.getElementById('profileName').value = user.name;
        document.getElementById('profileEmail').value = user.email;
        document.getElementById('profilePhone').value = user.phone;
        document.getElementById('profileAddress').value = user.address;
        document.getElementById('profileCity').value = user.city;
        document.getElementById('profileZipCode').value = user.zipCode;
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function updateProfile() {
    const name = document.getElementById('profileName').value;
    const phone = document.getElementById('profilePhone').value;
    const address = document.getElementById('profileAddress').value;
    const city = document.getElementById('profileCity').value;
    const zipCode = document.getElementById('profileZipCode').value;
    const messageEl = document.getElementById('profileMessage');

    try {
        const response = await fetch(`${API_BASE}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ name, phone, address, city, zipCode })
        });

        const data = await response.json();

        if (response.ok) {
            messageEl.textContent = data.message;
            messageEl.classList.remove('error');
            messageEl.classList.add('success');
        } else {
            messageEl.textContent = data.message || 'Error updating profile';
            messageEl.classList.add('error');
        }
    } catch (error) {
        messageEl.textContent = 'Error: ' + error.message;
        messageEl.classList.add('error');
    }
}
