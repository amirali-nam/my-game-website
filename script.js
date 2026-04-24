// =============================================
//   GAMING MEMORIES SITE — script.js
//   Theme Switcher + Animations + Effects
// =============================================

(function () {
  'use strict';

  // ---- Elements ----
  const body         = document.body;
  const slider       = document.getElementById('themeSlider');
  const overlay      = document.getElementById('transitionOverlay');
  const labelSH      = document.getElementById('labelSH');
  const labelCR      = document.getElementById('labelCR');
  const siteTitle    = document.getElementById('siteTitle');
  const siteSubtitle = document.getElementById('siteSubtitle');

  // ---- Theme State ----
  let currentTheme = 'silenthill'; // default

  // =============================================
  //   THEME DATA
  // =============================================
  const themes = {
    silenthill: {
      bodyClass:  'theme-silenthill',
      title:      'Gaming Memories',
      subtitle:   'where fog meets darkness',
      labelActive: 'labelSH',
    },
    crysis: {
      bodyClass:  'theme-crysis',
      title:      'Gaming Memories',
      subtitle:   'maximum strength. maximum speed.',
      labelActive: 'labelCR',
    }
  };

  // =============================================
  //   SWITCH THEME FUNCTION
  // =============================================
  function switchTheme() {
    const next = currentTheme === 'silenthill' ? 'crysis' : 'silenthill';
    const data = themes[next];

    // 1. Flash overlay
    overlay.classList.add('active');

    setTimeout(() => {
      // 2. Swap body class
      body.classList.remove('theme-silenthill', 'theme-crysis');
      body.classList.add(data.bodyClass);

      // 3. Update labels
      labelSH.classList.toggle('active', next === 'silenthill');
      labelCR.classList.toggle('active', next === 'crysis');

      // 4. Update subtitle
      if (siteSubtitle) siteSubtitle.textContent = data.subtitle;

      // 5. Update aria
      slider.setAttribute('aria-checked', next === 'crysis' ? 'true' : 'false');

      // 6. Play sound feedback (silent / visual only)
      currentTheme = next;
    }, 150);

    setTimeout(() => {
      overlay.classList.remove('active');
    }, 600);
  }

  // =============================================
  //   SLIDER EVENTS
  // =============================================

  // Click
  slider.addEventListener('click', switchTheme);

  // Keyboard (Space / Enter)
  slider.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      switchTheme();
    }
  });

  // Touch swipe on slider
  let touchStartX = 0;
  slider.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  slider.addEventListener('touchend', function (e) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 20) {
      const wantCrysis = dx > 0;
      if (wantCrysis && currentTheme !== 'crysis') switchTheme();
      if (!wantCrysis && currentTheme !== 'silenthill') switchTheme();
    }
  }, { passive: true });

  // =============================================
  //   SCROLL REVEAL
  // =============================================
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });

  // =============================================
  //   RATING BARS ANIMATE ON SCROLL
  // =============================================
  const ratingBars = document.querySelectorAll('.rating-bar-fill');

  // Store original widths & reset to 0
  ratingBars.forEach(function (bar) {
    bar._targetWidth = bar.style.width;
    bar.style.width = '0%';
  });

  const ratingObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const bars = entry.target.querySelectorAll('.rating-bar-fill');
          bars.forEach(function (b, i) {
            setTimeout(function () {
              b.style.width = b._targetWidth;
            }, i * 120);
          });
          ratingObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll('.game-rating').forEach(function (el) {
    ratingObserver.observe(el);
  });

  // =============================================
  //   CURSOR GLOW EFFECT (Desktop only)
  // =============================================
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.id = 'cursor-glow';
    cursor.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
      transition: opacity 0.3s;
      opacity: 0;
    `;
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;
    let rafId;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', function () {
      cursor.style.opacity = '0';
    });

    function animateCursor() {
      curX += (mouseX - curX) * 0.08;
      curY += (mouseY - curY) * 0.08;
      cursor.style.left = curX + 'px';
      cursor.style.top  = curY + 'px';
      rafId = requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // =============================================
  //   MEMORY CARD TILT (subtle, on hover)
  // =============================================
  document.querySelectorAll('.memory-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  // =============================================
  //   SILENT HILL: RADIO STATIC SOUND EFFECT
  //   (Visual only — flicker effect on SH sections)
  // =============================================
  function randomFlicker() {
    if (currentTheme !== 'silenthill') return;

    const shSections = document.querySelectorAll('#silenthill .memory-card');
    if (shSections.length === 0) return;

    const randomCard = shSections[Math.floor(Math.random() * shSections.length)];
    const originalFilter = randomCard.style.filter;
    randomCard.style.filter = 'brightness(1.3) saturate(0)';

    setTimeout(function () {
      randomCard.style.filter = originalFilter;
    }, 80);
  }

  setInterval(function () {
    if (Math.random() < 0.3) randomFlicker();
  }, 5000);

  // =============================================
  //   CRYSIS: SCANLINE EFFECT ON HOVER
  // =============================================
  document.querySelectorAll('#crysis .memory-card').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      if (currentTheme !== 'crysis') return;
      card.style.backgroundImage =
        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.02) 2px, rgba(0,229,255,0.02) 4px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.backgroundImage = '';
    });
  });

  // =============================================
  //   NAV: ACTIVE LINK HIGHLIGHT ON SCROLL
  // =============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('nav a');

  const navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.style.color = '';
          });
          const active = document.querySelector('nav a[href="#' + entry.target.id + '"]');
          if (active) {
            active.style.color = 'var(--accent)';
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach(function (s) { navObserver.observe(s); });

  // =============================================
  //   INIT MESSAGE
  // =============================================
  console.log('%c🎮 Gaming Memories Site Loaded', 'font-size:16px; color:#c8b89a;');
  console.log('%cSwitch theme with the slider — Silent Hill ↔ Crysis', 'color:#888;');

})();
