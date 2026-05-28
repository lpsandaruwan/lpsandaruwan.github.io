# Spec: editorial-redesign

## Goal

Transform the current Jekyll site at `lpsandaruwan.github.io` into the editorial-magazine design prototyped at `../tmp/sitelp` — a warm-paper canvas with terracotta accent, Fraunces + Inter typography, hairline-ruled editorial lists, and a duotone hero portrait — while fixing the inconsistencies in that prototype so the final site reads as a single, cohesive publication. The home page must function as a professional landing page AND the blog gateway; `/writing/` is the full archive of existing posts re-rendered through the new design system.

## User Stories

- **As a hiring manager / prospective client**, I want to land on the home page and within 10 seconds understand who Lahiru is, what he builds, and how to reach him — so I can decide whether to start a conversation.
- **As a visitor following a link to a blog post**, I want the post page to feel like the same site as the home page, with strong typography and readable prose — so I trust the source and want to read more.
- **As the author (Lahiru)**, I want to keep writing posts in Markdown under `_posts/` and have them automatically rendered through the new editorial layouts — so adding content stays low-friction.
- **As a visitor with an old `/posts/<slug>/` URL bookmarked**, I want that URL to still work — so external references don't break.
- **As a visitor on mobile**, I want the editorial layout to hold up at small widths — so the experience is usable on a phone.

## Acceptance Criteria

### Design system (must match `../tmp/sitelp`)
- Palette tokens in `_sass/variables.scss` updated to: canvas `#F6F4EF`, ink `#111111`, muted ink `#5B5B57`, hairline `#E4E0D6`, accent `#C2410C`. Existing cyan/indigo tokens removed.
- Fonts loaded via Google Fonts: Fraunces (display, variable), Inter (400/500/600), JetBrains Mono (400). Preconnect + `font-display: swap`.
- Type scale: hero headline ≥ 64px desktop, post titles 60px, body 18px / 1.7, eyebrow kicker 12px uppercase tracking 0.14em.
- Layout: 12-column grid intent, 1280px max content width, 80px desktop / 24px mobile outer gutter.
- Dividers are hairlines, not card shadows. No glow, gradient, or glassmorphism anywhere.

### Pages (Jekyll layouts + includes)
- **Home (`index.html`, `layout: home`)**: header → hero (duotone portrait + overlapping headline) → Practice (3 columns) → Selected Work (4 placeholder engagements) → Selected Writing (4 most recent posts from `_posts/`, dynamic) → Contact → footer.
- **Writing (`writing.html`, `permalink: /writing/`)**: title + dek + filter row (text search + category chips) + posts grouped by year with huge side year marker, hairline rows.
- **Single post (`_layouts/article.html`)**: eyebrow kicker, headline, dek, mono meta line, prose with dropcap, code blocks with Copy button, "Filed under" footer, prev/next editorial blocks, Disqus comments (shortname `lpsandaruwan`).
- **About (`about.html`, `permalink: /about/`)**: untreated portrait + long bio + Selected Work History + Speaking & Writing.
- **Now (`now.html`, `permalink: /now/`)**: three paragraphs (building / reading / thinking), mono updated-date.
- **404 (`404.html`)**: single Fraunces line + mono link home.

### Hero signature
- Portrait rendered with SVG `<filter>` duotone (darks → ink, lights → accent) — original `profile.jpg` untouched.
- 4% SVG noise grain overlay.
- Headline optically overlaps portrait's right edge by ~40px on desktop.
- Portrait stacks above headline on mobile.

### Functional requirements
- All existing markdown posts under `_posts/` render through the new article layout — none are lost.
- Permalinks migrate from `/posts/:title/` to `/writing/:title/`. The `jekyll-redirect-from` plugin (or equivalent) issues 301 redirects from old URLs.
- Site `feed.xml` (jekyll-feed) and sitemap continue to work.
- Selected Writing on the home page reads from `site.posts | limit: 4` — not hardcoded.
- Writing index search + category chip filter implemented in vanilla JS in `assets/js/main.js`.
- Code blocks get a "Copy" button (vanilla JS, no library) that flips to "Copied" for 2s.
- `prefers-reduced-motion` disables the load-in fade/translate animations.
- WCAG AA contrast verified for all text on canvas.
- Visible focus rings: 2px accent outline, 2px offset.

### Imbalances in the prototype to fix during migration
- The prototype's `post.html` uses Lora + dark theme + theme toggle + TOC sidebar — discard entirely. Single source of truth for posts is `_layouts/article.html` in the new style.
- The prototype's per-post pages under `/writing/<slug>/index.html` are not used by Jekyll — replaced by the article layout rendering from `_posts/`.
- Inline `style="..."` attributes in the prototype's `index.html` are moved into `main.css` classes.
- Mixed nav links (`/posts.html` vs `/writing.html`, "lpsandaruwan.dev" vs "Lahiru Pathirage") consolidated to: site title "Lahiru Pathirage", nav points to `/`, `/writing/`, `/about/`, `/now/`, `#contact`.
- The prototype's `package.json` with React/Vite/Tailwind/Express deps is NOT carried over — the live site stays Jekyll-only.
- Legacy `assets/css/desktop.css`, `assets/js/desktop.js`, `_layouts/desktop.html`, `_layouts/post.html`, and Plasma markup in current `index.html` are deleted as part of this work.

