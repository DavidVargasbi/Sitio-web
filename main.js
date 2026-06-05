/* =========================================================
   BI CONSULTING LAB — main.js
   Vanilla, zero-dependency. IIFE pattern. Each init wrapped
   in safe() so one failure never breaks the rest.
   ========================================================= */
(function () {
  "use strict";

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[bcl] init failed:", name, e); }
  }

  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- SPLASH (double safety net) ---------- */
  function initSplash() {
    var splash = document.getElementById("splash");
    if (!splash) return;
    function hide() {
      if (splash.classList.contains("is-done")) return;
      splash.classList.add("is-done");
      setTimeout(function () { if (splash.parentNode) splash.parentNode.removeChild(splash); }, 900);
    }
    // Show the neural-network loader for ~3 seconds, then reveal the site.
    setTimeout(hide, 3000);
    // Hard safety net in case anything stalls.
    setTimeout(hide, 6000);
  }

  /* ---------- SPLASH NEURAL BURST (full-screen loader animation) ---------- */
  function initSplashNeural() {
    var canvas = document.getElementById("splashNet");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var w, h, cx, cy, branches = [], particles = [], start = null, raf = 0, alive = true;
    function rnd(a, b) { return a + Math.random() * (b - a); }

    function makeBranch(ox, oy, ang, len, segs, sub) {
      var pts = [{ x: ox, y: oy }], a = ang, r = Math.sqrt(ox * ox + oy * oy);
      for (var s = 1; s <= segs; s++) {
        r += len / segs * rnd(0.7, 1.12);
        a += rnd(-0.2, 0.2);
        pts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
      }
      return { pts: pts, tw: rnd(0, Math.PI * 2), sub: !!sub };
    }

    function build() {
      w = canvas.clientWidth || window.innerWidth;
      h = canvas.clientHeight || window.innerHeight;
      canvas.width = w * DPR; canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      cx = w / 2; cy = h / 2;
      var R = Math.min(w, h) * 0.46;
      branches = [];
      var N = Math.floor(Math.max(60, Math.min(130, (w * h) / 14000)));
      for (var i = 0; i < N; i++) {
        var ang = (i / N) * Math.PI * 2 + rnd(-0.13, 0.13);
        var len = R * rnd(0.5, 1.05);
        var segs = 5 + Math.floor(rnd(0, 4));
        var br = makeBranch(0, 0, ang, len, segs, false);
        branches.push(br);
        if (Math.random() < 0.55) {
          var k = 2 + Math.floor(rnd(0, br.pts.length - 2));
          var base = br.pts[k];
          var a2 = Math.atan2(base.y, base.x) + rnd(-0.8, 0.8);
          branches.push(makeBranch(base.x, base.y, a2, len * 0.5, 2 + Math.floor(rnd(0, 3)), true));
        }
      }
      particles = [];
      var P = Math.floor(Math.min(100, (w * h) / 20000));
      for (var p = 0; p < P; p++) {
        particles.push({ x: Math.random() * w, y: Math.random() * h, vx: rnd(-0.25, 0.25), vy: rnd(-0.25, 0.25), r: rnd(0.6, 1.8) });
      }
    }

    function draw(ts) {
      if (!alive) return;
      if (!start) start = ts;
      var el = (ts - start) / 1000;
      var g = Math.min(el / 1.5, 1);
      var eg = 1 - Math.pow(1 - g, 3);
      ctx.clearRect(0, 0, w, h);

      // ambient web
      for (var i = 0; i < particles.length; i++) {
        var n = particles[i]; n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      ctx.lineWidth = 0.6;
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x, dy = particles[a].y - particles[b].y;
          var d = dx * dx + dy * dy;
          if (d < 14400) {
            var al = (1 - Math.sqrt(d) / 120) * 0.12;
            ctx.strokeStyle = "rgba(182,182,162," + al + ")";
            ctx.beginPath(); ctx.moveTo(particles[a].x, particles[a].y); ctx.lineTo(particles[b].x, particles[b].y); ctx.stroke();
          }
        }
      }
      for (var i = 0; i < particles.length; i++) {
        var n = particles[i];
        ctx.fillStyle = "rgba(182,182,162,0.45)";
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.2832); ctx.fill();
      }

      // central neural burst (additive glow)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(el * 0.05);
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < branches.length; i++) {
        var br = branches[i], pts = br.pts;
        var budget = eg * (pts.length - 1);
        ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
        var last = pts[0];
        for (var s = 1; s < pts.length; s++) {
          if (s <= budget) { ctx.lineTo(pts[s].x, pts[s].y); last = pts[s]; }
          else {
            var f = budget - (s - 1);
            if (f > 0) {
              var px = pts[s - 1].x + (pts[s].x - pts[s - 1].x) * f;
              var py = pts[s - 1].y + (pts[s].y - pts[s - 1].y) * f;
              ctx.lineTo(px, py); last = { x: px, y: py };
            }
            break;
          }
        }
        var twk = 0.5 + 0.5 * Math.sin(el * 2 + br.tw);
        ctx.lineWidth = br.sub ? 0.8 : 1.3;
        ctx.strokeStyle = "rgba(200,39,111," + (0.18 + 0.26 * twk) + ")";
        ctx.stroke();
        var tnode = 0.55 + 0.45 * Math.sin(el * 3 + br.tw);
        ctx.beginPath(); ctx.arc(last.x, last.y, br.sub ? 1.0 : 1.7, 0, 6.2832);
        ctx.fillStyle = "rgba(232,90,155," + (0.55 * tnode * eg) + ")"; ctx.fill();
      }
      ctx.restore();

      // pulsing core
      var pulse = 0.85 + 0.15 * Math.sin(el * 2.4);
      var coreR = Math.min(w, h) * 0.17 * pulse * (0.45 + 0.55 * eg);
      var grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      grd.addColorStop(0, "rgba(255,255,255," + (0.9 * eg) + ")");
      grd.addColorStop(0.22, "rgba(232,90,155," + (0.6 * eg) + ")");
      grd.addColorStop(1, "rgba(200,39,111,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(cx, cy, coreR, 0, 6.2832); ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(draw);
    }

    function stop() { alive = false; if (raf) cancelAnimationFrame(raf); }
    window.addEventListener("resize", build);
    build();
    raf = requestAnimationFrame(draw);
    // free CPU once the splash is gone
    setTimeout(stop, 4500);
  }

  /* ---------- NAV: scroll state + mobile drawer ---------- */
  function initNav() {
    var nav = document.getElementById("nav");
    var burger = document.getElementById("burger");
    var drawer = document.getElementById("drawer");

    function onScroll() {
      if (!nav) return;
      if (window.scrollY > 30) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (burger && drawer) {
      function toggle(open) {
        var willOpen = open !== undefined ? open : !drawer.classList.contains("open");
        drawer.classList.toggle("open", willOpen);
        burger.classList.toggle("open", willOpen);
        burger.setAttribute("aria-expanded", willOpen ? "true" : "false");
        drawer.setAttribute("aria-hidden", willOpen ? "false" : "true");
        document.body.style.overflow = willOpen ? "hidden" : "";
      }
      burger.addEventListener("click", function () { toggle(); });
      drawer.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { toggle(false); });
      });
    }
  }

  /* ---------- NAV MENUS (mega panel switch, dropdowns, mobile accordions) ---------- */
  function initMenus() {
    // Mega menu: switch the right-hand panel when a category is hovered/focused.
    Array.prototype.forEach.call(document.querySelectorAll(".mega"), function (mega) {
      var cats = mega.querySelectorAll(".mega__cat");
      var panels = mega.querySelectorAll(".mega__panel");
      Array.prototype.forEach.call(cats, function (cat) {
        function activate() {
          Array.prototype.forEach.call(cats, function (c) { c.classList.remove("is-active"); });
          Array.prototype.forEach.call(panels, function (p) { p.classList.remove("is-active"); });
          cat.classList.add("is-active");
          var panel = mega.querySelector('.mega__panel[data-panel="' + cat.getAttribute("data-panel") + '"]');
          if (panel) panel.classList.add("is-active");
        }
        cat.addEventListener("mouseenter", activate);
        cat.addEventListener("focus", activate);
        cat.addEventListener("click", activate);
      });
    });

    // Keep aria-expanded in sync (CSS opens on hover/focus-within).
    Array.prototype.forEach.call(document.querySelectorAll(".nav__item"), function (item) {
      var trigger = item.querySelector(".nav__trigger");
      if (!trigger) return;
      function set(open) { trigger.setAttribute("aria-expanded", open ? "true" : "false"); }
      item.addEventListener("mouseenter", function () { set(true); });
      item.addEventListener("mouseleave", function () { set(false); });
      item.addEventListener("focusin", function () { set(true); });
      item.addEventListener("focusout", function () { set(false); });
      // prevent the dummy trigger button from doing anything on click
      trigger.addEventListener("click", function (e) { e.preventDefault(); });
    });

    // Mobile accordions inside the drawer.
    Array.prototype.forEach.call(document.querySelectorAll(".acc__head"), function (head) {
      head.addEventListener("click", function () {
        var body = head.nextElementSibling;
        if (!body) return;
        var open = body.classList.toggle("open");
        head.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  /* ---------- SMOOTH ANCHOR SCROLL (native) ---------- */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (!id || id === "#") return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  function initReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          // small stagger based on position among siblings
          var sibs = Array.prototype.slice.call(el.parentNode.children).filter(function (c) {
            return c.classList && c.classList.contains("reveal");
          });
          var i = sibs.indexOf(el);
          el.style.transitionDelay = Math.min(i * 80, 320) + "ms";
          el.classList.add("in");
          io.unobserve(el);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -8% 0px" });

    els.forEach(function (el) { io.observe(el); });

    // SAFETY: reveal anything still hidden after 6s
    setTimeout(function () {
      els.forEach(function (el) { if (!el.classList.contains("in")) el.classList.add("in"); });
    }, 6000);
  }

  /* ---------- COUNTERS ---------- */
  function initCounters() {
    var nums = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
    if (!nums.length) return;

    function format(el, val) {
      var fmt = el.getAttribute("data-format");
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      var out;
      if (fmt === "k") {
        out = val >= 1000 ? Math.round(val / 1000) + "K" : Math.round(val);
      } else {
        out = Math.round(val).toString();
        // thousands separator for big plain numbers (e.g. years stay raw if <=4 digits? keep raw)
      }
      el.textContent = prefix + out + suffix;
    }

    function run(el) {
      var target = parseFloat(el.getAttribute("data-count")) || 0;
      var dur = 1500, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        format(el, target * eased);
        if (p < 1) requestAnimationFrame(step);
        else format(el, target);
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ---------- CURSOR GLOW (desktop fine pointers only) ---------- */
  function initCursor() {
    if (!window.matchMedia || !window.matchMedia("(pointer:fine)").matches) return;
    var glow = document.querySelector(".cursor-glow");
    if (!glow) return;
    var x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y;
    window.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      document.body.classList.add("cursor-on");
    });
    (function loop() {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      glow.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- MAGNETIC BUTTONS ---------- */
  function initMagnetic() {
    if (!window.matchMedia || !window.matchMedia("(pointer:fine)").matches) return;
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + mx * 0.22 + "px," + my * 0.3 + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- TILT + GLOW POSITION on cards ---------- */
  function initTilt() {
    if (!window.matchMedia || !window.matchMedia("(pointer:fine)").matches) return;
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var rx = (py - 0.5) * -6;
        var ry = (px - 0.5) * 6;
        el.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-6px)";
        el.style.setProperty("--mx", px * 100 + "%");
        el.style.setProperty("--my", py * 100 + "%");
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- HERO PARTICLE NETWORK (canvas) ---------- */
  function initNetwork() {
    var canvas = document.getElementById("net");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var w, h, nodes = [], mouse = { x: -9999, y: -9999 };
    var running = true;

    function size() {
      var rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * DPR; canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      build();
    }
    function build() {
      var density = Math.min(Math.floor((w * h) / 14000), 90);
      if (window.innerWidth < 680) density = Math.min(density, 38);
      nodes = [];
      for (var i = 0; i < density; i++) {
        nodes.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.6
        });
      }
    }
    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      var maxDist = 130;
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // mouse attraction (subtle)
        var dxm = n.x - mouse.x, dym = n.y - mouse.y;
        var dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < 160) { n.x += dxm / dm * 0.5; n.y += dym / dm * 0.5; }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,39,111,0.85)";
        ctx.fill();
      }
      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxDist) {
            var alpha = (1 - d / maxDist) * 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.strokeStyle = "rgba(182,182,162," + alpha * 0.6 + ")";
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    window.addEventListener("mousemove", function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    });
    window.addEventListener("resize", size);

    // pause when hero off-screen (perf)
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (e) {
          running = e.isIntersecting;
          if (running) draw();
        });
      }, { threshold: 0 });
      io.observe(canvas);
    }

    size();
    if (!prefersReduced) draw();
    else { // static single frame for reduced motion
      running = true; draw(); running = false;
    }
  }

  /* ---------- 3D CARD TURN ON SCROLL (cards rotate into place) ---------- */
  function initCard3D() {
    var els = Array.prototype.slice.call(document.querySelectorAll("[data-card3d]"));
    if (!els.length) return;

    // Reduced motion: snap cards flat, no rotation.
    if (prefersReduced) {
      els.forEach(function (el) { el.style.setProperty("--p", "1"); });
      return;
    }

    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var start = vh * 0.96;  // p = 0 when the card top is near the bottom of the screen
      var end = vh * 0.52;    // p = 1 once the card has turned to face the viewer
      for (var i = 0; i < els.length; i++) {
        var rect = els[i].getBoundingClientRect();
        var p = (start - rect.top) / (start - end);
        if (p < 0) p = 0; else if (p > 1) p = 1;
        // easeOutCubic — quick, smooth settle
        var e = 1 - Math.pow(1 - p, 3);
        els[i].style.setProperty("--p", e.toFixed(3));
      }
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update(); // set initial state
  }

  /* ---------- AMBIENT LOOP VIDEOS (play when in view, pause when not) ---------- */
  function initAmbientVideos() {
    var vids = Array.prototype.slice.call(document.querySelectorAll(".neuro__frame video, .about__media video"));
    if (!vids.length) return;
    function tryPlay(v) { v.muted = true; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) tryPlay(e.target);
          else { try { e.target.pause(); } catch (err) {} }
        });
      }, { threshold: 0.15 });
      vids.forEach(function (v) { io.observe(v); });
    } else {
      vids.forEach(tryPlay);
    }
  }

  /* ---------- YOUTUBE FACADE (load player only on click) ---------- */
  function initYouTube() {
    Array.prototype.forEach.call(document.querySelectorAll(".yt-facade"), function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-yt");
        if (!id) return;
        var start = btn.getAttribute("data-start");
        var ifr = document.createElement("iframe");
        ifr.src = "https://www.youtube-nocookie.com/embed/" + id +
          "?autoplay=1&rel=0&modestbranding=1" + (start ? "&start=" + start : "");
        ifr.title = "Video — BI Consulting Lab";
        ifr.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; web-share");
        ifr.setAttribute("allowfullscreen", "");
        ifr.setAttribute("loading", "lazy");
        if (btn.parentNode) btn.parentNode.replaceChild(ifr, btn);
      });
    });
  }

  /* ---------- CONTACT FORM (mailto bridge, no backend) ---------- */
  function initForm() {
    var form = document.getElementById("contactForm");
    var note = document.getElementById("formNote");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = (form.nombre.value || "").trim();
      var email = (form.email.value || "").trim();
      var empresa = (form.empresa.value || "").trim();
      var mensaje = (form.mensaje.value || "").trim();

      if (!nombre || !email || !mensaje) {
        if (note) { note.textContent = "Por favor completa nombre, correo y mensaje."; note.className = "form__note err"; }
        return;
      }
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email)) {
        if (note) { note.textContent = "El correo no parece válido."; note.className = "form__note err"; }
        return;
      }

      var subject = "Solicitud de información — " + nombre + (empresa ? " (" + empresa + ")" : "");
      var body =
        "Nombre: " + nombre + "\n" +
        "Correo: " + email + "\n" +
        "Empresa: " + (empresa || "—") + "\n\n" +
        "Mensaje:\n" + mensaje;
      var href = "mailto:sales@biconsultinglab.com?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      window.location.href = href;
      if (note) {
        note.textContent = "Abriendo tu correo… si no se abre, escríbenos a sales@biconsultinglab.com";
        note.className = "form__note ok";
      }
      form.reset();
    });
  }

  /* ---------- YEAR (footer keeps original text, no override needed) ---------- */

  /* ---------- BOOT ---------- */
  function boot() {
    safe(initNav, "nav");
    safe(initMenus, "menus");
    safe(initAnchors, "anchors");
    safe(initReveal, "reveal");
    safe(initCounters, "counters");
    safe(initCursor, "cursor");
    safe(initMagnetic, "magnetic");
    safe(initTilt, "tilt");
    safe(initNetwork, "network");
    safe(initCard3D, "card-3d");
    safe(initAmbientVideos, "ambient-videos");
    safe(initYouTube, "youtube");
    safe(initForm, "form");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
