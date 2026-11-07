'use strict';

/* =========================================================
   KickCulture — interaksi frontend
   Butuh: data.js (PRODUCTS, CATEGORY_LABEL, BADGE_LABEL,
          FREE_SHIPPING_MIN, SIZES) dimuat lebih dulu.
   ========================================================= */

/* ---------- Helper ---------- */
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];

const root = document.documentElement;
const body = document.body;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover)').matches;

const rupiahFmt = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const rupiah = (n) => rupiahFmt.format(n);

const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

/** Restart animasi CSS dengan memaksa reflow. */
const replayClass = (el, cls) => {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
};

/** localStorage bisa diblokir (mode privat dsb.), jadi selalu dibungkus try/catch. */
const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* abaikan */ }
  },
};

const state = {
  filter: 'all',
  showAll: false,
  cart: store.get('kc-cart', []).filter((it) => findProduct(it.id)),
  wishlist: store.get('kc-wishlist', []).filter((id) => findProduct(id)),
};

/* =========================================================
   Preloader
   ========================================================= */
let loaded = false;
const onLoaded = [];

function finishLoading() {
  if (loaded) return;
  loaded = true;
  body.classList.remove('is-loading');
  body.classList.add('is-loaded');
  onLoaded.forEach((fn) => fn());
}

window.addEventListener('load', () => setTimeout(finishLoading, prefersReduced ? 0 : 700));
setTimeout(finishLoading, 4000); // jaga-jaga kalau event load lambat

/* =========================================================
   Toast
   ========================================================= */
const toastWrap = $('[data-toasts]');

function toast(message, icon = 'ri-check-line', action = null) {
  const el = document.createElement('div');
  el.className = 'toast';

  const ic = document.createElement('i');
  ic.className = icon;
  const text = document.createElement('span');
  text.textContent = message;
  el.append(ic, text);

  let timer;
  const dismiss = () => {
    clearTimeout(timer);
    if (el.classList.contains('is-leaving')) return;
    el.classList.add('is-leaving');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  };

  if (action) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toast-action';
    btn.textContent = action.label;
    btn.addEventListener('click', () => { action.onClick(); dismiss(); });
    el.append(btn);
  }

  toastWrap.append(el);
  while (toastWrap.children.length > 3) toastWrap.firstElementChild.remove();
  timer = setTimeout(dismiss, 3400);
}

/* =========================================================
   Header: sembunyi saat scroll turun, muncul saat scroll naik
   ========================================================= */
const header = $('[data-header]');
const toTop = $('[data-to-top]');
let lastY = window.scrollY;
let scrollTicking = false;

function onScroll() {
  const y = window.scrollY;
  const max = root.scrollHeight - window.innerHeight;
  root.style.setProperty('--progress', max > 0 ? Math.min(y / max, 1).toFixed(4) : 0);

  header.classList.toggle('is-scrolled', y > 40);
  const goingDown = y > lastY + 2;
  const goingUp = y < lastY - 2;
  if (body.classList.contains('menu-open') || y < 300 || goingUp) header.classList.remove('is-hidden');
  else if (goingDown) header.classList.add('is-hidden');

  toTop.classList.toggle('is-visible', y > 700);
  lastY = y;
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(onScroll);
    scrollTicking = true;
  }
}, { passive: true });
onScroll();

toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' }));

/* ---------- Nav: indikator pill yang bergeser ---------- */
const navLinks = $$('[data-nav-link]');
const navIndicator = $('[data-nav-indicator]');
const navEl = $('.nav');
let activeNav = null;

function moveIndicator(link) {
  if (!link || !navEl.offsetParent) {
    navIndicator.style.opacity = 0;
    navLinks.forEach((l) => l.classList.remove('is-lit'));
    return;
  }
  navIndicator.style.width = `${link.offsetWidth}px`;
  navIndicator.style.transform = `translateX(${link.offsetLeft}px)`;
  navIndicator.style.opacity = 1;
  navLinks.forEach((l) => l.classList.toggle('is-lit', l === link));
}

navLinks.forEach((link) => link.addEventListener('mouseenter', () => moveIndicator(link)));
navEl.addEventListener('mouseleave', () => moveIndicator(activeNav));

// Tandai link aktif sesuai section yang sedang terlihat
const navSections = navLinks
  .map((l) => document.querySelector(l.getAttribute('href')))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = `#${entry.target.id}`;
    activeNav = navLinks.find((l) => l.getAttribute('href') === id) || null;
    if (!navEl.matches(':hover')) moveIndicator(activeNav);
    $$('[data-mm-link]').forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
navSections.forEach((s) => sectionObserver.observe(s));

/* =========================================================
   Mobile menu
   ========================================================= */
const menu = $('[data-mobile-menu]');
const burger = $('[data-menu-toggle]');

function setMenu(open) {
  if (open === menu.classList.contains('is-open')) return;
  const r = burger.getBoundingClientRect();
  menu.style.setProperty('--mx', `${r.left + r.width / 2}px`);
  menu.style.setProperty('--my', `${r.top + r.height / 2}px`);
  menu.classList.toggle('is-open', open);
  menu.setAttribute('aria-hidden', String(!open));
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  body.classList.toggle('menu-open', open);
  if (open) header.classList.remove('is-hidden');
  updateLock();
}