### Performance / SEO
- Per-page `<title>` and meta description.
- Open Graph tags on home and post pages (portrait used as `og:image`).
- Canonical URL on every page.
- RSS link in `<head>`.
- `loading="lazy"` on non-hero images.
- Lighthouse: ≥ 95 Performance, ≥ 95 Accessibility, ≥ 95 Best Practices, ≥ 95 SEO on the home page.

## Constraints

- **Stack**: Jekyll + GitHub Pages. No build step beyond Jekyll's. SCSS via `_sass/`. No JS framework.
- **Hosting**: Continue serving from the `master` branch of `lpsandaruwan/lpsandaruwan.github.io` (GitHub Pages).
- **Existing content**: All current posts in `_posts/` are preserved. None are rewritten as part of this work.
- **URLs**: Old `/posts/:title/` URLs must continue to resolve (301 redirect to `/writing/:title/`).
- **Comments**: Disqus (shortname `lpsandaruwan`) remains the comments provider.
- **Dependencies**: Only Jekyll plugins already permitted by GitHub Pages (`jekyll-feed`, `jekyll-sitemap`, `jekyll-paginate`, `jekyll-redirect-from`).
- **Browser support**: Modern evergreen browsers. No IE.
- **Single palette**: One light theme only. No dark mode toggle in v1.

## Out of Scope

- Dark mode / theme switcher.
- Full-text search across post bodies (the writing index search is title + category only).
- Tag pages or category archive pages (filtering happens client-side on `/writing/`).
- Pagination on `/writing/` (year grouping replaces pagination; all posts on one page).
- A CMS or admin UI for editing posts.
- Newsletter signup, comment migration to a non-Disqus provider, or email capture.
- Real case-study pages behind "Selected Work" links (those remain `#` placeholders in v1).
- A `Now` page auto-update mechanism (manual edits only).
- Replacing the portrait photo.
- Image optimization pipeline (responsive `srcset`, AVIF, etc.) — single JPG is fine for v1.
- Migrating off Jekyll.

## Research Findings

### Internal codebase findings

**Existing posts (14 total under `_posts/`)** — span 2017 to 2025, mixed `.markdown` and `.md` extensions. None have an `author` in frontmatter (relies on `_config.yml` defaults). Few use `categories`. Implication for the new design:
- The "Selected Writing" eyebrow on the home page (which the prototype renders as a category like "Architecture") will need a sensible default — either a `default_category` site variable or fall back to "Notes" when `post.categories` is empty.
- The `/writing/` category-chip filter must derive its chip list dynamically (`site.categories`) rather than hard-coding "architecture / engineering / ai / systems" as the prototype does.

**Plugin gap** — `Gemfile` already declares `jekyll-feed`, `jekyll-sitemap`, `jekyll-paginate`. **`jekyll-redirect-from` is missing** and is required by the spec's permalink redirect criterion. It's on the official GitHub Pages allowlist, so adding it to `Gemfile` and `_config.yml` `plugins:` is safe.

**Existing SCSS to replace** — `_sass/base.scss` has hard-coded cyan/purple radial gradients on `body` plus a CRT-scanline `::before` overlay; both must be removed. `_sass/variables.scss` defines the old cyan/indigo palette and a `font-family-heading` of Inter — both replaced. `_sass/components.scss` (~545 lines) is heavy on gradients, glows, and rounded cards — full rewrite is faster than incremental edits.

**Layouts to delete** — `_layouts/desktop.html`, `_layouts/post.html`, `assets/css/desktop.css`, `assets/js/desktop.js`, and the entire Plasma markup body in `index.html`. None are referenced by the new layout chain. The current `posts.html` (uses `layout: default`) can be renamed/repurposed as `writing.html`.

**Includes** — `_includes/head.html` only loads Inter + JetBrains Mono. Needs Fraunces added with the `opsz,wght@9..144,400` axis range. `_includes/footer.html` uses SVG social icons — new design wants plain text links. `_includes/pagination.html` becomes orphaned (no pagination in spec) — delete.

**Profile photo** — `assets/images/profile.jpg` already exists. Spec uses `/assets/img/portrait.jpg` to mirror the prototype path — decision needed: keep the existing path (`assets/images/profile.jpg`) or move to match the prototype. Recommend keeping the existing path to avoid breaking any backlinks; just update CSS/HTML references.

**Permalinks** — `_config.yml` already sets `permalink: /posts/:title/` and a `collections.posts` block with the same permalink. Change to `permalink: /writing/:title/`. Add `redirect_from:` frontmatter (or a global default in `_config.yml`) generating each post's `/posts/<title>/` as a redirect source.

