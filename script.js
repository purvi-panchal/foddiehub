// ── DATA ──
const foods = [
  {
    id: 1, name: "Classic Burger", price: 149,
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop",
    tag: "Fast Food", category: "fast", rating: "4.8", reviews: "2.3k", veg: false,
    variants: ["Cheese Burger", "Veg Burger", "Spicy Burger"]
  },
  {
    id: 2, name: "Margherita Pizza", price: 299,
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop",
    tag: "Italian", category: "main", rating: "4.9", reviews: "3.1k", veg: true,
    variants: ["Cheese Pizza", "Farmhouse Pizza", "Veggie Pizza"]
  },
  {
    id: 3, name: "Creamy Pasta", price: 199,
    img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&auto=format&fit=crop",
    tag: "Italian", category: "main", rating: "4.7", reviews: "1.8k", veg: true,
    variants: ["White Sauce", "Red Sauce", "Cheese Pasta"]
  },
  {
    id: 4, name: "Club Sandwich", price: 129,
    img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop",
    tag: "Snack", category: "snack", rating: "4.6", reviews: "1.2k", veg: true,
    variants: ["Veg Sandwich", "Cheese Sandwich", "Grilled Sandwich"]
  },
  {
    id: 5, name: "French Fries", price: 99,
    img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop",
    tag: "Snack", category: "snack", rating: "4.8", reviews: "4.2k", veg: true,
    variants: ["Peri Peri", "Cheese Fries", "Classic"]
  },
  {
    id: 6, name: "Steam Momos", price: 159,
    img: "https://images.pexels.com/photos/7363686/pexels-photo-7363686.jpeg?w=600",
    tag: "Street Food", category: "snack", rating: "4.9", reviews: "2.7k", veg: false,
    variants: ["Paneer Momos", "Veg Momos", "Fried Momos"]
  },
];

const reviews = [
  { name: "Priya Sharma",  sub: "Verified Customer", stars: 5, text: "Amazing food and super fast delivery! The cheese burger is absolutely divine. Been ordering weekly for 3 months now. 🍔" },
  { name: "Rahul Mehta",   sub: "Food Blogger",       stars: 5, text: "Pizza was fresh, crispy and full of toppings. Arrived hot in 25 minutes. Best food delivery app I've tried! 😍" },
  { name: "Anjali Gupta",  sub: "Regular Customer",   stars: 5, text: "The momos are a total game changer. Perfectly steamed with amazing chutney. 10/10 would order again! ❤️" },
  { name: "Vikram Singh",  sub: "Verified Customer",  stars: 5, text: "French fries with peri peri seasoning are insanely good. Crispy outside, soft inside. Always reliable quality." },
  { name: "Sneha Patel",   sub: "Food Enthusiast",    stars: 5, text: "White sauce pasta was creamy and delicious. Portion size is generous too. FoodieHub never disappoints!" },
  { name: "Arjun Nair",    sub: "Verified Customer",  stars: 4, text: "Great variety of options and the interface is super clean. Delivery was a bit late once but overall fantastic experience!" },
];

// ── STATE ──
let cart = [];
let selectedPayment = null;

// ── RENDER MENU ──
function renderMenu(filter = 'all') {
  const grid = document.getElementById('food-grid');
  const filtered = filter === 'all'
    ? foods
    : filter === 'veg'
    ? foods.filter(f => f.veg)
    : foods.filter(f => f.category === filter);

  grid.innerHTML = filtered.map(f => `
    <div class="food-card" data-id="${f.id}">
      <div class="food-card-img">
        <img src="${f.img}" alt="${f.name}" loading="lazy">
        <span class="food-tag">${f.tag}${f.veg ? ' 🌿' : ''}</span>
      </div>
      <div class="food-card-body">
        <div class="food-top">
          <div class="food-name">${f.name}</div>
          <div class="food-price">₹${f.price}</div>
        </div>
        <div class="food-rating">★★★★★ <span>${f.rating} (${f.reviews})</span></div>
        <select class="food-select" id="sel-${f.id}">
          ${f.variants.map(v => `<option>${v}</option>`).join('')}
        </select>
        <button class="add-btn" id="btn-${f.id}" onclick="addToCart(${f.id})">
          <span>＋</span> Add to Cart
        </button>
      </div>
    </div>
  `).join('');
}

