---
name: fikra-lesson
description: Build a light « Le concept en main · الفكرة بين يديك » lesson (one HTML file, SVG, FR + AR) in 7 moments from the tested template, then validate it with the flow test.
---

# Le concept en main · الفكرة بين يديك

You build ONE light interactive lesson for a Moroccan collège student (1AC, 2AC, 3AC), in maths, physique-chimie or SVT. The student predicts, manipulates a live model computed from the real equations, names the rule, sees why, practises on generated exercises that diagnose the type of error, then checks. About 15 minutes on a phone.

Files (GitHub `itech327/my`, branch `skills`, folder `skills/fikra-lesson/`):

- `template/lesson-template.html`: the engine, the style and a small valid example lesson (perimeter of a circle).
- `examples/energie-lesson-block.js` and `examples/pc-3ac-energie-cinetique.html`: a full lesson (kinetic energy and stopping distance, 3AC).
- `tools/build_lesson.py`: `new LESSON_BLOCK.js OUT.html` builds a lesson from the template; `sync LESSON.html` refreshes its engine and style; `bundle LESSON.html OUT.html` inlines every `audio/*.mp3` as a data URI, giving one standalone file to send.
- `spec/fikra-spec.js`, `tools/build_spec.py`, `examples/specs/*.json`: the second route, a lesson from a JSON spec with no code (section 2b).
- `tools/build_atelier.py` and `spec/atelier-src.html`: the teacher atelier, one HTML page to fill a spec, check it and preview the lesson.
- `tools/flow_test.py`: the test every lesson must pass before delivery.

Use the 3D skill `pop-up-3d-lesson` instead only when the concept is spatial or needs several modes.

## 1. Prepare the lesson before writing code

1. **The lesson**: from the official programme and its distribution. Anything beyond it carries the tag `APPRO` (Approfondissement · تعمّق).
2. **The concept map**: the rule, its properties, its special cases.
3. **Misconceptions**: at least three common errors, each with a short code, a French sentence and an Arabic sentence. They drive everything else.
4. **Prediction and check questions**: same type, different numbers or context. Exactly one right option; every wrong option carries the code of the misconception it reveals.
5. **The experiment**: one live model, 2 to 4 values with units, 2 or 3 missions that force the comparison the rule is about. At least one mission is required to continue.
6. **Exercises**: 3 levels. Each `make(R)` returns `{ q, unit, ans, digits, traps }`. Each trap is `[value, code]`: the value a student gets when making that error.

Texts, numbers and drawings are original. Never copy from textbooks, the Riyada Drive slides or other sites.

## 2. Write the LESSON block

Copy `template/lesson-template.html`'s LESSON block into a `.js` file and replace the example. Only that block changes; never edit STYLE or ENGINE in a lesson.

```
const LESSON = {
  meta: { kicker, title, titleAr, short, classes: ['3APIC'], footer },
  misconceptions: { code: { fr, ar }, … },
  hook: { title, svg, text, ar },                // 1 · the puzzling question
  predict: [ { q, ar, options: [[label, code], …] } ],   // 2 · code '' = the right option
  experiment: { title, intro, html, missions: [{ id, text }], required: [id], note, mount(root, api) },  // 3
  rule: { blocks: [{ formula, text, ar }], seen },        // 4
  proof: { title, html, ar },                             // 5 · hidden under a flap
  exercises: { levels: [{ label, make(R) }] },            // 6 · R.int(a, b, step), R.pick(list), R.nf(x, digits)
  check: [ same shape as predict ]                         // 7 · then the report
};
```

- `mount(root, api)` draws the experiment inside `root` and calls `api.done(id)` when a mission is met. `api.nf` formats numbers with a decimal comma, `api.reduce` says whether to skip animations.
- Every value shown in the experiment is computed from the equation each time an input changes. Nothing pre-animated.
- Arabic strings are plain text. The engine wraps Latin and numeric expressions in `<bdi dir="ltr">` so A', 50 km/h or 7² = 5² + 6² keep their order and stay on one line. `api.iso(text)` returns HTML: insert it with `innerHTML`.
- A figure whose size changes with the inputs computes its own bounding box from its points and sets the SVG `viewBox`; `getBBox()` returns zero while the moment is still hidden.
- Units: SI in physics, with conversions shown (km/h ÷ 3,6). Decimal comma.
- No student name anywhere. The report uses an optional class code only.

