# Launch checklist — editorial-redesign

What's been verified statically and what still needs eyes on a real browser. Run these before committing the redesign branch to `master`.

## Verified in code (Phase 8 static pass)

### Semantic landmarks
- `<header class="site-header">` + `<main id="main">` + `<footer class="site-footer">` in every page (default.html).
- Nav has `aria-label="Primary"`; active link gets `aria-current="page"` via JS.
- Skip-to-content link at top of body, visible on keyboard focus, target is `#main`.
- Every home-page section has `aria-labelledby` pointing at its `<h2>`.
- Filter row chips have `role="group"` with `aria-label="Filter by category"`; each chip carries `aria-pressed`.
- Year markers have descriptive `aria-label="Posts from 2025"`.
- Now pill has `role="status"`.
- Disqus container has `aria-label="Comments"`.

### Contrast (sRGB relative luminance check against canvas `#F6F4EF`)
- Ink `#111111` on canvas → ≈ 17.5 : 1. **AAA**.
- Ink-muted `#5B5B57` on canvas → ≈ 5.95 : 1. **AA** for all text (including 11px kickers since AA threshold is 4.5:1 for normal text). Borderline for AAA, acceptable for v1.
- Accent `#C2410C` on canvas → ≈ 4.91 : 1. **AA** for normal text, AAA for large text. Safe for links and 12-14px kickers.
- Hairline `#E4E0D6` on canvas → ≈ 1.13 : 1. Decorative only — used for rules, never for text.

### Reduced motion
- Global `@media (prefers-reduced-motion: reduce)` rule in `_sass/base.scss` clamps all `animation-duration` and `transition-duration` to 0.001ms.
- The Now-pill pulse (`@keyframes now-pulse`) is the only animation — disabled by the rule above.
- Verified: no `scroll-behavior: smooth` will jump on reduced-motion (override included).

### Touch targets
- `.category-chip` height ≈ 35px (bumped from 25px in Phase 8).
- `.copy-btn` height ≈ 29px (bumped from 21px in Phase 8).
- Nav links ~22px tall but live inside a sticky header with 20px vertical padding — effective tap zone is generous.
- Hero `.now-pill`, `.contact-email`, social links all comfortably > 36px.

### Print
- `@media print` stylesheet kills nav, footer, filter row, copy buttons, prev/next, comments.
- Force ink-on-white. Expand all prose containers. Show URLs after external links.
- Strip duotone filter from the portrait so it prints as a normal photo.

### Performance signals
- Compiled `main.css` 28.6KB; `main.js` 6.3KB.
- Fonts loaded with `font-display: swap` and a `preconnect` to `fonts.gstatic.com`.
- All non-hero images use `loading="lazy"` and `decoding="async"`.
- No render-blocking JS — `main.js` is loaded with `defer`.
- Inline SVG `<filter>` for duotone (no extra request).
- Inline SVG noise overlay as data URL (no extra request).

## To verify in the browser (manual)

Run `bundle exec jekyll serve` and walk through each.

### Cross-page

- [ ] Open every page (home, /writing/, /about/, /now/, /404.html, one post). Each renders without console errors.
- [ ] Header gains a hairline border the moment you scroll past ~8px on each page.
- [ ] The active nav link picks up terracotta when you're on `/writing/` or `/about/`.
- [ ] Tab through every page from the top. Focus rings visible everywhere. No keyboard traps.
- [ ] Hit Tab once on a fresh page load → skip-to-content link snaps into the top-left. Press Enter → focus jumps to main content.

### Home

- [ ] Duotone portrait shows in ink + terracotta tones with a faint grain.
- [ ] Headline visually overlaps the portrait's right edge by ~40px on desktop ≥ 1024px.
- [ ] Now-pill dot pulses subtly. Open Chrome DevTools → Rendering tab → "prefers-reduced-motion: reduce" → pulse stops.
- [ ] Selected Writing shows the four most-recent posts. Kickers read REST, LINUX, AUDIO, SERVERLESS.
- [ ] Hover over a Selected Writing title → it lifts 2px and the accent underline draws in.
- [ ] Click "View work" → smooth-scrolls to Selected Work; "Read writing" goes to /writing/.

