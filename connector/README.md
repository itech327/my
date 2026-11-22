# Sada connector

A Claude custom connector for the Moroccan voices, on Cloudflare Workers.
Remote MCP at `/mcp`. Audio in R2, served at `/audio/<id>` for 7 days.

Tools:

- `speak_moroccan`: text, voice (`nour` or `younes`), mode (`darija` or
  `fusha`), delivery, pace. Returns a WAV link.
- `rewrite_moroccan`: rewrites text into general Darija or simple Fusha.

Voice styles, designed voices and Gemini calls come from `../app/src/lib`.
The designed voices live in the Google project of the key that made them.

## Deploy

Needs Node 22 and a Cloudflare account.

```bash
cd connector
npm install
npx wrangler login
npx wrangler r2 bucket create sada-audio
npx wrangler r2 bucket lifecycle add sada-audio expire-audio a/ --expire-days 7
npx wrangler deploy
npx wrangler secret put GEMINI_API_KEY    # paste your Gemini key when asked
npx wrangler secret put MCP_ACCESS_KEY    # paste a private code of 24+ characters
```

The Worker answers at `https://voice.taalim.men` (Custom Domain in
`wrangler.jsonc`; Cloudflare creates the DNS record and certificate).

## Automatic deploys with Workers Builds

Cloudflare's own GitHub link deploys on every push. In the dashboard:

1. R2: create the bucket `sada-audio`. Optional: add a lifecycle rule that
   deletes objects under `a/` after 7 days.
2. Workers & Pages: Create, Import a repository, `itech327/my`.
3. Worker name: `sada-connector` (must match `name` in `wrangler.jsonc`).
4. Production branch: `claude/new-session-thirii`. Root directory: `connector`.
   Deploy command: `npx wrangler deploy`.
5. After the first deploy: Settings, Variables and Secrets, add the secrets
   `GEMINI_API_KEY` and `MCP_ACCESS_KEY`.

## API token permissions (only for deploying from a computer or CI)

Create an account API token in Cloudflare (Manage Account, API Tokens,
Create Token, template "Edit Cloudflare Workers"). Scope it to your account
and to the zone `taalim.men`. Make sure it includes:

- Account: Workers Scripts Edit
- Account: Workers R2 Storage Edit
- Zone (taalim.men): Workers Routes Edit

## Add it to Claude

1. claude.ai: Customize, Connectors, + Add, Add custom connector.
2. Name: Sada. URL: `https://voice.taalim.men/mcp`.
3. Authentication: No sign in.
4. Request headers: `x-sada-key` = your MCP_ACCESS_KEY.
5. In a chat: +, Connectors, turn Sada on.

## Local test

Put `MCP_ACCESS_KEY` and `GEMINI_API_KEY` in `.dev.vars` (ignored by git),
then `npx wrangler dev`.

## Limits

- No free-voice fallback here: those voices need a full machine.
- Workers Free plan has a small CPU budget per request. Decoding the audio
  uses the runtime's native base64 decoder where available.
