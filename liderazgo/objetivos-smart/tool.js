/* Generador de Objetivos SMART — ImpactTools */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var v = function (id) { return ($(id).value || "").trim().replace(/\.$/, ""); };
  var lc = function (s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : ""; };
  var uc = function (s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; };

  function build() {
    var meta = v("f-meta");
    var med = v("f-med");
    var fecha = v("f-fecha");
    var rec = v("f-rec");
    var por = v("f-por");
    if (!meta) { window.toast("Escribe tu meta general"); return null; }

    var text = "";
    var parts = [];
    if (med) parts.push(lc(med));
    parts.push(lc(meta));
    if (rec) parts.push("mediante " + lc(rec));
    if (por) parts.push("porque " + lc(por));
    if (fecha) parts.push(fecha.match(/^(\d|al|antes|para|hasta|el\s|en\s)/i) ? fecha : "para " + fecha);
    text = uc(parts.join(", ")) + ".";

    var rows = [
      { k: "S", label: "Específico", val: meta },
      { k: "M", label: "Medible", val: med || "(sin cifra clara — recomendable añadir)" },
      { k: "A", label: "Alcanzable", val: rec || "(revisar si es viable con los recursos actuales)" },
      { k: "R", label: "Relevante", val: por || "(explicar por qué importa)" },
      { k: "T", label: "Con fecha", val: fecha || "(añadir fecha o plazo)" }
    ];

    return { text: text, rows: rows };
  }

  function renderComponents(rows) {
    var html = '<table class="grid"><thead><tr><th>Letra</th><th>Criterio</th><th>Tu respuesta</th></tr></thead><tbody>';
    rows.forEach(function (r) {
      html += '<tr><td><strong>' + r.k + '</strong></td><td>' + r.label + '</td><td>' + (r.val || "") + '</td></tr>';
    });
    html += '</tbody></table>';
    $("components").innerHTML = html;
  }

  function gen() {
    var r = build();
    if (!r) return;
    $("result-content").innerText = r.text;
    renderComponents(r.rows);
    $("result-box").hidden = false;
    $("result-box").scrollIntoView({ behavior: "smooth", block: "nearest" });
    window.impactAnalytics.track("tool_completed", { tool: "objetivos-smart" });
  }

  function reset() {
    ["f-meta", "f-med", "f-fecha", "f-rec", "f-por"].forEach(function (id) { $(id).value = ""; });
    $("result-box").hidden = true;
    window.impactAnalytics.track("tool_reset", { tool: "objetivos-smart" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    $("btn-gen").addEventListener("click", function () {
      window.impactAnalytics.track("tool_generate_click", { tool: "objetivos-smart" });
      gen();
    });
    $("btn-reset").addEventListener("click", reset);
    $("btn-copy").addEventListener("click", function () { window.copyText($("result-content").innerText, "Objetivo copiado"); });
    $("btn-download").addEventListener("click", function () { window.downloadText("objetivo-smart.txt", $("result-content").innerText); });
  });
})();