### Writing index

- [ ] All 14 posts visible across 7 year groups (2017–2025), reverse chronological.
- [ ] Scroll: the giant year marker stays pinned until the next year's group overtakes it.
- [ ] Type "linux" in the search → only the Arch and SB1095 posts remain visible. Year groups without matches collapse.
- [ ] Click a chip like "DevOps" → only those rows remain. Click "All" to reset.
- [ ] Search for "asdfgh" → "Nothing matches that yet." appears.

### Single post

- [ ] Open `/writing/kalagola/`. Dropcap renders in terracotta Fraunces.
- [ ] Open `/writing/saga-gcp-choreography/`. Many code blocks each have a "Copy" button in the top-right that flips to "Copied" for 2 seconds.
- [ ] Open `/writing/archlinux-2024-guide/`. Long post, copy buttons on every block (73 of them).
- [ ] Inline links underline in terracotta on hover.
- [ ] Filed Under footer tags wrap as pills, never include "Posts".
- [ ] Disqus loads at the bottom (network panel shows `embed.js`).

### About / Now / 404

- [ ] `/about/` portrait is untreated — the real photo, no duotone.
- [ ] `/now/` updated date matches today's build time.
- [ ] Hit any nonsense URL like `/not-a-page/` → GitHub Pages serves `404.html` with the void line + return links.

### Old URL redirects

- [ ] Visit `/posts/kalagola/` on the deployed site → redirects to `/writing/kalagola/` (meta-refresh, near-instant).
- [ ] View source on the redirect page → contains `<link rel="canonical" href="…/writing/kalagola/">`.

### Mobile (375px width via DevTools or real phone)

- [ ] Home portrait stacks above headline. Overlap removed. Headline reads cleanly.
- [ ] Hero links stack vertically.
- [ ] Practice section collapses to a single column.
- [ ] Editorial-list rows collapse to single column (kicker → title → meta).
- [ ] Writing index year markers no longer sticky; appear inline above each year's rows.
- [ ] Filter input fills the width; chips wrap onto multiple lines.
- [ ] Post-prose body reads at 17px; dropcap scales to 3.6em.

### Lighthouse

Run on `/`, `/writing/`, and one single post. Targets:

- [ ] Performance ≥ 95
- [ ] Accessibility ≥ 95
- [ ] Best Practices ≥ 95
- [ ] SEO ≥ 95

If Performance dips, the most likely culprit is the Fraunces variable font — consider subsetting to display sizes only or self-hosting.

### Browser matrix

- [ ] Safari 17+ (macOS): duotone filter renders, SVG noise overlay correct, font weights load.
- [ ] Safari iOS (real device): no overflow scroll, sticky header behaves, tap targets reachable.
- [ ] Chrome 120+ / Edge.
- [ ] Firefox 120+: SVG filter on the portrait specifically — Firefox renders `feColorMatrix` slightly differently; spot-check it doesn't look posterised.

### Social previews

- [ ] Paste `https://lpsandaruwan.github.io/` into LinkedIn / Twitter / Slack composer. Card should show:
  - Title: "Lahiru Pathirage"
  - Description: site.description tagline
  - Image: portrait JPG (the duotone is CSS-only; the OG image is the raw photo)
- [ ] Same test for a single post URL.

## Follow-ups (deferred — not blockers for v1)

- True 1200×630 OG card with Fraunces title + canvas background.
- 180×180 PNG apple-touch-icon for iOS bookmark tiles.
- Real case studies behind the four `#` placeholders in Selected Work.
- A `Speaking & writing` list of actual talks/podcasts to replace the placeholder on /about/.
- Image optimization pipeline (responsive `srcset`, AVIF) — single JPG is fine for v1.
