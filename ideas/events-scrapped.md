# Concept — what the user feels

A stack of old photographic film reels laid out on a table. Click a reel to “unroll” it: a horizontal strip of photos appears (or a carousel) with a small caption/info card attached — like inspecting an old memory reel. Clean, tactile, and fast.

---

# UX summary (one sentence)

Reels are index objects (compact on the shelf). Opening a reel reveals a horizontally-scrolling photo strip with captions, a short event summary, and quick actions (download, share, open gallery). Heavy assets load only on demand.

---

# Visual design & micro-UX

* **Appearance**: Circular reel graphic (flat, slightly worn paper texture) with a typed label (event name + year) on the hub. Subtle drop shadow and small tape/pin ornament.
* **Closed reel state**: compact, shows label and a tiny thumbnail peek in the reel window.
* **Open reel state**:

  * Reel “unrolls” into a horizontal strip sitting above the table (simple fade/slide, no elaborate physics).
  * Photo strip shows 3–6 frames at once on desktop, 1–2 on mobile.
  * A caption strip below the photos shows event metadata (name, date, location, 2–3 highlights).
  * Controls: left/right arrows, thumbnails click-to-open lightbox, play/pause autoplay (muted slideshow) toggle.
  * Close: a prominent “Roll up / Close” button returns to the hub.
* **Optional aesthetic touches**: tiny sprocket holes on the strip edges, faint grain overlay on photos, paper tape on reel center (decorative).

Micro-interactions:

* Reel hover: subtle lift + white-border cue.
* Open: 160ms fade + 120ms slide-up.
* Photo click: quick zoom-in lightbox with caption.
* Autoplay: photos crossfade (200–400ms) — disabled if prefers-reduced-motion.

---

# Content model (JSON example)

```json
{
  "id": "aiaa-2024",
  "title": "AIAA Student Conference 2024",
  "dates": { "start": "2024-06-12", "end": "2024-06-15" },
  "location": "Munich, Germany",
  "summary": "Presented drone aeroacoustics work and networked with researchers.",
  "highlights": [
    "Poster finalist",
    "Presented hybrid LES-RANS results",
    "Met industry leads"
  ],
  "photos": [
    { "id":"p1", "thumb":"/events/aiaa2024/01-thumb.webp", "full":"/events/aiaa2024/01.jpg", "caption":"Poster session, evening" },
    { "id":"p2", "thumb":"/events/aiaa2024/02-thumb.webp", "full":"/events/aiaa2024/02.jpg", "caption":"Flight rig demo" }
  ],
  "video": "/events/aiaa2024/highlight.webm",
  "cover": "/events/aiaa2024/cover.webp"
}
```

---

# Component breakdown (React / Next friendly)

* `ReelsShelf` — renders a list/grid of `ReelCard`.
* `ReelCard` — compact reel (closed state) with label + cover thumbnail; clickable.
* `ReelViewer` — overlay/panel that shows the unrolled strip (lazy-loaded when opened).

  * Internals:

    * `PhotoStrip` — horizontally scrollable container (virtualized if long).
    * `PhotoFrame` — individual frame (thumbnail → lazy full on open).
    * `Lightbox` — fullscreen modal for full-res images & captions.
    * `SlideshowController` — play/pause, interval config.
    * `InfoCard` — metadata (date, location, highlights) and actions.
* `useLazyImages` hook — prefetch / load-on-demand logic.
* `useVirtualList` hook — for very long reels.

---

# Loading strategy & performance (critical)

* **Never load full images for all reels on page load.**

  * Load only `cover` and `thumb` for closed reels (small WebP/AVIF, ~30–120KB).
  * When user opens a reel, lazy-load the full-res images for that reel (progressive loading: low-res → high-res).
* **Thumbnails vs full images**

  * Use small thumbnails (`thumb`) in strip and `loading="lazy"`.
  * Only fetch `full` image when user opens lightbox or clicks a frame.
* **Slideshow / video**

  * For autoplay slideshow: use the `thumb` images for the slideshow; switch to full only in lightbox.
  * If reel has a video, show a poster thumbnail; load video only on play.
* **Virtualization**

  * If a reel has >20 images, virtualize the strip (render only visible frames).
* **Prefetch**

  * On mouse hover (desktop) prefetch the first 1–3 full images or start fetching `thumb`s if not yet loaded.
  * Respect `navigator.connection.saveData` and `prefers-reduced-data`.
* **Memory cleanup**

  * When closing a reel, release large image object URLs and unmount heavy players (video).
* **CDN**

  * Serve images and videos from CDN with proper cache headers and small sizes.

---

# Accessibility

