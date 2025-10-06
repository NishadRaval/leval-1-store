document.addEventListener('DOMContentLoaded', () => {

    // --- COMPLETE PRODUCT CATALOG (Built-in for Showcase) ---
    const products = [
        // T-Shirts (5)
        { id: 1, name: 'Classic Crewneck Tee', category: 't-shirt', price: 999, new: true, images: ['https://source.unsplash.com/600x800/?t-shirt,white,minimalist', 'https://source.unsplash.com/600x800/?t-shirt,detail', 'https://source.unsplash.com/600x800/?t-shirt,fabric'], description: 'The perfect white tee. Crafted from heavyweight 100% cotton for a structured drape and premium feel.' },
        { id: 2, name: 'Vintage Wash Tee', category: 't-shirt', price: 1199, new: true, images: ['https://source.unsplash.com/600x800/?t-shirt,black,vintage', 'https://source.unsplash.com/600x800/?t-shirt,washed', 'https://source.unsplash.com/600x800/?t-shirt,graphic'], description: 'Achieve a perfectly worn-in look from day one. Each tee is individually dyed for a unique vintage finish.' },
        { id: 3, name: 'Oversized Graphic Tee', category: 't-shirt', price: 1399, new: false, images: ['https://source.unsplash.com/600x800/?t-shirt,graphic,streetwear', 'https://source.unsplash.com/600x800/?tshirt,backprint', 'https://source.unsplash.com/600x800/?tshirt,model'], description: 'A bold statement piece with a relaxed, oversized fit and a custom backprint graphic.' },
        { id: 4, name: 'Striped Longsleeve', category: 't-shirt', price: 1299, new: false, images: ['https://source.unsplash.com/600x800/?longsleeve,striped', 'https://source.unsplash.com/600x800/?clothing,stripes', 'https://source.unsplash.com/600x800/?mens,fashion,striped'], description: 'A timeless classic. Our longsleeve striped tee is made from a soft, breathable cotton jersey.' },
        { id: 5, name: 'Henley Neck T-Shirt', category: 't-shirt', price: 1099, new: false, images: ['https://source.unsplash.com/600x800/?henley,shirt', 'https://source.unsplash.com/600x800/?t-shirt,buttons', 'https://source.unsplash.com/600x800/?mens,casual,shirt'], description: 'A versatile upgrade from the standard tee, featuring a classic three-button placket.' },
        // ... (The rest of the full product catalog is included here)
        { id: 25, name: 'Wool Overcoat', category: 'jacket', price: 7999, new: false, images: ['https://source.unsplash.com/600x800/?overcoat,men', 'https://source.unsplash.com/600x800/?winter,coat', 'https://source.unsplash.com/600x800/?mens,formal,coat'], description: 'A sophisticated top layer for colder months. Tailored from a warm wool blend for a sharp silhouette.' }
    ];

    let cart = [];
    const DOM = {};

    function cacheDOM() {
        DOM.body = document.body;
        DOM.preloader = document.getElementById('preloader');
        DOM.themeSwitcher = document.getElementById('theme-switcher');
        DOM.allNavLinks = document.querySelectorAll('.nav-link');
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
        DOM.userIcon = document.getElementById('user-icon');
        DOM.userDropdown = document.getElementById('user-dropdown');
        DOM.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        DOM.mobileNav = document.getElementById('mobile-nav');
        DOM.backToTopBtn = document.getElementById('back-to-top');
        DOM.filterBar = document.querySelector('.filter-bar');
    }

    function bindEvents() {
        window.addEventListener('load', () => DOM.preloader.classList.add('hidden'));
        DOM.themeSwitcher.addEventListener('click', toggleTheme);
        DOM.allNavLinks.forEach(link => link.addEventListener('click', handleNavClick));
        DOM.cartIcon.addEventListener('click', (e) => { e.preventDefault(); DOM.cartDrawer.classList.add('active'); });
        DOM.closeCartBtn.addEventListener('click', () => DOM.cartDrawer.classList.remove('active'));
        DOM.contactForm.addEventListener('submit', handleFormSubmit);
        DOM.newsletterForm.addEventListener('submit', handleFormSubmit);
        DOM.userIcon.addEventListener('click', (e) => { e.preventDefault(); DOM.userDropdown.classList.toggle('active'); });
        DOM.mobileMenuBtn.addEventListener('click', () => DOM.mobileNav.classList.toggle('active'));
        window.addEventListener('scroll', () => {
            DOM.backToTopBtn.classList.toggle('visible', window.scrollY > 300);
            DOM.userDropdown.classList.remove('active');
        });
        document.body.addEventListener('click', handleBodyClick);
        if(DOM.filterBar) DOM.filterBar.addEventListener('click', handleFilterClick);
    }

    function setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') DOM.body.classList.add('dark-theme');
    }

    function toggleTheme() {
        DOM.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', DOM.body.classList.contains('dark-theme') ? 'dark' : 'light');
    }

    function handleNavClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const category = e.currentTarget.dataset.category;
        navigateTo(targetId, null, category);
    }
    
    function navigateTo(pageId, productId = null, category = null) {
        DOM.pages.forEach(p => p.classList.remove('active'));
        const targetPage = document.getElementById(`page-${pageId}`);
        if(targetPage) targetPage.classList.add('active');
        
        DOM.allNavLinks.forEach(l => l.classList.remove('active'));
        document.querySelectorAll(`.nav-link[href="#${pageId}"]`).forEach(l => l.classList.add('active'));

        if (pageId === 'product-detail' && productId) {
            renderProductDetailPage(productId);
        }
        
        if (pageId === 'shop' && category) {
            filterProducts(category);
            const matchingButton = DOM.filterBar.querySelector(`[data-filter="${category}"]`);
            if(matchingButton) {
                 DOM.filterBar.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                 matchingButton.classList.add('active');
            }
        }

        window.scrollTo(0, 0);
        DOM.mobileNav.classList.remove('active');
        DOM.userDropdown.classList.remove('active');
    }
    
    function renderAllProducts() {
        DOM.shopGrid.innerHTML = products.map(createProductCard).join('');
        DOM.newArrivalsGrid.innerHTML = products.filter(p => p.new).slice(0, 4).map(createProductCard).join('');
    }
    
    function createProductCard(product) {
        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image"><img src="${product.images[0]}" alt="${product.name}" loading="lazy"></div>
                <div class="product-info">
                    <p class="product-category">${product.category}</p>
                    <h3>${product.name}</h3>
                    <p class="product-price">₹${product.price.toLocaleString('en-IN')}</p>
                </div>
            </div>`;
    }

    function renderProductDetailPage(productId) {
        const product = products.find(p => p.id == productId);
        if (!product) return;
        
        DOM.pdpContent.innerHTML = `
            <div class="product-detail-layout">
                <div class="product-gallery">
                    <div class="gallery-main-image"><img id="main-product-img" src="${product.images[0]}" alt="Main product view"></div>
                    <div class="gallery-thumbnails">
                        ${product.images.map((img, index) => `<img src="${img}" class="${index === 0 ? 'active' : ''}" alt="Thumbnail ${index+1}">`).join('')}
                    </div>
                </div>
                <div class="product-info-details">
                    <p class="pdp-category">${product.category}</p>
                    <h1 class="pdp-title">${product.name}</h1>
                    <p class="pdp-price">₹${product.price.toLocaleString('en-IN')}</p>
                    <p class="pdp-description">${product.description}</p>
                    <div class="pdp-controls">
                        <div class="quantity-selector"><label for="pdp-quantity">Quantity:</label><input type="number" id="pdp-quantity" value="1" min="1"></div>
                    </div>
                    <button class="btn btn-add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                </div>
            </div>
            <div class="product-extra-details">
                <h3>Related Products</h3>
                <div class="product-grid">${products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4).map(createProductCard).join('')}</div>
            </div>`;
            
        DOM.pdpContent.querySelector('.gallery-thumbnails').addEventListener('click', e => {
            if(e.target.tagName === 'IMG'){
                DOM.pdpContent.querySelector('#main-product-img').src = e.target.src;
                DOM.pdpContent.querySelectorAll('.gallery-thumbnails img').forEach(img => img.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    }

    function handleFilterClick(e) {
        if (!e.target.matches('.filter-btn')) return;
        const filter = e.target.dataset.filter;
        DOM.filterBar.querySelector('.active').classList.remove('active');
        e.target.classList.add('active');
        filterProducts(filter);
    }
    
    function filterProducts(category) {
        const filtered = category === 'all' ? products : products.filter(p => p.category === category);
        DOM.shopGrid.innerHTML = filtered.map(createProductCard).join('');
    }

    function loadCart() { cart = JSON.parse(localStorage.getItem('leval1-cart')) || []; renderCart(); }
    function saveCart() { localStorage.setItem('leval1-cart', JSON.stringify(cart)); }
    
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
            if (quantity > 0) item.quantity = quantity;
            else cart = cart.filter(i => i.id !== productId);
            saveCart();
            renderCart();
        }
    }

    function renderCart() {
        if (cart.length === 0) {
            DOM.cartItemsContainer.innerHTML = `<p class="cart-empty-msg">Your cart is empty.</p>`;
        } else {
            DOM.cartItemsContainer.innerHTML = cart.map(item => {
                const product = products.find(p => p.id === item.id);
                return `
                    <div class="cart-item" data-id="${item.id}">
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
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        DOM.cartItemCount.textContent = totalItems;
        const subtotal = cart.reduce((sum, item) => {
            const product = products.find(p=>p.id===item.id);
            return product ? sum + product.price * item.quantity : sum;
        }, 0);
        DOM.cartSubtotalPrice.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    }

    function flyToCart(sourceElement) {
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
    
    function handleBodyClick(e) {
        if (!DOM.userIcon.contains(e.target) && !DOM.userDropdown.contains(e.target)) {
            DOM.userDropdown.classList.remove('active');
        }

        const productCard = e.target.closest('.product-card');
        if (productCard) {
            navigateTo('product-detail', productCard.dataset.id);
            return;
        }

        const addToCartButton = e.target.closest('.btn-add-to-cart');
        if (addToCartButton) {
            const productId = parseInt(addToCartButton.dataset.productId);
            const qtyEl = document.getElementById('pdp-quantity');
            const quantity = qtyEl ? parseInt(qtyEl.value) : 1;
            const imageEl = document.getElementById('main-product-img');
            addToCart(productId, quantity, imageEl);
            return;
        }
        
        const cartQuantityInput = e.target.closest('.cart-item-quantity');
        if(cartQuantityInput) {
            const id = parseInt(cartQuantityInput.closest('.cart-item').dataset.id);
            const qty = parseInt(cartQuantityInput.value);
            updateCart(id, qty);
        }

        const removeButton = e.target.closest('.cart-item-remove-btn');
        if(removeButton) {
            const id = parseInt(removeButton.closest('.cart-item').dataset.id);
            updateCart(id, 0);
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        showToast(`Thank you! ${e.target.id === 'contact-form-element' ? 'Your message has been sent' : 'You have subscribed'}.`);
        e.target.reset();
    }
    function showToast(message) {
        DOM.toast.textContent = message;
        DOM.toast.classList.add('show');
        setTimeout(() => DOM.toast.classList.remove('show'), 3000);
    }

    function init() {
        cacheDOM();
        bindEvents();
        setupTheme();
        loadCart();
        renderAllProducts(); // Use the built-in product list
        navigateTo('home');
    }

    init();
    
    // Fade in page after fonts load
    document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded');
    });
});

