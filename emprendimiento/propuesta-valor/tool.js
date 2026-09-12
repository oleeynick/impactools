/* Generador de Propuesta de Valor — ImpactTools */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var v = function (id) { return ($(id).value || "").trim().replace(/\.$/, ""); };
  var lc = function (s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : ""; };
  var uc = function (s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; };

  function build() {
    var vendes = v("f-vendes");
    var quien = v("f-a-quien");
    var problema = v("f-problema");
    var como = v("f-como");
    var beneficio = v("f-beneficio");
    var diferencia = v("f-diferencia");

    if (!vendes || !quien) {
      window.toast("Cuéntame al menos qué haces y a quién");
      return null;
    }

    var versions = [];

    // v1 — Clásica
    versions.push({
      title: "Versión 1 · Estructura clásica",
      text: "Ayudamos a " + lc(quien) + " a " + (lc(beneficio) || "lograr " + lc(problema)) + " mediante " + lc(como || vendes) + (diferencia ? ", con " + lc(diferencia) : "") + "."
    });

    // v2 — Producto primero
    versions.push({
      title: "Versión 2 · Producto primero",
      text: uc(vendes) + " para " + lc(quien) + " que quieren " + lc(beneficio || "resolver " + lc(problema)) + "."
    });

    // v3 — Enfoque problema
    versions.push({
      title: "Versión 3 · Enfoque en el problema",
      text: (problema ? "¿Cansado de " + lc(problema) + "? " : "") + uc(vendes) + " te ayuda a " + lc(beneficio || "resolverlo") + (diferencia ? ", " + lc(diferencia) : "") + "."
    });

    // v4 — Corta y contundente
    var shortText = uc(vendes) + (diferencia ? " " + lc(diferencia) : "") + " para " + lc(quien) + ".";
    versions.push({
      title: "Versión 4 · Corta y directa",
      text: shortText
    });

    // v5 — Historia
    versions.push({
      title: "Versión 5 · Con narrativa",
      text: uc(quien) + " se enfrentan a un reto: " + lc(problema || "avanzar con lo que hacen") + ". Nosotros ofrecemos " + lc(vendes) + (como ? " (" + lc(como) + ")" : "") + " para que puedan " + lc(beneficio || "dar el siguiente paso") + "."
    });

    return versions;
  }

  function render(versions) {
    var out = versions.map(function (v, i) {
      return "▶ " + v.title + "\n" + v.text;
    }).join("\n\n");
    $("result-content").innerText = out;
    $("result-box").hidden = false;
    $("result-box").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function generate() {
    var versions = build();
    if (!versions) return;
    render(versions);
    window.impactAnalytics.track("tool_completed", { tool: "propuesta-valor", count: versions.length });
  }

  function reset() {
    ["f-vendes", "f-a-quien", "f-problema", "f-como", "f-beneficio", "f-diferencia"].forEach(function (id) { $(id).value = ""; });
    $("result-box").hidden = true;
    window.impactAnalytics.track("tool_reset", { tool: "propuesta-valor" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    $("btn-generar").addEventListener("click", function () {
      window.impactAnalytics.track("tool_generate_click", { tool: "propuesta-valor" });
      generate();
    });
    $("btn-reset").addEventListener("click", reset);
    $("btn-copy").addEventListener("click", function () { window.copyText($("result-content").innerText, "Propuestas copiadas"); });
    $("btn-download").addEventListener("click", function () { window.downloadText("propuesta-valor.txt", $("result-content").innerText); });
  });
})();
