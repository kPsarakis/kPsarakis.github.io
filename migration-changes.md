# Bootstrap 4 → 5 + mdbootstrap@4 → (dropped) Migration Inventory

Branch: `migrate-bs5-mdb9`
Generated: 2026-04-18 (Phase 0)

Scope: real repo files only. Matches from `.claude/worktrees/**`, `assets/css/bootstrap.min.css*`, `assets/css/mdb.min.css*`, and the three jupyter/tabler/font-awesome third-party SCSS files are intentionally excluded — they'll be swapped wholesale in Phase 3.

---

## 1. `data-*` attribute renames (BS4 → BS5: add `bs-` prefix)

| File                                   | Line       | Attribute                                                          |
| -------------------------------------- | ---------- | ------------------------------------------------------------------ |
| `_includes/header.liquid`              | 31         | `data-toggle="collapse"` → `data-bs-toggle`                        |
| `_includes/header.liquid`              | 32         | `data-target="#navbarNav"` → `data-bs-target`                      |
| `_includes/header.liquid`              | 76         | `data-toggle="dropdown"` → `data-bs-toggle`                        |
| `_includes/projects.liquid`            | 20, 24     | `data-toggle="tooltip"` → `data-bs-toggle`                         |
| `_includes/projects_horizontal.liquid` | 17, 21     | `data-toggle="tooltip"` → `data-bs-toggle`                         |
| `assets/js/common.js`                  | 56         | `[data-toggle="popover"]` selector → `[data-bs-toggle="popover"]`  |
| `_includes/scripts/misc.liquid`        | 5          | `[data-toggle="tooltip"]` selector → `[data-bs-toggle="tooltip"]`  |
| `_sass/_base.scss`                     | 1095, 1127 | `nav[data-toggle="toc"]` — from `bootstrap-toc`, decide in Phase 1 |

**Total: 6 template files + 2 JS/CSS references.**

---

## 2. Spacing utilities (`ml-*`/`mr-*`/`pl-*`/`pr-*` → `ms-*`/`me-*`/`ps-*`/`pe-*`)

Affected files (confirmed matches):

- `_includes/header.liquid`
- `_includes/projects.liquid`
- `_includes/projects_horizontal.liquid`
- `_includes/cv/time_table.liquid`
- `_includes/cv/map.liquid`
- `_includes/resume/awards.liquid`
- `_includes/resume/basics.liquid`
- `_includes/resume/education.liquid`
- `_includes/resume/projects.liquid`
- `_includes/resume/publications.liquid`
- `_includes/resume/volunteer.liquid`
- `_includes/resume/work.liquid`

**12 files.** Safe `sed`-style replacement — the LTR→logical-property swap is a pure rename for LTR sites.

Rename map:

```
ml-  → ms-
mr-  → me-
pl-  → ps-
pr-  → pe-
```

(Applies to all suffixes: `0|1|2|3|4|5|auto` and all responsive breakpoints `ml-md-4` etc.)

---

## 3. Font weight utilities (`font-weight-*` → `fw-*`)

Affected files:

- `_layouts/about.liquid`
- `_includes/header.liquid`
- `_includes/cv/list.liquid`
- `_includes/cv/map.liquid`
- `_includes/cv/nested_list.liquid`
- `_includes/cv/time_table.liquid`
- `_includes/resume/awards.liquid`
- `_includes/resume/basics.liquid`
- `_includes/resume/education.liquid`
- `_includes/resume/projects.liquid`
- `_includes/resume/publications.liquid`
- `_includes/resume/volunteer.liquid`
- `_includes/resume/work.liquid`

**13 files.**

Rename map:

```
font-weight-bold    → fw-bold
font-weight-normal  → fw-normal
font-weight-light   → fw-light
font-weight-bolder  → fw-bolder
font-weight-lighter → fw-lighter
```

---

## 4. Misc utility renames

| Old (BS4)                    | New (BS5)                   | Files                                                                                                     |
| ---------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------- |
| `text-left` / `text-right`   | `text-start` / `text-end`   | `_includes/header.liquid`, `_layouts/cv.liquid`, `_pages/blog.md`, `_includes/projects_horizontal.liquid` |
| `float-left` / `float-right` | `float-start` / `float-end` | `_layouts/cv.liquid`, `_pages/blog.md`, `_sass/_base.scss` (selector)                                     |
| `sr-only`                    | `visually-hidden`           | `_includes/header.liquid`                                                                                 |
| `no-gutters`                 | `g-0`                       | `_includes/projects.liquid`, `_includes/projects_horizontal.liquid`                                       |

