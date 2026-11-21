import type { SynthesisRequest, SynthesisResult, TtsProvider } from './provider';

// Calls the local Darija voice service (.claude/skills/darija-voice/scripts/server.py).
// The service normalizes the text (numbers, Arabizi, Moroccan letters) itself.
export function piperProvider(baseUrl: string): TtsProvider {
  return {
    id: 'piper-darija',
    async synthesize(req: SynthesisRequest): Promise<SynthesisResult> {
      // our emotion tags are not supported by this voice: drop them
      const text = req.text.replace(/\[\/?[^\]\s]{1,8}\]/g, '');
      const r = await fetch(`${baseUrl}/synthesize`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(60_000),
      });
      if (!r.ok) throw new Error(`voice service ${r.status}`);
      const seconds = Math.max(1, Math.ceil(Number(r.headers.get('x-audio-seconds') ?? '0')));
      return { audio: new Uint8Array(await r.arrayBuffer()), mime: 'audio/wav', seconds };
    },
  };
}
