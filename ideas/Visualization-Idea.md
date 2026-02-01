# Concept (one sentence)

A retro workstation window that opens small “program windows” - each window shows one visualization artifact (static image, interactive iframe, video, or notebook preview) with quick actions to view source, download data, or open full-screen.

# What the user experiences

* You click the “Visualization Computer” on the hub.
* A clean monitor/XP-style window appears (or a modal on mobile).
* The screen contains a grid or tiled windows (icons) for different visualizations: “Flow field viewer,” “Time-series,” “Mesh inspector,” “ParaView movie,” “Notebook”.
* Click any tile → a window opens inside the monitor showing the artifact with a title bar, small controls (zoom / fullscreen / download / close).
* Everything that’s heavy (ParaView HTML export, Plotly embed, notebook viewer) loads only when the user opens that window.

# Visual design & UX rules

* Keep the monitor frame simple and slightly nostalgic - subtle bevel, small LED “power” dot.
* Inside the monitor, use window chrome consistent with your XP/wiki motif: title bar, close/minimize, 1–3 small action icons.
* Thumbnails: small poster images that hint at the visualization - ensure clean crop and readable tiny captions.
* White-border rule: clickable tiles and title-bar buttons show the white outline on hover/focus.
* Micro-interactions: window opening = fade + scale (120–200 ms). Hover = slight lift. Respect `prefers-reduced-motion`.
* Mobile: open artifacts as full-screen modals; controls become bottom bar buttons.

# The “Programs” / window types (what each can be)

1. **Static figure window**

   * For png/svg exports (plots, ParaView snapshots).
   * Quick: lightbox / download PNG / view caption.

2. **Interactive chart window**

   * Embed Plotly/Observable/Chart.js/D3 visualizations in an iframe (or native react-plotly).
   * Supports hover tooltips and small export CSV option (if available).

3. **ParaView / render movie window**

   * Poster image + play → embed a WebM/MP4 with controls or a lazy-loaded ParaViewWeb/WebGL export.
   * Provide captions / frame rate / resolution.

4. **3D preview window**

   * Small glTF preview inside the monitor (or poster + “Open 3D” to mount ModelViewer).
   * Use preview `.glb` with Draco; full 3D opens in a dedicated fullscreen viewer.

5. **Notebook / reproducibility window**

   * Show a short HTML-rendered excerpt of a Jupyter Notebook (nbconvert to HTML) or an embedded `nbviewer`/Voila/Binder link.
   * Provide direct link to the notebook repo + download button for .ipynb.

6. **Data download / script window**

   * A simple file-list UI: dataset.csv, scripts.zip, run logs; each file has size & download badge.

# Content model (one visualization item)

```json
{
  "id": "u_wing_vorticity",
  "title": "Wing Vorticity Field",
  "type": "interactive" , // static | interactive | video | 3d | notebook | files
  "thumbnail": "/viz/u_wing/thumb.webp",
  "poster": "/viz/u_wing/poster.webp",
  "short": "Velocity & vorticity contours for wing half model",
  "description": "OpenFOAM postprocessed fields visualized with ParaView. Hover to inspect magnitudes.",
  "media": {
    "plotly_embed_url": "https://your-plotly-host/embed/abc",
    "video_url": "/viz/u_wing/flow.webm",
    "glb_preview": "/viz/u_wing/preview.glb",
    "notebook_html": "/viz/u_wing/notebook.html"
  },
  "files": [
    { "label":"postproc scripts", "url":"/files/u_wing/scripts.zip", "size":"120KB" },
    { "label":"raw-data", "url":"/files/u_wing/data.csv", "size":"1.1MB" }
  ],
  "tags":["OpenFOAM","ParaView","Visualization","vorticity"]
}
```

# Component breakdown (React / Next-friendly)

* `VizComputer` - top-level component with monitor frame and thumbnail grid.
* `VizTile` - thumbnail + brief meta, clickable.
* `VizWindow` - the window that opens inside monitor (title bar + content area).
* `LazyIframe` - loads iframe only on mount / on click; sets sandbox and `loading=lazy`.
* `ImageLightbox` - fullscreen image view with caption and download.
* `ModelViewer` - dynamic 3D viewer (ssr: false).
* `NotebookPreview` - dynamic HTML embed or link to full notebook page.
* `FilesList` - present downloadable artifacts with size + md5/hash optionally.
* `useLazyAsset` hook - prefetch on hover (small), mount heavy asset on open, clean up on close.
* `PrefetchPolicy` util - respects `navigator.connection.saveData` and `prefers-reduced-data`.

# Technical patterns and best practices (must-follow)

