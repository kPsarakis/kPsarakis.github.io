// ESLint flat config (ESLint 9+).
//
// Scope: our hand-written browser JS under assets/js/. The goal is a
// lightweight baseline — catch genuine bugs (undefined vars, unreachable
// code) without picking stylistic fights prettier already settles.
//
// Hard ignores:
//   - *.min.js                              (vendored)
//   - assets/js/search-data.js              (Liquid template, not valid JS pre-build)
//   - assets/js/typograms.js                (vendored port of google/typograms)
//   - assets/js/bibsearch.js                (vendored bundle, 13k lines)
//   - assets/js/highlight-search-term.js    (vendored bundle)
//   - assets/js/distillpub/**                (vendored distill.pub transforms)
//   - _site/, .jekyll-cache/, vendor/, node_modules/, .claude/
import globals from "globals";
import js from "@eslint/js";

const browserLibGlobals = {
  // Third-party libs loaded via <script> on specific pages.
  bootstrap: "readonly",
  MathJax: "readonly",
  mermaid: "readonly",
  anchors: "readonly",
  d3: "readonly",
  echarts: "readonly",
  vegaEmbed: "readonly",
  Diff2HtmlUI: "readonly",
  Masonry: "readonly",
  imagesLoaded: "readonly",
  medium_zoom: "readonly",
  mediumZoom: "readonly",
  // Our own cross-file globals defined in theme.js.
  determineComputedTheme: "readonly",
  setHighlight: "readonly",
  setTheme: "readonly",
  toggleTheme: "readonly",
  initTheme: "readonly",
  openSearchModal: "readonly",
};

export default [
  {
    ignores: [
      "**/*.min.js",
      "assets/js/search-data.js",
      "assets/js/typograms.js",
      "assets/js/bibsearch.js",
      "assets/js/highlight-search-term.js",
      "assets/js/distillpub/**",
      "_site/**",
      ".jekyll-cache/**",
      "vendor/**",
      "node_modules/**",
      ".claude/**",
      "eslint.config.mjs",
    ],
  },
  js.configs.recommended,
  // Classic browser scripts under assets/js/.
  {
    files: ["assets/js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: { ...globals.browser, ...browserLibGlobals },
    },
    rules: {
      "no-unused-vars": ["warn", { args: "none", caughtErrors: "none" }],
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
  // theme.js *defines* several of the cross-file globals above, which
  // trips no-redeclare. Disable it for this one file rather than
  // scatter /* global */ comments across consumers.
  {
    files: ["assets/js/theme.js"],
    rules: {
      "no-redeclare": "off",
    },
  },
  // Root-level CommonJS dev configs.
  {
    files: ["*.config.cjs", "purgecss.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: { ...globals.node },
    },
  },
  // Node ESM scripts under bin/ (post-build tooling like the
  // critical-CSS inliner). Needs Node globals (console, process, URL).
  {
    files: ["bin/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node },
    },
  },
];
