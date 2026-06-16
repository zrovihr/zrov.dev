// ai-learn.js — unlock system, progress bar, scroll, and the interactive layer
// (celebration confetti, friendly toasts, next-level nudge, keyboard nav).
// All UI it needs is injected from here so index.html/styles.css stay untouched.
(function () {
  'use strict';

  var STORAGE_KEY = 'ai-learn-progress';
  var SCROLL_KEY = 'ai-learn-scroll';
  var totalLevels = 7;
  var i18n = window.AiLearnI18n || null;

  var reduceMotion = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── friendly, plain-language strings (bilingual, with fallbacks) ──────────
  // i18n.js only knows a handful of keys; everything new lives here so the JS
  // stays self-contained. We pick the lang the same way i18n does.
  var COPY = {
    id: {
      done1: 'Mantap! Level kelar ✅',
      doneNext: 'Keren — Level berikutnya kebuka 🔓',
      allDone: 'Selesai semua! Kamu udah lewatin 7 level 🎉',
      hintKeys: 'Tip: pakai tombol J / K buat lompat antar level, Enter buat tandai selesai.',
      resetDone: 'Oke, mulai lagi dari nol. Semangat!'
    },
    en: {
      done1: 'Nice! Level done ✅',
      doneNext: 'Great — the next level just unlocked 🔓',
      allDone: 'All done! You cleared all 7 levels 🎉',
      hintKeys: 'Tip: press J / K to hop between levels, Enter to mark one complete.',
      resetDone: "Alright, back to the start. You've got this!"
    }
  };

  function lang() {
    return (i18n && i18n.getLang && i18n.getLang()) || document.documentElement.lang || 'id';
  }

  function say(key) {
    var L = COPY[lang()] || COPY.id;
    return L[key] || (COPY.id[key] || key);
  }

  // ── progress storage ──────────────────────────────────────────────────────
  function getProgress() {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10) || 0;
    } catch (_) { return 0; }
  }

  function setProgress(n) {
    try {
      localStorage.setItem(STORAGE_KEY, Math.min(totalLevels, Math.max(0, n)));
    } catch (_) {}
  }

  // ── smooth scroll ──────────────────────────────────────────────────────────
  // Some browsers (and OS "reduce animations") quietly ignore
  // scrollIntoView({behavior:'smooth'}) and hard-jump instead. We animate the
  // scroll ourselves with rAF so the glide is actually visible, then run `done`
  // once we've arrived. Under reduced-motion we jump instantly (no animation).
  function smoothScrollToEl(el, duration, done) {
    if (!el) { if (done) done(); return; }
    var rect = el.getBoundingClientRect();
    var startY = window.scrollY || window.pageYOffset || 0;
    // center the element in the viewport
    var targetY = startY + rect.top - (window.innerHeight - rect.height) / 2;
    var maxY = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
    targetY = Math.max(0, Math.min(targetY, maxY));
    var dist = targetY - startY;

    if (reduceMotion || Math.abs(dist) < 4 || duration <= 0) {
      window.scrollTo(0, targetY);
      if (done) done();
      return;
    }

    var startT = null;
    function easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
    function step(now) {
      if (startT === null) startT = now;
      var p = Math.min(1, (now - startT) / duration);
      window.scrollTo(0, startY + dist * easeInOutQuad(p));
      if (p < 1) {
        requestAnimationFrame(step);
      } else if (done) {
        done();
      }
    }
    requestAnimationFrame(step);
  }

  // ── one-time injected styles for the interactive bits ─────────────────────
  function injectStyles() {
    if (document.getElementById('ai-learn-fx-styles')) return;
    var css = [
      '.ai-toast-wrap{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);',
      'display:flex;flex-direction:column;gap:8px;z-index:9999;pointer-events:none;',
      'width:max-content;max-width:90vw}',
      '.ai-toast{font-family:var(--mono,monospace);font-size:13px;letter-spacing:.02em;',
      'background:var(--card,#0f140f);color:var(--ink,#e8f5e8);',
      'border:1px solid var(--accent,#4ade80);border-radius:4px;padding:10px 16px;',
      'box-shadow:0 6px 24px rgba(0,0,0,.45);opacity:0;transform:translateY(12px);',
      'transition:opacity .3s ease,transform .3s ease;text-align:center}',
      '.ai-toast.show{opacity:1;transform:translateY(0)}',
      '.level-card.just-unlocked{animation:aiPulse 1.1s ease 1}',
      '@keyframes aiPulse{0%{box-shadow:0 0 0 0 rgba(74,222,128,.55)}',
      '55%{box-shadow:0 0 0 8px rgba(74,222,128,0)}100%{box-shadow:0 0 0 0 rgba(74,222,128,0)}}',
      '.level-card.kb-focus{outline:2px solid var(--accent,#4ade80);outline-offset:4px}',
      '.ai-confetti{position:fixed;top:-12px;width:9px;height:9px;z-index:9998;',
      'pointer-events:none;border-radius:1px;will-change:transform,opacity}'
    ].join('');
    var el = document.createElement('style');
    el.id = 'ai-learn-fx-styles';
    el.textContent = css;
    document.head.appendChild(el);
  }

  // ── toast ─────────────────────────────────────────────────────────────────
  var toastWrap = null;
  function toast(message, ms) {
    if (!message) return;
    if (!toastWrap) {
      toastWrap = document.createElement('div');
      toastWrap.className = 'ai-toast-wrap';
      toastWrap.setAttribute('role', 'status');
      toastWrap.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastWrap);
    }
    var t = document.createElement('div');
    t.className = 'ai-toast';
    t.textContent = message;
    toastWrap.appendChild(t);
    // force reflow so the transition runs
    void t.offsetWidth;
    t.classList.add('show');
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 320);
    }, ms || 2600);
  }

  // ── confetti (tiny, dependency-free) ──────────────────────────────────────
  // A one-shot burst is not the kind of sustained motion prefers-reduced-motion
  // targets, so it still fires — just calmer (fewer pieces, no spin, straight
  // fall) when the user has asked to reduce motion.
  function celebrate(big) {
    if (typeof document.body.animate !== 'function' && typeof Element.prototype.animate !== 'function') return;
    var colors = ['#4ade80', '#a8e6a8', '#ffe066', '#ff6b6b', '#7ad7ff'];
    var count = reduceMotion ? (big ? 24 : 12) : (big ? 90 : 36);
    for (var i = 0; i < count; i++) {
      (function (i) {
        var c = document.createElement('div');
        c.className = 'ai-confetti';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.background = colors[i % colors.length];
        c.style.opacity = '1';
        document.body.appendChild(c);
        var driftX = reduceMotion ? 0 : (Math.random() - 0.5) * 240;
        var fall = window.innerHeight + 40;
        var dur = (reduceMotion ? 1100 : 1400) + Math.random() * (reduceMotion ? 400 : 1200);
        var rot = reduceMotion ? 0 : (Math.random() - 0.5) * 720;
        var anim = c.animate(
          [
            { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
            { transform: 'translate(' + driftX + 'px,' + fall + 'px) rotate(' + rot + 'deg)', opacity: 0 }
          ],
          { duration: dur, easing: 'cubic-bezier(.2,.6,.4,1)', delay: Math.random() * (big ? 250 : 120) }
        );
        anim.onfinish = function () { if (c.parentNode) c.parentNode.removeChild(c); };
      })(i);
    }
  }

  // ── core UI sync ──────────────────────────────────────────────────────────
  function updateUI(progress) {
    for (var i = 1; i <= totalLevels; i++) {
      var card = document.getElementById('level-' + i);
      if (!card) continue;
      card.classList.remove('locked', 'unlocked', 'completed', 'fade-in');
      if (i <= progress) {
        card.classList.add('completed');
      } else if (i === progress + 1) {
        card.classList.add('unlocked');
      } else {
        card.classList.add('locked');
      }
    }

    var fill = document.getElementById('progress-fill');
    var label = document.getElementById('progress-label');
    if (fill) fill.style.width = (progress / totalLevels * 100) + '%';
    if (label) {
      label.textContent = i18n
        ? i18n.formatProgress(progress, totalLevels)
        : progress + ' / ' + totalLevels + ' selesai';
    }

    var outro = document.getElementById('outro');
    if (outro) outro.hidden = progress < totalLevels;
  }

  // ── unlocking a level ─────────────────────────────────────────────────────
  function unlockLevel(level) {
    var progress = getProgress();
    if (level !== progress + 1) return;
    setProgress(level);
    updateUI(level);

    var finished = level >= totalLevels;
    toast(finished ? say('allDone') : (level + 1 <= totalLevels ? say('doneNext') : say('done1')));

    var target = finished
      ? document.getElementById('outro')
      : document.getElementById('level-' + (level + 1));

    // Glide to the target FIRST (real animated scroll — see smoothScrollToEl),
    // then on arrival pulse the card and drop the confetti. The confetti is
    // viewport-fixed, so it must land on a stationary view or it reads as "boxes
    // flying past" while the page is still moving.
    function onArrive() {
      if (target && target.classList) {
        target.classList.add('just-unlocked');
        setTimeout(function () { target.classList.remove('just-unlocked'); }, 1200);
      }
      celebrate(finished);
    }

    if (target) {
      smoothScrollToEl(target, 600, onArrive);
    } else {
      onArrive();
    }
  }

  // ── keyboard navigation (J/K or ↓/↑ to move, Enter to complete) ───────────
  var kbCard = null;
  function navigableCards() {
    return Array.prototype.slice.call(
      document.querySelectorAll('.level-card.unlocked, .level-card.completed')
    );
  }
  function setKbFocus(card) {
    if (kbCard) kbCard.classList.remove('kb-focus');
    kbCard = card;
    if (kbCard) {
      kbCard.classList.add('kb-focus');
      kbCard.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }
  }
  function moveKb(delta) {
    var cards = navigableCards();
    if (!cards.length) return;
    var idx = kbCard ? cards.indexOf(kbCard) : -1;
    idx = Math.max(0, Math.min(cards.length - 1, idx + delta));
    setKbFocus(cards[idx]);
  }
  function handleKey(e) {
    // don't hijack typing in inputs or when modifier keys are held
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    var k = e.key;
    if (k === 'j' || k === 'J' || k === 'ArrowDown') {
      e.preventDefault(); moveKb(1);
    } else if (k === 'k' || k === 'K' || k === 'ArrowUp') {
      e.preventDefault(); moveKb(-1);
    } else if (k === 'Enter' && kbCard && kbCard.classList.contains('unlocked')) {
      var btn = kbCard.querySelector('.complete-btn');
      if (btn) { e.preventDefault(); btn.click(); }
    }
  }

  // ── click: mark a level complete ──────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.complete-btn');
    if (!btn) return;
    var level = parseInt(btn.getAttribute('data-level'), 10);
    if (level) unlockLevel(level);
  });

  // ── reset ─────────────────────────────────────────────────────────────────
  var resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      var message = i18n
        ? i18n.t('resetConfirm')
        : 'Yakin mau ulang progress dari awal? Semua level akan terkunci lagi.';
      if (confirm(message)) {
        setProgress(0);
        updateUI(0);
        setKbFocus(null);
        toast(say('resetDone'));
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  }

  // ── hero CTA: jump to wherever the learner is ─────────────────────────────
  var heroBtn = document.getElementById('hero-cta');
  if (heroBtn) {
    heroBtn.addEventListener('click', function () {
      var target = document.querySelector('.level-card.unlocked')
        || document.getElementById('outro')
        || document.getElementById('level-1');
      if (target) {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        setKbFocus(target.classList.contains('level-card') ? target : null);
      }
    });
  }

  // ── remember scroll position across visits ────────────────────────────────
  function saveScroll() {
    try { sessionStorage.setItem(SCROLL_KEY, String(window.scrollY || 0)); } catch (_) {}
  }
  function restoreScroll() {
    try {
      var y = parseInt(sessionStorage.getItem(SCROLL_KEY) || '0', 10);
      if (y > 0) window.scrollTo(0, y);
    } catch (_) {}
  }
  window.addEventListener('beforeunload', saveScroll);

  // re-sync labels when language flips
  document.addEventListener('ai-learn-langchange', function () {
    updateUI(getProgress());
  });

  // ── boot ──────────────────────────────────────────────────────────────────
  injectStyles();
  document.addEventListener('keydown', handleKey);
  updateUI(getProgress());
  restoreScroll();

  // gentle one-time hint about keyboard nav (only for fresh learners)
  if (getProgress() === 0) {
    setTimeout(function () { toast(say('hintKeys'), 4200); }, 1400);
  }
})();
