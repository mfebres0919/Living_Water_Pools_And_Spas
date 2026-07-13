/* ══════════════════════════════════════════════════════════════
   E-Pools & Construction — main.js
   • Sticky header state on scroll
   • Mobile menu toggle
   • Hero background carousel (crossfade + synced dots)
   • Gallery Reels / Photos tabs
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Sticky header ───────────────────────────── */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ─────────────────────────────── */
  var toggle = document.getElementById('navToggle');
  var menu   = document.getElementById('mobileMenu');
  if (toggle && menu) {
    function closeMenu() {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    }
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ── Hero background carousel ─────────────────── */
  (function heroCarousel() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('#hero .hero-slide'));
    var dots   = Array.prototype.slice.call(document.querySelectorAll('#hero .hero-dot'));
    if (slides.length < 2) return;

    var INTERVAL = 5500;
    var current  = 0;
    var timer    = null;
    var reduce   = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function go(i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, idx) { s.classList.toggle('is-active', idx === current); });
      dots.forEach(function (d, idx) { d.classList.toggle('is-active', idx === current); });
    }
    function next()    { go(current + 1); }
    function start()   { if (!reduce && timer === null) timer = window.setInterval(next, INTERVAL); }
    function stop()    { if (timer !== null) { window.clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    dots.forEach(function (d, idx) {
      d.addEventListener('click', function () { go(idx); restart(); });
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    start();
  })();

  /* ── Gallery Reels / Photos tabs ─────────────── */
  (function galleryTabs() {
    var tabs   = Array.prototype.slice.call(document.querySelectorAll('.tabs .tab'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.tab-panel'));
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var targetId = tab.getAttribute('aria-controls');

        tabs.forEach(function (t) {
          var active = t === tab;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        panels.forEach(function (p) {
          var active = p.id === targetId;
          p.classList.toggle('is-active', active);
          if (active) p.removeAttribute('hidden');
          else p.setAttribute('hidden', '');
        });
      });
    });
  })();

})();
