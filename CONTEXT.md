# صدى (Sada): handoff context

Give this file to Claude to continue. Last updated 2026-11-22, after the Cloudflare setup was prepared.
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

## Next step: deploy the connector on Cloudflare

Status on 2026-11-22: **deployed and live at `https://voice.taalim.men`** with Workers Builds. Checked from the cloud session: `/` answers 404, `/mcp` without the right code answers 401, so both secrets are set. Added to Claude and tested end to end on 2026-11-22: `rewrite_moroccan` answers in about a second, `speak_moroccan` returned يونس (designed voice, same Gemini key) as a working WAV link. claude.ai rejects custom header names, so the access code goes in the URL: `https://voice.taalim.men/mcp/<MCP_ACCESS_KEY>`. Keep Cloudflare logs private. Workers Builds may need build watch paths for `app/src/lib/*` so shared-code changes redeploy.

- The owner hosts `taalim.men` on Cloudflare. Cloudflare is already linked to their GitHub.
- The connector will answer at **`https://voice.taalim.men`**. The Custom Domain is already set in `connector/wrangler.jsonc`, and Cloudflare creates the DNS record and certificate on the first deploy.
- Only the connector goes live for now. The full app needs a real database first.
- The owner declined to give an API token to the cloud session. Deploy with **Workers Builds** from the Cloudflare dashboard. No token is needed in GitHub or in a chat.
- A browser-capable Claude, with the Claude in Chrome extension in the owner's signed-in Chrome, can click these steps for them.

### Dashboard steps (Workers Builds)

1. Audio storage is **Workers KV** (binding `AUDIO`). Wrangler creates the namespace on the first deploy, and each file expires after 7 days. No R2 needed.
2. **Workers & Pages**: **Create**, **Import a repository**, repository `itech327/my`.
3. Settings:
   - Worker name: **`sada-connector`**. It must match `name` in `wrangler.jsonc`, or the build fails.
   - Production branch: `claude/new-session-thirii`.
   - Root directory: `connector`.
   - Deploy command: `npx wrangler deploy`.
4. Deploy. Every later push to that branch redeploys automatically.
5. After the first deploy: **Settings**, **Variables and Secrets**, add two **secrets**:
   - `GEMINI_API_KEY`: the Gemini key.
   - `MCP_ACCESS_KEY`: a private code, 24+ characters, made up by the owner.
6. Check it:
   - `https://voice.taalim.men/mcp` without the header should answer 401.
   - `https://voice.taalim.men/` should answer 404.

**Never paste keys into a chat.** Type them only into the Cloudflare dashboard.

### Alternative: deploy from a computer

With Node 22, follow `connector/README.md`: `npx wrangler login`, `npx wrangler deploy`, then `npx wrangler secret put` for both secrets.

## Then add it to Claude

1. claude.ai: **Customize**, **Connectors**, **+ Add**, **Add custom connector**.
2. Name `Sada`. URL `https://voice.taalim.men/mcp`.
3. **Authentication**: No sign in.
4. **Request headers**: `x-sada-key` = the MCP_ACCESS_KEY.
5. In a chat: **+**, **Connectors**, turn Sada on.
6. Ask, for example: "سجّل هاد النص بالدارجة بصوت يونس، بأسلوب الحكاية".

The Free plan allows one custom connector.

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
  - In the app: rewrite correct, quota fallback to هند works.
- **Story test on the same text:**

  | Voice | Recognizer error rate | Time |
  | --- | --- | --- |
  | يونس on Gemini | 0.061 | 14 seconds |
  | إدريس | 0.068 | 4.5 minutes |

## Still open

1. **Pending ear test:** Fusha female voice on Gemini. Check that no word drifts into Darija.
2. **Paid tier:** switch the Gemini key to paid.
3. **Full app:** a database and storage, so it can go live: Cloudflare D1 and R2, or Supabase.
4. **Payments:** a real payment provider.
5. **Free voices:**
   - Words before a comma get an extra sound ("المهمن"). Next test: drop commas inside sentences.
   - Add every word the owner corrects to `.claude/skills/darija-voice/data/respell.tsv`. Example: فلاح → فلّاح.

## Rules kept so far

- **Keys:** never in chat or in code. Network secrets or host secrets only.
- **Voices:** no cloning of real people's voices without consent. Other platforms are used only for comparison.
- **Official APIs only.** No private endpoints of other sites.
- **Branch:** commit to `claude/new-session-thirii`.
