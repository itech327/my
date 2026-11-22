import type { RegisterId } from './delivery';

// "حوّل إلى الدارجة" or "حوّل إلى الفصحى": rewrite any text into general Moroccan
// Darija or simple Standard Arabic with a Gemini text
// model (official generateContent API, the same key as Gemini TTS, injected by the
// network proxy).
// Measured 2026-11-22: gemini-3.6-flash with thinking "low" answers in under 1 s with
// good Darija, while gemini-3.8-flash was overloaded (503) and its default thinking
// took up to 84 s. gemini-2.5-flash is closed to new users (404).
// A Claude connector call times out at 60 s, so the whole rewrite has a 45 s budget:
// one attempt per model, 15 s each, then the next model.

const MODELS = ['gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-3.5-flash-lite'];
const PER_TRY_MS = 15_000;
const BUDGET_MS = 45_000;

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
  const deadline = Date.now() + BUDGET_MS;
  const errors: string[] = [];
  for (const model of MODELS) {
    const left = deadline - Date.now();
    if (left < 2_000) break;
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system(register) }] },
        contents: [{ role: 'user', parts: [{ text }] }],
        generationConfig: { temperature: 0.4, thinkingConfig: { thinkingLevel: 'low' } },
      }),
      signal: AbortSignal.timeout(Math.min(PER_TRY_MS, left)),
    }).catch((e: unknown) => ({ ok: false, status: 0, json: async () => ({ error: { message: String(e) } }) }) as unknown as Response);
    const j = (await r.json().catch(() => ({}))) as { candidates?: { content?: { parts?: { text?: string }[] } }[]; error?: { message?: string } };
    if (r.ok) {
      const out = (j.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? '').join('').trim();
      if (out) return out;
      errors.push(`${model}: empty answer`);
    } else {
      errors.push(`${model} ${r.status}: ${(j.error?.message ?? '').slice(0, 80)}`);
    }
  }
  throw new Error(errors.join(' | ') || 'no model answered');
}
