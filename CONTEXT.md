# صدى (Sada): handoff context

Give this file to Claude to continue. Last updated 2026-11-23: new Gemini key, app running on the owner's Intel Mac.
Repository `itech327/my`, branch `claude/new-session-thirii`. Not merged to `main`.

## Update 2026-11-27: current state

- **Decision:** open engines (F5, Piper, DarijaTTS, neutts) are paused. Only Gemini TTS gives a good voice. Restart that work later, with a GPU and recordings we own.
- **Gemini key:** new key from the paid project, billing **Tier 1**, limit 100 requests a day per model. Four designed voices and Akram were recreated in that project (ids in `designed-voices.json`). The same key must be set in Cloudflare as `GEMINI_API_KEY`: done by the owner.
- **Voices:** نور, يونس (Darija and Fusha) and أكرم (young, light voice, one voice for both modes). Fusha uses the radio style, never the chatty one. Google blocks voice prompts for children or minors.
- **Text front end:** `ناقص` for minus (never `سالب`), `5x6` read "5 في 6" in Darija and "5 مضروبة في 6" in Fusha, `الجديد` respelled `جّديد`.
- **Library:** all 20 pilot items approved by the owner, including `num-fusha-05` and `num-darija-07` after the rewrite (ناقص, في).
- **Still to run:** the 15-sentence evaluation of the three voices with `connector_eval.py`. No result is recorded yet.
- **Evaluation tool:** `.claude/skills/darija-voice/scripts/connector_eval.py` measures the live connector with the Darija recognizer `boumehdi/wav2vec2-large-xlsr-moroccan-darija` (CER, WER). Test set `data/test_sentences_15.txt`. In the cloud session it needs `huggingface.co` and `us.aws.cdn.hf.co` allowed, `HF_HUB_DISABLE_XET=1` and a CPU `torch`.
- **Web app on Cloudflare:** OpenNext adapter, `wrangler.jsonc` (Worker `sada-app`, D1 `DB`, KV `AUDIO`), data layer picked per request (D1 on Cloudflare, memory elsewhere). Built and previewed locally, signup wrote a user to D1. Not deployed: needs the Workers Paid plan. Payments not started.
- **Open engines tested:** `DarijaTTS-v0.1-500M` CER 0.451 (poor). `neutts-air-darija` not run: needs a reference voice, a missing phonemizer file and conflicting packages. F5 is the best open voice but slow on a CPU.
- **Cloud session:** Node does not use the proxy unless `NODE_USE_ENV_PROXY=1`. Run `library/generate.mts` from `app/` with it.
- **Connector access code:** it was pasted in chat twice. Replace it with `openssl rand -hex 16` in Cloudflare (`MCP_ACCESS_KEY`), in claude.ai, and in the session secret for `voice.taalim.men`.

## What it is

A Moroccan text-to-speech platform. Two jobs matter to the owner:

- **Standard Arabic with a Moroccan feel** (فصحى بنفَس مغربي).
- **General Moroccan Darija** for explaining and talking. Regional accents are not needed.

## Voices

| Voice | Engine | Use |
| --- | --- | --- |
| يونس (male) | Google Gemini TTS, designed voice | Main voice. Owner: "very good voice" |
| نور (female) | Google Gemini TTS, designed voice | Main voice. Very natural in Darija |
| إدريس (male), هند (female) | Open F5-TTS model on a CPU | Free backup, studio quality. Slow on a CPU |
| إدريس, fast version | Open Piper model | Free backup on any CPU. Weakest quality |

- Gemini model `gemini-3.8-flash-tts`, official Interactions API.
- Each mode (darija, fusha) and gender has its own **designed voice** (Gemini Voice design API).
- Ids are in `app/src/lib/tts/designed-voices.json`. They belong to the Google project of the current key.
- A new key needs `.claude/skills/darija-voice/scripts/gemini_design_voices.py` run again.
- **2026-11-23: the owner moved to a new Gemini key, from another account.** The four designed voices were recreated in its project with the same prompts.
  - New ids are in `designed-voices.json`.
  - The earlier approvals were for the old project's voices: نور's Darija voice that came from the drifted Fusha design, and نور's Fusha voice. **The new voices need a new ear test.**
- History: the first Fusha female voice drifted into Darija words and became نور's Darija voice. The redesigned Fusha voice was accepted: "correct Standard Arabic with a Moroccan feel".

## Text front end

- Every Moroccan text goes through `app/src/lib/darija-normalize.ts` before Gemini, in the app and the connector.
  - Darija: numbers in Darija, Arabizi such as "3afak", French words, units, and the owner's respellings.
  - Standard Arabic: clean-up and respellings only.
- It is a port of the skill's `normalize.py`. `npm run test:normalize` in `app/` checks they match.

## Limits to know

- **The Gemini key is on billing Tier 1:** about 100 voice requests a day per model. The free tier allowed 10.
- **Don't rotate several Google accounts** to get around the limit. It breaks Google's terms.
- **Darija isn't an official language** for Gemini TTS. Keep checking quality by ear.
- **Free backup:** the app switches to a free voice when Google refuses for any reason (quota, overload, key or network). It says so, and logs the reason as `[tts] ... failed, using ...`.
  - The studio voices are used if `TTS_SPEAKERS_URL` is set.
  - Otherwise the fast Piper voice, if `TTS_DARIJA_URL` is set.

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
| `library/` | Reference audio library for teaching. Pilot: middle school, numbers and operations, 20 items. See its README |
| `motion/` | Motion graphics projects made with the `motion-ad` skill |
| `MIGRATION.md` | Moving the project to another Claude account: what moves, what to set up again |
| `MAC.md` | Run the app and the free voices on the owner's MacBook Pro |

