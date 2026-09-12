/* Generador de objetivos — ImpactTools */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var v = function (id) { return ($(id).value || "").trim().replace(/\.$/, ""); };
  var lc = function (s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : ""; };

  var CTX = {
    proyecto: { label: "proyecto social", verbs: ["Contribuir a", "Reducir", "Fortalecer", "Ampliar"], especifico: ["Diagnosticar la situación de", "Diseñar intervenciones para", "Fortalecer capacidades en", "Evaluar el avance en"] },
    ong: { label: "ONG", verbs: ["Contribuir a", "Promover", "Defender", "Empoderar"], especifico: ["Consolidar programas para", "Ampliar la red de aliados en", "Mejorar la sostenibilidad financiera relacionada con", "Comunicar los avances en"] },
    emprendimiento: { label: "emprendimiento", verbs: ["Consolidar", "Escalar", "Validar", "Aumentar"], especifico: ["Lograr un producto que resuelva", "Alcanzar la primera tracción en", "Definir el modelo de negocio para", "Medir la retención y satisfacción de"] },
    escuela: { label: "escuela", verbs: ["Mejorar", "Fortalecer", "Reducir", "Impulsar"], especifico: ["Diseñar planes pedagógicos orientados a", "Fortalecer la relación con familias de", "Reducir las brechas en", "Evaluar el rendimiento en"] },
    empresa: { label: "empresa", verbs: ["Aumentar", "Optimizar", "Fidelizar", "Desarrollar"], especifico: ["Mejorar procesos vinculados con", "Aumentar la satisfacción de", "Reducir costes en", "Expandir la operación en"] },
    comunidad: { label: "iniciativa comunitaria", verbs: ["Movilizar", "Fortalecer", "Reducir", "Cuidar"], especifico: ["Organizar acciones colectivas para", "Fortalecer el liderazgo en", "Articular alianzas para", "Sistematizar aprendizajes sobre"] }
  };

  function build() {
    var idea = v("f-idea");
    var ctx = v("f-ctx") || "proyecto";
    var pob = v("f-pob");
    var t = v("f-tiempo");
    if (!idea) { window.toast("Escribe tu idea general"); return null; }
    var c = CTX[ctx] || CTX.proyecto;
    var out = [];

    out.push("=== OBJETIVO GENERAL ===");
    var gen = c.verbs[0] + " " + lc(idea) +
      (pob ? " en " + lc(pob) : "") +
      (t ? " en " + t : "") + ".";
    out.push(gen);
    out.push("");

    out.push("=== OBJETIVOS ESPECÍFICOS ===");
    c.especifico.forEach(function (e, i) {
      out.push((i + 1) + ". " + e + " " + lc(idea) + (pob ? " en " + lc(pob) : "") + ".");
    });
    out.push("");

    out.push("=== METAS ===");
    out.push("• Meta 1 — Al cierre del " + (t || "periodo") + ", haber alcanzado a al menos [X] " + (pob ? lc(pob) : "personas") + ".");
    out.push("• Meta 2 — Haber implementado al menos [Y] actividades relacionadas con " + lc(idea) + ".");
    out.push("• Meta 3 — Documentar aprendizajes clave y compartirlos con al menos [Z] aliados.");
    out.push("");

    out.push("=== INDICADORES SUGERIDOS ===");
    out.push("• N.º de participantes / beneficiarios directos.");
    out.push("• % de avance frente a la línea base en la temática de " + lc(idea) + ".");
    out.push("• Nivel de satisfacción o adherencia (encuesta pre/post).");
    out.push("• Continuidad del proceso más allá del " + (t || "periodo") + ".");
    out.push("");

    out.push("Contexto: " + c.label + ".");
    return out.join("\n");
  }

  function gen() {
    var t = build();
    if (!t) return;
    $("result-content").innerText = t;
    $("result-box").hidden = false;
    $("result-box").scrollIntoView({ behavior: "smooth", block: "nearest" });
    window.impactAnalytics.track("tool_completed", { tool: "generador-objetivos" });
  }

  function reset() {
    ["f-idea", "f-pob", "f-tiempo"].forEach(function (id) { $(id).value = ""; });
    $("f-ctx").value = "proyecto";
    $("result-box").hidden = true;
    window.impactAnalytics.track("tool_reset", { tool: "generador-objetivos" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    $("btn-gen").addEventListener("click", function () {
      window.impactAnalytics.track("tool_generate_click", { tool: "generador-objetivos" });
      gen();
    });
    $("btn-reset").addEventListener("click", reset);
    $("btn-copy").addEventListener("click", function () { window.copyText($("result-content").innerText, "Objetivos copiados"); });
    $("btn-download").addEventListener("click", function () { window.downloadText("objetivos.txt", $("result-content").innerText); });
  });
})();
