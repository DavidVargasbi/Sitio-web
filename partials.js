/* =========================================================
   BI CONSULTING LAB — shared header + footer injection
   Keeps the nav/footer in ONE place across every page.
   Runs before main.js (both deferred, in order).
   ========================================================= */
(function () {
  "use strict";

  // Are we on the homepage? (so in-page anchors scroll instead of navigate)
  var path = location.pathname.split("/").pop().toLowerCase();
  var isHome = (path === "" || path === "index.html");
  var HOME = isHome ? "" : "index.html";

  // Which top-level section is active, for highlighting.
  var current = "";
  if (isHome) current = "inicio";
  else if (/^servicio-|^sector-|^flujo-de-trabajo/.test(path)) current = "soluciones";
  else if (/^nosotros|^casos-de-exito/.test(path)) current = "experiencia";
  else if (/^recursos/.test(path)) current = "recursos";

  var V = "?v=20260604";

  function cur(name) { return current === name ? " is-current" : ""; }

  var header =
  '<header class="nav" id="nav">' +
    '<div class="nav__inner">' +
      '<a href="' + (isHome ? "#hero" : "index.html") + '" class="brand" aria-label="BI Consulting Lab — inicio">' +
        '<img class="brand__logo" src="assets/img/iso-white.png' + V + '" alt="BI Consulting Lab" width="48" height="48" />' +
      '</a>' +

      '<nav class="nav__links" aria-label="Navegación principal">' +
        '<a href="' + (isHome ? "#hero" : "index.html") + '" class="nav__link' + cur("inicio") + '">Inicio</a>' +

        '<div class="nav__item has-mega">' +
          '<button type="button" class="nav__link nav__trigger' + cur("soluciones") + '" aria-expanded="false" aria-haspopup="true">Soluciones' +
            '<svg class="caret" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' +
          '</button>' +
          '<div class="mega">' +
            '<div class="mega__cats">' +
              '<button type="button" class="mega__cat is-active" data-panel="servicios">Servicios <span aria-hidden="true">›</span></button>' +
              '<button type="button" class="mega__cat" data-panel="sectores">Sectores <span aria-hidden="true">›</span></button>' +
              '<button type="button" class="mega__cat" data-panel="como">¿Cómo lo hacemos? <span aria-hidden="true">›</span></button>' +
            '</div>' +
            '<div class="mega__links">' +
              '<div class="mega__panel is-active" data-panel="servicios">' +
                '<a href="servicio-ingenieria-de-datos.html">Ingeniería de datos</a>' +
                '<a href="servicio-business-intelligence.html">Business Intelligence y Analítica</a>' +
                '<a href="servicio-inteligencia-artificial.html">Artificial Intelligence y Machine Learning</a>' +
              '</div>' +
              '<div class="mega__panel" data-panel="sectores">' +
                '<a href="sector-retailing.html">Retailing</a>' +
                '<a href="sector-educacion.html">Educación</a>' +
                '<a href="sector-salud.html">Salud</a>' +
                '<a href="sector-turismo.html">Turismo</a>' +
              '</div>' +
              '<div class="mega__panel" data-panel="como">' +
                '<a href="flujo-de-trabajo.html">Flujo de trabajo</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="nav__item has-dropdown">' +
          '<button type="button" class="nav__link nav__trigger' + cur("experiencia") + '" aria-expanded="false" aria-haspopup="true">Experiencia' +
            '<svg class="caret" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' +
          '</button>' +
          '<div class="dropdown">' +
            '<a href="nosotros.html">Nosotros</a>' +
            '<a href="casos-de-exito.html">Casos de éxito</a>' +
          '</div>' +
        '</div>' +

        '<a href="recursos.html" class="nav__link' + cur("recursos") + '">Recursos</a>' +
      '</nav>' +

      '<div class="nav__right">' +
        '<div class="nav__social" aria-label="Redes sociales">' +
          '<a href="https://www.instagram.com/biconsultinglab/" target="_blank" rel="noopener" aria-label="Instagram de BI Consulting Lab">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>' +
          '</a>' +
          '<a href="https://www.youtube.com/@biconsultinglab" target="_blank" rel="noopener" aria-label="YouTube de BI Consulting Lab">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="4"/><polygon points="10 9 16 12 10 15 10 9" fill="currentColor" stroke="none"/></svg>' +
          '</a>' +
          '<a href="https://www.linkedin.com/company/bi-consulting-lab/" target="_blank" rel="noopener" aria-label="LinkedIn de BI Consulting Lab">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M7 10.5V17"/><circle cx="7" cy="7.2" r="1" fill="currentColor" stroke="none"/><path d="M11 17v-6.5"/><path d="M11 13.2a2.4 2.4 0 0 1 4.8 0V17"/></svg>' +
          '</a>' +
        '</div>' +
        '<a href="' + HOME + '#contacto" class="btn btn--sm nav__cta">Solicite una cita</a>' +
      '</div>' +

      '<button class="nav__burger" id="burger" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span><span></span></button>' +
    '</div>' +
  '</header>' +

  '<div class="drawer" id="drawer" aria-hidden="true">' +
    '<nav class="drawer__links" aria-label="Navegación móvil">' +
      '<a href="' + (isHome ? "#hero" : "index.html") + '">Inicio</a>' +
      '<div class="acc">' +
        '<button type="button" class="acc__head" aria-expanded="false">Soluciones <span class="acc__ico" aria-hidden="true">+</span></button>' +
        '<div class="acc__body">' +
          '<span class="acc__group">Servicios</span>' +
          '<a href="servicio-ingenieria-de-datos.html">Ingeniería de datos</a>' +
          '<a href="servicio-business-intelligence.html">Business Intelligence y Analítica</a>' +
          '<a href="servicio-inteligencia-artificial.html">Artificial Intelligence y Machine Learning</a>' +
          '<span class="acc__group">Sectores</span>' +
          '<a href="sector-retailing.html">Retailing</a>' +
          '<a href="sector-educacion.html">Educación</a>' +
          '<a href="sector-salud.html">Salud</a>' +
          '<a href="sector-turismo.html">Turismo</a>' +
          '<span class="acc__group">¿Cómo lo hacemos?</span>' +
          '<a href="flujo-de-trabajo.html">Flujo de trabajo</a>' +
        '</div>' +
      '</div>' +
      '<div class="acc">' +
        '<button type="button" class="acc__head" aria-expanded="false">Experiencia <span class="acc__ico" aria-hidden="true">+</span></button>' +
        '<div class="acc__body">' +
          '<a href="nosotros.html">Nosotros</a>' +
          '<a href="casos-de-exito.html">Casos de éxito</a>' +
        '</div>' +
      '</div>' +
      '<a href="recursos.html">Recursos</a>' +
      '<a href="' + HOME + '#contacto" class="btn btn--full">Solicite una cita</a>' +
      '<div class="drawer__social" aria-label="Redes sociales">' +
        '<a href="https://www.instagram.com/biconsultinglab/" target="_blank" rel="noopener" aria-label="Instagram">' +
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>' +
        '</a>' +
        '<a href="https://www.youtube.com/@biconsultinglab" target="_blank" rel="noopener" aria-label="YouTube">' +
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="4"/><polygon points="10 9 16 12 10 15 10 9" fill="currentColor" stroke="none"/></svg>' +
        '</a>' +
        '<a href="https://www.linkedin.com/company/bi-consulting-lab/" target="_blank" rel="noopener" aria-label="LinkedIn">' +
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M7 10.5V17"/><circle cx="7" cy="7.2" r="1" fill="currentColor" stroke="none"/><path d="M11 17v-6.5"/><path d="M11 13.2a2.4 2.4 0 0 1 4.8 0V17"/></svg>' +
        '</a>' +
      '</div>' +
    '</nav>' +
  '</div>';

  var footer =
  '<footer class="footer">' +
    '<div class="wrap footer__inner">' +
      '<div class="footer__brand">' +
        '<img class="footer__logo" src="assets/img/logo-white.png' + V + '" alt="BI Consulting Lab" width="240" height="59" />' +
        '<p>Datos claros, decisiones inteligentes.</p>' +
        '<div class="footer__social">' +
          '<a href="https://www.instagram.com/biconsultinglab/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>' +
          '<a href="https://www.youtube.com/@biconsultinglab" target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="4"/><polygon points="10 9 16 12 10 15 10 9" fill="currentColor" stroke="none"/></svg></a>' +
          '<a href="https://www.linkedin.com/company/bi-consulting-lab/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M7 10.5V17"/><circle cx="7" cy="7.2" r="1" fill="currentColor" stroke="none"/><path d="M11 17v-6.5"/><path d="M11 13.2a2.4 2.4 0 0 1 4.8 0V17"/></svg></a>' +
        '</div>' +
      '</div>' +
      '<div class="footer__group">' +
        '<h4>Soluciones</h4>' +
        '<a href="servicio-business-intelligence.html">Business Intelligence</a>' +
        '<a href="servicio-inteligencia-artificial.html">IA y Machine Learning</a>' +
        '<a href="servicio-ingenieria-de-datos.html">Ingeniería de datos</a>' +
        '<a href="flujo-de-trabajo.html">Flujo de trabajo</a>' +
      '</div>' +
      '<div class="footer__group">' +
        '<h4>Sectores</h4>' +
        '<a href="sector-retailing.html">Retailing</a>' +
        '<a href="sector-educacion.html">Educación</a>' +
        '<a href="sector-salud.html">Salud</a>' +
        '<a href="sector-turismo.html">Turismo</a>' +
      '</div>' +
      '<div class="footer__group">' +
        '<h4>Compañía</h4>' +
        '<a href="nosotros.html">Nosotros</a>' +
        '<a href="casos-de-exito.html">Casos de éxito</a>' +
        '<a href="recursos.html">Recursos</a>' +
        '<a href="' + HOME + '#contacto">Contacto</a>' +
      '</div>' +
      '<div class="footer__group footer__contact">' +
        '<h4>Contacto</h4>' +
        '<a href="mailto:sales@biconsultinglab.com">sales@biconsultinglab.com</a>' +
        '<a href="tel:+573009121854">+57 300 912 1854</a>' +
        '<a href="https://wa.me/573009121854" target="_blank" rel="noopener">WhatsApp</a>' +
      '</div>' +
    '</div>' +
    '<div class="footer__bottom"><span>ALL RIGHTS RESERVED © 2025 BI CONSULTING LAB</span></div>' +
  '</footer>';

  function inject() {
    var h = document.getElementById("site-header");
    if (h && !h.children.length) h.innerHTML = header;
    var f = document.getElementById("site-footer");
    if (f && !f.children.length) f.innerHTML = footer;
    if (!document.querySelector(".cursor-glow")) {
      var c = document.createElement("div");
      c.className = "cursor-glow";
      c.setAttribute("aria-hidden", "true");
      document.body.insertBefore(c, document.body.firstChild);
    }
    // Site-wide neural-network background (one fixed canvas behind everything).
    if (!document.getElementById("net")) {
      var cv = document.createElement("canvas");
      cv.id = "net";
      cv.className = "net-bg";
      cv.setAttribute("aria-hidden", "true");
      document.body.insertBefore(cv, document.body.firstChild);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
