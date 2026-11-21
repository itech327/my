# Build log

App: `app/` (Next.js 15.5, React 19.2, Tailwind 3.4, TypeScript 5.9).
Run: `cd app && npm install && npm run build && npm start`, then open
http://localhost:3000. Data lives in memory and resets on restart.

Parity after this pass: 66.4 / 100, must-haves 9 of 12 (`parity.py`).

| ID | screen | date | status | missing | harder than expected |
| --- | --- | --- | --- | --- | --- |
| shell | layout, nav, tokens, data layer | 2026-11-21 | done | | tokens had no fixed component sizes. Added a `size` group so components use no raw px |
| S01 | home | 2026-11-21 | done | founder story, real voice samples | |
| S02 | dialect landing x17 | 2026-11-21 | done | | static pages render the signed-out nav even for signed-in users |
| S03 | pricing | 2026-11-21 | done | real prices (placeholders until /replica-launch), local currency | Arabic number agreement for hours and minutes. Added `arabicCount` |
| S04 | blog | 2026-11-21 | partial | posts | |
| S05 | contact | 2026-11-21 | partial | form validates but sends nothing yet | |
| S06 | about | 2026-11-21 | partial | founder story | |
| S07 | terms, privacy | 2026-11-21 | partial | the legal text. Marked as a draft on the page | |
| S08 | sign up | 2026-11-21 | done | Google sign-in, email verification | card overflowed at 390px: inputs had no shrink. Fixed in Field |
| S09 | log in | 2026-11-21 | done | password reset | |
| S10 | editor | 2026-11-21 | partial | real engine, so audio is placeholder tones | emotion tags split words. Now snap to whole words. Sidebar balance went stale. Now refreshes |
| S11 | voice library | 2026-11-21 | done | | |
| S12 | voice cloning | 2026-11-21 | partial | coming-soon page only | |
| S13 | sound effects | 2026-11-21 | partial | coming-soon page only | |
| S14 | history | 2026-11-21 | done | purge job for expired audio | |
| S15 | billing | 2026-11-21 | partial | test mode: no payment, no rollover extension | |
| S16 | settings | 2026-11-21 | done | API keys (coming-soon section) | long email overflowed at 390px. Now wraps |

## Verified

Browser run against a production build (`next build && next start`):

- sign up: bad input rejected with a message. Good input gives the free minute
- editor: tag wraps whole words, counter ignores tags and diacritics,
  generate charges 5 s, audio plays, download is a valid 160 KB WAV
- text longer than the balance disables generate with a buy link
- premium voices locked on the trial, unlocked after a test purchase
- free regenerate granted once for a subscriber, badge shown in history
- voice library: dialect filter, empty search state, clear filters
- delete account needs the typed word. Re-signup with the same email gets
  no second free minute
- keyboard: the first Tab reaches the skip link
- all 16 screens at 1440 and 390: no console errors, no horizontal scroll
- `arabicCount` formats 11 cases correctly

Screenshots: `replica/clone-screens/` (S01 to S16, desktop and mobile).

## Moroccan voice (2026-11-21)

- Moroccan Darija now speaks with a real open voice: `maromoya/piper-darija`
  (CC BY 4.0), run by `.claude/skills/darija-voice/scripts/server.py` and
  routed by `app/src/lib/tts/index.ts` when `TTS_DARIJA_URL` is set.
- Measured with a Darija recognizer: CER 0.444 with Piper defaults, 0.120
  after turning the MSA diacritizer off and speaking French loanwords in
  Darija form. Details: `.claude/skills/darija-voice/references/results.md`.
- The voice is male (median pitch 141 Hz), so the Moroccan voice list now
  shows one male voice instead of four names that would sound the same.
- Browser flow re-run with the real voice: charged the real audio length,
  WAV download valid, no console errors.

## Not done, and why

- **Real speech for 16 dialects.** Moroccan is real. The rest use `lib/tts/fake.ts`, which makes tone patterns with the length a real
  voice would take, so charging, storing, playing and downloading all work.
  Swap in a real `TtsProvider` once the engine is chosen.
- **Payments.** Billing grants minutes in test mode. Needs the payment
  provider decision.
- **Persistence.** `lib/data/fake.ts` keeps everything in memory. The Supabase
  layer goes behind the same `DataLayer` interface in /replica-backend.
- **Cloning, SFX, API, transcription.** Coming-soon screens only. They depend
  on the engine.
- Commits are grouped by stage rather than one per screen, because the
  screens share most of their components.