burger.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
$$('[data-mm-link]').forEach((a) => a.addEventListener('click', () => setMenu(false)));
window.addEventListener('resize', () => {
  if (window.innerWidth >= 992) setMenu(false);
  moveIndicator(activeNav);
  updateDropUI();
});

/* =========================================================
   Overlay bersama: backdrop, kunci scroll, tombol Escape
   ========================================================= */
const backdrop = $('[data-backdrop]');
const drawer = $('[data-drawer]');
const modal = $('[data-modal]');
const searchPanel = $('[data-search-panel]');

function updateLock() {
  const locked = menu.classList.contains('is-open')
    || drawer.classList.contains('is-open')
    || modal.classList.contains('is-open');
  body.classList.toggle('is-locked', locked);
  backdrop.classList.toggle('is-visible',
    drawer.classList.contains('is-open') || searchPanel.classList.contains('is-open'));
}

backdrop.addEventListener('click', () => { closeSearch(); closeDrawer(); });

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal.classList.contains('is-open')) closeModal();
    else if (drawer.classList.contains('is-open')) closeDrawer();
    else if (searchPanel.classList.contains('is-open')) closeSearch();
    else setMenu(false);
  }
  // "/" untuk membuka pencarian dengan cepat
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
  if (e.key === '/' && !typing) {
    e.preventDefault();
    openSearch();
  }
});

/* =========================================================
   Reveal saat scroll
   ========================================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

function observeReveal(scope = document) {
  $$('[data-reveal]:not(.is-visible), [data-observe]:not(.is-visible)', scope)
    .forEach((el) => revealObserver.observe(el));
}

/* =========================================================
   Kartu produk
   ========================================================= */
function badgeHTML(p) {
  if (p.oldPrice) {
    const off = Math.round((1 - p.price / p.oldPrice) * 100);
    return `<span class="product-badge product-badge--sale">-${off}%</span>`;
  }
  if (p.badge) return `<span class="product-badge product-badge--${p.badge}">${BADGE_LABEL[p.badge]}</span>`;
  return '';
}

function priceHTML(p) {
  return `${rupiah(p.price)}${p.oldPrice ? ` <del>${rupiah(p.oldPrice)}</del>` : ''}`;
}

function wishIcon(on) {
  return on ? 'ri-heart-3-fill' : 'ri-heart-3-line';
}

function productCard(p, index = 0) {
  const wished = state.wishlist.includes(p.id);
  const isDrop = p.group === 'drop';
  const delay = isDrop ? 0 : (index % 4) * 0.08;

  const stock = isDrop ? `
    <div class="stock">
      <div class="stock-bar"><span style="--w:${Math.round((p.stock / p.totalStock) * 100)}%"></span></div>
      <p>Sisa <strong>${p.stock} pasang</strong> dari ${p.totalStock}</p>
    </div>` : '';

  return `
  <article class="product-card${isDrop ? ' drop-card' : ''}" data-id="${p.id}" data-reveal style="--d:${delay}s">
    <div class="product-media">
      ${badgeHTML(p)}
      <button class="wish-btn${wished ? ' is-active' : ''}" type="button" data-wish="${p.id}"
        aria-pressed="${wished}" aria-label="Simpan ${p.name} ke wishlist"><i class="${wishIcon(wished)}"></i></button>
      <button class="media-link" type="button" data-qv="${p.id}" aria-label="Lihat detail ${p.name}">
        <img src="${p.image}" alt="${p.name}" loading="lazy" width="700" height="700" draggable="false">
        <span class="quick-chip"><i class="ri-eye-line"></i> Lihat cepat</span>
      </button>
      <button class="add-bar" type="button" data-add="${p.id}" aria-label="Tambah ${p.name} ke keranjang">
        <i class="ri-shopping-bag-3-line"></i><span>Tambah ke Keranjang</span>
      </button>
    </div>
    <div class="product-body">
      <div class="product-meta">
        <span>${CATEGORY_LABEL[p.category]}</span>
        <span class="product-rating"><i class="ri-star-fill"></i>${p.rating.toFixed(1).replace('.', ',')} <small>(${p.reviews})</small></span>
      </div>
      <h3 class="product-name"><button type="button" data-qv="${p.id}">${p.name}</button></h3>
      <p class="product-price">${priceHTML(p)}</p>
      <div class="product-colors" aria-label="${p.colors.length} pilihan warna">
        ${p.colors.map((c) => `<span style="--c:${c}"></span>`).join('')}
      </div>
      ${stock}
    </div>
  </article>`;
}

/* =========================================================
   Grid Best Seller + filter
   ========================================================= */
const grid = $('[data-product-grid]');
const loadMoreWrap = $('[data-load-more-wrap]');
const loadMoreBtn = $('[data-load-more]');
const filterWrap = $('[data-filter]');
const filterPill = $('[data-filter-pill]');
const filterBtns = $$('[data-filter-btn]');
const INITIAL_COUNT = 8;

function getFiltered() {
  const base = PRODUCTS.filter((p) => p.group === 'best');
  if (state.filter === 'all') return base;
  if (state.filter === 'sale') return base.filter((p) => p.oldPrice);
  return base.filter((p) => p.category === state.filter);
}

