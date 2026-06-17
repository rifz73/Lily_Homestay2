/* ============================================================
   LILY HOMESTAY — main.js
   Loads data.json and powers all interactive features
   ============================================================ */

'use strict';

// ===== LOAD DATA & BOOT =====
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    buildGallery(data.gallery);
    buildFeatures(data.package.highlights);
    buildPriceCard(data.package);
    buildBlog(data.blog_posts);
    buildContact(data.homestay);
    buildNearby(data.nearby, data.homestay);
    initAccessibility(data.accessibility_defaults);
    initSlideshow(data.gallery.length);
    initHamburger();
    initScrollSpy();
    initDateValidation();
    initPetalRain();
  })
  .catch(() => {
    // Fallback: just init UI without dynamic content
    initAccessibility({ theme: 'light', font_size: 'medium' });
    initSlideshow(6);
    initHamburger();
    initScrollSpy();
    initDateValidation();
    initPetalRain();
  });


// ===== PETAL RAIN =====
function initPetalRain() {
  const container = document.getElementById('petalContainer');
  if (!container) return;
  const emojis = ['🌸','🌺','🌼','🌷','✿','🌹'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const size = 20 + Math.random() * 30;
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.cssText = `
      left:${Math.random() * 100}%;
      font-size:${size}px;
      animation-duration:${10 + Math.random() * 16}s;
      animation-delay:${-Math.random() * 20}s;
      width:auto; height:auto;
      background:none; border-radius:0;
    `;
    container.appendChild(p);
  }
}


// ===== BUILD GALLERY =====
function buildGallery(slides) {
  const gallery = document.getElementById('heroGallery');
  if (!gallery) return;

  // Clear existing placeholder slides if any
  gallery.querySelectorAll('.slide').forEach(s => s.remove());

  // Insert before controls
  const controls = gallery.querySelector('.slide-controls');

  slides.forEach((slide, i) => {
    const div = document.createElement('div');
    div.className = 'slide' + (i === 0 ? ' active' : '');
    div.id = `slide-${i}`;
    div.innerHTML = `
      <img src="${slide.url}" alt="${slide.alt}" loading="${i === 0 ? 'eager' : 'lazy'}"/>
      <div class="slide-overlay">${slide.label}</div>
    `;
    gallery.insertBefore(div, controls);
  });
}


// ===== SLIDESHOW =====
let currentSlide = 0;
let totalSlides  = 6;
let slideTimer;

function initSlideshow(count) {
  totalSlides = count;
  buildDots();
  startAutoSlide();
}

