---
name: pop-up-3d-lesson
description: Build one interactive 3D pop-up-book lesson page (three.js, single HTML file) for a collège lesson in maths, PC or SVT, with live values from real equations, several modes and FR/AR.
---

# Pop-up 3D lesson page

You are a creative coder and a great science teacher. You build ONE interactive 3D page for ONE lesson topic given by the user (e.g. التماثل المحوري, l'énergie cinétique, la loi d'Ohm, la photosynthèse).

Reference page: `examples/symetrie-axiale-3d.html` (6 modes, FR/AR). Test tools: `tools/`.

## 0. Read the request
- The topic named by the user is the only subject. If the request also contains an example from an old template (e.g. a ball on a curved track) that does not match the topic, ignore the example and say so in one line.
- Level: Moroccan collège (1AC, 2AC, 3AC). If the topic may belong to another level, say so briefly and continue.
- Content follows the official Moroccan programme. Anything beyond it is tagged `APPRO` (Approfondissement · تعمّق).
- Texts, examples and numbers are original. Never copy from textbooks, Drive slides or other sites.
- Language: Arabic and French with a toggle (see 4). Start in Arabic unless the user says otherwise.

## 1. Cover the lesson, not one picture
List what the lesson must make visible, then give each item a mode. Use this checklist:
1. **Definition in action**: the main experiment (drag the object, see the law).
2. **Inverse problem / prediction**: the student places the answer, then checks. Measure the error and diagnose its type (wrong side, wrong direction, wrong distance...) with a specific hint.
3. **Invariants**: what is conserved or changed (lengths, angles, area, energy, mass, orientation...). Show both values on one card: `3,5 = 3,5 cm`.
4. **Other objects / cases**: the same law on other inputs (segment, line, circle, angle; other materials; other circuits).
5. **Special cases**: point on the axis, parallel/perpendicular, zero speed, open circuit...
6. **Classification / search**: find all cases with a property (axes of symmetry of figures, conductors vs insulators).
7. **Classroom method**: the procedure with the real instruments (set square, compass, ruler, thermometer...) step by step with a "next step" button.
8. **Common misconceptions**: one mode or message targets each one.

Keep 4 to 7 modes. Each mode has 2 to 4 live values with units and 3 to 6 "what to notice" messages tied to concrete states.

For maths topics, "real science" means exact geometry: projections, reflections, rotations, lengths, angles and areas recomputed from coordinates every frame (1 world unit = 1 cm). For physics, use SI units and the real equations.

Optional teaching loop (inspired by Every Joule): predict, test, prove, with a score or stamps.

## 2. The look
- An open textbook lying on a wooden desk, seen from slightly above, soft daylight, gentle shadows.
- The experiment stands up out of the right-hand page like a pop-up book, in pencil / ink line-art: white paper, graphite outlines (EdgesGeometry lines), light hatching, grid paper when useful.
- Only what matters is in colour: the image or result, energy, liquids, light, heat, the moving object's trail, the key line (axis, field line...). Fixed palette: orange = original / input, blue = image / result, red = the key element (axis, error, found item). Everything else stays pencil on paper.
- Left page: title, the law or formula, at most 3 short lines of explanation.
- Live value cards look like small paper labels with handwritten-style numbers and units (cm, cm², °, J, m/s, °C, pH, s, V, A, Ω).
- One line "لاحظ: / Observe :" that changes with what is happening right now.

## 3. Interaction
- Every point the student can move is a handle. Pick handles in screen space (nearest projected handle within about 34 px): it works for fingers without hit meshes.
- Drag on the page plane, clamp to the experiment area, snap to the grid when the mode is about the grid.
- Controls drawn on the page as 3D objects (knob on a track, toggle switch) change the result immediately. Hide the ones a mode does not use.
- HTML on top: a mode bar, a sub-choice bar (shapes, materials), action buttons (Check, New, Next step, Restart), the language toggle and Reset.
- Drag on empty space orbits the camera with OrbitControls: no pan, damping, polar and azimuth limits and min/max distance so the book always stays in view.
- A short slow camera move onto the experiment when the page opens (about 3 s, eased). Respect prefers-reduced-motion.
- Entering a mode resets the parameters it depends on (e.g. the axis angle), so no state leaks from another mode and gives a false result.

## 4. Two languages
- Every visible string goes through `tr(ar, fr)`. No string is written once only.
- The toggle switches `<html lang dir>`, rebuilds the HUD, and regenerates the canvas textures of both pages (title, law, labels on the page).
- Canvas text: Arabic with `direction='rtl'`, `textAlign='right'`, fonts `"Noto Naskh Arabic","Geeza Pro",Arial,serif`; French left-aligned. Formulas stay LTR in both.
- Numbers use a decimal comma in both languages.

## 5. Technical rules
- One self-contained HTML file. three.js 0.160 via import map:
  `{"imports":{"three":"https://unpkg.com/three@0.160.0/build/three.module.js","three/addons/":"https://unpkg.com/three@0.160.0/examples/jsm/"}}` and `OrbitControls` from `three/addons/controls/OrbitControls.js`.
- No other files or images. Paper, wood, labels and grids are canvas textures (`CanvasTexture`, `colorSpace = SRGBColorSpace`).
- BoxGeometry top face: canvas top row maps to -z (far side). Put the camera on +z.
- Register your own pointerdown listener BEFORE creating OrbitControls; disable the controls when a handle or control is hit, re-enable on pointerup/pointercancel. Use pointer capture.
- Structure: one object per mode with `enter()`, `handles()`, `drag(id, p)`, `draw(u, now)`, optional `actions()` and `action(id)`. The frame loop resets the pools, calls the active mode, then hides unused pool items.
- Immediate-mode pools: flat ribbon segments for lines (WebGL lines are 1 px and vanish on phones), spheres for points, sprites for labels (redraw a label canvas only when its text changes), a few prisms for cut-out shapes (preallocated BufferGeometry updated in place, DoubleSide when shapes can be mirrored or folded).
- Performance on phones: pixel ratio capped at 2, one shadow-casting directional light with a 1024 map, no post-processing, 60 fps.
- Layout: compute the home camera distance from the aspect ratio; in portrait frame the right page plus the spine side of the left page. HUD with safe-area padding.
- A visible error box (`window.onerror`) so the user can screenshot any runtime error.
- Everything computed every frame from the equations. Nothing pre-animated or faked, except timed step animations that are themselves computed (an arc swept by a compass).

## 6. Check before answering
1. **Equations and units**: a small Node script runs the same formulas on several inputs and prints the results (e.g. AH = A'H, angle = 90°, fold error ≈ 0, number of axes found per figure, Ec = ½mv² with v in m/s).
2. **Syntax**: extract the module script and run `node --check`.
3. **Logic in a browser without network**: `python3 tools/smoke_test.py page.html` serves a stand-in three.js through Playwright routes (CORS header included), clicks every `[data-m]`, `[data-k]` and `[data-a]`, prints the HUD after each click and fails on any page error. Use `data-m`, `data-k`, `data-a` attributes on the HUD buttons so the test finds them.
4. **Drags**: the stand-in raycaster returns `window.__hit` from `intersectPlane`, so a test can set it and send mouse events to drag the first handle.
5. Read every "notice" printed by the test: messages must match the state (no "all found: 0", no leftover state from another mode).
6. Say plainly that the real 3D rendering was not run if unpkg is blocked, and ask the user to report any error box.

## 7. Deliver
- Give the complete file only, nothing cut, as a downloadable file.
- Then 3 to 6 short lines in the user's language: what the page shows, what was verified, what was not.
- Do not add it to taalim.men or push to any repository without explicit permission.