// ── RENDER REVIEWS ──
function renderReviews() {
  const grid = document.getElementById('review-grid');
  grid.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-stars">${'★'.repeat(r.stars)}</div>
      <p class="review-text">"${r.text}"</p>
      <div class="reviewer">
        <div class="reviewer-avatar">${r.name.split(' ').map(n => n[0]).join('')}</div>
        <div>
          <div class="reviewer-name">${r.name}</div>
          <div class="reviewer-sub">${r.sub}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// ── CART: ADD ──
function addToCart(id) {
  const food    = foods.find(f => f.id === id);
  const variant = document.getElementById(`sel-${id}`).value;
  const key     = `${id}-${variant}`;
  const existing = cart.find(i => i.key === key);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...food, variant, key, qty: 1 });
  }

  updateCartUI();

  // Button feedback
  const btn = document.getElementById(`btn-${id}`);
  btn.classList.add('added');
  btn.textContent = '✓ Added!';
  setTimeout(() => {
    btn.classList.remove('added');
    btn.innerHTML = '<span>＋</span> Add to Cart';
  }, 1400);

  toast(`${food.name} added to cart 🛒`, 'success');

  // Badge bounce
  const badge = document.getElementById('cart-count');
  badge.classList.add('bump');
  setTimeout(() => badge.classList.remove('bump'), 300);
}

// ── CART: REMOVE ──
function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  updateCartUI();
  renderCartItems();
}

// ── CART: CHANGE QUANTITY ──
function changeQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.key !== key);
  updateCartUI();
  renderCartItems();
}

// ── CART: UPDATE COUNT + TOTAL ──
function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cart-count').textContent  = count;
  document.getElementById('cart-total').textContent  = total;
  document.getElementById('modal-total').textContent = total;
  document.getElementById('cart-foot').style.display = cart.length ? '' : 'none';
}

// ── CART: RENDER ITEMS ──
function renderCartItems() {
  const body  = document.getElementById('cart-body');
  const empty = document.getElementById('cart-empty');

  if (!cart.length) {
    body.innerHTML = '';
    body.appendChild(empty);
    empty.style.display = '';
    return;
  }

  empty.style.display = 'none';
  body.querySelectorAll('.cart-item').forEach(e => e.remove());

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img class="cart-item-img" src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-variant">${item.variant}</div>
        <div class="cart-item-price">₹${item.price * item.qty}</div>
      </div>
      <div class="qty-ctrl">
        <button class="qty-btn" onclick="changeQty('${item.key}', -1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty('${item.key}', 1)">+</button>
      </div>
      <button class="cart-remove" onclick="removeFromCart('${item.key}')">✕</button>
    `;
    body.appendChild(div);
  });
}

// ── CART: OPEN / CLOSE ──
function openCart() {
  renderCartItems();
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-sidebar').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-sidebar').classList.remove('open');
  document.body.style.overflow = '';
}

// ── PAYMENT: OPEN / CLOSE ──
function openPayment() {
  if (!cart.length) { toast('Your cart is empty!', 'error'); return; }
  document.getElementById('payment-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePayment() {
  document.getElementById('payment-modal').classList.remove('open');
  document.getElementById('modal-pay').style.display     = '';
  document.getElementById('modal-success').style.display = 'none';
  document.body.style.overflow = '';
  document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('selected'));
  selectedPayment = null;
}

// ── PAYMENT: SELECT METHOD ──
function selectPayment(el, method) {
  document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('selected'));
  el.classList.add('selected');
  selectedPayment = method;
}

// ── PAYMENT: CONFIRM ──
function confirmPayment() {
  if (!selectedPayment) { toast('Please choose a payment method', 'error'); return; }
  document.getElementById('modal-pay').style.display     = 'none';
  document.getElementById('modal-success').style.display = '';
}

// ── CART: CLEAR ──
function clearCart() {
  cart = [];
  updateCartUI();
  renderCartItems();
  closeCart();
}

// ── CONTACT FORM ──
function sendContact() {
  const name  = document.getElementById('c-name').value.trim();
  const email = document.getElementById('c-email').value.trim();
  const msg   = document.getElementById('c-msg').value.trim();

  if (!name || !email || !msg) { toast('Please fill all fields', 'error'); return; }

  document.getElementById('c-name').value = '';
  document.getElementById('c-email').value = '';
  document.getElementById('c-msg').value  = '';

  toast("Message sent! We'll reply soon 📧", 'success');
}

// ── TOAST ──
function toast(msg, type = '') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 300);
  }, 2800);
}

// ── FILTER BUTTONS ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMenu(btn.dataset.filter);
  });
});

// ── INIT ──
renderMenu();
renderReviews();