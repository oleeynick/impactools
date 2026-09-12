/* Calculadora de impacto — ImpactTools */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var num = function (id) {
    var v = parseFloat(($(id).value || "").replace(",", "."));
    return isFinite(v) && v >= 0 ? v : 0;
  };
  var fmt = function (n) { return n.toLocaleString("es-ES", { maximumFractionDigits: 0 }); };

  var METRICS = [
    { id: "f-personas", label: "personas beneficiadas", short: "personas" },
    { id: "f-vol", label: "voluntarios movilizados", short: "voluntarios" },
    { id: "f-horas", label: "horas de acción", short: "horas" },
    { id: "f-act", label: "actividades realizadas", short: "actividades" },
    { id: "f-com", label: "comunidades alcanzadas", short: "comunidades" },
    { id: "f-rec", label: "recursos invertidos", short: "recursos" }
  ];

  function render() {
    var name = ($("f-nombre").value || "").trim();
    var vals = METRICS.map(function (m) { return { m: m, v: num(m.id) }; });
    var any = vals.some(function (x) { return x.v > 0; });
    if (!any) {
      window.toast("Introduce al menos una cifra");
      return;
    }

    // Stat grid
    var grid = $("stats-grid");
    grid.innerHTML = "";
    vals.forEach(function (x) {
      if (x.v <= 0) return;
      var s = document.createElement("div");
      s.className = "stat";
      s.innerHTML = '<div class="num">' + fmt(x.v) + '</div><div class="lbl">' + x.m.short + '</div>';
      grid.appendChild(s);
    });

    // Text summary
    var t = (name ? name + " " : "El proyecto ") + "ha logrado un impacto significativo en su comunidad. ";
    var parts = [];
    vals.forEach(function (x) {
      if (x.v > 0) parts.push(fmt(x.v) + " " + x.m.label);
    });
    if (parts.length >= 2) {
      var last = parts.pop();
      t += "Hasta la fecha suma " + parts.join(", ") + " y " + last + ".";
    } else if (parts.length === 1) {
      t += "Hasta la fecha suma " + parts[0] + ".";
    }
    var horas = num("f-horas"), vol = num("f-vol");
    if (horas > 0 && vol > 0) {
      var media = Math.round(horas / vol);
      if (media > 0) t += " Cada voluntario aportó, en promedio, " + media + " horas.";
    }
    var pers = num("f-personas"), rec = num("f-rec");
    if (pers > 0 && rec > 0) {
      var costo = rec / pers;
      t += " El coste por persona beneficiada es de aproximadamente " + costo.toLocaleString("es-ES", { maximumFractionDigits: 2 }) + " unidades.";
    }
    t += "\n\nEstas cifras reflejan el esfuerzo colectivo de las personas participantes, el equipo y la red de apoyo.";
    $("result-content").innerText = t;
    $("result-box").hidden = false;
    $("result-box").scrollIntoView({ behavior: "smooth", block: "nearest" });
    window.impactAnalytics.track("tool_completed", { tool: "calculadora-impacto" });
  }

  function reset() {
    METRICS.forEach(function (m) { $(m.id).value = ""; });
    $("f-nombre").value = "";
    $("result-box").hidden = true;
    window.impactAnalytics.track("tool_reset", { tool: "calculadora-impacto" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    $("btn-calc").addEventListener("click", function () {
      window.impactAnalytics.track("tool_generate_click", { tool: "calculadora-impacto" });
      render();
    });
    $("btn-reset").addEventListener("click", reset);
    $("btn-copy").addEventListener("click", function () { window.copyText($("result-content").innerText, "Resumen copiado"); });
    $("btn-download").addEventListener("click", function () { window.downloadText("impacto.txt", $("result-content").innerText); });
  });
})();
