# UX concept (one sentence)

Projects live in a **file drawer** — each project is a folder tab on the drawer; clicking a tab pulls a project card out of the drawer with a TL;DR, media, and actions. Deep dive content loads only when the card is opened.

# What the user sees (visual)

* Drawer view (overview):

  * Horizontal drawer across the page with 3–5 visible folder tabs (stacked staggered).
  * Each tab shows `Project title` + `year` on the spine.
  * Hover shows white-border clickable style (your global cue).
* Project card (on click):

  * Slides out from the drawer and sits above the drawer.
  * Left column: hero image / animated GIF or 3D thumbnail.
  * Right column: TL;DR (1 sentence), 4-line summary (Problem → Approach → Result → Impact), stack badges, quick actions (Open details, Repo, Paper, Download).
  * Below: collapsible Results section (figures, videos, 3D viewer) and a “Read full case” link.
* Deep view (optional full-screen modal or dedicated route):

  * Structured case-study: Abstract, Setup, Methodology, Results (figures + captions + downloadable data), Repro steps, Links (repo, paper).
  * Optional sidebar for timeline / tags / contributors.

# Content model (what belongs to each project)

* id, title, shortSlug
* dates: {start, end}
* summary (1 sentence)
* problem (1–2 lines)
* approach (1–2 lines)
* keyResults (bulleted)
* impact / metrics (numbers when possible)
* media: {hero: url, gallery: [img|gif], video: url|null, model3d: glb|null}
* artifacts: [{type: "paper"|"repo"|"dataset"|"download", url, label}]
* techStack: [OpenFOAM, Python, ParaView, Blender, etc.]
* role, collaborators, location, supervisor (if academic)
* seo: metaDescription, ogImage (auto from hero)
* featured: boolean

# Micro-UX & interaction rules

* Drawer: only render visible tabs + a “load more” button that loads additional tabs on demand.
* Click a tab: slide-out card animation (120–200ms). Keep animation subtle (ease-out).
* Inside card:

  * Images use `object-fit: cover` and a ratio box so layout doesn’t jump.
  * Video shows a poster thumbnail; clicking loads the iframe / player (lazy).
  * 3D model shows a GLTF preview placeholder; clicking mounts the 3D viewer component (dynamic import with `ssr: false`).
* Keyboard navigation:

  * Tab through folder tabs, Enter to open.
  * Left/Right arrow to switch open project.
  * Esc to close card or modal.
* Focus management: when a card opens, focus goes to the card container; when closing, focus returns to the folder tab.

# Performance & lazy-loading (musts)

* Never import heavy libs (three.js, pdf.js, video players) at top-level or during SSR.
* Use dynamic imports with SSR disabled for heavy components:

  * Next.js: `dynamic(() => import('./ModelViewer'), { ssr: false })`
* Media loading order:

  1. Load tiny hero thumbnail (WebP/AVIF) for drawer & card header.
  2. On card open, lazy-load image/gallery lightbox assets (IntersectionObserver or on-demand).
  3. On video click, create iframe / player.
  4. On “Open 3D” click, mount GLTF viewer.
* GLTF rules:

  * Use Draco compression for geometry.
  * Use a single `.glb` per model with baked material where possible.
  * Keep LOD: small preview scene vs full model.
* Limit concurrent heavy mounts: only 1 3D viewer or video active at a time. Unmount previous when opening new.
* Images: provide `srcset`, responsive sizes, and `loading="lazy"`.

# Accessibility & semantics

* Tabs: use `role="tablist"` / `role="tab"` if you want keyboard semantics OR treat them as buttons with proper aria labels.
* All images include alt text; hero images must have `alt`.
* Provide text transcripts or captions for videos.
* Use `aria-expanded` on collapsible sections and `aria-modal` for modals.
* Ensure contrast and 48px minimum tap targets on mobile.

# Data-driven design & content authoring

* Keep projects as JSON objects (CMS or flat files). This makes it easy to render the drawer and deep views.
* Add a preview-only `summary` field for the drawer (short).
* Add `sortOrder` or `featured` flags to control what appears first.

# Component / file breakdown (React/Next friendly)

