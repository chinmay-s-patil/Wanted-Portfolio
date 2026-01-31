# Rules for kicker → title → description (and the Back button)

## Layout & placement

* Place the **kicker** above the title, the **title** next, and the **description** below the title — always grouped in the same order and alignment.
* Put this whole group in the **side rail** (recommended) or in a consistent corner of the screen. The side rail width should be consistent site-wide (recommended: `320px`).
* The **Back** button sits above the kicker at the top of the rail (left/top aligned), visually separate by 24–28px from the kicker block.

## Visual hierarchy (type + sizes)

Use a tight, consistent scale so the eye reads quickly.

Recommended sizes (desktop; use `rem` units):

* Kicker: `font-size: 0.875rem` (14px) — uppercase or small caps, letter-spacing `0.12em`, weight `600`.
* Title: `font-size: 1.75rem` (28px) — bold/extra-bold, tight leading (`1.05`).
* Description: `font-size: 1rem` (16px) — regular-medium, line-height `1.5`.

For smaller screens:

* Kicker: `13px`
* Title: `20px`
* Description: `15px`

## Typography choices

* Title font (display): a condensed geometric or slab (e.g., **Orbitron**, **Archivo Black**, or bold **Inter**) — keep it consistent across pages.
* Kicker font: same family as body but small-caps or uppercase (Manrope/Inter with `font-variant: small-caps` if desired).
* Description font: humanist sans (Inter, Manrope, or system sans).
* Use a monospace (`Roboto Mono`) for small metadata stamps if needed.

## Color & contrast

