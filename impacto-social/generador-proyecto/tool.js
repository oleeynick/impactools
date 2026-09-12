/* Generador de proyectos sociales — ImpactTools */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var v = function (id) { return ($(id).value || "").trim(); };
  var uc = function (s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; };
  var lc = function (s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : ""; };
  var stripDot = function (s) { return s.replace(/\.\s*$/, ""); };

  function splitList(text) {
    if (!text) return [];
    return text.split(/[\n;•]|,\s+/)
      .map(function (x) { return x.trim().replace(/^[-*·]\s*/, ""); })
      .filter(Boolean);
  }

  function money(n) {
    var v = parseFloat(String(n).replace(",", "."));
    if (!isFinite(v) || v <= 0) return null;
    return v.toLocaleString("es-ES", { maximumFractionDigits: 0 });
  }

  function build(d) {
    var out = [];
    var name = d.nombre || "Proyecto sin nombre";
    var beneficios = d.beneficiarios ? parseInt(d.beneficiarios, 10) : null;

    // Título
    out.push("# " + name.toUpperCase());
    out.push("");

    // 1. Descripción
    out.push("## 1. Descripción");
    out.push(name + " es una iniciativa " + (d.ubicacion ? "en " + d.ubicacion + " " : "") +
      "orientada a " + lc(d.solucion || "resolver un problema social relevante") +
      ", con foco en " + lc(d.poblacion || "la comunidad beneficiaria") + ".");
    out.push("");

    // 2. Planteamiento del problema
    out.push("## 2. Planteamiento del problema");
    out.push(uc(d.problema || "Describe aquí la situación que quieres cambiar y su magnitud.") +
      (d.problema && !/\.$/.test(d.problema) ? "." : ""));
    var causas = splitList(d.causas);
    if (causas.length) {
      out.push("");
      out.push("**Causas identificadas:**");
      causas.forEach(function (c) { out.push("- " + uc(c) + "."); });
    }
    out.push("");

    // 3. Justificación
    out.push("## 3. Justificación");
    out.push("Este proyecto responde a la necesidad de " + lc(stripDot(d.problema || "abordar el problema descrito")) +
      ". Ignorar esta situación implica que " + lc(d.poblacion || "las personas afectadas") +
      " sigan viendo limitadas sus oportunidades. Intervenir ahora permite " +
      "revertir la tendencia con un uso eficiente de los recursos disponibles" +
      (d.recursos ? " (" + d.recursos + ")" : "") + ".");
    out.push("");

    // 4. Objetivo general
    out.push("## 4. Objetivo general");
    var pob = d.poblacion || "la población beneficiaria";
    var solucion = stripDot(d.solucion || "implementar la solución propuesta");
    out.push("Contribuir a " + lc(solucion) + " en " + lc(pob) +
      (d.ubicacion ? " de " + d.ubicacion : "") +
      (d.duracion ? " durante " + d.duracion : "") + ".");
    out.push("");

    // 5. Objetivos específicos
    out.push("## 5. Objetivos específicos");
    var actividades = splitList(d.actividades);
    var oes = [];
    if (actividades.length) {
      actividades.slice(0, 5).forEach(function (a, i) {
        oes.push("Ejecutar " + lc(stripDot(a)) + " para " + lc(pob) + ".");
      });
    } else {
      oes = [
        "Diagnosticar en profundidad la situación de " + lc(pob) + ".",
        "Diseñar e implementar actividades que aborden las causas identificadas.",
        "Fortalecer capacidades locales y redes de apoyo.",
        "Medir y comunicar los resultados obtenidos."
      ];
    }
    oes.forEach(function (o, i) { out.push((i + 1) + ". " + o); });
    out.push("");

    // 6. Población beneficiaria
    out.push("## 6. Población beneficiaria");
    out.push("**Directa:** " + (d.poblacion || "por definir") +
      (beneficios ? " (" + beneficios.toLocaleString("es-ES") + " personas estimadas)" : "") + ".");
    out.push("**Indirecta:** familias, docentes, organizaciones comunitarias y aliados que se benefician del cambio.");
    out.push("");

    // 7. Actividades
    out.push("## 7. Actividades");
    if (actividades.length) {
      actividades.forEach(function (a, i) {
        out.push("- **Actividad " + (i + 1) + ":** " + uc(stripDot(a)) + ".");
      });
    } else {
      out.push("- Diagnóstico participativo con la comunidad.");
      out.push("- Diseño detallado de intervenciones.");
      out.push("- Ejecución del plan por fases.");
      out.push("- Monitoreo, evaluación y sistematización.");
    }
    out.push("");

    // 8. Resultados esperados
    out.push("## 8. Resultados esperados");
    var resultados = oes.map(function (o) {
      return "- " + uc(o.replace(/^Ejecutar\s+/i, "").replace(/\.$/, "")) + " logrado con la calidad esperada.";
    });
    resultados.forEach(function (r) { out.push(r); });
    out.push("");

    // 9. Indicadores
    out.push("## 9. Indicadores");
    out.push("**Actividad:**");
    out.push("- Nº de actividades realizadas / planificadas.");
    out.push("- Nº de horas ejecutadas.");
    out.push("- Nº de personas participantes por actividad.");
    out.push("");
    out.push("**Resultado:**");
    out.push("- % de participantes que completan el proceso.");
    out.push("- Nivel de satisfacción reportado (encuesta post-actividad).");
    out.push("- Cambios observables en las condiciones de " + lc(pob) + ".");
    out.push("");
    out.push("**Impacto:**");
    out.push("- Variación en el problema abordado (línea base vs. línea final).");
    out.push("- Continuidad del proceso más allá del proyecto.");
    out.push("- Réplica o escalado por parte de la comunidad u otras entidades.");
    out.push("");

    // 10. Cronograma
    out.push("## 10. Cronograma básico");
    out.push("**Fase 1 · Diagnóstico y diseño** (primeras semanas): validar el problema, definir métricas, articular con aliados.");
    out.push("**Fase 2 · Implementación** (parte central" + (d.duracion ? " de " + d.duracion : "") + "): ejecución de las actividades y monitoreo.");
    out.push("**Fase 3 · Evaluación y cierre** (últimas semanas): medición de resultados, aprendizajes y comunicación.");
    out.push("");

    // 11. Presupuesto
    out.push("## 11. Presupuesto estimado");
    var pres = money(d.presupuesto);
    if (pres) {
      out.push("Total estimado: **" + pres + "**. Distribución sugerida:");
    } else {
      out.push("Distribución sugerida (defínela con cifras reales):");
    }
    out.push("- Recursos humanos (coordinación, tutores, facilitadores): ~45 %.");
    out.push("- Materiales y logística: ~25 %.");
    out.push("- Comunicación y difusión: ~10 %.");
    out.push("- Monitoreo y evaluación: ~10 %.");
    out.push("- Imprevistos y administración: ~10 %.");
    out.push("");

    out.push("---");
    out.push("_Este documento es un punto de partida generado por ImpactTools. Ajústalo con conocimiento del territorio, validación comunitaria y datos reales._");

    return out.join("\n");
  }

  function collect() {
    return {
      nombre: v("f-nombre"),
      ubicacion: v("f-ubicacion"),
      problema: v("f-problema"),
      causas: v("f-causas"),
      poblacion: v("f-poblacion"),
      beneficiarios: v("f-beneficiarios"),
      solucion: v("f-solucion"),
      actividades: v("f-actividades"),
      duracion: v("f-duracion"),
      recursos: v("f-recursos"),
      presupuesto: v("f-presupuesto")
    };
  }

  function generate() {
    var d = collect();
    if (!d.problema && !d.solucion) {
      window.toast("Cuéntame al menos el problema o la solución propuesta");
      return;
    }
    var text = build(d);
    $("result-content").innerText = text;
    $("result-box").hidden = false;
    $("result-box").scrollIntoView({ behavior: "smooth", block: "nearest" });
    window.impactAnalytics.track("tool_completed", { tool: "generador-proyecto" });
  }

  function reset() {
    ["f-nombre", "f-ubicacion", "f-problema", "f-causas", "f-poblacion", "f-beneficiarios", "f-solucion", "f-actividades", "f-duracion", "f-recursos", "f-presupuesto"].forEach(function (id) { $(id).value = ""; });
    $("result-box").hidden = true;
    window.impactAnalytics.track("tool_reset", { tool: "generador-proyecto" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    $("btn-generar").addEventListener("click", function () {
      window.impactAnalytics.track("tool_generate_click", { tool: "generador-proyecto" });
      generate();
    });
    $("btn-reset").addEventListener("click", reset);
    $("btn-copy").addEventListener("click", function () { window.copyText($("result-content").innerText, "Proyecto copiado"); });
    $("btn-download").addEventListener("click", function () {
      var n = (v("f-nombre") || "proyecto").replace(/\s+/g, "-").toLowerCase();
      window.downloadText("proyecto-" + n + ".txt", $("result-content").innerText);
    });
    $("btn-download-md").addEventListener("click", function () {
      var n = (v("f-nombre") || "proyecto").replace(/\s+/g, "-").toLowerCase();
      window.downloadText("proyecto-" + n + ".md", $("result-content").innerText, "text/markdown;charset=utf-8");
    });
  });
})();