* `ProjectsDrawer` — container that renders visible `FolderTab`s.
* `FolderTab` — small spine UI (title + year); click opens `ProjectCard`.
* `ProjectCard` — slide-out summary + media preview.
* `ProjectGallery` — lazy-loaded lightbox for images (dynamic import).
* `ModelViewer` — dynamic import of 3D viewer (ssr: false).
* `VideoPlayer` — lazy iframe wrapper that only injects on click.
* `ProjectModal` — full case-study renderer (optional route fallback `/projects/[slug]`).
* `useLazyAsset` hook — prefetch logic and cleanup.
* `analytics` util — fire `project_open`, `asset_play`, `repo_click`.

# SEO + structured data

* For each project detail page (or modal route), emit JSON-LD `Project` / `Article` or `CreativeWork` schema:

  * title, description, author, datePublished, url, image, about.
* Meta tags: title, og:description, og:image (hero), twitter card.
* Provide an index page or sitemap entry per project route for discoverability.

# Analytics & tracking

* Events to log:

  * `project_open` (id, title)
  * `media_play` (type, id)
  * `repo_click` (id)
  * `download_artifact` (id, file)
* Keep tracking minimal and respect privacy (Plausible recommended if you want lightweight analytics).

# Mobile & fallback

* Mobile drawer → vertical stacked list of `FolderTab` cards.
* Tap a tab to expand an accordion (collapsible card) instead of a slide-out.
* If WebGL not available: show static screenshots + link to open the model viewer on desktop.

# Phase plans (build quickly vs full)

* Phase 1 — **MVP (ship fast)** (1–2 days)

  * Static drawer with 6–9 projects.
  * FolderTab + ProjectCard summary.
  * Image thumbnails only (no videos or 3D).
  * “Read more” link goes to `/projects/[slug]` simple markdown page.
  * All images optimized + lazy.
* Phase 2 — **Polish (weeks)**

  * Add dynamic video lazy-loading + lightbox gallery.
  * Add ModelViewer with GLTF + Draco.
  * Add case-study pages with full JSON-LD & SEO.
  * Add filters / tags and search (client-side).

# Micro-interaction specs (copy/paste values)

* Tab hover lift: `transform: translateY(-6px) scale(1.02)`; `transition: 140ms cubic-bezier(.22,.9,.13,1)`
* Card slide-in: translateX/Y 0 → 12px, opacity 0 → 1; duration 160–200ms
* Media fade-in: 120ms ease
* Keep animations under 250ms and accessible (prefers-reduced-motion respect)

# Example project JSON

```json
{
  "id": "pyrolysis-optimization",
  "title": "Optimization of Pyrolysis-Based Plastic Oil Yield",
  "slug": "pyrolysis-optimization",
  "dates": { "start": "2023-07", "end": "2024-01" },
  "summary": "Used experimental design + ML to maximize plastic-pyrolysis oil yield.",
  "problem": "Plastic waste pyrolysis yields variable oil production; optimization needed.",
  "approach": "Combined DOE, reaction kinetics modeling, and ML surrogate models.",
  "keyResults": [
    "Increased oil yield by 18% under lab conditions",
    "Surrogate model reduces run time from 48h to <30min"
  ],
  "techStack": ["Python", "OpenFOAM", "Scikit-Learn", "ParaView"],
  "media": {
    "hero": "/projects/pyrolysis/hero.webp",
    "gallery": ["/projects/pyrolysis/fig1.webp"],
    "video": "/projects/pyrolysis/demo.mp4",
    "model3d": "/projects/pyrolysis/sample.glb"
  },
  "artifacts": [
    { "type": "thesis", "url": "/files/pyro_thesis.pdf", "label": "Thesis (PDF)" },
    { "type": "repo", "url": "https://github.com/your/repo", "label": "Code (GitHub)" }
  ]
}
```

# Example card copy (TL;DR) — ready to paste

**Optimization of Pyrolysis-Based Plastic Oil Yield** — *Jul 2023 – Jan 2024*
Problem → Pyrolysis yields inconsistent oil production.
Approach → Lab DOE + kinetics model + ML surrogate.
Result → +18% oil yield; surrogate reduces simulation time from 48h → 30min.
[Open details] [View repo] [Download thesis]