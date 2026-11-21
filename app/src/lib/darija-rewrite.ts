import 'server-only';
import { accentById, type AccentId } from './delivery';

// "حوّل إلى الدارجة": rewrite any text into natural Moroccan Darija with a Gemini text
// model (official generateContent API, the same key as Gemini TTS, injected by the
// network proxy). Tested 2026-11-21 with gemini-3.8-flash; it can answer 503 under
// load, so we retry and fall back to other models.

const MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];

function system(accent?: AccentId | null): string {
  const city = accentById(accent)?.city || 'الدار البيضاء';
  return `أنت كاتب مغربي. أعد كتابة النص بالدارجة المغربية الطبيعية كما يتكلمها أهل ${city}، بالحروف العربية. `
    + 'حافظ على المعنى كاملاً. اكتب الأرقام بالحروف بالدارجة. اكتب الكلمات الفرنسية كما تُنطق بحروف عربية. '
    + 'لا تضف تشكيلاً. جمل قصيرة. أعد النص المعاد كتابته فقط، بلا شرح ولا علامات تنصيص.';
}

export async function rewriteToDarija(text: string, accent?: AccentId | null): Promise<string> {
  let last = 'no model answered';
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY ?? 'proxy-injected' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system(accent) }] },
          contents: [{ role: 'user', parts: [{ text }] }],
          generationConfig: { temperature: 0.4 },
        }),
        signal: AbortSignal.timeout(60_000),
      }).catch((e: unknown) => ({ ok: false, status: 0, json: async () => ({ error: { message: String(e) } }) }) as unknown as Response);
      const j = (await r.json().catch(() => ({}))) as { candidates?: { content?: { parts?: { text?: string }[] } }[]; error?: { message?: string } };
      if (r.ok) {
        const out = (j.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? '').join('').trim();
        if (out) return out;
        last = 'empty answer';
      } else {
        last = `${model} ${r.status}: ${j.error?.message ?? ''}`;
        if (r.status !== 503 && r.status !== 429 && r.status !== 0) break; // not a load problem: try the next model
      }
      await new Promise((res) => setTimeout(res, 1500));
    }
  }
  throw new Error(last);
}
