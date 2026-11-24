// Claude custom connector for the Moroccan voices, on Cloudflare Workers.
// Remote MCP (official SDK, Streamable HTTP, stateless, JSON responses) at /mcp.
// Audio is stored in Workers KV (auto-expires after 7 days) and served at /audio/<id>.
// Owner-only: every MCP request must carry MCP_ACCESS_KEY, in any ONE of three places:
//   path:    /mcp/<MCP_ACCESS_KEY>      (works in claude.ai, which only allows approved header names)
//   header:  Authorization: Bearer <MCP_ACCESS_KEY>
//   header:  x-sada-key: <MCP_ACCESS_KEY>
// Voice styles, designed voices and the Gemini calls are shared with the app.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { z } from 'zod';
import { DELIVERIES, PACES, geminiStyle, type DeliveryId, type PaceId, type RegisterId } from '../../app/src/lib/delivery';
import { LITE_MODEL, designedVoice, geminiSpeak, namedVoice, stripTags } from '../../app/src/lib/tts/gemini';
import { rewriteWith } from '../../app/src/lib/rewrite-core';
import { normalizeDarija } from '../../app/src/lib/darija-normalize';

interface Env {
  AUDIO: KVNamespace;
  GEMINI_API_KEY: string;
  MCP_ACCESS_KEY: string;
  // Optional backup: our free voices on a GPU server (voice-server/Dockerfile).
  // Either name works (two sessions built this at once):
  FREE_VOICE_URL?: string;   // e.g. https://voice-gpu.example.com (a plain variable)
  FREE_VOICE_TOKEN?: string; // the server's F5_TOKEN (a secret)
  FALLBACK_TTS_URL?: string;
  FALLBACK_TTS_KEY?: string;
}

const freeUrl = (env: Env) => env.FREE_VOICE_URL || env.FALLBACK_TTS_URL || '';
const freeToken = (env: Env) => env.FREE_VOICE_TOKEN || env.FALLBACK_TTS_KEY || '';

const TTL_S = 7 * 24 * 3600; // KV deletes the entry itself after this
// A saved take is forgotten an hour before its audio, so a saved take never points at a deleted file.
const CACHE_TTL_S = TTL_S - 3600;

