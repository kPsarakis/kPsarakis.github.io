#!/usr/bin/env node
// Post-purgecss: inline bootstrap.min.css + main.css into every HTML
// page in _site/ and remove the two <link rel=stylesheet> tags that
// would otherwise render-block.
//
// Lighthouse had the two stylesheets on the critical chain for
// ~940 ms combined (the only remaining render-blocking requests
// after the other J sprint work). Their purged+minified payloads
// total ~13 KiB transfer — small enough that inlining beats the
// round-trip every time, even ignoring that GitHub Pages' 10-min
// Cache-Control TTL mostly defeats HTTP caching anyway.
//
// Runs AFTER PurgeCSS so the inlined bytes are the tree-shaken
// versions, not the raw 600+ KiB SCSS output.

import { promises as fs } from "node:fs";
import path from "node:path";

const SITE_DIR = "_site";
const CSS_FILES = [
  // Order matches head.liquid's original <link> order, so cascade
  // precedence (main.css overrides bootstrap) is preserved.
  "_site/assets/css/bootstrap.min.css",
  "_site/assets/css/main.css",
];

// Matches <link rel="stylesheet" href="...bootstrap.min.css?hash...">
// and the same for main.css. The cache-bust query string means we
// can't match a fixed URL; anchor on the filename instead.
const LINK_PATTERNS = [
  /<link[^>]*href="[^"]*\/bootstrap\.min\.css(?:\?[^"]*)?"[^>]*>\s*/g,
  /<link[^>]*href="[^"]*\/main\.css(?:\?[^"]*)?"[^>]*>\s*/g,
];

async function walkHtml(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walkHtml(p)));
    else if (entry.isFile() && entry.name.endsWith(".html")) out.push(p);
  }
  return out;
}

async function main() {
  const cssParts = await Promise.all(CSS_FILES.map((f) => fs.readFile(f, "utf8")));
  let combined = cssParts.join("\n");
  // Rewrite relative url("../X/...") references to absolute
  // "/assets/X/..." paths. When the CSS lived at
  // /assets/css/main.css, "../webfonts/fa-solid-900.woff2" resolved
  // to /assets/webfonts/fa-solid-900.woff2. Once we inline the CSS
  // into HTML at "/" or "/cv/" etc., those relatives resolve
  // against the document URL instead and 404 — which silently
  // strips FontAwesome + Tabler glyphs (download/theme-toggle/
  // social/map-marker icons all disappear). baseurl is empty, so
  // absolute /assets/... is safe.
  combined = combined.replace(/url\(\s*(['"]?)\.\.\/([^'")]+)\1\s*\)/g, 'url("/assets/$2")');
  // <style> can contain any CSS except "</style>". PurgeCSS output
  // won't produce that literal, but be paranoid — an unexpected
  // match would break the page.
  if (combined.includes("</style>")) {
    throw new Error("CSS payload contains </style>; refusing to inline");
  }
  const styleBlock = `<style>${combined}</style>`;

  const htmlFiles = await walkHtml(SITE_DIR);
  let touched = 0;
  for (const file of htmlFiles) {
    const original = await fs.readFile(file, "utf8");
    let html = original;
    let replacedFirst = false;
    for (const pattern of LINK_PATTERNS) {
      html = html.replace(pattern, () => {
        if (replacedFirst) return "";
        replacedFirst = true;
        return styleBlock;
      });
    }
    if (html !== original) {
      await fs.writeFile(file, html);
      touched += 1;
    }
  }
  console.log(`Inlined ${combined.length.toLocaleString()} bytes of CSS into ${touched} HTML file(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
