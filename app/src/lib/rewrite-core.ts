import type { RegisterId } from './delivery';

// "حوّل إلى الدارجة" or "حوّل إلى الفصحى": rewrite any text into general Moroccan
// Darija or simple Standard Arabic with a Gemini text
// model (official generateContent API, the same key as Gemini TTS, injected by the
// network proxy). Tested 2026-11-21 with gemini-3.8-flash; it can answer 503 under
// load, so we retry and fall back to other models.

const MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];

function system(register?: RegisterId | null): string {
  const common = 'حافظ على المعنى كاملاً. لا تضف تشكيلاً. جمل قصيرة وواضحة. أعد النص المعاد كتابته فقط، بلا شرح ولا علامات تنصيص.';
  if (register === 'fusha') {
    return 'أنت محرر مغربي متمكن من العربية الفصحى. أعد كتابة النص بعربية فصحى سليمة وبسيطة، كما يكتبها مقدم في الإذاعة المغربية. '
      + 'صحح الأخطاء النحوية والإملائية. اكتب الأرقام بالحروف. ' + common;
  }
  return 'أنت كاتب مغربي. أعد كتابة النص بالدارجة المغربية العامة التي يفهمها كل المغاربة، بالحروف العربية. '
    + 'اكتب الأرقام بالحروف بالدارجة. اكتب الكلمات الفرنسية كما تُنطق بحروف عربية. ' + common;
}

// Shared by the app and the Cloudflare connector Worker: plain fetch, no Node APIs.
export async function rewriteWith(apiKey: string, text: string, register?: RegisterId | null): Promise<string> {
  let last = 'no model answered';
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system(register) }] },
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
