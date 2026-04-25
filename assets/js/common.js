(function () {
  // The abstract / award / bibtex buttons on every bibliography entry
  // each reveal one of three sibling panels and hide the other two.
  // Find the three panels inside the entry that owns the clicked button
  // (two levels up from the anchor), then flip the classes.
  function wireBibToggles() {
    var TYPES = ["abstract", "award", "bibtex"];

    document.querySelectorAll("a.abstract, a.award, a.bibtex").forEach(function (anchor) {
      var clickedType = TYPES.find(function (t) {
        return anchor.classList.contains(t);
      });
      if (!clickedType) return;

      anchor.addEventListener("click", function () {
        var root = anchor.parentElement && anchor.parentElement.parentElement;
        if (!root) return;

        TYPES.forEach(function (type) {
          var selector = type === clickedType ? "." + type + ".hidden" : "." + type + ".hidden.open";
          root.querySelectorAll(selector).forEach(function (panel) {
            panel.classList.toggle("open");
          });
        });
      });
    });
  }

  // Inject our jupyter.css into the <head> of every same-origin Jupyter
  // notebook iframe, and (in dark mode) flip the JupyterLab theme flags
  // on <body> once the iframe finishes loading.
  function styleJupyterIframes() {
    var isDark = typeof determineComputedTheme === "function" && determineComputedTheme() === "dark";

    function applyTo(iframe) {
      var doc;
      try {
        doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
      } catch (_) {
        return;
      }
      if (!doc) return;

      if (doc.head) {
        var link = doc.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "../css/jupyter.css";
        doc.head.appendChild(link);
      }

      if (isDark && doc.body) {
        doc.body.setAttribute("data-jp-theme-light", "false");
        doc.body.setAttribute("data-jp-theme-name", "JupyterLab Dark");
      }
    }

    document.querySelectorAll(".jupyter-notebook-iframe-container iframe").forEach(function (iframe) {
      // Apply now if the iframe has already loaded (complete document),
      // and re-apply on future loads to survive navigation inside the frame.
      try {
        if (iframe.contentDocument && iframe.contentDocument.readyState === "complete") {
          applyTo(iframe);
        }
      } catch (_) {
        /* cross-origin */
      }
      iframe.addEventListener("load", function () {
        applyTo(iframe);
      });
    });
  }

  function initPopovers() {
    if (typeof bootstrap === "undefined" || !bootstrap.Popover) return;
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach(function (el) {
      new bootstrap.Popover(el, { trigger: "hover" });
    });
  }

  // Append a clickable `#` anchor link to every heading with an id.
  // Kramdown auto-generates ids for h2/h3 headings on most pages (e.g.
  // /teaching's "Courses" / "MSc Thesis Supervision"), but the ids
  // were reachable only via the address bar without a UI affordance.
  // Standard docs convention: show a faint `#` glyph on heading hover
  // that links to the anchor. CSS in _modern.scss controls visibility.
  function addHeadingAnchors() {
    document.querySelectorAll("article h2[id], article h3[id]").forEach(function (h) {
      if (h.querySelector(".heading-anchor")) return; // idempotent
      var link = document.createElement("a");
      link.className = "heading-anchor";
      link.href = "#" + h.id;
      link.setAttribute("aria-label", "Permalink to " + (h.textContent || "this section"));
      link.textContent = "#";
      h.appendChild(link);
    });
  }

  function init() {
    wireBibToggles();
    styleJupyterIframes();
    initPopovers();
    addHeadingAnchors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
