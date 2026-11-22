# صدى (Sada): handoff context

Give this file to Claude to continue. Last updated 2026-11-22: the Claude connector is live and tested.
Repository `itech327/my`, branch `claude/new-session-thirii`. Not merged to `main`.

## What it is

A Moroccan text-to-speech platform. Two jobs matter to the owner:

- **Standard Arabic with a Moroccan feel** (فصحى بنفَس مغربي).
- **General Moroccan Darija** for explaining and talking. Regional accents are not needed.

## Voices

| Voice | Engine | Use |
| --- | --- | --- |
| يونس (male) | Google Gemini TTS, designed voice | Main voice. Owner: "very good voice" |
| نور (female) | Google Gemini TTS, designed voice | Main voice. Very natural in Darija |
| إدريس (male), هند (female) | Open F5-TTS model on a CPU | Free backup. Slower, some wrong words |

- Gemini model `gemini-3.8-flash-tts`, official Interactions API.
- Each mode (darija, fusha) and gender has its own **designed voice** (Gemini Voice design API).
- Ids are in `app/src/lib/tts/designed-voices.json`. They belong to the Google project of the current key.
- A new key needs `.claude/skills/darija-voice/scripts/gemini_design_voices.py` run again.
- The Fusha female voice was redesigned. The first one drifted into Darija words and became نور's Darija voice. A Gemini check of the new one is still pending.

## Limits to know

- **The Gemini key is on Google's Free Tier:** 10 voice requests per day. Switch to the paid tier before real users.
- **Don't rotate several Google accounts** to get around the limit. It breaks Google's terms.
- **Darija isn't an official language** for Gemini TTS. Keep checking quality by ear.
- **Free backup:** the app switches to هند or إدريس when Google returns its limit error (HTTP 429), and says so.

## Parts of the repo

| Path | What |
| --- | --- |
| `app/` | Next.js 15 web app: editor, accounts, credits, history. Data is in memory for now |
| `connector/` | Cloudflare Worker: Claude custom connector (remote MCP). **Live at voice.taalim.men** |
| `app/src/lib/delivery.ts` | Speaking modes, delivery styles, paces, templates |
| `app/src/lib/tts/` | Engines: Gemini, F5, Piper, router with quota fallback |
| `app/src/app/api/mcp/` | Same connector inside the app, for testing |
| `.claude/skills/darija-voice/` | The skill: normalizer, respellings, scripts, results log |
| `replica/CONTEXT.md` | Longer project history and decisions |

## Claude connector: live

- **Address:** `https://voice.taalim.men`, a Cloudflare Worker deployed with **Workers Builds** from branch `claude/new-session-thirii`, root directory `connector`.
- **Tested from Claude on 2026-11-22:**
  - `rewrite_moroccan` answers in about a second.
  - `speak_moroccan` returned يونس, the designed voice, as a working WAV link.
  - The Worker uses the same Gemini key as the tests, so the designed voices work.
- **Storage:** audio in Workers KV (binding `AUDIO`), each file deleted after 7 days.
- **Rewrite models:**
  - Order: `gemini-3.6-flash`, then `gemini-3.8-flash`, then `gemini-3.5-flash-lite`.
  - Thinking level `low`, 15 s per model, 45 s total. A Claude connector call times out at 60 s.
  - `gemini-2.5-flash` is closed to new users.
- **Secrets in Cloudflare:** `GEMINI_API_KEY` and `MCP_ACCESS_KEY`, under Workers & Pages, `sada-connector`, Settings, Variables and Secrets. **Never paste keys into a chat.**
- **Redeploys:** every push to the branch. Add `app/src/lib/*` to the build watch paths, so changes to the shared voice code redeploy too.

### Add it to Claude

1. claude.ai: **Customize**, **Connectors**, **+ Add**, **Add custom connector**.
2. Name `Sada`. URL `https://voice.taalim.men/mcp/<MCP_ACCESS_KEY>`.
   - claude.ai rejects custom header names, so the access code goes in the URL.
   - `Authorization: Bearer` and `x-sada-key` headers also work for other clients.
   - Keep Cloudflare logs private.
3. **Authentication**: No sign in.
4. In a chat: **+**, **Connectors**, turn Sada on.
5. Ask, for example: "سجّل هاد النص بالدارجة بصوت يونس، بأسلوب الحكاية".

### Deploying again from scratch

- **Dashboard:** Workers & Pages, Import a repository `itech327/my`, Worker name `sada-connector` (must match `wrangler.jsonc`), root directory `connector`, then add both secrets.
- **From a computer:** follow `connector/README.md`.

## Free-voice backup on a GPU (in progress)

- The owner chose a GPU server for our own voices, as backup when Google refuses.
- **Ready in the repo:**
  - `voice-server/Dockerfile`: pinned libraries, model files checked by hash.
  - Token protection on `f5_server.py`, tested: 401 without or with a wrong token.
  - Connector fallback (`FREE_VOICE_URL`, `FREE_VOICE_TOKEN`). نور falls back to هند, يونس to إدريس.
  - The app passes `TTS_SPEAKERS_TOKEN`.
- **Not done:** choosing a GPU host and deploying the image. That needs the owner's account. Prefer a host that scales to zero.
- A cold start can exceed Claude's 60 s limit. On a CPU, a short sentence takes about 35 s.

## Connector tools

- `speak_moroccan`:
  - text, up to 2000 characters, Arabic letters.
  - voice: `nour` or `younes`.
  - mode: `darija` or `fusha`.
  - delivery: `conversational`, `ad`, `radio`, `story` or `service`.
  - pace: `slow`, `medium` or `fast`.
  - Returns a WAV link, valid 7 days.
- `rewrite_moroccan`: text and mode. Rewrites into general Darija or simple Fusha.

## Tested

- **Connector:**
  - Locally on Workers: wrong access code refused, tools listed, Google reached, bad audio links refused.
  - Live from Claude: rewrite and voice both work (sample `replica/examples/gemini/connector-younes.wav`).
  - In the app: rewrite correct, quota fallback to هند works.
- **Story test on the same text:**

  | Voice | Recognizer error rate | Time |
  | --- | --- | --- |
  | يونس on Gemini | 0.061 | 14 seconds |
  | إدريس | 0.068 | 4.5 minutes |

## Still open

1. **Pending ear test:** Fusha female voice on Gemini. Recorded 2026-11-22 (`replica/examples/gemini/app-nour-fusha-v2.wav`, CER 0.034, no Darija words found by the recognizer). Owner to confirm by ear.
2. **Paid tier:** switch the Gemini key to paid.
3. **Full app:** a database and storage, so it can go live: Cloudflare D1 and KV or R2, or Supabase.
4. **Payments:** a real payment provider.
5. **Free voices:**
   - Words before a comma get an extra sound ("المهمن"). Next test: drop commas inside sentences.
   - Add every word the owner corrects to `.claude/skills/darija-voice/data/respell.tsv`. Example: فلاح → فلّاح.

## Rules kept so far

- **Keys:** never in chat or in code. Network secrets or host secrets only.
- **Voices:** no cloning of real people's voices without consent. Other platforms are used only for comparison.
- **Official APIs only.** No private endpoints of other sites.
- **Branch:** commit to `claude/new-session-thirii`.