function buildDots() {
  const dotsEl = document.getElementById('slideDots');
  if (!dotsEl) return;
  dotsEl.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Go to photo ${i + 1}`);
    d.setAttribute('role', 'tab');
    d.onclick = () => { clearInterval(slideTimer); goToSlide(i); startAutoSlide(); };
    dotsEl.appendChild(d);
  }
}

function goToSlide(n) {
  const prevEl = document.getElementById(`slide-${currentSlide}`);
  const prevDot = document.querySelectorAll('.dot')[currentSlide];
  if (prevEl)  prevEl.classList.remove('active');
  if (prevDot) prevDot.classList.remove('active');

  currentSlide = (n + totalSlides) % totalSlides;

  const nextEl  = document.getElementById(`slide-${currentSlide}`);
  const nextDot = document.querySelectorAll('.dot')[currentSlide];
  if (nextEl)  nextEl.classList.add('active');
  if (nextDot) nextDot.classList.add('active');
}

function changeSlide(dir) {
  clearInterval(slideTimer);
  goToSlide(currentSlide + dir);
  startAutoSlide();
}

function startAutoSlide() {
  slideTimer = setInterval(() => goToSlide(currentSlide + 1), 3800);
}


// ===== BUILD FEATURES (about section) =====
function buildFeatures(highlights) {
  const grid = document.getElementById('featuresGrid');
  if (!grid || !highlights) return;
  grid.innerHTML = highlights.map(h => `
    <div class="feature-item">
      <span class="feature-icon">${h.icon}</span>
      <div>
        <div class="feature-text">${h.label}</div>
        <div class="feature-sub">${h.sub}</div>
      </div>
    </div>
  `).join('');
}


// ===== BUILD PRICE CARD (single package) =====
function buildPriceCard(pkg) {
  const card = document.getElementById('priceCard');
  if (!card || !pkg) return;

  card.innerHTML = `
    <div class="price-badge-tag">✿ Our Package</div>
    <div class="price-top">
      <div class="price-icon">${pkg.icon}</div>
      <div>
        <div class="price-name">${pkg.name}</div>
        <div class="price-tagline">${pkg.tagline}</div>
      </div>
    </div>
    <p class="price-desc">${pkg.description}</p>
    <div class="price-amount">
      <span class="price-currency">${pkg.currency}</span>
      <span class="price-num">${pkg.price_per_night}</span>
      <span class="price-per">/night</span>
      <div class="price-max">
        <strong>Up to ${pkg.max_guests}</strong> guests
      </div>
    </div>
    <ul class="price-features">
      ${pkg.features.map(f => `<li>${f}</li>`).join('')}
    </ul>
    <button class="btn-book-main" onclick="openBooking()">
      Reserve via WhatsApp 🌸
    </button>
    <p class="price-note">Minimum ${pkg.min_nights} night stay. <strong>Contact us</strong> for longer-stay discounts or special arrangements.</p>
  `;
}


// ===== BUILD BLOG =====
function buildBlog(posts) {
  const grid = document.getElementById('blogGrid');
  if (!grid || !posts) return;
  grid.innerHTML = posts.map(p => `
    <article class="blog-card">
      <div class="blog-img">${p.icon}</div>
      <div class="blog-body">
        <p class="blog-tag">${p.tag}</p>
        <h3 class="blog-title">${p.title}</h3>
        <p class="blog-excerpt">${p.excerpt}</p>
        <div class="blog-meta">
          <div class="blog-avatar">${p.avatar}</div>
          <span>${p.author} · ${p.date}</span>
        </div>
      </div>
    </article>
  `).join('');
}


// ===== BUILD CONTACT INFO =====
function buildContact(info) {
  if (!info) return;

  const waEl = document.getElementById('contactWhatsapp');
  if (waEl) waEl.href = `https://wa.me/${info.whatsapp}`;

  const waText = document.getElementById('contactWhatsappText');
  if (waText) waText.textContent = `+${info.whatsapp.slice(0,2)} ${info.whatsapp.slice(2,4)}-${info.whatsapp.slice(4,7)} ${info.whatsapp.slice(7)}`;

  const emailLink = document.getElementById('contactEmailLink');
  if (emailLink) { emailLink.href = `mailto:${info.email}`; emailLink.textContent = info.email; }

  const fbLink = document.getElementById('contactFacebook');
  if (fbLink) fbLink.textContent = info.facebook;

  const igLink = document.getElementById('contactInstagram');
  if (igLink) igLink.textContent = info.instagram;

  const hours = document.getElementById('contactHours');
  if (hours) hours.textContent = info.response_hours;

  const addr = document.getElementById('contactAddress');
  if (addr) addr.textContent = info.location;

  // WhatsApp social button in footer
  const waSocial = document.getElementById('footerWhatsapp');
  if (waSocial) waSocial.href = `https://wa.me/${info.whatsapp}`;
}


// ===== BUILD NEARBY (map section) =====
function buildNearby(nearby, info) {
  const list = document.getElementById('nearbyList');
  if (!list || !nearby) return;

  // Address row first
  const addrHtml = `
    <li>
      <span class="map-icon">📍</span>
      <div>
        <strong style="display:block;color:var(--text-primary);font-weight:600;margin-bottom:2px;">Address</strong>
        <span id="contactAddress">${info ? info.location : ''}</span>
      </div>
    </li>
  `;

  list.innerHTML = addrHtml + nearby.map(n => `
    <li>
      <span class="map-icon">${n.icon}</span>
      <div>
        <strong style="display:block;color:var(--text-primary);font-weight:600;margin-bottom:2px;">${n.label}</strong>
        ${n.detail}
      </div>
    </li>
  `).join('');
}


// ===== ACCESSIBILITY PANEL =====
const DEFAULT_THEME     = 'light';
const DEFAULT_FONT_SIZE = 'medium';

function initAccessibility(defaults) {
  const savedTheme    = localStorage.getItem('lily_theme')     || defaults.theme     || DEFAULT_THEME;
  const savedFontSize = localStorage.getItem('lily_font_size') || defaults.font_size || DEFAULT_FONT_SIZE;
  applyTheme(savedTheme);
  applyFontSize(savedFontSize);
}

function toggleAccessMenu() {
  const menu = document.getElementById('accessMenu');
  const btn  = document.getElementById('accessToggle');
  const isOpen = menu.classList.toggle('open');
  btn.setAttribute('aria-expanded', String(isOpen));
}

