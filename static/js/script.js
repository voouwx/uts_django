/* =====================================================
   RENO ArD S — PORTFOLIO  |  script.js
   File : static/js/script.js
   Note : Single-page — semua section ada di home.html
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ─────────────────────────────────────────────────────
     AMBIL SEMUA ELEMEN YANG DIBUTUHKAN
  ───────────────────────────────────────────────────── */
  const nav      = document.getElementById("nav");
  const glare    = document.getElementById("glare");
  const pill     = document.getElementById("active-pill");
  const navBtns  = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".page-section");
  const feedback = document.getElementById("form-feedback");
  const form     = document.querySelector(".contact-form");
  const mainEl   = document.getElementById("main-content");

  /* ─────────────────────────────────────────────────────
     1. PILL SLIDER
     FIX: Hitung offset relatif terhadap .nav-items (parent pill),
     bukan terhadap dokumen / parent lain.
     Ini memastikan pill selalu sejajar persis dengan tombol aktif.
  ───────────────────────────────────────────────────── */
  function movePill(btn, smooth = true) {
    if (!btn || !pill) return;

    const navItems = pill.parentElement; // .nav-items
    const navItemsRect = navItems.getBoundingClientRect();
    const btnRect      = btn.getBoundingClientRect();

    // Offset relatif ke container pill (.nav-items)
    const offsetLeft = btnRect.left - navItemsRect.left;

    if (!smooth) {
      pill.style.transition = "none";
    } else {
      pill.style.transition =
        "transform 0.5s cubic-bezier(0.34,1.2,0.64,1)," +
        "width     0.5s cubic-bezier(0.34,1.2,0.64,1)," +
        "background 0.5s ease, box-shadow 0.5s ease";
    }

    pill.style.width     = btn.offsetWidth + "px";
    // FIX: Gabungkan translateY(-50%) + translateX agar vertical center tidak tertimpa
    pill.style.transform = "translateY(-50%) translateX(" + offsetLeft + "px)";
  }

  /* ─────────────────────────────────────────────────────
     2. SET ACTIVE BUTTON
  ───────────────────────────────────────────────────── */
  function setActive(targetId) {
    navBtns.forEach((btn) => {
      if (btn.dataset.target === targetId) {
        btn.classList.add("active");
        movePill(btn);
      } else {
        btn.classList.remove("active");
      }
    });
  }

  /* ─────────────────────────────────────────────────────
     3. SMOOTH SCROLL KE SECTION
  ───────────────────────────────────────────────────── */
  function scrollTo(id) {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ─────────────────────────────────────────────────────
     4. KLIK NAVBAR → scroll + update pill
  ───────────────────────────────────────────────────── */
  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.target;
      setActive(id);
      scrollTo(id);
    });
  });

  /* ─────────────────────────────────────────────────────
     5. KLIK TOMBOL data-scroll
  ───────────────────────────────────────────────────── */
  document.querySelectorAll("[data-scroll]").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.dataset.scroll;
      scrollTo(id);
      setActive(id);
    });
  });

  /* ─────────────────────────────────────────────────────
     6. INTERSECTION OBSERVER
  ───────────────────────────────────────────────────── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      root: mainEl,
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0,
    }
  );
  sections.forEach((sec) => observer.observe(sec));

  /* ─────────────────────────────────────────────────────
     7. INIT — posisi pill pertama kali (tanpa animasi)
     FIX: Tunggu satu frame penuh agar layout selesai dirender
     sebelum menghitung posisi pill, sehingga getBoundingClientRect()
     mengembalikan nilai yang akurat.
  ───────────────────────────────────────────────────── */
  const firstActive = document.querySelector(".nav-btn.active");
  if (firstActive) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        movePill(firstActive, false);
        // Restore transition setelah posisi awal di-set
        requestAnimationFrame(() => {
          pill.style.transition = "";
        });
      });
    });
  }

  /* ─────────────────────────────────────────────────────
     8. RESIZE — rekalkulasi posisi pill
  ───────────────────────────────────────────────────── */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const active = document.querySelector(".nav-btn.active");
      if (active) movePill(active, false);
    }, 100);
  });

  /* ─────────────────────────────────────────────────────
     9. DARK / LIGHT MODE TOGGLE
  ───────────────────────────────────────────────────── */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateThemeToggleLabel(theme);
    const active = document.querySelector(".nav-btn.active");
    // Delay sedikit agar layout selesai di-reflow setelah theme change
    if (active) setTimeout(() => movePill(active), 60);
  }

  function updateThemeToggleLabel(theme) {
    const toggleLabel = document.getElementById("theme-toggle-label");
    if (!toggleLabel) return;
    toggleLabel.textContent = theme === "dark" ? "Switch to Light" : "Switch to Dark";
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  const themeBannerBtn = document.getElementById("theme-banner-btn");
  if (themeBannerBtn) {
    themeBannerBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
    themeBannerBtn.addEventListener("mouseenter", () => {
      updateThemeToggleLabel(document.documentElement.getAttribute("data-theme"));
    });
  }

  /* ─────────────────────────────────────────────────────
     10. BACKGROUND COLOR CYCLING — setiap 8 detik
  ───────────────────────────────────────────────────── */
  const PALETTES = [
    ["#ff2a5f", "#007aff", "#ff9500"],
    ["#bf5af2", "#30d158", "#ff375f"],
    ["#007aff", "#ffd60a", "#ff6b35"],
    ["#ff6b9d", "#00c2ff", "#a8ff3e"],
    ["#5e5ce6", "#ff9f0a", "#30d158"],
    ["#ff3b30", "#34aadc", "#ffcc02"],
  ];
  let paletteIdx = 0;

  function cyclePalette() {
    paletteIdx = (paletteIdx + 1) % PALETTES.length;
    const [c1, c2, c3] = PALETTES[paletteIdx];
    const root = document.documentElement;
    root.style.setProperty("--blob-1", c1);
    root.style.setProperty("--blob-2", c2);
    root.style.setProperty("--blob-3", c3);
  }
  setInterval(cyclePalette, 8000);

  /* ─────────────────────────────────────────────────────
     11. GLARE EFFECT
     FIX: Property CSS variable harus pakai "--" prefix ("--x", "--y")
     bukan "-x" / "-y" yang sebelumnya typo.
  ───────────────────────────────────────────────────── */
  if (nav && glare) {
    let glareLeaveTimer = null;

    nav.addEventListener("mousemove", (e) => {
      if (glareLeaveTimer) {
        clearTimeout(glareLeaveTimer);
        glareLeaveTimer = null;
      }

      const rect = nav.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;

      // FIX: "--x" dan "--y" (dengan double dash)
      glare.style.setProperty("--x", x + "px");
      glare.style.setProperty("--y", y + "px");

      glare.classList.remove("glare-hidden");
    });

    nav.addEventListener("mouseleave", (e) => {
      const rect  = nav.getBoundingClientRect();
      const exitX = e.clientX - rect.left;
      const exitY = e.clientY - rect.top;

      glare.style.setProperty("--x", exitX + "px");
      glare.style.setProperty("--y", exitY + "px");

      glare.classList.add("glare-hidden");

      glareLeaveTimer = setTimeout(() => {
        glare.style.setProperty("--x", "50%");
        glare.style.setProperty("--y", "50%");
        glareLeaveTimer = null;
      }, 350);
    });
  }

  /* ─────────────────────────────────────────────────────
     12. PHOTO HOVER EFFECT — 3D tilt & glow
  ───────────────────────────────────────────────────── */
  const photoRing = document.querySelector(".photo-ring");
  if (photoRing) {
    photoRing.addEventListener("mousemove", (e) => {
      const rect    = photoRing.getBoundingClientRect();
      const cx      = rect.left + rect.width  / 2;
      const cy      = rect.top  + rect.height / 2;
      const dx      = (e.clientX - cx) / (rect.width  / 2);
      const dy      = (e.clientY - cy) / (rect.height / 2);
      const rotateX = -dy * 18;
      const rotateY =  dx * 18;

      photoRing.style.transform =
        `perspective(400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.10)`;
    });

    photoRing.addEventListener("mouseleave", () => {
      photoRing.style.transform =
        "perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)";
    });
  }

  /* ─────────────────────────────────────────────────────
     13. CONTACT FORM — feedback sederhana
  ───────────────────────────────────────────────────── */
  if (form && feedback) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name    = form.querySelector("#name")?.value.trim();
      const email   = form.querySelector("#email")?.value.trim();
      const message = form.querySelector("#message")?.value.trim();

      if (!name || !email || !message) {
        showFeedback("Mohon isi semua field yang wajib diisi.", "error");
        return;
      }
      if (!isValidEmail(email)) {
        showFeedback("Format email tidak valid.", "error");
        return;
      }

      showFeedback("Mengirim...", "");
      setTimeout(() => {
        showFeedback("Pesan terkirim! Terima kasih 🎉", "success");
        form.reset();
      }, 800);
    });
  }

  function showFeedback(msg, type) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className   = "form-feedback " + type;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ─────────────────────────────────────────────────────
     14. SCROLL-REVEAL — fade-in card saat masuk viewport
  ───────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll(".main-card, .section-card");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  revealEls.forEach((el) => {
    el.style.animationPlayState = "paused";
    revealObserver.observe(el);
  });

  /* ─────────────────────────────────────────────────────
     15. BADGE CANVAS EFFECTS
         - Data Science : partikel galaxy (bintang + nebula)
         - Electro       : petir zig-zag acak
  ───────────────────────────────────────────────────── */
  document.querySelectorAll(".badge-canvas").forEach((canvas) => {
    const type = canvas.dataset.type;
    const badge = canvas.parentElement;

    // Resize canvas agar presisi
    function resizeCanvas() {
      canvas.width  = badge.offsetWidth;
      canvas.height = badge.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const ctx = canvas.getContext("2d");
    let raf;

    /* ── DATA SCIENCE — Galaxy Particles ── */
    if (type === "ds") {
      const STARS = 38;
      const stars = Array.from({ length: STARS }, () => ({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 1.5 + 0.4,
        speed: Math.random() * 0.3 + 0.08,
        alpha: Math.random(),
        dAlpha: (Math.random() * 0.02 + 0.006) * (Math.random() < 0.5 ? 1 : -1),
        hue:   Math.floor(Math.random() * 80 + 220), // biru-ungu
      }));

      // Beberapa partikel bergerak melayang
      const floaters = Array.from({ length: 10 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 2.2 + 0.8,
        hue: Math.floor(Math.random() * 80 + 260),
        alpha: Math.random() * 0.7 + 0.3,
      }));

      function drawDS() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Nebula background glow
        const grad = ctx.createRadialGradient(
          canvas.width * 0.5, canvas.height * 0.5, 0,
          canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.55
        );
        grad.addColorStop(0, "rgba(120,60,255,0.10)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Bintang berkelip
        stars.forEach((s) => {
          s.alpha += s.dAlpha;
          if (s.alpha <= 0 || s.alpha >= 1) s.dAlpha *= -1;
          s.alpha = Math.max(0, Math.min(1, s.alpha));

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.hue}, 90%, 85%, ${s.alpha})`;
          ctx.fill();
        });

        // Partikel melayang
        floaters.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -4) p.x = canvas.width + 4;
          if (p.x > canvas.width + 4) p.x = -4;
          if (p.y < -4) p.y = canvas.height + 4;
          if (p.y > canvas.height + 4) p.y = -4;

          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
          grd.addColorStop(0, `hsla(${p.hue}, 90%, 80%, ${p.alpha})`);
          grd.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        });

        raf = requestAnimationFrame(drawDS);
      }
      drawDS();
    }

    /* ── ELECTRO — Lightning Bolts ── */
    if (type === "electro") {
      let lightningTimer = 0;
      let lightningInterval = Math.random() * 40 + 18; // frame antar petir
      let bolts = [];

      // Buat satu segmen petir zig-zag
      function makeBolt(x1, y1, x2, y2, depth) {
        if (depth <= 0) return [{ x1, y1, x2, y2 }];
        const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * (canvas.height * 0.45);
        const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 6;
        return [
          ...makeBolt(x1, y1, mx, my, depth - 1),
          ...makeBolt(mx, my, x2, y2, depth - 1),
        ];
      }

      // Buat kumpulan petir
      function spawnLightning() {
        bolts = [];
        const count = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < count; i++) {
          const startX = Math.random() * canvas.width;
          const segs = makeBolt(startX, 0, startX + (Math.random()-0.5)*20, canvas.height, 3);
          bolts.push({
            segs,
            alpha: 1.0,
            decay: Math.random() * 0.08 + 0.06,
            width: Math.random() * 1.2 + 0.5,
          });
        }
      }

      // Partikel percikan
      const sparks = [];
      function addSparks() {
        for (let i = 0; i < 6; i++) {
          sparks.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2.5,
            vy: (Math.random() - 0.5) * 2.5,
            alpha: 1,
            r: Math.random() * 1.5 + 0.5,
          });
        }
      }

      function drawElectro() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Spawn petir baru
        lightningTimer++;
        if (lightningTimer >= lightningInterval) {
          lightningTimer = 0;
          lightningInterval = Math.random() * 50 + 20;
          spawnLightning();
          addSparks();
        }

        // Gambar petir
        bolts.forEach((bolt, i) => {
          bolt.alpha -= bolt.decay;
          if (bolt.alpha <= 0) { bolts.splice(i, 1); return; }

          bolt.segs.forEach((seg) => {
            // Glow luar
            ctx.beginPath();
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
            ctx.strokeStyle = `rgba(255, 230, 50, ${bolt.alpha * 0.25})`;
            ctx.lineWidth = bolt.width * 5;
            ctx.lineCap = "round";
            ctx.stroke();

            // Core petir
            ctx.beginPath();
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
            ctx.strokeStyle = `rgba(255, 255, 220, ${bolt.alpha})`;
            ctx.lineWidth = bolt.width;
            ctx.stroke();
          });
        });

        // Percikan
        sparks.forEach((sp, i) => {
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.alpha -= 0.04;
          if (sp.alpha <= 0) { sparks.splice(i, 1); return; }

          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 220, 50, ${sp.alpha})`;
          ctx.fill();
        });

        raf = requestAnimationFrame(drawElectro);
      }
      drawElectro();
    }

    // Bersihkan animasi saat elemen dihapus
    const mo = new MutationObserver(() => {
      if (!document.body.contains(canvas)) {
        cancelAnimationFrame(raf);
        mo.disconnect();
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  });

}); // ─── end DOMContentLoaded ───
