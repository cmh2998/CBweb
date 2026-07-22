// The Dungeon — client-side password gate.
//
// IMPORTANT: this is a placeholder mechanism only. The "password" below is
// visible to anyone who reads this file's source, and sessionStorage can be
// edited in devtools. It keeps casual visitors out while the section is a
// placeholder, but it is NOT real access control. Before this page holds
// anything sensitive, swap this for real authentication (a login system,
// membership platform, or server-side check).
(function () {
  var PASSWORD = 'unshined18'; // change me, and remember: this is not secure
  var SESSION_KEY = 'dungeon_unlocked';

  document.addEventListener('DOMContentLoaded', function () {
    var gate = document.querySelector('.dungeon-gate');
    var content = document.querySelector('.dungeon-content');
    var form = document.querySelector('.dungeon-form');
    var error = document.querySelector('.dungeon-error');

    function unlock() {
      if (gate) gate.style.display = 'none';
      if (content) content.style.display = 'block';
    }

    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      unlock();
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="password"]');
        if (input && input.value === PASSWORD) {
          sessionStorage.setItem(SESSION_KEY, 'true');
          unlock();
        } else if (error) {
          error.style.display = 'block';
        }
      });
    }
  });
})();
