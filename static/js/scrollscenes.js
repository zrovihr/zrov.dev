// SCROLL SCENES v3 — fixed-stage scrollytelling for the dossier page.
// per Zan: "it should not scroll the page at all it should replace elements
// only" + "the black fade should not be skippable or accelerated by the
// scroll speed."
// The stage (main) is position:fixed and NEVER moves. A hidden spacer
// (#sceneDriver) gives the document its scroll height; the scroll position
// only SELECTS the target scene. Swaps are played by a TIME-based state
// machine: fade to black (fixed duration), swap at full black, fade out.
// Scroll speed cannot shorten or skip the cut — racing through five scenes
// yields one cut to the final target. Content taller than the stage is
// scrubbed through mid-scene. Desktop only; small screens and
// prefers-reduced-motion keep the normal document flow.
(function () {
  'use strict';

  var scenes = [].slice.call(document.querySelectorAll('.scene'));
  if (!scenes.length) return;
  var fade = document.getElementById('sceneFade');
  var rail = document.getElementById('sceneRail');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var N = scenes.length;

  var IN_S = 0.20, OUT_S = 0.28; // cut timing, seconds — fixed, not scroll-driven

  var items = scenes.map(function (el) {
    return { el: el, inner: el.querySelector('.scene__inner'), scrub: 0, start: 0, len: 1 };
  });

  // scrollbar driver: invisible in-flow spacer; the fixed stage covers it
  var driver = document.createElement('div');
  driver.id = 'sceneDriver';
  driver.setAttribute('aria-hidden', 'true');
  driver.style.cssText = 'pointer-events:none;visibility:hidden;height:0;';
  document.body.appendChild(driver);

  items.forEach(function (it, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = String(i + 1).padStart(2, '0') + ' ' + (it.el.dataset.scene || '');
    b.addEventListener('click', function () {
      window.scrollTo({ top: it.start + Math.min(it.len * 0.5, window.innerHeight * 0.4), behavior: 'smooth' });
    });
    rail.appendChild(b);
    it.btn = b;
  });

  var enabled = false, loadT = 0;
  var displayed = 0, state = 'idle', black = 0;

  function shouldEnable() {
    return !reduced && window.innerWidth >= 900 && window.innerHeight >= 560;
  }

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function smooth(p, a, b) {
    var t = clamp((p - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function layout() {
    var stageH = items[0].el.clientHeight; // grid-stretched to the stage
    var pos = 0;
    items.forEach(function (it, i) {
      it.scrub = Math.max(0, it.inner.offsetHeight - stageH);
      // tall content scrubs from its top; centering would clip its head
      it.el.style.alignItems = it.scrub > 0 ? 'flex-start' : '';
      // scroll length per scene: ~1 viewport + room to scrub tall content;
      // the last scene gets a shorter rest segment
      it.len = window.innerHeight * (i === N - 1 ? 0.5 : 1.0) + it.scrub;
      it.start = pos;
      pos += it.len;
    });
    // exact height: max scroll is the end of the last scene, so there is
    // nothing to scroll past the film's end
    driver.style.height = (pos + window.innerHeight) + 'px';
  }

  function teardown() {
    driver.style.height = '0';
    items.forEach(function (it) {
      it.el.style.opacity = '';
      it.el.style.alignItems = '';
      it.el.classList.remove('is-active');
      it.inner.style.transform = '';
    });
    if (fade) fade.style.opacity = '0';
  }

  function update(dt) {
    var sc = window.scrollY || 0;

    // scroll selects the target scene; 24px hysteresis so boundary jitter
    // can't machine-gun the cut
    var target = 0;
    for (var i = 0; i < N; i++) {
      if (sc >= items[i].start) target = i;
    }
    if (target !== displayed && Math.abs(sc - items[target].start) < 24 &&
      Math.abs(sc - (items[displayed].start + items[displayed].len)) < 24) {
      target = displayed;
    }

    // timed cut: scroll speed cannot accelerate or skip it
    if (state === 'idle' && target !== displayed) state = 'in';
    if (state === 'in') {
      black = Math.min(1, black + dt / IN_S);
      if (black === 1) { displayed = target; state = 'out'; }
    } else if (state === 'out') {
      if (target !== displayed) {
        state = 'in'; // re-cut from current darkness, still at fixed speed
      } else {
        black = Math.max(0, black - dt / OUT_S);
        if (black === 0) state = 'idle';
      }
    }

    items.forEach(function (it, i) {
      var on = i === displayed;
      it.el.style.opacity = on ? '1' : '0';
      it.el.classList.toggle('is-active', on);
      it.btn.classList.toggle('is-active', on);
      if (on && it.scrub > 0) {
        var p = clamp((sc - it.start) / it.len, 0, 1);
        it.inner.style.transform =
          'translateY(' + (-it.scrub * smooth(p, 0.15, 0.85)).toFixed(1) + 'px)';
      } else if (on) {
        it.inner.style.transform = '';
      }
    });

    if (fade) {
      var boot = loadT < 1 ? 1 - smooth(loadT, 0.15, 1) : 0;
      fade.style.opacity = Math.max(black, boot).toFixed(3);
    }
  }

  var prevT = 0;
  function tick(now) {
    if (!enabled) return;
    var dt = prevT ? Math.min(0.1, (now - prevT) / 1000) : 0.016;
    prevT = now;
    loadT += dt;
    update(dt);
    requestAnimationFrame(tick);
  }

  var started = false;
  function apply() {
    var want = shouldEnable();
    if (want && !enabled) {
      enabled = true;
      document.body.classList.add('scenes-on');
      layout();
      // browsers restore the old scroll position on reload — the film must
      // always open on scene 1
      if (!started && !location.hash) {
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
      }
      started = true;
      loadT = 0; prevT = 0;
      requestAnimationFrame(tick);
    } else if (!want && enabled) {
      enabled = false;
      document.body.classList.remove('scenes-on');
      teardown();
    } else if (enabled) {
      layout();
    }
  }

  window.addEventListener('resize', apply);
  window.addEventListener('load', function () { if (enabled) layout(); });
  // expanding dossier entries changes content height — re-measure
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(function () { if (enabled) layout(); });
    items.forEach(function (it) { ro.observe(it.inner); });
  }

  apply();
})();