function renderGrid(animate = false) {
  const list = getFiltered();
  const limited = state.filter === 'all' && !state.showAll;
  const visible = limited ? list.slice(0, INITIAL_COUNT) : list;

  const paint = () => {
    grid.innerHTML = visible.length
      ? visible.map((p, i) => productCard(p, i)).join('')
      : '<p class="grid-empty">Belum ada produk di kategori ini.</p>';
    loadMoreWrap.hidden = !(limited && list.length > INITIAL_COUNT);
    observeReveal(grid);
  };

  if (animate && grid.children.length && !prefersReduced) {
    grid.classList.add('is-switching');
    setTimeout(() => {
      paint();
      grid.classList.remove('is-switching');
    }, 260);
  } else {
    paint();
  }
}

function movePill(btn) {
  filterPill.style.width = `${btn.offsetWidth}px`;
  filterPill.style.transform = `translateX(${btn.offsetLeft}px)`;
}

function setFilter(value) {
  const btn = filterBtns.find((b) => b.dataset.filterBtn === value);
  if (!btn) return;
  filterBtns.forEach((b) => {
    const on = b === btn;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-selected', String(on));
  });
  movePill(btn);
  filterWrap.scrollTo({
    left: btn.offsetLeft - filterWrap.clientWidth / 2 + btn.offsetWidth / 2,
    behavior: prefersReduced ? 'auto' : 'smooth',
  });
  if (state.filter !== value) {
    state.filter = value;
    state.showAll = false;
    renderGrid(true);
  }
}

filterBtns.forEach((btn) => btn.addEventListener('click', () => setFilter(btn.dataset.filterBtn)));

loadMoreBtn.addEventListener('click', () => {
  state.showAll = true;
  const rest = getFiltered().slice(INITIAL_COUNT);
  grid.insertAdjacentHTML('beforeend', rest.map((p, i) => productCard(p, i)).join(''));
  loadMoreWrap.hidden = true;
  observeReveal(grid);
});

/* =========================================================
   Wishlist
   ========================================================= */
function syncWishButtons(id) {
  const on = state.wishlist.includes(id);
  $$(`[data-wish="${id}"]`).forEach((btn) => {
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-pressed', String(on));
    const icon = btn.querySelector('i');
    if (icon) icon.className = wishIcon(on);
    if (on && !prefersReduced) replayClass(btn, 'pop');
  });
}

function toggleWish(id) {
  const p = findProduct(id);
  if (!p) return;
  const idx = state.wishlist.indexOf(id);
  const adding = idx === -1;
  if (adding) state.wishlist.push(id);
  else state.wishlist.splice(idx, 1);
  store.set('kc-wishlist', state.wishlist);

  syncWishButtons(id);
  updateBadges('wishlist');
  renderWishlist();
  toast(
    adding ? `${p.name} disimpan ke wishlist` : `${p.name} dihapus dari wishlist`,
    adding ? 'ri-heart-3-fill' : 'ri-heart-3-line',
    adding ? { label: 'Lihat', onClick: () => openDrawer('wishlist') } : null,
  );
}

function renderWishlist() {
  const list = $('[data-wishlist-list]');
  if (!state.wishlist.length) {
    list.innerHTML = `
      <li class="cart-empty">
        <i class="ri-heart-3-line"></i>
        <strong>Wishlist masih kosong</strong>
        <p>Tekan ikon hati di produk untuk menyimpannya di sini.</p>
      </li>`;
    return;
  }
  list.innerHTML = state.wishlist.map((id, i) => {
    const p = findProduct(id);
    return `
      <li class="cart-item" style="--i:${i}">
        <img src="${p.image}" alt="" width="76" height="76">
        <div>
          <h4>${p.name}</h4>
          <small>${CATEGORY_LABEL[p.category]}</small>
          <p class="price">${rupiah(p.price)}</p>
        </div>
        <div class="cart-side">
          <button class="remove-btn" type="button" data-wl-remove="${p.id}" aria-label="Hapus ${p.name} dari wishlist"><i class="ri-close-line"></i></button>
          <button class="mini-btn" type="button" data-wl-add="${p.id}" aria-label="Tambah ${p.name} ke keranjang"><i class="ri-shopping-bag-3-line"></i></button>
        </div>
      </li>`;
  }).join('');
}

/* =========================================================
   Keranjang
   ========================================================= */
const cartList = $('[data-cart-list]');
const checkoutBtn = $('[data-checkout]');

const saveCart = () => store.set('kc-cart', state.cart);
const cartTotal = () => state.cart.reduce((sum, it) => sum + findProduct(it.id).price * it.qty, 0);
const cartQty = () => state.cart.reduce((sum, it) => sum + it.qty, 0);

function updateBadges(bumpWhich = null) {
  const counts = { cart: cartQty(), wishlist: state.wishlist.length };
  [['cart', '[data-cart-count]'], ['wishlist', '[data-wishlist-count]']].forEach(([key, sel]) => {
    $$(sel).forEach((el) => {
      el.textContent = counts[key];
      if (el.classList.contains('badge')) {
        el.classList.toggle('has-items', counts[key] > 0);
        if (bumpWhich === key && counts[key] > 0) replayClass(el, 'bump');
      }
    });
  });
}

