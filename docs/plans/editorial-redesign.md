# Plan: editorial-redesign

Implementation plan for transforming `lpsandaruwan.github.io` into the editorial design at `../tmp/sitelp`, while keeping Jekyll, all existing posts, and Disqus comments.

Spec: [docs/specs/editorial-redesign.md](../specs/editorial-redesign.md)

## Open decisions resolved before starting

These were flagged in the research findings. Pick them now so phases don't stall:

| Decision | Resolution |
|---|---|
| Portrait file path | Keep `assets/images/profile.jpg`. Update prototype's `/assets/img/portrait.jpg` references when porting. |
| Category fallback word for posts with no `categories` frontmatter | **"Notes"** |
| Fraunces import string | `Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600` + Inter 400/500/600 + JetBrains Mono 400 |
| Selected Work entries on home | Stay marked **"Confidential"** for v1 — current employer constraint. |
| Code highlighting | Use **Rouge** (already set in `_config.yml`) with a custom hairline-light theme stylesheet that matches the editorial palette. |
| Site title used in `<title>` | `Lahiru Pathirage` (replace existing "Lahiru's dev journal") |
| Old-URL redirects | meta-refresh via `jekyll-redirect-from` with `redirect_from: /posts/:title/` defaulted in `_config.yml` |

## Phases

Each phase ends with a `bundle exec jekyll build` run and a manual visual check. Commit at the end of each phase so any phase can be reverted independently.

---

### Phase 0 — Foundation & cleanup ✅

**Status**: completed 2026-05-28. Gemfile + _config.yml updated, 14 posts gained `redirect_from` frontmatter (config-default approach abandoned because `jekyll-redirect-from` does not substitute `:title` in defaults), legacy Plasma assets quarantined to `/tmp/legacy-deleted/`, `index.html` gutted to a placeholder, build clean, all 14 old `/posts/<slug>/` URLs emit canonical-tagged meta-refresh redirects to `/writing/<slug>/`.

**Goal**: prepare the repo so subsequent phases can build cleanly. No visual changes yet.

**Modify**
- `Gemfile` — add `gem "jekyll-redirect-from", "~> 0.16"` inside the `jekyll_plugins` group.
- `_config.yml`
  - Change `title` to `"Lahiru Pathirage"`.
  - Add `jekyll-redirect-from` to `plugins:`.
  - Change `permalink: /posts/:title/` to `permalink: /writing/:title/`.
  - Add to `defaults` for posts: `redirect_from: ["/posts/:title/"]` so every post auto-emits its old URL.
  - Update `defaults.layout` from `"article"` to `"article"` (no change — already correct).
- `index.html` — **back up first to `/tmp/index.legacy.html`** (Plasma markup may have references we want to scavenge), then strip its body to a single `{% include hero placeholder %}` until Phase 3 fills it in. This phase: just `<p>Home — under reconstruction.</p>` placeholder so the site keeps building.

**Delete (move to `/tmp/legacy-deleted/` first as a safety net)**
- `_layouts/desktop.html`
- `_layouts/post.html`
- `assets/css/desktop.css`
- `assets/js/desktop.js`
- `_includes/pagination.html`

**Decisions made in this phase**
- `redirect_from` is applied site-wide via `_config.yml` defaults rather than per-post frontmatter — keeps the 14 existing posts untouched.

**Verify**
- `bundle install` succeeds, `Gemfile.lock` updates.
- `bundle exec jekyll build` runs with no errors.
- Visit `/posts/kalagola/` (or any old URL) in `_site/` — should produce a meta-refresh HTML pointing at `/writing/kalagola/`.
- `_site/writing/kalagola/index.html` exists.
- Home page (`_site/index.html`) renders the placeholder, no Plasma markup leaks through.

**Estimated diff size**: small — ~3 file edits + 5 deletions.

---

### Phase 1 — Design tokens + global base ✅

**Status**: completed 2026-05-28. variables.scss + base.scss rewritten, layout.scss & components.scss stubbed (Phase 2/3 fill them), head.html refreshed with Fraunces import + OG/Twitter/canonical tags. Compiled CSS shrunk from ~16KB legacy to 2.1KB. No cyan, no scanline, no gradients survive.

