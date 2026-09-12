/* ImpactTools — shared UI + analytics */
(function () {
  "use strict";

  // Force scroll to top on new navigation (browsers otherwise restore prior scroll).
  try {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!location.hash) window.scrollTo(0, 0);
  } catch (e) { /* noop */ }

  // Analytics stub: queues events so GA/AdSense can consume later.
  window.impactAnalytics = window.impactAnalytics || {
    q: [],
    track: function (event, payload) {
      try {
        var entry = { t: Date.now(), event: event, payload: payload || {} };
        this.q.push(entry);
        if (typeof window.gtag === "function") {
          window.gtag("event", event, payload || {});
        }
        if (window.location.search.indexOf("debug") !== -1) {
          console.log("[analytics]", event, payload);
        }
      } catch (e) { /* noop */ }
    }
  };

  // Mobile menu toggle
  function initMenu() {
    var btn = document.querySelector(".menu-toggle");
    var menu = document.getElementById("mobile-menu");
    if (!btn || !menu) return;
    btn.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Toast
  window.toast = function (msg) {
    var el = document.getElementById("__toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.id = "__toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(window.__toastT);
    window.__toastT = setTimeout(function () { el.classList.remove("show"); }, 1800);
  };

  // Copy helper for tool results
  window.copyText = function (text, label) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () {
          window.toast(label || "Copiado al portapapeles");
          window.impactAnalytics.track("copy_result", { chars: text.length });
        }, function () { fallback(); });
      } else { fallback(); }
    } catch (e) { fallback(); }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); window.toast(label || "Copiado"); }
      catch (e) { window.toast("No se pudo copiar"); }
      document.body.removeChild(ta);
    }
  };

  // Download helper (text)
  window.downloadText = function (filename, text, mime) {
    try {
      var blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      setTimeout(function () {
        document.body.removeChild(a); URL.revokeObjectURL(url);
      }, 100);
      window.impactAnalytics.track("download_result", { file: filename });
    } catch (e) {
      window.toast("No se pudo descargar");
    }
  };

  // Analytics: link clicks between tools
  function initToolLinkTracking() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[data-tool]");
      if (!a) return;
      window.impactAnalytics.track("tool_navigation", { to: a.getAttribute("data-tool") });
    });
  }

  // Page-view event
  function trackPageView() {
    window.impactAnalytics.track("page_view", { path: location.pathname });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initToolLinkTracking();
    trackPageView();
    // Belt-and-suspenders: some browsers restore scroll AFTER DOMContentLoaded
    try { if (!location.hash) window.scrollTo(0, 0); } catch (e) {}
  });
  window.addEventListener("pageshow", function (e) {
    // Handles back-forward cache restores
    try { if (!location.hash) window.scrollTo(0, 0); } catch (err) {}
  });
})();