const hex = (b: Uint8Array) => [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
const VOICES = {
  nour: { name: 'نور', gender: 'female', prebuilt: 'Kore', backup: { speaker: 'F1', name: 'هند' } },
  younes: { name: 'يونس', gender: 'male', prebuilt: 'Charon', backup: { speaker: 'M1', name: 'إدريس' } },
  // a young, light voice for advice to students; one designed voice for both modes
  akram: { name: 'أكرم', gender: 'male', prebuilt: 'Puck', backup: { speaker: 'M1', name: 'إدريس' }, designed: 'akram' },
} as const;

// When Google refuses (quota 429, overload 5xx), the free voice of the same gender
// speaks instead. Kept under 50 s: a Claude connector call times out at 60 s.
async function freeVoice(env: Env, text: string, speaker: string, pace: string | undefined): Promise<{ audio: Uint8Array; seconds: number }> {
  const token = freeToken(env);
  const r = await fetch(`${freeUrl(env).replace(/\/$/, '')}/synthesize`, {
    method: 'POST',
    // Bearer for f5_server.py; x-sada-key for a tunnel or proxy that checks that header
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}`, 'x-sada-key': token } : {}) },
    body: JSON.stringify({ text, speaker, ...(pace === 'slow' ? { pace: 'story' } : {}) }),
    signal: AbortSignal.timeout(50_000),
  });
  if (!r.ok) throw new Error(`free voice server ${r.status}`);
  return { audio: new Uint8Array(await r.arrayBuffer()), seconds: Math.max(1, Math.ceil(Number(r.headers.get('x-audio-seconds') ?? '1'))) };
}

async function sha256(s: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
}

async function authorized(req: Request, env: Env, pathKey: string): Promise<boolean> {
  const want = env.MCP_ACCESS_KEY;
  if (!want || want.length < 24) return false;
  const bearer = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  const candidates = [pathKey, bearer, req.headers.get('x-sada-key') ?? ''].filter(Boolean);
  const w = await sha256(want);
  let ok = false;
  for (const c of candidates) ok = crypto.subtle.timingSafeEqual(w, await sha256(c)) || ok;
  return ok;
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
      voice: z.enum(['nour', 'younes', 'akram']).default('younes').describe('nour (female), younes (male), akram (young male, light voice, for advice to students)'),
      mode: z.enum(['darija', 'fusha']).default('darija'),
      delivery: z.enum(DELIVERIES.map((d) => d.id) as [DeliveryId, ...DeliveryId[]]).default('conversational')
        .describe('conversational, ad, radio, story or service'),
      pace: z.enum(PACES.map((p) => p.id) as [PaceId, ...PaceId[]]).optional().describe('slow, medium or fast; default depends on delivery'),
      fresh: z.boolean().default(false).describe('true makes a new take even if the same text, voice and style was made in the last 7 days'),
    },
    annotations: { readOnlyHint: false, openWorldHint: true },
  }, async ({ text, voice, mode, delivery, pace, fresh }) => {
    const v = VOICES[voice];
    try {
      const req = { text: normalizeDarija(stripTags(text), { profile: mode === 'fusha' ? 'gemini-fusha' : 'gemini' }), apiKey: env.GEMINI_API_KEY, style: geminiStyle(delivery, pace ?? null, mode as RegisterId) };
      const designed = 'designed' in v ? namedVoice(v.designed, v.prebuilt) : designedVoice(mode, v.gender, v.prebuilt);
      // Designed voices belong to the Google project that made them. With another
      // key they return 404, so fall back to the prebuilt voice.
      let spoke: string = v.name;
      let note = '';
      // Same text, voice and style within 7 days: hand back the saved take, no Google request.
      const cacheKey = `c/${hex(await sha256(JSON.stringify([req.text, req.style, designed, v.name])))}`;
      if (!fresh) {
        const saved = await env.AUDIO.get(cacheKey, 'json').catch(() => null) as { id: string; seconds: number } | null;
        if (saved?.id) {
          const url = `${origin}/audio/${saved.id}`;
          return {
            content: [
              { type: 'text' as const, text: `الصوت جاهز (${spoke}، ${saved.seconds} ث، صالح ٧ أيام): ${url} هذا الصوت محفوظ من طلب سابق بنفس النص والصوت والأسلوب. لإنشاء نسخة جديدة استعمل fresh=true.` },
              { type: 'resource_link' as const, uri: url, name: `sada-${voice}.wav`, mimeType: 'audio/wav' },
            ],
          };
        }
      }
      let cacheable = true;
      const out = await geminiSpeak({ ...req, voice: designed }).catch((e) => {
        if (designed !== v.prebuilt && /\b404\b/.test(String(e))) return geminiSpeak({ ...req, voice: v.prebuilt });
        throw e;
      }).catch(async (e) => {
        // quota spent on the main model: the lighter model has its own quota
        if (!/\b429\b/.test(String(e))) throw e;
        const lite = await geminiSpeak({ ...req, voice: designed, model: LITE_MODEL });
        cacheable = false; // do not pin a lighter take for 7 days
        note = ' حصة النموذج الأساسي منتهية اليوم، فاستُعمل النموذج الاحتياطي، وجودته أقل.';
        return lite;
      }).catch(async (e) => {
        if (!/\b(429|500|502|503|504)\b/.test(String(e)) || !freeUrl(env)) throw e;
        spoke = v.backup.name;
        cacheable = false;
        note = ` لم يستجب Google، فتكلّم الصوت المجاني ${spoke}.`;
        return freeVoice(env, req.text, v.backup.speaker, pace);
      });
      const id = newId();
      await env.AUDIO.put(`a/${id}.wav`, out.audio, { expirationTtl: TTL_S });
      if (cacheable) await env.AUDIO.put(cacheKey, JSON.stringify({ id, seconds: out.seconds }), { expirationTtl: CACHE_TTL_S }).catch(() => undefined);
      const url = `${origin}/audio/${id}`;
      return {
        content: [
          { type: 'text' as const, text: `الصوت جاهز (${spoke}، ${out.seconds} ث، صالح ٧ أيام): ${url}${note}` },
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

  // Lets Claude pull a generated file through the connector itself. A session whose
  // network cannot reach this host (the usual case) still gets the bytes this way.
  server.registerTool('fetch_audio', {
    title: 'Fetch generated audio as base64',
    description: 'Read a WAV made by speak_moroccan, as base64 text, in slices. Pass the link or its id. '
      + 'Call again with offset set to next_offset until done is true. Used to move audio into a coding session.',
    inputSchema: {
      audio: z.string().min(24).max(300).describe('The link returned by speak_moroccan, or just its 24-character id'),
      offset: z.number().int().min(0).default(0).describe('Byte offset to start from'),
      max_bytes: z.number().int().min(1000).max(450_000).default(450_000).describe('Slice size in bytes before base64'),
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  }, async ({ audio: ref, offset, max_bytes }) => {
    const id = /([A-Za-z0-9_-]{24})\/?(?:\?.*)?$/.exec(ref.trim())?.[1] ?? '';
    const data = id ? await env.AUDIO.get(`a/${id}.wav`, 'arrayBuffer') : null;
    if (!data) return { isError: true, content: [{ type: 'text' as const, text: 'not found or expired' }] };
    const end = Math.min(data.byteLength, offset + max_bytes);
    const bytes = new Uint8Array(data, Math.min(offset, data.byteLength), Math.max(0, end - offset));
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return { content: [
      { type: 'text' as const, text: `id=${id} total_bytes=${data.byteLength} offset=${offset} next_offset=${end} done=${end >= data.byteLength}` },
      { type: 'text' as const, text: btoa(bin) },
    ] };
  });

  return server;
}

async function audio(id: string, env: Env, download = false): Promise<Response> {
  if (!/^[A-Za-z0-9_-]{24}$/.test(id)) return new Response('not found', { status: 404 });
  const data = await env.AUDIO.get(`a/${id}.wav`, 'arrayBuffer');
  if (!data) return new Response('not found or expired', { status: 404 });
  return new Response(data, {
    headers: { 'Content-Type': 'audio/wav', 'Cache-Control': 'private, max-age=3600', 'X-Robots-Tag': 'noindex',
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="sada-${id.slice(0, 8)}.wav"` },
  });
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname.startsWith('/audio/') && req.method === 'GET') return audio(url.pathname.slice(7), env, url.searchParams.has('dl'));
    const m = /^\/mcp(?:\/([^/]+))?$/.exec(url.pathname);
    if (!m) return new Response('not found', { status: 404 });
    let pathKey = '';
    try { pathKey = m[1] ? decodeURIComponent(m[1]) : ''; } catch { /* bad escape: treated as no key */ }
    if (!env.MCP_ACCESS_KEY || !env.GEMINI_API_KEY) return Response.json({ error: 'connector not configured' }, { status: 503 });
    if (!(await authorized(req, env, pathKey))) return Response.json({ error: 'unauthorized' }, { status: 401 });
    const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    await buildServer(env, url.origin).connect(transport);
    return transport.handleRequest(req);
  },
} satisfies ExportedHandler<Env>;
