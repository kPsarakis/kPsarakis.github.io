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
   * Bootstrap's bare .btn has no explicit color, so the "Download
   * PDF" anchor inherits --global-text-color. In dark mode that's a
   * light-grey-on-dark-grey combo that reads fine for body copy but
   * washes out as a button label, and hovering gave no feedback
   * because there were no rules targeting this anchor's :hover.
   *
   * Light mode: keep the current dark-blue theme color (good
   * contrast on white). Dark mode: promote the brighter hover tier
   * to the default so the label actually pops, and keep the
   * brightest variant for :hover interaction feedback.
   */
  .cv-embed-download {
    color: var(--global-theme-color);
  }

  .cv-embed-download:hover {
    color: var(--global-hover-color);
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
