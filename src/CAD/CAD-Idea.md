# Concept summary

A retro TV (CRT) frame on the page acts as the **model display**. Below it is a row of cartridge-like spines (your CAD models). Clicking a cartridge “loads” the model into the TV: a small textual slot shows the model name and the 3D viewer mounts inside the TV bezel. Everything is intentionally static (no free camera) and lazy-loaded to keep it light and OOM-safe.

---

# Visual & UX design

**Overall layout**

* A centered TV bezel (aspect ~16:10 or 4:3) with an inner canvas area for the model viewer.
* Beneath the TV, a horizontal row of cartridge spines (the cartridges show only the model name and small icon).
* To the right of the TV: a compact info panel (model name, short description, tech stack, quick actions).
* A small “slot” / label on the TV bezel shows the selected cartridge name (like a “now playing” label).
* TV idle state: static poster image, subtle CRT scanlines, small power LED.

**Aesthetic**

* CRT bezel: slightly rounded dark frame, subtle chrome edge (flat stylized look, not photoreal).
* Inner screen: subtle scanline overlay, vignette, slight blur on edges.
* Cartridges: rectangular with spine text, small embossed label (no real animation necessary — simple lift on hover).
* Micro-animations: cartridge hover lift, TV screen quick fade on model swap, small “inserting” pulse when a cartridge is selected.

**Interaction patterns**

* Click cartridge → cartridge gets highlighted, TV shows loading state → model viewer mounts and fades in.
* Click again on the same cartridge: toggle fullscreen viewer or “reset view”.
* Controls available: rotate (drag), zoom (pinch/scroll) *optional* — prefer bounded, slow orbit; consider turning off rotation by default on mobile.
* “Open fullscreen” button in the info panel loads a full-screen viewer (also lazy-loaded).
* Only one model/viewer active at a time; selecting a new cartridge unmounts previous viewer and disposes resources.

---

# Content model (CAD item JSON)

```json
{
  "id": "wing_half",
  "title": "Wing Half-Model",
  "year": 2024,
  "short": "Glide-tested wing section",
  "description": "Simplified wing half with internal ribbing, used for aero structural visualization.",
  "thumbnail": "/cad/wing_half-thumb.webp",
  "poster": "/cad/wing_half-poster.webp",
  "model3d": "/cad/wing_half-draco.glb",
  "preview_lod": "/cad/wing_half-preview.glb",
  "tools": ["SolidWorks", "Blender"],
  "polygons": 32000,
  "notes": "Use low LOD for mobile; high LOD available on desktop only."
}
```

---

# Technical architecture & implementation details

**High-level components**

* `CadCrtSection` (page section; container)

  * `CrtFrame` (visual TV bezel + canvas)
  * `CartridgeRow` (list of `Cartridge` components)
  * `InfoPanel` (model metadata + actions)
  * `ModelViewer` (dynamically imported 3D viewer component with glTF loader)
  * `FullScreenViewer` (optional, dynamic import)

**Dynamic imports & SSR**

* `ModelViewer` MUST be dynamically imported with SSR disabled:

```js
import dynamic from 'next/dynamic';
const ModelViewer = dynamic(() => import('./ModelViewer'), { ssr: false });
```

* Lazy-load `ModelViewer` only when a cartridge is selected (not on mount).

**Model formats & export**

* Use `.glb` (binary glTF) for each model.
* Enable **Draco compression** for geometry.
* Bake materials where possible; avoid large textures. Prefer simple PBR or flat colors.
* Provide at least two LODs:

  * `preview.glb` (very low poly for mobile / thumbnail)
  * `full.glb` (higher-poly for desktop/fullscreen)
* Name convention: `id-preview-draco.glb`, `id-full-draco.glb`

**Model viewer requirements**

* Use `@react-three/fiber` and `@react-three/drei` inside `ModelViewer` (but only import them within the dynamic component).
* Viewer features:

  * Auto-fit to bounding box on load.
  * Minimal lighting (1-2 lights, soft shadows off by default).
  * Basic orbit controls with limited angle and zoom: enable rotate + pinch zoom; no panning.
  * Provide “reset view” button.
  * Show basic stats (polygon count) optionally in info panel.
* Memory cleanup:

  * When unmounting, traverse scene and `dispose()` geometries, materials, textures and call `renderer.dispose()` if applicable.
  * If using three.js `WebGLRenderer` created inside component, call `renderer.forceContextLoss()` in extreme cases.

**Previews & placeholders**

* Use a `poster` image that shows a rendered orthographic snapshot (or screenshot from Blender) as placeholder.
* Show a small animated spinner or skeleton while loading.
* Immediately show `preview.glb` when user selects; only load `full.glb` on fullscreen or on explicit “high quality” toggle.

**Progressive loading & prefetch**

