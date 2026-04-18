/*!
 * Lightweight Table of Contents generator.
 * Replaces afeld/bootstrap-toc. Builds a nested <ul class="nav"> inside
 * #toc-sidebar from the page's h1-h4 headings, then activates Bootstrap
 * scrollspy. Headings marked with [data-toc-skip] are ignored.
 */
(function () {
  "use strict";

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function findContentRoot(nav) {
    // Prefer the sibling .col-sm-9 that lives alongside the TOC column.
    var row = nav.closest(".row");
    if (row) {
      var main = row.querySelector(".col-sm-9");
      if (main) return main;
    }
    return document.querySelector("article") || document.querySelector(".post") || document.body;
  }

  function build(nav) {
    var content = findContentRoot(nav);

    // On the publications index the year <h2>s are noisy in the TOC.
    content.querySelectorAll(".publications h2").forEach(function (h) {
      h.setAttribute("data-toc-skip", "");
    });

    var headings = content.querySelectorAll("h1, h2, h3, h4");
    if (!headings.length) return false;

    // Assign ids to headings that lack them, skip [data-toc-skip]
    var eligible = [];
    headings.forEach(function (h) {
      if (h.hasAttribute("data-toc-skip")) return;
      if (!h.id) h.id = slugify(h.textContent);
      eligible.push(h);
    });
    if (!eligible.length) return false;

    // Normalize so shallowest heading becomes depth 1
    var minLevel = Math.min.apply(
      null,
      eligible.map(function (h) {
        return parseInt(h.tagName.charAt(1), 10);
      })
    );

    var rootUl = document.createElement("ul");
    rootUl.className = "nav";
    var lists = [rootUl]; // lists[i] = <ul> at depth i+1
    var lastLi = [null]; // lastLi[i] = last <li> appended to lists[i]

    eligible.forEach(function (h) {
      var depth = parseInt(h.tagName.charAt(1), 10) - minLevel + 1;

      // Grow: create nested <ul>s until we reach desired depth
      while (lists.length < depth) {
        var anchor = lastLi[lists.length - 1];
        if (!anchor) {
          // Orphan deeper heading with no parent; stay at current depth
          break;
        }
        var subUl = document.createElement("ul");
        subUl.className = "nav";
        anchor.appendChild(subUl);
        lists.push(subUl);
        lastLi.push(null);
      }
      // Shrink: discard deeper lists if we've come back up
      if (lists.length > depth) {
        lists.length = depth;
        lastLi.length = depth;
      }

      var li = document.createElement("li");
      li.className = "nav-item";
      var a = document.createElement("a");
      a.className = "nav-link";
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);

      var target = lists[lists.length - 1];
      target.appendChild(li);
      lastLi[lists.length - 1] = li;
    });

    nav.appendChild(rootUl);
    return true;
  }

  function activate() {
    var nav = document.getElementById("toc-sidebar");
    if (!nav) return;
    if (!build(nav)) return;

    // Bootstrap scrollspy (BS4 jQuery plugin API; will become
    // new bootstrap.ScrollSpy(...) in Phase 3).
    if (window.jQuery && typeof window.jQuery.fn.scrollspy === "function") {
      window.jQuery("body").scrollspy({ target: "#toc-sidebar", offset: 80 });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", activate);
  } else {
    activate();
  }
})();
