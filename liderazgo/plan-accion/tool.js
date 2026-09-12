/* Plan de acción — ImpactTools */
(function () {
  "use strict";
  var STORE = "impacttools.plan.v1";
  var $ = function (id) { return document.getElementById(id); };
  var state = { obj: "", lim: "", per: "", rec: "", rows: [] };

  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {}
    $("save-status").textContent = "Guardado a las " + new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  }
  function load() {
    try {
      var raw = localStorage.getItem(STORE);
      if (!raw) return;
      var d = JSON.parse(raw);
      Object.assign(state, d);
      $("f-obj").value = state.obj || "";
      $("f-lim").value = state.lim || "";
      $("f-per").value = state.per || "";
      $("f-rec").value = state.rec || "";
    } catch (e) {}
  }
  function esc(s) { return String(s || "").replace(/[<>&]/g, function (c) { return { "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]; }); }

  function render() {
    var body = $("plan-body");
    body.innerHTML = "";
    if (!state.rows.length) {
      var tr = document.createElement("tr");
      tr.innerHTML = '<td colspan="8" style="text-align:center; color: var(--text-mute);">Aún no hay acciones. Añade la primera.</td>';
      body.appendChild(tr);
      return;
    }
    state.rows.forEach(function (r, idx) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        '<td><input class="input" data-k="accion" value="' + esc(r.accion) + '" placeholder="Ej.: Convocar tutores"></td>' +
        '<td><input class="input" data-k="responsable" value="' + esc(r.responsable) + '" placeholder="Ej.: Ana"></td>' +
        '<td><input class="input" type="date" data-k="inicio" value="' + esc(r.inicio) + '"></td>' +
        '<td><input class="input" type="date" data-k="fin" value="' + esc(r.fin) + '"></td>' +
        '<td><select class="select" data-k="prioridad"><option>alta</option><option>media</option><option>baja</option></select></td>' +
        '<td><input class="input" data-k="indicador" value="' + esc(r.indicador) + '" placeholder="Ej.: 5 tutores"></td>' +
        '<td><select class="select" data-k="estado"><option>pendiente</option><option>en curso</option><option>hecho</option><option>bloqueado</option></select></td>' +
        '<td><button class="btn sm ghost" data-remove="' + idx + '" aria-label="Eliminar">✕</button></td>';
      // set select values
      tr.querySelector('[data-k="prioridad"]').value = r.prioridad || "media";
      tr.querySelector('[data-k="estado"]').value = r.estado || "pendiente";
      tr.querySelectorAll("[data-k]").forEach(function (el) {
        el.addEventListener("input", function () {
          r[el.dataset.k] = el.value;
          save();
        });
        el.addEventListener("change", function () {
          r[el.dataset.k] = el.value;
          save();
        });
      });
      tr.querySelector("[data-remove]").addEventListener("click", function () {
        state.rows.splice(idx, 1);
        save(); render();
      });
      body.appendChild(tr);
    });
  }

  function addRow(seed) {
    state.rows.push(seed || { accion: "", responsable: "", inicio: "", fin: "", prioridad: "media", indicador: "", estado: "pendiente" });
    save(); render();
  }

  function seed() {
    if (state.rows.length) {
      if (!confirm("Esto reemplazará tus acciones actuales. ¿Continuar?")) return;
    }
    state.rows = [
      { accion: "Diagnóstico inicial y línea base", responsable: "", inicio: "", fin: "", prioridad: "alta", indicador: "documento base", estado: "pendiente" },
      { accion: "Definir métricas y responsables", responsable: "", inicio: "", fin: "", prioridad: "alta", indicador: "tabla de indicadores", estado: "pendiente" },
      { accion: "Ejecutar actividades núcleo", responsable: "", inicio: "", fin: "", prioridad: "alta", indicador: "% de avance", estado: "pendiente" },
      { accion: "Monitoreo intermedio", responsable: "", inicio: "", fin: "", prioridad: "media", indicador: "reporte intermedio", estado: "pendiente" },
      { accion: "Comunicación y difusión", responsable: "", inicio: "", fin: "", prioridad: "media", indicador: "publicaciones/eventos", estado: "pendiente" },
      { accion: "Evaluación final y cierre", responsable: "", inicio: "", fin: "", prioridad: "alta", indicador: "informe final", estado: "pendiente" }
    ];
    save(); render();
    window.impactAnalytics.track("tool_generate_click", { tool: "plan-accion", seed: true });
  }

  function download() {
    var head = ["accion", "responsable", "inicio", "fin", "prioridad", "indicador", "estado"];
    var rows = [head.join(",")].concat(
      state.rows.map(function (r) {
        return head.map(function (k) {
          var v = (r[k] || "").replace(/"/g, '""');
          return /[",\n]/.test(v) ? '"' + v + '"' : v;
        }).join(",");
      })
    );
    var csv = rows.join("\n");
    window.downloadText("plan-de-accion.csv", csv, "text/csv;charset=utf-8");
    window.impactAnalytics.track("download_result", { tool: "plan-accion", format: "csv" });
  }

  function clearAll() {
    if (!confirm("¿Vaciar todo el plan?")) return;
    state = { obj: "", lim: "", per: "", rec: "", rows: [] };
    ["f-obj", "f-lim", "f-per", "f-rec"].forEach(function (id) { $(id).value = ""; });
    save(); render();
    window.impactAnalytics.track("tool_reset", { tool: "plan-accion" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    load();
    render();
    ["f-obj", "f-lim", "f-per", "f-rec"].forEach(function (id) {
      $(id).addEventListener("input", function () {
        state[id.replace("f-", "")] = $(id).value;
        save();
      });
    });
    $("btn-add").addEventListener("click", function () { addRow(); });
    $("btn-seed").addEventListener("click", seed);
    $("btn-clear").addEventListener("click", clearAll);
    $("btn-download").addEventListener("click", download);
    $("btn-print").addEventListener("click", function () { window.print(); });
  });
})();
