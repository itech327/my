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

`wrangler deploy` prints the address, for example
`https://sada-connector.<your-subdomain>.workers.dev`. A custom domain can be
added in the Cloudflare dashboard under the Worker's Domains & Routes.

## Add it to Claude

1. claude.ai: Customize, Connectors, + Add, Add custom connector.
2. Name: Sada. URL: `https://<worker address>/mcp`.
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
