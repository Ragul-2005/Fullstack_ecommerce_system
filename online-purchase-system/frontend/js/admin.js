// 🔑 Admin Module
// Provides administrative control to manage products, users, and orders efficiently.

// ==================== Admin Functions ====================

function showAdminTab(tab) {
    document.querySelectorAll('.admin-tab-content').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll('.admin-tab-btn').forEach(el => {
        el.classList.remove('active');
    });

    if (tab === 'products') {
        document.getElementById('adminProductsTab').classList.add('active');
        document.querySelector('.admin-tab-btn:nth-child(1)').classList.add('active');
    } else {
        document.getElementById('adminOrdersTab').classList.add('active');
        document.querySelector('.admin-tab-btn:nth-child(2)').classList.add('active');
    }
}

async function loadAdminStats() {
    try {
        const response = await fetch(`${API_BASE}/admin/stats`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const stats = await response.json();
        displayAdminStats(stats);
    } catch (error) {
        console.error('Error loading admin stats:', error);
    }
}

function displayAdminStats(stats) {
    document.getElementById('totalUsersStat').textContent = stats.totalUsers;
    document.getElementById('totalOrdersStat').textContent = stats.totalOrders;
    document.getElementById('totalRevenueStat').textContent = '$' + stats.totalRevenue.toFixed(2);
    document.getElementById('totalProductsStat').textContent = stats.totalProducts;
}

async function loadAdminProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const products = await response.json();
        displayAdminProducts(products);
    } catch (error) {
        console.error('Error loading admin products:', error);
    }
}

function displayAdminProducts(products) {
    const container = document.getElementById('adminProductsList');
    
    if (products.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No products</p></div>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="admin-product-item">
            <div class="admin-product-info">
                <div class="admin-product-name">${product.name}</div>
                <div class="admin-product-details">
                    Category: ${product.category} | Price: $${product.price.toFixed(2)} | Stock: ${product.stock}
                </div>
            </div>
            <div class="admin-product-actions">
                <button class="edit-btn" onclick="editProduct('${product._id}', '${product.name}', '${product.description}', ${product.price}, '${product.category}', ${product.stock}, '${product.image}')">Edit</button>
                <button class="delete-btn" onclick="deleteProduct('${product._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

async function addProduct() {
    const name = document.getElementById('adminProductName').value;
    const description = document.getElementById('adminProductDesc').value;
    const price = parseFloat(document.getElementById('adminProductPrice').value);
    const category = document.getElementById('adminProductCategory').value;
    const stock = parseInt(document.getElementById('adminProductStock').value);
    const image = document.getElementById('adminProductImage').value;
    const messageEl = document.getElementById('adminProductMessage');

    if (!name || !description || !price || !category || stock === '' || !image) {
        messageEl.textContent = 'Please fill all fields';
        messageEl.classList.add('error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                name,
                description,
                price,
                category,
                stock,
                image
            })
        });

        const data = await response.json();

        if (response.ok) {
            messageEl.textContent = 'Product added successfully!';
            messageEl.classList.remove('error');
            messageEl.classList.add('success');
            
            document.getElementById('adminProductName').value = '';
            document.getElementById('adminProductDesc').value = '';
            document.getElementById('adminProductPrice').value = '';
            document.getElementById('adminProductCategory').value = '';
            document.getElementById('adminProductStock').value = '';
            document.getElementById('adminProductImage').value = '';

            setTimeout(() => {
                loadAdminProducts();
            }, 1000);
        } else {
            messageEl.textContent = 'Error: ' + (data.message || 'Unknown error');
            messageEl.classList.add('error');
        }
    } catch (error) {
        messageEl.textContent = 'Error: ' + error.message;
        messageEl.classList.add('error');
    }
}

function editProduct(id, name, description, price, category, stock, image) {
    document.getElementById('adminProductName').value = name;
    document.getElementById('adminProductDesc').value = description;
    document.getElementById('adminProductPrice').value = price;
    document.getElementById('adminProductCategory').value = category;
    document.getElementById('adminProductStock').value = stock;
    document.getElementById('adminProductImage').value = image;
    
    // Change button to update
    const btn = document.querySelector('.add-product-form button');
    btn.textContent = 'Update Product';
    btn.onclick = () => updateProduct(id);
    
    // Scroll to form
    document.querySelector('.add-product-form').scrollIntoView({ behavior: 'smooth' });
}

async function updateProduct(id) {
    const name = document.getElementById('adminProductName').value;
    const description = document.getElementById('adminProductDesc').value;
    const price = parseFloat(document.getElementById('adminProductPrice').value);
    const category = document.getElementById('adminProductCategory').value;
    const stock = parseInt(document.getElementById('adminProductStock').value);
    const image = document.getElementById('adminProductImage').value;
    const messageEl = document.getElementById('adminProductMessage');

    try {
        const response = await fetch(`${API_BASE}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                name,
                description,
                price,
                category,
                stock,
                image
            })
        });

        if (response.ok) {
            messageEl.textContent = 'Product updated successfully!';
            messageEl.classList.remove('error');
            messageEl.classList.add('success');
            
            document.getElementById('adminProductName').value = '';
            document.getElementById('adminProductDesc').value = '';
            document.getElementById('adminProductPrice').value = '';
            document.getElementById('adminProductCategory').value = '';
            document.getElementById('adminProductStock').value = '';
            document.getElementById('adminProductImage').value = '';
            
            const btn = document.querySelector('.add-product-form button');
            btn.textContent = 'Add Product';
            btn.onclick = addProduct;

            setTimeout(() => {
                loadAdminProducts();
            }, 1000);
        } else {
            messageEl.textContent = 'Error updating product';
            messageEl.classList.add('error');
        }
    } catch (error) {
        messageEl.textContent = 'Error: ' + error.message;
        messageEl.classList.add('error');
    }
}

async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            const response = await fetch(`${API_BASE}/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            });

            if (response.ok) {
                alert('Product deleted successfully');
                loadAdminProducts();
            } else {
                alert('Error deleting product');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

async function loadAdminOrders() {
    try {
        const response = await fetch(`${API_BASE}/orders`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        const orders = await response.json();
        displayAdminOrders(orders);
    } catch (error) {
        console.error('Error loading admin orders:', error);
    }
}

function displayAdminOrders(orders) {
    const container = document.getElementById('adminOrdersList');

    if (orders.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No orders</p></div>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="admin-order-item">
            <div class="admin-order-header">
                <div>
                    <strong>${order.orderNumber}</strong> - 
                    <span style="color: #7f8c8d;">${order.user.name} (${order.user.email})</span>
                </div>
                <div style="flex: 1;"></div>
                <div class="admin-order-update">
                    <select id="status-${order._id}">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                    <button onclick="updateOrderStatus('${order._id}')">Update</button>
                </div>
            </div>
            <div style="margin: 1rem 0;">
                <strong>Items:</strong>
                ${order.items.map(item => `
                    <div style="margin-left: 1rem; color: #7f8c8d;">
                        ${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}
                    </div>
                `).join('')}
            </div>
            <div style="font-weight: bold; margin-top: 0.5rem;">
                Total: $${order.totalAmount.toFixed(2)}
            </div>
        </div>
    `).join('');
}

async function updateOrderStatus(orderId) {
    const status = document.getElementById(`status-${orderId}`).value;

    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            alert('Order status updated');
            loadAdminOrders();
        } else {
            alert('Error updating order status');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
