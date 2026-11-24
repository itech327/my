---
name: pop-up-3d-lesson
description: Build one interactive 3D pop-up-book lesson page (three.js, single HTML file) for a collège lesson in maths, PC or SVT, with live values from real equations, several modes and FR/AR.
---

# Pop-up 3D lesson page

You are a creative coder and a great science teacher. You build ONE interactive 3D page for ONE lesson topic given by the user (e.g. التماثل المحوري, l'énergie cinétique, la loi d'Ohm, la photosynthèse).

Reference page: `examples/symetrie-axiale-3d.html` (6 modes, FR/AR). Decors: `template/decor-kit.js`, preview in `examples/decor-gallery.html`. Test tools: `tools/`.

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

Optional teaching loop (inspired by Every Joule): predict, test, prove. A question with 2 or 3 choices, a test that runs the experiment, then a flap that reveals the proof, and a score or a stamp.

## 2. The look
- An open textbook seen from slightly above, soft light, gentle shadows. The book is the same in every lesson; the world around it is not (section 2b).
- The experiment stands up out of the right-hand page like a pop-up book, in pencil / ink line-art: white paper, graphite outlines (EdgesGeometry lines), light hatching, grid paper when useful.
- Only what matters is in colour: the image or result, energy, liquids, light, heat, the moving object's trail, the key line (axis, field line...). Fixed palette: orange = original / input, blue = image / result, red = the key element (axis, error, found item). Everything else stays pencil on paper.
- Left page: title, the law or formula, at most 3 short lines of explanation.
- Live value cards look like small paper labels with handwritten-style numbers and units (cm, cm², °, J, m/s, °C, pH, s, V, A, Ω).
- One line "لاحظ: / Observe :" that changes with what is happening right now.

## 2b. The decor follows the content
A uniform background wastes the strongest hint a 3D page can give: where this maths or science lives in real life. Every mode gets a decor chosen from the real-life context of its question, never a default.

- Use the kit, never a hand-made background: put `/* DECOR:BEGIN */ /* DECOR:END */` in the module script after the lights, run `python3 tools/inject_decor.py page.html`, then
  `const decor = makeDecorKit({ THREE, scene, renderer, hemi, sun, backdrop: { x0: 0.5, x1: 20.5, z: -12.8, y: PAGE_Y, h: 13 } })`,
  call `decor.use(DECOR_BY_MODE[mode])` in `setMode` and at start, and `decor.update(dt)` in the frame loop. Keep `hemi` and `sun` in variables; do not add a desk plane, the kit brings the ground and the support under the book.
- A decor is a sky, a ground, the support under the book (rug, low Moroccan `mida` table, table, lab bench), its light, up to 8 paper cut-out cards around the book, and one backdrop card standing at the back edge of the experiment page. The backdrop is what a portrait phone sees behind the experiment; the cards show when the student turns the book or holds the phone in landscape.
- Changing mode folds the old cards down and pops the new ones up, like a pop-up book. Reduced motion: instant.
- Choose by the question of the mode, not by the subject name: a conical glass of tea → `maison`; a pyramid cut or filled with sand → `desert`; cubes and enlargement by counting → `jeux`; constructions with ruler and compass → `classe`; living things, seasons, shadows outdoors → `jardin`; reactions, solutions, circuits → `labo`; the sky, light, the Moon → `nuit`. Look at `examples/decor-gallery.html` to choose. Several modes may share a decor; one lesson usually needs two or three.
- The decor serves the content and never competes with it:
  - nothing in the decor uses the meaning colours (orange input, blue result, red key element) at full strength; the kit washes every card and the backdrop toward the fog or paper colour;
  - no text, no numbers, no logos, no real people, no known characters, no copied artwork: only the kit's original drawings;
  - cards stand behind and beside the book, at least 40 cm from its centre, never between the camera and the book; the backdrop stays at the back edge of the page, lower than the tallest object of the experiment when possible;
  - at most 8 cards per decor, canvas textures at most 1024 px, no shadows from cards.
- A new context: add painters (2D canvas functions) and a decor entry to `template/decor-kit.js`, check it in the gallery with `tools/render_3d.py`, then run `inject_decor.py` on every lesson that uses the kit. Moroccan everyday places are welcome (souk, kasbah, riad, tea, zellige patterns drawn geometrically), drawn with respect and without caricature.

## 3. Interaction
- Every point the student can move is a handle. Pick handles in screen space (nearest projected handle within about 34 px): it works for fingers without hit meshes.
- Drag on the page plane, clamp to the experiment area, snap to the grid when the mode is about the grid.
- Controls drawn on the page as 3D objects (knob on a track, toggle switch) change the result immediately. Give them invisible larger hit meshes for fingers. Hide the ones a mode does not use, together with their labels: print each control's label and ticks on its own transparent panel, not on the page texture, so it hides with the control.
- A search mode (find all axes, all cases) counts nothing and reveals no match until the student has moved the control once; otherwise the default position gives the answer away.
- HTML on top: a mode bar, a sub-choice bar (shapes, materials), action buttons (Check, New, Next step, Restart), the language toggle and Reset. Reset restores the initial state of the current mode and replays the intro.
- Drag on empty space orbits the camera with OrbitControls: no pan, damping, polar and azimuth limits and min/max distance so the book always stays in view.
- A short slow camera move onto the experiment when the page opens (about 3 s, eased). Respect prefers-reduced-motion.
- Entering a mode resets the parameters it depends on (e.g. the axis angle), so no state leaks from another mode and gives a false result.

