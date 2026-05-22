(function () {
  const el = document.getElementById('uptime');
  if (!el) return;
  const start = Date.now();
  setInterval(() => {
    const s = Math.floor((Date.now() - start) / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    el.textContent = String(d).padStart(3, '0') + 'd ' +
      String(h).padStart(2, '0') + 'h ' +
      String(m).padStart(2, '0') + 'm';
  }, 1000);
})();