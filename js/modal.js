// js/modal.js
// Modal de compra: abrir, rellenar datos, talles, colores y tablas

// ---------- Utils ----------
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function show(el) { if (el) el.style.display = "block"; }
function hide(el) { if (el) el.style.display = "none"; }

// ---------- Talles ----------
function setTallesDisponibles(allowed = []) {
  const cont = $(".talles");
  const titulo = $(".titulo-talles");
  if (!cont || !titulo) return;

  if (allowed === "UNICO") {
    hide(cont);
    titulo.textContent = "Talle: ÚNICO";
    return;
  }

  show(cont);
  titulo.textContent = "Talles disponibles";
  $$(".talles .talle").forEach(btn => {
    const t = btn.textContent.trim();
    btn.style.display = allowed.includes(t) ? "inline-block" : "none";
    btn.classList.remove("selected");
  });
}

// ---------- Tablas (carga perezosa) ----------
let tablasCargadas = false;
async function ensureTablas() {
  if (tablasCargadas) return;
  try {
    const res = await fetch("html/tablas.html");
    const html = await res.text();
    $(".modal-info")?.insertAdjacentHTML("beforeend", html);
    tablasCargadas = true;
  } catch (e) {
    console.error("Error cargando tablas:", e);
  }
}
function ocultarTodasLasTablas() { $$(".tabla-talles").forEach(div => hide(div)); }
function mostrarTabla(idTabla) {
  if (!idTabla) return;
  const el = document.getElementById(idTabla);
  if (el) show(el);
}

// ---------- Reglas por producto ----------
const PRODUCT_RULES = {
  // Mujer
  "remera-inquieta":     { talles: "UNICO",   tabla: "tabla-remera-inquieta" },
  "blusa-inquieta":      { talles: "UNICO",   tabla: "tabla-blusa-inquieta",  titulo: "Talle: S" },
  "musculosa-siem":      { talles: "UNICO",   tabla: "tabla-musculosa-siem",  titulo: "Talle: 40" },
  "body-loudi":          { talles: "UNICO",   tabla: "tabla-body-loudi",      titulo: "Talle: 40" },
  "pantalon-kiran":      { talles: "UNICO",   tabla: "tabla-pantalon-kiran",  titulo: "Talle: S" },
  "musculosa-capri":     { talles: "UNICO" },
  "musculosa-zola":      { talles: ["S", "M"] },
  "musculosa-selena":    { talles: ["S", "M"] },
  // Hombre
  "chomba-lux":          { talles: ["S", "M", "L", "XL"], tabla: "tabla-chomba-lux" },
  "remera-etereo":       { talles: ["S", "M", "L"],       tabla: "tabla-remera-etereo" },
  "remera-edgy":         { talles: ["S", "M", "L"],       tabla: "tabla-remera-edgy" },
  "remera-snow":         { talles: ["S", "M", "L"],       tabla: "tabla-remera-snow" },
};

// ---------- Init ----------
function initModal() {
  const modal = $("#modal-compra");
  const cerrar = $(".cerrar");
  const modalImg = $("#modal-img");
  const modalNombre = $("#modal-nombre");
  const modalPrecio = $("#modal-precio");
  const coloresContainer = $(".colores-container");
  const coloresModal = $(".colores-modal");

  if (!modal || !modalImg || !modalNombre || !modalPrecio) return;

  // Asegurar que arranca cerrado (candado CSS usa data-open)
  modal.setAttribute("data-open", "0");
  modal.style.display = "none";

  // Abrir desde cualquier .btn-comprar (delegación)
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-comprar");
    if (!btn) return;

    const card = e.target.closest(".producto");
    if (!card) return;

    // Rellenar datos
    const nombre = card.querySelector("h2")?.textContent ?? "";
    const precio = card.querySelector(".precio")?.textContent ?? "";
    const activeImg = card.querySelector(".slide.active img")?.src
                   || card.querySelector(".slide img")?.src
                   || card.querySelector("img")?.src
                   || "";

    modalNombre.textContent = nombre;
    modalPrecio.textContent = precio;
    modalImg.src = activeImg;

    // Talles + tablas
    await ensureTablas();
    ocultarTodasLasTablas();

    const idProd = card.id || ""; // ej: chomba-lux
    const rule = PRODUCT_RULES[idProd];
    if (rule) {
      if (rule.talles === "UNICO") {
        setTallesDisponibles("UNICO");
        if (rule.titulo) $(".titulo-talles").textContent = rule.titulo;
      } else if (Array.isArray(rule.talles)) {
        setTallesDisponibles(rule.talles);
      }
      if (rule.tabla) mostrarTabla(rule.tabla);
    } else {
      setTallesDisponibles(["S", "M", "L"]);
    }

    // Colores
    const coloresProducto = $$(".colores .color", card);
    if (coloresProducto.length > 0) {
      coloresContainer.style.display = "block";
      coloresModal.innerHTML = "";
      coloresProducto.forEach((colorEl, i) => {
        const nuevo = document.createElement("div");
        nuevo.className = "color";
        nuevo.style.backgroundColor = colorEl.style.backgroundColor;
        nuevo.title = colorEl.title || "";
        if (i === 0) nuevo.classList.add("selected");
        nuevo.addEventListener("click", () => {
          $$(".colores-modal .color").forEach(c => c.classList.remove("selected"));
          nuevo.classList.add("selected");
        });
        coloresModal.appendChild(nuevo);
      });
    } else {
      coloresContainer.style.display = "none";
      coloresModal.innerHTML = "";
    }

    // 🔓 ABRIR MODAL (candado)
    modal.setAttribute("data-open", "1");
    modal.style.display = "flex";
    document.body.classList.add("no-scroll");
  });

  // Selección de talles dentro del modal
  $$(".talles .talle").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".talles .talle").forEach(t => t.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  // ---- CIERRES robustos (X, overlay, ESC) ----
  const closeCompraModal = () => {
    modal.setAttribute("data-open", "0");
    hide(modal);
    document.body.classList.remove("no-scroll");
  };

  cerrar?.addEventListener("click", closeCompraModal);

  window.addEventListener("click", (e) => {
    if (e.target === modal) closeCompraModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("data-open") === "1") {
      closeCompraModal();
    }
  });
}

// Auto-init
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initModal);
} else {
  initModal();
}

export { initModal };