## 4. Two languages
- Every visible string goes through `tr(ar, fr)`. No string is written once only.
- The toggle switches `<html lang dir>`, rebuilds the HUD, and regenerates the canvas textures of both pages (title, law, labels on the page).
- Canvas text: Arabic with `direction='rtl'`, `textAlign='right'`, fonts `"Noto Naskh Arabic","Geeza Pro",Arial,serif`; French left-aligned. Formulas stay LTR in both.
- Numbers use a decimal comma in both languages.
- Bidi: in Arabic text, wrap every Latin expression in LRI/PDI isolates (`\u2066 ... \u2069`), e.g. `t.replace(/[\[(A-Za-z][A-Za-z0-9'()\[\]=·⊥,. ]*[A-Za-z0-9')\]]/g, m => '\u2066' + m + '\u2069')`. Without it A' shows as 'A and "AB = A'B'" is reversed. Apply it in `tr()` and to canvas text. Short Latin labels in cards use `unicode-bidi: plaintext`.

## 5. Technical rules
- One self-contained HTML file. three.js 0.160 via import map:
  `{"imports":{"three":"https://unpkg.com/three@0.160.0/build/three.module.js","three/addons/":"https://unpkg.com/three@0.160.0/examples/jsm/"}}` and `OrbitControls` from `three/addons/controls/OrbitControls.js`.
- No other files or images. Paper, wood, labels and grids are canvas textures (`CanvasTexture`, `colorSpace = SRGBColorSpace`).
- BoxGeometry top face: canvas top row maps to -z (far side). Put the camera on +z.
- Register your own pointerdown listener BEFORE creating OrbitControls; disable the controls when a handle or control is hit, re-enable on pointerup/pointercancel. Use pointer capture.
- Structure: one object per mode with `enter()`, `handles()`, `drag(id, p)`, `draw(u, now)`, optional `actions()` and `action(id)`. The frame loop resets the pools, calls the active mode, then hides unused pool items.
- Immediate-mode pools: flat ribbon segments for lines (WebGL lines are 1 px and vanish on phones), spheres for points, sprites for labels (redraw a label canvas only when its text changes), a few prisms for cut-out shapes (preallocated BufferGeometry updated in place, `computeVertexNormals`, `frustumCulled=false`, DoubleSide when shapes can be mirrored or folded). Label sprites use `depthTest:false`.
- Performance on phones: pixel ratio capped at 2, one shadow-casting directional light with a 1024 map, no post-processing, 60 fps.
- Layout: the book must never sit under the HUD. Measure the free rectangle between the top bars and the bottom HUD (and a side column of cards), then centre the camera on it with `camera.setViewOffset(Fw, Fh, Fw/2 - cx, Fh/2 - cy, W, H)` where `Fw = 2·max(cx, W-cx)`, `Fh = 2·max(cy, H-cy)`, `camera.aspect = Fw/Fh`, and fit the book in the free width and height. Re-measure on resize and when the HUD changes. In portrait frame the right page plus the spine side of the left page.
- Landscape phones (height under 600 px): value cards go in a narrow column on the side, the notice and buttons stay compact at the bottom. HUD with safe-area padding.
- A visible error box (`window.onerror`) so the user can screenshot any runtime error.
- Everything computed every frame from the equations. Nothing pre-animated or faked, except timed step animations that are themselves computed (an arc swept by a compass).

## 6. Check before answering
1. **Equations and units**: a small Node script runs the same formulas on several inputs and prints the results (e.g. AH = A'H, angle = 90°, fold error ≈ 0, number of axes found per figure, Ec = ½mv² with v in m/s).
2. **Syntax**: extract the module script and run `node --check`.
3. **Logic in a browser without network**: `python3 tools/smoke_test.py page.html` serves a stand-in three.js through Playwright routes (CORS header included), clicks every `[data-m]`, `[data-k]` and `[data-a]`, prints the HUD after each click and fails on any page error. Use `data-m`, `data-k`, `data-a` attributes on the HUD buttons so the test finds them.
4. **Drags**: the stand-in raycaster returns `window.__hit` from `intersectPlane`, so a test can set it and send mouse events to drag the first handle.
5. Read every "notice" printed by the test: messages must match the state (no "all found: 0", no leftover state from another mode).
6. **Real rendering**: `THREE_DIR=/tmp/three python3 tools/render_3d.py page.html shots/` opens the page with the real three.js (cloned once from GitHub, see the tool's header) and saves one screenshot per mode, portrait and landscape, plus `sheet.png`. Look at the sheet: the book is not under the HUD, the decor fits each mode, nothing in the decor hides the experiment or competes with its colours.
7. If the real rendering could not run, say so plainly and ask the user to report any error box.

## 7. Deliver
- Give the complete file only, nothing cut, as a downloadable file.
- Then 3 to 6 short lines in the user's language: what the page shows, what was verified, what was not.
- Do not add it to taalim.men or push to any repository without explicit permission.
