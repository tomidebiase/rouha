// js/sliders.js
// Carruseles de producto: .slider con .slide, .prev y .next

function initSlider(sliderEl) {
  const slides = Array.from(sliderEl.querySelectorAll(".slide"));
  const prevBtn = sliderEl.querySelector(".prev");
  const nextBtn = sliderEl.querySelector(".next");

  if (!slides.length) return;

  let current = slides.findIndex(s => s.classList.contains("active"));
  if (current === -1) current = 0;
  show(current);

  function show(index) {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
  }

  function go(delta) {
    current = (current + delta + slides.length) % slides.length;
    show(current);
  }

  // Clicks
  nextBtn && nextBtn.addEventListener("click", () => go(+1));
  prevBtn && prevBtn.addEventListener("click", () => go(-1));

  // Soporte teclado cuando el slider tiene foco
  sliderEl.tabIndex = 0;
  sliderEl.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(+1);
    if (e.key === "ArrowLeft") go(-1);
  });

  // Gestos táctiles básicos
  let startX = 0;
  sliderEl.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  sliderEl.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) { // umbral
      if (diff < 0) go(+1); else go(-1);
    }
  }, { passive: true });
}

function initSliders() {
  document.querySelectorAll(".slider").forEach(initSlider);
}

// Auto-inicio
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSliders);
} else {
  initSliders();
}

export { initSliders };
