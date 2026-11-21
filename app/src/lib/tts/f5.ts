import type { SynthesisRequest, SynthesisResult, TtsProvider } from './provider';

// Calls the DODa speaker service (.claude/skills/darija-voice/scripts/f5_server.py).
// Higher quality than Piper but slower on a CPU: several seconds per sentence.
export function f5Provider(baseUrl: string, speaker: string): TtsProvider {
  return {
    id: `f5-${speaker}`,
    async synthesize(req: SynthesisRequest): Promise<SynthesisResult> {
      const text = req.text.replace(/\[\/?[^\]\s]{1,8}\]/g, '');
      const r = await fetch(`${baseUrl}/synthesize`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text, speaker }),
        signal: AbortSignal.timeout(600_000),
      });
      if (!r.ok) throw new Error(`speaker voice service ${r.status}`);
      const seconds = Math.max(1, Math.ceil(Number(r.headers.get('x-audio-seconds') ?? '0')));
      return { audio: new Uint8Array(await r.arrayBuffer()), mime: 'audio/wav', seconds };
    },
  };
}
