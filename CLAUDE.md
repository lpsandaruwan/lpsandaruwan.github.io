# Claude Memory Bank — Lahiru Pathirage

## Project Overview

A Jekyll-based personal site that doubles as a professional landing page and a writing journal. Hosted on GitHub Pages from the `master` branch.

- **URL**: https://lpsandaruwan.github.io
- **Site title**: "Lahiru Pathirage"
- **Author**: Lahiru Sandaruwan Pathirage (`lpsandaruwan`)
- **Location**: Sri Lanka
- **Email**: hello@lpsandaruwan.dev
- **Focus**: AI agents, serverless architecture, distributed systems, Linux, open source

### History (do not repeat)

Two previous design iterations have been **removed**, do not re-introduce:

1. **KDE Plasma desktop simulation** (taskbar, draggable windows, fake file manager). Removed in 2026-05.
2. **Modern dev-blog with cyan/indigo gradient theme** (Inter sans-only, glowy cards, dark canvas). Removed in 2026-05 in favour of the editorial design below.

The active design as of 2026-05-28 is **editorial**: warm-paper canvas, near-black ink, single terracotta accent, Fraunces display + Inter body + JetBrains Mono, hairline rules only (no card shadows). Spec lives at `docs/specs/editorial-redesign.md`. Implementation plan at `docs/plans/editorial-redesign.md`.

## Architecture

### Core stack

- **Jekyll 4.3** static site generator
- **GitHub Pages** for hosting (no CI required)
- **SCSS** under `_sass/`, compiled by `assets/main.scss`
- **Liquid** templates with layouts + includes
- **Rouge** for syntax highlighting (themed at `_sass/syntax.scss` to match the editorial palette)
- **Disqus** for comments (shortname `lpsandaruwan`)
- Plugins: `jekyll-feed`, `jekyll-sitemap`, `jekyll-redirect-from`

### File layout

```
├── _config.yml              # title, plugins, /writing/:title/ permalink, defaults
├── index.html               # frontmatter only; layout: home
├── writing.html             # /writing/ archive — year-grouped + filterable
├── about.html               # /about/ — bio, work history, speaking
├── now.html                 # /now/ — nownownow.com style
├── 404.html                 # /404.html — italic void line + links
├── _layouts/
│   ├── default.html         # head + header + main + footer + script
│   ├── home.html            # editorial home (hero + practice + work + writing + contact)
│   └── article.html         # single post layout with dropcap, Disqus, prev/next
├── _includes/
│   ├── head.html            # meta, OG/Twitter cards, fonts, favicon, RSS
│   ├── header.html          # sticky editorial nav (Work, Writing, About, Contact)
│   ├── footer.html          # 3-col footer (kicker + social + attribution)
│   ├── post-card.html       # one editorial row — used by home + writing
│   ├── selected-writing.html # wraps post-card in a <ul class="editorial-list">
│   └── reading-time.html    # words / 200, min 1
├── _sass/
│   ├── variables.scss       # palette + type + spacing + container tokens
│   ├── base.scss            # reset, body, headings, focus, reduced-motion
│   ├── layout.scss          # container, header, footer
│   ├── components.scss      # hero, practice, editorial-list, post-prose, etc.
│   └── syntax.scss          # Rouge theme on the editorial palette
├── assets/
│   ├── main.scss            # imports all _sass partials
│   ├── js/main.js           # sticky header, active nav, filter, copy buttons
│   └── images/
│       ├── profile.jpg      # used for hero (duotoned via SVG filter) and OG
│       └── favicons/        # favicon.svg, favicon.ico, mstile, site.webmanifest
├── _posts/                  # markdown posts (.md, .markdown)
└── docs/
    ├── specs/editorial-redesign.md
    └── plans/editorial-redesign.md
```

## Design system

### Palette (one set, no dark mode)

| Token | Value | Use |
|---|---|---|
| `$canvas`    | `#F6F4EF` | page background |
| `$ink`       | `#111111` | primary text, headings |
| `$ink-muted` | `#5B5B57` | secondary text, meta |
| `$hairline`  | `#E4E0D6` | rules, borders, year markers |
| `$accent`    | `#C2410C` | links, kickers, focus rings, Now-pill, blockquote rule |

### Typography

- **Display**: `Fraunces` — Google Fonts variable serif with `opsz` axis 9-144, weights 400/500/600. Headlines force `font-variation-settings: 'opsz' 144` for full display "wonk"; body sets `font-optical-sizing: auto`.
- **Body / UI**: `Inter` — 400/500/600.
- **Mono**: `JetBrains Mono` — 400 only. Used for kickers, meta, dates, copy-button labels.

