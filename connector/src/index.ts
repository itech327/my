// Claude custom connector for the Moroccan voices, on Cloudflare Workers.
// Remote MCP (official SDK, Streamable HTTP, stateless, JSON responses) at /mcp.
// Audio is stored in Workers KV (auto-expires after 7 days) and served at /audio/<id>.
// Owner-only: every MCP request must carry header x-sada-key = MCP_ACCESS_KEY.
// Voice styles, designed voices and the Gemini calls are shared with the app.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { z } from 'zod';
import { DELIVERIES, PACES, geminiStyle, type DeliveryId, type PaceId, type RegisterId } from '../../app/src/lib/delivery';
import { designedVoice, geminiSpeak, stripTags } from '../../app/src/lib/tts/gemini';
import { rewriteWith } from '../../app/src/lib/rewrite-core';

interface Env {
  AUDIO: KVNamespace;
  GEMINI_API_KEY: string;
  MCP_ACCESS_KEY: string;
}

const TTL_S = 7 * 24 * 3600; // KV deletes the entry itself after this
const VOICES = {
  nour: { name: 'نور', gender: 'female', prebuilt: 'Kore' },
  younes: { name: 'يونس', gender: 'male', prebuilt: 'Charon' },
} as const;

async function sha256(s: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
}

async function authorized(req: Request, env: Env): Promise<boolean> {
  const want = env.MCP_ACCESS_KEY;
  const got = req.headers.get('x-sada-key');
  if (!want || want.length < 24 || !got) return false;
  const [a, b] = await Promise.all([sha256(want), sha256(got)]);
  return crypto.subtle.timingSafeEqual(a, b);
}

function newId(): string {
  const b = crypto.getRandomValues(new Uint8Array(18));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_');
}

function buildServer(env: Env, origin: string): McpServer {
  const server = new McpServer({ name: 'sada-moroccan-voice', version: '0.1.0' });

  server.registerTool('speak_moroccan', {
    title: 'Moroccan speech',
    description: 'Turn Arabic text into speech with a Moroccan voice. mode "darija": general Moroccan Darija, for explaining and talking. '
      + 'mode "fusha": Modern Standard Arabic read with a Moroccan voice. Returns a link to a WAV file, valid 7 days. '
      + 'Write Darija text in Arabic letters. Maximum 2000 characters.',
    inputSchema: {
      text: z.string().min(1).max(2000).describe('The text to speak, in Arabic letters'),
      voice: z.enum(['nour', 'younes']).default('younes').describe('nour (female) or younes (male)'),
      mode: z.enum(['darija', 'fusha']).default('darija'),
      delivery: z.enum(DELIVERIES.map((d) => d.id) as [DeliveryId, ...DeliveryId[]]).default('conversational')
        .describe('conversational, ad, radio, story or service'),
      pace: z.enum(PACES.map((p) => p.id) as [PaceId, ...PaceId[]]).optional().describe('slow, medium or fast; default depends on delivery'),
    },
    annotations: { readOnlyHint: false, openWorldHint: true },
  }, async ({ text, voice, mode, delivery, pace }) => {
    const v = VOICES[voice];
    try {
      const out = await geminiSpeak({
        text: stripTags(text), apiKey: env.GEMINI_API_KEY,
        voice: designedVoice(mode, v.gender, v.prebuilt),
        style: geminiStyle(delivery, pace ?? null, mode as RegisterId),
      });
      const id = newId();
      await env.AUDIO.put(`a/${id}.wav`, out.audio, { expirationTtl: TTL_S });
      const url = `${origin}/audio/${id}`;
      return {
        content: [
          { type: 'text' as const, text: `الصوت جاهز (${v.name}، ${out.seconds} ث، صالح ٧ أيام): ${url}` },
          { type: 'resource_link' as const, uri: url, name: `sada-${voice}.wav`, mimeType: 'audio/wav' },
        ],
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { isError: true, content: [{ type: 'text' as const, text: /\b429\b/.test(msg) ? 'انتهت حصة Google اليومية. حاول لاحقاً.' : `تعذّر إنشاء الصوت: ${msg.slice(0, 200)}` }] };
    }
  });

  server.registerTool('rewrite_moroccan', {
    title: 'Rewrite to Darija or Fusha',
    description: 'Rewrite any text into general Moroccan Darija (mode "darija") or simple, correct Modern Standard Arabic (mode "fusha"), ready to speak.',
    inputSchema: { text: z.string().min(1).max(2000), mode: z.enum(['darija', 'fusha']).default('darija') },
    annotations: { readOnlyHint: true, openWorldHint: true },
  }, async ({ text, mode }) => {
    try {
      return { content: [{ type: 'text' as const, text: await rewriteWith(env.GEMINI_API_KEY, text, mode) }] };
    } catch (e) {
      return { isError: true, content: [{ type: 'text' as const, text: `تعذّر التحويل: ${(e instanceof Error ? e.message : String(e)).slice(0, 200)}` }] };
    }
  });

  return server;
}

async function audio(id: string, env: Env): Promise<Response> {
  if (!/^[A-Za-z0-9_-]{24}$/.test(id)) return new Response('not found', { status: 404 });
  const data = await env.AUDIO.get(`a/${id}.wav`, 'arrayBuffer');
  if (!data) return new Response('not found or expired', { status: 404 });
  return new Response(data, {
    headers: { 'Content-Type': 'audio/wav', 'Cache-Control': 'private, max-age=3600', 'X-Robots-Tag': 'noindex',
      'Content-Disposition': `inline; filename="sada-${id.slice(0, 8)}.wav"` },
  });
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname.startsWith('/audio/') && req.method === 'GET') return audio(url.pathname.slice(7), env);
    if (url.pathname !== '/mcp') return new Response('not found', { status: 404 });
    if (!env.MCP_ACCESS_KEY || !env.GEMINI_API_KEY) return Response.json({ error: 'connector not configured' }, { status: 503 });
    if (!(await authorized(req, env))) return Response.json({ error: 'unauthorized' }, { status: 401 });
    const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    await buildServer(env, url.origin).connect(transport);
    return transport.handleRequest(req);
  },
} satisfies ExportedHandler<Env>;
