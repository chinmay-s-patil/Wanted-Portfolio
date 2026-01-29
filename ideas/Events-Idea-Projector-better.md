## 1) UX story — the scene and the interactive sequence

**Initial scene (idle)**

* Left rail shows the section `EVENTS` title (consistent with side-rail system).
* Center: a stylized old movie **projector CAD model** sits on the desk (rendered in 3D).
* Behind the projector is a faint **screen** (DOM element) on the wall — purposely *visually behind* the projector (so the projector visually occludes part of the screen).
* Right (or below on horizontal layout): a row of **cassettes** (film-reel / cassette icons). They are clearly clickable.

**Interaction (user clicks a cassette)**

1. The clicked cassette animates (lift / rotate) → visually shows it’s engaged.
2. The projector responds:

   * Projector *backing animation*: it shifts slightly backward in depth (in 3D space) or fades down — *OR* you scale it down to simulate it moving behind you. This visually reveals more of the wall/screen.
   * Projector LED/power warms up (pulse).
3. Simultaneously, the screen element (DOM) **expands** (scale + translate) and raises its z-index above the projector—so the event content becomes visually foregrounded.
4. The projector either reduces opacity or animates behind (so it’s still visible but not occluding the screen). The CAD model is not destroyed — just moved / hidden gracefully.
5. The screen now shows the **event frames** — single-frame view with Prev/Next controls, caption, details button, and optional Play.
6. On close: reverse animation — screen shrinks, projector returns to original position/opacity, cassette untucks.

Key design rules:

* No sudden swaps; use short, coordinated animations (see timeline below).
* Avoid physically moving the camera (no panning/orbit); move the projector model or its parent transform instead.
* Keep the projector CAD model interactive only when hub active; when showing event it should be pseudo-disabled to avoid accidental clicks.

---

## 2) Visual & layering rules (z-index strategy)

You need two interactive layers:

* **3D Canvas (r3f / Three.js)** — contains the projector CAD model (and optionally other 3D props). Initially visually above the screen in the stacking order (i.e., projector visually occludes screen).
* **DOM Screen / UI** — the projected images, captions and controls (regular DOM so text is crisp and accessible).

**Preferred stacking**:

```
[z-index high]  UI overlays (buttons, side-rail)
[z-index mid]   3D Canvas (projector CAD)
[z-index low]   Screen background (DOM behind canvas)
```

To allow the screen to become foreground when needed:

* Either (A) **move/fade the 3D projector away** (recommended), or (B) temporarily lower the canvas z-index (less preferred — toggling canvas z-index can cause event layering complexity).
* So: keep canvas stacking above screen at all times, but animate the 3D projector out-of-the-way (translateZ or scale down + opacity) so the DOM screen reads unobstructed.

Why prefer moving the model over toggling canvas z-index?

* Moving the projector is visually coherent (it looks like the hardware backs away)
* Avoids pointer-events edge cases (canvas capturing clicks)
* Keeps DOM text crisp and selectable without canvas overlay interfering

---

## 3) Technical implementation (components, state machine, libs)

**Stack**

* React + Next.js
* `@react-three/fiber` (r3f) + `@react-three/drei` for 3D / GLTF loading
* `react-spring` or `framer-motion` for DOM + some 3D animated transitions (r3f integrates with react-spring/react-three-fiber)
* Use `dynamic(() => import(...), { ssr: false })` for heavy 3D component so SSR won’t try to render it

**Key components**

```
<EventHub>                    // container for scene + UI
 ├─ <SideRail />             // Titles, back button (left)
 ├─ <SceneCanvas />          // r3f Canvas with Projector3D model (canvas is on top visually)
 │    └─ <Projector3D />
 ├─ <ScreenDOM />            // DOM screen behind the canvas (initially background)
 ├─ <CassetteShelf />        // cassette buttons (right or below)
 └─ <EventController />      // handles selection, prefetching, audio
```

**State machine (simplified)**

```ts
hubState: 'idle' | 'cassetteHover' | 'cassetteSelected' | 'projecting' | 'eventOpen'
selectedEventId?: string
```

Transitions:

