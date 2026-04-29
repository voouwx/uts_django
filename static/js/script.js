/* =====================================================
RENO ArD S — PORTFOLIO  |  main.js
File: static/js/main.js
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

/* ─────────────────────────────────────────
   1. NAVBAR — LIQUID GLASS PILL SLIDER
───────────────────────────────────────── */
const navBtns   = document.querySelectorAll(".nav-btn");
const pill      = document.getElementById("pill");
const nav       = document.getElementById("nav");
const glare     = document.getElementById("glare");
const themeBtn  = document.getElementById("theme-btn");

/**
 * Geser pill ke posisi tombol yang aktif.
 * smooth=false → tanpa animasi (untuk init & resize)
 */
function updatePill(btn, smooth = true) {
    if (!btn) return;
    if (!smooth) {
        pill.style.transition = "none";
    } else {
        pill.style.transition =
             "transform 0.5s cubic-bezier(0.34,1.2,0.64,1), " +
             "width 0.5s cubic-bezier(0.34,1.2,0.64,1)";
    }
    pill.style.width     = btn.offsetWidth + "px";
    pill.style.transform = "translateX(" + btn.offsetLeft + "px)";
}

// Set posisi awal tanpa animasi
const initActive = document.querySelector(".nav-btn.active");
if (initActive) {
    setTimeout(() => {
        updatePill(initActive, false);
        void pill.offsetWidth; // force reflow
    }, 60);
}

/* ─────────────────────────────────────────
   2. SMOOTH SCROLL — NAVBAR & TOMBOL
───────────────────────────────────────── */

/**
 * Scroll halus ke section berdasarkan id.
 * Offset 80px supaya tidak tertutup navbar.
 */
function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    const offset = 80;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
}

/**
 * Tandai tombol navbar yang sesuai dengan section aktif.
 */
function setActiveNavBtn(targetId) {
    navBtns.forEach(b => {
        if (b.dataset.target === targetId) {
            b.classList.add("active");
            updatePill(b);
        } else {
            b.classList.remove("active");
        }
    });
}

// Klik navbar → scroll + update pill
navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.target;
        setActiveNavBtn(target);
        scrollToSection(target);
    });
});

// Klik tombol "About Me" (data-scroll="about") & "Kembali ke atas"
document.querySelectorAll("[data-scroll]").forEach(el => {
    el.addEventListener("click", () => {
        const target = el.dataset.scroll;
        scrollToSection(target);
        setActiveNavBtn(target);
    });
});

/* ─────────────────────────────────────────
   3. INTERSECTION OBSERVER
      Update pill saat scroll manual
───────────────────────────────────────── */
const sections = document.querySelectorAll(".page-section");

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveNavBtn(entry.target.id);
            }
        });
    },
    {
        rootMargin: "-40% 0px -40% 0px", // tengah viewport
        threshold: 0,
    }
);

sections.forEach(sec => observer.observe(sec));

/* ─────────────────────────────────────────
   4. DARK / LIGHT MODE TOGGLE
───────────────────────────────────────── */
if (themeBtn) {
    // Simpan preferensi di localStorage
    const saved = localStorage.getItem("theme");
    if (saved) {
        document.documentElement.setAttribute("data-theme", saved);
    }

    themeBtn.addEventListener("click", () => {
        const root    = document.documentElement;
        const isDark  = root.getAttribute("data-theme") === "dark";
        const newTheme = isDark ? "light" : "dark";
        root.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);

        // Update pill setelah transisi font (font-weight bisa geser width)
        setTimeout(() => {
            const active = document.querySelector(".nav-btn.active");
            if (active) updatePill(active);
        }, 120);
    });
}

/* ─────────────────────────────────────────
   5. NAVBAR — LIQUID GLARE (cahaya ikut mouse)
───────────────────────────────────────── */
if (nav && glare) {
    nav.addEventListener("mousemove", (e) => {
        const rect = nav.getBoundingClientRect();
        glare.style.setProperty("--gx", (e.clientX - rect.left) + "px");
        glare.style.setProperty("--gy", (e.clientY - rect.top) + "px");
    });
}

/* ─────────────────────────────────────────
   6. RESIZE — rekalkulasi posisi pill
───────────────────────────────────────── */
window.addEventListener("resize", () => {
    const active = document.querySelector(".nav-btn.active");
    if (active) updatePill(active, false);
});

}); // end DOMContentLoaded