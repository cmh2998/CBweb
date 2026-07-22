// Lightweight bag/cart mockup shared by shop.html (DeCadence) and recadence.html (ReCadence).
// Set window.CART_KEY before including this file so each shop keeps its own bag.
// NOTE: this is a front-end mockup only — nothing is charged, there is no payment
// processor wired up yet, and totals live in the browser's localStorage.
(function () {
  var KEY = window.CART_KEY || 'cadence_cart';

  function readCart() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function writeCart(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    renderCart();
  }

  function addToCart(id, name, price, swatchClass) {
    var items = readCart();
    var existing = items.find(function (i) { return i.id === id; });
    if (existing) { existing.qty += 1; }
    else { items.push({ id: id, name: name, price: price, swatchClass: swatchClass, qty: 1 }); }
    writeCart(items);
    showToast(name + ' added to your bag');
    openCart(true);
  }

  function removeFromCart(id) {
    writeCart(readCart().filter(function (i) { return i.id !== id; }));
  }

  function cartTotal(items) {
    return items.reduce(function (sum, i) { return sum + i.price * i.qty; }, 0);
  }

  function renderCart() {
    var items = readCart();
    var countEl = document.querySelector('.cart-count');
    var listEl = document.querySelector('.cart-items');
    var totalEl = document.querySelector('.cart-total-value');
    var count = items.reduce(function (s, i) { return s + i.qty; }, 0);
    if (countEl) {
      countEl.textContent = count;
      countEl.style.display = count ? 'flex' : 'none';
    }
    if (listEl) {
      if (!items.length) {
        listEl.innerHTML = '<div class="cart-empty">Your bag is empty — browse the collection and add something you love.</div>';
      } else {
        listEl.innerHTML = items.map(function (i) {
          return '<div class="cart-item">' +
            '<div class="sw swatch ' + i.swatchClass + '"></div>' +
            '<div class="meta"><div class="name">' + i.name + '</div>' +
            '<div class="p">£' + i.price.toFixed(2) + ' × ' + i.qty + '</div></div>' +
            '<button class="remove" data-remove="' + i.id + '">Remove</button>' +
            '</div>';
        }).join('');
      }
    }
    if (totalEl) { totalEl.textContent = '£' + cartTotal(items).toFixed(2); }
  }

  function showToast(msg) {
    var toast = document.querySelector('.toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2400);
  }

  function openCart(open) {
    var drawer = document.querySelector('.cart-drawer');
    var overlay = document.querySelector('.overlay');
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    if (overlay) overlay.classList.toggle('show', open);
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderCart();

    document.querySelectorAll('[data-add]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        addToCart(btn.dataset.add, btn.dataset.name, parseFloat(btn.dataset.price), btn.dataset.swatch);
      });
    });

    var cartToggle = document.querySelector('.cart-toggle');
    if (cartToggle) cartToggle.addEventListener('click', function (e) { e.preventDefault(); openCart(true); });

    var closeBtn = document.querySelector('.cart-header button');
    if (closeBtn) closeBtn.addEventListener('click', function () { openCart(false); });

    var overlay = document.querySelector('.overlay');
    if (overlay) overlay.addEventListener('click', function () { openCart(false); });

    document.addEventListener('click', function (e) {
      if (e.target.matches('[data-remove]')) { removeFromCart(e.target.dataset.remove); }
    });

    var checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', function () {
      showToast('Checkout is coming soon — thank you for your patience.');
    });

    // filter pills (product grids)
    document.querySelectorAll('.filters button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.filters button').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.dataset.filter;
        document.querySelectorAll('[data-category]').forEach(function (card) {
          card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
        });
      });
    });
  });
})();
