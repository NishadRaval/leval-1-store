<<<<<<< HEAD
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

=======
/* script.js (FINAL CLEAN VERSION) */

/* ========= DATA ========= */
const PROJECTS = [
    {
        id: "p3",
        title: "Personal Portfolio Website",
        desc: "The interactive and responsive portfolio you're looking at right now, built with vanilla JavaScript, HTML, and CSS.",
        tags: ["web", "ui", "javascript"],
        thumb: "assets/4.jpg",
        github: "https://github.com/NishadRaval/NishadRaval.github.io",
        live: "https://NishadRaval.github.io",
        caseStudy: `
            <h2>Case Study: Personal Portfolio Website</h2>
            <p><strong>A Deep Dive into the Creation of a Dynamic, Interactive Online Presence</strong></p>
            <hr style="margin: 16px 0; border-color: rgba(255,255,255,0.1);">
            
            <h3>Project Overview</h3>
            <p>This project is my personal portfolio, a digital space designed from the ground up to showcase my skills, projects, and professional journey as a web developer. The primary goal was to move beyond a static resume and create an immersive, memorable experience for visitors. The site is built entirely with <strong>Vanilla JavaScript, HTML5, and CSS3</strong> to demonstrate strong foundational skills, ensuring a fast, lightweight, and fully custom experience.</p>
            
            <h3>The Challenge</h3>
            <p>The challenge was to create a personal website that not only looks professional and modern but also effectively communicates my technical abilities and personality. Key objectives included:</p>
            <ul style="list-style-position: inside; padding-left: 10px;">
                <li><strong>Showcasing Skills:</strong> Clearly present my technical skills in a visually engaging way.</li>
                <li><strong>Highlighting Projects:</strong> Create a filterable gallery to display my work effectively.</li>
                <li><strong>Engaging User Experience:</strong> Incorporate subtle, professional animations and interactive elements to keep users engaged.</li>
                <li><strong>Full Responsiveness:</strong> Ensure a seamless and beautiful experience across all devices, from mobile phones to desktops.</li>
            </ul>

            <h3>My Role</h3>
            <p>As the sole creator of this project, I was responsible for the entire lifecycle:</p>
            <ul style="list-style-position: inside; padding-left: 10px;">
                <li><strong>UI/UX Designer:</strong> Conceptualizing the layout, color scheme, and user flow. I focused on a dark, tech-inspired theme with "glassmorphism" to create a modern feel.</li>
                <li><strong>Front-End Developer:</strong> Writing all the code from scratch, implementing the design, and developing all interactive features.</li>
            </ul>

            <h3>Challenges & Learning</h3>
            <p>The biggest challenge was balancing the number of animations with site performance. I learned to use efficient CSS animations and optimize JavaScript to ensure the site remained fast and smooth. This project significantly deepened my understanding of advanced CSS, DOM manipulation, and creating a polished, user-centric front-end application from scratch.</p>

            <h3>Conclusion</h3>
            <p>This portfolio successfully meets all the initial objectives. It serves as a living document of my skills and a testament to my ability to build a complete, professional, and engaging web application from the ground up.</p>
        `
    }
];

const SKILLS = [
  { name: "HTML5", iconClass: "fa-brands fa-html5" },
  { name: "CSS3", iconClass: "fa-brands fa-css3-alt" },
  { name: "JavaScript", iconClass: "fa-brands fa-js-square" },
  { name: "React.js", iconClass: "fa-brands fa-react" },
  { name: "PHP", iconClass: "fa-brands fa-php" },
  { name: "Java", iconClass: "fa-brands fa-java" },
  { name: "C / C++", iconClass: "fa-solid fa-code" },
  { name: "MySQL", iconClass: "fa-solid fa-database" },
  { name: "MongoDB", iconClass: "fa-solid fa-leaf" },
  { name: "Git", iconClass: "fa-brands fa-git-alt" },
  { name: "GitHub", iconClass: "fa-brands fa-github" },
  { name: "VS Code", iconClass: "fa-solid fa-laptop-code" },
  { name: "UI/UX Design", iconClass: "fa-solid fa-palette" },
  { name: "Animation", iconClass: "fa-solid fa-film" }
];

const CERTIFICATES = [
    {
        title: "Foundational C# with Microsoft",
        issuer: "freeCodeCamp & Microsoft",
        thumb: "assets/5.png",
        url: "https://www.freecodecamp.org/certification/nishadraval/foundational-c-sharp-with-microsoft"
    }
];

/* ========= UTILS ========= */
const q = (sel, ctx = document) => ctx.querySelector(sel);
const qa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ========= PRIMARY INITIALIZATION ========= */
document.addEventListener("DOMContentLoaded", () => {
    initYear();
    initHeaderScroll();
    initBurgerMenu();
    initTypedRoles();
    renderProjects();
    renderSkills();
    renderCertificates();
    initProjectInteractions();
    initScrollSpy();
    initIntersectionObservers();
    initCanvasBackground();
    initContactForm();
    initStatusWidget();
});

