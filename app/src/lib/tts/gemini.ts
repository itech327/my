import type { SynthesisRequest, SynthesisResult, TtsProvider } from './provider';

// Google Gemini TTS through the official Interactions API.
// Docs read 2026-11-21: aistudio.google.com/docs/speech-generation
//   POST https://generativelanguage.googleapis.com/v1beta/interactions
//   header x-goog-api-key, model gemini-3.8-flash-tts, unary output = WAV 24 kHz mono
// Moroccan Darija is NOT in Google's official language list (Standard and
// Egyptian Arabic are). The style text asks for it; measure before trusting it.
//
// The key is never in code or env: the session's network proxy injects it for
// generativelanguage.googleapis.com. We send a placeholder header it overwrites.

import designed from './designed-voices.json';

// Accent and language are permanent voice traits, so each speaking mode (Darija,
// Moroccan-style Fusha) has its own designed voice per gender (Voice design API;
// ids made by darija-voice/scripts/gemini_design_voices.py).
// The ids live in the Google project of the key that created them.
const DESIGNED = designed as Record<string, string>;

const URL = 'https://generativelanguage.googleapis.com/v1beta/interactions';
const MODEL = process.env.GEMINI_TTS_MODEL ?? 'gemini-3.8-flash-tts';

interface InteractionResponse {
  steps?: { type: string; content?: { type: string; data?: string }[] }[];
  error?: { message?: string };
}

function wavSeconds(buf: Uint8Array): number {
  const v = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  // find the "data" chunk instead of assuming a 44-byte header
  for (let i = 12; i + 8 <= buf.length; ) {
    const id = String.fromCharCode(buf[i], buf[i + 1], buf[i + 2], buf[i + 3]);
    const size = v.getUint32(i + 4, true);
    if (id === 'data') return size / (24000 * 2);
    i += 8 + size + (size % 2);
  }
  return buf.length / (24000 * 2);
}

export function geminiProvider(voice: string, gender?: 'female' | 'male'): TtsProvider {
  return {
    id: `gemini-${voice}`,
    async synthesize(req: SynthesisRequest): Promise<SynthesisResult> {
      const chosen = (gender && DESIGNED[`${req.register ?? 'darija'}-${gender}`]) || voice;
      const text = req.text.replace(/\[\/?[^\]\s]{1,8}\]/g, '').trim();
      const r = await fetch(URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY ?? 'proxy-injected' },
        body: JSON.stringify({
          model: MODEL,
          input: [{
            type: 'user_input',
            content: [{ type: 'text', text, annotations: [{ type: 'speech_metadata', style: req.styleText ?? DEFAULT_STYLE }] }],
          }],
          response_format: { type: 'audio' },
          generation_config: { speech_config: [{ voice: chosen }] },
        }),
        signal: AbortSignal.timeout(120_000),
      });
      const j = (await r.json().catch(() => ({}))) as InteractionResponse;
      if (!r.ok) throw new Error(`gemini ${r.status}: ${j.error?.message ?? 'request failed'}`);
      const audio = j.steps?.filter((s) => s.type === 'model_output').flatMap((s) => s.content ?? [])
        .filter((c) => c.type === 'audio' && c.data).pop()?.data;
      if (!audio) throw new Error('gemini: no audio in response');
      const bytes = new Uint8Array(Buffer.from(audio, 'base64'));
      return { audio: bytes, mime: 'audio/wav', seconds: Math.max(1, Math.ceil(wavSeconds(bytes))) };
    },
  };
}

export const DEFAULT_STYLE =
  'Speak in natural Moroccan Darija with a Casablanca register, like a native speaker from Morocco. Warm, natural pace, short breathing pauses.';