## Claude connector: live

- **Address:** `https://voice.taalim.men`, a Cloudflare Worker deployed with **Workers Builds** from branch `claude/new-session-thirii`, root directory `connector`.
- **Tested from Claude on 2026-11-22:**
  - `rewrite_moroccan` answers in about a second.
  - `speak_moroccan` returned يونس, the designed voice, as a working WAV link.
  - **Action needed:** after the key change, replace the Worker's `GEMINI_API_KEY` secret in Cloudflare with the new key. With the old key the new voice ids answer 404, and the Worker falls back to Google's stock voices.
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

## The owner's Mac

- MacBook Pro, **Intel** (x86_64), macOS 15.7.4, Node 26, Python 3.12.
- The repo is in `~/my`. The app runs at http://localhost:3000 with `npm start` in `~/my/app`. `app/.env.local` holds `TTS_GEMINI=1`, `GEMINI_API_KEY` and `TTS_DARIJA_URL`.
- Homebrew 3.6 is too old for this macOS. Node was installed from nodejs.org. `brew update-reset` is still to do.
- **Piper fallback** runs in a second Terminal window, `server.py` on port 5005. It works: the switch was confirmed by the log. Quality is poor by the owner's ear: CER 0.187 on the "تقديم شركة" template.
- **F5 studio voices on an Intel Mac:** PyTorch has no Intel-macOS wheels after torch 2.2.2, so the pip install in `MAC.md` section 3 does not work there. Use Docker with `voice-server/Dockerfile` instead: about a minute per sentence on the CPU. On the same sentence F5 scored CER 0.013.
- **Owner's open choice:** Docker with F5, or Google's paid tier, which removes the need for the backup.

## Free-voice backup on a GPU (in progress)

- The owner chose a GPU server for our own voices, as backup when Google refuses.
- **Ready in the repo:**
  - `voice-server/Dockerfile`: pinned libraries, model files checked by hash.
  - Token protection on `f5_server.py`, tested: 401 without or with a wrong token.
  - Connector fallback (`FREE_VOICE_URL`, `FREE_VOICE_TOKEN`). نور falls back to هند, يونس to إدريس.
  - The app passes `TTS_SPEAKERS_TOKEN`.
- **Postponed by the owner on 2026-11-22.** The owner has no GPU provider account. Cloudflare Containers have no GPU (max 4 vCPU, 12 GiB). When resuming: a GPU host that runs Docker and scales to zero (for example Hugging Face, RunPod or Modal; compare current prices first), or the owner's own computer through a Cloudflare Tunnel.
- Recommended first: switch the Gemini key to Google's paid tier, which removes the 10-requests-a-day limit that makes the backup necessary.
- A cold start can exceed Claude's 60 s limit. On a CPU, a short sentence takes about 35 s.

## Audio library

- `library/`: reference audio for teaching.
- Pilot: middle school (الإعدادي), numbers and operations, 20 items.
- 4 approved by the owner (نور, Standard Arabic), 16 still to generate.
- Run `library/generate.mts` once a day on the free Gemini tier: it stops at the quota and resumes.
- After the key change, generation needs the **new** key. In the cloud session, update the network secret for `generativelanguage.googleapis.com` to the new key. With the old key, the new voice ids answer 404.
- The 4 approved items were made with the old project's نور Fusha voice. Remaking them would change their sound, so keep the files.

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

1. **Connector access code:** rotate `MCP_ACCESS_KEY`, which was pasted in chat. Update Cloudflare, claude.ai and the session secret.
2. **Full app on Cloudflare:**
   - Database layer done and tested: `app/src/lib/data/d1.ts`, schema `app/migrations/0001_init.sql`, `npm run test:d1` with 28 checks on a local D1 and KV.
   - Covers accounts, hashed sessions, the trial once per email, credit lots, atomic reserve and release, free regeneration once, and no overdraft under concurrent requests.
   - Not yet wired: going live needs the Workers Paid plan. The free plan allows 10 ms of CPU per request, too little for server-rendered pages. The owner chose to wait.
   - KV on the free plan allows 1,000 writes a day, one per audio file.
3. **Payments:** a real payment provider.
4. **Free voices:**
   - Words before a comma get an extra sound ("المهمن"). Next test: drop commas inside sentences.
   - Add every word the owner corrects to `.claude/skills/darija-voice/data/respell.tsv`. Example: فلاح → فلّاح.

## Rules kept so far

- **Name:** write the brand in Latin letters as `Sada`, never `sda`. In Arabic it is `صدى`.
- **Keys:** never in chat or in code. Network secrets or host secrets only.
- **Voices:** no cloning of real people's voices without consent. Other platforms are used only for comparison.
- **Official APIs only.** No private endpoints of other sites.
- **Branch:** commit to `claude/new-session-thirii`.
