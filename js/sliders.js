// js/sliders.js
// Slider de tarjetas de producto con delegación robusta

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

function getSlides(card) {
  // Soporta varios nombres de contenedor
  const container =
    card.querySelector(".slider") ||
    card.querySelector(".slides") ||
    card.querySelector(".galeria") ||
    card;
  const slides = $$(".slide", container);
  return { container, slides };
}

function setActive(slides, index) {
  slides.forEach((s, i) => s.classList.toggle("active", i === index));
}

function move(card, dir) {
  const { slides } = getSlides(card);
  if (!slides.length) return;

  let i =
    Number(card.dataset.slideIndex) ??
    slides.findIndex((s) => s.classList.contains("active"));
  if (isNaN(i) || i < 0) i = 0;

  i = (i + (dir === "next" ? 1 : -1) + slides.length) % slides.length;
  card.dataset.slideIndex = i;
  setActive(slides, i);
}

// Inicializa todas las tarjetas: asegura un slide activo
function initSlides() {
  $$(".producto").forEach((card) => {
    const { slides } = getSlides(card);
    if (!slides.length) return;
    const current = slides.findIndex((s) => s.classList.contains("active"));
    if (current === -1) {
      setActive(slides, 0);
      card.dataset.slideIndex = 0;
    } else {
      card.dataset.slideIndex = current;
    }
  });
}

// Delegación: escucha clicks en cualquier flecha conocida
document.addEventListener("click", (e) => {
  const prev = e.target.closest(
    '.prev, .arrow-left, .btn-prev, [data-dir="prev"]'
  );
  const next = e.target.closest(
    '.next, .arrow-right, .btn-next, [data-dir="next"]'
  );
  if (!prev && !next) return;

  const card = e.target.closest(".producto");
  if (!card) return;

  move(card, next ? "next" : "prev");
});

// Auto-init
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSlides);
} else {
  initSlides();
}

export {};
