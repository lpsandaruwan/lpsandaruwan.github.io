// editorial-redesign — site-wide behaviour.
// Vanilla JS, no dependencies. Bundled in document <body> by default layout.

(function () {
  'use strict';

  // --- Sticky header: gain hairline border after slight scroll -------------
  const header = document.querySelector('[data-site-header]');
  if (header) {
    const SCROLL_THRESHOLD = 8;
    let scrolled = false;

    const updateHeader = () => {
      const isScrolled = window.scrollY > SCROLL_THRESHOLD;
      if (isScrolled !== scrolled) {
        scrolled = isScrolled;
        header.classList.toggle('scrolled', scrolled);
      }
    };

    // Initial state + listener (passive for scroll performance).
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  // --- Active nav link: mark by current pathname ---------------------------
  // Match the nav anchor whose data-nav-match attribute equals the current
  // pathname. For anchor-only links (e.g. "/#work" on the home page),
  // data-nav-match is "/" — these won't be marked as the current section
  // unless the user is on the home page, which is the desired behaviour.
  const markActiveNav = () => {
    const path = window.location.pathname.replace(/\/index\.html$/, '/');
    const links = document.querySelectorAll('.nav-links a[data-nav-match]');
    links.forEach((link) => {
      const match = link.getAttribute('data-nav-match');
      const anchor = link.getAttribute('data-nav-anchor');

      // Plain page link: pathname must match exactly.
      if (!anchor && match === path) {
        link.setAttribute('aria-current', 'page');
        return;
      }

      // Anchor link on a specific page: only mark when on that page AND
      // the URL hash matches this anchor.
      if (anchor && match === path && window.location.hash === '#' + anchor) {
        link.setAttribute('aria-current', 'page');
        return;
      }

      link.removeAttribute('aria-current');
    });
  };

  document.addEventListener('DOMContentLoaded', markActiveNav);
  window.addEventListener('hashchange', markActiveNav);

  // --- Writing index: search + category chip filter ------------------------
  // Active filter model: one chip at a time (single-active). The "All" chip
  // resets the category filter. Text search and chip filter are AND-combined.
  const filterRow = document.querySelector('[data-filter-row]');
  if (filterRow) {
    const input = filterRow.querySelector('[data-filter-input]');
    const chips = filterRow.querySelectorAll('.category-chip');
    const rows = document.querySelectorAll('.post-row');
    const yearGroups = document.querySelectorAll('[data-year-group]');
    const noResults = document.querySelector('[data-no-results]');

    let activeChip = 'all';
    let activeQuery = '';

    const applyFilter = () => {
      const q = activeQuery.trim().toLowerCase();
      let visibleCount = 0;

      rows.forEach((row) => {
        const cat = row.getAttribute('data-category') || '';
        const title = row.getAttribute('data-title') || '';
        const matchCat = activeChip === 'all' || cat === activeChip;
        const matchQuery = q === '' || title.indexOf(q) !== -1;
        const visible = matchCat && matchQuery;
        if (visible) {
          row.removeAttribute('hidden');
          visibleCount += 1;
        } else {
          row.setAttribute('hidden', '');
        }
      });

      // Hide year groups whose visible rows count is 0.
      yearGroups.forEach((group) => {
        const visibleInGroup = group.querySelectorAll('.post-row:not([hidden])').length;
        if (visibleInGroup === 0) {
          group.setAttribute('hidden', '');
        } else {
          group.removeAttribute('hidden');
        }
      });

      if (noResults) {
        if (visibleCount === 0) {
          noResults.removeAttribute('hidden');
        } else {
          noResults.setAttribute('hidden', '');
        }
      }
    };

    if (input) {
      input.addEventListener('input', (e) => {
        activeQuery = e.target.value || '';
        applyFilter();
      });
    }

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const next = chip.getAttribute('data-filter') || 'all';
        if (next === activeChip) return; // no-op if same chip clicked
        chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
        chip.setAttribute('aria-pressed', 'true');
        activeChip = next;
        applyFilter();
      });
    });
  }

  // --- Copy-code buttons on .post-prose code blocks ------------------------
  const codeBlocks = document.querySelectorAll('.post-prose pre');
  if (codeBlocks.length) {
    codeBlocks.forEach((pre) => {
      if (pre.querySelector('.copy-btn')) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'Copy code to clipboard');

      let revertTimer = null;

      const flashCopied = () => {
        btn.textContent = 'Copied';
        btn.classList.add('is-copied');
        if (revertTimer) clearTimeout(revertTimer);
        revertTimer = setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('is-copied');
        }, 2000);
      };

      btn.addEventListener('click', async () => {
        const codeEl = pre.querySelector('code') || pre;
        const text = codeEl.textContent || '';
        try {
          await navigator.clipboard.writeText(text);
          flashCopied();
        } catch (_err) {
          // Older browsers: fall back to selection + execCommand.
          try {
            const range = document.createRange();
            range.selectNode(codeEl);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            document.execCommand('copy');
            sel.removeAllRanges();
            flashCopied();
          } catch (_e) {
            btn.textContent = 'Press ⌘C';
            if (revertTimer) clearTimeout(revertTimer);
            revertTimer = setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
          }
        }
      });

      pre.appendChild(btn);
    });
  }
})();
