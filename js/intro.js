// js/intro.js
// Manejo de la pantalla de bienvenida (btn "INGRESAR") y revelado de secciones

// Utilidad: esperar a que exista un elemento en el DOM
function waitForEl(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);

    const obs = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) {
        obs.disconnect();
        resolve(found);
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });

    setTimeout(() => {
      obs.disconnect();
      reject(new Error(`No se encontró ${selector} en ${timeout}ms`));
    }, timeout);
  });
}

// Inicializa la intro: botón, fade-out y muestra secciones
async function initIntro() {
  try {
    const boton = await waitForEl("#btn-entrar");
    const intro = await waitForEl("#intro-container");
    const seccionesOcultas = document.querySelectorAll(".oculto");
    const cartIcon = document.querySelector(".cart-icon");

    boton.addEventListener("click", () => {
      intro.classList.add("fade-out");
      setTimeout(() => {
        intro.style.display = "none";
        seccionesOcultas.forEach((sec) => sec.classList.add("visible"));
        if (cartIcon) cartIcon.style.display = "flex";
      }, 1000);
    });
  } catch (err) {
    // Si no hay intro (por ejemplo en una subpágina), no hacemos nada.
    // console.debug("[intro] No se inicializó:", err.message);
  }
}

// Auto-inicio cuando el DOM está listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initIntro);
} else {
  initIntro();
}

// Export opcional si más adelante querés llamarlo manualmente
export { initIntro };