**Goal**: every page picks up the new palette and typography. Layouts will look broken (no editorial structure yet) but the colours and fonts are right.

**Modify**
- `_sass/variables.scss` — rewrite. Replace cyan/indigo with editorial tokens:
  - `$canvas: #F6F4EF;`
  - `$ink: #111111;`
  - `$ink-muted: #5B5B57;`
  - `$hairline: #E4E0D6;`
  - `$accent: #C2410C;`
  - `$font-display: 'Fraunces', Georgia, serif;`
  - `$font-sans: 'Inter', system-ui, -apple-system, sans-serif;`
  - `$font-mono: 'JetBrains Mono', ui-monospace, monospace;`
  - Keep spacing scale as is; add `$container-max: 1280px;` and `$gutter: clamp(24px, 6vw, 80px);`.
- `_sass/base.scss` — rewrite. Remove body radial gradients, remove the CRT-scanline `::before`. Add:
  - `html { scroll-behavior: smooth; }`
  - `body { background: $canvas; color: $ink; font-family: $font-sans; font-size: 18px; line-height: 1.7; font-optical-sizing: auto; }`
  - `h1..h6 { font-family: $font-display; color: $ink; letter-spacing: -0.02em; line-height: 1.05; font-weight: 400; }`
  - `a { color: inherit; text-decoration: none; }` (link underlines applied per-context)
  - `code { font-family: $font-mono; }`
  - `*:focus-visible { outline: 2px solid $accent; outline-offset: 2px; }`
  - `@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`
- `_includes/head.html` — update Google Fonts link to the new import string from the decisions table. Add favicon + apple-touch-icon + theme-color + canonical + Open Graph tags (title, description, image=`/assets/images/profile.jpg`, type=`website`).

**Verify**
- Build clean.
- Home placeholder page now shows on a warm `#F6F4EF` canvas with Inter body and no scanlines.
- Any existing post rendered through `_layouts/article.html` shows Fraunces headings, Inter body, no cyan.
- DevTools network tab shows Fraunces font loading.
- Lighthouse Accessibility ≥ 90 (heading contrast verified).

**Estimated diff size**: medium — 3 files, ~150 lines.

---

### Phase 2 — Header + Footer (site chrome) ✅

**Status**: completed 2026-05-28. Editorial sticky header with name + 4 nav items, 3-column footer with text-only social links, scroll listener toggles hairline border, `aria-current="page"` set on the active nav link by pathname match. Article layout still uses pre-redesign class names (Phase 5 rewrites it); site chrome renders correctly above and below it.

**Goal**: every page shows the editorial header (sticky, hairline-on-scroll) and the three-column footer.

**Modify**
- `_includes/header.html` — replace SVG/social/title with:
  - Slim sticky bar.
  - Left: text "Lahiru Pathirage" in 14px small-caps (linked to `/`).
  - Right: text nav links Work · Writing · About · Contact.
  - Hairline border-bottom toggles on via a `.scrolled` class added by `assets/js/main.js`.
- `_includes/footer.html` — replace with 3-column layout:
  - Col 1: name kicker + one-line bio recap.
  - Col 2: GitHub / LinkedIn / RSS as plain text links.
  - Col 3 (right-aligned): "Set in Fraunces & Inter. Built in a terminal." + `© {{ year }} Lahiru Pathirage`.
- `_sass/layout.scss` — rewrite. Add:
  - `.container { max-width: $container-max; margin: 0 auto; padding-inline: $gutter; }`
  - `.site-header { position: sticky; top: 0; z-index: 50; padding-block: 20px; background: $canvas; transition: border-color 200ms; border-bottom: 1px solid transparent; }`
  - `.site-header.scrolled { border-bottom-color: $hairline; }`
  - `.nav-layout { display: flex; justify-content: space-between; align-items: baseline; gap: 24px; }`
  - `.nav-name { font: 600 14px/1 $font-sans; letter-spacing: 0.08em; text-transform: uppercase; }`
  - `.nav-links { display: flex; gap: 28px; }`
  - `.nav-links a { font: 500 14px/1 $font-sans; }`
  - `.nav-links a.active, .nav-links a[aria-current="page"] { color: $accent; }`
  - `.site-footer { margin-top: 128px; padding-block: 64px; border-top: 1px solid $hairline; }`
  - `.footer-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; }`
  - `@media (max-width: 720px) { .footer-grid { grid-template-columns: 1fr; } .nav-links { gap: 16px; font-size: 13px; } }`
