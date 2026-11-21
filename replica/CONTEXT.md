# Project context: Arabic TTS clone

Hand this file to any new session or collaborator. It says what exists,
what was decided, and what is next.

Last updated: 2026-11-21. Branch: `claude/new-session-thirii` in
`itech327/my`. Not merged to `main`.

## Goal

Build our own Arabic text-to-speech web app with the same features as
ArabyVoice (arabyvoice.com): type Arabic text, pick one of 17 dialects and a
voice, generate natural speech, download it. Users pay for minutes.

Working name: **صدى (Sada)**. A placeholder until `/replica-brand`.

Method: the Replica skill pack (`.claude/skills/replica-*`), run in order:
recon, architect, design, build, backend, test, diff, entrepreneur, brand,
launch, deploy. Done so far: recon, architect, design, build.

## Rules we follow

- **Clean room.** Rebuild what the app does, never what it owns. No copying
  their code, logo, voice names, demo audio, copy or colours.
- **Public sources only.** Never their private endpoints or JS bundles.
- **Never use the original's speech engine through their website.** Their
  official API with our own paid key is allowed by their terms (section 7),
  but it is a poor base: retail price, keys can be suspended, no public docs.
- **Rebrand before launch.** The sweep must find nothing of the original.
- **Keys never in chat.** Use the secure credential form.

## What the original does

From `replica/recon.md`. Read 2026-11-21.

- 16 dialects plus Fusha. RTL Arabic site. Next.js.
- Voice library ("3000+"), most likely the provider's stock voices.
- Emotion tags on selected words: laugh, whisper, sad, angry, fast, slow.
- Voice cloning with consent, sound effects from text, speech-to-text.
- Audio and text deleted after 7 days. One free regeneration under 500 words.
- An API with personal keys.
- Audio is made by a **third-party provider**, according to their terms.

Pricing as rendered on their site:

| plan | price | minutes |
| --- | --- | --- |
| Free | $0 | 60 s |
| 1 month | $6 | 30 min |
| 1 month | $15 | 2 h |
| 3 months | $49 | 7 h |
| 6 months | $69 | 15 h |

Unused minutes roll over on early renewal. The page's hidden schema data
shows older prices ($10/$20/$99). Ignore those.

## What is built

App in `app/`: Next.js 15.5, React 19.2, Tailwind 3.4, TypeScript 5.9.

- All 16 screens (S01 to S16). 10 done, 6 partial.
- Core loop works end to end: sign up, free minute, editor, generate, play,
  download, history, free regenerate, test-mode purchase, delete account.
- Verified in a browser on a production build. No console errors, no
  horizontal scroll at 1440 and 390.
- Parity score 66.4 / 100. Must-haves 9 of 12.

What is fake:

| part | now | real one goes in |
| --- | --- | --- |
| speech | **Moroccan: real open voice** (Piper, CER 0.12). Other dialects: `lib/tts/fake.ts` tones | a `TtsProvider` per dialect in `lib/tts/` |
| data | `lib/data/fake.ts`, in memory, resets on restart | a Supabase `DataLayer` in `lib/data/` |
| payments | billing grants minutes with no charge | checkout plus a signed webhook |
| cloning, SFX, API, transcription | coming-soon screens | after the engine |
| legal pages | marked as drafts | must be written and reviewed |

Run it:

```bash
cd app && npm install && npm run build && npm start
# http://localhost:3000
```

## Key design choices

- **One interface per external dependency.** `DataLayer` and `TtsProvider`.
  Swapping the fake for the real one changes no screen code.
- **Metering in seconds of output audio.** Reserve an estimate before
  synthesis, release the unused part after. Diacritics and tags are not
  charged.
- **Credit lots.** Each grant has its own expiry. Spend the soonest-expiring
  first. Row locks in SQL stop double spending (`replica/schema.sql`,
  tested on Postgres 16).
- **Trial abuse.** A hash of each email that got the free minute is kept
  after account deletion.
