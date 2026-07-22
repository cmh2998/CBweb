// Shared behaviour: mobile nav + dropdown toggles. Include on every page.
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.navtoggle');
  var links = document.querySelector('.navlinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // Dropdown groups: click/tap toggles (hover handles itself on desktop)
  document.querySelectorAll('.has-drop > .droplink').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var li = btn.parentElement;
      var wasOpen = li.classList.contains('open');
      document.querySelectorAll('.has-drop.open').forEach(function (d) { d.classList.remove('open'); });
      if (!wasOpen) li.classList.add('open');
    });
  });

  // Close dropdowns when clicking elsewhere
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-drop')) {
      document.querySelectorAll('.has-drop.open').forEach(function (d) { d.classList.remove('open'); });
    }
  });
});