- `assets/js/main.js` — create new file. Phase 2 contents:
  - `IntersectionObserver`-based or scroll-listener-based `.scrolled` toggle on `.site-header`.
  - Set `aria-current="page"` on the matching nav link based on `location.pathname`.

**Decisions made in this phase**
- The current/active nav link gets the accent colour via `aria-current`, not a hardcoded `class="active"` per page — keeps templates simpler.

**Verify**
- Every page now has identical header + footer.
- Scroll any page: header gains hairline after ~10px scroll.
- Nav link matching the current page shows in accent.
- Mobile (≤720px): nav links tighten, footer stacks to one column.

**Estimated diff size**: medium — 4 files, ~200 lines.

---

### Phase 3 — Home page (the centrepiece) ✅

**Status**: completed 2026-05-28. Home page rendered with all five sections: hero (duotone portrait + -40px overlapping headline + Now pill + view links), Practice (3 hairline-topped columns), Selected Work (4 placeholder engagements), Selected Writing (4 latest posts dynamically from `_posts/`, with "Posts" category label correctly skipped in favour of meaningful kickers — REST, LINUX, AUDIO, SERVERLESS), Contact. Compiled CSS 12.4KB. Mobile breakpoint at 960px removes hero overlap; 720px collapses Practice to one column and editorial rows to vertical stacks.

**Goal**: the home page matches the prototype's hero + Practice + Selected Work + Selected Writing + Contact layout, with the duotone portrait and overlapping headline as the signature move.