* On `cartridge.hover` (desktop), prefetch `thumbnail` and optionally `preview.glb` to make perceived load faster. Use `link rel="preload"` or programmatic fetch for small files.
* Respect `prefers-reduced-data` and device memory: skip prefetch on mobile/slow networks.

**Event mapping**

* Cartridge `id` → viewer loads `preview.glb`.
* Click “Open 3D (HQ)” → replace preview with full glb or open FullScreenViewer and load full glb.

---

# Performance & memory safeguards

* Load only one `ModelViewer` at a time.
* Use Draco compression and minimal texture sizes (<= 512px).
* Limit initial polygon count for preview (<= 50k) and full models <= 200k for modern desktops.
* Use `useEffect` cleanup to call `dispose()` on meshes/materials/textures.
* On mobile, disable shadows, reduce number of lights, and prefer `preview.glb` only.
* Keep viewer frame resolution adaptive: lower `dpr` on mobile or low-power devices.
* Set worker threads for large parsing if available (GLTFLoader supports DRACOLoader web workers).
* Use caching headers via CDN for `.glb` and images.

---

# Accessibility, keyboard & controls

* Cartridges: rendered as `<button>` elements with `aria-pressed` and `aria-label` (e.g., `aria-label="Load Wing Half model"`).
* InfoPanel actions also keyboard focusable.
* Viewer should have a textual fallback link: “Open model page” that loads a server-side page describing the model when JS is disabled.
* Controls: support keyboard rotate/zoom alternatives (e.g., arrow keys rotate, +/- zoom) and announce instructions in a hidden accessible region.
* Respect `prefers-reduced-motion`: remove auto-rotate and scanline flicker.

---

# Mobile & fallback strategy

**Mobile**

* Cartridges become horizontally scrollable chips; only show 1–2 chips visible.
* Clicking opens a modal with the poster and a “View 3D” button; allow fullscreen viewer.
* By default use `preview.glb` and disable heavy features.

**No-JS / low-power**

* Render a static poster image, model metadata, and a link to the full model page or a downloadable `.glb`.
* That page `/cad/:id` can server-render the images + download links.

---

# Micro-interactions & polish

* Cartridge hover: translateY(-6px), subtle shadow.
* Cartridge select: 60–120ms pulse + TV bezel LED flash.
* Screen load: Poster fades out (80ms), spinner, then viewer fades in (160ms).
* “Now playing” label: typewriter-like fade for model title.
* Scanlines: CSS repeating-linear-gradient; disabled for reduced-motion.

---

# Analytics & instrumentation

Track lightweight events:

* `cad_cartridge_hover` (id)
* `cad_cartridge_select` (id)
* `cad_model_loaded` (id, lod: preview/full, loadTime)
* `cad_viewer_fullscreen` (id)
* `cad_download_model` (id)

Use privacy-respecting analytics (Plausible) if you want.

---

# Build order (practical, incremental)

**Phase 1 — MVP**

1. Static CRT frame + poster image + cartridge row UI (no 3D).
2. InfoPanel showing metadata from JSON.
3. Cartridge click toggles poster content and swaps the model name in the bezel slot.
4. Basic accessibility + keyboard focus.

**Phase 2 — Basic 3D**
5. Add `ModelViewer` as dynamic import; load a small preview `.glb` on click.
6. Implement `preview` poster → spinner → model fade-in lifecycle.
7. Add orbit controls with limited angles and reset.

**Phase 3 — Polishing**
8. Add `full.glb` loading on fullscreen; implement LOD switching.
9. Implement prefetch on hover and caching strategies.
10. Add model disposal and rigorous memory cleanup; test in Vercel dev/staging.

**Phase 4 — Advanced**
11. Add analytics, download links, and advanced viewer tools (measurements, isolate part).
12. Add offline-friendly assets and CDN optimizations.

---

# Small code patterns / snippets (pseudo)

**Dynamic import (Next.js)**

```js
const ModelViewer = dynamic(() => import('./ModelViewer'), { ssr: false, loading: () => <PosterSpinner/> });
```

**Three.js cleanup (inside ModelViewer)**

```js
useEffect(() => {
  return () => {
    // traverse scene
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material?.dispose();
      }
      if (obj.texture) obj.texture?.dispose();
    });
    renderer?.dispose();
    // optional: renderer.forceContextLoss();
  };
}, []);
```

**Prefetch on hover**

```js
function onHoverPrefetch(id) {
  if (navigator.connection && navigator.connection.saveData) return;
  fetch(`/cad/${id}-preview.glb`, { method: 'HEAD', mode: 'no-cors' }); // gentle prefetch hint
}
```

---

# Final checklist (before you implement)

* Provide 2 LODs per model (preview + full) with Draco compression.
* Ensure `ModelViewer` is dynamic with SSR disabled.
* Only one heavy component mounted at a time; unmount & dispose on close.
* Use poster images and skeletons for instant feedback.
* Preload thumbnails on hover with save-data checks.
* Test on low-end devices and mobile; ensure graceful fallback.