function renderCart() {
  if (!state.cart.length) {
    cartList.innerHTML = `
      <li class="cart-empty">
        <i class="ri-shopping-bag-3-line"></i>
        <strong>Keranjang masih kosong</strong>
        <p>Yuk, pilih sneakers favoritmu dulu.</p>
        <a href="#produk" class="btn btn-primary btn-sm" data-drawer-close>Mulai Belanja</a>
      </li>`;
  } else {
    cartList.innerHTML = state.cart.map((it, i) => {
      const p = findProduct(it.id);
      return `
        <li class="cart-item" style="--i:${i}">
          <img src="${p.image}" alt="" width="76" height="76">
          <div>
            <h4>${p.name}</h4>
            <small>Ukuran EU ${it.size}</small>
            <div class="qty" role="group" aria-label="Jumlah ${p.name}">
              <button type="button" data-qty="-1" data-index="${i}" aria-label="Kurangi"><i class="ri-subtract-line"></i></button>
              <span>${it.qty}</span>
              <button type="button" data-qty="1" data-index="${i}" aria-label="Tambah"><i class="ri-add-line"></i></button>
            </div>
          </div>
          <div class="cart-side">
            <button class="remove-btn" type="button" data-remove="${i}" aria-label="Hapus ${p.name}"><i class="ri-delete-bin-6-line"></i></button>
            <p class="price">${rupiah(p.price * it.qty)}</p>
          </div>
        </li>`;
    }).join('');
  }

  const total = cartTotal();
  $('[data-cart-total]').textContent = rupiah(total);
  checkoutBtn.disabled = total === 0;

  const remain = FREE_SHIPPING_MIN - total;
  const shipText = $('[data-ship-text]');
  const shipBar = $('[data-ship-bar]');
  if (total === 0) {
    shipText.innerHTML = `<i class="ri-truck-line"></i> Gratis ongkir untuk belanja min. <strong>${rupiah(FREE_SHIPPING_MIN)}</strong>`;
  } else if (remain > 0) {
    shipText.innerHTML = `<i class="ri-truck-line"></i> Tambah <strong>${rupiah(remain)}</strong> lagi untuk <strong>gratis ongkir</strong>`;
  } else {
    shipText.innerHTML = '<i class="ri-checkbox-circle-fill"></i> Yeay, pesananmu dapat <strong>gratis ongkir!</strong>';
  }
  shipBar.style.width = `${Math.min(100, (total / FREE_SHIPPING_MIN) * 100)}%`;
  shipBar.classList.toggle('is-full', remain <= 0 && total > 0);

  updateBadges();
}

/** Gambar produk "terbang" ke ikon keranjang. */
function flyToCart(img) {
  const target = $('[data-cart-open]');
  if (prefersReduced || !img || !target) {
    updateBadges('cart');
    return;
  }
  const headerHidden = header.classList.contains('is-hidden');
  header.classList.remove('is-hidden');

  const a = img.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const size = Math.min(a.width, a.height, 150);
  const startX = a.left + a.width / 2;
  const startY = a.top + a.height / 2;
  const endX = b.left + b.width / 2;
  const endY = b.top + b.height / 2 + (headerHidden ? header.offsetHeight : 0);

  const clone = document.createElement('img');
  clone.src = img.currentSrc || img.src;
  clone.alt = '';
  clone.className = 'fly-img';
  Object.assign(clone.style, {
    width: `${size}px`,
    height: `${size}px`,
    left: `${startX - size / 2}px`,
    top: `${startY - size / 2}px`,
  });
  body.append(clone);

  const dx = endX - startX;
  const dy = endY - startY;
  const anim = clone.animate([
    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    { transform: `translate(${dx * 0.35}px, ${dy * 0.35 - 110}px) scale(.55)`, opacity: 1, offset: 0.45 },
    { transform: `translate(${dx}px, ${dy}px) scale(.1)`, opacity: 0.4 },
  ], { duration: 850, easing: 'cubic-bezier(.5, 0, .3, 1)' });

  anim.onfinish = () => {
    clone.remove();
    updateBadges('cart');
  };
}

function addToCart(id, size = 42, img = null) {
  const p = findProduct(id);
  if (!p) return;
  const existing = state.cart.find((it) => it.id === id && it.size === size);
  if (existing) existing.qty += 1;
  else state.cart.push({ id, size, qty: 1 });
  saveCart();
  renderCart();
  flyToCart(img);
  toast(`${p.name} (EU ${size}) masuk keranjang`, 'ri-shopping-bag-3-fill', {
    label: 'Lihat',
    onClick: () => openDrawer('cart'),
  });
}

function changeQty(index, delta) {
  const item = state.cart[index];
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeCartItem(index);
    return;
  }
  saveCart();
  renderCart();
}

function removeCartItem(index) {
  const row = cartList.children[index];
  const done = () => {
    state.cart.splice(index, 1);
    saveCart();
    renderCart();
  };
  if (row && !prefersReduced) {
    row.classList.add('is-removing');
    row.addEventListener('animationend', done, { once: true });
  } else {
    done();
  }
}

