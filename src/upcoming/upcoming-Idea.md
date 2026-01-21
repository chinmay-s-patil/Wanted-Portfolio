# Concept — one sentence

A small puck / disk on the table projects a hovering 2D menu grid as a translucent hologram. Panels float above the puck, glow with neon edges, and materialize/flatten into the page when opened. It feels like a game menu projected into the room.

# Visual summary (what the user sees)

* Base: a small circular **projector disk** sitting on the hero surface (subtle shadow, ring LED).
* Hologram plane: a semi-transparent, slightly curved plane above the disk (glass-like, thin bloom/scanlines), containing a grid of **floating cards** (menu items).
* Cards: 3×2 or 2×3 grid of panels — neon rim, soft interior glow, icons + short label.
* Depth cues: slight vertical offset for each row, tiny parallax when cursor moves.
* Ambient effects: particle dust, faint vertical light shafts, and a soft volumetric fog under the hologram (very subtle).

# Key interactions & micro-UX

* **Power on / Idle**

  * Disk has small breathing LED. Hologram is dim by default (or off).
  * A single click, tap, or keyboard `Enter` "powers on" the projector (nice onboarding).
* **Materialize animation (power on)**

  * Disk hum → thin ring pulse → holographic plane scales up from 0 → 1 with blur bloom, cards fade in with stagger (50–80ms step).
  * Add a small CRT-style scanline shimmer for 300ms. Respect reduced motion.
* **Hover / focus on a card**

  * Card lifts 8–12px, edge glow intensifies, inner content slightly scales (1.02).
  * Subtle parallax on mousemove: card shifts by 2–6px based on mouse within card bounds.
* **Select a card**

  * Short ripple pulse from the center of the card (30–70ms), then the card “flattens” and slides forward into the camera plane → expands into its panel or mounts the section UI. This gives the impression the hologram becomes the content, not a full page navigation.
* **Back / Close**

  * Panel collapses back into the card position on the hologram, then hologram dims.
* **Look Left / Look Right**

  * Instead of physically panning, the hologram can rotate around its Y axis 15–20° with a soft ease, revealing another column of panels (cheap “depth” hint without camera control).

# Transitions — rules & examples

* Use short, consistent durations: materialize 260–360ms, card hover 140ms, select morph 180–260ms.
* Choreography:

  1. Disk pulse (40ms)
  2. Hologram plane scale + blur (260ms)
  3. Cards stagger fade-in (50ms steps)
  4. Select: ripple (70ms) → card scale/translate (160ms) → mount content
* For returning: reverse the sequence. Keep easing `cubic-bezier(.2,.9,.2,1)` for snappy feel.
* Respect `prefers-reduced-motion`: switch to instant fades and no parallax.

# Design language & tokens

* Colors: Neon cyan `#00E0FF` (primary), magenta `#FF3CA6` (accent), warm sunset `#FF8C3C` for CTA. Text off-white `#EAF2FF`.
* Materials: hologram = semi-opaque gradient `rgba(14,18,24,0.22)` + `backdrop-filter: blur(6px)` + thin neon rim.
* Type: compact geometric for titles (Orbitron/Inter), monospace for small system strings.
* Shadow: soft volumetric base under disk, small inner-glow on cards.

# Accessibility & keyboard

* Hologram is an interactive region: `role="application"` or `role="region" aria-label="Holographic menu"`.
* Each menu item is a `<button>` with `aria-pressed`, `aria-label`, and `aria-describedby` for short help text.
* Keyboard navigation: Arrow keys to move focus, Enter / Space to activate, Esc to close. Provide visible focus outline (use neon outline but high-contrast).
* Screen-reader fallback: provide a plain list of links (visually hidden) so users can still reach sections without the hologram.
* Provide a “Low Power / Plain Mode” toggle for users on assistive tech or low-power devices.

# Technical implementation options (practical)

Two practical ways depending on how flashy you want to go:

### Option A — CSS + small JS (LOW COST, safe)

* Hologram plane is a `<div>` with CSS gradients, `backdrop-filter`, and `transform: translateZ(...) rotateX(-8deg)`.
* Cards are DOM `<button>`s; parallax via `mousemove` listeners (throttled) translating `transform`.
* Animations via CSS transitions & keyframes. Use small SVGs for HUD accents.
* Pros: accessible, minimal runtime, easy to test on Vercel.

### Option B — WebGL (Three.js / shader) (MORE POWERFUL)

* Use a thin Three.js scene for the hologram plane & volumetrics; render the cards as textured planes (or keep the cards as DOM overlay).
* Always dynamically import Three.js only on user interaction: `dynamic(() => import('./HoloWebGL'), { ssr: false })`.
* Pros: very cool visuals (scanline, fog, volumetric light), cheap if you keep scene simple and LOD small.
* Cons: heavier, must carefully lazy-load and dispose.

