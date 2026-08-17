"use strict";

/* ============ PRELOADER ============ */
(function initPreloader() {
  const preloader = document.getElementById("preloader");
  const fill = document.getElementById("preFill");
  if (!preloader || !fill) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 20 + 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add("hidden");
        document.body.style.overflow = "";
        initHeroAnimations();
      }, 350);
    }
    fill.style.width = progress + "%";
  }, 60);

  document.body.style.overflow = "hidden";
})();

/* ============ CUSTOM CURSOR ============ */
(function initCursor() {
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!isFinePointer) return;

  const dot = document.getElementById("cursorDot");
  const outline = document.getElementById("cursorOutline");
  if (!dot || !outline) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;
  let isVisible = false;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!isVisible) {
      isVisible = true;
      dot.style.opacity = "1";
      outline.style.opacity = "1";
    }
    
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
  });

  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    outline.style.left = outlineX + "px";
    outline.style.top = outlineY + "px";
    requestAnimationFrame(animateOutline);
  }
  requestAnimationFrame(animateOutline);

  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    outline.style.opacity = "0";
    isVisible = false;
  });

  document.addEventListener("mouseenter", () => {
    dot.style.opacity = "1";
    outline.style.opacity = "1";
    isVisible = true;
  });
})();

/* ============ HERO PARTICLES ============ */
(function initParticles() {
  const container = document.getElementById("particles");
  if (!container) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 3.5 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --dur: ${Math.random() * 6 + 5}s;
      --delay: ${Math.random() * 5}s;
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
  let delay = 110;

  function type() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      target.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      delay = 50;
    } else {
      target.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      delay = 95;
    }

    if (!isDeleting && charIdx === current.length) {
      delay = 2400;
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

/* ============ NAVBAR & MOBILE MENU ============ */
(function initNavbar() {
  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  // Scroll: add .scrolled class
  window.addEventListener("scroll", () => {
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 30);
    }
    highlightNavLink();
  }, { passive: true });

  // Mobile toggle
  if (toggle && menu) {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.toggle("open");
      toggle.classList.toggle("active", isOpen);
    });

    // Close when clicking nav links
    menu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.classList.remove("active");
      });
    });

    // Close when clicking outside menu
    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target) && menu.classList.contains("open")) {
        menu.classList.remove("open");
        toggle.classList.remove("active");
      }
    });
  }

  // Active nav link highlight on scroll
  function highlightNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const links = document.querySelectorAll(".nav-link:not(.nav-cta)");
    let current = "";

    const scrollPosition = window.scrollY + 160;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
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
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-aos-delay");
          if (delay) {
            setTimeout(() => {
              entry.target.classList.add("aos-visible");
            }, parseInt(delay, 10));
          } else {
            entry.target.classList.add("aos-visible");
          }
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  elements.forEach((el) => observer.observe(el));
})();

/* ============ SMOOTH ANCHOR SCROLL ============ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      const offset = 85;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
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

/* ============ WHATSAPP CONTACT FORM ============ */
(function initContactForm() {
  const sendBtn = document.getElementById("sendBtn");
  if (!sendBtn) return;

  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const nameEl = document.getElementById("formName");
    const emailEl = document.getElementById("formEmail");
    const subjectEl = document.getElementById("formSubject");
    const messageEl = document.getElementById("formMessage");

    const name = nameEl ? nameEl.value.trim() : "";
    const email = emailEl ? emailEl.value.trim() : "";
    const subject = subjectEl ? subjectEl.value.trim() : "";
    const message = messageEl ? messageEl.value.trim() : "";

    if (!name || !email || !subject || !message) {
      showToast("Please fill in all fields before sending.", "error");
      return;
    }

    const phone = "918940786858";

    const text = `Hello Surendhar D,%0A%0A` +
      `*Name:* ${encodeURIComponent(name)}%0A` +
      `*Email:* ${encodeURIComponent(email)}%0A` +
      `*Subject:* ${encodeURIComponent(subject)}%0A%0A` +
      `*Message:*%0A${encodeURIComponent(message)}`;

    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");

    showToast("Opening WhatsApp... ✅", "success");

    [nameEl, emailEl, subjectEl, messageEl].forEach((el) => {
      if (el) el.value = "";
    });
  });
})();

/* ============ TOAST NOTIFICATION ============ */
function showToast(msg, type = "success") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 100001;
    padding: 0.9rem 1.6rem;
    border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: #ffffff;
    background: ${type === "error" ? "rgba(239, 68, 68, 0.95)" : "rgba(16, 185, 129, 0.95)"};
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid ${type === "error" ? "rgba(239, 68, 68, 0.5)" : "rgba(16, 185, 129, 0.5)"};
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    max-width: 380px;
    line-height: 1.5;
    pointer-events: none;
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

/* ============ HERO CARD 3D TILT ============ */
(function initHeroCardTilt() {
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!isFinePointer) return;

  const card = document.querySelector(".hero-card-wrap");
  if (!card) return;

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -8;
    const rotateY = ((x - cx) / cx) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transition = "transform 0.5s ease";
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  });

  card.addEventListener("mouseenter", () => {
    card.style.transition = "transform 0.15s ease";
  });
})();

/* ============ EXPERTISE CARD TILT & MOUSE GLOW ============ */
(function initCardGlow() {
  const cards = document.querySelectorAll(".exp-card, .skill-category, .timeline-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
})();