* `ReelCard` is a `<button>` with `aria-expanded` and `aria-controls` pointing to `ReelViewer`.
* `ReelViewer` is `role="dialog"` with `aria-modal="true"`, labelled by the reel title.
* Keyboard:

  * Tab to focus reel cards.
  * Enter/Space open reel.
  * Left/Right arrows navigate frames.
  * Esc closes viewer.
  * Space toggles play/pause when slideshow focused.
* Images: include `alt` text and full captions in lightbox.
* Slideshow: provide pause control + respect `prefers-reduced-motion`.
* Contrast: ensure text in info card passes AA.
* Screen reader hints: “X frames, press left/right to navigate”.

---

# Mobile behavior

* Reels display as vertically stacked cards or a horizontally scrollable shelf.
* Opening a reel: full-screen modal with swipe left/right to navigate frames.
* Controls placed at bottom for thumb reach (play/pause, download, close).
* Use `touch-action: pan-y` to allow vertical page scroll, and only-lock horizontal pan when viewer is open.
* Use lower-resolution preview by default on mobile; offer “Load high-res” button.

---

# Lightbox & showing event details

Three good patterns (pick one or combine):

1. **Caption strip under reel (recommended)**

   * Keeps metadata visible while browsing photos.

2. **Info card that slides out from the side**

   * Shows full summary, date, location, 2–3 highlights, download links for archive (zip), and links to related projects.

3. **First frame is metadata**

   * The very first frame in the strip is a stylized “title card” that contains event name, date, location, short description. Minimal extra UI needed.

---

# File types & sizes (recommendations)

* Thumbnails: WebP/AVIF at ~400px width, 40–150 KB.
* Strip thumbs: WebP ~800px for desktop strip.
* Full images: JPEG/WEBP ~1600–2400px depending on importance, 200–800 KB.
* Videos: WebM (VP9) preferred; provide MP4 fallback.
* Archive downloads: zip with optimized images and a text `README.txt`.

---

# SEO & metadata

* Each event should have a stable route: `/events/aiaa-2024` with server-rendered page including schema.org `ImageGallery` or `Event` markup (title, dates, location, description).
* Provide Open Graph image (cover) for social sharing.

---

# Analytics (what to track)

* `reel_open` (eventId)
* `photo_view` (eventId, photoId, viewTime)
* `video_play` (eventId)
* `reel_download` (eventId)
* `slideshow_play` (eventId)

---

# Privacy & content notes

* Obtain consent before posting photos with other people. Make a note in the event metadata if images include people.
* Offer “Report / Request removal” link on event page.

---

# Build order (practical incremental)

**Phase 1 (MVP, 1 day)**

1. `ReelsShelf` grid with `ReelCard` showing cover + label.
2. Clicking `ReelCard` opens `ReelViewer` overlay with `PhotoStrip` showing thumbnails (local assets).
3. Lightbox: clicking a frame opens full-size image modal.

**Phase 2 (1–2 days)**
4. Add slideshow (play/pause), left/right keyboard navigation, and caption strip.
5. Implement mobile swipe gestures and accessibility improvements.

**Phase 3 (polish)**
6. Add hover prefetch, virtualization for very long reels, and video support with poster/play.
7. Add zip download for event archive and server-side event pages with schema markup.
8. Add analytics and privacy controls.

---

# Example UI copy (for a reel)

* Reel label (hub): `AIAA 2024 — Munich`
* Title card (first frame):
  **AIAA Student Conference 2024**
  *Munich, Germany — Jun 12–15*
  Presented: Propeller Aeroacoustics — Poster finalist
* Lightbox caption example: `Poster session — evening reception (June 13, 2024)`

---

# Implementation snippets (pseudo)

Lazy image load hook:

```js
function useLazyImages(urls) {
  const [loaded, setLoaded] = useState({});
  useEffect(() => {
    // lazy load only when asked; return cleanup to revoke object URLs if used
  }, [urls]);
  return [loaded, loadImage];
}
```

Simple lazy iframe / video pattern:

```jsx
{videoPoster && !videoPlaying && (
  <button onClick={() => setVideoPlaying(true)} aria-label="Play highlight video">
    <img src={videoPoster} alt="Video poster" />
  </button>
)}
{videoPlaying && <video src={videoUrl} controls autoPlay muted playsInline />}
```

Keyboard navigation example:

* Add `onKeyDown` handler on `ReelViewer`:

  * ArrowLeft → prevFrame()
  * ArrowRight → nextFrame()
  * Esc → close()

---

# Final UX rules (short checklist)

* Keep reels visually simple and consistent.
* Lazy-load heavy assets and release them on close.
* One viewer open at a time.
* Respect accessibility & reduced motion.
* Make metadata discoverable and downloadable.
* Provide server-side event pages for SEO & no-JS users.