// Update the visible hint badge on the search button to match the
// actual hotkey bound by <ninja-keys openHotkey="cmd+k,/">:
//   - Mac:     ⌘K (the Ctrl+K shortcut gets hijacked by Firefox/Chrome,
//              so the cross-platform binding is `/`, and Mac stays on ⌘K)
//   - Others:  / (default badge — already baked into the header markup)
document.addEventListener("readystatechange", () => {
  if (document.readyState !== "interactive") return;
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  if (!isMac) return;
  const el = document.querySelector("#search-toggle .nav-link");
  if (el) {
    el.innerHTML = '&#x2318; k <i class="ti ti-search" aria-hidden="true"></i>';
  }
});
