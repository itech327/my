# صدى (Sada): handoff context

Give this file to Claude to continue. Last updated 2026-11-22.
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
| `connector/` | Cloudflare Worker: Claude custom connector (remote MCP). **Ready to deploy** |
| `app/src/lib/delivery.ts` | Speaking modes, delivery styles, paces, templates |
| `app/src/lib/tts/` | Engines: Gemini, F5, Piper, router with quota fallback |
| `app/src/app/api/mcp/` | Same connector inside the app, for testing |
| `.claude/skills/darija-voice/` | The skill: normalizer, respellings, scripts, results log |
| `replica/CONTEXT.md` | Longer project history and decisions |

## Next step: deploy the connector on Cloudflare

The owner hosts on Cloudflare. Only the connector goes live for now. The full app needs a real database first.

From a computer with Node 22:

```bash
git clone https://github.com/itech327/my.git
cd my && git checkout claude/new-session-thirii
cd connector
npm install
npx wrangler login
npx wrangler r2 bucket create sada-audio
npx wrangler r2 bucket lifecycle add sada-audio expire-audio a/ --expire-days 7
npx wrangler deploy
npx wrangler secret put GEMINI_API_KEY    # paste the Gemini key
npx wrangler secret put MCP_ACCESS_KEY    # paste a private code, 24+ characters
```

`wrangler deploy` prints the address: `https://voice.taalim.men` (Custom Domain set in `connector/wrangler.jsonc`).
A custom domain can be added in the Cloudflare dashboard under the Worker's Domains & Routes.

**Never paste keys into a chat.** Type them only into wrangler or the Cloudflare dashboard.

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
