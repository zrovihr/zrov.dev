// ai-learn.js — unlock system, progress bar, scroll
(function () {
  'use strict';

  var STORAGE_KEY = 'ai-learn-progress';
  var totalLevels = 7;
  var i18n = window.AiLearnI18n || null;

  function getProgress() {
    return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10) || 0;
  }

  function setProgress(n) {
    localStorage.setItem(STORAGE_KEY, Math.min(totalLevels, Math.max(0, n)));
  }

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

  function unlockLevel(level) {
    var progress = getProgress();
    if (level !== progress + 1) return;
    setProgress(level);
    updateUI(level);

    var nextCard = document.getElementById('level-' + level);
    if (nextCard) {
      nextCard.classList.add('fade-in');
      setTimeout(function () {
        nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.complete-btn');
    if (!btn) return;
    var level = parseInt(btn.getAttribute('data-level'), 10);
    if (level) unlockLevel(level);
  });

  var resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      var message = i18n
        ? i18n.t('resetConfirm')
        : 'Yakin mau ulang progress dari awal? Semua level akan terkunci lagi.';
      if (confirm(message)) {
        setProgress(0);
        updateUI(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  var heroBtn = document.getElementById('hero-cta');
  if (heroBtn) {
    heroBtn.addEventListener('click', function () {
      var target = document.querySelector('.level-card.unlocked')
        || document.getElementById('outro')
        || document.getElementById('level-1');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  document.addEventListener('ai-learn-langchange', function () {
    updateUI(getProgress());
  });

  updateUI(getProgress());
})();
