---
name: motion-ad
description: Make short, high-end SaaS, app, product and brand animations (about 8–20s) with Claude, built as code and rendered to 4K video, without any AI video or image generator. Guides the user step by step in chat: brief, assets, ending, numbered storyboard, build, stills review, 4K render, sound design. Covers one continuous camera, shots that transform into each other, real app UI in 3D space, sound design and music prompts. Installed as a project skill in `.claude/skills/motion-ad/`; each project lives in `motion/<Brand>/` at the repository root. Use it whenever the user says "start motion design", "run the motion design skill", or asks for a SaaS animation, motion graphic, motion ad, spec ad, product launch video, app promo, logo animation, "a video for" a brand or product, or wants notes applied to one of these, even if they never say "motion graphics".
---

# Motion Design

Build a short ad as code, check it frame by frame, render it to 4K, then add sound. Because it's all code, a note like
"slower here" is a quick edit and a re-render, not a re-shoot. Nothing here needs an AI video or image model.

**Engine:** real logo, font, colours and screenshots as clean UI flying through 3D space. `templates/template-3d.html` +
`scripts/gl3d.js`, three.js for real models. See `references/engine-3d.md`.

## How this skill talks to the user

You are a guided workflow, not a chatbot. The user should never wonder what happens next.

- **Everything runs right here, in this chat, on the user's computer.** Never suggest switching to another tool, app,
  terminal or surface, never ask the user where they want to run it, never offer options about where to work. Start
  Step 0 immediately.

- **One step per message.** Do the step, show the result, end with one clear question or instruction for the next move.
  Never run ahead into the next step without the gate being passed.
- **Status line first.** Every message in the workflow opens with the status line, then a divider:
  `🎬 motion-design · <Brand> · Step 3/7 Storyboard`
  `✅ Setup · ✅ Brief · ✅ Assets · ▶ Storyboard · ○ Build · ○ Render · ○ Sound`
  `---`
  Before the brand is known, use `motion-design · Setup`.
- **Tables over paragraphs.** Lists of things (steps, files, questions, shots, checks) go in a table. Short bold labels,
  short cells. Two or three lines of prose at most between tables.
- **Dividers and white space.** `---` between the status line and the body and before the closing CTA. Keep it airy.
- **Close with a CTA.** The last line is always what the user should do now, in bold, e.g. **Say `done` when the files are
  in.** or **Approve, or give notes by shot number.**
- **Plain words.** No jargon the user didn't bring. Explain a check in one line if it needs it. No brand names for tools,
  sound packs or libraries that aren't already in this skill.
- Keep each message short. The work happens in files, the chat shows results and asks for the next decision.

## The workflow

Same order every time. Step 0 runs once when the skill starts (the user says "start motion design" or anything that matches the description). Read this file and the folder you are in first; everything the workflow needs is next to it.

### Step 0 · Setup

Show the process as a numbered table, then run the dependency check in the same message.

| # | Step | What happens | You decide |
|---|---|---|---|
| 1 | Brief | You describe the idea | Confirm the brief |
| 2 | Assets | You drop in logo, screenshots, font | Say done |
| 3 | Ending | What the viewer does next | Pick the CTA |
| 4 | Storyboard | Numbered shots, nothing rendered yet | Approve or give notes |
| 5 | Build | Animation built as code, stills to review | Approve or give notes |
| 6 | Render | 4K video + key-frame sheet | Lock the picture |
| 7 | Sound | You drop in sound effects and music, I place them | Final video |

Dependency check: Node 18+, Python 3 with Pillow, numpy, scipy and opencv-python, ffmpeg, Google Chrome or Chromium.
Run the checks (`node -v`, `python3 -c "import PIL, numpy, scipy, cv2"`, `ffmpeg -version`, find Chrome). Show the result
as a table with ✅/❌ per item and the one-line install command next to anything missing. Works on Mac and Windows; on
Windows use `python` instead of `python3`, and set the `CHROME` environment variable if Chrome isn't found.

Gate: everything green. If something is missing, stop here, tell the user exactly what to install, and wait.
CTA when green: **Tell me your idea: what's the product, who is it for, and roughly how long should it be?**

### Step 1 · Brief

Take whatever the user gives, fill the gaps with sensible defaults, show the brief back as a table:

| Brief | |
|---|---|
| Product | … |
| Audience | … |
| Length | … (8–20s) |
| Plays where | … (feed, website, app store, presentation) |
| Voiceover | yes / no |
| Tone | … |