Type tokens in `_sass/variables.scss`:

```scss
$font-display: 'Fraunces', Georgia, 'Times New Roman', serif;
$font-sans:    'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
$font-mono:    'JetBrains Mono', ui-monospace, 'Menlo', 'Consolas', monospace;
```

### Layout

- Container: `max-width: 1280px`, `padding-inline: clamp(24px, 6vw, 80px)`.
- Spacing scale `$space-1` (4px) → `$space-32` (128px), multiplicative.
- All section dividers are 1px `$hairline` rules. No card shadows, no glows, no gradients.

### Signature visual treatments

- **Duotone portrait** on the home hero. Original `profile.jpg` is untouched; `<filter id="duotone">` (defined inline in `_layouts/home.html`) maps luminance to ink + accent at runtime. 6% SVG turbulence grain overlaid via `mix-blend-mode: multiply`.
- **Hero headline overlap**: `.hero-copy { margin-left: -40px; z-index: 2 }` makes the Fraunces headline visually cross over the portrait's right edge. The page's defining moment.
- **Now pill**: small accent dot with a 1.6s opacity pulse (disabled by `prefers-reduced-motion`).
- **Animated underlines**: `linear-gradient($accent, $accent)` as a background-image with `background-size: 0 1px` → `100% 1px` on hover/focus. Used on nav, hero links, editorial titles, post-prose anchors, footer links.
- **Dropcap**: `.post-prose p:first-of-type::first-letter` — Fraunces 4.2em float-left in accent. Silently no-ops if a post opens with anything other than a paragraph.

### Kicker / category convention

Existing posts use `categories: [Posts, <real-topic>, …]` as a label convention where the first entry is always literally `"Posts"`. The kicker logic in `_includes/post-card.html`, `writing.html`, and `_layouts/article.html` walks the array and picks the first entry that is **not** `Posts`/`posts`. Falls back to `NOTES` when the array is empty or contains only "Posts".

The same skip applies to the Filed Under footer on single posts. The writing-index chip set is derived from these resolved kickers via `site.posts | … | uniq | sort`.

## Pages

| Path | Source | Layout | Notes |
|---|---|---|---|
| `/` | `index.html` | `home.html` | Hero · Practice · Selected Work · Selected Writing (dynamic) · Contact |
| `/writing/` | `writing.html` | `default.html` | All 14 posts in 7 year-groups, sticky year markers, text + chip filter |
| `/writing/<slug>/` | `_posts/*.md*` | `article.html` | Eyebrow · Fraunces 60px headline · dropcap body · Filed Under · prev/next · Disqus |
| `/about/` | `about.html` | `default.html` | Untreated 320px portrait, bio, work history, speaking |
| `/now/` | `now.html` | `default.html` | Updated-date + 3 paragraphs in nownownow.com style |
| `/404.html` | `404.html` | `default.html` | Italic void line + return links |
| `/posts/<slug>/` | redirect (from each post's frontmatter `redirect_from`) | — | Meta-refresh + canonical to `/writing/<slug>/` |
| `/feed.xml` | jekyll-feed | — | RSS |
| `/sitemap.xml` | jekyll-sitemap | — | |

## Development

### Local commands

```bash
bundle install                 # first time / when Gemfile changes
bundle exec jekyll serve       # local preview at http://127.0.0.1:4000
bundle exec jekyll build       # output to _site/
```

### Adding a new post

1. Create `_posts/YYYY-MM-DD-slug.md`.
2. Frontmatter:
   ```yaml
   ---
   title: "Post title"
   date: YYYY-MM-DD
   categories: [Posts, <RealTopic>]   # first non-"Posts" entry becomes the kicker
   dek: "Optional subtitle shown beneath the headline."
   ---
   ```
3. Body in Markdown. Code fences get Rouge highlighting + an injected Copy button.

### Conventions

- Editorial style only. No card shadows, no glow, no gradients.
- Animations stay subtle and respect `prefers-reduced-motion`.
- All visual tokens come from `_sass/variables.scss` — never hardcode colours in components.
- Use `_includes/reading-time.html` and the post-card include for any post listing.
- Disqus shortname is `lpsandaruwan`; don't change without updating `_config.yml`.

## Social

- GitHub: `lpsandaruwan`
- LinkedIn: `lpsandaruwan`
- Twitter / X: `lpsandaruwan`
- YouTube: `@lpsandaruwan`
- Facebook: `lpsandaruwan1`

## Open follow-ups

- True 1200×630 OG card (currently falls back to `profile.jpg`).
- Apple touch icon PNG at 180×180 (currently SVG favicon serves most surfaces).
- Real case studies behind the four `#` placeholders in Selected Work.
