/* script.js (FINAL CLEAN VERSION) */

/* ========= DATA ========= */
const PROJECTS = [
  {
    id: "p1",
    title: "Amazon Clone - E-commerce UI",
    desc: "A front-end recreation of the Amazon user interface, focusing on product display, search functionality, and a responsive layout for a seamless shopping experience.",
    tags: ["web", "ui", "frontend"],
    thumb: "assets/2.png",
    github: "#",
    live: "#"
  },
  {
    id: "p2",
    title: "Netflix Homepage Clone",
    desc: "A pixel-perfect clone of the Netflix homepage, built with a focus on CSS, responsive design, and recreating the signature user interface and feel.",
    tags: ["web", "ui", "design"],
    thumb: "assets/3.png",
    github: "https://github.com/NishadRaval/netflix-clone",
    live: "https://clone-net-nishad.netlify.app/"
  },
  {
    id: "p3",
    title: "Personal Portfolio Website",
    desc: "The interactive and responsive portfolio you're looking at right now, built with vanilla JavaScript, HTML, and CSS. Features animations and dynamic content.",
    tags: ["web", "ui", "javascript"],
    thumb: "assets/4.jpg",
    github: "https://github.com/NishadRaval/NishadRaval.github.io",
    live: "https://NishadRaval.github.io"
  }
];

const CERTIFICATES = [
  {
    title: "Foundational C# with Microsoft",
    issuer: "freeCodeCamp & Microsoft",
    thumb: "assets/5.png", // Use a path to your certificate image
    url: "https://www.freecodecamp.org/certification/nishadraval/foundational-c-sharp-with-microsoft" // Add the verification link here
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
  renderCertificates();
  initProjectInteractions();
  initScrollSpy();
  initIntersectionObservers();
  initCanvasBackground();
  initContactForm();
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
            <button class="btn btn-small ghost btn-details" data-id="${p.id}">Details</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// ... after the renderProjects() function

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

// ...

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
  if (navLinks.length === 0) return;

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
  };
  window.addEventListener("scroll", onScroll);
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

function initCounters() {
  // This function is no longer needed as the counters were removed from the hero card.
  // We leave it empty or remove it. For safety, we can leave it empty.
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