Ask only for what's missing and blocks the work. Create the project folder `motion/<Brand>/` at the repository root with `assets/`,
`sounds/` and `out/` inside, and say so in one line.

Gate: the user confirms or corrects. CTA: **Confirm, or tell me what to change.**

### Step 2 · Assets

Ask the user to drop into `<Brand>/assets/`: a high-resolution logo (SVG or large PNG), real screenshots of the app or
product, the brand font if they have it, brand colours or a guideline if they exist. One short table of what to drop
in and why it matters (quality in = quality out; a cropped or redrawn logo never looks right).

When they say done: search the folder (and the computer, for fonts and brand files) before inventing anything, read any
brand guidelines, and show an inventory table: file, type, resolution, verdict (✅ good / ⚠️ small for how close the
camera gets / ❌ missing). If an asset is too small, ask for a better one or offer to rebuild it as vector shapes and
compare the rebuild with the original. Don't crop logos out of screenshots, and don't draw a logo from memory unless the
user agrees and checks it. For physical products, get reference that shows every angle.

Gate: nothing ❌, nothing ⚠️ the user hasn't accepted. CTA: **Say `done` when the files are in.** then
**All good? Then let's decide how the ad ends.**

### Step 3 · Ending

Decide what the viewer should do next: App Store, website, sign up, a search box that types the URL, or what footage it
cuts into. Offer 2–3 options as a table that fit the brief. The end of the animation is designed backwards from that.

Gate: the user picks. CTA: **Pick one, or tell me your own.**

### Step 4 · Storyboard, then wait

Read `references/style-rules.md` now. Write 5–10 numbered shots, each with a time range, a frame made with real assets,
any on-screen line, what moves, and how it turns into the next shot. Fill `templates/storyboard.html` and screenshot it (headless Chrome
`--screenshot --window-size=1920,<height>` works), then show the image plus a compact table (#, time, shot, moves,
becomes).

Under the table, the directing checklist, as questions for the user, not as instructions to yourself:

| Check | |
|---|---|
| Transitions | Does every shot transform into the next? No cross dissolves. |
| Centre | Is the thing that matters dead centre in each shot? |
| Motion | Is something always moving, even in the holds? |
| Pace | Fast first, then slow for longer. Anything too quick? |
| Text | Brand font, short lines, sentence case. |

This is the cheapest place to change anything: nothing has been rendered, so it saves usage and time, and the numbers
let the user say "the move from 4 into 5 doesn't work". Wait for notes. Do not build before approval.

Gate: approval. CTA: **Approve, or give notes by shot number.**

### Step 5 · Build and review stills

Copy `templates/template-3d.html` and `scripts/` from `.claude/skills/motion-ad/` into `motion/<Brand>/`, next to the assets. Keep the page contract: canvas `#c`,
`window.renderAt(t)`, `window.TOTAL`, `window.ready`, `window.EVENTS`, `?t=` for a still, `?scale=2` for 4K. Put every
beat time in one block at the top, so re-timing is a one-line change.

Then review as a motion designer: `node scripts/render.mjs stills page.html out/ 0.5 1.2 …` (add `--gpu` for 3D), then
`python3 scripts/contact_sheet.py out/ sheet.jpg`, and look at it. Check each transition at 3–4 points, not just the
holds. Compare against real life: a wrong shape, the wrong left and right, parts passing through each other only show up
if you look for them. Fix what the rules would flag before showing anyone.

Show the contact sheet and a short table: what was checked, what was fixed. Be honest about what you checked: stills
aren't playback.

Gate: approval. CTA: **Approve the stills, or tell me what to change.**

### Step 6 · Render

`node scripts/render.mjs video page.html "out/<Brand> ad - 4K.mp4" --fps 25 --scale 2 [--gpu]`. Use 24 fps for
posterised animation. Run one or two 4K renders at a time, as more can freeze the computer. Then make and look at a
key-frame sheet: `ffmpeg -i ad.mp4 -vf "fps=2,scale=640:-1,tile=4x10" -frames:v 1 sheet.jpg`.

Show the file path, the key-frame sheet, length and resolution in a small table.

Gate: picture locked. A changed animation moves every beat, so sound only starts once the picture is final.
CTA: **Watch it. Locked, or notes?**

### Step 7 · Sound

