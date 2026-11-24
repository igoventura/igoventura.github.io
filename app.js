/* ============================================================
   Portfolio enhancements.
   Every block here is optional — the page is complete and
   readable with JavaScript disabled.
   ============================================================ */
(function () {
  'use strict';

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = function () { return motionQuery.matches; };

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* ---------------------------------------------------------
     1. Toast helper (used by copy-to-clipboard)
     --------------------------------------------------------- */
  var toastEl = $('#toast');
  var toastTimer = null;

  function toast(message) {
    if (!toastEl) { return; }
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 1900);
  }

  /* ---------------------------------------------------------
     2. Mobile nav
     --------------------------------------------------------- */
  (function nav() {
    var toggle = $('.nav-toggle');
    var menu = $('#nav-menu');
    if (!toggle || !menu) { return; }

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.classList.toggle('is-open', open);
      var label = $('.nav-toggle-text', toggle);
      if (label) { label.textContent = open ? 'close' : 'menu'; }
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close after choosing a destination.
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) { setOpen(false); }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { setOpen(false); }
    });

    // Reset drawer state when crossing the desktop breakpoint.
    var desktop = window.matchMedia('(min-width: 720px)');
    var onChange = function (e) { if (e.matches) { setOpen(false); } };
    if (desktop.addEventListener) { desktop.addEventListener('change', onChange); }
    else if (desktop.addListener) { desktop.addListener(onChange); }
  }());

  /* ---------------------------------------------------------
     3. Scroll-spy: underline the nav link for the section
        currently under the header.
     --------------------------------------------------------- */
  (function scrollSpy() {
    var links = $$('.nav-menu a[href^="#"]');
    if (!links.length) { return; }

    var targets = links
      .map(function (link) {
        var el = document.querySelector(link.getAttribute('href'));
        // Skip sections that are hidden — the env flag can take a whole
        // section out of the page (styles.css §23), and a display:none
        // target has no offsetTop to track.
        if (!el || el.offsetParent === null) { return null; }
        return { link: link, el: el };
      })
      .filter(Boolean);

    if (!targets.length) { return; }

    var current = null;
    var ticking = false;

    function update() {
      ticking = false;
      var probe = window.scrollY + window.innerHeight * 0.28;
      var found = null;

      for (var i = 0; i < targets.length; i++) {
        if (targets[i].el.offsetTop <= probe) { found = targets[i]; }
      }

      // Nothing scrolled past yet — treat the top of the page as home.
      if (window.scrollY < 120) { found = null; }

      if (found === current) { return; }
      if (current) { current.link.classList.remove('is-current'); }
      current = found;
      if (current) { current.link.classList.add('is-current'); }
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }());

  /* ---------------------------------------------------------
     4. Scroll reveal, staggered per group
     --------------------------------------------------------- */
  (function reveal() {
    var items = $$('.reveal');
    if (!items.length) { return; }

    if (reduced() || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    // Stagger siblings so grids cascade in instead of popping all at once.
    var groups = {};
    items.forEach(function (el) {
      var key = el.parentNode;
      groups[key] = groups[key] || [];
      var index = groups[key].push(el) - 1;
      el.style.transitionDelay = Math.min(index * 70, 350) + 'ms';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { observer.observe(el); });
  }());

  /* ---------------------------------------------------------
     5. Stat counters.
        The real number already lives in the HTML, so the stats
        are correct without JS — this only animates up to it.
     --------------------------------------------------------- */
  (function counters() {
    var nodes = $$('[data-count]');
    if (!nodes.length) { return; }

    function render(el, value) {
      var fmt = el.getAttribute('data-format');
      var suffix = el.getAttribute('data-suffix') || '';
      var text;
      if (fmt === 'k') {
        text = (value / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
      } else {
        text = String(value);
      }
      el.textContent = text + suffix;
    }

    function run(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      if (isNaN(target)) { return; }

      if (reduced()) { render(el, target); return; }

      var duration = 1200;
      var start = null;

      function frame(now) {
        if (start === null) { start = now; }
        var t = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);          // easeOutCubic
        render(el, Math.round(target * eased));
        if (t < 1) { window.requestAnimationFrame(frame); }
        else { render(el, target); }
      }
      window.requestAnimationFrame(frame);
    }

    if (!('IntersectionObserver' in window)) {
      nodes.forEach(run);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        run(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    nodes.forEach(function (el) { observer.observe(el); });
  }());

  /* ---------------------------------------------------------
     6. Hero typewriter.
        Edits: change the roles array below.
     --------------------------------------------------------- */
  (function typewriter() {
    var el = $('#typewriter');
    if (!el) { return; }

    var roles = [
      '.NET & Go',
      'Kotlin & Android',
      'Angular & React',
      'gRPC contracts'
    ];

    if (reduced() || roles.length < 2) {
      el.textContent = roles[0];
      return;
    }

    var roleIndex = 0;
    var charIndex = roles[0].length;
    var deleting = false;
    var pause = 0;

    function tick() {
      var word = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        if (charIndex >= word.length) {
          charIndex = word.length;
          deleting = true;
          pause = 1900;
        }
      } else {
        charIndex--;
        if (charIndex <= 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          pause = 320;
        }
      }

      el.textContent = word.slice(0, charIndex);
      setTimeout(tick, pause || (deleting ? 34 : 62));
      pause = 0;
    }

    setTimeout(tick, 1600);
  }());

  /* ---------------------------------------------------------
     7. Copy-to-clipboard
     --------------------------------------------------------- */
  (function copyButtons() {
    $$('[data-copy]').forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-copy');

        var done = function () {
          button.classList.add('is-done');
          toast('copied  ' + value);
          setTimeout(function () { button.classList.remove('is-done'); }, 1600);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(done, function () {
            legacyCopy(value, done);
          });
        } else {
          legacyCopy(value, done);
        }
      });
    });

    // Fallback for non-secure contexts (file://, plain http).
    function legacyCopy(value, done) {
      var field = document.createElement('textarea');
      field.value = value;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand('copy');
        done();
      } catch (err) {
        toast('copy failed — ' + value);
      }
      document.body.removeChild(field);
    }
  }());

  /* ---------------------------------------------------------
     8. Back to top
     --------------------------------------------------------- */
  (function backToTop() {
    var button = $('#to-top');
    if (!button) { return; }

    var ticking = false;
    function update() {
      ticking = false;
      button.classList.toggle('is-visible', window.scrollY > window.innerHeight * 1.2);
    }

    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
    });

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }());

  /* ---------------------------------------------------------
     9. Footer year
     --------------------------------------------------------- */
  var year = $('#year');
  if (year) { year.textContent = String(new Date().getFullYear()); }

}());
