// Initialize medium-zoom on any [data-zoomable] element.
(function () {
  function init() {
    // `ee` appends ~93% alpha to the theme bg color so the overlay
    // sits behind the zoomed image without fully obscuring context.
    var background = getComputedStyle(document.documentElement).getPropertyValue("--global-bg-color") + "ee";
    window.medium_zoom = mediumZoom("[data-zoomable]", { background: background });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