checkoutBtn.addEventListener('click', () => {
  toast('Checkout segera hadir — backend sedang disiapkan', 'ri-tools-line');
});

/* ---------- Drawer ---------- */
function switchDrawerTab(tab) {
  $$('[data-drawer-tab]').forEach((t) => {
    const on = t.dataset.drawerTab === tab;
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', String(on));
  });
  $$('[data-drawer-panel]').forEach((p) => p.classList.toggle('is-active', p.dataset.drawerPanel === tab));
}

function openDrawer(tab = 'cart') {
  closeSearch();
  setMenu(false);
  switchDrawerTab(tab);
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  updateLock();
  setTimeout(() => drawer.focus({ preventScroll: true }), 50);
}

function closeDrawer() {
  if (!drawer.classList.contains('is-open')) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  updateLock();
}

$('[data-cart-open]').addEventListener('click', () => openDrawer('cart'));
$('[data-wishlist-open]').addEventListener('click', () => openDrawer('wishlist'));
$$('[data-drawer-tab]').forEach((t) => t.addEventListener('click', () => switchDrawerTab(t.dataset.drawerTab)));

/* =========================================================
   Quick view (modal)
   ========================================================= */
const modalBody = $('[data-modal-body]');
let qvSelection = { id: null, size: null };
let lastFocus = null;

