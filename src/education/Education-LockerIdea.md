# What the user sees (visual + content)

Imagine you clicked a locker on the hub and it gently cracked open. You’re now looking at a tidy poster and a small set of artifacts pulled out from the locker.

Top-level visual structure (single-screen panel that replaces/overlays the hub):

* Left: **Locker poster** — big, readable, like a poster pulled halfway out of the locker.
* Right: **Artifact column** — photos on the wall, a small stack of documents, icons for downloads / links, and a short timeline or bullets.
* Bottom: **Navigation row** — “Previous locker / Next locker” buttons and a small, friendly locked third locker placeholder that reads “We ain’t there yet, buddy.”.

The whole thing should feel calm and archival (paper textures, slightly desaturated color palette), not gimmicky.

---

# Detailed visual/layout spec

1. Poster (left, ~55% width)

   * Visual style: aged paper rectangle with subtle drop shadow and 8px rounded corners.
   * Content blocks on poster:

     * Header: Institution logo (left small) + Institution name (bold)
     * Subheader: Degree name — e.g. “BTech, Aerospace Engineering”
     * Date row: start — end (e.g. Jul 2020 – May 2024) + location
     * Short summary: 2–3 lines (what you studied / focus)
     * Quick stats row: GPA / Honors / Scholarships (only if good)
     * Highlight bullets (3): notable courses / projects / thesis title
     * CTA row (small): “View transcript (PDF)” | “See projects from here”
   * Micro-interaction: poster slides a gentle 6–8px forward on hover; expands slightly when clicked for full view.

2. Artifact column (right, ~40% width)

   * Top area: **photo wall** — 2–3 small images (campus, lab, graduation). Photos have thin frames and slight rotation for that “hung on wall” look.
   * Middle area: **document stack** (icons with labels):

     * Transcript PDF (download)
     * Thesis / Final-year project link (PDF or project page)
     * Certificate(s) or awards (images or PDFs)
     * Buttons should show little badges: “PDF” / “View” / “Download”.
   * Bottom area: **quick timeline / key skills** — a compact vertical list:

     * Start date, end date, key courses, supervisor (optional), notable result/award.
   * Micro-UX: clicking a photo opens a lightbox showing full image with caption; clicking a document opens a PDF viewer overlay (lazy-loaded).

3. Footer nav / locker controls

   * “Previous locker” (left), “Close” (center), “Next locker” (right).
   * If the next locker is not available: show a small locked icon + text:
     *We ain’t there yet, buddy.* (subtle, friendly)
   * Keyboard hints: ← Prev, Esc Close, → Next

4. Background treatment while locker is open

   * Dim the hub slightly (overlay with 40% opacity) to keep context.
   * Keep subtle paper grain visible, but reduce contrast.

---

# Copy examples (plug-and-play)

Poster short summary:

> BTech, Aerospace Engineering — focus in CFD and thermal systems. Built simulation pipelines with OpenFOAM and Python; thesis on optimization of pyrolysis-based fuels.

Highlight bullets:

* Final-year thesis: *Optimization of Pyrolysis-Based Plastic Oil Yield* (supervisor: Prof. X)
* Key courses: Compressible Flows, Heat Transfer, CFD Methods
* Awards: Departmental Research Grant 2023

Locked locker copy:

> *We ain’t there yet, buddy.*
> (A little ambition goes a long way — PhD plans TBD.)

Photo captions (example):

* “Main quad, College of Engineering — 2022”
* “Heat transfer lab — poster session, 2023”

---

# Interaction + micro-UX details

* Entry animation: poster slides out 12–16px and fades from 0 → 1 opacity in 160–240ms (non-blocking).
* Poster expand: click poster to open full-screen modal (higher-contrast, print-like view). Modal has “close” (Esc) and download button for poster PDF.
* Photos: click → lightbox modal (use low-res placeholder → full-res lazy load).
* Documents: click → open inline PDF viewer modal (use browser viewer or embed).
* Drawer navigation: clicking Next/Prev swaps the open locker content without leaving the hub (animated crossfade 120–200ms).
* Interaction highlighting: all clickable elements follow the white-border rule (thin white border on hover/focus).
* Touch: taps trigger the same interactions; enlarge hit target to 44×44px minimum.
* Sound: avoid sound. Silent micro-animation only.

---

# Accessibility & keyboard navigation

* All interactive elements must be keyboard-focusable (`tabindex=0` where required).
* ARIA roles and labels:

  * Poster container: `role="region" aria-labelledby="poster-title"`
  * Photo thumbnail: `role="button" aria-label="View campus photo, opens lightbox"`
  * Document link: `<a href="/files/transcript.pdf" download aria-label="Download transcript (PDF)">`
