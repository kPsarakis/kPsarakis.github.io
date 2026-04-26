---
layout: page
permalink: /cv/
title: Curriculum Vitae
nav: true
nav_order: 4
---

<div class="cv-embed-container">
  <div class="cv-embed-actions">
    <a href="{{ '/assets/pdf/Kyriakos_CV.pdf' | relative_url }}" class="btn btn-sm z-depth-0 cv-embed-download" role="button" target="_blank" rel="noopener noreferrer">
      <i class="fa-solid fa-download"></i> Download PDF
    </a>
  </div>
  <iframe
    src="{{ '/assets/pdf/Kyriakos_CV.pdf' | relative_url }}#navpanes=0&view=FitH"
    class="cv-embed-iframe"
    title="Curriculum Vitae"
    loading="lazy"
  ></iframe>
</div>

<style>
  .cv-embed-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .cv-embed-actions {
    display: flex;
    justify-content: flex-end;
  }

  /*
   * Light mode rest: outline look — theme-color text + icon on
   * a transparent bg (border + bg styling in _modern.scss
   * section 17). On hover, bg fills with theme-color and text
   * inverts to bg-color (white) — handled by the :hover rule
   * below.
   *
   * Dark mode: keep the brighter hover-color tier at rest, and
   * the brightest variant on hover for interaction feedback.
   */
  .cv-embed-download {
    color: var(--global-theme-color);
  }

  .cv-embed-download:hover {
    color: var(--global-bg-color);
  }

  html[data-theme="dark"] .cv-embed-download {
    color: var(--global-hover-color);
  }

  html[data-theme="dark"] .cv-embed-download:hover {
    color: var(--global-hover-text-color);
  }

  .cv-embed-iframe {
    width: 100%;
    height: 85vh;
    min-height: 600px;
    border: 1px solid var(--global-divider-color);
    border-radius: 4px;
  }
</style>
