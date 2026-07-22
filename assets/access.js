// Cadence Black — accessibility mode.
// Adds a floating accessibility button + panel to every page.
// Settings persist in localStorage, so they follow the visitor across the site.
(function () {
  var KEY = 'cb_a11y';
  var FONT_CSS = 'https://fonts.cdnfonts.com/css/opendyslexic';
  var defaults = { font: false, large: false, spacing: false, calm: false, light: false, ruler: false, tint: 'none' };

  function load() {
    try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY)) || {}); }
    catch (e) { return Object.assign({}, defaults); }
  }
  function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

  var settings = load();
  var fontLoaded = false;

  function ensureFont() {
    if (fontLoaded) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = FONT_CSS;
    document.head.appendChild(l);
    fontLoaded = true;
  }

  function apply() {
    var h = document.documentElement;
    h.classList.toggle('a11y-font', settings.font);
    h.classList.toggle('a11y-large', settings.large);
    h.classList.toggle('a11y-spacing', settings.spacing);
    h.classList.toggle('a11y-calm', settings.calm);
    h.classList.toggle('a11y-light', settings.light);
    h.classList.toggle('a11y-ruler-on', settings.ruler);
    if (settings.tint && settings.tint !== 'none') h.setAttribute('data-a11y-tint', settings.tint);
    else h.removeAttribute('data-a11y-tint');
    if (settings.font) ensureFont();
    save(settings);
    syncPanel();
  }

  function syncPanel() {
    var panel = document.getElementById('a11y-panel');
    if (!panel) return;
    ['font', 'large', 'spacing', 'calm', 'light', 'ruler'].forEach(function (k) {
      var el = panel.querySelector('[data-a11y="' + k + '"]');
      if (el) el.checked = !!settings[k];
    });
    var sel = panel.querySelector('[data-a11y="tint"]');
    if (sel) sel.value = settings.tint;
  }

  function buildUI() {
    // ruler
    var ruler = document.createElement('div');
    ruler.id = 'a11y-ruler';
    document.body.appendChild(ruler);
    document.addEventListener('mousemove', function (e) {
      if (document.documentElement.classList.contains('a11y-ruler-on')) {
        ruler.style.top = e.clientY + 'px';
      }
    });

    // floating button (universal access icon)
    var btn = document.createElement('button');
    btn.id = 'a11y-btn';
    btn.setAttribute('aria-label', 'Accessibility options');
    btn.setAttribute('aria-haspopup', 'true');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="7" r="1.4" fill="currentColor" stroke="none"/><path d="M6.5 9.5c3.5 1 7.5 1 11 0"/><path d="M12 11.5v3"/><path d="M12 14.5l-2.5 4.5"/><path d="M12 14.5l2.5 4.5"/></svg>';
    document.body.appendChild(btn);

    // panel
    var panel = document.createElement('div');
    panel.id = 'a11y-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Accessibility options');
    panel.innerHTML =
      '<h2>Accessibility <button type="button" aria-label="Close">&times;</button></h2>' +
      '<label class="opt"><input type="checkbox" data-a11y="font"> Dyslexia-friendly font (OpenDyslexic)</label>' +
      '<label class="opt"><input type="checkbox" data-a11y="large"> Larger text</label>' +
      '<label class="opt"><input type="checkbox" data-a11y="spacing"> Extra letter &amp; line spacing</label>' +
      '<label class="opt"><input type="checkbox" data-a11y="calm"> Calm mode (no motion or shimmer)</label>' +
      '<label class="opt"><input type="checkbox" data-a11y="light"> Light paper theme</label>' +
      '<label class="opt"><input type="checkbox" data-a11y="ruler"> Reading ruler</label>' +
      '<div class="tint-row"><span>Colour filter</span>' +
      '<select data-a11y="tint">' +
      '<option value="none">None</option><option value="cream">Cream</option>' +
      '<option value="yellow">Yellow</option><option value="blue">Blue</option>' +
      '<option value="green">Green</option><option value="rose">Rose</option>' +
      '</select></div>' +
      '<button type="button" class="a11y-reset">Reset to standard site</button>';
    document.body.appendChild(panel);

    btn.addEventListener('click', function () {
      document.documentElement.classList.toggle('a11y-panel-open');
    });
    panel.querySelector('h2 button').addEventListener('click', function () {
      document.documentElement.classList.remove('a11y-panel-open');
    });
    panel.addEventListener('change', function (e) {
      var k = e.target.getAttribute('data-a11y');
      if (!k) return;
      if (k === 'tint') settings.tint = e.target.value;
      else settings[k] = e.target.checked;
      apply();
    });
    panel.querySelector('.a11y-reset').addEventListener('click', function () {
      settings = Object.assign({}, defaults);
      apply();
    });

    // "Accessible version" entry points (e.g. the homepage button):
    // enable a sensible dyslexia-friendly preset and open the panel to fine-tune.
    document.querySelectorAll('[data-a11y-open]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        settings.font = true;
        settings.spacing = true;
        settings.calm = true;
        apply();
        document.documentElement.classList.add('a11y-panel-open');
        var p = document.getElementById('a11y-panel');
        if (p) p.scrollIntoView({ block: 'nearest' });
      });
    });

    syncPanel();
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildUI();
    apply();
  });

  // apply classes as early as possible to avoid a flash of unstyled preference
  if (settings.font) ensureFont();
  var h = document.documentElement;
  if (settings.font) h.classList.add('a11y-font');
  if (settings.large) h.classList.add('a11y-large');
  if (settings.spacing) h.classList.add('a11y-spacing');
  if (settings.calm) h.classList.add('a11y-calm');
  if (settings.light) h.classList.add('a11y-light');
  if (settings.ruler) h.classList.add('a11y-ruler-on');
  if (settings.tint !== 'none') h.setAttribute('data-a11y-tint', settings.tint);
})();