* idle → cassetteHover (on hover)
* idle/cassetteHover → cassetteSelected (on click)
* cassetteSelected → projecting (animate projector move + screen grow)
* projecting → eventOpen (projector has finished animating, screen shows frames)
* eventOpen → idle (on close, reverse animations)

**3D specifics**

* Load projector GLTF with Draco compression.
* Keep the projector in a group so you can animate its transform: `<group ref={g}/>`.
* To "back away", animate `g.position.z` (i.e., toward negative z) and `g.scale` and `g.material.opacity` (if using mesh basic material with transparent true) — NOT camera move.
* Use `useFrame` sparingly; prefer animated springs for smooth, interruptible motion.

---

## 4) Animation timeline & choreography (concrete timings)

Suggested eased timings (feel snappy but not rushed):

1. **Cassette click** — immediate micro-feedback

   * cassette lift/rotate: 120ms ease-out
2. **Projector warm** — begins 40–80ms after cassette click

   * projector recoil/back-away: 260–380ms cubic-bezier(.22,.9,.13,1)
   * projector opacity down (if desired) 200–300ms
3. **Screen expand** — start at same time as projector back-away

   * screen scale (1→1.18) + translate to center: 260–360ms
   * screen box-shadow + vignette fade-in: 200–260ms
4. **Cards/Controls fade** — staggered fade-in for prev/next/details (50ms stagger)

   * individual control fade: 120ms
5. **Frame crossfade** — when user navigates frames

   * crossfade opacity: 120ms

The **reverse** is the same durations reversed.

A short timeline:

* 0ms: cassetteClick -> cassette animation
* 40ms: projector starts to back away
* 260ms: screen almost fully expanded -> show first frame
* 320ms: controls fully visible and interactive

---

## 5) Lazy-loading & memory safety (very important)

**What to load at initial page load**

* Cassette thumbnails (very small WebP / AVIF)
* Projector GLTF preview or extremely low LOD (or a tiny placeholder mesh)
* DOM screen placeholder image (low-res)

**On hover**

* Prefetch: first frame of that event (small), metadata
* Behavior: do not prefetch full gallery or HD images

**On click (cassetteSelected)**

* Start preloading the event frames and optionally the video in the background (use `fetch` with `signal` to cancel on close)
* Mount the full-resolution screen UI only after projector animation finishes (so the heavy load is masked by the animation)

**Unload / cleanup on close**

* Cancel any outstanding fetches (AbortController)
* Unmount heavy components (stop video playback, remove image blobs)
* For Three.js: call dispose on geometries/materials/textures if you remove projector completely. But since you keep projector component mounted (just move it away), you may not need to destroy. If you do need to free memory, fully unmount and call cleanup (see code snippet below).

**GLTF and r3f cleanup pattern**

```js
// inside Projector3D component cleanup
useEffect(() => {
  return () => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material?.dispose();
      }
      if (obj.material?.map) obj.material.map.dispose();
    });
    // If you created a custom renderer, call renderer.dispose()
  }
}, []);
```

---

## 6) Accessibility, keyboard, and controls

* **Keyboard flow**

  * Tab focuses cassettes -> Enter to select
  * When eventOpen, arrow keys navigate frames; Space toggles Play/Pause; Esc closes
  * Ensure focus trapping inside the event screen when open (use `aria-modal="true"` role)
* **ARIA**

  * Cassette buttons: `<button aria-pressed="false" aria-label="Open reel AIAA 2024">`
  * Screen: `role="dialog" aria-modal="true" aria-labelledby="event-title"`
* **Reduced motion**

  * Respect `prefers-reduced-motion`: reduce or skip projector back-away animation and screen scaling; simply crossfade the screen in/out
* **Screen-reader fallback**

  * Provide a hidden text-only listing (visually hidden with CSS) that lists events and links directly to their pages

---

## 7) Mobile behavior & no-JS fallback

**Mobile**

* Use a simplified interaction: cassette shelf = horizontally scrollable chips
* On cassette tap: open a *full-screen modal* (DOM) that shows the event frames; skip 3D projector animation
* This keeps mobile simple and avoids heavy 3D