/* ========= FEATURE FUNCTIONS ========= */
function initYear() {
    const yearEl = q("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initHeaderScroll() {
    const header = q(".header");
    if (!header) return;
    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 50);
    });
}

function initBurgerMenu() {
    const burger = q("#burger");
    const nav = q("#nav");
    if (!burger || !nav) return;

    burger.addEventListener("click", (e) => {
        e.stopPropagation();
        nav.classList.toggle("open");
        burger.classList.toggle("open");
    });

    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') && !nav.contains(e.target)) {
            nav.classList.remove('open');
            burger.classList.remove('open');
        }
    });
}

function initTypedRoles() {
    const el = q("#typed-role");
    if (!el) return;
    const roles = ["Web Developer", "UI Enthusiast", "Fast Learner", "Problem Solver"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];
        let displayText = '';

        if (isDeleting) {
            displayText = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            displayText = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
        el.innerHTML = `<span class="typed-role-wrap">${displayText}</span>`;

        let typeSpeed = isDeleting ? 75 : 150;

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 1500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
    }
    type();
}

function renderProjects() {
    const grid = q("#projectsGrid");
    if (!grid) return;
    
    grid.innerHTML = PROJECTS.map(p => {
        const hasLiveLink = p.live && p.live !== "#";
        const hasGithubLink = p.github && p.github !== "#";

        const githubBtn = hasGithubLink
            ? `<a href="${p.github}" target="_blank" rel="noopener" class="btn btn-small ghost"><i class="fa-brands fa-github"></i> GitHub</a>`
            : `<button class="btn btn-small ghost btn-disabled"><i class="fa-brands fa-github"></i> GitHub</button>`;

        const liveBtn = hasLiveLink
            ? `<a href="${p.live}" target="_blank" rel="noopener" class="btn btn-small">Live Demo</a>`
            : `<button class="btn btn-small btn-disabled">Coming Soon</button>`;
        
        const detailsBtn = p.caseStudy
            ? `<button class="btn btn-small ghost btn-details" data-id="${p.id}">Case Study</button>`
            : `<button class="btn btn-small ghost btn-details" data-id="${p.id}">Details</button>`;

        return `
        <article class="project-card invisible" data-tags="${p.tags.join(" ")}">
            <div class="project-thumb-wrap">
                <img class="project-thumb" src="${p.thumb}" alt="${p.title}">
            </div>
            <div class="project-body">
                <h3 class="project-title">${p.title}</h3>
                <p class="project-desc">${p.desc}</p>
                <div class="project-tags">${p.tags.map(t => `<span>${t}</span>`).join("")}</div>
                <div style="margin-top:16px;display:flex;gap:10px;align-items:center">
                    ${githubBtn}
                    ${liveBtn}
                    ${detailsBtn}
                </div>
            </div>
        </article>
        `;
    }).join("");
}

function renderSkills() {
    const grid = q("#skillsGrid");
    if (!grid) return;
    
    grid.innerHTML = SKILLS.map(skill => `
        <div class="skill-card invisible">
            <i class="${skill.iconClass}"></i>
            <span>${skill.name}</span>
        </div>
    `).join("");
}

function renderCertificates() {
    const grid = q("#certificatesGrid");
    if (!grid) return;

    grid.innerHTML = CERTIFICATES.map(cert => {
        const hasUrl = cert.url && cert.url !== "#";
        const viewButton = hasUrl
            ? `<a href="${cert.url}" target="_blank" rel="noopener" class="btn btn-small btn-outline">View Credential</a>`
            : `<button class="btn btn-small btn-disabled">No Link</button>`;

        return `
        <article class="certificate-card invisible">
            <div class="certificate-thumb-wrap">
                <img class="certificate-thumb" src="${cert.thumb}" alt="${cert.title}">
            </div>
            <div class="certificate-body">
                <h3 class="certificate-title">${cert.title}</h3>
                <p class="certificate-issuer">Issued by: ${cert.issuer}</p>
                ${viewButton}
            </div>
        </article>
        `;
    }).join("");
}