### Web research summary

1. **`jekyll-redirect-from` on GitHub Pages.** Confirmed still supported as of 2026 — listed in the GitHub Pages dependency versions and in the actively maintained `jekyll/jekyll-redirect-from` repo. It works by emitting an HTML file at each old URL containing a `<meta http-equiv="refresh">` tag plus a canonical link to the new URL. That's an HTML-level redirect (not a true 301 from the server), but it is the standard, GitHub-Pages-compatible approach. SEO impact is acceptable because the page also contains a `<link rel="canonical">` to the target.

2. **Fraunces opsz axis.** Fraunces is a variable serif with an `opsz` (optical size) axis spanning 9 → 144. Best practice from the Google Fonts knowledge base: at small sizes (≤18px) the typeface's display "wonk" is automatically disabled — so using a single Fraunces import with the full opsz range is safe across hero and body usages. Use `font-optical-sizing: auto` to let the browser pick automatically; override with `font-variation-settings: 'opsz' 144` only where you want maximally display-y characters (hero). Avoid forcing large opsz on small text.

3. **SVG duotone via `feColorMatrix` + `feComponentTransfer`.** The prototype's approach is the standard, well-supported technique: convert to luminance with `feColorMatrix`, then remap dark/light points via `feComponentTransfer` tables. Works in all evergreen browsers; degrades gracefully (filter is ignored, image renders as the original) when SVG filters are unavailable. No `prefers-reduced-motion` interaction is required because a static filter is not motion. Add `font-display: swap` and `loading="lazy"` only on non-hero images to keep LCP fast.

### Infrastructure recommendation

**None.** Static site, GitHub Pages, no backend. The single non-trivial runtime is the client-side search + category filter on `/writing/`, which is implemented in vanilla JS over data already present in the rendered HTML — no API, no index file required for the post count we have (14, well under 1000 where client-side breakdown starts to matter).

### Suggested spec improvements

1. **Category fallback.** Most existing posts have no `categories` frontmatter. Add an acceptance criterion: when `post.categories` is empty, show the kicker text "Notes" (or similar) instead of leaving it blank. Decide and record the fallback word.
2. **Portrait path.** Decide: keep `assets/images/profile.jpg` (current) or rename to `assets/img/portrait.jpg` (prototype). Recommend keeping current path and updating prototype references.
3. **Fraunces import string.** Specify the exact Google Fonts URL the spec wants: `https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap` (variable opsz + a few weights of Fraunces; Inter at 400/500/600; mono at 400). The prototype only requests Fraunces 400 which makes bolder display headlines impossible.
4. **Redirect mechanics.** Note in constraints that GitHub-Pages-style redirects are meta-refresh + canonical link, not true HTTP 301s. Acceptable for personal site; flag for SEO awareness.
5. **Selected Work confidentiality.** All four "Selected Work" entries are marked "Confidential" in the prototype. Decide whether v1 ships with named clients or stays confidential. Either way, the section should be present so the home page isn't thin.
6. **Favicon / OG image.** Add a one-line acceptance criterion: ship a favicon (32×32 + apple-touch-icon) and an `og:image` (1200×630). Without either, link previews look unprofessional.
7. **Filter chip semantics.** The `/writing/` filter row in the prototype hard-codes four chips. Acceptance criterion should state: chips are derived from the union of all `post.categories` values present in `_posts/`. Otherwise editing posts requires editing the filter row.
8. **Code-block syntax highlighting.** Spec doesn't mention how code gets highlighted. Jekyll's `rouge` is already set in `_config.yml`. Either add a rouge theme stylesheet (e.g. `base16.light` to match the canvas) or commit to unhighlighted mono. Either way, decide in the spec.
9. **Mobile portrait sizing.** Acceptance criteria specify ~520px desktop and "stacks above headline on mobile" — concrete number for mobile would help (e.g. 280px max, centered, with 24px caption beneath).

### Reference material

- `jekyll-redirect-from` — [jekyll/jekyll-redirect-from](https://github.com/jekyll/jekyll-redirect-from)
- GitHub Pages plugin allowlist — [About GitHub Pages and Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll)
- Fraunces opsz axis — [Google Fonts Knowledge: optical_size_axis](https://fonts.google.com/knowledge/glossary/optical_size_axis)
- SVG duotone technique — [CSS-Tricks: Using SVG to Create a Duotone Effect on Images](https://css-tricks.com/using-svg-to-create-a-duotone-image-effect/), [Codrops: Duotone with feComponentTransfer](https://tympanus.net/codrops/2019/02/05/svg-filter-effects-duotone-images-with-fecomponenttransfer/)
- prefers-reduced-motion patterns — [CSS-Tricks: prefers-reduced-motion](https://css-tricks.com/almanac/rules/m/media/prefers-reduced-motion/)
