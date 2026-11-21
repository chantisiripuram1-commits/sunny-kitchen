/* Shared code for every page: header, footer, cart, chatbot, helpers */

const SITE_NAME = 'Sunny Kitchen';

/* ---------- helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const rupee = (n) => '₹' + Number(n).toLocaleString('en-IN');

// Escape text before putting it in HTML (protects against injected markup)
function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function api(url, options) {
  const res = await fetch(url, options);
  let data = {};
  try { data = await res.json(); } catch { /* ignore */ }
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

function postJSON(url, body) {
  return api(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}

function toast(text) {
  let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = text;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- logged-in user (null when nobody is logged in) ---------- */
const userReady = api('/api/auth/me').then((d) => d.user).catch(() => null);

function renderAuthNav() {
  const slot = $('#authLi');
  if (!slot) return;
  const page = document.body.dataset.page || '';
  userReady.then((user) => {
    if (user) {
      const first = user.name.split(' ')[0];
      slot.innerHTML = `<span class="nav-user">👋 Hi, ${esc(first)}</span> <a href="#" id="logoutLink">Log out</a>`;
      $('#logoutLink').addEventListener('click', async (e) => {
        e.preventDefault();
        try { await postJSON('/api/auth/logout', {}); } catch { /* ignore */ }
        toast('You are logged out');
        setTimeout(() => (window.location.href = '/'), 600);
      });
    } else {
      slot.innerHTML = `
        <a href="/login.html" class="${page === 'login' ? 'active' : ''}">Log in</a>
        <a href="/signup.html" class="nav-cta ${page === 'signup' ? 'active' : ''}">Sign up</a>`;
    }
  });
}

function spiceLabel(n) { return n === 0 ? 'Not spicy' : '🌶️'.repeat(n); }

/* ---------- cart (saved in the browser) ---------- */
const Cart = {
  get() {
    try { return JSON.parse(localStorage.getItem('sunny_cart')) || []; } catch { return []; }
  },
  save(items) {
    try { localStorage.setItem('sunny_cart', JSON.stringify(items)); } catch { /* storage blocked */ }
    Cart.updateBadge();
    document.dispatchEvent(new CustomEvent('cart:changed'));
  },
  add(dish, qty = 1) {
    const items = Cart.get();
    const found = items.find((i) => i.id === dish.id);
    if (found) found.qty = Math.min(20, found.qty + qty);
    else items.push({ id: dish.id, name: dish.name, price: dish.price, qty });
    Cart.save(items);
  },
  setQty(id, qty) {
    let items = Cart.get();
    if (qty <= 0) items = items.filter((i) => i.id !== id);
    else items = items.map((i) => (i.id === id ? { ...i, qty: Math.min(20, qty) } : i));
    Cart.save(items);
  },
  clear() { Cart.save([]); },
  count() { return Cart.get().reduce((s, i) => s + i.qty, 0); },
  subtotal() { return Cart.get().reduce((s, i) => s + i.price * i.qty, 0); },
  updateBadge() { $$('.cart-count').forEach((el) => (el.textContent = Cart.count())); },
};

function addToCart(dish) {
  Cart.add({ id: dish.id || dish._id, name: dish.name, price: dish.price });
  toast(`Added ${dish.name} to cart`);
}

/* ---------- header and footer ---------- */
function renderLayout() {
  const page = document.body.dataset.page || '';
  const link = (href, key, label) => `<li><a href="${href}" class="${page === key ? 'active' : ''}">${label}</a></li>`;

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="container nav">
      <a href="/" class="logo"><span class="logo-sun"></span>${SITE_NAME}</a>
      <ul class="nav-links" id="navLinks">
        ${link('/', 'home', 'Home')}
        ${link('/menu.html', 'menu', 'Menu')}
        ${link('/order.html', 'order', 'Order Online')}
        ${link('/booking.html', 'booking', 'Book a Table')}
        ${link('/offers.html', 'offers', 'Offers')}
        ${link('/contact.html', 'contact', 'Contact')}
        <li id="authLi" class="auth-li"></li>
      </ul>
      <div style="display:flex;align-items:center;gap:8px">
        <a href="/order.html" class="cart-btn" aria-label="Open cart">🛒 Cart <span class="cart-count">0</span></a>
        <button class="menu-toggle" id="menuToggle" aria-label="Open menu">☰</button>
      </div>
    </div>`;
  document.body.prepend(header);
  $('#menuToggle').addEventListener('click', () => $('#navLinks').classList.toggle('open'));

  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="logo" style="color:#fff"><span class="logo-sun"></span>${SITE_NAME}</div>
          <p style="margin-top:10px;max-width:34ch">Food that brightens your day. Fresh, hot and full of sunshine.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <p><a href="/menu.html">Menu</a></p>
          <p><a href="/order.html">Order Online</a></p>
          <p><a href="/booking.html">Book a Table</a></p>
          <p><a href="/offers.html">Offers</a></p>
        </div>
        <div>
          <h4>Visit us</h4>
          <p>12 Sunshine Street, Your City</p>
          <p>Open daily 11:00 AM to 11:00 PM</p>
          <p>📞 +91 98765 43210</p>
        </div>
      </div>
      <div class="copy">© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</div>
    </div>`;
  document.body.appendChild(footer);
}

/* ---------- order chatbot (floating, on every page) ---------- */
function renderChatbot() {
  const fab = document.createElement('button');
  fab.className = 'chat-fab';
  fab.textContent = '💬 Order with Sunny';

  const panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.innerHTML = `
    <div class="chat-head"><span>☀️ Sunny Assistant</span><button aria-label="Close chat">✕</button></div>
    <div class="chat-body" id="chatBody"></div>
    <form class="chat-form" id="chatForm">
      <input id="chatInput" placeholder="e.g. 2 Paneer Tikka and 1 Butter Naan" maxlength="500" autocomplete="off" />
      <button type="submit">Send</button>
    </form>`;
  document.body.append(panel, fab);

  const body = $('#chatBody', panel);
  const input = $('#chatInput', panel);
  let history = [];

  function bubble(text, who) {
    const b = document.createElement('div');
    b.className = `bubble ${who}`;
    b.textContent = text; // textContent keeps user and AI text safe
    body.appendChild(b);
    body.scrollTop = body.scrollHeight;
    return b;
  }

  bubble("Hi! I'm Sunny Assistant 👋 Tell me what you'd like to eat, or ask me for a suggestion, and I'll fill your cart.", 'bot');

  fab.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) input.focus();
  });
  $('.chat-head button', panel).addEventListener('click', () => panel.classList.remove('open'));

  $('#chatForm', panel).addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    input.value = '';
    bubble(message, 'me');
    const typing = bubble('Typing...', 'bot');
    try {
      const data = await postJSON('/api/ai/chat', { message, history });
      typing.textContent = data.reply;
      history.push({ role: 'user', content: message }, { role: 'assistant', content: data.reply });
      history = history.slice(-8);
      if (data.items && data.items.length) {
        data.items.forEach((it) => Cart.add({ id: it.id, name: it.name, price: it.price }, it.qty));
        const note = bubble(`🛒 Cart now has ${Cart.count()} item(s), ${rupee(Cart.subtotal())}. Open the cart to check out.`, 'bot');
        const go = document.createElement('a');
        go.href = '/order.html';
        go.textContent = ' Go to cart →';
        go.style.fontWeight = '700';
        note.appendChild(go);
      }
    } catch (err) {
      typing.textContent = err.message || 'Sorry, I could not reach the kitchen. Please try again.';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderLayout();
  renderAuthNav();
  renderChatbot();
  Cart.updateBadge();
});
