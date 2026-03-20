"use strict";

/* ============ PRELOADER ============ */
(function initPreloader() {
  const preloader = document.getElementById("preloader");
  const fill = document.getElementById("preFill");
  if (!preloader || !fill) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add("hidden");
        document.body.style.overflow = "";
        // Trigger hero animations after preloader
        initHeroAnimations();
      }, 400);
    }
    fill.style.width = progress + "%";
  }, 80);

  document.body.style.overflow = "hidden";
})();

/* ============ CUSTOM CURSOR ============ */
(function initCursor() {
  const dot = document.getElementById("cursorDot");
  const outline = document.getElementById("cursorOutline");
  if (!dot || !outline) return;

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;
  let rafId;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
  });

  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.13;
    outlineY += (mouseY - outlineY) * 0.13;
    outline.style.left = outlineX + "px";
    outline.style.top = outlineY + "px";
    rafId = requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Hide cursor when leaving window
  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    outline.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity = "1";
    outline.style.opacity = "0.5";
  });
})();

/* ============ PARTICLES ============ */
(function initParticles() {
  const container = document.getElementById("particles");
  if (!container) return;

  const count = 20;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --dur: ${Math.random() * 6 + 4}s;
      --delay: ${Math.random() * 6}s;
    `;
    container.appendChild(p);
  }
})();

/* ============ TYPEWRITER HERO ============ */
function initHeroAnimations() {
  const target = document.getElementById("typeTarget");
  if (!target) return;

  const phrases = [
    "LIS Interface Developer",
    "SQL Performance Expert",
    "Healthcare IT Specialist",
    "HL7 / ASTM Integrator",
    ".NET & C# Developer",
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 120;

  function type() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      target.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      delay = 60;
    } else {
      target.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      delay = 110;
    }

    if (!isDeleting && charIdx === current.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }
  type();
}

/* ============ NAVBAR ============ */
(function initNavbar() {
  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  // Scroll: add .scrolled class
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
    highlightNavLink();
  }, { passive: true });

  // Mobile toggle
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("open");
    });
    // Close on link click
    menu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => menu.classList.remove("open"));
    });
  }

  // Active nav link highlight on scroll
  function highlightNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const links = document.querySelectorAll(".nav-link");
    let current = "";

    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute("id");
      }
    });

    links.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }
})();

/* ============ SCROLL REVEAL (AOS-like) ============ */
(function initScrollReveal() {
  const elements = document.querySelectorAll("[data-aos]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-aos-delay");
          if (delay) {
            setTimeout(() => {
              entry.target.classList.add("aos-visible");
            }, parseInt(delay));
          } else {
            entry.target.classList.add("aos-visible");
          }
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  elements.forEach((el) => observer.observe(el));
})();

/* ============ SMOOTH ANCHOR SCROLL ============ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: "smooth",
      });
    });
  });
})();

/* ============ TICKER PAUSE ON HOVER ============ */
(function initTicker() {
  const ticker = document.getElementById("tickerInner");
  if (!ticker) return;
  ticker.addEventListener("mouseenter", () => ticker.style.animationPlayState = "paused");
  ticker.addEventListener("mouseleave", () => ticker.style.animationPlayState = "running");
})();

sendBtn.addEventListener("click", () => {
  const name = document.getElementById("formName")?.value.trim();
  const email = document.getElementById("formEmail")?.value.trim();
  const subject = document.getElementById("formSubject")?.value.trim();
  const message = document.getElementById("formMessage")?.value.trim();

  if (!name || !email || !subject || !message) {
    showToast("Please fill in all fields.", "error");
    return;
  }

  const phone = "918940786858"; // 🔁 Replace with your number (91 = India code)

  const text = `Hello Surendhar D,%0A%0A` +
    `*Name:* ${name}%0A` +
    `*Email:* ${email}%0A` +
    `*Subject:* ${subject}%0A%0A` +
    `*Message:*%0A${message}`;

  window.open(`https://wa.me/${phone}?text=${text}`, "_blank");

  showToast("Opening WhatsApp... ✅", "success");

  ["formName", "formEmail", "formSubject", "formMessage"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
});

/* ============ TOAST NOTIFICATION ============ */
function showToast(msg, type = "success") {
  // Remove existing toast
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 9999;
    padding: 1rem 1.8rem;
    border-radius: 10px;
    font-family: 'Manrope', sans-serif;
    font-size: 0.88rem;
    font-weight: 600;
    color: #fff;
    background: ${type === "error" ? "#ef4444" : "#10b981"};
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
    max-width: 380px;
    line-height: 1.5;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ============ COUNTER ANIMATION ============ */
(function initCounters() {
  const counters = [
    { el: document.querySelector(".pstat-num"), target: 5000, suffix: "+" },
  ];
  // counters are handled by CSS design, kept for future use
})();

/* ============ EXPERTISE CARD TILT ============ */
(function initCardTilt() {
  const cards = document.querySelectorAll(".exp-card:not(.featured)");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -5;
      const rotateY = ((x - cx) / cx) * 5;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "transform 0.4s ease";
    });

    card.addEventListener("mouseenter", () => {
      card.style.transition = "transform 0.1s ease";
    });
  });
})();

/* ============ PROGRESS BAR ON SCROLL ============ */
(function initProgressBar() {
  const bar = document.createElement("div");
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; z-index: 2000;
    height: 3px;
    background: linear-gradient(90deg, #0047cc, #00b4d8);
    width: 0%;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrolled / total) * 100 + "%";
  }, { passive: true });
})();
/* ============ HERO CARD 3D TILT ============ */
(function initHeroCardTilt() {
  const card = document.querySelector(".hero-card-wrap");
  if (!card) return;

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -12;
    const rotateY = ((x - cx) / cx) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transition = "transform 0.5s ease";
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  });

  card.addEventListener("mouseenter", () => {
    card.style.transition = "transform 0.1s ease";
  });
})();
