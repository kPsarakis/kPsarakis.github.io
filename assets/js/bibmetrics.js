(async function () {
  const url = "{{ '/assets/data/citations.json' | relative_url }}";

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('No citations.json');
    const data = await res.json();

    const $wrap = document.getElementById('bib-metrics');
    const $total = document.getElementById('metric-total');
    const $h = document.getElementById('metric-h');
    const $i10wrap = document.getElementById('metric-i10-wrap');
    const $i10 = document.getElementById('metric-i10');
    const $updated = document.getElementById('metric-updated');
    const $select = document.getElementById('metric-source-select');

    const sources = data.sources || {};

    // Populate select dropdown
    Object.keys(sources).forEach(key => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = key.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
      $select.appendChild(opt);
    });

    function show(sourceKey) {
      const src = sources[sourceKey];
      if (!src) return;
      $total.textContent = src.total_citations ?? '—';
      $h.textContent = src.h_index ?? '—';
      if (typeof src.i10_index === 'number') {
        $i10.textContent = src.i10_index;
        $i10wrap.hidden = false;
      } else {
        $i10wrap.hidden = true;
      }
      $updated.textContent = src.updated ? `· updated ${src.updated}` : '';
    }

    $select.addEventListener('change', () => show($select.value));

    // Default: first source
    if ($select.options.length > 0) {
      $select.value = $select.options[0].value;
      show($select.value);
    }

    $wrap.hidden = false;
  } catch (e) {
    console.warn('Citation metrics unavailable:', e);
  }
})();
