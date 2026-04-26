---
layout: about
title: About
permalink: /
# Subtitle removed — moved into status lines under the profile
# picture (more_info below) so the page header is just the name +
# the gradient underline. Layout (about.liquid) gates the .desc
# render with `{% if page.subtitle %}` so no empty <p> survives.

profile:
  align: right
  image: kyriakos.webp
  # Small variant served to narrow viewports via <picture media> in
  # _layouts/about.liquid and a matching media-scoped <link rel=preload>
  # in _includes/head.liquid. Natural pixel dimensions below.
  image_sm: kyriakos-sm.webp
  image_sm_width: 200
  image_sm_height: 284
  # Natural pixel dimensions of the source file. Emitted verbatim on
  # the <img> width/height attributes so the browser reserves the
  # right box before bytes arrive. Fixes the Lighthouse "incorrect
  # aspect ratio" warning (the figure.liquid default `width="100%"
  # height="auto"` are invalid HTML attrs — Chrome was computing 0.17
  # instead of the real 0.70) and helps CLS.
  image_width: 423
  image_height: 600
  image_circular: false # crops the image to make it circular
  more_info: >
    <div class="info-line"><i class="fa-solid fa-briefcase info-icon" aria-hidden="true"></i> <p>Software Engineer, <a href="https://www.ververica.com/">Ververica</a></p></div>
    <div class="info-line"><i class="fa-solid fa-scroll info-icon" aria-hidden="true"></i> <p>PhD in Data Systems, <a href="https://www.tudelft.nl/en/">TU Delft</a></p></div>
    <div class="info-line"><i class="ti ti-map-pin info-icon" aria-hidden="true"></i> <p>Delft, The Netherlands</p></div>

news: false # includes a list of news items
selected_papers: false # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page
---

I am a Software Engineer at [Ververica](https://www.ververica.com/), where I work on stream processing systems that power large-scale, real-time data applications. I enjoy building systems that make data processing more intuitive, scalable, and developer-friendly; helping shape the next generation of data platforms.

I completed my PhD at TU Delft, where I worked at the intersection of stream processing and serverless computing under the supervision of [Asterios Katsifodimos](http://asterios.katsifodimos.com/). My research introduced [Styx](https://github.com/delftdata/styx), a distributed streaming dataflow engine that provides high-performance serializable transactions for stateful cloud applications. Styx aims to make microservice development easy and accessible for everyone by combining the programmability of high-level languages with the scalability and fault-tolerance of modern stream processors.

Prior to that, I obtained my MSc in Computer Science at TU Delft with a thesis on [Holistic Schema Matching at Scale](https://repository.tudelft.nl/islandora/object/uuid%3Af4ebeda3-6465-49da-813b-f1e6e0820c60) in collaboration with ING Bank Netherlands. My first degree was a diploma (Integrated Master’s) in Electrical and Computer Engineering at the [Technical University of Crete](https://www.tuc.gr/index.php?id=5397).
