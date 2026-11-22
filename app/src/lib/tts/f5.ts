import http from 'node:http';
import type { SynthesisRequest, SynthesisResult, TtsProvider } from './provider';

// Calls the DODa speaker service (.claude/skills/darija-voice/scripts/f5_server.py).
// Higher quality than Piper but slower on a CPU: several seconds per sentence.
export function f5Provider(baseUrl: string, speaker: string): TtsProvider {
  return {
    id: `f5-${speaker}`,
    async synthesize(req: SynthesisRequest): Promise<SynthesisResult> {
      const text = req.text.replace(/\[\/?[^\]\s]{1,8}\]/g, '');
      const body = JSON.stringify({ text, speaker: req.style === 'lively' ? `${speaker}-lively` : speaker,
        ...(req.speed ? { speed: req.speed } : {}), ...(req.pauseScale ? { pause_scale: req.pauseScale } : {}) });
      const r = await post(`${baseUrl}/synthesize`, body, 900_000);
      if (r.status !== 200) throw new Error(`speaker voice service ${r.status}`);
      const seconds = Math.max(1, Math.ceil(Number(r.headers['x-audio-seconds'] ?? '0')));
      return { audio: new Uint8Array(r.body), mime: 'audio/wav', seconds };
    },
  };
}

// node:http instead of fetch: fetch gives up waiting for response headers after
// 300 s, and a long paragraph on a CPU can take longer than that.
function post(url: string, body: string, timeoutMs: number): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: Buffer }> {
  return new Promise((resolve, reject) => {
    const rq = http.request(url, { method: 'POST', headers: { 'content-type': 'application/json', 'content-length': Buffer.byteLength(body) } }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode ?? 0, headers: res.headers, body: Buffer.concat(chunks) }));
      res.on('error', reject);
    });
    rq.setTimeout(timeoutMs, () => rq.destroy(new Error('speaker voice service timed out')));
    rq.on('error', reject);
    rq.end(body);
  });
}
