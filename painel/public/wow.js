/* wow.js — camada visual do Painel AIOS: cena 3D (Three.js) + motion (GSAP).
   Defensivo de propósito: se a CDN não carregar (offline), nada quebra —
   o painel continua funcionando com o visual base. Não toca na lógica do app.js. */
(function () {
  "use strict";

  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";
  var hasTHREE = typeof window.THREE !== "undefined";

  if (hasGSAP) {
    document.documentElement.classList.add("wow");
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  }

  /* ───────── 1) Cena 3D no hero — núcleo + nebulosa com glow ───────── */
  // textura circular suave (dá efeito "bloom" em cada ponto)
  function discoTex() {
    var s = 64, c = document.createElement("canvas");
    c.width = c.height = s;
    var x = c.getContext("2d");
    var g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(255,255,255,.85)");
    g.addColorStop(0.55, "rgba(255,255,255,.25)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g; x.fillRect(0, 0, s, s);
    var t = new THREE.CanvasTexture(c);
    return t;
  }

  function cloud(n, rMin, rMax, size, opacity, sprite) {
    var pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
    var cA = new THREE.Color(0x6d8bff), cB = new THREE.Color(0xff8a4c),
        cC = new THREE.Color(0xffffff), cD = new THREE.Color(0xa274ff);
    for (var i = 0; i < n; i++) {
      var r = rMin + Math.random() * (rMax - rMin);
      var t = Math.random() * Math.PI * 2;
      var p = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(p) * Math.cos(t);
      pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      pos[i * 3 + 2] = r * Math.cos(p);
      var k = Math.random();
      var c = k < 0.42 ? cA : k < 0.68 ? cD : k < 0.86 ? cB : cC;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return new THREE.Points(g, new THREE.PointsMaterial({
      size: size, map: sprite, vertexColors: true, transparent: true, opacity: opacity,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    }));
  }

  function init3D() {
    if (!hasTHREE || reduce) return;
    var canvas = document.getElementById("hero-3d");
    if (!canvas) return;
    var hero = canvas.parentElement;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
    cam.position.z = 15;

    var group = new THREE.Group();
    group.position.x = 2.4;            // desloca o núcleo pra direita do hero
    scene.add(group);

    var sprite = discoTex();

    // núcleo: dois wireframes (índigo + laranja) que respiram
    var core = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(4.0, 1)),
      new THREE.LineBasicMaterial({ color: 0x6d8bff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    group.add(core);
    var core2 = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.5, 0)),
      new THREE.LineBasicMaterial({ color: 0xff8a4c, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    group.add(core2);

    // casca de pontos na superfície do núcleo + nebulosa externa
    var shell = cloud(360, 4.0, 4.15, 0.34, 0.95, sprite);
    var neb = cloud(620, 6.5, 15, 0.22, 0.7, sprite);
    group.add(shell);
    group.add(neb);

    function resize() {
      var w = hero.clientWidth, h = hero.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    }
    resize();
    requestAnimationFrame(resize);          // 2ª medição após o 1º frame
    window.addEventListener("resize", resize);
    // o hero cresce quando o app.js injeta as métricas → reajusta o aspect
    // sempre que o card mudar de tamanho (corrige o "achatado" no reload).
    if (window.ResizeObserver) { new ResizeObserver(resize).observe(hero); }

    // parallax suave com o mouse
    var tx = 0, ty = 0, mx = 0, my = 0, frame = 0;
    hero.addEventListener("pointermove", function (e) {
      var rect = hero.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });
    hero.addEventListener("pointerleave", function () { tx = 0; ty = 0; });

    function loop() {
      requestAnimationFrame(loop);
      frame += 1;
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
      group.rotation.y += 0.0015;
      group.rotation.x += 0.0007;
      core.rotation.z += 0.0011;
      core2.rotation.x -= 0.0016;
      neb.rotation.y -= 0.0006;
      // respiração do núcleo
      var pulse = 1 + Math.sin(frame * 0.012) * 0.03;
      core.scale.setScalar(pulse);
      core2.scale.setScalar(2 - pulse);
      // deriva da câmera (parallax)
      cam.position.x += (mx * 2.4 - cam.position.x) * 0.05;
      cam.position.y += (-my * 1.6 - cam.position.y) * 0.05;
      cam.lookAt(group.position.x * 0.5, 0, 0);
      renderer.render(scene, cam);
    }
    loop();
  }

  /* ───────── 2) Entrada em cascata (shell + hero) ───────── */
  function intro() {
    if (!hasGSAP || reduce) return;
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".sidebar", { x: -32, opacity: 0, duration: 0.7 }, 0)
      .from(".sidebar .nav a", { x: -14, opacity: 0, stagger: 0.04, duration: 0.4 }, 0.15)
      .from(".topbar > *", { y: -14, opacity: 0, stagger: 0.05, duration: 0.45 }, 0.1)
      .from(".hero", { y: 26, opacity: 0, scale: 0.985, transformOrigin: "50% 50%", duration: 0.8 }, 0.1)
      .from(".hero .eyebrow, .hero h1, .hero .lead", { y: 18, opacity: 0, stagger: 0.1, duration: 0.6 }, 0.32)
      .from("#hero-3d", { opacity: 0, duration: 1.6 }, 0.2)
      .from(".recs", { y: 24, opacity: 0, duration: 0.7 }, 0.4);
  }

  /* ───────── 3) Revelar seções ao rolar (1x) + contadores (1x) ───────── */
  var revealed = false, counted = false;

  function reveal() {
    if (!hasGSAP || reduce || revealed) return;
    revealed = true;

    gsap.from(".kpis .kpi", {
      y: 26, opacity: 0, duration: 0.6, stagger: 0.07, ease: "power3.out",
      scrollTrigger: { trigger: ".kpis", start: "top 88%" }
    });
    ["#sec-automacoes", "#sec-twoup", "#sec-decisoes"].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      gsap.from(el, {
        y: 34, opacity: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      });
    });
    gsap.from("#sec-automacoes tbody tr", {
      x: -18, opacity: 0, duration: 0.5, stagger: 0.05, ease: "power2.out",
      scrollTrigger: { trigger: "#sec-automacoes", start: "top 80%" }
    });
    gsap.from(".caps .cap", {
      y: 18, opacity: 0, duration: 0.45, stagger: 0.05, ease: "power3.out",
      scrollTrigger: { trigger: ".caps", start: "top 90%" }
    });

    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  function countUp() {
    if (!hasGSAP || reduce || counted) return;
    counted = true;
    document.querySelectorAll(".kpi .kv, .hmetric .v").forEach(function (el) {
      var html = el.innerHTML;
      var m = html.match(/\d[\d.]*/);          // 1º número (ignora "/8", ":", "small")
      if (!m) return;
      var target = parseFloat(m[0]);
      if (!isFinite(target) || target === 0) return;
      var isInt = Number.isInteger(target);
      var o = { v: 0 };
      gsap.to(o, {
        v: target, duration: 1.2, ease: "power2.out",
        onUpdate: function () {
          el.innerHTML = html.replace(m[0], isInt ? Math.round(o.v) : o.v.toFixed(1));
        }
      });
    });
  }

  function afterRender() { reveal(); countUp(); }

  // engancha no renderTudo do app.js (função global de script clássico).
  function hookRender() {
    if (typeof window.renderTudo !== "function") return false;
    var orig = window.renderTudo;
    window.renderTudo = function () {
      var r = orig.apply(this, arguments);
      requestAnimationFrame(afterRender);
      return r;
    };
    return true;
  }

  // backup: se o hook não pegar, observa o 1º preenchimento dos KPIs.
  function watchFallback() {
    var alvo = document.getElementById("kpis");
    if (!alvo || typeof MutationObserver === "undefined") return;
    var obs = new MutationObserver(function () {
      if (alvo.children.length) { obs.disconnect(); afterRender(); }
    });
    obs.observe(alvo, { childList: true });
  }

  function boot() {
    init3D();
    intro();
    hookRender();
    watchFallback();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
