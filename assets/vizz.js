/* vizz — filtres, aperçus en direct, visionneuse, comparaison. Rien n'est envoyé nulle part. */
(function () {
  "use strict";
  var S = window.VIZZ || [], byId = {}; S.forEach(function (s) { byId[s.id] = s; });
  var root = document.documentElement, local = location.protocol === "file:";
  function $(q, c) { return (c || document).querySelector(q); }
  function $$(q, c) { return Array.prototype.slice.call((c || document).querySelectorAll(q)); }

  /* thème */
  var tb = $(".theme");
  tb.addEventListener("click", function () {
    var dark = root.getAttribute("data-theme") ? root.getAttribute("data-theme") === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", dark ? "light" : "dark");
    try { localStorage.setItem("vizz-theme", dark ? "light" : "dark"); } catch (e) {}
  });

  /* filtres */
  var cards = $$(".card"), count = $("[data-count]");
  function filt(v) {
    var n = 0;
    cards.forEach(function (c) { var ok = v === "*" || (" " + c.getAttribute("data-ton") + " ").indexOf(" " + v + " ") !== -1; c.hidden = !ok; if (ok) n++; });
    count.textContent = n + " site" + (n > 1 ? "s" : "") + " affiché" + (n > 1 ? "s" : "") + " sur " + cards.length;
  }
  $$(".chip").forEach(function (b) {
    b.addEventListener("click", function () { $$(".chip").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); filt(b.getAttribute("data-ton")); });
  });
  filt("*");

  /* aperçus en direct */
  var live = $("[data-live]");
  function fit() { $$(".screen iframe").forEach(function (f) { f.style.transform = "scale(" + (f.parentNode.clientWidth / 1366) + ")"; }); }
  if (local) { live.disabled = true; live.parentNode.title = "Disponible une fois le site publié"; }
  live.addEventListener("change", function () {
    cards.forEach(function (c) {
      var sc = $(".screen", c), s = byId[c.getAttribute("data-site")];
      if (live.checked) {
        sc._orig = sc.innerHTML;
        sc.innerHTML = "<iframe src='" + s.path + "' title='Aperçu en direct : " + s.court.replace(/'/g, "&#39;") + "' loading='lazy' tabindex='-1' aria-hidden='true'></iframe>";
      } else if (sc._orig) sc.innerHTML = sc._orig;
    });
    fit();
  });
  addEventListener("resize", fit);

  /* visionneuse */
  var dlg = $(".viewer"), cur = null, second = null, split = false;
  var fa = $("[data-frame='a']"), fb = $("[data-frame='b']"), pb = $("[data-pane='b']"), ph = $("[data-pane='a'] .pane-h");
  var selA = $("[data-pane-sel='a']"), selB = $("[data-pane-sel='b']"), openA = $("[data-open]"), splitBtn = $("[data-split]");
  var ids = S.map(function (s) { return s.id; });
  if (local) $("[data-offline]").hidden = false;
  function load(frame, id) {
    var s = byId[id], L = $("[data-loading='" + frame.getAttribute("data-frame") + "']");
    if (local) return;
    if (frame.getAttribute("data-id") === id) return;
    L.hidden = false; frame.setAttribute("data-id", id);
    frame.title = "Aperçu : " + s.titre; frame.src = s.path;
  }
  [fa, fb].forEach(function (f) { f.addEventListener("load", function () { $("[data-loading='" + f.getAttribute("data-frame") + "']").hidden = true; }); });
  function paint() {
    var s = byId[cur];
    dlg.style.setProperty("--c", s.couleur);
    $("[data-v-title]").textContent = split ? byId[cur].court + " · " + byId[second].court : s.titre;
    $$(".vtabs button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-tab") === cur ? "true" : "false"); });
    openA.href = s.path; selA.value = cur;
    pb.hidden = !split; ph.hidden = !split; splitBtn.setAttribute("aria-pressed", split ? "true" : "false");
    load(fa, cur); if (split) { selB.value = second; load(fb, second); }
    try { history.replaceState(null, "", split ? "#comparer/" + cur + "/" + second : "#voir/" + cur); } catch (e) {}
  }
  function show(id, other) {
    cur = byId[id] ? id : ids[0];
    split = !!other; second = other && byId[other] ? other : (second || ids[(ids.indexOf(cur) + 1) % ids.length]);
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); }
    paint();
  }
  function step(d) { cur = ids[(ids.indexOf(cur) + d + ids.length) % ids.length]; if (split && cur === second) second = ids[(ids.indexOf(cur) + 1) % ids.length]; paint(); }
  document.addEventListener("click", function (e) {
    var v = e.target.closest("[data-view]"); if (v) { show(v.getAttribute("data-view")); return; }
    var p = e.target.closest("[data-pair]"); if (p) { var ab = p.getAttribute("data-pair").split(","); show(ab[0], ab[1]); }
  });
  $$(".vtabs button").forEach(function (b) { b.addEventListener("click", function () { cur = b.getAttribute("data-tab"); if (split && cur === second) second = ids[(ids.indexOf(cur) + 1) % ids.length]; paint(); }); });
  $("[data-prev]").addEventListener("click", function () { step(-1); });
  $("[data-next]").addEventListener("click", function () { step(1); });
  splitBtn.addEventListener("click", function () { split = !split; if (split && (!second || second === cur)) second = ids[(ids.indexOf(cur) + 1) % ids.length]; paint(); });
  selA.addEventListener("change", function () { cur = selA.value; paint(); });
  selB.addEventListener("change", function () { second = selB.value; paint(); });
  $("[data-close]").addEventListener("click", function () { dlg.close ? dlg.close() : dlg.removeAttribute("open"); });
  dlg.addEventListener("close", function () { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} });
  $$(".seg button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".seg button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      $$(".dev").forEach(function (d) { d.style.width = b.getAttribute("data-w"); });
    });
  });
  document.addEventListener("keydown", function (e) {
    if (!dlg.open || /INPUT|SELECT|TEXTAREA/.test((e.target.tagName || ""))) return;
    if (e.key === "ArrowRight") { step(1); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { step(-1); e.preventDefault(); }
    else if (e.key === "c" || e.key === "C") { splitBtn.click(); }
  });

  /* comparer depuis la page */
  var ca = $("[data-cmp-a]"), cb = $("[data-cmp-b]"); ca.value = "opus"; cb.value = "greco";
  $("[data-cmp-go]").addEventListener("click", function () { show(ca.value, ca.value === cb.value ? null : cb.value); });

  /* lien direct : #voir/greco ou #comparer/opus/greco */
  var m = location.hash.match(/^#(voir|comparer)\/([\w-]+)(?:\/([\w-]+))?/);
  if (m && byId[m[2]]) show(m[2], m[1] === "comparer" ? m[3] : null);
})();
