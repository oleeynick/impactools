/* Calculadora de ROI — ImpactTools */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  function num(id) {
    var v = parseFloat(($(id).value || "").replace(",", "."));
    return isFinite(v) ? v : NaN;
  }

  function fmtMoney(v, cur) {
    if (!isFinite(v)) return "—";
    var sign = v < 0 ? "-" : "";
    var abs = Math.abs(v);
    var s = abs.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    return sign + s + (cur ? " " + cur : "");
  }
  function fmtPct(v) {
    if (!isFinite(v)) return "—";
    return v.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + " %";
  }

  function explain(roi, gain, mult, per, cur) {
    var lines = [];
    if (roi < 0) {
      lines.push("Con estas cifras la operación pierde dinero: por cada unidad invertida recibes " + mult.toFixed(2) + ".");
      lines.push("Revisa qué costes puedes reducir o qué palancas de retorno estás dejando en la mesa.");
    } else if (roi === 0) {
      lines.push("Estás en el punto de equilibrio: recuperas exactamente lo invertido, sin ganar ni perder.");
    } else if (roi < 20) {
      lines.push("El retorno es modesto (" + fmtPct(roi) + "). Es aceptable si el riesgo es bajo, pero merece la pena revisar cómo mejorarlo.");
    } else if (roi < 100) {
      lines.push("Retorno saludable (" + fmtPct(roi) + "). Por cada unidad invertida recuperas " + mult.toFixed(2) + ".");
    } else {
      lines.push("Retorno excelente (" + fmtPct(roi) + "): has más que duplicado tu inversión. Analiza si es sostenible en el tiempo.");
    }
    lines.push("Ganancia neta: " + fmtMoney(gain, cur) + ".");
    if (per > 0) {
      lines.push("Este ROI se logró en " + per + " " + (per === 1 ? "mes" : "meses") + ".");
    }
    return lines.join("\n");
  }

  function calc() {
    var inv = num("f-inv");
    var ret = num("f-ret");
    var per = num("f-per");
    var cur = ($("f-mon").value || "").trim();

    if (!isFinite(inv) || inv <= 0) {
      window.toast("Introduce una inversión mayor a 0");
      return;
    }
    if (!isFinite(ret)) {
      window.toast("Introduce el retorno total");
      return;
    }

    var gain = ret - inv;
    var roi = (gain / inv) * 100;
    var mult = ret / inv;
    var annual = NaN;
    if (isFinite(per) && per > 0) {
      annual = (Math.pow(1 + roi / 100, 12 / per) - 1) * 100;
    }

    $("s-roi").textContent = fmtPct(roi);
    $("s-gan").textContent = fmtMoney(gain, cur);
    $("s-mult").textContent = mult.toFixed(2) + "×";
    $("s-anual").textContent = isFinite(annual) ? fmtPct(annual) : "—";

    var exp = explain(roi, gain, mult, isFinite(per) ? per : 0, cur);
    $("result-content").innerText = exp;
    $("result-box").hidden = false;

    window.impactAnalytics.track("tool_completed", { tool: "calculadora-roi", roi: Math.round(roi * 10) / 10 });
    $("result-box").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function reset() {
    ["f-inv", "f-ret", "f-per"].forEach(function (id) { $(id).value = ""; });
    $("f-mon").value = "EUR";
    $("result-box").hidden = true;
    window.impactAnalytics.track("tool_reset", { tool: "calculadora-roi" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    $("btn-calc").addEventListener("click", function () {
      window.impactAnalytics.track("tool_generate_click", { tool: "calculadora-roi" });
      calc();
    });
    $("btn-reset").addEventListener("click", reset);
    $("btn-copy").addEventListener("click", function () {
      window.copyText($("result-content").innerText || "", "Explicación copiada");
    });
    $("btn-download").addEventListener("click", function () {
      window.downloadText("roi.txt", $("result-content").innerText || "");
    });
    // Recalculate on Enter
    ["f-inv", "f-ret", "f-per"].forEach(function (id) {
      $(id).addEventListener("keydown", function (e) { if (e.key === "Enter") calc(); });
    });
  });
})();
