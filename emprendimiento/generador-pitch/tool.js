/* Generador de Pitch — ImpactTools */
(function () {
  "use strict";

  var el = function (id) { return document.getElementById(id); };
  var val = function (id) { return (el(id) && el(id).value || "").trim(); };
  var cap = function (s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; };
  var esc = function (s) { return s; };
  var join = function (parts) { return parts.filter(Boolean).join(" "); };

  function buildPitch(data) {
    var name = data.nombre || "Nuestro proyecto";
    var q = data.que || "una nueva forma de resolver este problema";
    var p = data.problema;
    var pub = data.publico;
    var f = data.funciona;
    var d = data.diferencia;
    var m = data.modelo;
    var t = data.traccion;
    var fmt = data.formato;

    var hookProblem = p
      ? "Cada día, " + p.charAt(0).toLowerCase() + p.slice(1).replace(/\.$/, "") + "."
      : "Hoy, muchas personas siguen sin resolver un problema real.";
    var forWho = pub ? " para " + pub : "";
    var what = "Presentamos " + name + ", " + (q.charAt(0).toLowerCase() + q.slice(1).replace(/\.$/, "")) + forWho + ".";
    var how = f ? "¿Cómo? " + cap(f.replace(/\.$/, "")) + "." : "";
    var diff = d ? "Lo que nos hace distintos: " + d.replace(/\.$/, "") + "." : "";
    var traction = t ? "Hoy ya contamos con " + t.replace(/\.$/, "") + "." : "";
    var model = m ? "Nuestro modelo: " + m.replace(/\.$/, "") + "." : "";
    var call = "Si quieres saber más o sumarte, hablemos.";

    var body = [];

    switch (fmt) {
      case "30":
        body = [
          hookProblem,
          what + " " + (d ? d.replace(/\.$/, "") + "." : ""),
          traction || "Estamos empezando y buscamos aliados.",
          "¿Te interesa saber más?"
        ];
        break;
      case "60":
        body = [
          hookProblem,
          what,
          how,
          diff,
          traction,
          call
        ];
        break;
      case "inversores":
        body = [
          "**El problema.** " + hookProblem,
          "**Nuestra solución.** " + what,
          how ? "**Cómo funciona.** " + how.replace(/^¿Cómo\? /, "") : "",
          "**Mercado y cliente.** " + (pub ? "Nos dirigimos a " + pub + ". " : "") + "El problema afecta a un segmento amplio con disposición a pagar por una solución mejor.",
          "**Modelo de negocio.** " + (m ? cap(m.replace(/\.$/, "")) + "." : "Ingresos recurrentes con márgenes crecientes a medida que escalamos."),
          "**Diferenciación.** " + (d ? cap(d.replace(/\.$/, "")) + "." : "Combinamos ejecución, tecnología y una obsesión por el cliente."),
          "**Tracción.** " + (t ? cap(t.replace(/\.$/, "")) + "." : "Estamos validando con clientes reales."),
          "**Equipo.** Con la experiencia, la red y la determinación para llevarlo a escala.",
          "**Pedido.** Buscamos [inversión / socios estratégicos / talento] para el próximo hito de crecimiento."
        ];
        break;
      case "concurso":
        body = [
          "Imaginen por un momento… " + (p ? p.replace(/\.$/, "") + "." : "un problema que afecta a miles de personas."),
          "Ese es el problema que decidimos resolver. Y así nació " + name + ".",
          what,
          how,
          diff,
          traction ? traction : "Comenzamos hace poco y ya vemos señales alentadoras.",
          model,
          "Nuestro sueño con " + name + " es que en unos años este problema deje de existir. Este concurso puede ser el impulso que lo haga posible.",
          "Gracias."
        ];
        break;
      case "presentacion":
        body = [
          "Hola, somos el equipo detrás de " + name + ".",
          hookProblem,
          what,
          how,
          diff,
          model,
          traction,
          "Nos encantará responder tus preguntas y explorar cómo colaborar."
        ];
        break;
      case "social":
        body = [
          hookProblem,
          "Por eso creamos " + name + ": " + (q.charAt(0).toLowerCase() + q.slice(1).replace(/\.$/, "")) + (pub ? ", con y para " + pub : "") + ".",
          how,
          diff,
          traction ? "Ya hemos logrado: " + t.replace(/\.$/, "") + "." : "Estamos empezando, y queremos hacerlo bien.",
          "Buscamos aliados, voluntarios y financiadores comprometidos con el impacto que queremos generar. ¿Te sumas?"
        ];
        break;
    }

    return body.filter(Boolean).join("\n\n");
  }

  function collect() {
    return {
      nombre: val("f-nombre"),
      que: val("f-que"),
      problema: val("f-problema"),
      publico: val("f-publico"),
      diferencia: val("f-diferencia"),
      funciona: val("f-funciona"),
      modelo: val("f-modelo"),
      traccion: val("f-traccion"),
      formato: val("f-formato")
    };
  }

  function wordCount(t) {
    return (t || "").trim().split(/\s+/).filter(Boolean).length;
  }

  function updateWC() {
    var t = el("result-content").innerText || "";
    var w = wordCount(t);
    el("wordcount").textContent = w + " palabras · ~" + Math.max(1, Math.round(w / 130 * 60)) + " s hablado";
  }

  function generate() {
    var data = collect();
    if (!data.que && !data.problema) {
      window.toast("Cuéntame al menos qué hace tu proyecto o qué problema resuelve");
      return;
    }
    var text = buildPitch(data);
    el("result-content").innerText = text;
    el("result-box").hidden = false;
    updateWC();
    window.impactAnalytics.track("tool_completed", { tool: "generador-pitch", formato: data.formato });
    el("result-box").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function reset() {
    ["f-nombre", "f-que", "f-problema", "f-publico", "f-diferencia", "f-funciona", "f-modelo", "f-traccion"].forEach(function (id) {
      el(id).value = "";
    });
    el("f-formato").value = "60";
    el("result-box").hidden = true;
    el("result-content").innerText = "";
    window.impactAnalytics.track("tool_reset", { tool: "generador-pitch" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    el("btn-generar").addEventListener("click", function () {
      window.impactAnalytics.track("tool_generate_click", { tool: "generador-pitch" });
      generate();
    });
    el("btn-reset").addEventListener("click", reset);
    el("btn-copy").addEventListener("click", function () {
      window.copyText(el("result-content").innerText || "", "Pitch copiado");
    });
    el("btn-download").addEventListener("click", function () {
      var name = (val("f-nombre") || "pitch").replace(/\s+/g, "-").toLowerCase();
      window.downloadText("pitch-" + name + ".txt", el("result-content").innerText || "");
    });
    el("result-content").addEventListener("input", updateWC);
  });
})();
