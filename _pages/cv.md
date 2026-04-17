---
layout: page
permalink: /cv/
title: Curriculum Vitae
nav: true
nav_order: 4
---

<div class="cv-embed-container">
  <div class="cv-embed-actions">
    <a href="{{ '/assets/pdf/Kyriakos_CV.pdf' | relative_url }}" class="btn btn-sm z-depth-0" role="button" target="_blank" rel="noopener noreferrer">
      <i class="fa-solid fa-download"></i> Download PDF
    </a>
  </div>
  <iframe
    src="{{ '/assets/pdf/Kyriakos_CV.pdf' | relative_url }}"
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

  .cv-embed-iframe {
    width: 100%;
    height: 85vh;
    min-height: 600px;
    border: 1px solid var(--global-divider-color);
    border-radius: 4px;
  }
</style>
