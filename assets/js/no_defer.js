// Tag tables as bootstrap-table where appropriate, and toggle table-dark
// based on the current theme. Loaded without `defer` so it runs before
// bootstrap-table's init code sees the markup.
(function () {
  function decorateTables() {
    var isDark = typeof determineComputedTheme === "function" && determineComputedTheme() === "dark";

    document.querySelectorAll("table").forEach(function (table) {
      table.classList.toggle("table-dark", isDark);

      // Skip tables nested inside news / card / archive / code blocks —
      // bootstrap-table's styling would fight the surrounding component.
      if (table.closest('[class*="news"], [class*="card"], [class*="archive"], code')) {
        return;
      }

      table.setAttribute("data-toggle", "table");
      table.classList.add("table-hover");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", decorateTables);
  } else {
    decorateTables();
  }
})();
