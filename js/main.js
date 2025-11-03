// js/main.js
async function loadInto(containerSelector, htmlPath, position = "beforeend") {
  const cont = document.querySelector(containerSelector);
  if (!cont) return;
  const res = await fetch(htmlPath);
  const html = await res.text();
  cont.insertAdjacentHTML(position, html);
}

(async () => {
  // Cargar secciones en orden
  await loadInto("#intro", "html/intro.html");
  await loadInto("#header", "html/header.html");

  // Catálogos dentro del <main id="contenido">
  await loadInto("#contenido", "html/productos-mujer.html");
  await loadInto("#contenido", "html/productos-hombres.html");

  await loadInto("#contacto", "html/contacto.html");
  await loadInto("#footer", "html/footer.html");
})();