**Recommendation:** Start with Option A and add an optional WebGL enhancement loaded after initial interaction on desktop only.

# Performance & safety rules

* Lazy-load heavy assets (three.js, big images) only after projector powers on or when user is on desktop (use `navigator.deviceMemory` and `navigator.connection` checks).
* Keep DOM small, no more than a handful of animated elements.
* Use `will-change: transform, opacity` sparingly.
* On close, cancel any animation frames and remove event listeners.
* Use `prefers-reduced-data` and `saveData` checks to disable parallax, heavy bloom, and WebGL.

# Component breakdown (React / Next-friendly)

* `HoloProjector` — top-level component (disk + hologram wrapper)

  * props: `items[]` (menu items), `onOpen(item)`
* `ProjectorDisk` — visual puck, handles power state and LED
* `HologramPlane` — plane layer, handles scanline, parallax, and grid
* `HoloCard` — each floating menu button (keyboard/focusable)
* `HoloTransitionLayer` — handles morph animation from card → content
* `HoloWebGLEnhancer` (optional) — dynamic import; only mounted when enabled

# Animations & select morph pattern (how to morph DOM → content)

* Use FLIP-ish approach:

  1. Capture card bounding rect on screen (before).
  2. Mount content overlay invisibly, measure its bounding rect.
  3. Animate transform from card rect → overlay rect using `transform` and `opacity` (fast and cheap).
  4. Finally mount the real content and remove the animated clone.
* This is what makes the card feel like it “becomes” the content rather than a navigation.

# Mobile & fallback

* Mobile: hologram reduces to a nice stacked card list (no parallax), initial power-on can be automatic. Use larger tap targets and full-screen content modals.
* No-JS / screen-reader fallback: Inject a semantic list of links under an ARIA-hidden header so crawlers and assistive users can access all sections.

# Analytics & events to track

* `holo_power_on` (time, method: click/keyboard)
* `holo_card_hover` (id)
* `holo_card_select` (id)
* `holo_prefetch` (assets prefetched on hover)
* `holo_eject` (user closed hologram)

# Small CSS starter for the hologram plane (concept)

```css
.holo-disk {
  width: 96px; height: 20px; border-radius: 999px;
  background: linear-gradient(180deg,#081018,#0b1220);
  box-shadow: 0 18px 48px rgba(0,0,0,0.6), 0 2px 6px rgba(0,255,255,0.04) inset;
  display:flex;align-items:center;justify-content:center;
}
.holo-led { width:10px; height:10px; border-radius:50%; background:#002D35; box-shadow:0 0 8px rgba(0,255,255,0.05) }
.holo-plane {
  position: absolute; width: min(860px, 92vw); height: 420px;
  left: 50%; transform: translateX(-50%) translateY(-20px) rotateX( -14deg );
  background: linear-gradient(180deg, rgba(8,10,18,0.18), rgba(8,10,18,0.06));
  border-radius: 12px;
  border: 1px solid rgba(0,255,255,0.06);
  backdrop-filter: blur(6px) saturate(120%);
  box-shadow: 0 28px 60px rgba(2,10,26,0.6);
  overflow: visible;
  transform-origin: center bottom;
  transition: transform .32s cubic-bezier(.22,.9,.13,1), opacity .28s;
}
.holo-card { 
  display:flex;flex-direction:column;align-items:flex-start;padding:14px;border-radius:8px;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(10,12,18,0.04));
  border: 1px solid rgba(0,255,255,0.08);
  box-shadow: 0 8px 28px rgba(0,0,0,0.5);
  transition: transform .14s, box-shadow .14s, filter .14s;
}
.holo-card:hover{ transform: translateY(-10px) scale(1.02); box-shadow: 0 18px 48px rgba(0,0,0,0.7); filter: drop-shadow(0 6px 18px rgba(0,160,255,0.12)); }
```

# Phased build plan (practical)

**Phase 1 (MVP — 1 afternoon)**

* Implement `HoloProjector` as DOM + CSS: disk + plane + grid of buttons. Add power-on, hover, keyboard navigation, and card select → call `onOpen()`.

**Phase 2 (Polish — 1–2 days)**

* Implement FLIP morph animation for panel → content. Add parallax on mousemove. Add small HUD SVG accents.

**Phase 3 (Optional enhancement)**

* Add `HoloWebGLEnhancer` (wireframe floor or volumetric beam) as dynamic import for desktop. Add prefetch-on-hover for heavy content and disposal.

# Why this will work for your site

* Keeps the retro-detective + retro-futuristic blend: puck = physical artifact, hologram = futuristic tech.
* Strong affordance: clicking is obvious, keyboard works, and the morph gives satisfying context-preserving transitions.
* Scales: each menu panel maps to your “levels” (bookshelf, CRT, etc.) and avoids full page loads when not needed.