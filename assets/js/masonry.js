// Initialize masonry-layout and relayout as images load.
// Uses the vanilla APIs from masonry-layout and imagesloaded; no jQuery.
(function () {
  function init() {
    var gridEl = document.querySelector(".grid");
    if (!gridEl || typeof Masonry === "undefined") return;

    var masonryInstance = new Masonry(gridEl, {
      gutter: 10,
      horizontalOrder: true,
      itemSelector: ".grid-item",
    });

    if (typeof imagesLoaded === "function") {
      imagesLoaded(gridEl).on("progress", function () {
        masonryInstance.layout();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
