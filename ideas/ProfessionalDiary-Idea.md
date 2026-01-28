# Section Concept: **Professional Diary**

This is not a timeline.
This is a **personal field notebook** documenting your engineering life.

The user is not “reading experience” — they’re **flipping through entries**.

> “These are dated notes from real work.”

---

## 1. High-level mental model (for the user)

> “I’m opening someone’s work diary. Each page is a job, internship, or role.”

This immediately:

* Feels authentic
* Avoids corporate résumé vibes
* Justifies text-heavy content
* Works brilliantly with your Wanted Poster → Investigation flow

---

## 2. Entry Point (from hub)

From the hub, clicking **PROFESSIONAL DIARY**:

* A leather-bound notebook slides into view
* Opens to the **most recent entry**
* Old paper texture, soft shadows, muted ink colors

No animation longer than ~200ms.

---

## 3. Visual Design (open diary view)

### Overall Layout

* Two-page open notebook
* Slight center crease
* Off-white paper texture
* Ink-like typography

```
┌───────────────┬───────────────┐
│ LEFT PAGE     │ RIGHT PAGE    │
│ Context       │ Daily Notes   │
│ (role info)   │ (what you did)│
└───────────────┴───────────────┘
```

---

## 4. Left Page: **Entry Metadata (Context Page)**

This page is structured, calm, and scannable.

### Content

* Company / Organization name (large)
* Role title
* Location
* Date range (clearly visible)
* Small stamped tag:

  * `INTERNSHIP`
  * `RESEARCH`
  * `FULL-TIME`
* One-sentence summary of the role

Example:

```
ORGANIZATION: XYZ Research Lab
ROLE: CFD Research Intern
LOCATION: Munich, DE
DATES: Jun 2023 — Sep 2023

FOCUS:
Simulation pipeline development for thermal flows
```

Optional extras:

* Tools used (small handwritten-style tags)
* Supervisor / team size (tiny text)

---

## 5. Right Page: **Diary Notes (The Soul)**

This is where the section shines.

### Format

* Short bullet-like paragraphs
* Written as observations, not résumé bullets
* Timestamp-like markers optional (fake but subtle)

Example:

```
— Built automated OpenFOAM case setups
— Reduced run times by ~30% via mesh tuning
— Wrote Python scripts for post-processing
— Learned the cost of bad boundary conditions
```

Optional:

* A “Key Insight” box at the bottom:

  ```
  NOTE:
  Automation matters more than solver tweaks.
  ```

Keep this human and reflective.

---

## 6. Navigation Between Entries

### Controls

* Bottom-right: `NEXT ENTRY →`
* Bottom-left: `← PREVIOUS ENTRY`
* Top-right: `CLOSE DIARY`

### Interaction

* Clicking next/prev flips the page (simple fade + slide)
* No real page curl needed (keep it cheap)

Keyboard:

* ← → to navigate
* Esc to close

---

## 7. Locked / Future Entry (PhD tease)

Brilliant place for humor.

When user reaches a future entry:

* Page is blank or lightly scribbled
* Big handwritten text:

  ```
  THIS CHAPTER IS YET TO BE WRITTEN.
  ```
* Subtext:

  ```
  (PhD ideas brewing.)
  ```

Visually faded, with a small lock icon watermark.

---

## 8. Content Model (JSON-based, clean)

```json
{
  "id": "cfd-intern-2023",
  "organization": "XYZ Research Lab",
  "role": "CFD Research Intern",
  "location": "Munich, Germany",
  "type": "Internship",
  "dates": {
    "start": "2023-06",
    "end": "2023-09"
  },
  "summary": "Worked on simulation pipelines for thermal flow analysis.",
  "tools": ["OpenFOAM", "Python", "ParaView"],
  "notes": [
    "Built automated OpenFOAM case setups",
    "Reduced run times by ~30% via mesh tuning",
    "Developed Python post-processing tools",
    "Learned practical tradeoffs in boundary conditions"
  ],
  "insight": "Automation matters more than solver tweaks."
}
```

This keeps rendering logic dead simple.

---

## 9. Technical Architecture (React / Next)

### Components

```
<DiaryLevel>
 ├─ <DiaryBook>
 │   ├─ <LeftPage />
 │   ├─ <RightPage />
 │   └─ <DiaryNav />
```

### State

```ts
currentEntryIndex: number
```

### Transitions

* Use CSS `opacity + translateX`
* Respect `prefers-reduced-motion`

### Lazy Loading

* Diary data loads immediately (lightweight JSON)
* No heavy media
* Optional photos load only when visible

---

## 10. Performance & Safety

* No images required
* No canvas
* No 3D
* No video
* Extremely low memory footprint

This section is **OOM-proof**.

---

## 11. Accessibility

* Each page is a `<section>`
* Headings use proper `<h2>` hierarchy
* Navigation buttons have aria-labels
* Keyboard navigation supported
* Text contrast checked against paper texture

---

## 12. Tone Guidelines (important)

Avoid:

* Corporate résumé bullet language
* Buzzwords
* Overlong paragraphs

Prefer:

* Observations
* Outcomes
* Small reflections

This makes you stand out as **thoughtful**, not just skilled.

---

## 13. Build Order (1 evening build)

1. Static diary layout (two columns)
2. Render one entry
3. Add next/prev navigation
4. Add locked future entry
5. Polish typography & spacing

You can ship this before other sections are finished.

---

## 14. Why this section works

* Feels personal without being unprofessional
* Encourages reading
* Recruiters spend time here
* Works beautifully with your Wanted Poster landing
* Fits the detective archive theme seamlessly