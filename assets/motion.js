/* Red Box Motors — shared site-wide motion layer.
   Loaded from every page's <helmet>. Provides:
   - universal [data-reveal] scroll reveals (fade + rise)
   - [data-counter] count-up numbers
   - film-grain overlay
   - nav underline delegation for a[data-nav-u] > [data-nav-bar]
   NOTE: page transitions (dissolve / swipe between pages) are intentionally
   DISABLED here — navigation is plain. The per-page intro loaders still play
   on full reloads / first visits (hidden on internal nav). Respects prefers-reduced-motion. */
(function () {
  if (window.__rbmMotion) return; window.__rbmMotion = true;
  var reduced = false;
  try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* ---------- injected keyframes + chrome ---------- */
  var st = document.createElement('style');
  st.textContent = [
    '@keyframes rbmNavIn{from{opacity:0;transform:translateY(-12px);}to{opacity:1;transform:translateY(0);}}',
    '#rbm-grain{position:fixed;inset:0;z-index:2600;pointer-events:none;opacity:0.05;mix-blend-mode:overlay;background-repeat:repeat;}'
  ].join('\n');
  document.head.appendChild(st);

  var GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  /* ---------- film grain ---------- */
  ready(function () {
    var g = document.createElement('div'); g.id = 'rbm-grain';
    g.style.backgroundImage = GRAIN;
    document.body.appendChild(g);
  });

  /* ---------- universal reveals + counters (viewport-rooted IO works inside nested scrollers) ---------- */
  var io = null;
  try {
    io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target; io.unobserve(el);
        if (el.hasAttribute('data-counter')) runCounter(el);
        else { el.style.opacity = '1'; el.style.transform = 'none'; }
      });
    }, { threshold: 0.1 });
  } catch (e) {}

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-counter'));
    if (isNaN(target) || reduced) return;
    var pad = parseInt(el.getAttribute('data-pad') || '0', 10);
    var t0 = null, dur = 900;
    function fmt(v) { var s = String(Math.round(v)); while (s.length < pad) s = '0' + s; return s; }
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- observe streamed-in reveal/counter elements ---------- */
  function scan() {
    if (!io) return;
    var els = document.querySelectorAll('[data-reveal],[data-counter]');
    for (var i = 0; i < els.length; i++) {
      if (!els[i].__rbmIO) { els[i].__rbmIO = 1; io.observe(els[i]); }
    }
  }
  ready(function () {
    scan();
    var n = 0;
    var iv = setInterval(function () { scan(); if (++n > 14) clearInterval(iv); }, 600);
  });

  /* ---------- nav underline: red bar sweeps in from the left, exits right ---------- */
  function bar(a) { return a ? a.querySelector('[data-nav-bar]') : null; }
  document.addEventListener('mouseover', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[data-nav-u]') : null;
    if (!a || (e.relatedTarget && a.contains(e.relatedTarget))) return;
    var b = bar(a); if (!b || b.getAttribute('data-active') === '1') return;
    b.style.transformOrigin = 'left center';
    b.style.transform = 'scaleX(1)';
  });
  document.addEventListener('mouseout', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[data-nav-u]') : null;
    if (!a || (e.relatedTarget && a.contains(e.relatedTarget))) return;
    var b = bar(a); if (!b || b.getAttribute('data-active') === '1') return;
    b.style.transformOrigin = 'right center';
    b.style.transform = 'scaleX(0)';
  });
})();