* Side-rail background: slightly desaturated / darker than main content (e.g., `#08101a` or `rgba(5,6,12,0.8)`), or use translucent paper texture.
* Title color: bright/off-white — `#EAF2FF` (or #fff on dark). Contrast >= 4.5:1.
* Kicker color: muted accent — `#94a3b8` (or 60–70% opacity white).
* Description color: `#cbd5e1` / `#bfcfe0`.
* Back button text: same as kicker or a bit brighter. Use clear hover/active states.

## Spacing & rhythm

* Vertical spacing inside the group:

  * Back button → kicker: `24px`
  * Kicker → title: `8–12px`
  * Title → description: `10–16px`
* Padding inside side rail: `24px` (keep consistent).
* Keep title baseline aligned to a grid (4px or 8px).

## Back button — copy & behavior

* Label: **“← Back to office”** (arrow glyph + text).
* Visuals:

  * Small capsule button: padding `8px 12px`, border-radius `999px`.
  * Background: semi-transparent (e.g., `rgba(255,255,255,0.06)`), border `1px solid rgba(255,255,255,0.06)`.
  * Hover: brighten background, add subtle lift (`transform: translateY(-2px)`).
* Position: top-left of the side rail; it should never overlap the title group.
* Behavior:

  * Default: navigates back to hub (or previous route).
  * If deep-linked from another route, it should go back in history; otherwise go to hub (`/`).
  * On click, run one short UI animation (fade out or slide the rail left) before navigation, if you want polish.
* Accessibility:

  * `role="button"` (native `<button>` preferred)
  * `aria-label="Back to office"`
  * Keyboard focusable and visible focus ring.

## Interaction & animation rules

* Keep animations short and consistent:

  * Focus/hover lift: `transform` + `box-shadow` 140ms, easing `cubic-bezier(.2,.9,.13,1)`.
  * Title reveal (when entering a section): subtle fade + translateY `120–200ms`.
  * Back button press: quick compress `scale(0.98)` 80ms.
* Always respect `prefers-reduced-motion` — swap animations for instant visibility.

## Behavior & content rules

* Kicker must be short (1–4 words). Use it as the context or category: `EXPERIENCE`, `PROJECTS`, `OPENFOAM`.
* Title should be concise and descriptive — limit to one line if possible (use `text-overflow: ellipsis` when necessary).
* Description should be 1–3 short sentences — *what* this section contains and *why* it matters. Keep it scan-friendly (bullets allowed).
* Metadata (dates, tools) should be rendered separately as small tags below description if needed.
* Avoid decorative elements that collide with blurred or animated backgrounds — use side rail so visuals don’t occlude text.

## Responsiveness

* On narrow screens (mobile) the side rail collapses to a top band or becomes a sticky header:

  * Collapsed height: `64px` with an icon-only back button and hidden kicker by default (expand to view).
* Title scaling: clamp font-size between `1.25rem` and `1.9rem` with `clamp()`.

## Accessibility checklist

* All text must meet contrast ratio (AA) against its background.
* Logical heading order: kicker can be visually above but semantically kicker = small text / `p`, title = `h1`/`h2` depending on page, description = `p`.
* Provide `aria-labelledby` where a region needs to be announced: e.g., `<section aria-labelledby="section-title">`.
* Back button must be keyboard accessible and announce action to screen readers.

---

# Design tokens (suggested CSS variables)

```css
:root{
  --rail-width: 320px;
  --rail-padding: 24px;
  --color-bg-rail: #07101a;
  --color-title: #EAF2FF;
  --color-kicker: #94a3b8;
  --color-desc: #bfcfe0;
  --accent: #00E0FF;
  --transition: cubic-bezier(.2,.9,.13,1);
}
```

---

# Example CSS (minimal)

```css
.side-rail {
  width: var(--rail-width);
  padding: var(--rail-padding);
  background: var(--color-bg-rail);
  color: var(--color-title);
  display:flex; flex-direction:column; gap:12px;
}

.back-btn {
  display:inline-flex; align-items:center; gap:8px;
  padding:8px 12px; border-radius:999px;
  border:1px solid rgba(255,255,255,0.06);
  background: transparent;
  color: var(--color-title);
  cursor:pointer; transition: transform .14s var(--transition), background .12s;
}
.back-btn:focus { outline: 3px solid rgba(0,224,255,0.12); }
.back-btn:hover { transform: translateY(-2px); background: rgba(255,255,255,0.03); }

.kicker {
  font-size: .875rem; font-weight:600;
  color: var(--color-kicker); letter-spacing:.12em; text-transform:uppercase;
}

.title {
  font-size: 1.75rem; font-weight:800; line-height:1.05;
  color: var(--color-title); margin-top:4px;
  /* ensure long titles don't overflow rail */
  max-width:100%; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;
}

.description {
  font-size: 1rem; color:var(--color-desc); line-height:1.5;
  margin-top:6px;
}
```

---

# Tiny React component (structure & props)

```jsx
function SectionHeader({ kicker, title, description, onBack }) {
  return (
    <aside className="side-rail" role="complementary" aria-labelledby="section-title">
      <button className="back-btn" aria-label="Back to office" onClick={onBack}>
        ← Back to office
      </button>

      {kicker && <div className="kicker">{kicker}</div>}

      <h1 id="section-title" className="title">{title}</h1>

      {description && <p className="description">{description}</p>}
    </aside>
  );
}
```

Props & semantics:

* `kicker` (string) — small uppercase category text
* `title` (string) — main section heading (required)
* `description` (string) — short explanatory paragraph (optional)
* `onBack` (function) — handler that navigates back to hub or previous page

---

# Example copy (how to phrase things)

* Kicker: `OPENFOAM`
* Title: `Propeller Aeroacoustics Study`
* Description: `Hybrid LES-RANS simulations to isolate tonal noise sources. Click to view frames, results, and the reproducible scripts.`

Or for diary:

* Kicker: `EXPERIENCE`
* Title: `CFD Research Intern — XYZ Lab`
* Description: `Built an automated OpenFOAM pipeline; reduced simulation setup time by 40%. Read notes and key insights.`

---

# Final quick checklist before you apply

* [ ] Side rail fixed width on all pages (desktop).
* [ ] Back button always top & same label: **← Back to office**.
* [ ] Kicker, Title, Description order is identical everywhere.
* [ ] Font sizes and spacing follow the rules above (test on at least 1366×768 and 1920×1080).
* [ ] All tappable elements at least 44px.
* [ ] `prefers-reduced-motion` and keyboard nav implemented.