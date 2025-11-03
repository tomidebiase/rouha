// js/carrito.js

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

let carrito = [];

// ===== Scroll lock =====
function lockScroll() {
  const y = window.scrollY || document.documentElement.scrollTop || 0;
  document.body.dataset.scrollY = String(y);
  document.body.classList.add("modal-open");
  document.body.style.top = `-${y}px`;
}
function unlockScroll() {
  const y = parseInt(document.body.dataset.scrollY || "0", 10);
  document.body.classList.remove("modal-open");
  document.body.style.top = "";
  window.scrollTo(0, y);
}

// ===== Nodos =====
function getNodes() {
  return {
    btnAgregar: $("#confirmar-compra"),
    cartCount: $("#cart-count"),
    modalCarrito: $("#modal-carrito"),
    cerrarCarrito: $(".cerrar-carrito"),
    carritoItems: $("#carrito-items"),
    cartIcon: $(".cart-icon"),
    finalizarBtn: $("#finalizar-compra"),
    modalCompra: $("#modal-compra"),
  };
}

// ===== Render =====
function renderCarrito() {
  const { carritoItems, cartCount } = getNodes();
  if (!carritoItems || !cartCount) return;

  carritoItems.innerHTML = "";
  carrito.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "item-carrito";
    row.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" style="width:60px;height:70px;object-fit:cover;border-radius:6px;">
      <div>
        <h4>${item.nombre}</h4>
        <p class="precio">${item.precio}</p>
        <small>${[item.talle && `Talle: ${item.talle}`, item.color && `Color: ${item.color}`].filter(Boolean).join(" - ")}</small>
      </div>
      <button class="btn-eliminar" data-index="${index}">🗑️</button>
    `;
    carritoItems.appendChild(row);
  });
  cartCount.textContent = carrito.length;

  $$(".btn-eliminar", carritoItems).forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const i = Number(e.currentTarget.getAttribute("data-index"));
      carrito.splice(i, 1);
      renderCarrito();
    });
  });
}

// ===== Agregar =====
function bindAgregar() {
  // Delegación: funciona aunque el botón se re-renderice
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#confirmar-compra");
    if (!btn) return;

    const nombre = $("#modal-nombre")?.textContent || "";
    const precio = $("#modal-precio")?.textContent || "";
    const imagen = $("#modal-img")?.src || "";
    const talle  = $(".talle.selected")?.textContent?.trim() || "";
    const color  = $(".colores-modal .color.selected")?.title || "";

    carrito.push({ nombre, precio, imagen, talle, color });
    renderCarrito();

    // ✅ cerrar modal de compra SIEMPRE
    const modalCompra = $("#modal-compra");
    if (modalCompra) {
      modalCompra.setAttribute("data-open", "0");
      modalCompra.style.display = "none";
    }
    // ✅ restaurar scroll
    if (typeof unlockScroll === "function") unlockScroll();

    // feedback
    const count = $("#cart-count");
    if (count) {
      count.classList.add("bump");
      setTimeout(() => count.classList.remove("bump"), 300);
    }
    showToast("Agregado al carrito");
  });
}


// ===== Abrir/Cerrar =====
function bindOpenClose() {
  const { modalCarrito } = getNodes();

  const openCarrito = () => {
    renderCarrito();
    modalCarrito.style.display = "flex";
    lockScroll();
  };
  const closeCarrito = () => {
    modalCarrito.style.display = "none";
    unlockScroll();
  };

  document.addEventListener("click", (e) => {
    const openBtn = e.target.closest(".cart-icon");
    const closeBtn = e.target.closest(".cerrar-carrito");
    if (openBtn) openCarrito();
    if (closeBtn) closeCarrito();
  });

  window.addEventListener("click", (e) => {
    if (e.target === modalCarrito) closeCarrito();
  });
}

// ===== Finalizar compra =====
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
    window.open(`https://wa.me/5492494662486?text=${mensaje}`, "_blank");
  });
}

// ===== Init =====
function initCarrito() {
  bindAgregar();
  bindOpenClose();
  bindFinalizar();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCarrito);
} else {
  initCarrito();
}

export { initCarrito };
