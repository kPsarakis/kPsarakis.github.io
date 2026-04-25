// Tag tables as bootstrap-table where appropriate, and toggle table-dark
// based on the current theme. Loaded without `defer` so it runs before
// bootstrap-table's init code sees the markup.
(function () {
  function decorateTables() {
    var isDark = typeof determineComputedTheme === "function" && determineComputedTheme() === "dark";

    document.querySelectorAll("table").forEach(function (table) {
      // .styled-table tables (publications citations + teaching MSc
      // supervision list) already carry their own theme-aware hover
      // + dark-mode styling via `html[data-theme="dark"] .styled-table`
      // rules in _base.scss. Tagging them here added .table-hover /
      // .table-dark after first paint, which then triggered the 300 ms
      // row background-color transition on _base.scss's
      // `.styled-table tbody tr` rule — the visible "table settling"
      // the user reported. Skip them entirely.
      if (table.classList.contains("styled-table")) {
        return;
      }

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
