import { createHash, timingSafeEqual } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { z } from 'zod';
import { providerFor } from '@/lib/tts';
import { DELIVERIES, PACES, geminiStyle, paceById, type DeliveryId, type PaceId, type RegisterId } from '@/lib/delivery';
import { rewriteText } from '@/lib/darija-rewrite';
import { putAudio } from '@/lib/mcp-audio';

// MCP endpoint for a Claude custom connector (remote MCP, Streamable HTTP,
// stateless, JSON responses). Owner-only: every request must carry the header
// x-sada-key matching MCP_ACCESS_KEY. Set that key in Claude under
// Customize > Connectors > Add custom connector > Request headers.
// Usage is not metered against app credits: it spends the owner's Gemini quota.

const VOICES = {
  nour: { id: 'v-ar-MA-g1', name: 'نور' },
  younes: { id: 'v-ar-MA-g2', name: 'يونس' },
  akram: { id: 'v-ar-MA-g3', name: 'أكرم' },
  hind: { id: 'v-ar-MA-f1', name: 'هند' },
  idriss: { id: 'v-ar-MA-0', name: 'إدريس' },
} as const;

function authorized(req: Request): boolean {
  const want = process.env.MCP_ACCESS_KEY;
  const got = req.headers.get('x-sada-key');
  if (!want || want.length < 24 || !got) return false;
  const h = (s: string) => createHash('sha256').update(s).digest();
  return timingSafeEqual(h(want), h(got));
}

function baseUrl(req: Request): string {
  return (process.env.PUBLIC_URL ?? new URL(req.url).origin).replace(/\/$/, '');
}

function buildServer(req: Request): McpServer {
  const server = new McpServer({ name: 'sada-moroccan-voice', version: '0.1.0' });

  server.registerTool('speak_moroccan', {
    title: 'Moroccan speech',
    description: 'Turn Arabic text into speech with a Moroccan voice. mode "darija": general Moroccan Darija, for explaining and talking. '
      + 'mode "fusha": Modern Standard Arabic read with a Moroccan voice. Returns a link to a WAV file, valid 7 days. '
      + 'Write Darija text in Arabic letters. Maximum 2000 characters.',
    inputSchema: {
      text: z.string().min(1).max(2000).describe('The text to speak, in Arabic letters'),
      voice: z.enum(['nour', 'younes', 'akram', 'hind', 'idriss']).default('nour').describe('nour (female), younes (male) and akram (young male, for advice to students) are the best voices; hind and idriss are free open voices, slower'),
      mode: z.enum(['darija', 'fusha']).default('darija'),
      delivery: z.enum(DELIVERIES.map((d) => d.id) as [DeliveryId, ...DeliveryId[]]).default('conversational')
        .describe('conversational, ad, radio, story or service'),
      pace: z.enum(PACES.map((p) => p.id) as [PaceId, ...PaceId[]]).optional().describe('slow, medium or fast; default depends on delivery'),
    },
    annotations: { readOnlyHint: false, openWorldHint: true },
  }, async ({ text, voice, mode, delivery, pace }) => {
    const v = VOICES[voice];
    const p = pace ?? DELIVERIES.find((d) => d.id === delivery)?.defaultPace ?? 'medium';
    const reqFor = (voiceId: string) => ({
      voiceId, dialect: 'ar-MA' as const, text, register: mode as RegisterId,
      style: DELIVERIES.find((d) => d.id === delivery)?.tone,
      styleText: geminiStyle(delivery, p, mode as RegisterId), speed: paceById(p)?.speed, pauseScale: paceById(p)?.pauseScale,
    });
    const usable = (voiceId: string) => providerFor({ voiceId, dialect: 'ar-MA' }).id !== 'fake';
    if (!usable(v.id)) return { isError: true, content: [{ type: 'text' as const, text: `الصوت ${v.name} غير مفعّل على هذا الخادم.` }] };
    let out;
    try {
      out = await providerFor({ voiceId: v.id, dialect: 'ar-MA' }).synthesize(reqFor(v.id));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { isError: true, content: [{ type: 'text' as const, text: /\b429\b/.test(msg) ? 'انتهت حصة Google اليومية، والأصوات المجانية غير مفعّلة على هذا الخادم. حاول لاحقاً.' : `تعذّر إنشاء الصوت: ${msg.slice(0, 200)}` }] };
    }
    const used = out.fallback ?? v.name;
    const note = out.fallback ? ` انتهت حصة Google اليومية، فاستُعمل الصوت المجاني ${out.fallback}.` : '';
    const url = `${baseUrl(req)}/api/mcp/audio/${putAudio(out.audio, out.mime)}`;
    return {
      content: [
        { type: 'text' as const, text: `الصوت جاهز (${used}، ${out.seconds} ث، صالح ٧ أيام): ${url}${note}` },
        { type: 'resource_link' as const, uri: url, name: `sada-${voice}.wav`, mimeType: out.mime },
      ],
    };
  });

  server.registerTool('rewrite_moroccan', {
    title: 'Rewrite to Darija or Fusha',
    description: 'Rewrite any text into general Moroccan Darija (mode "darija") or simple, correct Modern Standard Arabic (mode "fusha"), ready to speak.',
    inputSchema: { text: z.string().min(1).max(2000), mode: z.enum(['darija', 'fusha']).default('darija') },
    annotations: { readOnlyHint: true, openWorldHint: true },
  }, async ({ text, mode }) => {
    try {
      return { content: [{ type: 'text' as const, text: await rewriteText(text, mode) }] };
    } catch (e) {
      return { isError: true, content: [{ type: 'text' as const, text: `تعذّر التحويل: ${(e instanceof Error ? e.message : String(e)).slice(0, 200)}` }] };
    }
  });

  return server;
}

async function handle(req: Request): Promise<Response> {
  if (!process.env.MCP_ACCESS_KEY) return Response.json({ error: 'connector disabled' }, { status: 503 });
  if (!authorized(req)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await buildServer(req).connect(transport);
  return transport.handleRequest(req);
}

export const POST = handle;
export const GET = handle;
export const DELETE = handle;
export const dynamic = 'force-dynamic';
