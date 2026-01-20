# UX & design (what the user sees & feels)

* Overall look: clean, slightly desaturated, utilitarian bookshelf (no wood grain gaudiness) — think lab archive.
* Shelves: horizontal rows stacked vertically — 3–4 books per row by default on desktop; each shelf labeled (e.g., “Aero”, “Thermal”, “Acoustics”).
* Book spines: show `project short title`, `year`, and a small icon/tag (mesh, acoustics, battery, etc.). Spines are slightly staggered so depth reads instantly.
* Hover / focus: spine lifts ~6px + white outline (your site-wide cue). Clickable area includes the spine and a small margin.
* Opening a book: spine gives a small animation (slides up), a project **card** slides forward (overlay) from the shelf — contains the case summary and media. The shelf remains visible dimmed behind.
* Navigation: small arrows at shelf sides to “scroll” more books on that shelf. A top-left crumb shows which shelf you’re viewing.
* Mobile: vertical stacked shelves; tap a spine to expand an accordion-style card full-screen.

---

# Book interior (project card structure)

Left column (visual):

* Hero image or static GIF (keeps layout stable)
* Small “media strip” beneath: images (thumbnails) + a video poster + “3D” badge if model exists

Right column (content):

* Title + dates + tags (CFD, OpenFOAM, Python)
* TL;DR: Problem → Approach → Result (one clear sentence each)
* Metrics / highlights badges (e.g., “+18% yield”, “runtime ↓ 40%”)
* Actions row: [Open full case] [View repo] [Download paper] [Open 3D]
* Expandable sections: Setup, Mesh, Boundary Conditions, Solver settings, Results, Notes & lessons
* Optional sidebar: small timeline or collaborators

UX notes:

* Collapsible sections default collapsed for scannability.
* Videos & 3D viewer are NOT mounted until clicked.
* Close returns focus to spine.

---

# Interaction rules & micro-UX

* White-border rule applies; all interactive elements show the white border on hover/focus.
* Only one book card may be open at once; opening a new one closes the previous (cleanup/unmount).
* Keyboard: Tab to cycle spines/cards; Enter to open; Esc to close; Left/Right to move between books on same shelf.
* Prefers-reduced-motion respected: replace slide animations with quick fades.
* Subtle soundless tactile feedback: micro-lift & shadow change on click.

---

# Content model (JSON example)

```json
{
  "id": "propeller-aeroacoustics-2023",
  "title": "Propeller Aeroacoustics Study",
  "year": 2023,
  "tags": ["OpenFOAM","Aeroacoustics","FVM"],
  "summary": "Investigated tonal and broadband noise of small propellers using hybrid LES-RANS coupling.",
  "metrics": ["SPL reduction: 6 dB (tip)","Model runtime: 36h → 18h (surrogate)"],
  "media": {
    "hero": "/projects/propeller/hero.webp",
    "images": ["/projects/propeller/fig1.webp"],
    "videoPoster": "/projects/propeller/vp.jpg",
    "videoUrl": "https://youtube.com/...",
    "model3d": "/projects/propeller/preview.glb"
  },
  "artifacts": [
    {"type":"paper","label":"Conference Paper (PDF)","url":"/files/prop_paper.pdf"},
    {"type":"repo","label":"Simulation Scripts","url":"https://github.com/..."}
  ],
  "details": {
    "setup": "...",
    "mesh": "...",
    "bc": "...",
    "solver": "...",
    "results": "..."
  }
}
```

---

# Technical architecture & implementation notes

### Component breakdown

* `BookshelfLevel` — container rendering one or multiple shelves (takes `shelfId`).
* `Shelf` — renders visible spines + left/right scroll controls; virtualizes long lists.
* `BookSpine` — small clickable `button`; lightweight renderer.
* `ProjectCard` — overlay panel with summary + actions; lazy-loads heavy assets on demand.
* `Gallery`, `VideoPlayer`, `ModelViewer` — each dynamically imported (`ssr: false`) and only mounted on click.
* `useVirtualList` hook — virtualize many books per shelf.
* `useLazyAsset` hook — prefetch small thumbnail after spine hover for perceived speed.

### Lazy-loading strategy (critical)