**Modify**
- `_layouts/home.html` — full rewrite per spec. All sections.
- `index.html` — set `layout: home` (it already is), strip leftover content to a single frontmatter block. All actual content moves to the layout so a future redesign doesn't have to touch the index.
- `_sass/components.scss` — full rewrite (~500-line file → ~600 lines of new editorial components):
  - `.hero-grid` — CSS grid with `grid-template-columns: 5fr 7fr;` and a `gap: 0`. The right column has `margin-left: -40px;` and `z-index: 2;` to create the overlap on desktop.
  - `.duotone-wrapper` — `position: relative;` with the `.noise-overlay` as an absolutely-positioned `::after` filled with the SVG noise data URL at 4% opacity.
  - `.duotone-img` — applies `filter: url(#duotone);`.
  - SVG `<filter id="duotone">` lives inline at the top of the layout (see prototype's matrix values).
  - `.hero-headline` — Fraunces `clamp(48px, 6vw, 96px)` / line-height 1.05 / tracking -0.02em.
  - `.hero-caption`, `.kicker`, `.font-mono`, `.text-muted` — utility classes for caption / eyebrow / muted text.
  - `.now-pill` — inline-flex with `.now-dot` (`border-radius: 50%; width: 8px; height: 8px; background: $accent;` with a 1.6s gentle opacity pulse that respects reduced-motion).
  - `.practice-grid` — `grid-template-columns: repeat(3, 1fr); gap: 64px;` with hairline `border-top` on each `.practice-col`.
  - `.editorial-list` — `<ul>` reset; each `.editorial-item` is a 3-col grid (`1fr 6fr 2fr`) with hairline `border-bottom: 1px solid $hairline;` and `padding-block: 32px;`. Hover on items containing an `a.editorial-item-title` → title translates `-2px`, accent underline draws in via a pseudo-element animating `transform: scaleX(0)→1` from left.
  - `.contact-headline`, `.contact-email`, `.social-links` — Contact section styles.
  - Mobile (≤720px): hero stacks (portrait first at max 280px wide centred; headline becomes `clamp(36px, 8vw, 56px)` and overlap removed); `.practice-grid` collapses to one column; `.editorial-item` grid collapses to a single column with row-level rhythm.
- `_includes/post-card.html` — keep file but rewrite contents to the editorial row format (kicker · title · dek · mono date+read-time). This is the include used by both home's "Selected Writing" and `/writing/`.
- `_includes/selected-writing.html` — new include. Renders `site.posts | slice: 0, 4` through `post-card.html`. Determines kicker: `{% if post.categories.size > 0 %}{{ post.categories | first | upcase }}{% else %}NOTES{% endif %}`.

**Reading-time helper** — add a tiny Liquid include `_includes/reading-time.html`:
```liquid
{%- assign words = include.post.content | number_of_words -%}
{%- assign mins = words | divided_by: 200 | at_least: 1 -%}
{{ mins }} min read
```

**Decisions made in this phase**
- Duotone is applied via inline `<svg><filter></svg>` at the top of `_layouts/home.html` and referenced via `filter: url(#duotone)` in CSS. Keeps original `profile.jpg` untouched.
- Hero overlap (-40px) is desktop-only. Mobile resets to natural flow.
- Selected Writing is dynamic from `site.posts`; first category from each post is the kicker, "NOTES" fallback.

**Verify**
- `_site/index.html` matches the prototype's home page visually (within a few pixels).
- Inspect: the duotone-treated portrait actually renders in two tones; original file unchanged.
- Inspect: headline visibly overlaps the portrait by ~40px on desktop ≥1024px; stacks cleanly on mobile.
- Selected Writing shows the four most recent posts from `_posts/` with date and a category kicker (or "NOTES").
- Tab through the page; every link has a visible focus ring.
- `prefers-reduced-motion: reduce` (Chrome devtools rendering tab) — Now-dot pulse stops, hover underlines snap rather than draw.

**Estimated diff size**: large — 5 files, ~800 lines.

---

### Phase 4 — Writing index ✅

**Status**: completed 2026-05-28. `/writing/` lists all 14 posts across 7 year-groups (2017-2025) with sticky year markers in hairline grey, search + 8 chips (All, Audio, DevOps, Linux, Other, Projects, REST, Serverless) generated dynamically from kicker categories, single-active chip model with combined text+category filtering, empty-state pill. posts.html moved to quarantine. Discovered + fixed an unrelated bug: log-tracker.markdown had `layout: post` which the bundled Minima theme was silently serving — removed the override so it uses our editorial article layout like the other 13 posts.

**Goal**: `/writing/` shows every post grouped by year with the sticky giant year marker, search input, and dynamic category chips.

**Modify**
- Rename `posts.html` → `writing.html` (set `permalink: /writing/`). Set `layout: default`.
- Inside `writing.html`:
  - Header: title "Writing" + dek.
  - Filter row: text input + chip buttons. Chips rendered from `{% assign all_cats = site.categories | sort %}{% for cat in all_cats %}<button class="category-chip" data-filter="{{ cat[0] | downcase }}">{{ cat[0] }}</button>{% endfor %}` plus a hardcoded "All" chip and an "Uncategorised → Notes" chip if `site.posts | where_exp: 'p', 'p.categories.size == 0' | size > 0`.
  - Iterate `site.posts | group_by_exp: 'p', 'p.date | date: "%Y"'` to render `.year-group` blocks with `.year-marker` (sticky position).
- `_sass/components.scss` — append:
  - `.year-group { display: grid; grid-template-columns: 1fr 9fr; gap: 32px; padding-block: 64px; border-top: 1px solid $hairline; }`
  - `.year-marker { font: 400 clamp(72px, 10vw, 120px)/1 $font-display; color: $hairline; position: sticky; top: 96px; }`
  - `.post-row { display: grid; grid-template-columns: 90px 1fr 100px; gap: 24px; align-items: baseline; padding-block: 20px; border-bottom: 1px solid $hairline; }`
  - `.filter-row { display: flex; flex-wrap: wrap; gap: 12px; padding-block: 32px; border-block: 1px solid $hairline; margin-block: 48px; }`
  - `.filter-input { flex: 1 1 240px; background: transparent; border: 1px solid $hairline; padding: 10px 14px; font: 500 14px $font-sans; color: $ink; }`
  - `.category-chip { background: transparent; border: 1px solid $hairline; padding: 8px 14px; font: 600 12px/1 $font-sans; text-transform: uppercase; letter-spacing: 0.14em; cursor: pointer; }`
  - `.category-chip.active, .category-chip[aria-pressed="true"] { border-color: $accent; color: $accent; }`
  - Mobile: `.year-group { grid-template-columns: 1fr; }`; year marker becomes non-sticky and inline; `.post-row` collapses to title-then-meta rows.
- `assets/js/main.js` — append:
  - Filter logic: text input filters `.post-row` by title contains (case-insensitive); chips filter by `data-category` attribute on each row; both filters combine.
  - Each `.post-row` gets `data-category="{{ post.categories | first | downcase | default: 'notes' }}"`.
  - Empty-state: when no rows match, show a `.no-results` block ("Nothing matches that yet.").

**Decisions made in this phase**
- Year markers stick to `top: 96px` (sits below the sticky header).
- "Notes" appears as a category chip only when ≥ 1 post has empty categories.

**Verify**
- `/writing/` lists all 14 posts grouped by year (2017, 2018, 2020, 2022, 2023, 2024, 2025).
- Scrolling, the visible year marker stays pinned until the next year's group overtakes it.
- Searching "github" filters to GitHub-related posts only.
- Clicking a category chip filters; multiple chips active means union (or just single-chip-active model — pick single, simpler).
- Mobile layout: year inline, rows stack readably.
- Old URL `/posts/kalagola/` redirects to `/writing/kalagola/`.

**Estimated diff size**: medium — 3 files, ~250 lines.

---

### Phase 5 — Single post layout (article) ✅

**Status**: completed 2026-05-28. All 14 existing posts render through the editorial article layout with the correct eyebrow kicker (Linux, Audio, Projects, DevOps, REST, Other, Serverless), dropcap on first paragraph, Fraunces headline + dek, mono meta line, accent-underlined inline links, italic blockquote with terracotta left rule, Rouge syntax highlighting in the editorial palette, Filed Under footer (skipping "Posts" label), editorial prev/next blocks, and Disqus comments. Copy buttons inject via JS on every `<pre>` (lots of them on archlinux-2024-guide which has 73 code blocks).

**Goal**: every existing post renders through the new editorial article layout with dropcap, code blocks with Copy buttons, Disqus, and editorial prev/next.

**Modify**
- `_layouts/article.html` — full rewrite per spec:
  - Eyebrow (first category or "NOTES").
  - `<h1 class="post-headline">` (Fraunces 60px desktop).
  - Optional `<p class="post-dek">` from `page.dek` frontmatter (no-op if missing).
  - Meta line in mono: date · author · `{% include reading-time.html post=page %}`.
  - `<article class="post-prose">{{ content }}</article>`.
  - "Filed under" footer with category links.
  - Prev/next editorial blocks (Fraunces 28px) — already wired by Jekyll page.previous / page.next.
  - Disqus block (unchanged from current `_layouts/post.html`'s Disqus snippet — keep the shortname config).
- `_sass/components.scss` — append:
  - `.post-prose { max-width: 680px; margin-inline: auto; font-size: 18px; line-height: 1.75; }`
  - `.post-prose p:first-of-type::first-letter { font-family: $font-display; font-size: 4.2em; line-height: 0.85; float: left; margin-right: 12px; margin-top: 6px; color: $accent; }`
  - `.post-prose h2 { font-size: 32px; margin-block: 56px 16px; }`
  - `.post-prose h3 { font-size: 24px; margin-block: 40px 12px; }`
  - `.post-prose blockquote { font-family: $font-display; font-style: italic; font-size: 28px; line-height: 1.4; padding-left: 24px; border-left: 1px solid $accent; margin-block: 40px; max-width: 600px; }`
  - `.post-prose pre { background: #EFECE3; border: 1px solid $hairline; padding: 20px; overflow-x: auto; position: relative; border-radius: 4px; font-size: 14px; line-height: 1.6; }`
  - `.post-prose code { font-family: $font-mono; font-size: 0.92em; }`
  - `.post-prose :not(pre) > code { background: #EFECE3; padding: 2px 6px; border-radius: 2px; }`
  - `.copy-btn { position: absolute; top: 10px; right: 10px; background: $canvas; border: 1px solid $hairline; font: 600 11px/1 $font-mono; text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 10px; cursor: pointer; }`
  - `.post-prose a { background-image: linear-gradient($accent, $accent); background-position: 0 100%; background-repeat: no-repeat; background-size: 100% 1px; }`
  - `.post-navigation { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding-block: 64px; border-top: 1px solid $hairline; margin-top: 96px; }`
  - `.nav-block { display: block; padding: 24px 0; }`
  - `.nav-block .nav-label { font: 600 12px/1 $font-sans; letter-spacing: 0.14em; text-transform: uppercase; color: $ink-muted; }`
  - `.nav-block .nav-title { display: block; margin-top: 8px; font-family: $font-display; font-size: 28px; line-height: 1.1; }`
- `assets/css/syntax.scss` — new file. Light Rouge theme matching editorial palette:
  - Background `#EFECE3`, foreground `$ink`, comments `$ink-muted` italic, keywords `$accent`, strings desaturated brown `#6B4226`, numbers ink.
  - Import from `assets/main.scss`.
- `assets/js/main.js` — append:
  - `Copy` button injection: on `DOMContentLoaded`, find every `.post-prose pre`, append a `<button class="copy-btn">Copy</button>`. On click, write `pre.innerText` to clipboard, flip label to `Copied` for 2s.

**Decisions made in this phase**
- Dropcap applies to every post via `::first-letter` on `p:first-of-type` — no special markup required. If a post starts with an image or list, the dropcap rule silently does nothing.
- Disqus styling stays default (the embed is an iframe; we don't control its internals). Just sits in `.post-comments` with a hairline divider above.

**Verify**
- Open `/writing/kalagola/`, `/writing/jvm-cpu-usage/`, `/writing/saga-gcp-choreography/` — each renders correctly.
- Code blocks show the Rouge light theme, not the default. Copy button works (paste into a notes app to confirm).
- Pull quotes (any post with `>` blockquote) render in Fraunces italic with accent rule.
- Prev/next blocks at the bottom navigate correctly.
- Disqus thread loads (network panel shows `embed.js`).
- `/writing/ive-noticed-ai-tools-generate-terrible-rest-apis/` — long title doesn't overflow.

**Estimated diff size**: large — 4 files, ~400 lines.

---

### Phase 6 — About + Now + 404 ✅

**Status**: completed 2026-05-28. `/about/`, `/now/`, `/404.html` all emit and inherit site chrome. About uses untreated 320px portrait (zero duotone filter references on the page), three-paragraph bio, Selected Work History via `.editorial-list`, Speaking & Writing placeholder, prominent email CTA. Now follows nownownow.com convention with mono "Updated: May 28, 2026", three paragraphs (building/reading/thinking), footer link to nownownow.com. 404 is a single italic Fraunces line "This page is somewhere in the void." with two mono links home/writing. Compiled CSS at 28.6KB.

**Goal**: secondary pages exist and match the design system.

**Create**
- `about.html` — frontmatter `permalink: /about/`, `layout: default`. Body:
  - Untreated portrait at 320px max-width.
  - Long bio (three paragraphs).
  - "Selected Work History" section reusing `.editorial-list` markup.
  - "Speaking & Writing" placeholder list.
- `now.html` — frontmatter `permalink: /now/`, `layout: default`. Body:
  - Mono "Updated: 2026-05-28" at top.
  - Three short paragraphs (building / reading / thinking).
  - Link to nownownow.com explaining the convention.
- `404.html` — frontmatter `permalink: /404.html`, `layout: default`. Body:
  - Single Fraunces line "This page is somewhere in the void."
  - Small mono link "Return to writing →".

**Verify**
- `/about/`, `/now/`, `/404.html` all build and render with header + footer.
- Manually navigate to a nonexistent URL on the live site → GitHub Pages serves `404.html`.

**Estimated diff size**: small — 3 new files, ~150 lines.

---

### Phase 7 — Redirects, assets, legacy cleanup, CLAUDE.md ✅

**Status**: completed 2026-05-28. Editorial SVG favicon shipped (terracotta rounded square + canvas "L"). site.webmanifest fixed (removed bogus `layout: compress`, corrected icon paths, updated theme/background to canvas) — build is now fully clean, zero warnings. head.html now references the SVG favicon and the manifest. CLAUDE.md rewritten to reflect the editorial design system, with both prior iterations (Plasma + cyan dev-blog) marked as removed. Legacy files (desktop/post layouts, desktop CSS/JS, pagination include, old posts.html) were physically removed from the working tree back in Phase 0; git status shows them as `D` ready to commit. paginate config was also already dropped from `_config.yml`.

**Open follow-ups** (documented in CLAUDE.md, deferred): true 1200×630 OG card, 180×180 apple-touch-icon PNG, real case studies behind Selected Work placeholders.

**Goal**: old URLs resolve, link previews look right, dead code is gone, future-Claude understands the new layout.

**Modify / create**
- Verify Phase 0's `redirect_from` defaults in `_config.yml` actually emit redirect files: `_site/posts/<slug>/index.html` for every post. Visit one in a browser — should meta-refresh to `/writing/<slug>/`.
- `assets/img/favicon.svg` (or `.ico`) — create a 32×32 mark. Initials "L P" set in Fraunces 24px on canvas, accent terracotta. Reference from `_includes/head.html`:
  - `<link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">`
  - `<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">` (180×180 PNG of the same mark).
- `assets/img/og-default.png` — 1200×630 PNG. Editorial composition: name in Fraunces, tagline in Inter, on canvas. Used as `og:image` fallback when a post doesn't specify its own.
- `_includes/head.html` — add Open Graph + Twitter Card meta tags using `page.title`, `page.excerpt`, `page.og_image | default: site.og_image`, and per-page `<link rel="canonical">`.
- **Delete for good** (move out of `/tmp/legacy-deleted/` and into `git rm`):
  - `_layouts/desktop.html`
  - `_layouts/post.html`
  - `assets/css/desktop.css`
  - `assets/js/desktop.js`
  - `_includes/pagination.html`
  - Old `posts.html` (replaced by `writing.html`).
- `CLAUDE.md` — replace the design-system section with the editorial palette/type/layout tokens. Mark the prior Inter/cyan/indigo design as "previous iteration — removed".
- `_config.yml` — remove `paginate` and `paginate_path` (no longer used).

**Verify**
- `bundle exec jekyll build` clean, no warnings.
- `_site/posts/kalagola/index.html` exists, contains `<meta http-equiv="refresh" content="0; url=/writing/kalagola/">` and `<link rel="canonical" href="…/writing/kalagola/">`.
- View source on home page: og:image, og:title, og:description, twitter:card present.
- Favicon shows in browser tab.
- Linkedin/Slack link preview tester: paste site URL, verify og:image renders.
- `git status`: deleted files staged.
- `grep -r "desktop.css\|desktop.js\|layout: desktop\|layout: post" .` returns no matches.

**Estimated diff size**: small — 1 file edit + several deletions + 2-3 image assets.

---

### Phase 8 — Accessibility, performance, polish ✅

**Status**: completed 2026-05-28. Skip-to-content link added (visible on Tab, snaps to top-left in accent terracotta, targets `#main`). Touch targets bumped: chips 25→35px, copy buttons 21→29px. Full `@media print` stylesheet shipped (kills chrome, shows URLs after external links, strips duotone filter from the portrait, page-break-inside avoid on critical blocks). Static a11y/contrast/reduced-motion audit complete — all AA contrast targets verified by calculation. Manual browser checklist documented at `docs/plans/editorial-redesign-launch-checklist.md` covering Lighthouse, VoiceOver, mobile 375px, browser matrix, social previews, redirect verification.

**Goal**: hit the spec's targets and catch regressions before shipping.

**Tasks**
- Run Lighthouse on home, `/writing/`, and a single post. Targets: ≥ 95 across Perf / A11y / Best Practices / SEO.
  - If Performance falls short: inspect Fraunces request, consider self-hosting (subset to Latin if needed). Check largest-contentful-paint — likely the portrait.
  - If Accessibility falls short: fix contrast, missing alt text, tab order.
- Verify with VoiceOver (Mac) — home, writing index, single post. Headings make sense, link text isn't "click here".
- WCAG AA contrast check on every text colour against canvas using a contrast tool (`$ink-muted` on `$canvas` should pass for body but might fail for the 12px kicker — verify).
- Keyboard-only walk through every page. No traps, no invisible focus.
- `prefers-reduced-motion` — verify the Now-dot pulse and underline draw animations actually halt.
- Mobile (375px width) — every page usable, no horizontal scroll.
- Print stylesheet (one short `@media print` block): hide nav, footer, social; ink on white; force `.post-prose` to full width.

**Verify**
- Lighthouse scores recorded in PR description.
- Manual VoiceOver pass complete.
- Screenshots of home / writing / single post on desktop 1440, tablet 768, mobile 375 captured.

**Estimated diff size**: small — a few CSS tweaks based on findings.

---

## Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Existing post content contains HTML that conflicts with `.post-prose` styles (table widths, image floats, very long inline code) | Medium | Medium | Phase 5 audit: open each of the 14 posts in the rendered site, visually scan for breaks. Add targeted CSS overrides as needed. Don't rewrite post markdown. |
| `jekyll-redirect-from` meta-refresh is not a true 301; search engines may treat it differently | Low | Low | Acceptable for a personal site. The plugin also emits `<link rel="canonical">` on the redirect page pointing to the new URL, which is the strongest signal Google honours. Document in spec (done). |
| Permalink change breaks links from external sites (other blogs, social posts) | Medium | Medium | Mitigated by redirect plugin. Spot-check by Googling `site:lpsandaruwan.github.io /posts/` and verifying first few results redirect correctly after deploy. |
| Fraunces variable font is large; loads slowly on slow connections | Low | Medium | `font-display: swap` lets Inter render first. Consider subsetting Fraunces to display-only sizes if Lighthouse Perf < 95. |
| SVG duotone filter renders inconsistently across browsers (especially Safari iOS) | Low | Low | Falls back gracefully — image renders unfiltered. Verify on real iOS Safari in Phase 3. |
| Disqus styling clashes with editorial palette | Medium | Low | Disqus iframe inherits its own theme; we only style the wrapper. Acceptable. If too jarring, set Disqus admin colour scheme to "light" via dashboard (out of code). |
| 14 posts with no `categories` produces an empty kicker | High (most posts have no category) | Low | "Notes" fallback (Phase 3 decision) handles this. Verify with `/writing/depli/` or `/writing/savior-ship/` which have no categories. |
| Mobile hero overlap looks wrong on narrow viewports | Medium | Medium | Phase 3 mobile CSS explicitly removes the overlap and stacks. Verify at 375 / 414 / 768 widths. |
| `CLAUDE.md` getting out of date again | Medium | Low | Phase 7 updates it once. Future redesigns should update it as part of the same PR. |
| Local Jekyll build fails because of Ruby version | Medium | Low | Document required Ruby version in README. Use `bundle exec jekyll serve` consistently. If broken, `rbenv install` the version in `.ruby-version`. |

## Checkpoint commits

After each phase, commit with these messages:

- `chore(redesign): foundation cleanup and plugin setup`
- `feat(redesign): editorial design tokens and base styles`
- `feat(redesign): editorial header and footer`
- `feat(redesign): editorial home page with duotone hero`
- `feat(redesign): editorial writing index with year groupings`
- `feat(redesign): editorial article layout for single posts`
- `feat(redesign): about, now, and 404 pages`
- `chore(redesign): old-URL redirects, favicon, OG image, legacy delete`
- `polish(redesign): a11y, perf, and cross-browser fixes`

Push to a `redesign/editorial` branch; open the PR after Phase 4 and let phases 5–8 land on it.

## Estimated effort

- Phase 0: 30 min
- Phase 1: 1.5 h
- Phase 2: 1.5 h
- Phase 3: 4 h (the big one — duotone, overlap, all sections)
- Phase 4: 2 h
- Phase 5: 3 h
- Phase 6: 1 h
- Phase 7: 1.5 h
- Phase 8: 2 h

**Total: ~17 hours of focused work.** A long weekend, or 3-4 evenings.
