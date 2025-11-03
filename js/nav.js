// js/nav.js
// 1) Estado activo en navegación tipo "pills"
// 2) Ocultar/mostrar header en scroll (nav-hidden)

function initPillsActive() {
  const pills = document.querySelectorAll(".pill-item");
  if (!pills.length) return; // si no hay pills, no hacemos nada

  // Si no hay una activa marcada, marcamos la primera
  if (!document.querySelector(".pill-item.active") && pills[0]) {
    pills[0].classList.add("active");
  }

  pills.forEach((item) => {
    item.addEventListener("click", () => {
      const actual = document.querySelector(".pill-item.active");
      if (actual) actual.classList.remove("active");
      item.classList.add("active");
    });
  });
}

function initHeaderScrollHide() {
  const header = document.querySelector("header.navbar");
  if (!header) return;

  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop && currentScroll > 100) {
      // desplazamiento hacia abajo
      header.classList.add("nav-hidden");
    } else {
      // desplazamiento hacia arriba
      header.classList.remove("nav-hidden");
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }, { passive: true });
}

function initNav() {
  initPillsActive();
  initHeaderScrollHide();
}

// Auto-inicio
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNav);
} else {
  initNav();
}

export { initNav };
