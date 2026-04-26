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
   * Light mode: filled-button look — white text on the theme-
   * color background applied via _modern.scss's section 17.
   * Both rest and hover keep white text; the bg darkens on hover
   * (handled in _modern.scss) for affordance feedback.
   *
   * Dark mode: keep the previous outline look — bright hover-
   * color text at rest, brightest tier on hover, since the
   * filled-fill hadn't been requested for that mode.
   */
  .cv-embed-download {
    color: var(--global-bg-color);
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
