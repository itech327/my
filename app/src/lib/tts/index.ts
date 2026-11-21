import type { DialectCode } from '../dialects';
import { fakeProvider } from './fake';
import { piperProvider } from './piper';
import type { SynthesisRequest, SynthesisResult, TtsProvider } from './provider';

// Routes each dialect to the engine that can speak it. Moroccan Darija uses the
// open Piper voice when TTS_DARIJA_URL is set. Every other dialect stays on the
// placeholder until it has an engine of its own.
const darijaUrl = process.env.TTS_DARIJA_URL;
const routes: Partial<Record<DialectCode, TtsProvider>> = darijaUrl ? { 'ar-MA': piperProvider(darijaUrl) } : {};

export function providerFor(dialect: DialectCode): TtsProvider {
  return routes[dialect] ?? fakeProvider;
}

export function getProvider(): TtsProvider {
  return {
    id: 'router',
    synthesize: (req: SynthesisRequest): Promise<SynthesisResult> => providerFor(req.dialect).synthesize(req),
  };
}
