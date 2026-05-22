(function () {
  var glitchClass = 'postprocess-glitching';
  var duration = 600;
  var minDelay = 12000;
  var maxDelay = 22000;
  var timer = null;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cloneLayer = document.querySelector('.powerglitch-layer');
  var cloneTargets = [
    '.hero__name',
    '.hero__dossier',
    '.dossier-block',
    '.inventory-item',
    '.page-nav',
    '.hud'
  ];

  function stripCloneIds(node) {
    if (node.removeAttribute) node.removeAttribute('id');
    var children = node.querySelectorAll ? node.querySelectorAll('[id]') : [];
    for (var i = 0; i < children.length; i++) {
      children[i].removeAttribute('id');
    }
  }

  function createPowerGlitchClones() {
    if (!cloneLayer) return;
    cloneLayer.textContent = '';

    var targets = [];
    for (var i = 0; i < cloneTargets.length; i++) {
      var matches = document.querySelectorAll(cloneTargets[i]);
      for (var j = 0; j < matches.length; j++) {
        targets.push(matches[j]);
      }
    }

    for (var k = 0; k < targets.length; k++) {
      var rect = targets[k].getBoundingClientRect();
      if (rect.width < 12 || rect.height < 8 || rect.bottom < 0 || rect.top > window.innerHeight) continue;

      var variants = ['red', 'cyan', 'green'];
      for (var v = 0; v < variants.length; v++) {
        var clone = targets[k].cloneNode(true);
        stripCloneIds(clone);
        clone.classList.add('powerglitch-clone', 'powerglitch-clone--' + variants[v]);
        clone.setAttribute('aria-hidden', 'true');
        clone.style.position = 'fixed';
        clone.style.left = rect.left + 'px';
        clone.style.top = rect.top + 'px';
        clone.style.width = rect.width + 'px';
        clone.style.height = rect.height + 'px';
        clone.style.margin = '0';
        clone.style.pointerEvents = 'none';
        clone.style.animationDelay = (v * 36 + (k % 4) * 18) + 'ms';
        cloneLayer.appendChild(clone);
      }
    }
  }

  function schedulePostprocessGlitch() {
    var delay = minDelay + Math.random() * (maxDelay - minDelay);
    timer = window.setTimeout(triggerPostprocessGlitch, delay);
  }

  function triggerPostprocessGlitch() {
    if (document.body.classList.contains(glitchClass)) return;
    createPowerGlitchClones();
    document.body.classList.add(glitchClass);
    window.setTimeout(function () {
      document.body.classList.remove(glitchClass);
      if (cloneLayer) cloneLayer.textContent = '';
      schedulePostprocessGlitch();
    }, duration);
  }

  window.addEventListener('pagehide', function () {
    if (timer) window.clearTimeout(timer);
  });

  function isEditableTarget(target) {
    if (!target || target === document.body) return false;
    if (target.isContentEditable) return true;
    return /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
  }

  window.addEventListener('keydown', function (event) {
    if (isEditableTarget(event.target)) return;
    if (event.key && event.key.toLowerCase() === 'g') {
      if (timer) window.clearTimeout(timer);
      triggerPostprocessGlitch();
    }
  });

  window.setTimeout(triggerPostprocessGlitch, 700);
})();