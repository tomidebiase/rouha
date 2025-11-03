// js/carrito.js
// Carrito: agregar desde el modal, renderizar, eliminar, abrir/cerrar, WhatsApp

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

let carrito = [];

// ---------- Nodos requeridos (tolerante a inyección del header) ----------
function getNodes() {
  return {
    btnAgregar: $("#confirmar-compra"),
    cartCount:  $("#cart-count"),
    modalCarrito: $("#modal-carrito"),
    cerrarCarrito: $(".cerrar-carrito"),
    carritoItems: $("#carrito-items"),
    cartIcon: $(".cart-icon"),
    finalizarBtn: $("#finalizar-compra"),
    modalCompra: $("#modal-compra"),
  };
}

// ---------- Render ----------
function renderCarrito() {
  const { carritoItems, cartCount } = getNodes();
  if (!carritoItems || !cartCount) return;

  carritoItems.innerHTML = "";
  carrito.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "item-carrito";
    row.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" style="width:60px; height:70px; object-fit:cover; border-radius:6px;">
      <div>
        <h4>${item.nombre}</h4>
        <p class="precio">${item.precio}</p>
        <small>${[item.talle && `Talle: ${item.talle}`, item.color && `Color: ${item.color}`].filter(Boolean).join(" - ")}</small>
      </div>
      <button class="btn-eliminar" data-index="${index}" aria-label="Eliminar del carrito">🗑️</button>
    `;
    carritoItems.appendChild(row);
  });

  cartCount.textContent = carrito.length;

  // Eliminar ítem
  $$(".btn-eliminar", carritoItems).forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const i = Number(e.currentTarget.getAttribute("data-index"));
      carrito.splice(i, 1);
      renderCarrito();
    });
  });
}

// ---------- Agregar desde el modal de compra ----------
function bindAgregar() {
  const { btnAgregar, modalCompra, cartCount } = getNodes();
  if (!btnAgregar || !modalCompra) return;

  btnAgregar.addEventListener("click", () => {
    const nombre = $("#modal-nombre")?.textContent || "";
    const precio = $("#modal-precio")?.textContent || "";
    const imagen = $("#modal-img")?.src || "";
    const talle  = $(".talle.selected")?.textContent?.trim() || "";
    const color  = $(".colores-modal .color.selected")?.title || "";

    carrito.push({ nombre, precio, imagen, talle, color });
    renderCarrito();

    // ✅ Cerrar modal de compra inmediatamente
    modalCompra.setAttribute("data-open", "0");
    modalCompra.style.display = "none";
    document.body.classList.remove("no-scroll");

    // ✅ Feedback: bump del contador + toast
    if (cartCount) {
      cartCount.classList.add("bump");
      setTimeout(() => cartCount.classList.remove("bump"), 300);
    }
    showToast("Agregado al carrito");
  });
}

/* Toast simple y reutilizable */
function showToast(msg = "Agregado al carrito") {
  const old = document.querySelector(".rouha-toast");
  if (old) old.remove();

  const t = document.createElement("div");
  t.className = "rouha-toast";
  t.textContent = msg;
  document.body.appendChild(t);

  // mostrar
  requestAnimationFrame(() => t.classList.add("show"));
  // ocultar y limpiar
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 220);
  }, 1200);
}


// ---------- Abrir / Cerrar modal carrito (robusto) ----------
function bindOpenClose() {
  const { modalCarrito } = getNodes();
  if (!modalCarrito) return;

  const openCarrito = () => {
    renderCarrito();
    modalCarrito.style.display = "flex";
    document.body.classList.add("no-scroll");   // bloquea scroll de fondo
  };

  const closeCarrito = () => {
    modalCarrito.style.display = "none";
    document.body.classList.remove("no-scroll"); // restaura scroll de fondo
  };

  // Abrir desde el botón del header (delegación)
  document.addEventListener("click", (e) => {
    if (e.target.closest(".cart-icon")) openCarrito();
    if (e.target.closest(".cerrar-carrito")) closeCarrito(); // click en la X
  });

  // Cerrar haciendo click en el overlay (fuera del contenido)
  modalCarrito.addEventListener("click", (e) => {
    if (e.target === modalCarrito) closeCarrito();
  });

  // Cerrar con tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalCarrito.style.display !== "none") {
      closeCarrito();
    }
  });
}

// ---------- Finalizar compra (WhatsApp) ----------
function bindFinalizar() {
  const { finalizarBtn } = getNodes();
  if (!finalizarBtn) return;

  finalizarBtn.addEventListener("click", () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    let mensaje = "🛍️ *Pedido ROUHA*%0A%0A";
    carrito.forEach((item) => {
      const t = item.talle ? `Talle: ${item.talle}` : "";
      const c = item.color ? `Color: ${item.color}` : "";
      const detalle = [t, c].filter(Boolean).join(" - ");
      mensaje += `• ${item.nombre} - ${item.precio}%0A${detalle}%0A%0A`;
    });
    mensaje += "📍 La Plata, Buenos Aires%0A💬 Quisiera confirmar mi pedido.";

    const numero = "5492494662486";
    const url = `https://wa.me/${numero}?text=${mensaje}`;
    window.open(url, "_blank");
  });
}

// ---------- Init ----------
function initCarrito() {
  bindAgregar();
  bindOpenClose();
  bindFinalizar();

  // fallback: asegurar que el botón del carrito sea visible
  const { cartIcon } = getNodes();
  if (cartIcon && (cartIcon.style.display === "" || cartIcon.style.display === "none")) {
    cartIcon.style.display = "inline-flex";
  }
}

// Auto-inicio cuando el DOM está listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCarrito);
} else {
  initCarrito();
}

export { initCarrito };