- Optional Darija voice: add `audio: 'audio/NAME.mp3'` and `audioText` (the spoken Darija text) to `hook` and `rule`. The engine shows a play button. Keep each clip mono, 22050 Hz, about 40 kb/s, under 400 KB; the flow test checks the file exists and its size.

## 2b. Or write a JSON spec, when a library widget fits

Prefer this route when the experiment is sliders with computed values (`curseurs`) or a curve with a moving point (`graphe`). It is faster, it contains no code, and a teacher can edit it in the atelier.

- Copy one of `examples/specs/*.json` and replace everything. Same seven moments, same rules as section 1.
- `experiment.widget` and its `params`: `inputs` (sliders), `outputs` (computed with `expr`), `bars` for `curseurs`, `curve` for `graphe`.
- Missions: `{ type: 'valeurs', input, values, when? }` or `{ type: 'condition', expr }`.
- Exercises: `vars` as `[name, 'int a b step' | 'pick v1 v2 …' | expression]`, `q` with `{x}` or `{x:0}`, `answer` and `traps` as expressions.
- Expressions accept numbers, declared names, `+ - * / ^`, comparisons, `&& ||`, and `sqrt abs round floor ceil min max pow pi`. No `**`, no code: the adapter refuses it.
- Texts are plain, never HTML; the adapter escapes them. `hook.svg` is not available on this route.
- Build: `python3 tools/build_spec.py my-spec.json my-lesson.html`, then the same flow test.
- A widget that is missing (tubes and reagent plate, moving geometric figure, circuit) goes into `spec/fikra-spec.js`, tested, before any lesson uses it. Otherwise use section 2.
- Teacher atelier: `python3 tools/build_atelier.py atelier.html [SPECS_DIR] [AUDIO_BASE_DIR]`. The service endpoints `AI_ENDPOINT` and `VOICE_ENDPOINT` stay empty until the platform server exists; `spec/prompt-ia.md` holds the instructions for that service.

## 3. Build and test

```
python3 tools/build_lesson.py new my-lesson.js my-lesson.html
python3 tools/flow_test.py my-lesson.html --shots shots/ --n 80
```

The engine validates the lesson at load and shows a red box listing problems. The flow test fails on any of them:

- a question with zero or two right options, or a code missing from `misconceptions`;
- a mission listed as required that does not exist;
- an exercise whose answer is not a number, a trap equal to the right answer, or two traps with the same value (300 draws per level);
- a gate that opens too early or never, a proof flap that does not open, a wrong prediction without its misconception text;
- a trap value not diagnosed as its own misconception, a right answer refused;
- no report after the checks, any page error, horizontal overflow at 420 px, a file over 150 KB.
- an answer given away before its time: a verdict or misconception on screen before the prediction, the proof readable by a screen reader or visible around the flap before it is lifted, an exercise answer printed in its own question;
- a report that counts an answer given after a misconception message as unassisted: only first tries count « du premier coup »;
- any text below 4.5:1 contrast (3:1 for large text), in light AND dark mode. Coloured text uses the text-safe variables `--glow-text` and `--heat-text`, never `--glow` or `--heat`, which are for fills.

Also write a short Node script that recomputes the experiment's key numbers (for example 96,5 kJ and 385,8 kJ for 1000 kg at 50 and 100 km/h) and compare them with the screenshots.

When the template's engine changes, run `build_lesson.py sync` on every lesson, then the flow test again.

## 4. Deliver

- The lesson HTML file, whole, as a downloadable file. If it has audio, send the `bundle` version: a lone HTML file cannot reach its `audio/` folder. Add 3 to 6 short lines in the user's language: what the lesson covers, what was tested, what was not (scientific review by a teacher, Darija voice).
- Work stays outside production: lessons go to branch `plan/modeles-pro`, folder `docs/fikra-bayna-yadayk/lecons/`, with `[skip ci]` in the commit message. Never to `lessons-site`.
- Push only with the user's explicit permission. No secrets, no Drive content, no personal data in the public repository.
