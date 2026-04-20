#!/usr/bin/env node
// Per-page purge + inline: for every HTML in _site/, run PurgeCSS
// with ONLY that HTML file (plus all JS, because JS drives dynamic
// classes cross-page) as the content source, then inline the
// resulting CSS into that page and strip the bootstrap/main <link>
// tags.
//
// Why per-page instead of one shared purge:
// Lighthouse measures CSS coverage per-page. A single shared
// purged CSS unavoidably carries the *union* of every page's
// needs — rules for /publications/'s citation table travel with
// /cv/'s inlined payload, rules for a hypothetical post's modal
// travel with /'s payload, etc. PurgeCSS was already trimming
// ~96% of Bootstrap's raw weight (232 KiB → ~13 KiB), but
// Lighthouse still flagged ~10 KiB as unused on the publications
// page because those rules match selectors that only appear on
// other pages. Purging per-file drops each page's inlined CSS to
// exactly what that page's markup references, shaving another
// ~5-9 KiB per HTML response.
//
// Replaces the standalone `npx purgecss` step in deploy.yml — this
// script now handles tree-shaking AND inlining in one pass.
//
// Runs AFTER `jekyll build` produces raw bootstrap.min.css +
// main.css in _site/assets/css/.

import { promises as fs } from "node:fs";
import path from "node:path";
import { PurgeCSS } from "purgecss";

const SITE_DIR = "_site";
const CSS_FILES = [
  // Order matters: main.css's rules override Bootstrap's.
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

// Safelist: selectors PurgeCSS can't prove are used by static
// analysis but we know the runtime needs. Keep this list tight —
// every entry is a rule that survives purging on every page.
//
// - Bootstrap JS toggles (`show`, `collapsing`, `fade`, etc.):
//   also appear as string literals in bootstrap.bundle.min.js,
//   which we include in the content glob below — so purgecss picks
//   them up automatically. Listed here as belt-and-braces in case
//   the bundle isn't present on a given page.
// - `fa-sun` / `fa-moon`: swapped by theme.js when toggling dark
//   mode; both literals exist in theme.js so the content glob also
//   catches them, but list explicitly for resilience.
// - `data-theme`: attribute selector Bootstrap's own rules depend
//   on via our theme layer.
const SAFELIST = {
  standard: [
    /^fa-sun$/,
    /^fa-moon$/,
    /^show$/,
    /^fade$/,
    /^collapsing$/,
    /^collapsed$/,
    /^modal-open$/,
    /^modal-backdrop$/,
    /^active$/,
    /^data-theme$/,
  ],
  // Keep any selector containing these even if unused — covers
  // theme-swap tokens that main.css references via attribute
  // selectors like html[data-theme="dark"].
  greedy: [/data-theme/],
};

async function walkFiles(dir, ext) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walkFiles(p, ext)));
    else if (entry.isFile() && entry.name.endsWith(ext)) out.push(p);
  }
  return out;
}

function rewriteRelativeUrls(css) {
  // When main.css lived at /assets/css/main.css, `url("../webfonts/
  // fa-solid-900.woff2")` resolved to /assets/webfonts/... Once
  // inlined into HTML at "/" or "/cv/" those relative URLs resolve
  // against the document location and 404 — silently stripping
  // FontAwesome + Tabler glyphs. baseurl is empty, so absolute
  // /assets/... is safe.
  return css.replace(/url\(\s*(['"]?)\.\.\/([^'")]+)\1\s*\)/g, 'url("/assets/$2")');
}

async function main() {
  const [htmlFiles, jsFiles] = await Promise.all([walkFiles(SITE_DIR, ".html"), walkFiles(SITE_DIR, ".js")]);

  let touched = 0;
  let totalBytes = 0;
  const purger = new PurgeCSS();

  for (const htmlFile of htmlFiles) {
    const original = await fs.readFile(htmlFile, "utf8");

    // Skip pages that don't link either stylesheet (e.g. upstream
    // generated pages we didn't template). Keeps the script
    // idempotent if run twice.
    if (!LINK_PATTERNS.some((p) => p.test(original))) continue;
    // Regex state: .test() with /g mutates lastIndex. Reset by
    // reassignment on the patterns we just tested — re-creating
    // would be cleaner but the constants are module-level.
    LINK_PATTERNS.forEach((p) => {
      p.lastIndex = 0;
    });

    const result = await purger.purge({
      content: [
        // The one HTML file we're building CSS for. Raw string
        // avoids re-reading from disk when we already have it.
        { raw: original, extension: "html" },
        // All JS: dynamic-class literals (`.show`, `.fa-moon`,
        // etc.) appear here and would be dropped otherwise.
        ...jsFiles,
      ],
      css: CSS_FILES,
      safelist: SAFELIST,
      // Default extractor handles HTML + JS adequately; no need
      // to register custom ones.
    });

    // PurgeCSS returns one entry per input CSS file. Concatenate
    // in the original CSS_FILES order so cascade is preserved.
    const order = new Map(CSS_FILES.map((f, i) => [path.resolve(f), i]));
    result.sort((a, b) => order.get(path.resolve(a.file)) - order.get(path.resolve(b.file)));
    let combined = result.map((r) => r.css).join("\n");
    combined = rewriteRelativeUrls(combined);

    if (combined.includes("</style>")) {
      throw new Error(`CSS payload for ${htmlFile} contains </style>; refusing to inline`);
    }
    const styleBlock = `<style>${combined}</style>`;

    // Replace the first bootstrap/main <link> with the inline
    // block, strip the other. Matches the previous behavior so
    // the <style> lands where the cascade expects.
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
      await fs.writeFile(htmlFile, html);
      touched += 1;
      totalBytes += combined.length;
    }
  }

  const avg = touched ? Math.round(totalBytes / touched).toLocaleString() : 0;
  console.log(`Purged + inlined per-page CSS into ${touched} HTML file(s) (avg ${avg} bytes/page).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
