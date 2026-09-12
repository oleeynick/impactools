/* Business Model Canvas — ImpactTools */
(function () {
  "use strict";
  var STORE_KEY = "impacttools.canvas.v1";
  var KEYS = ["cs", "cr", "ch", "vp", "ka", "kr", "kp", "cost", "rev"];

  function $(id) { return document.getElementById(id); }
  function blocks() { return document.querySelectorAll(".bmc-block [contenteditable]"); }

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (data.title) $("bmc-title").value = data.title;
      KEYS.forEach(function (k) {
        var block = document.querySelector('.bmc-block[data-key="' + k + '"] [contenteditable]');
        if (block && data[k]) block.innerText = data[k];
      });
      updateSave("Recuperado desde tu último uso.");
    } catch (e) { /* noop */ }
  }

  function save(silent) {
    try {
      var data = { title: $("bmc-title").value || "" };
      KEYS.forEach(function (k) {
        var block = document.querySelector('.bmc-block[data-key="' + k + '"] [contenteditable]');
        data[k] = block ? block.innerText.trim() : "";
      });
      data.updatedAt = new Date().toISOString();
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
      if (!silent) {
        updateSave("Guardado a las " + new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));
        window.toast("Canvas guardado");
      }
    } catch (e) {
      updateSave("No se pudo guardar en el navegador.");
    }
  }

  function updateSave(msg) {
    var s = $("save-status");
    if (s) s.textContent = msg;
  }

  function autoSave() {
    clearTimeout(window.__canvasT);
    window.__canvasT = setTimeout(function () { save(true); updateSave("Cambios guardados automáticamente"); }, 700);
  }

  function download() {
    var out = { title: $("bmc-title").value || "canvas", updatedAt: new Date().toISOString() };
    KEYS.forEach(function (k) {
      var block = document.querySelector('.bmc-block[data-key="' + k + '"] [contenteditable]');
      out[k] = block ? block.innerText.trim() : "";
    });
    var filename = (out.title || "canvas").replace(/\s+/g, "-").toLowerCase() + ".json";
    window.downloadText(filename, JSON.stringify(out, null, 2), "application/json");
  }

  function clearAll() {
    if (!confirm("¿Vaciar todo el canvas? Esta acción no se puede deshacer.")) return;
    $("bmc-title").value = "";
    document.querySelectorAll(".bmc-block [contenteditable]").forEach(function (b) { b.innerText = ""; });
    localStorage.removeItem(STORE_KEY);
    updateSave("Canvas vacío.");
    window.impactAnalytics.track("tool_reset", { tool: "canvas" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    load();
    blocks().forEach(function (b) {
      b.addEventListener("input", autoSave);
      b.addEventListener("blur", function () { save(true); });
    });
    $("bmc-title").addEventListener("input", autoSave);
    $("btn-save").addEventListener("click", function () { save(false); window.impactAnalytics.track("tool_completed", { tool: "canvas" }); });
    $("btn-print").addEventListener("click", function () { window.print(); window.impactAnalytics.track("download_result", { tool: "canvas", format: "print" }); });
    $("btn-download").addEventListener("click", function () { download(); window.impactAnalytics.track("download_result", { tool: "canvas", format: "json" }); });
    $("btn-clear").addEventListener("click", clearAll);
  });
})();
