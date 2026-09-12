/* Generador de indicadores — ImpactTools */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var v = function (id) { return ($(id).value || "").trim().replace(/\.$/, ""); };
  var lc = function (s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : ""; };
  var uc = function (s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; };

  function build() {
    var obj = v("f-obj");
    var act = v("f-act");
    var pob = v("f-pob");
    var res = v("f-res");

    if (!obj && !act) {
      window.toast("Cuéntame al menos el objetivo o la actividad");
      return null;
    }

    var lines = [];

    lines.push("=== INDICADORES DE ACTIVIDAD ===");
    lines.push("(Miden lo que se hace)");
    lines.push("");
    lines.push("• N.º de " + lc(act || "actividades") + " realizadas frente a las planificadas.");
    lines.push("• N.º de participantes por sesión de " + lc(act || "actividad") + ".");
    lines.push("• N.º de horas totales invertidas.");
    lines.push("• Cobertura territorial: " + (pob ? lc(pob) : "personas") + " alcanzadas por barrio/comunidad.");
    lines.push("  → Cómo medir: hojas de asistencia, registro semanal, listados de participantes.");
    lines.push("");

    lines.push("=== INDICADORES DE RESULTADO ===");
    lines.push("(Miden el cambio a corto plazo)");
    lines.push("");
    lines.push("• % de " + lc(pob || "participantes") + " que completan el proceso.");
    lines.push("• Nivel de satisfacción reportado (escala 1–5).");
    lines.push("• Cambios auto-reportados por " + lc(pob || "las personas participantes") + " (encuesta pre/post).");
    if (res) lines.push("• Grado de avance hacia: " + lc(res) + ".");
    lines.push("  → Cómo medir: encuestas al final de la actividad, entrevistas breves, línea base + medición final.");
    lines.push("");

    lines.push("=== INDICADORES DE IMPACTO ===");
    lines.push("(Miden el cambio a medio y largo plazo)");
    lines.push("");
    lines.push("• Variación del problema abordado: " + lc(obj || "el objetivo del proyecto") + ".");
    lines.push("• Cambios observables en " + lc(pob || "la comunidad") + " a los 6–12 meses.");
    lines.push("• Continuidad del proceso sin apoyo externo (sostenibilidad).");
    lines.push("• Réplica de la iniciativa por parte de la comunidad u otras entidades.");
    lines.push("  → Cómo medir: seguimiento longitudinal, estudios comparativos, testimonios registrados en el tiempo.");
    lines.push("");

    lines.push("---");
    lines.push("Recomendación: define entre 3 y 5 indicadores por nivel, con línea base clara, responsable de medición y periodicidad. Un buen indicador tiene fórmula, unidad y fuente de verificación.");

    return lines.join("\n");
  }

  function gen() {
    var t = build();
    if (!t) return;
    $("result-content").innerText = t;
    $("result-box").hidden = false;
    $("result-box").scrollIntoView({ behavior: "smooth", block: "nearest" });
    window.impactAnalytics.track("tool_completed", { tool: "generador-indicadores" });
  }

  function reset() {
    ["f-obj", "f-act", "f-pob", "f-res"].forEach(function (id) { $(id).value = ""; });
    $("result-box").hidden = true;
    window.impactAnalytics.track("tool_reset", { tool: "generador-indicadores" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    $("btn-gen").addEventListener("click", function () {
      window.impactAnalytics.track("tool_generate_click", { tool: "generador-indicadores" });
      gen();
    });
    $("btn-reset").addEventListener("click", reset);
    $("btn-copy").addEventListener("click", function () { window.copyText($("result-content").innerText, "Indicadores copiados"); });
    $("btn-download").addEventListener("click", function () { window.downloadText("indicadores.txt", $("result-content").innerText); });
  });
})();