Note: `_sass/_base.scss` has `.profile.float-right` / `.profile.float-left` as **selectors** — update both the SCSS selector and the HTML class that sets it (`_layouts/about.liquid` `float-{% if ... %}left{% else %}right{% endif %}`).

No matches found for: `jumbotron`, `form-group`, `form-row`, `custom-control*`, `badge-*`, `close` (as button class).

---

## 5. jQuery Bootstrap plugin calls → vanilla BS5 API

| Location                          | BS4 call                                                      | BS5 replacement                                                                                                           |
| --------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `_includes/scripts/misc.liquid:5` | `$('[data-toggle="tooltip"]').tooltip();`                     | `document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));`                       |
| `assets/js/common.js:56`          | `$('[data-toggle="popover"]').popover({ trigger: "hover" });` | `document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => new bootstrap.Popover(el, { trigger: "hover" }));` |
| `assets/js/common.js:29`          | `$("body").scrollspy({ target: navSelector });`               | `new bootstrap.ScrollSpy(document.body, { target: navSelector });`                                                        |

Three call sites total.

---

## 6. Known blockers (Phase 1)

### `bootstrap-toc` — BS4-only

- `assets/js/bootstrap-toc.min.js`
- `assets/css/bootstrap-toc.min.css`
- Used by: `assets/js/common.js` (lines 21–32) via `Toc.init($myNav)`
- Depends on BS4 scrollspy internals & `nav[data-toggle="toc"]` markup.

**Options** (decide before Phase 3):

1. **Replace with vanilla JS** (~30 lines): build a `<ul>` from `h1–h4`, add BS5 ScrollSpy. Recommended.
2. Find a community BS5 fork (none mainstream as of last check).
3. Drop the TOC feature entirely.

### `mdbootstrap@4` — global restyle, not a component library

`assets/css/mdb.min.css` restyles plain Bootstrap primitives (`.btn`, `.card`, navbar, typography, shadows, body). **Phase 2** plan: snapshot what MDB visually contributes, absorb the 3–5 rules we care about into `_sass/_base.scss`, then delete `mdb.min.css` + `mdb.min.js`.

---

## 7. Files to **swap wholesale** in Phase 3 (not line-edit)

- `assets/css/bootstrap.min.css` (+ `.map`) → Bootstrap 5.3.3 from jsDelivr (remote, with SRI)
- `assets/js/bootstrap.bundle.min.js` (+ `.map`) → Bootstrap 5.3.3 bundle from jsDelivr
- `_includes/head.liquid` / `_includes/scripts/bootstrap.liquid` — point to new URLs, drop MDB lines
- `_config.yml` — remove `mdb:` entry, bump `bootstrap:` entry if tracked there

---

## 8. Screenshot checklist (Phase 0 baseline)

Before touching anything, capture these at **1440×900 desktop** and **390×844 mobile**, both light and dark theme. Save as `screenshots/phase0/<page>-<viewport>-<theme>.png`.

Pages to capture:

- [ ] `/` (home / about) — hero, profile image, news list, selected publications, social icons
- [ ] `/blog/` — post list, float-right elements
- [ ] a representative blog post with: code block, math ($...$), mermaid diagram, image with caption
- [ ] `/publications/` — year headers, abstract/bibtex/award toggle buttons (click one to capture open state)
- [ ] `/projects/` — grid layout, tooltip on hover over a GitHub star badge
- [ ] `/cv/` — full CV with nested lists, time table, map
- [ ] `/repositories/` if enabled
- [ ] Navbar dropdown open (desktop), navbar collapsed/expanded (mobile)
- [ ] TOC sidebar on any page that has one (confirms `bootstrap-toc` state)
- [ ] Popover-on-hover (find any element with `data-toggle="popover"`)
- [ ] A page with a `<table>` to verify `no_defer.js` table styling
- [ ] Footer with newsletter form (if enabled)

These become the regression-diff reference after each phase.

---

## 9. Phase sequencing recap

1. **Phase 0** ← _you are here_ — branch, inventory, baseline screenshots. **No code changes.**
2. **Phase 1** — solve `bootstrap-toc` (replace with vanilla JS + BS5 ScrollSpy). Land independently.
3. **Phase 2** — drop `mdb.min.css`/`.js`, absorb ≤100 lines of needed styles into `_sass/_base.scss`. Land independently.
4. **Phase 3** — swap BS4→BS5 assets, apply §1–§5 renames, fix SCSS, update JS API. Largest commit.
5. **Phase 5** — final sweep, Lighthouse A/B vs. `master`, squash-merge.

Each phase = one commit → revertable independently if a regression surfaces.
