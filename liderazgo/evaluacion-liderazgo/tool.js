/* Evaluación de liderazgo — ImpactTools */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  var DIMS = [
    { id: "com", name: "Comunicación", icon: "💬", qs: [
      "Explico las ideas de forma clara, adaptándome a mi audiencia.",
      "Sé escuchar activamente antes de opinar.",
      "Pido y ofrezco retroalimentación con frecuencia."
    ]},
    { id: "org", name: "Organización", icon: "📅", qs: [
      "Priorizo mis tareas y las de mi equipo.",
      "Mantengo mi trabajo estructurado y accesible.",
      "Cumplo mis plazos sin llegar al agotamiento."
    ]},
    { id: "ini", name: "Iniciativa", icon: "⚡", qs: [
      "Propongo mejoras aunque no me las pidan.",
      "Empiezo cosas nuevas cuando veo una oportunidad.",
      "Actúo sin esperar permiso cuando el contexto lo permite."
    ]},
    { id: "eq", name: "Trabajo en equipo", icon: "🤝", qs: [
      "Delego responsabilidades y confío en mis colegas.",
      "Reconozco los aportes de los demás públicamente.",
      "Resuelvo conflictos con respeto y sin evitarlos."
    ]},
    { id: "dec", name: "Toma de decisiones", icon: "🧭", qs: [
      "Tomo decisiones incluso con información incompleta.",
      "Sopeso pros y contras antes de decidir.",
      "Asumo la responsabilidad de mis decisiones, buenas o malas."
    ]},
    { id: "vis", name: "Visión", icon: "🌅", qs: [
      "Sé hacia dónde quiero llevar a mi proyecto o equipo en el largo plazo.",
      "Comunico esa visión y logro que otros se sumen a ella.",
      "Alineo las decisiones cotidianas con la visión."
    ]},
    { id: "ad", name: "Adaptación", icon: "🔄", qs: [
      "Me adapto cuando cambia el contexto o los objetivos.",
      "Aprendo de mis errores rápidamente.",
      "No me aferro a un plan cuando la realidad me contradice."
    ]},
    { id: "res", name: "Responsabilidad", icon: "🎯", qs: [
      "Cierro los compromisos que asumo.",
      "Reconozco mis errores sin buscar culpables.",
      "Cuido el impacto de mis decisiones en las personas."
    ]}
  ];

  function build() {
    var wrap = $("quiz");
    wrap.innerHTML = "";
    DIMS.forEach(function (d, di) {
      var sec = document.createElement("div");
      sec.style.marginBottom = "18px";
      var title = '<h3 style="margin: 12px 0 8px; font-size: 15.5px; letter-spacing: -0.01em;">' + d.icon + " " + d.name + "</h3>";
      var qs = d.qs.map(function (q, qi) {
        var idBase = "q-" + d.id + "-" + qi;
        var opts = [1, 2, 3, 4, 5].map(function (n) {
          return '<label style="display:inline-flex; align-items:center; gap:6px; margin-right: 12px; padding: 6px 8px; border: 1px solid var(--border); border-radius: 999px; cursor:pointer; font-size: 14px; background: #fff;">' +
                 '<input type="radio" name="' + idBase + '" value="' + n + '" style="margin:0;"> ' + n + '</label>';
        }).join(" ");
        return '<div style="padding: 10px 0; border-bottom: 1px solid var(--border);">' +
               '<p style="margin: 0 0 6px; font-size: 14.5px;">' + q + '</p>' +
               '<div>' + opts + '</div></div>';
      }).join("");
      sec.innerHTML = title + qs;
      wrap.appendChild(sec);
    });
    wrap.addEventListener("change", updateProgress);
  }

  function collect() {
    var totals = {};
    var count = 0;
    DIMS.forEach(function (d) {
      var sum = 0;
      d.qs.forEach(function (q, qi) {
        var el = document.querySelector('input[name="q-' + d.id + '-' + qi + '"]:checked');
        if (el) { sum += parseInt(el.value, 10); count++; }
      });
      totals[d.id] = sum;
    });
    return { totals: totals, count: count };
  }

  function updateProgress() {
    var r = collect();
    $("q-progress").textContent = r.count + " / 24 respondidas";
  }

  function evalNow() {
    var r = collect();
    if (r.count < 12) { window.toast("Responde al menos la mitad para tener un resultado útil"); return; }
    var rows = DIMS.map(function (d) {
      var raw = r.totals[d.id];
      var maxAns = d.qs.length * 5;
      var pct = Math.round(raw / maxAns * 100);
      return { d: d, raw: raw, pct: pct };
    });

    // stat grid
    var grid = $("dim-grid");
    grid.innerHTML = "";
    rows.forEach(function (row) {
      var s = document.createElement("div");
      s.className = "stat";
      s.innerHTML = '<div class="num">' + (row.raw || "—") + '</div><div class="lbl">' + row.d.icon + " " + row.d.name + '</div>' +
        '<div style="height:6px; background: var(--bg-soft); border-radius: 6px; margin-top: 8px; overflow: hidden;">' +
        '<div style="height:100%; width:' + row.pct + '%; background: var(--cat-lid);"></div></div>';
      grid.appendChild(s);
    });

    // find top and bottom
    var sorted = rows.slice().filter(function (x) { return x.raw > 0; }).sort(function (a, b) { return b.pct - a.pct; });
    var top = sorted.slice(0, 2);
    var bottom = sorted.slice(-2).reverse();

    var text = [];
    text.push("PERFIL DE LIDERAZGO — resultado orientativo");
    text.push("");
    text.push("Fortalezas destacadas:");
    top.forEach(function (t) { text.push("• " + t.d.name + " (" + t.raw + "/" + (t.d.qs.length * 5) + ") — " + strongText(t.d.id)); });
    text.push("");
    text.push("Áreas de oportunidad:");
    bottom.forEach(function (b) { text.push("• " + b.d.name + " (" + b.raw + "/" + (b.d.qs.length * 5) + ") — " + weakText(b.d.id)); });
    text.push("");
    text.push("Recomendación general:");
    text.push("• Elige 1 o 2 áreas para trabajar durante los próximos 3 meses; no intentes cambiar todo a la vez.");
    text.push("• Convierte cada mejora en un objetivo SMART y un plan de acción concreto.");
    text.push("• Revisa tu progreso a los 90 días con esta misma herramienta.");
    text.push("");
    text.push("Recuerda: esta autoevaluación es orientativa y no sustituye un proceso de coaching o mentoría profesional.");

    $("result-content").innerText = text.join("\n");
    $("result-box").hidden = false;
    $("result-box").scrollIntoView({ behavior: "smooth", block: "nearest" });
    window.impactAnalytics.track("tool_completed", { tool: "evaluacion-liderazgo" });
  }

  function strongText(id) {
    return ({
      com: "Comunicas y escuchas bien; úsalo para acompañar decisiones difíciles.",
      org: "Ordenas el trabajo; aprovéchalo para dar visibilidad al equipo.",
      ini: "Empiezas cosas; canalízalo con priorización para no dispersarte.",
      eq: "Colaboras y confías; sigue delegando y reconociendo aportes.",
      dec: "Decides con criterio incluso bajo incertidumbre.",
      vis: "Tienes una imagen clara del futuro; asegúrate de que otros la vean.",
      ad: "Te adaptas rápido; conviértelo en aprendizaje explícito.",
      res: "Cumples y asumes; es un cimiento de confianza."
    })[id] || "Sigue apoyándote en esta fortaleza.";
  }
  function weakText(id) {
    return ({
      com: "Practica escucha activa y ajusta tu mensaje a distintas audiencias.",
      org: "Prueba una rutina semanal de prioridades y revisión.",
      ini: "Pon una acción pequeña propia en marcha esta semana.",
      eq: "Delega una tarea concreta con criterio claro de éxito.",
      dec: "Marca un plazo para decidir cuando notes que dudas demasiado.",
      vis: "Redacta una versión de tu visión en una sola frase.",
      ad: "Cierra proyectos con una retrospectiva de aprendizajes.",
      res: "Reduce tus 'sí' y honra los que ya diste."
    })[id] || "Elige un experimento concreto para trabajar esta área.";
  }

  function reset() {
    document.querySelectorAll('#quiz input[type="radio"]').forEach(function (el) { el.checked = false; });
    $("result-box").hidden = true;
    updateProgress();
    window.impactAnalytics.track("tool_reset", { tool: "evaluacion-liderazgo" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    build();
    $("btn-eval").addEventListener("click", function () {
      window.impactAnalytics.track("tool_generate_click", { tool: "evaluacion-liderazgo" });
      evalNow();
    });
    $("btn-reset").addEventListener("click", reset);
    $("btn-copy").addEventListener("click", function () { window.copyText($("result-content").innerText, "Resultados copiados"); });
    $("btn-download").addEventListener("click", function () { window.downloadText("evaluacion-liderazgo.txt", $("result-content").innerText); });
  });
})();
