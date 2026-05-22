(function () {
  var els = document.querySelectorAll('[data-parallax]');
  if (!els.length) return;

  function update() {
    var sy = window.scrollY;
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var sp = parseFloat(el.dataset.parallax) || 0;
      el.style.transform = 'translate3d(0,' + (sy * sp) + 'px,0)';
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () { update(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  update();
})();