function setTheme(t) {
  applyTheme(t);
  localStorage.setItem('lily_theme', t);
}

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  ['light','dark','contrast'].forEach(th => {
    const btn = document.getElementById(`btn-${th}`);
    if (!btn) return;
    btn.classList.toggle('active', th === t);
    btn.setAttribute('aria-pressed', String(th === t));
  });
}

function setFontSize(s) {
  applyFontSize(s);
  localStorage.setItem('lily_font_size', s);
}

function applyFontSize(s) {
  document.documentElement.setAttribute('data-font-size', s);
  ['small','medium','large'].forEach(sz => {
    const btn = document.getElementById(`btn-${sz}`);
    if (!btn) return;
    btn.classList.toggle('active', sz === s);
    btn.setAttribute('aria-pressed', String(sz === s));
  });
}

function resetAccessibility() {
  applyTheme(DEFAULT_THEME);
  applyFontSize(DEFAULT_FONT_SIZE);
  localStorage.removeItem('lily_theme');
  localStorage.removeItem('lily_font_size');
  showToast('♿ Accessibility settings reset to default.');
}

// Close panel when clicking outside
document.addEventListener('click', (e) => {
  const panel = document.getElementById('access-panel');
  if (panel && !panel.contains(e.target)) {
    const menu = document.getElementById('accessMenu');
    const btn  = document.getElementById('accessToggle');
    if (menu) menu.classList.remove('open');
    if (btn)  btn.setAttribute('aria-expanded', 'false');
  }
});


// ===== HAMBURGER =====
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      closeMobileNav();
    }
  });
}

function closeMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger || !mobileNav) return;
  mobileNav.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}


// ===== SCROLL SPY =====
function initScrollSpy() {
  const sections = ['home','about','price','map','blog','contact'];
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${e.target.id}`;
          link.classList.toggle('active', isActive);
        });
      }
    });
  }, { threshold: 0.35, rootMargin: '-68px 0px 0px 0px' });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}


// ===== DATE VALIDATION =====
function initDateValidation() {
  const checkin  = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');
  if (!checkin || !checkout) return;
  const today = new Date().toISOString().split('T')[0];
  checkin.min  = today;
  checkout.min = today;
  checkin.addEventListener('change', () => { checkout.min = checkin.value; });
}


// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}


// ===== BOOKING =====
function openBooking() {
  document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
}

function submitBooking() {
  const name     = document.getElementById('fname').value.trim();
  const phone    = document.getElementById('phone').value.trim();
  const email    = document.getElementById('email').value.trim();
  const checkin  = document.getElementById('checkin').value;
  const checkout = document.getElementById('checkout').value;
  const guests   = document.getElementById('guests').value;
  const message  = document.getElementById('message').value.trim();

  if (!name || !phone || !email || !checkin || !checkout) {
    showToast('⚠️ Please fill in all required fields.');
    return;
  }

  // Read whatsapp number from page or fall back
  const waLink   = document.getElementById('contactWhatsapp');
  const waNumber = waLink ? waLink.href.replace('https://wa.me/','') : '60145467558';

  const msg = encodeURIComponent(
    `Hello Lily Homestay! 🌸\n\nI'd like to enquire about a stay.\n\n` +
    `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n` +
    `Package: Lily Homestay Package\nGuests: ${guests}\n` +
    `Check-in: ${checkin}\nCheck-out: ${checkout}\n` +
    (message ? `\nNotes: ${message}` : '') +
    `\n\nThank you! 🌺`
  );
  window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
  showToast('🌸 Opening WhatsApp with your booking details!');
}


// ===== MAP LAZY LOAD =====
function loadMap() {
  const placeholder = document.getElementById('mapPlaceholder');
  if (!placeholder) return;
  const frame = placeholder.parentElement;
  // Coordinate-based query keeps the map correctly centered on the homestay
  // while remaining fully interactive — users can pan, zoom, and explore freely.
  const lat = 3.476787;
  const lng = 98.778528;
  frame.innerHTML = `
    <iframe
      src="https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed"
      width="100%" height="100%" style="border:none;display:block;"
      allowfullscreen="" loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      title="Interactive map showing Lily Homestay location in Medan, North Sumatra">
    </iframe>`;
}


// ===== GOOGLE MAPS OPEN =====
function openGoogleMaps() {
  window.open('https://www.google.com/maps?q=3.476787,98.778528', '_blank');
}