function stars(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

/** Ukuran "habis" dibuat deterministik dari id agar konsisten. */
function soldOutSizes(id) {
  const seed = [...id].reduce((s, ch) => s + ch.charCodeAt(0), 0);
  return SIZES.filter((_, i) => (seed + i * 3) % 7 === 0);
}

function openQuickView(id) {
  const p = findProduct(id);
  if (!p) return;
  closeSearch();
  lastFocus = document.activeElement;
  qvSelection = { id, size: null };
  const soldOut = soldOutSizes(id);
  const wished = state.wishlist.includes(id);

  modalBody.innerHTML = `
    <div class="qv">
      <div class="qv-media">
        ${badgeHTML(p)}
        <img src="${p.image}" alt="${p.name}" width="700" height="700">
      </div>
      <div class="qv-info">
        <span class="qv-cat">${CATEGORY_LABEL[p.category]} · ${p.group === 'drop' ? 'Limited Drop' : 'Koleksi Utama'}</span>
        <h2 class="qv-title" id="qv-title">${p.name}</h2>
        <div class="qv-rating"><span class="stars" aria-hidden="true">${stars(p.rating)}</span>${p.rating.toFixed(1).replace('.', ',')} · ${p.reviews} ulasan</div>
        <p class="qv-price">${priceHTML(p)}</p>
        <p class="qv-desc">${p.desc}</p>
        <div>
          <p class="qv-label">Warna</p>
          <div class="product-colors">${p.colors.map((c) => `<span style="--c:${c}"></span>`).join('')}</div>
        </div>
        <div>
          <p class="qv-label"><span>Pilih ukuran (EU)</span><button type="button" class="link-btn" data-size-guide>Panduan ukuran</button></p>
          <div class="sizes" role="radiogroup" aria-label="Ukuran" data-sizes>
            ${SIZES.map((s) => `<button type="button" class="size-btn" role="radio" aria-checked="false" data-size="${s}" ${soldOut.includes(s) ? 'disabled aria-label="Ukuran ' + s + ' habis"' : ''}>${s}</button>`).join('')}
          </div>
          <p class="size-hint" data-size-hint></p>
        </div>
        <div class="qv-actions">
          <button type="button" class="btn btn-primary" data-qv-add>Tambah ke Keranjang <i class="ri-shopping-bag-3-line"></i></button>
          <button type="button" class="square-btn${wished ? ' is-active' : ''}" data-wish="${p.id}" aria-pressed="${wished}" aria-label="Simpan ke wishlist"><i class="${wishIcon(wished)}"></i></button>
        </div>
        <ul class="qv-perks">
          <li><i class="ri-shield-check-line"></i> 100% original, bergaransi uang kembali</li>
          <li><i class="ri-truck-line"></i> Gratis ongkir min. belanja ${rupiah(FREE_SHIPPING_MIN)}</li>
          <li><i class="ri-arrow-go-back-line"></i> Tukar ukuran / retur 30 hari</li>
        </ul>
      </div>
    </div>`;

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  updateLock();
  setTimeout(() => $('[data-modal-close]').focus({ preventScroll: true }), 60);
}

function closeModal() {
  if (!modal.classList.contains('is-open')) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  updateLock();
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
}

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
$('[data-modal-close]').addEventListener('click', closeModal);

modalBody.addEventListener('click', (e) => {
  const sizeBtn = e.target.closest('[data-size]');
  if (sizeBtn) {
    qvSelection.size = Number(sizeBtn.dataset.size);
    $$('[data-size]', modalBody).forEach((b) => {
      const on = b === sizeBtn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-checked', String(on));
    });
    $('[data-size-hint]', modalBody).textContent = '';
    return;
  }

  if (e.target.closest('[data-size-guide]')) {
    toast('Ukur panjang telapak kaki, lalu pilih ukuran yang ±1 cm lebih panjang', 'ri-ruler-line');
    return;
  }

  if (e.target.closest('[data-qv-add]')) {
    if (!qvSelection.size) {
      $('[data-size-hint]', modalBody).textContent = 'Pilih ukuran dulu, ya.';
      replayClass($('[data-sizes]', modalBody), 'is-error');
      return;
    }
    const img = $('.qv-media img', modalBody);
    addToCart(qvSelection.id, qvSelection.size, img);
    closeModal();
  }
});

/* =========================================================
   Klik global (event delegation)
   ========================================================= */
document.addEventListener('click', (e) => {
  const t = e.target;
  let el;

  if ((el = t.closest('[data-add]'))) {
    const card = el.closest('.product-card');
    addToCart(el.dataset.add, 42, card?.querySelector('.media-link img'));
    return;
  }
  if ((el = t.closest('[data-wish]'))) {
    toggleWish(el.dataset.wish);
    return;
  }
  if ((el = t.closest('[data-qv]'))) {
    openQuickView(el.dataset.qv);
    return;
  }
  if ((el = t.closest('[data-qty]'))) {
    changeQty(Number(el.dataset.index), Number(el.dataset.qty));
    return;
  }
  if ((el = t.closest('[data-remove]'))) {
    removeCartItem(Number(el.dataset.remove));
    return;
  }
  if ((el = t.closest('[data-wl-add]'))) {
    addToCart(el.dataset.wlAdd, 42, el.closest('.cart-item')?.querySelector('img'));
    return;
  }
  if ((el = t.closest('[data-wl-remove]'))) {
    toggleWish(el.dataset.wlRemove);
    return;
  }
  if ((el = t.closest('[data-drawer-close]'))) {
    closeDrawer();
    return;
  }
  if ((el = t.closest('[data-filter-link]'))) {
    setFilter(el.dataset.filterLink);
    // biarkan anchor #produk melakukan scroll
  }
  if (t.closest('[data-remind]')) {
    toast('Siap! Kami kabari lewat email sebelum drop dimulai', 'ri-notification-3-line');
  }
});

/* =========================================================
   Pencarian
   ========================================================= */
const searchInput = $('[data-search-input]');
const searchResults = $('[data-search-results]');
const searchLabel = $('[data-search-label]');

function renderSearch(query) {
  const q = query.trim().toLowerCase();
  let list;
  if (q) {
    list = PRODUCTS.filter((p) =>
      `${p.name} ${CATEGORY_LABEL[p.category]} ${p.category}`.toLowerCase().includes(q));
    searchLabel.textContent = `${list.length} hasil untuk “${query.trim()}”`;
  } else {
    list = PRODUCTS.filter((p) => p.badge === 'hot' || p.badge === 'new').slice(0, 6);
    searchLabel.textContent = 'Rekomendasi untukmu';
  }

  searchResults.innerHTML = list.length
    ? list.map((p, i) => `
        <li>
          <button type="button" class="search-result" data-qv="${p.id}" style="--i:${i}">
            <img src="${p.image}" alt="" width="64" height="64">
            <span><strong>${p.name}</strong><small>${CATEGORY_LABEL[p.category]} · ${rupiah(p.price)}</small></span>
          </button>
        </li>`).join('')
    : '<li class="search-empty">Belum ketemu. Coba kata lain, misalnya “runner” atau “hi”.</li>';
}

function openSearch() {
  setMenu(false);
  closeDrawer();
  renderSearch(searchInput.value);
  searchPanel.classList.add('is-open');
  searchPanel.setAttribute('aria-hidden', 'false');
  updateLock();
  setTimeout(() => searchInput.focus({ preventScroll: true }), 250);
}

function closeSearch() {
  if (!searchPanel.classList.contains('is-open')) return;
  searchPanel.classList.remove('is-open');
  searchPanel.setAttribute('aria-hidden', 'true');
  updateLock();
}

$('[data-search-open]').addEventListener('click', openSearch);
$('[data-search-close]').addEventListener('click', closeSearch);
$('[data-search-form]').addEventListener('submit', (e) => e.preventDefault());
searchInput.addEventListener('input', () => renderSearch(searchInput.value));
$$('[data-search-tag]').forEach((tag) => tag.addEventListener('click', () => {
  searchInput.value = tag.textContent;
  renderSearch(searchInput.value);
  searchInput.focus();
}));

/* =========================================================
   Hero: ganti colorway, autoplay, parallax
   ========================================================= */
const hero = $('.hero');
const heroVisual = $('[data-hero-visual]');
const heroStage = $('[data-hero-stage]');
const heroSlides = $$('[data-hero-slide]');
const heroThumbs = $$('[data-hero-thumb]');
const heroInfo = $('[data-hero-info]');
let heroIndex = 0;

function setHero(index) {
  if (index === heroIndex) {
    // klik thumbnail yang sudah aktif: ulangi bar progres autoplay
    replayClass(heroThumbs[index], 'is-active');
    return;
  }
  const prev = heroSlides[heroIndex];
  prev.classList.remove('is-active');
  prev.classList.add('is-leaving');
  setTimeout(() => prev.classList.remove('is-leaving'), 1050);

  heroIndex = index;
  const slide = heroSlides[index];
  slide.classList.add('is-active');

  const p = findProduct(slide.dataset.id);
  root.style.setProperty('--hero-accent', p.accent);

  if (!prefersReduced) replayClass(heroInfo, 'is-swapping');
  setTimeout(() => {
    $('[data-hero-tag]').textContent = CATEGORY_LABEL[p.category];
    $('[data-hero-name]').textContent = p.name;
    $('[data-hero-price]').textContent = rupiah(p.price);
  }, prefersReduced ? 0 : 250);

  heroThumbs.forEach((t, i) => {
    t.classList.toggle('is-active', i === index);
    t.setAttribute('aria-selected', String(i === index));
  });
  $('[data-hero-current]').textContent = String(index + 1).padStart(2, '0');
}

heroThumbs.forEach((thumb, i) => {
  thumb.addEventListener('click', () => setHero(i));
  // Bar progres di thumbnail aktif selesai -> pindah ke slide berikutnya
  thumb.addEventListener('animationend', (e) => {
    if (prefersReduced || e.animationName !== 'thumbProgress') return;
    if (thumb.classList.contains('is-active')) setHero((i + 1) % heroSlides.length);
  });
});

$('[data-hero-add]').addEventListener('click', () => {
  addToCart(heroSlides[heroIndex].dataset.id, 42, heroSlides[heroIndex]);
});

// Hentikan autoplay saat hero tidak terlihat
new IntersectionObserver(([entry]) => {
  hero.classList.toggle('is-paused', !entry.isIntersecting);
}, { threshold: 0.2 }).observe(hero);

if (!prefersReduced && canHover) {
  heroVisual.addEventListener('pointermove', (e) => {
    const r = heroVisual.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    heroStage.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`);
    heroStage.style.setProperty('--ry', `${(x * 9).toFixed(2)}deg`);
    heroStage.style.setProperty('--px', `${(-x * 16).toFixed(1)}px`);
    heroStage.style.setProperty('--py', `${(-y * 16).toFixed(1)}px`);
  });
  heroVisual.addEventListener('pointerleave', () => {
    ['--rx', '--ry', '--px', '--py'].forEach((v) => heroStage.style.removeProperty(v));
  });
}

/* ---------- Counter angka ---------- */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = Number(el.dataset.decimals || 0);
  const suffix = el.dataset.suffix || '';
  const format = (v) => v.toFixed(decimals).replace('.', ',') + suffix;
  if (prefersReduced) {
    el.textContent = format(target);
    return;
  }
  const duration = 1600;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = format(target * eased);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    animateCount(entry.target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });

/* =========================================================
   Flash sale countdown (berakhir tiap Minggu 23.59.59)
   ========================================================= */
const cdEls = {
  days: $('[data-cd="days"]'),
  hours: $('[data-cd="hours"]'),
  minutes: $('[data-cd="minutes"]'),
  seconds: $('[data-cd="seconds"]'),
};

function nextSundayEnd() {
  const now = new Date();
  const end = new Date(now);
  end.setDate(now.getDate() + ((7 - now.getDay()) % 7));
  end.setHours(23, 59, 59, 999);
  if (end <= now) end.setDate(end.getDate() + 7);
  return end;
}

let saleEnd = nextSundayEnd();

function tickCountdown() {
  let diff = saleEnd - Date.now();
  if (diff <= 0) {
    saleEnd = nextSundayEnd();
    diff = saleEnd - Date.now();
  }
  const values = {
    days: Math.floor(diff / 864e5),
    hours: Math.floor(diff / 36e5) % 24,
    minutes: Math.floor(diff / 6e4) % 60,
    seconds: Math.floor(diff / 1e3) % 60,
  };
  Object.entries(values).forEach(([key, val]) => {
    const el = cdEls[key];
    const text = String(val).padStart(2, '0');
    if (el.textContent !== text) {
      el.textContent = text;
      if (!prefersReduced) replayClass(el, 'tick');
    }
  });
}

tickCountdown();
setInterval(tickCountdown, 1000);

/* =========================================================
   Limited drop: carousel yang bisa di-drag
   ========================================================= */
const dropTrack = $('[data-drop-track]');
const dropPrev = $('[data-drop-prev]');
const dropNext = $('[data-drop-next]');
const dropProgress = $('[data-drop-progress]');

dropTrack.insertAdjacentHTML('beforeend',
  PRODUCTS.filter((p) => p.group === 'drop').map((p, i) => productCard(p, i)).join(''));

function dropStep() {
  const card = $('.drop-card', dropTrack);
  return card ? card.offsetWidth + 20 : 300;
}

function updateDropUI() {
  const max = dropTrack.scrollWidth - dropTrack.clientWidth;
  const ratio = max > 0 ? dropTrack.scrollLeft / max : 1;
  dropProgress.style.transform = `scaleX(${Math.max(0.1, ratio)})`;
  dropPrev.disabled = dropTrack.scrollLeft < 8;
  dropNext.disabled = dropTrack.scrollLeft > max - 8;
}

dropPrev.addEventListener('click', () => dropTrack.scrollBy({ left: -dropStep(), behavior: prefersReduced ? 'auto' : 'smooth' }));
dropNext.addEventListener('click', () => dropTrack.scrollBy({ left: dropStep(), behavior: prefersReduced ? 'auto' : 'smooth' }));
dropTrack.addEventListener('scroll', () => requestAnimationFrame(updateDropUI), { passive: true });

let drag = { down: false, moved: false, startX: 0, startLeft: 0 };

dropTrack.addEventListener('pointerdown', (e) => {
  if (e.pointerType !== 'mouse' || e.button !== 0) return;
  drag = { down: true, moved: false, startX: e.clientX, startLeft: dropTrack.scrollLeft };
});
window.addEventListener('pointermove', (e) => {
  if (!drag.down) return;
  const dx = e.clientX - drag.startX;
  if (!drag.moved && Math.abs(dx) > 6) {
    drag.moved = true;
    dropTrack.classList.add('is-dragging');
  }
  if (drag.moved) dropTrack.scrollLeft = drag.startLeft - dx;
});
window.addEventListener('pointerup', () => {
  if (!drag.down) return;
  drag.down = false;
  if (drag.moved) {
    dropTrack.classList.remove('is-dragging');
    // klik yang menyusul setelah drag tidak dianggap klik
    setTimeout(() => { drag.moved = false; }, 0);
  }
});
dropTrack.addEventListener('click', (e) => {
  if (drag.moved) {
    e.preventDefault();
    e.stopPropagation();
  }
}, true);

/* =========================================================
   Testimoni
   ========================================================= */
const testiItems = $$('[data-testi-item]');
const testiBtns = $$('[data-testi-btn]');
let testiIndex = 0;
let testiTimer;

function setTesti(index) {
  testiIndex = index;
  testiItems.forEach((el, i) => {
    el.classList.toggle('is-active', i === index);
    el.setAttribute('aria-hidden', String(i !== index));
  });
  testiBtns.forEach((b, i) => {
    b.classList.toggle('is-active', i === index);
    b.setAttribute('aria-selected', String(i === index));
  });
}

function restartTesti() {
  clearInterval(testiTimer);
  if (!prefersReduced) testiTimer = setInterval(() => setTesti((testiIndex + 1) % testiItems.length), 6500);
}

testiBtns.forEach((btn, i) => btn.addEventListener('click', () => {
  setTesti(i);
  restartTesti();
}));
$('.testi-stage').addEventListener('mouseenter', () => clearInterval(testiTimer));
$('.testi-stage').addEventListener('mouseleave', restartTesti);
restartTesti();

/* =========================================================
   Newsletter (validasi di sisi klien saja untuk sekarang)
   ========================================================= */
const newsletter = $('[data-newsletter]');
const newsletterMsg = $('[data-newsletter-msg]');

newsletter.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = newsletter.querySelector('input');
  const value = input.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

  if (!valid) {
    newsletterMsg.textContent = value ? 'Format email belum benar, coba cek lagi.' : 'Email wajib diisi dulu, ya.';
    newsletterMsg.className = 'form-msg is-error';
    replayClass(newsletter, 'is-error');
    input.focus();
    return;
  }

  newsletterMsg.textContent = 'Terima kasih! Kode KICKBARU siap dipakai di order pertamamu.';
  newsletterMsg.className = 'form-msg';
  newsletter.reset();
  toast('Kamu sudah terdaftar di newsletter KickCulture', 'ri-mail-check-line');
});

/* =========================================================
   Footer: status buka toko (WIB) & tahun
   ========================================================= */
const OPEN_HOURS = { 0: [11, 20], 6: [10, 22] }; // Minggu, Sabtu
const WEEKDAY_HOURS = [10, 21];
const hoursFor = (day) => OPEN_HOURS[day] || WEEKDAY_HOURS;

function jakartaNow() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type)?.value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, hour: Number(get('hour')) + Number(get('minute')) / 60 };
}

function updateOpenStatus() {
  const el = $('[data-open-status]');
  const { day, hour } = jakartaNow();
  const [open, close] = hoursFor(day);
  const isOpen = hour >= open && hour < close;
  el.classList.toggle('is-open', isOpen);
  if (isOpen) el.textContent = `Buka sekarang · sampai ${close}.00 WIB`;
  else if (hour < open) el.textContent = `Sedang tutup · buka pukul ${open}.00 WIB`;
  else el.textContent = `Sedang tutup · buka besok ${hoursFor((day + 1) % 7)[0]}.00 WIB`;
}

updateOpenStatus();
setInterval(updateOpenStatus, 60000);
$('[data-year]').textContent = new Date().getFullYear();

/* =========================================================
   Init
   ========================================================= */
renderGrid();
renderCart();
renderWishlist();
updateBadges();
updateDropUI();
observeReveal();

// Posisi pill & indikator butuh font yang sudah termuat
const settleLayout = () => {
  movePill(filterBtns.find((b) => b.classList.contains('is-active')));
  moveIndicator(activeNav);
  updateDropUI();
};
if (document.fonts?.ready) document.fonts.ready.then(settleLayout);
window.addEventListener('load', settleLayout);
settleLayout();

onLoaded.push(() => {
  setTimeout(() => $$('[data-count]').forEach((el) => counterObserver.observe(el)), 500);
});
if (loaded) onLoaded.forEach((fn) => fn());