**No-JS**

* Provide an accessible `/events` page listing events with static images and links (SEO + fallback). The interactive experience is an enhancement.

---

## 8) Component-level pseudo-code & CSS snippets

### High-level React skeleton (pseudo)

```jsx
// EventHub.jsx
import dynamic from 'next/dynamic';
const ProjectorCanvas = dynamic(() => import('./ProjectorCanvas'), { ssr: false });
function EventHub({ events }) {
  const [state, setState] = useState('idle'); // idle | selected | projecting | open
  const [selectedId, setSelectedId] = useState(null);
  // Prefetch controller store
  return (
    <div className="hub">
      <SideRail title="EVENTS" />
      <div className="stage">
        <div className="screen-behind" aria-hidden> {/* screen DOM - background */} </div>
        <ProjectorCanvas state={state} selectedId={selectedId} onAnimationEnd={(phase)=>{ /* ... */}} />
        <ScreenUI state={state} selected={selectedId} onClose={...} />
      </div>
      <CassetteShelf events={events} onSelect={(id)=>{ setSelectedId(id); setState('selected'); }} />
    </div>
  );
}
```

### Projector3D : r3f snippet (pseudo)

```jsx
function Projector3D({ state, selectedId }) {
  const groupRef = useRef();
  // use spring for animations
  const [spring, api] = useSpring(() => ({ posZ: 0, scale:1, opacity:1 }));
  useEffect(() => {
    if (state === 'projecting') {
      api.start({ posZ: -1.2, scale:0.92, opacity:0.6, config:{...} });
    } else {
      api.start({ posZ: 0, scale:1, opacity:1 });
    }
  }, [state]);
  // apply spring to groupRef transform
  return (
    <group ref={groupRef} position-z={spring.posZ} scale={spring.scale} ...>
      <primitive object={gltf.scene} />
    </group>
  )
}
```

### CSS snippet for z-ordering and screen expand

```css
.stage { position:relative; width:100%; height: 80vh; }
.screen-behind { position:absolute; inset:0; z-index:10; transform-origin:center; transition: transform .32s ease, opacity .24s; }
.canvas-layer { position:absolute; inset:0; z-index:20; pointer-events:auto; } /* canvas sits visually above screen */
.screen-expanded { transform: scale(1.18) translateY(-20px); z-index:30; } /* when event open, ensure dom visual dominance */
```

Note: we animate projector away rather than fiddling z-index. But if you must raise screen above canvas quickly you can fade canvas opacity (canvas {opacity: .3}) while retaining pointer-events accordingly.

---

## 9) UX polish tips & micro-interactions

* **Cassette-to-projector "feeding" effect:** animate a small film-strip SVG that travels from cassette to projector lens during selection (100–260ms). Nice micro detail.
* **Audio:** offer a toggle for projector mechanical hum or film reel sound, default OFF.
* **Visual feedback:** while frames prefetch, show a subtle grainy loader on screen (keeps cinematic feel).
* **Interaction hint:** first time user prompt: `Press Enter to play reel / ← → to navigate` — small, dismissible.

---

## 10) Performance checklist (before shipping)

* Use Draco-compressed glTF for projector model; consider a very low-poly LOD for the hub.
* Dynamic import the `ProjectorCanvas` so initial SSR payload is small: `dynamic(() => import('./ProjectorCanvas'), { ssr:false })`.
* Preload only `frame n+1` and cancel prefetch when user leaves.
* Test opening/closing the projector multiple times and watch memory usage. Use the cleanup patterns above.
* Use `prefers-reduced-motion` and `navigator.connection.saveData` to reduce prefetching and animation on constrained devices.

---

## Final short flow recap (to implement it)

1. Render hub: screen (DOM) + canvas (projector GLTF on top) + cassette shelf (DOM)
2. User clicks cassette
3. Quick cassette animation → prefetch first frames
4. Animate projector back-away (3D transform) while screen DOM scales up
5. Once projection transform is complete, mount event UI (DOM big screen) and start showing frames
6. On close, reverse animations and unmount heavy assets / stop prefetches
