/* =====================================================
   RENO ArD S — PORTFOLIO  |  script.js
   File : static/js/script.js
   Note : Single-page — semua section ada di home.html
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ───────────────────────────────────────────────────
     AMBIL SEMUA ELEMEN YANG DIBUTUHKAN
  ─────────────────────────────────────────────────── */
  const nav      = document.getElementById("nav");
  const glare    = document.getElementById("glare");
  const pill     = document.getElementById("active-pill");
  const navBtns  = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".page-section");
  const feedback = document.getElementById("form-feedback");
  const form     = document.querySelector(".contact-form");
  const mainEl   = document.getElementById("main-content");

  /* ───────────────────────────────────────────────────
     1. PILL SLIDER
  ─────────────────────────────────────────────────── */
  function movePill(btn, smooth = true) {
    if (!btn || !pill) return;
    if (!smooth) {
      pill.style.transition = "none";
    } else {
      pill.style.transition =
        "transform 0.5s cubic-bezier(0.34,1.2,0.64,1)," +
        "width     0.5s cubic-bezier(0.34,1.2,0.64,1)," +
        "background 0.5s ease, box-shadow 0.5s ease";
    }
    pill.style.width     = btn.offsetWidth  + "px";
    pill.style.transform = "translateX(" + btn.offsetLeft + "px)";
  }

  /* ───────────────────────────────────────────────────
     2. SET ACTIVE BUTTON
  ─────────────────────────────────────────────────── */
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

  /* ───────────────────────────────────────────────────
     3. SMOOTH SCROLL KE SECTION
     FIX FINAL: gunakan scrollIntoView() langsung pada
     elemen target. Ini paling reliable untuk scroll-snap
     container karena browser sendiri yang handle snap-point.
     scroll-snap-stop: always tidak menghalangi ini.
  ─────────────────────────────────────────────────── */
  function scrollTo(id) {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ───────────────────────────────────────────────────
     4. KLIK NAVBAR → scroll + update pill
  ─────────────────────────────────────────────────── */
  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.target;
      setActive(id);
      scrollTo(id);
    });
  });

  /* ───────────────────────────────────────────────────
     5. KLIK TOMBOL data-scroll
  ─────────────────────────────────────────────────── */
  document.querySelectorAll("[data-scroll]").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.dataset.scroll;
      scrollTo(id);
      setActive(id);
    });
  });

  /* ───────────────────────────────────────────────────
     6. INTERSECTION OBSERVER
  ─────────────────────────────────────────────────── */
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

  /* ───────────────────────────────────────────────────
     7. INIT — posisi pill pertama kali (tanpa animasi)
  ─────────────────────────────────────────────────── */
  const firstActive = document.querySelector(".nav-btn.active");
  if (firstActive) {
    requestAnimationFrame(() => {
      movePill(firstActive, false);
      requestAnimationFrame(() => {
        pill.style.transition = "";
      });
    });
  }

  /* ───────────────────────────────────────────────────
     8. RESIZE — rekalkulasi posisi pill
  ─────────────────────────────────────────────────── */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const active = document.querySelector(".nav-btn.active");
      if (active) movePill(active, false);
    }, 100);
  });

  /* ───────────────────────────────────────────────────
     9. DARK / LIGHT MODE TOGGLE
     Fix: pakai "data-theme" bukan "datatheme"
  ─────────────────────────────────────────────────── */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateThemeToggleLabel(theme);
    const active = document.querySelector(".nav-btn.active");
    if (active) setTimeout(() => movePill(active), 60);
  }

  function updateThemeToggleLabel(theme) {
    const toggleLabel = document.getElementById("theme-toggle-label");
    if (!toggleLabel) return;
    if (theme === "dark") {
      toggleLabel.textContent = "Switch to Light";
    } else {
      toggleLabel.textContent = "Switch to Dark";
    }
  }

  // Terapkan tema tersimpan saat halaman dibuka
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  // Tombol theme banner di hero card — satu-satunya toggle
  const themeBannerBtn = document.getElementById("theme-banner-btn");
  if (themeBannerBtn) {
    themeBannerBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
    themeBannerBtn.addEventListener("mouseenter", () => {
      updateThemeToggleLabel(
        document.documentElement.getAttribute("data-theme")
      );
    });
  }

  /* ───────────────────────────────────────────────────
     10b. BACKGROUND COLOR CYCLING — setiap 10 detik
     Ganti pasangan warna blob secara bertahap menggunakan
     CSS custom property di :root.
  ─────────────────────────────────────────────────── */
  const PALETTES = [
    // [blob-1, blob-2, blob-3]
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

  /* ───────────────────────────────────────────────────
     10. GLARE EFFECT — FIX: natural fade saat mouse leave
     Masalah lama: saat mouseleave langsung set --x ke 50%
     sehingga glare "melompat" ke tengah.
     Fix baru: saat mouseleave → fade opacity ke 0 dulu via
     class, lalu reset posisi setelah transisi selesai.
  ─────────────────────────────────────────────────── */
  if (nav && glare) {
    let glareLeaveTimer = null;

    nav.addEventListener("mousemove", (e) => {
      // Batalkan timer leave kalau user kembali ke nav
      if (glareLeaveTimer) {
        clearTimeout(glareLeaveTimer);
        glareLeaveTimer = null;
      }

      const rect = nav.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;

      // Update posisi glare
      glare.style.setProperty("--x", x + "px");
      glare.style.setProperty("--y", y + "px");

      // Pastikan glare visible
      glare.classList.remove("glare-hidden");
    });

    nav.addEventListener("mouseleave", (e) => {
      // Hitung posisi terakhir kursor sebelum benar-benar keluar
      // untuk menentukan arah "exit" sehingga glare fade secara natural
      const rect    = nav.getBoundingClientRect();
      const exitX   = e.clientX - rect.left;
      const exitY   = e.clientY - rect.top;

      // Set posisi exit sebelum fade agar tidak "lompat ke tengah"
      glare.style.setProperty("--x", exitX + "px");
      glare.style.setProperty("--y", exitY + "px");

      // Fade out glare secara natural
      glare.classList.add("glare-hidden");

      // Setelah animasi fade selesai (300ms), reset posisi ke tengah
      // tapi tetap tersembunyi — sehingga saat masuk lagi, mulai dari tengah
      glareLeaveTimer = setTimeout(() => {
        glare.style.setProperty("--x", "50%");
        glare.style.setProperty("--y", "50%");
        glareLeaveTimer = null;
      }, 350);
    });
  }

  /* ───────────────────────────────────────────────────
     11. PHOTO HOVER EFFECT — 3D tilt & glow
  ─────────────────────────────────────────────────── */
  const photoRing = document.querySelector(".photo-ring");
  if (photoRing) {
    photoRing.addEventListener("mousemove", (e) => {
      const rect   = photoRing.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);  // -1 to 1
      const dy     = (e.clientY - cy) / (rect.height / 2);  // -1 to 1
      const rotateX = -dy * 18;  // tilt vertical
      const rotateY =  dx * 18;  // tilt horizontal

      photoRing.style.transform =
        `perspective(400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.10)`;
    });

    photoRing.addEventListener("mouseleave", () => {
      photoRing.style.transform =
        "perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)";
    });
  }

  /* ───────────────────────────────────────────────────
     12. CONTACT FORM — feedback sederhana
  ─────────────────────────────────────────────────── */
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

  /* ───────────────────────────────────────────────────
     13. SCROLL-REVEAL — fade-in card saat masuk viewport
  ─────────────────────────────────────────────────── */
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

}); // ─── end DOMContentLoaded ───
