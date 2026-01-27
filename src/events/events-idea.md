# EVENTS SECTION — *The Memory Projector*

## Core Idea (the “why”)

Events are *memories*.
Instead of scrolling through them like a gallery, the user **loads a reel**, turns on a **projector**, and *watches* the event unfold frame by frame.

No scrolling.
No clutter.
Pure intentional interaction.

This aligns perfectly with:

* detective aesthetic (reviewing evidence),
* retro hardware fetish (projectors, reels),
* cinematic pacing (frame-by-frame),
* performance safety (controlled loading).

---

## Mental Model for the User

> “Each event is a film reel.
> I load one reel into the projector, and it plays the memory.”

Once users understand this once, the interaction becomes intuitive.

---

# 1. VISUAL DESIGN

## 1.1 Overall Scene Layout

Think of a desk or archive room.

**Left / Center**

* Old **movie projector** (metal, mechanical, tactile).
* Visible lens, vents, power switch, faint glow.

**Near the projector**

* **Film reels** lying flat or stacked.
* Each reel represents **one event**.

**Background / Wall**

* Projection surface (wall, board, canvas).
* Slight texture (paper, plaster, cork).

---

## 1.2 The Film Reel (Event Selector)

### Design

* Circular disk (SVG or CSS).
* Center label:

  * Event name
  * Year
* Small imperfections:

  * Scratches
  * Dust
  * Slight color fade

### States

* **Idle**: muted metal, readable label
* **Hover / Focus**:

  * White outline (your global interaction cue)
  * Slight lift + shadow
* **Selected**:

  * Reel spins briefly
  * Reel visually “locks” into the projector (can be symbolic, not literal)

### Why circular?

* Instantly reads as “film reel”
* Strong affordance
* Breaks rectangular monotony of rest of site

---

## 1.3 Projector

### Design

* Base unit: rounded rectangle or trapezoid
* Lens circle with glass reflection
* Small status LED (off / warming / projecting)

### States

1. **Off**

   * Dim
   * No beam
2. **Warming**

   * LED pulses
   * Subtle hum animation (visual only)
3. **Projecting**

   * Warm cone of light
   * Slight dust particles in beam
   * Lens glow

> The projector is *not* clickable noise — it reacts to the reel.

---

## 1.4 Projection Area (The Screen)

### Shape

* Rectangle with soft edges
* Thin frame (cinema screen feel)
* Slight vignette

### Visual Effects (subtle)

* Film grain overlay
* Occasional flicker (very rare, low opacity)
* Warm color temperature

---

# 2. INTERACTION FLOW (NO SCROLLING)

## Step 1 — Idle State

* Reels visible
* Projector off
* Screen empty or faintly lit

## Step 2 — Reel Selection

* User clicks a reel
* Reel:

  * Lifts
  * Rotates 180–360°
* Projector:

  * LED turns on
  * Beam begins to appear

## Step 3 — Projection Starts

* Screen fades in
* **Frame 0** appears:

  * Title card
  * Event name
  * Date
  * Location
  * Short description

This frame acts as **context**, not content.

## Step 4 — Navigation (Frame-by-Frame)

* Only ONE frame visible at a time
* Controls:

  * ◀ Previous
  * ▶ Next
  * ⏯ Play / Pause (optional)
  * ⓘ Details
  * ✕ Return

No scroll. Ever.

---

# 3. CONTENT STRUCTURE (WHAT AN EVENT CONTAINS)

Each event is a **linear reel**, not a grid.

### Frame Types

1. **Title Frame**
2. **Photo Frames**
3. **Optional Video Frame**
4. **Closing Frame (summary / takeaway)**

### Example Sequence

```
[Title]
[Photo: Poster session]
[Photo: Presentation]
[Photo: Group photo]
[Video: Short clip]
[Closing summary]
```

This structure enforces **storytelling**.

---

# 4. DETAILS VIEW (OPTIONAL, CONTROLLED)

When clicking **Details / Case Notes**:

* Overlay appears **over** the projection (not a new page)
* Shows:

  * Full event description
  * Highlights / bullets
  * Attachments (slides, paper, repo)
* Close returns to same frame

This keeps the cinematic context intact.

---

# 5. TECHNICAL IMPLEMENTATION (REALISTIC)

## 5.1 Component Breakdown

### High-level

* `EventsProjector`
* `FilmReel`
* `ProjectorUnit`
* `ProjectionScreen`
* `FrameController`
* `EventDetailsModal`

---

## 5.2 Data Model (Event JSON)

```json
{
  "id": "aiaa-2024",
  "title": "AIAA Student Conference",
  "year": 2024,
  "location": "Munich, Germany",
  "summary": "Presented aeroacoustics research.",
  "frames": [
    {
      "type": "title",
      "text": "AIAA Student Conference 2024"
    },
    {
      "type": "image",
      "src": "/events/aiaa2024/01.webp",
      "caption": "Poster session"
    },
    {
      "type": "image",
      "src": "/events/aiaa2024/02.webp",
      "caption": "Presentation day"
    },
    {
      "type": "video",
      "poster": "/events/aiaa2024/video.webp",
      "src": "/events/aiaa2024/highlight.webm"
    },
    {
      "type": "summary",
      "text": "Poster finalist, valuable discussions with industry."
    }
  ]
}
```

---

## 5.3 Lazy Loading & Performance (IMPORTANT)

### Initial Load

* Load:

  * Reel thumbnails
  * Projector SVG/CSS
* DO NOT load:

  * Full images
  * Videos

### On Reel Click

* Preload:

  * Title frame
  * First image frame
* Everything else loads **on demand**

### Frame Navigation

* When frame `n` is shown:

  * Preload `n+1`
  * Optionally preload `n-1`

### Cleanup

* On exit:

  * Unmount image/video nodes
  * Cancel timers
  * Release memory

This prevents:

* OOM crashes
* Mobile overheating
* Vercel memory issues

---

## 5.4 Animations (Safe & Cheap)

* Use **transform + opacity only**
* No layout thrashing
* Use CSS transitions
* Optional requestAnimationFrame only for slideshow mode

---

# 6. ACCESSIBILITY (NON-NEGOTIABLE)

### Keyboard

* `Tab` → reels
* `Enter` → load reel
* `← / →` → frames
* `Space` → play/pause
* `Esc` → exit projector

### ARIA

* Projector view: `role="dialog"`
* Frames announced politely
* All images have alt text

### Reduced Motion

* Disable:

  * Reel spin
  * Beam animation
* Replace with instant fade

---

# 7. MOBILE STRATEGY

* Projector becomes **full-screen modal**
* Reels become horizontal chips
* Swipe left/right = frame navigation
* No autoplay
* Lower resolution images by default

---

# 8. WHY THIS WORKS (CRITICALLY)

### Design-wise

* Strong metaphor
* Memorable
* Story-driven
* Fits detective + retro tech vibe

### Technically

* Finite state machine (easy to reason about)
* No scroll = simpler layout
* Lazy loading = stable
* Component isolation = safe

### Recruiter Experience

> “This person understands storytelling, performance, and interaction — not just visuals.”

---

# 9. IMPLEMENTATION PHASES

### Phase 1 (MVP)

* Reels
* Projector modal
* Image frames
* Keyboard navigation

### Phase 2

* Reel spin animation
* Beam effect
* Details modal
* Frame prefetching

### Phase 3 (Optional)

* Subtle audio toggle
* Film grain shader
* Analytics (frame views)