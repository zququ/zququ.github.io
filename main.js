// Simple interactions for mobile side panel and smooth anchor behavior
(function () {
  var menuBtn = document.querySelector('.btn-mobile-menu');
  var panelNav = document.querySelector('.navigation-wrapper');
  var closeIcon = document.querySelector('.btn-mobile-close__icon');

  if (!menuBtn || !panelNav) {
    return;
  }

  function toggleMenu() {
    var open = panelNav.classList.contains('visible');
    panelNav.classList.toggle('visible', !open);
    menuBtn.classList.toggle('open', !open);
  }

  menuBtn.addEventListener('click', function (e) {
    e.preventDefault();
    toggleMenu();
    closeIcon.classList.toggle('hidden', panelNav.classList.contains('visible'));
  });

  document.querySelectorAll('.navigation a, .blog-button').forEach(function (link) {
    link.addEventListener('click', function () {
      panelNav.classList.remove('visible');
      closeIcon.classList.add('hidden');
      menuBtn.classList.remove('open');
    });
  });
})();