Say: here's your silent master, now sound. Ask the user to drop the sound effects and music they want to use into
`<Brand>/sounds/` and say done. Short table: what helps (soft pops, tonal clicks, whooshes, a riser, a music track) and
that a licence has to cover this use. If they have nothing, offer `python3 scripts/synth_sfx.py sounds/`, a small free kit.

When they say done, read `references/sound-and-music.md` and follow it: dump `window.EVENTS` with
`node scripts/render.mjs events page.html events.json [--gpu]`, survey the sounds, write `cues.json`, run `mix.py`, check
sync and loudness, mux the watch copy. Show a table of beats and the sound placed on each, then both files: the silent
master and the version with sound. Keep the WAV for the editor.

Voiceover and music prompts are in `references/sound-and-music.md` if the brief asked for them.

CTA: **Here's your final video. Want a notes round, or are we done?**

### Notes rounds (any step)

Back up the page before each round, apply every note, re-check stills, and report what changed in plain words. Save a
new version unless the user asks you to replace one, and never delete their files.

**Paid tools:** ElevenLabs, Suno and any other paid service use the user's credits, so generate only when they ask.

## The rules that make it look good

These came from many rounds of a designer's notes. `references/style-rules.md` has the full list and the reasons.

- **Every shot transforms into the next.** No cross dissolves between shots. A shape or object in this shot becomes the
  next one, which keeps the eye in the same place and keeps people engaged. Look at the storyboard and ask how
  this shape can turn into that shape.
- **Keep what matters dead centre,** so the eye never has to go looking for it. Imagine an invisible crosshair.
- **Something is always moving.** It doesn't have to be big: a slow camera push or drift is enough. A still frame feels stale.
- **Direction never suddenly changes.** No zoom in then out, no scale up then down, no orbit that stops and turns back.
  Drive each move with one continuous curve, as a join between two paths shows up as a kink.
- **Fast, then slow for longer.** First drafts are nearly always too quick.
- **Shapes keep their shape.** Curves don't invert mid-morph, and parts moving together keep an even speed and spacing.
- **Text:** the brand font, short lines, sentence case. Each word fades up from blurred to sharp with a small rise,
  with no hard reveal edge. A subtle gradient on the lower half of the letters adds polish. No bounces or scale pops.
- **Light from one source** for 3D and product work. That's most of what makes it look cinematic.
- **Shallow depth of field** makes even browser-built 3D feel filmed: put the background out of focus.
- **Real UI, cleaned up.** Real screenshots or faithful rebuilds, with personal details and notification badges removed.
- **A clear call to action.** "On the App Store now", a URL, a search box. Think about what the viewer does next.
- **Direction beats a clever prompt.** A one-line prompt gives something generic. Ask the user about the idea, the style and
  the personality, and treat their notes as the real work.

## Keep it above board

Check these with the user before anything is published:
- **Brands.** Make ads for brands the user owns or has permission to use. A spec ad for any other brand is a practice or
  portfolio piece: end it with a small "Spec ad. Not affiliated with <brand>." line, don't imitate the brand's real
  campaigns, don't present it as official, and don't run it as paid advertising. Logos and names stay the property of
  their owners.
- **Assets.** Only use footage, images, fonts, sounds, music and 3D models the user made or is licensed to use, and check
  the licence covers this use.
- **Claims.** Everything on screen or in a voiceover must be true and backed up by the user. No guarantees of money or
  results, no invented stats, reviews or badges.
- **Privacy.** Remove personal details from screenshots and footage, and get consent from anyone who appears.

## Where to read more

| When you are… | Read |
|---|---|
| deciding look, motion, transitions, text, endings | `references/style-rules.md` |
| building UI in 3D in the browser | `references/engine-3d.md` |
| adding sound, a voiceover or music | `references/sound-and-music.md` |
| something looks wrong | `references/pitfalls.md` |

## Setup

Needs Node 18+, Python 3 with Pillow, numpy, scipy and opencv-python, ffmpeg, and Google Chrome or Chromium. Works on
Mac and Windows; on Windows use `python` instead of `python3`, and set the `CHROME` environment variable if Chrome isn't
found. If something's missing, say what it is and how to install it before starting.

## Scripts

- `render.mjs`: stills or 4K video from any page (`--gpu` for WebGL, `--audio` to add sound, `events` to dump the beat list).
- `contact_sheet.py`: tiles stills into one labelled review sheet.
- `gl3d.js`: the WebGL panel engine.
- `mix.py`: places sound effects on the animation's beats and checks the sync. `synth_sfx.py`: builds a free sound kit.
