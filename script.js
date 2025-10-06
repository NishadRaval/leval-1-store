// FINAL SCRIPT WITH USER AUTHENTICATION & EVENT DELEGATION

console.log("✅ script.js has started!");

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GLOBAL VARIABLES ---
    let products = [];
    let cart = [];
    const DOM = {};
    let userInfo = null;

    // --- 2. INITIALIZATION ---
    function init() {
        cacheDOM();
        bindEvents();
        setupTheme();
        loadCart();
        checkLoginStatus();
        fetchAllProducts();
        navigateTo('home');
    }

    // --- 3. CORE FUNCTIONS ---

    function cacheDOM() {
        DOM.body = document.body;
        DOM.preloader = document.getElementById('preloader');
        DOM.themeSwitcher = document.getElementById('theme-switcher');
        DOM.pages = document.querySelectorAll('.page');
        DOM.cartIcon = document.getElementById('cart-icon');
        DOM.cartDrawer = document.getElementById('cart-drawer');
        DOM.closeCartBtn = document.getElementById('close-cart-btn');
        DOM.cartItemCount = document.getElementById('cart-item-count');
        DOM.cartItemsContainer = document.getElementById('cart-items');
        DOM.cartSubtotalPrice = document.getElementById('cart-subtotal-price');
        DOM.shopGrid = document.getElementById('shop-grid');
        DOM.newArrivalsGrid = document.getElementById('new-arrivals-grid');
        DOM.pdpContent = document.getElementById('pdp-content');
        DOM.toast = document.getElementById('toast-notification');
        DOM.contactForm = document.getElementById('contact-form-element');
        DOM.newsletterForm = document.getElementById('newsletter-form');
        DOM.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        DOM.mobileNav = document.getElementById('mobile-nav');
        DOM.backToTopBtn = document.getElementById('back-to-top');
        DOM.filterBar = document.querySelector('.filter-bar');
        DOM.userIcon = document.getElementById('user-icon');
        DOM.userNameDisplay = document.getElementById('user-name-display');
        DOM.userDropdown = document.getElementById('user-dropdown');
        DOM.loginForm = document.getElementById('login-form');
        DOM.registerForm = document.getElementById('register-form');
    }

    function bindEvents() {
        if (window) window.addEventListener('load', () => DOM.preloader.classList.add('hidden'));
        if (DOM.themeSwitcher) DOM.themeSwitcher.addEventListener('click', toggleTheme);
        if (DOM.cartIcon) DOM.cartIcon.addEventListener('click', (e) => { e.preventDefault(); DOM.cartDrawer.classList.add('active'); });
        if (DOM.closeCartBtn) DOM.closeCartBtn.addEventListener('click', () => DOM.cartDrawer.classList.remove('active'));
        if (DOM.contactForm) DOM.contactForm.addEventListener('submit', handleFormSubmit);
        if (DOM.newsletterForm) DOM.newsletterForm.addEventListener('submit', handleFormSubmit);
        if (DOM.userIcon) DOM.userIcon.addEventListener('click', (e) => { e.preventDefault(); DOM.userDropdown.classList.toggle('active'); });
        if (DOM.mobileMenuBtn) DOM.mobileMenuBtn.addEventListener('click', () => DOM.mobileNav.classList.toggle('active'));
        if (window) window.addEventListener('scroll', () => {
            if (DOM.backToTopBtn) DOM.backToTopBtn.classList.toggle('visible', window.scrollY > 300);
            if (DOM.userDropdown) DOM.userDropdown.classList.remove('active');
        });
        if (document.body) document.body.addEventListener('click', handleBodyClick);
        if (DOM.filterBar) DOM.filterBar.addEventListener('click', handleFilterClick);
        if (DOM.loginForm) DOM.loginForm.addEventListener('submit', handleLoginSubmit);
        if (DOM.registerForm) DOM.registerForm.addEventListener('submit', handleRegisterSubmit);
    }

    // --- DATA FETCHING & RENDERING (Products) ---
    async function fetchAllProducts() {
        try {
            const response = await fetch('https://leval-1-store.onrender.com/api/products');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            products = await response.json();
            renderProductGrids();
        } catch (error) {
            console.error("❌ Failed to fetch products:", error);
            if (DOM.shopGrid) DOM.shopGrid.innerHTML = "<p class='error-msg'>Could not load products.</p>";
        }
    }

    function renderProductGrids() {
        if (DOM.shopGrid) DOM.shopGrid.innerHTML = products.map(createProductCard).join('');
        if (DOM.newArrivalsGrid) {
            const newArrivals = products.filter(p => p.new).slice(0, 4);
            DOM.newArrivalsGrid.innerHTML = newArrivals.map(createProductCard).join('');
        }
    }

    function createProductCard(product) {
        return `
            <div class="product-card" data-id="${product._id}">
                <div class="product-image"><img src="${product.images[0]}" alt="${product.name}" loading="lazy"></div>
                <div class="product-info">
                    <p class="product-category">${product.category}</p>
                    <h3>${product.name}</h3>
                    <p class="product-price">₹${product.price.toLocaleString('en-IN')}</p>
                </div>
            </div>`;
    }

    async function renderProductDetailPage(productId) {
        if (!DOM.pdpContent) return;
        DOM.pdpContent.innerHTML = `<p>Loading product...</p>`;
        try {
            const response = await fetch(`https://leval-1-store.onrender.com/api/products/${productId}`);
            if (!response.ok) throw new Error('Product not found');
            const product = await response.json();

            const relatedProducts = products
                .filter(p => p.category === product.category && p._id !== product._id)
                .slice(0, 4)
                .map(createProductCard)
                .join('');

            DOM.pdpContent.innerHTML = `
                <div class="product-detail-layout">
                    <div class="product-gallery">
                        <div class="gallery-main-image"><img id="main-product-img" src="${product.images[0]}" alt="${product.name}"></div>
                        <div class="gallery-thumbnails">
                            ${product.images.map((img, i) => `<img src="${img}" class="${i === 0 ? 'active' : ''}" alt="Thumbnail ${i + 1}">`).join('')}
                        </div>
                    </div>
                    <div class="product-info-details">
                        <p class="pdp-category">${product.category}</p>
                        <h1 class="pdp-title">${product.name}</h1>
                        <p class="pdp-price">₹${product.price.toLocaleString('en-IN')}</p>
                        <p class="pdp-description">${product.description}</p>
                        <div class="pdp-controls">
                            <div class="quantity-selector">
                                <label for="pdp-quantity">Quantity:</label>
                                <input type="number" id="pdp-quantity" value="1" min="1">
                            </div>
                        </div>
                        <button class="btn btn-add-to-cart" data-product-id="${product._id}">Add to Cart</button>
                    </div>
                </div>
                <div class="product-extra-details">
                    <h3>Related Products</h3>
                    <div class="product-grid">${relatedProducts}</div>
                </div>`;
            
            DOM.pdpContent.querySelector('.gallery-thumbnails').addEventListener('click', (e) => {
                if (e.target.tagName === 'IMG') {
                    DOM.pdpContent.querySelector('#main-product-img').src = e.target.src;
                    DOM.pdpContent.querySelectorAll('.gallery-thumbnails img').forEach(img => img.classList.remove('active'));
                    e.target.classList.add('active');
                }
            });
        } catch (error) {
            console.error("❌ Failed to render PDP:", error);
            DOM.pdpContent.innerHTML = "<p class='error-msg'>Could not load product details.</p>";
        }
    }

    // --- USER AUTHENTICATION LOGIC ---
    function checkLoginStatus() {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            userInfo = JSON.parse(storedUserInfo);
            updateUIAfterLogin();
        } else {
            updateUIAfterLogout();
        }
    }

    async function handleLoginSubmit(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('https://leval-1-store.onrender.com/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed');
            
            showToast('Login successful!');
            loginUser(data);
        } catch (error) {
            showToast(`Error: ${error.message}`);
        }
    }

    async function handleRegisterSubmit(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
             const response = await fetch('https://leval-1-store.onrender.com/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed');
            
            showToast('Registration successful! Please log in.');
            navigateTo('login');
        } catch (error) {
             showToast(`Error: ${error.message}`);
        }
    }

    function loginUser(data) {
        userInfo = data;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        updateUIAfterLogin();
        navigateTo('home');
    }

    function logoutUser() {
        userInfo = null;
        localStorage.removeItem('userInfo');
        updateUIAfterLogout();
        navigateTo('home');
        showToast('You have been logged out.');
    }

    function updateUIAfterLogin() {
        if (userInfo && DOM.userNameDisplay) {
            DOM.userNameDisplay.textContent = userInfo.name.split(' ')[0];
            DOM.userDropdown.innerHTML = `
                <a href="#account" class="nav-link">My Account</a>
                <a href="#orders" class="nav-link">Order History</a>
                <a href="#" id="logout-btn">Logout</a>
            `;
        }
    }

    function updateUIAfterLogout() {
        if (DOM.userNameDisplay) DOM.userNameDisplay.textContent = '';
        if (DOM.userDropdown) {
            DOM.userDropdown.innerHTML = `
                <a href="#login" class="nav-link">Login</a>
                <a href="#register" class="nav-link">Register</a>
            `;
        }
    }

    // --- EVENT HANDLERS & NAVIGATION ---
    
    function handleBodyClick(e) {
        const navLink = e.target.closest('.nav-link');
        if (navLink) {
            e.preventDefault();
            const targetId = navLink.getAttribute('href').substring(1);
            const category = navLink.dataset.category;
            navigateTo(targetId, null, category);
            return;
        }
        
        if (e.target.matches('#logout-btn')) {
            e.preventDefault();
            logoutUser();
            return;
        }

        if (DOM.userIcon && !DOM.userIcon.contains(e.target) && !DOM.userDropdown.contains(e.target)) {
            DOM.userDropdown.classList.remove('active');
        }

        const productCard = e.target.closest('.product-card');
        if (productCard) {
            navigateTo('product-detail', productCard.dataset.id);
            return;
        }

        const addToCartButton = e.target.closest('.btn-add-to-cart');
        if (addToCartButton) {
            const productId = addToCartButton.dataset.productId;
            const qtyEl = document.getElementById('pdp-quantity');
            const quantity = qtyEl ? parseInt(qtyEl.value, 10) : 1;
            const imageEl = document.getElementById('main-product-img');
            addToCart(productId, quantity, imageEl);
            return;
        }

        const cartQuantityInput = e.target.closest('.cart-item-quantity');
        if (cartQuantityInput) {
            const id = cartQuantityInput.closest('.cart-item').dataset.id;
            const qty = parseInt(cartQuantityInput.value, 10);
            updateCart(id, qty);
        }

        const removeButton = e.target.closest('.cart-item-remove-btn');
        if (removeButton) {
            const id = removeButton.closest('.cart-item').dataset.id;
            updateCart(id, 0);
        }
    }

    function navigateTo(pageId, productId = null, category = null) {
        if (DOM.pages) DOM.pages.forEach(p => p.classList.remove('active'));
        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) targetPage.classList.add('active');
        
        document.querySelectorAll('.nav-link.active').forEach(l => l.classList.remove('active'));
        document.querySelectorAll(`.nav-link[href="#${pageId}"]`).forEach(l => l.classList.add('active'));
        
        if (pageId === 'product-detail' && productId) {
            renderProductDetailPage(productId);
        }
        if (pageId === 'shop' && category) {
            filterProducts(category);
            if (DOM.filterBar) {
                const activeBtn = DOM.filterBar.querySelector('.active');
                if (activeBtn) activeBtn.classList.remove('active');
                const matchingButton = DOM.filterBar.querySelector(`[data-filter="${category}"]`);
                if (matchingButton) matchingButton.classList.add('active');
            }
        }
        window.scrollTo(0, 0);
        if (DOM.mobileNav) DOM.mobileNav.classList.remove('active');
        if (DOM.userDropdown) DOM.userDropdown.classList.remove('active');
    }

    // --- OTHER HELPERS ---
    function setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') DOM.body.classList.add('dark-theme');
    }

    function toggleTheme() {
        DOM.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', DOM.body.classList.contains('dark-theme') ? 'dark' : 'light');
    }

    function handleFilterClick(e) {
        if (e.target.matches('.filter-btn')) {
            const filter = e.target.dataset.filter;
            if (DOM.filterBar.querySelector('.active')) {
                DOM.filterBar.querySelector('.active').classList.remove('active');
            }
            e.target.classList.add('active');
            filterProducts(filter);
        }
    }

    function filterProducts(category) {
        const filtered = category === 'all' ? products : products.filter(p => p.category === category);
        if (DOM.shopGrid) DOM.shopGrid.innerHTML = filtered.map(createProductCard).join('');
    }

    function loadCart() {
        cart = JSON.parse(localStorage.getItem('leval1-cart')) || [];
        renderCart();
    }

    function saveCart() {
        localStorage.setItem('leval1-cart', JSON.stringify(cart));
    }

    function addToCart(productId, quantity, sourceElement) {
        flyToCart(sourceElement);
        setTimeout(() => {
            const existing = cart.find(item => item.id === productId);
            if (existing) {
                existing.quantity += quantity;
            } else {
                cart.push({ id: productId, quantity });
            }
            saveCart();
            renderCart();
            DOM.cartDrawer.classList.add('active');
        }, 600);
    }

    function updateCart(productId, quantity) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            if (quantity > 0) {
                item.quantity = quantity;
            } else {
                cart = cart.filter(i => i.id !== productId);
            }
            saveCart();
            renderCart();
        }
    }

    function renderCart() {
        if (!DOM.cartItemsContainer) return;
        if (cart.length === 0) {
            DOM.cartItemsContainer.innerHTML = `<p class="cart-empty-msg">Your cart is empty.</p>`;
        } else {
            DOM.cartItemsContainer.innerHTML = cart.map(item => {
                const product = products.find(p => p._id === item.id);
                if (!product) return '';
                return `
                    <div class="cart-item" data-id="${product._id}">
                        <img src="${product.images[0]}" alt="${product.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <div>
                                <p class="cart-item-title">${product.name}</p>
                                <p class="cart-item-price">₹${product.price.toLocaleString('en-IN')}</p>
                            </div>
                            <div class="cart-item-actions">
                                <input type="number" value="${item.quantity}" min="1" class="cart-item-quantity">
                                <button class="cart-item-remove-btn"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    </div>`;
            }).join('');
        }
        updateCartTotals();
    }

    function updateCartTotals() {
        if (!DOM.cartItemCount || !DOM.cartSubtotalPrice) return;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        DOM.cartItemCount.textContent = totalItems;
        const subtotal = cart.reduce((sum, item) => {
            const product = products.find(p => p._id === item.id);
            return product ? sum + (product.price * item.quantity) : sum;
        }, 0);
        DOM.cartSubtotalPrice.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    }

    function flyToCart(sourceElement) {
        if (!sourceElement) return;
        const startRect = sourceElement.getBoundingClientRect();
        const endRect = DOM.cartIcon.getBoundingClientRect();
        const flyImage = document.createElement('img');
        flyImage.src = sourceElement.src;
        flyImage.classList.add('fly-image');
        flyImage.style.left = `${startRect.left}px`;
        flyImage.style.top = `${startRect.top}px`;
        flyImage.style.width = `${startRect.width}px`;
        flyImage.style.height = `${startRect.height}px`;
        document.body.appendChild(flyImage);
        requestAnimationFrame(() => {
            flyImage.style.left = `${endRect.left + endRect.width / 2}px`;
            flyImage.style.top = `${endRect.top + endRect.height / 2}px`;
            flyImage.style.width = '20px';
            flyImage.style.height = 'auto';
            flyImage.style.transform = 'scale(0.2)';
            flyImage.style.opacity = '0';
        });
        flyImage.addEventListener('transitionend', () => flyImage.remove());
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        showToast(`Thank you! Your message has been sent.`);
        e.target.reset();
    }

    function showToast(message) {
        if(DOM.toast) {
            DOM.toast.textContent = message;
            DOM.toast.classList.add('show');
            setTimeout(() => DOM.toast.classList.remove('show'), 3000);
        }
    }

    // --- 4. START THE APP ---
    init();

});

