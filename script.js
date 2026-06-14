const header = document.querySelector("[data-header]");
const progress = document.querySelector(".scroll-progress");
const navToggle = document.querySelector("[data-nav-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const modal = document.querySelector("[data-modal]");
const openModalButtons = document.querySelectorAll("[data-open-franchise]");
const closeModalButton = document.querySelector("[data-close-modal]");
const franchiseForm = document.querySelector("[data-franchise-form]");
const gallery = document.querySelector("[data-gallery]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const closeLightboxButton = document.querySelector("[data-close-lightbox]");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const openingHero = document.querySelector("[data-hero-opening]");

if (document.body.classList.contains("opening-active")) {
  if (reducedMotion || !openingHero) {
    document.body.classList.remove("opening-active");
    openingHero?.querySelector(".intro-shot")?.remove();
  } else {
    window.setTimeout(() => {
      document.body.classList.remove("opening-active");
      openingHero.querySelector(".intro-shot")?.remove();
    }, 3350);
  }
}

function updateScrollState() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${percent}%`;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  mobileNav.classList.toggle("is-open", !isOpen);
});

mobileNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navToggle.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("is-open");
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.02 },
);

document.querySelectorAll(".reveal").forEach((element) => {
  if (reducedMotion) {
    element.classList.add("is-visible");
  } else {
    revealObserver.observe(element);
  }
});

function animateCounter(element) {
  const target = Number(element.dataset.count || "0");
  const duration = reducedMotion ? 0 : 1100;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const ratio = duration ? Math.min(elapsed / duration, 1) : 1;
    const eased = 1 - Math.pow(1 - ratio, 3);
    element.textContent = Math.round(target * eased).toString().padStart(target < 10 ? 2 : 1, "0");
    if (ratio < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll("[data-count]").forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 },
);

document.querySelectorAll(".hero-proof").forEach((element) => counterObserver.observe(element));

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
    document.querySelectorAll(".menu-card").forEach((card) => {
      const show = filter === "all" || card.dataset.kind === filter;
      card.classList.toggle("is-hidden", !show);
    });
  });
});

function openModal() {
  modal.hidden = false;
  document.body.classList.add("no-scroll");
  const firstInput = modal.querySelector("input");
  if (firstInput) firstInput.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.classList.remove("no-scroll");
}

openModalButtons.forEach((button) => button.addEventListener("click", openModal));
closeModalButton.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

franchiseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(franchiseForm);
  const message = [
    "Hello Tea Smokers Team,",
    "",
    "I am interested in a franchise consultation.",
    `Name: ${formData.get("name")}`,
    `Phone: ${formData.get("phone")}`,
    `City: ${formData.get("city")}`,
    `Format: ${formData.get("format")}`,
  ].join("\n");
  window.open(`https://wa.me/919695260112?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

gallery.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const img = button.querySelector("img");
  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt;
  lightbox.hidden = false;
  document.body.classList.add("no-scroll");
});

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.classList.remove("no-scroll");
}

closeLightboxButton.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!modal.hidden) closeModal();
    if (!lightbox.hidden) closeLightbox();
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  });
});
