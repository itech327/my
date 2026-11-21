import 'server-only';
import { data } from './data';
import { getProvider } from './tts';
import type { DialectCode } from './dialects';
import type { Generation, Result, VoiceStyle } from './types';
import { deliveryById, geminiStyle, paceById, type DeliveryId, type PaceId } from './delivery';

// Create, synthesize, settle. With a real engine the synthesize step moves to a
// background job (see architecture.md) and the client polls GET /api/generations/:id.
export async function runGeneration(input: {
  userId: string; voiceId: string; dialect: DialectCode; text: string; regeneratedFrom?: string; style?: VoiceStyle; delivery?: DeliveryId; pace?: PaceId;
}): Promise<Result<Generation>> {
  const created = await data.createGeneration(input);
  if (!created.ok) return created;
  const gen = created.value;
  try {
    const out = await getProvider().synthesize({
      voiceId: gen.voiceId!, dialect: gen.dialect!, text: gen.inputText, style: gen.style ?? undefined,
      styleText: geminiStyle(gen.delivery as DeliveryId | null, gen.pace as PaceId | null),
      speed: paceById(gen.pace)?.speed, pauseScale: paceById(gen.pace)?.pauseScale,
    });
    await data.completeGeneration(gen.id, out.audio, out.mime, out.seconds);
  } catch (e) {
    await data.failGeneration(gen.id, e instanceof Error ? e.message : 'synthesis failed');
  }
  const final = await data.getGeneration(gen.id, input.userId);
  return final ? { ok: true, value: final } : { ok: false, code: 'not_found', error: 'not found' };
}

export const STATUS_FOR: Record<string, number> = { not_found: 404, forbidden: 403, insufficient_credits: 402, invalid: 400, conflict: 409, provider_failed: 502 };