- **Tokens only.** Every colour and size comes from
  `replica/design/tokens.json`. Regenerate with `npm run tokens` in `app/`.
- **Font:** IBM Plex Sans Arabic. **Accent:** neutral grey until the rebrand.

## Moroccan voice

Skill: `.claude/skills/darija-voice/` (`/darija-voice`). Open model
`maromoya/piper-darija` (CC BY 4.0, DODa data by AtlasIA). Runs on a CPU, about
25 times faster than real time. Text front end handles numbers, Arabizi and
French loanwords (24 tests). Scored by round trip through a Darija
recognizer: CER 0.444 with defaults, 0.120 tuned. Run with
`scripts/setup.sh DIR`, then `server.py`, then start the app with
`TTS_DARIJA_URL=http://127.0.0.1:5005`.

Hosts added for this: huggingface.co, cdn-lfs.huggingface.co,
cdn-lfs-us-1.hf.co, cas-bridge.xethub.hf.co, us.aws.cdn.hf.co.

**ArabyVoice API compared (2026-11-21):** the user's key works on the official
endpoint. On the same sentence the native listener preferred هند over their
Moroccan voice (CER 0.07 vs 0.29). Decision: stay on open models.

**Main engine decided (2026-11-21): Google Gemini TTS** (official API, user's
key as a network secret for generativelanguage.googleapis.com, header
x-goog-api-key). The native listener ranked Gemini first, AudioDarija.ma
second, our open voices third. Run the app with `TTS_GEMINI=1` and
`NODE_USE_ENV_PROXY=1` in the cloud session. Moroccan Darija is not in
Google's official language list, so keep checking quality by ear.

## Open decisions (blocking)

1. **Speech engine for the other 16 dialects.** Moroccan is solved with an open voice. Candidates for the rest: ElevenLabs, Azure AI Speech, Google Cloud
   TTS, Arabic specialist vendors, or ArabyVoice's official API as a test
   only. Not yet verified: dialect coverage, price, licence. Test: the same
   5 sentences per dialect, including Moroccan Darija and undiacritised MSA.
   Must cost well below $0.077 a minute.
2. **Payment provider.** Stripe if your country is supported, otherwise a
   merchant of record such as Paddle or Lemon Squeezy. Needs local currency
   (MAD, SAR, EGP).
3. **Scope.** A product to sell, or a tool for your own content.

## Next steps

1. Choose the engine and create a trial account. Write its `TtsProvider`.
2. `/replica-backend`: Supabase auth, database, storage, payments.
3. `/replica-test`, `/replica-diff`.
4. `/replica-entrepreneur`: read real reviews to find what to do better.
5. `/replica-brand`, `/replica-launch`, `/replica-deploy`.

## File map

| path | what |
| --- | --- |
| `replica/CONTEXT.md` | this file |
| `replica/recon.md` | screens S01 to S16, flows F01 to F08, data model |
| `replica/features.csv` | feature matrix with clone status |
| `replica/architecture.md` | stack, routes, jobs, risks, build order |
| `replica/schema.sql` | Postgres schema with credit functions, tested |
| `replica/design/` | tokens, generator, 17 component specs, primitives page |
| `replica/build-log.md` | per-screen status and what was hard |
| `replica/screens/` | reference screenshots of the original. Never shipped |
| `replica/clone-screens/` | screenshots of our app, for diffing |
| `app/src/lib/` | dialects, plans, text helpers, data layer, TTS, session |
| `app/src/app/` | routes: marketing, auth, app, API |
| `app/src/components/` | UI built from the design specs |

## Environment notes

- `arabyvoice.com` and `www.arabyvoice.com` were added to the personal cloud
  environment's allowed hosts for recon.
- The cloud container is temporary. Anything not pushed is lost.
- The `mattpocock-skills` plugin is enabled in `.claude/settings.json`. Not yet
  confirmed to load.
