import { estimateSeconds, plainText } from '../text';
import type { SynthesisRequest, SynthesisResult, TtsProvider } from './provider';

// Placeholder engine until a real one is chosen. It makes a soft tone pattern,
// one short note per word, with the length a real voice would take. It lets the
// whole flow (charge, store, play, download) work end to end with no keys.
const RATE = 16000;

function wav(samples: Int16Array): Uint8Array {
  const buf = new ArrayBuffer(44 + samples.length * 2);
  const v = new DataView(buf);
  const str = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF'); v.setUint32(4, 36 + samples.length * 2, true); str(8, 'WAVE');
  str(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, RATE, true); v.setUint32(28, RATE * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  str(36, 'data'); v.setUint32(40, samples.length * 2, true);
  new Int16Array(buf, 44).set(samples);
  return new Uint8Array(buf);
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export const fakeProvider: TtsProvider = {
  id: 'fake',
  async synthesize(req: SynthesisRequest): Promise<SynthesisResult> {
    const text = plainText(req.text);
    if (!text) throw new Error('empty text');
    const seconds = estimateSeconds(req.text);
    const words = text.split(' ');
    const total = seconds * RATE;
    const out = new Int16Array(total);
    const base = 140 + (hash(req.voiceId) % 120); // each voice gets its own pitch
    const per = Math.floor(total / words.length);
    words.forEach((w, i) => {
      const f = base * (1 + (hash(w) % 7) / 24);
      const start = i * per;
      const len = Math.floor(per * 0.8);
      for (let n = 0; n < len && start + n < total; n++) {
        const env = Math.sin((Math.PI * n) / len);
        out[start + n] = Math.round(Math.sin((2 * Math.PI * f * n) / RATE) * env * 6000);
      }
    });
    await new Promise((r) => setTimeout(r, 400)); // feel like a network call
    return { audio: wav(out), mime: 'audio/wav', seconds };
  },
};
