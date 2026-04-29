/* ===================================
   script.js  –  Reno ArD S Portfolio
   =================================== */

/* ───────────────────────────────────
   1. CURSOR RING  (follows mouse with
      a slight lag for smooth feel)
─────────────────────────────────── */
(function initCursorRing() {
  // Create ring element if it doesn't exist yet
  if (!document.getElementById('cursor-ring')) {
    const ring = document.createElement('div');
    ring.id = 'cursor-ring';
    document.body.appendChild(ring);
  }

  let rx = window.innerWidth  / 2;
  let ry = window.innerHeight / 2;
  let mx = rx, my = ry;
  const LERP = 0.14;   // lower = more lag, more fluid

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function updateRing() {
    rx += (mx - rx) * LERP;
    ry += (my - ry) * LERP;

    const ring = document.getElementById('cursor-ring');
    if (ring) {
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
    }
    requestAnimationFrame(updateRing);
  }
  updateRing();
})();


/* ───────────────────────────────────
   2. SMOOTH SCROLL for anchor links
─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});


/* ───────────────────────────────────
   3. CARD 3-D TILT on mouse move
      Gives the glass card a subtle
      perspective tilt as you hover.
─────────────────────────────────── */
(function initCardTilt() {
  const MAX_TILT = 8;   // degrees

  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();

      // Only apply tilt when cursor is near the card
      const margin = 60;
      if (
        e.clientX < rect.left - margin || e.clientX > rect.right  + margin ||
        e.clientY < rect.top  - margin || e.clientY > rect.bottom + margin
      ) {
        // Reset tilt when cursor moves away
        card.style.transform = '';
        card.classList.remove('tilting');
        return;
      }

      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      const tiltX = -dy * MAX_TILT;
      const tiltY =  dx * MAX_TILT;

      card.classList.add('tilting');
      card.style.transform =
        `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });
  });

  // Reset all cards when cursor leaves the window
  document.addEventListener('mouseleave', () => {
    document.querySelectorAll('.card').forEach(card => {
      card.style.transform = '';
      card.classList.remove('tilting');
    });
  });
})();


/* ───────────────────────────────────
   4. ENTRANCE ANIMATION
      Cards & sections fade + slide up
      when they enter the viewport.
─────────────────────────────────── */
(function initEntranceAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    .anim-hidden {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }
    .anim-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  function observe() {
    const targets = document.querySelectorAll('.card, .about-section, .about-card');
    if (!targets.length) return;

    targets.forEach((el, i) => {
      el.classList.add('anim-hidden');
      el.style.transitionDelay = (i * 0.1) + 's';
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('anim-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach(el => io.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observe);
  } else {
    observe();
  }
})();