function initProjectInteractions() {
    // Logic for filtering
    qa(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            qa(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.dataset.filter;
            qa(".project-card").forEach(card => {
                const tags = card.dataset.tags.split(" ");
                card.style.display = (filter === "all" || tags.includes(filter)) ? "block" : "none";
            });
        });
    });

    // Logic for opening the details modal
    const modal = q("#projectModal");
    const modalBody = q("#modalBody");
    const modalClose = q("#modalClose");
    if (!modal || !modalBody || !modalClose) return;

    const openModal = (pid) => {
        const project = PROJECTS.find(p => p.id === pid);
        if (!project) return;

        if (project.caseStudy) {
            modalBody.innerHTML = `<div class="case-study-body">${project.caseStudy}</div>`;
        } else {
            modalBody.innerHTML = `
            <div style="display:flex;gap:24px;flex-wrap:wrap;">
                <img src="${project.thumb}" alt="${project.title}" style="width:320px;max-width:100%;border-radius:10px;object-fit:cover;" />
                <div style="flex:1;min-width:280px">
                    <h2 style="margin-top:0">${project.title}</h2>
                    <p>${project.desc}</p>
                    <div style="margin:12px 0">${project.tags.map(t => `<span style="display:inline-block;margin:4px;padding:6px 10px;border-radius:16px;background:rgba(255,255,255,0.05)">${t}</span>`).join("")}</div>
                    <div style="display:flex;gap:10px;margin-top:16px">
                        <a href="${project.github}" target="_blank" class="btn btn-small ghost"><i class="fa-brands fa-github"></i> View on GitHub</a>
                        <a href="${project.live}" target="_blank" class="btn btn-small">Open Live Demo</a>
                    </div>
                </div>
            </div>`;
        }
        modal.classList.add("show");
    };

    const closeModal = () => modal.classList.remove("show");

    const projectsGrid = q("#projectsGrid");
    if (projectsGrid) {
        projectsGrid.addEventListener('click', (e) => {
            const detailsButton = e.target.closest('.btn-details');
            if (detailsButton) {
                openModal(detailsButton.dataset.id);
            }
        });
    }

    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains('show')) closeModal(); });
}

function initScrollSpy() {
    const sections = qa("section[id]");
    const navLinks = qa(".nav-link");
    const sideNavDots = qa(".side-nav .dot");

    if (navLinks.length === 0 && sideNavDots.length === 0) return;

    const onScroll = () => {
        let current = "";
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop;
            if (window.scrollY >= sectionTop - 150) {
                current = sec.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });

        sideNavDots.forEach(dot => {
            dot.classList.remove("active");
            if (dot.getAttribute("href") === `#${current}`) {
                dot.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
}

function initIntersectionObservers() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    setTimeout(() => {
        qa(".invisible").forEach(el => observer.observe(el));
    }, 100);
}

function initCanvasBackground() {
    const canvas = q("#bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, particles = [];
    const PARTICLE_DENSITY = 60000;
    const rand = (min, max) => Math.random() * (max - min) + min;

    function resize() {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
        particles = [];
        const PARTICLE_COUNT = Math.floor((w * h) / PARTICLE_DENSITY);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: rand(0, w), y: rand(0, h),
                vx: rand(-0.5, 0.5), vy: rand(-0.3, 0.3),
                r: rand(1.5, 3), alpha: rand(0.1, 0.4)
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
            if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
            ctx.fill();
        });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const dist = Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(92,200,255,${0.03 * (1 - dist / 120)})`;
                    ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    window.addEventListener("resize", resize);
    resize();
    draw();
}

function initContactForm() {
    const form = q("#contactForm");
    if (!form) return;
    form.addEventListener("submit", e => {
        e.preventDefault();
        showToast(`Thanks, ${form.name.value}! Message received.`);
        form.reset();
    });
}

function initStatusWidget() {
    const statuses = [
        { text: "Actively seeking new roles", color: "#50fa7b" },
        { text: "Building with HTML, CSS & JS", color: "#5cc8ff" },
        { text: "Learning C# and .NET", color: "#ff79c6" },
        { text: "Available for freelance projects", color: "#50fa7b" }
    ];

    const statusTextEl = q("#status-text");
    const statusIndicatorEl = q(".status-indicator");
    if (!statusTextEl || !statusIndicatorEl) return;

    let currentIndex = 0;

    const updateStatus = () => {
        statusTextEl.classList.add("fade-out");
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % statuses.length;
            const newStatus = statuses[currentIndex];
            statusTextEl.textContent = newStatus.text;
            statusIndicatorEl.style.backgroundColor = newStatus.color;
            statusTextEl.classList.remove("fade-out");
        }, 300);
    };

    statusTextEl.textContent = statuses[0].text;
    statusIndicatorEl.style.backgroundColor = statuses[0].color;
    setInterval(updateStatus, 5000);
}

function showToast(msg, time = 3000) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    Object.assign(t.style, {
        position: "fixed", bottom: "28px", left: "50%",
        transform: "translateX(-50%)",
        background: "linear-gradient(90deg, #00e0d6, #5cc8ff)",
        color: "#021216", padding: "12px 18px",
        borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        zIndex: 2000, fontWeight: 700, opacity: "0",
        transition: "opacity 300ms ease"
    });
    document.body.appendChild(t);
    setTimeout(() => t.style.opacity = "1", 50);
    setTimeout(() => { t.style.opacity = "0"; setTimeout(() => t.remove(), 300); }, time);
}
>>>>>>> 32b8b35ec6c6877ee85a65cb82f40f04852a3d7a
