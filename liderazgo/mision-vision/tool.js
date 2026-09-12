/* Misión, visión, valores — ImpactTools */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var v = function (id) { return ($(id).value || "").trim().replace(/\.$/, ""); };
  var lc = function (s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : ""; };
  var uc = function (s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; };

  function build() {
    var prop = v("f-prop");
    var pers = v("f-pers");
    var prob = v("f-prob");
    var fut = v("f-fut");
    var imp = v("f-imp");
    var val = v("f-val");
    if (!prop && !fut) { window.toast("Cuéntame el propósito o el futuro que quieres ver"); return null; }

    var values = val ? val.split(/[,;]/).map(function (s) { return s.trim(); }).filter(Boolean) : ["comunidad", "aprendizaje", "transparencia"];

    var out = [];
    out.push("=== MISIÓN ===");
    var mision = "Existimos para " + lc(prop || "crear cambio positivo") +
      (pers ? ", acompañando a " + lc(pers) : "") +
      (prob ? " y abordando " + lc(prob) : "") + ".";
    out.push(mision);
    out.push("");
    out.push("=== VISIÓN ===");
    var vision = "Aspiramos a " + lc(fut || "ver un mundo donde este problema deje de existir") +
      (imp ? ", con un impacto tangible: " + lc(imp) : "") + ".";
    out.push(vision);
    out.push("");
    out.push("=== VALORES ===");
    values.forEach(function (v) {
      out.push("• " + uc(v) + " — " + valuePhrase(v));
    });
    out.push("");
    out.push("=== VERSIÓN CORTA ===");
    var corta = pers
      ? "Trabajamos con " + lc(pers) + " para " + lc(prop || "avanzar hacia " + lc(fut || "un futuro mejor")) + "."
      : "Trabajamos para " + lc(prop || "avanzar hacia " + lc(fut || "un futuro mejor")) + ".";
    out.push(corta);

    return out.join("\n");
  }

  function valuePhrase(word) {
    var lc = word.toLowerCase();
    var map = {
      comunidad: "trabajamos siempre con y para las personas.",
      cuidado: "priorizamos el bienestar sobre la prisa.",
      transparencia: "abrimos procesos, datos y decisiones.",
      aprendizaje: "revisamos lo que hicimos y ajustamos.",
      integridad: "hacemos lo correcto aunque cueste.",
      colaboración: "sumamos con otros antes que competir.",
      justicia: "priorizamos a quienes más lo necesitan.",
      equidad: "reconocemos que no todos partimos del mismo lugar.",
      empatía: "escuchamos antes de proponer.",
      innovación: "probamos formas nuevas cuando las viejas ya no sirven.",
      responsabilidad: "cerramos los compromisos que asumimos.",
      sostenibilidad: "decidimos pensando en el largo plazo."
    };
    return map[lc] || "guía nuestra forma de trabajar todos los días.";
  }

  function gen() {
    var t = build();
    if (!t) return;
    $("result-content").innerText = t;
    $("result-box").hidden = false;
    $("result-box").scrollIntoView({ behavior: "smooth", block: "nearest" });
    window.impactAnalytics.track("tool_completed", { tool: "mision-vision" });
  }

  function reset() {
    ["f-prop", "f-pers", "f-prob", "f-fut", "f-imp", "f-val"].forEach(function (id) { $(id).value = ""; });
    $("result-box").hidden = true;
    window.impactAnalytics.track("tool_reset", { tool: "mision-vision" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    $("btn-gen").addEventListener("click", function () {
      window.impactAnalytics.track("tool_generate_click", { tool: "mision-vision" });
      gen();
    });
    $("btn-reset").addEventListener("click", reset);
    $("btn-copy").addEventListener("click", function () { window.copyText($("result-content").innerText, "Copiado"); });
    $("btn-download").addEventListener("click", function () { window.downloadText("mision-vision.txt", $("result-content").innerText); });
  });
})();
