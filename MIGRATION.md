# Move Sada to another Claude account

Give this file and `CONTEXT.md` to Claude in the new account.
Last updated 2026-11-22.

## What moves by itself

Everything in the GitHub repository `itech327/my`, branch
`claude/new-session-thirii`. Open a Claude Code session on that repository and
branch, and these load automatically:

**Project skills** in `.claude/skills/`:

| Skill | What it does |
| --- | --- |
| `darija-voice` | Built in this project. Moroccan Darija voices: text front end, Gemini voice design, open F5 and Piper voices, recognizer tests, results log |
| `replica-recon`, `replica-architect`, `replica-design`, `replica-build`, `replica-backend`, `replica-test`, `replica-diff`, `replica-entrepreneur`, `replica-brand`, `replica-launch`, `replica-deploy` | The Replica pack (MIT, Jakeschincariol/replica-skill), used to clone ArabyVoice's features |
| `convert-documents-to-markdown`, `md-first`, `find-skills` | Helpers added to the repo |

**Plugins** listed in `.claude/settings.json`:

- `mattpocock-skills`, `claude-code-setup`: from the official marketplace.
- `claude-mem`: from thedotmack/claude-mem.
- `agent-skills`: from addyosmani/agent-skills.
- Claude Code asks to trust and install them the first time.

**Code and data:**

- `app/`: the web app.
- `connector/`: the Claude connector Worker.
- `voice-server/`: the GPU image for the free voices.
- `library/`: the audio library.
- Guides: `CONTEXT.md`, `MAC.md`, `replica/`.

## What stays with the owner, not with the Claude account

These are unaffected by the move:

- **Cloudflare:** the `sada-connector` Worker, `voice.taalim.men`, Workers KV and the Workers Builds link to GitHub.
- **Google:**
  - The Gemini key and its project.
  - The designed voices, ids in `app/src/lib/tts/designed-voices.json`, which belong to the key's Google project.
  - Keep the same key, or run `gemini_design_voices.py` again with a new one.
- **GitHub:** the repository itself.

## What must be set up again in the new Claude account

1. **GitHub access:** connect GitHub in the new account and give it access to `itech327/my`.
2. **Cloud environment.** Only for Claude Code on the web. Recreate the network settings:
   - **Allowed hosts:**
     - `huggingface.co`, `cdn-lfs.huggingface.co`, `cdn-lfs-us-1.hf.co`, `cas-bridge.xethub.hf.co`, `us.aws.cdn.hf.co`: model downloads.
     - `ai.google.dev`, `aistudio.google.com`: Gemini docs.
     - `voice.taalim.men`: testing the connector.
     - `arabyvoice.com`, `www.arabyvoice.com`, `audiodarija.ma`, `www.audiodarija.ma`, `speech.platform.bing.com`: only for the earlier competitor research. Not needed now.
   - **Network secrets.** Add them in the environment settings, never in chat:
     - Host `generativelanguage.googleapis.com`, header `x-goog-api-key`: the Gemini key.
     - Host `api.arabyvoice.com`, header `Authorization`: optional, only for comparison tests.
   - In the cloud session, run the app with `NODE_USE_ENV_PROXY=1`, or Node's fetch ignores the proxy.
3. **Sada connector in Claude:**
   - Customize, Connectors, Add custom connector.
   - URL `https://voice.taalim.men/mcp/<MCP_ACCESS_KEY>`.
   - Authentication: No sign in.
   - The access code is the one stored in Cloudflare.
4. **Scheduled task:** this account has "Continue audio library generation", set for 2026-11-23 08:10 UTC.
   - It stays here and does not move.
   - In the new account, ask Claude to run `library/generate.mts` once a day until the pilot is done.
   - Then delete the old task here, or let it run once.
5. **Local machine data:** the cloud container's downloaded models and Python environment are not in the repo.
   - Rebuild with `.claude/skills/darija-voice/scripts/setup.sh`.
   - For F5, follow `MAC.md` or `voice-server/Dockerfile`.

## First message for the new account

> Read `CONTEXT.md` and `MIGRATION.md` in this repository, on branch
> `claude/new-session-thirii`. Continue the Sada project: finish the audio
> library pilot in `library/` (16 items left), and answer me in Arabic.

## Rules to keep

- **Keys:** never in chat or in code. Use environment secrets or Cloudflare secrets only.
- **Voices:** no cloning of real people's voices without consent.
- **APIs:** official ones only.
- **Branch:** commit to `claude/new-session-thirii`, no pull request unless asked.
- **Language:** answer the owner in Arabic, with short sentences.
