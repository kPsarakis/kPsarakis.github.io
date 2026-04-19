// Force external links inside Jupyter notebook iframes to open in a new tab.
(function () {
  function rewriteIframeLinks() {
    document.querySelectorAll(".jupyter-notebook-iframe-container").forEach(function (container) {
      var iframe = container.querySelector("iframe");
      if (!iframe) return;

      // Same-origin iframes only — cross-origin access throws.
      var doc;
      try {
        doc = iframe.contentWindow && iframe.contentWindow.document;
      } catch (_) {
        return;
      }
      if (!doc || !doc.body) return;

      doc.body.querySelectorAll("a[href]").forEach(function (a) {
        a.setAttribute("target", "_blank");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", rewriteIframeLinks);
  } else {
    rewriteIframeLinks();
  }
})();
