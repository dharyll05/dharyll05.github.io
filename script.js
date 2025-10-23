// script.js - Shared functionality for Nike E-Commerce site

// User Management
function registerUser(firstName, lastName, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return { success: false, message: 'Email already registered.' };
    }
    users.push({ firstName, lastName, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, message: 'Registration successful!' };
}

function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        return { success: true, message: 'Login successful!' };
    }
    return { success: false, message: 'Invalid email or password.' };
}

function logoutUser() {
    localStorage.removeItem('loggedInUser');
}

function getLoggedInUser() {
    return JSON.parse(localStorage.getItem('loggedInUser'));
}

// Cart Management
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.title === product.title);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (parseFloat(item.price.replace('Php', '').replace(',', '')) * item.quantity), 0);
}

// Display Cart
function displayCart() {
    const cart = getCart();
    const cartContainer = document.getElementById('cart-items');
    const orderSummary = document.getElementById('order-summary');
    if (!cartContainer || !orderSummary) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Your Cart is Empty</h5>
                    <p class="card-text">Looks like you haven't added any items to your cart yet. Start shopping to fill it up!</p>
                    <a href="Products.html" class="btn btn-warning">Continue Shopping</a>
                </div>
            </div>
        `;
        orderSummary.innerHTML = `
            <h5 class="card-title">Order Summary</h5>
            <p>Subtotal: Php0.00</p>
            <p>Shipping: Php0.00</p>
            <hr>
            <p class="fw-bold">Total: Php0.00</p>
            <button class="btn btn-warning w-100" disabled>Checkout</button>
        `;
        return;
    }

    let cartHTML = '';
    cart.forEach((item, index) => {
        cartHTML += `
            <div class="card mb-3">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${item.image}" class="img-fluid rounded-start" alt="${item.title}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                            <p class="card-text">${item.description}</p>
                            <p class="card-text"><small class="text-muted">${item.price}</small></p>
                            <p>Quantity: ${item.quantity}</p>
                            <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    cartContainer.innerHTML = cartHTML;

    const total = getCartTotal();
    orderSummary.innerHTML = `
        <h5 class="card-title">Order Summary</h5>
        <p>Subtotal: Php${total.toFixed(2)}</p>
        <p>Shipping: Php0.00</p>
        <hr>
        <p class="fw-bold">Total: Php${total.toFixed(2)}</p>
        <button class="btn btn-warning w-100" onclick="checkout()">Checkout</button>
    `;
}

function checkout() {
    alert('Checkout functionality not implemented yet. This is a demo.');
}

// Search Functionality
function searchProducts(query) {
    const products = document.querySelectorAll('.card');
    products.forEach(product => {
        const title = product.querySelector('.card-title').textContent.toLowerCase();
        if (title.includes(query.toLowerCase())) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Display cart if on Cart.html
    if (document.getElementById('cart-items')) {
        displayCart();
    }

    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const result = loginUser(email, password);
            alert(result.message);
            if (result.success) {
                window.location.href = 'index.html';
            }
        });
    }

    // Handle register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }
            const result = registerUser(firstName, lastName, email, password);
            alert(result.message);
            if (result.success) {
                window.location.href = 'Login.html';
            }
        });
    }

    // Handle search form
    const searchForm = document.querySelector('form[role="search"]');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = this.querySelector('input[type="search"]').value;
            if (window.location.pathname.includes('Products.html')) {
                searchProducts(query);
            } else {
                window.location.href = `Products.html?search=${encodeURIComponent(query)}`;
            }
        });
    }

    // Handle URL search query on Products.html
    if (window.location.pathname.includes('Products.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        if (searchQuery) {
            document.querySelector('input[type="search"]').value = searchQuery;
            searchProducts(searchQuery);
        }
    }

    // Handle contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            // Simulate sending message (in a real app, this would send to a server)
            alert(`Thank you, ${name}! Your message has been sent. We will respond to ${email} soon.`);
            contactForm.reset();
        });
    }
});
