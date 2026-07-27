/* wiki.js — functional datapad chrome for zrov.dev/wiki
   - reading-progress scanline (top bar)
   - TOC scroll-spy (highlights current section + violet node)
   - live status dot reflects real online/offline state
   No dependencies. Degrades gracefully without JS. */
(function () {
  "use strict";

  /* ---- reading progress scanline ---- */
  var scan = document.querySelector(".w-scan");
  var article = document.querySelector(".w-article");
  function updateScan() {
    if (!scan || !article) return;
    var rect = article.getBoundingClientRect();
    var total = rect.height - window.innerHeight;
    var scrolled = -rect.top;
    var pct = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
    scan.style.width = (pct * 100).toFixed(2) + "%";
  }

  /* ---- TOC scroll-spy ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".w-rail a[href^='#']"));
  var targets = links
    .map(function (a) {
      var el = document.getElementById(a.getAttribute("href").slice(1));
      return el ? { link: a, el: el } : null;
    })
    .filter(Boolean);

  function spy() {
    if (!targets.length) return;
    var probe = window.scrollY + window.innerHeight * 0.28;
    var current = targets[0];
    for (var i = 0; i < targets.length; i++) {
      if (targets[i].el.offsetTop <= probe) current = targets[i];
    }
    links.forEach(function (a) { a.classList.remove("is-active"); });
    current.link.classList.add("is-active");
    // keep active chip in view on the mobile horizontal rail
    if (window.matchMedia("(max-width: 900px)").matches) {
      current.link.scrollIntoView({ block: "nearest", inline: "center" });
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateScan();
      spy();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  /* ---- live status dot: reflect real connectivity ---- */
  var live = document.querySelector(".w-live");
  if (live) {
    var labelEl = live.querySelector("[data-live-label]");
    function setLive() {
      var online = navigator.onLine;
      live.style.setProperty("--state-on", online ? "1" : "0");
      if (labelEl) labelEl.textContent = online ? live.dataset.online || "live" : live.dataset.offline || "offline";
      live.style.opacity = online ? "1" : "0.5";
    }
    window.addEventListener("online", setLive);
    window.addEventListener("offline", setLive);
    setLive();
  }

  /* ---- smooth-scroll TOC clicks with header offset already in CSS ---- */
  links.forEach(function (a) {
    a.addEventListener("click", function (e) {
      var el = document.getElementById(a.getAttribute("href").slice(1));
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", a.getAttribute("href"));
    });
  });
})();
