(function () {
  var terminal = document.getElementById('pgpTerminal');
  if (!terminal) return;

  fetch('pgp-key.txt')
    .then(function (r) {
      if (!r.ok) return Promise.reject();
      return r.text();
    })
    .then(function (text) {
      var lines = text.trim().split('\n');
      terminal.innerHTML = '';
      lines.forEach(function (line, i) {
        var row = document.createElement('div');
        row.className = 'pgp-terminal__row';
        var ln = document.createElement('span');
        ln.className = 'pgp-terminal__ln';
        ln.textContent = String(i + 1);
        var code = document.createElement('span');
        code.className = 'pgp-terminal__code';
        code.textContent = line;
        row.appendChild(ln);
        row.appendChild(code);
        terminal.appendChild(row);
      });
      for (var j = 0; j < 2; j++) {
        var vim = document.createElement('div');
        vim.className = 'pgp-terminal__row pgp-terminal__vim';
        var vl = document.createElement('span');
        vl.className = 'pgp-terminal__ln';
        vl.textContent = '~';
        var vc = document.createElement('span');
        vc.className = 'pgp-terminal__code';
        vim.appendChild(vl);
        vim.appendChild(vc);
        terminal.appendChild(vim);
      }
    })
    .catch(function () { });
})();