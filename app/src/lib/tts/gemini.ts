import type { SynthesisRequest, SynthesisResult, TtsProvider } from './provider';
import { normalizeDarija } from '../darija-normalize';

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
const MODEL = (typeof process !== 'undefined' ? process.env.GEMINI_TTS_MODEL : undefined) ?? 'gemini-3.8-flash-tts';

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

// Shared by the app and the Cloudflare connector Worker: plain fetch, no Node APIs.
export async function geminiSpeak(o: { text: string; voice: string; style: string; apiKey: string; model?: string }): Promise<{ audio: Uint8Array; seconds: number }> {
  const r = await fetch(URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': o.apiKey },
    body: JSON.stringify({
      model: o.model ?? MODEL,
      input: [{ type: 'user_input', content: [{ type: 'text', text: o.text, annotations: [{ type: 'speech_metadata', style: o.style }] }] }],
      response_format: { type: 'audio' },
      generation_config: { speech_config: [{ voice: o.voice }] },
    }),
    signal: AbortSignal.timeout(120_000),
  });
  const j = (await r.json().catch(() => ({}))) as InteractionResponse;
  if (!r.ok) throw new Error(`gemini ${r.status}: ${j.error?.message ?? 'request failed'}`);
  const audio = j.steps?.filter((s) => s.type === 'model_output').flatMap((s) => s.content ?? [])
    .filter((c) => c.type === 'audio' && c.data).pop()?.data;
  if (!audio) throw new Error('gemini: no audio in response');
  // native decoder where the runtime has it (cheap on Workers' CPU budget), else a loop
  const fast = (Uint8Array as unknown as { fromBase64?: (s: string) => Uint8Array }).fromBase64;
  let bytes: Uint8Array;
  if (fast) bytes = fast(audio);
  else {
    const bin = atob(audio);
    bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  }
  return { audio: bytes, seconds: Math.max(1, Math.ceil(wavSeconds(bytes))) };
}

// A named designed voice (one voice for both modes, e.g. akram), else the prebuilt voice.
export const namedVoice = (name: string, prebuilt: string) => DESIGNED[name] || prebuilt;

// The designed voice for a speaking mode and gender, else the prebuilt voice.
export const designedVoice = (register: string | undefined, gender: 'female' | 'male' | undefined, prebuilt: string) =>
  (gender && DESIGNED[`${register ?? 'darija'}-${gender}`]) || prebuilt;

export const stripTags = (t: string) => t.replace(/\[\/?[^\]\s]{1,8}\]/g, '').trim();

export function geminiProvider(voice: string, gender?: 'female' | 'male'): TtsProvider {
  return {
    id: `gemini-${voice}`,
    async synthesize(req: SynthesisRequest): Promise<SynthesisResult> {
      // Moroccan text front end first: numbers in Darija, Arabizi, French words, respellings
      const text = req.dialect === 'ar-MA'
        ? normalizeDarija(stripTags(req.text), { profile: req.register === 'fusha' ? 'gemini-fusha' : 'gemini' }) : stripTags(req.text);
      const out = await geminiSpeak({ text, voice: designedVoice(req.register, gender, voice),
        style: req.styleText ?? DEFAULT_STYLE, apiKey: process.env.GEMINI_API_KEY ?? 'proxy-injected' });
      return { audio: out.audio, mime: 'audio/wav', seconds: out.seconds };
    },
  };
}

export const DEFAULT_STYLE =
  'Speak in natural Moroccan Darija that every Moroccan understands, like a native speaker from Morocco. Warm, natural pace, short breathing pauses.';