* Bookshelf initial render: only lightweight JSON and thumbnails for visible spines.
* On spine hover: optionally prefetch hero image (small) using `IntersectionObserver` / hover prefetch.
* On card open:

  * Load hero full-size image + gallery thumbnails.
  * Defer video iframe until user clicks play.
  * Load 3D viewer only on "Open 3D" click — `dynamic(() => import('./ModelViewer'), { ssr: false })`.
* Unmount heavy components on close; call `dispose()` for three.js resources and revoke object URLs.

### GLTF / ModelViewer specifics

* Export models as `.glb` with Draco compression.
* Baked materials: avoid PBR textures where unnecessary; keep single-color materials or small texture atlases.
* Viewer should support:

  * Basic orbit controls (or disable and use simple rotate UI)
  * Bounding-box fit on load
  * Lightweight post-processing disabled on mobile
* Use `@react-three/fiber` + `drei` optionally, but import them dynamically only inside `ModelViewer`.

### Virtualization & pagination

* If a shelf can have dozens of books, virtualize so DOM contains only visible spines.
* Provide “Load more” or infinite scroll for additional shelves.
* Keep memory low: unmount offscreen books’ thumbnails if not near viewport.

---

# Performance & memory safeguards (practical)

* Never import Three.js, GLTFLoader or heavy libs at top-level.
* Keep thumbnail images small (80–160 KB WebP/AVIF).
* Use CDN/edge to serve media.
* Limit simultaneous heavy assets: allow only one active 3D viewer or video.
* When closing `ProjectCard`, explicitly call three.js `scene.traverse` to `dispose` geometries/materials and `renderer.dispose()` where appropriate.
* Use `prefers-reduced-data`/`Save-Data` to replace autoplay or previews with static posters.

---

# Accessibility & keyboard support

* Spines are buttons with `aria-expanded` for opened state.
* Project card uses `role="dialog"` with `aria-modal="true"` and an accessible title.
* Provide alt text for images and transcripts/captions for videos.
* Ensure color contrast for text on the card and spines.
* Make sure tap targets meet 44×44px minimum on mobile.

---

# Mobile adaptation

* Shelves stack vertically; show 1–2 spines per row depending on width.
* Tapping spine opens a full-screen project card (modal) with vertical scroll for content.
* Replace hover prefetch with quick on-tap thumbnail load.
* Consider hiding the 3D viewer on very low memory devices and show static visuals + link to desktop view.

---

# No-JS / graceful fallback

* Provide a simple `/openfoam` index page which lists projects as semantic `<article>` elements (title, summary, links). This allows crawlers and users without JS to access content.
* Each project can have its own static route `/openfoam/propeller-aeroacoustics-2023` that renders the full case-study server-side.

---

# Analytics & instrumenting

* Track `bookshelf_shelf_open` (shelfId), `book_open` (projectId), `media_play` (type, id), `model_open` (projectId).
* Use lightweight analytics (Plausible or GA4) to see which cases get traction.

---

# Visual tokens & micro-UI guidance

* Spine fonts: condensed sans or mono for compact text.
* Colors: neutral spine colors (muted blues/greens/greys) with a single accent for the active book.
* Shadows: small, layered shadows to indicate depth.
* Motion: fast, mechanical easing (cubic-bezier) to feel “library/slide” like.

---

# Build order (practical steps)

1. Build data JSON + basic `Shelf` + `BookSpine` components. Render static spines.
2. Implement simple `ProjectCard` overlay that shows title/summary and hero image (no video/3D).
3. Add left/right shelf scrolling and keyboard navigation.
4. Add dynamic import for `VideoPlayer` and wire video click-to-load.
5. Implement `ModelViewer` as `dynamic` and enable 3D only after click, with disposal on close.
6. Add virtualization for large shelves.
7. Add graceful fallback routes for SEO / no-JS.

---

# Example micro-copy for a spine & card

* Spine: `Propeller — 2023` (icon: propeller)
* Card TL;DR:

  * Problem → Propeller noise at cruise RPM
  * Approach → Hybrid LES + RANS coupling, mesh refinement
  * Result → Identified tonal source; +6 dB reduction with geometry tweak