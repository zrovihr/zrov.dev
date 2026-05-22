(function () {
  var labels = document.querySelectorAll('.dossier-label');
  for (var i = 0; i < labels.length; i++) {
    labels[i].addEventListener('click', function () {
      this.parentElement.classList.toggle('dossier-block--collapsed');
    });
  }

  var entries = document.querySelectorAll('.dossier-entry-main');
  function toggleEntry(entryMain) {
    var entry = entryMain.parentElement;
    var isExpanded = entry.classList.toggle('dossier-entry--expanded');
    entryMain.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  }

  for (var j = 0; j < entries.length; j++) {
    entries[j].addEventListener('click', function () {
      toggleEntry(this);
    });
    entries[j].addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleEntry(this);
      }
    });
  }
})();