* Keyboard controls:

  * Esc: close locker modal
  * Arrow Left/Right: Previous/Next locker
  * Enter / Space: activate item
* Text alternatives:

  * Provide `alt` text for images (campus shots, poster thumbnail).
  * For PDFs, include a brief description in the link text like “Transcript (PDF, 1.2MB)”.
* Contrast: ensure text on poster and timeline meets AA contrast (4.5:1 for body text).

---

# Technical implementation (React / Next / general)

### Component breakdown (suggested)

* `LockerPanel` — top-level overlay when a locker is open.
* `LockerPoster` — left-side poster, handles expand modal.
* `ArtifactColumn` — right column (PhotoWall + Documents + Timeline).
* `PhotoLightbox` — generic lightbox.
* `PdfViewer` — lazy-loaded PDF viewer if embedded.
* `LockerNav` — Prev / Next / Close buttons and locked placeholder.

### Lazy-loading rules (critical)

* DO NOT import heavy viewers or media on the hub mount.
* Use dynamic imports and SSR disable for heavy components:

```js
// Next.js example
import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('@/components/PdfViewer'), { ssr: false });
const PhotoLightbox = dynamic(() => import('@/components/PhotoLightbox'), { ssr: false });
```

* Only mount `PdfViewer`/`PhotoLightbox` when user clicks the related item.

### Images & assets

* Deliver photos as WebP / AVIF with fallbacks to JPEG.
* Provide `srcset` and `sizes` for responsive loading.
* Thumbnail size: ~400px across; lightbox full-res: max 1600px.
* Compress: target ~80–150 KB for thumbnails, <500–800 KB for full images.
* Use `loading="lazy"` for non-primary images and IntersectionObserver for preloading the poster when locker is about to be opened.

### PDFs and documents

* Host PDFs in `/public/files/`.
* For download links, use `<a href="/files/transcript.pdf" download>` (browsers honor download).
* When showing preview: embed the PDF in an iframe or use a lightweight JS PDF viewer dynamically imported (e.g., pdf.js with dynamic import and `{ ssr: false }`).

### Preventing OOM / memory spikes

* Only one locker’s heavy assets loaded at a time.
* Unmount components (and revoke object URLs) when locker closes.
* Avoid top-level imports of heavy libs (pdf.js, three.js, etc.).
* For images / PDFs, consider a short cache-control header but keep sizes modest.

### Click / hitbox from CAD hub (if applicable)

* If the hub supplies named hitboxes, map hitbox `"locker-1"` → open `LockerPanel` with `lockerId=1`. Keep naming conventions consistent: `locker-{n}`.

---

# Fallbacks (no-JS graceful degrade)

If JS is disabled:

* Structure locker content as semantic `<section>`s on the page, visible stacked underneath the hub (or reveal via anchor links).
* Each locker has a link like `#locker-1` which jumps to the locker content rendered statically.
* Keep full text copies of the poster info so content is always accessible.

---

# Analytics & events (optional)

Track:

* `locker_open` with `lockerId`
* `poster_download` with file size
* `photo_view` with photoId
  These are light and useful to see what recruiters actually open.

---

# Example poster data model (JSON)

```json
{
  "institution": "College of Engineering, XYZ University",
  "degree": "BTech, Aerospace Engineering",
  "dates": {"start":"2020-07","end":"2024-05"},
  "location": "Munich, Germany",
  "summary": "Focus on CFD, thermal systems. Thesis on pyrolysis-based fuels.",
  "highlights":[
    "Thesis: Optimization of Pyrolysis-Based Plastic Oil Yield",
    "Award: Department Research Grant 2023",
    "Key courses: Compressible Flows, Advanced CFD"
  ],
  "photos":["/images/campus1.webp","/images/lab1.webp"],
  "documents":[
    {"type":"transcript","url":"/files/transcript.pdf","size":"1.2MB"},
    {"type":"thesis","url":"/files/thesis.pdf","size":"4.5MB"}
  ]
}
```

---

# Small checklist for building this now

1. Create `LockerPanel` UI mock (static HTML/CSS) and connect open/close.
2. Add `Poster` content and placeholder image.
3. Implement Photo thumbnails with `loading="lazy"` and lightbox dynamic import.
4. Add document links with `download` attribute; dynamic import PDF viewer for preview.
5. Add Prev/Next logic that swaps JSON data and triggers small crossfade.
6. Test keyboard nav (Tab, Enter, Esc, Arrow keys).
7. Test on mobile (tap targets, stacked layout).
8. Run Lighthouse to check performance & accessibility.