* **Lazy-load everything heavy**: iframes, model viewers, video players, plot libs must be `dynamic`/imported on demand with SSR disabled.
* **Use lightweight placeholders**: use a poster/screenshot (optimized WebP/AVIF) and replace with real content after click.
* **Sandbox iframes**: `<iframe sandbox="allow-scripts allow-same-origin" ...>` and `referrerpolicy="no-referrer"`. If embedding third-party, use `rel="noopener noreferrer"` on links.
* **Security**: ensure external embeds don’t run arbitrary scripts in your page context; prefer hosting interactive code on your domain or via trusted 3rd-party (Observable, Plotly).
* **Resource cleanup**: unmount components and revoke object URLs; for Plotly, call `Plotly.purge` when you unmount native mounts.
* **Respect Save-Data / bandwidth**: if `navigator.connection.saveData` or slow connection, show static image and a “View interactive (desktop)” message.
* **Serve via CDN**: heavy assets (webm, glb) should be on CDN with cache headers.

# File formats & guidelines

* Static figures: SVG (for line plots) or WebP (photos/screens) - use `srcset`.
* Animated flows: WebM (good compression) with MP4 fallback.
* Interactive charts: Plotly/React-Plotly JSON or Observable embeds.
* Notebooks: `nbconvert --to html` outputs hosted HTML; also provide raw `.ipynb`.
* 3D: glTF (.glb) with Draco compression; preview LOD small (~<50k triangles).
* Scripts: zip with README and small sample dataset (avoid releasing huge raw data on page).

# Accessibility & keyboard

* Each `VizWindow` is a dialog: `role="dialog" aria-modal="true" aria-labelledby`.
* Keyboard controls: Tab focus trap inside open window, Esc to close, Enter/Space to activate tiles.
* Provide text alternatives: transcripts for video, alt text for images, captions for interactive charts.
* Ensure high contrast for the title bar and labels against the monitor background.

# Performance & memory safeguards

* Only one iframe or 3D viewer should be active at any time inside the monitor. Opening a second should unmount the first.
* Limit autoplay - never autoplay video with sound; prefer click-to-play. Use `muted` + autoplay if you must have muted previews.
* For Plotly / heavy JS libs, consider rendering as server-side static images for the landing, then load interactive version on demand.
* Use IntersectionObserver / hover prefetch for thumbnails only; avoid bulk prefetch on pageload.
* Implement a `dispose` or `cleanup` routine on all heavy components to free memory.

# Mobile behavior & fallbacks

* On small screens, show tiles as stacked list; tapping opens full-screen modal.
* Prefer poster images and provide “Open interactive (desktop recommended)” for heavy content.
* If client memory is low (detectable via heuristics), hide 3D and interactive options and show download links.

# Reproducibility & provenance (important for CV)

* For each visualization, show a small provenance block:

  * `Data: experiment_X_v1.csv` (link)
  * `Script: viz_u_wing.py` (link)
  * `Environment: Python 3.10, OpenFOAM v2306`
  * `Command to reproduce: bash run_case.sh`
* Offer a small “Reproduce” CTA that links to a GitHub repo or Binder/Voila instance (if you want live reproducibility).

# Analytics & what to track

* `viz_tile_open` (id, type)
* `viz_interactive_loaded` (id, load_time)
* `viz_download` (file_id)
* `viz_notebook_open` (id)
  Use privacy-respecting analytics.

# Small design tokens & copy examples

* Window title examples: `Flow: Wing Vorticity - Jul 2024`
* Tile captions: `ParaView: pressureContours.png`
* Button labels: `Open Interactive` | `Download Data` | `Open Notebook` | `Open 3D`

# Example workflow / build order (fast ship → polish)

**Phase 1 (MVP, 1–2 days)**

* Static monitor frame + grid of tiles.
* Each tile opens a lightbox with poster image + description + download links.
* Implement “Investigate” CTA to open the monitor.

**Phase 2 (interactive, 1 week)**

* Add `LazyIframe` for Plotly / Observable embeds (click-to-load).
* Add video player for WebM (click-to-play).
* Add notebook HTML preview links (host HTML pages).

**Phase 3 (polish, 1–2 weeks)**

* Add `ModelViewer` dynamic component for 3D previews and LOD switching.
* Add provenance display and reproducibility links (GitHub/Binder).
* Add prefetch-on-hover and analytics.

# Minimal example pseudo-implementation pattern

```jsx
// LazyIframe.jsx (concept)
export default function LazyIframe({ src, title }) {
  const [mounted, setMounted] = useState(false);
  return (
    <>
      {!mounted ? (
        <button onClick={() => setMounted(true)} className="poster-button">Load interactive</button>
      ) : (
        <iframe src={src} title={title} sandbox="allow-scripts allow-same-origin" loading="lazy" />
      )}
    </>
  )
}
```

# Final notes - storytelling & priorities

* The Visualization Computer should feel like a **technical toolset**, not a fancy gallery. Keep tone utilitarian, not flashy.
* Prioritize clarity: if you can’t make an interactive version small and robust, prefer a well-made static poster + download + link to reproducible artifact.
* Keep provenance visible - engineers LOVE reproducibility and it doubles as credibility for recruiting.