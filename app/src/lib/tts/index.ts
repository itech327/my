import type { DialectCode } from '../dialects';
import { fakeProvider } from './fake';
import { piperProvider } from './piper';
import { f5Provider } from './f5';
import { geminiProvider } from './gemini';
import type { SynthesisRequest, SynthesisResult, TtsProvider } from './provider';

// Routing, most specific first:
//   1. a voice with its own engine (the DODa female speaker, via F5-TTS)
//   2. a dialect engine (Moroccan Darija, via the fast Piper voice)
//   3. the placeholder, for dialects that have no engine yet
const darijaUrl = process.env.TTS_DARIJA_URL;
const speakerUrl = process.env.TTS_SPEAKERS_URL;

// Both Moroccan voices use the studio engine when it is available. Without it,
// إدريس falls back to the fast Piper voice (same speaker, M1).
const byVoice: Record<string, TtsProvider> = {
  ...(speakerUrl ? { 'v-ar-MA-f1': f5Provider(speakerUrl, 'F1'), 'v-ar-MA-0': f5Provider(speakerUrl, 'M1') } : {}),
  // Gemini TTS (official API, key injected by the network proxy). Darija is not officially supported: measure it.
  ...(process.env.TTS_GEMINI === '1' ? { 'v-ar-MA-g1': geminiProvider('Kore'), 'v-ar-MA-g2': geminiProvider('Charon') } : {}),
};
const byDialect: Partial<Record<DialectCode, TtsProvider>> = darijaUrl ? { 'ar-MA': piperProvider(darijaUrl) } : {};

export function providerFor(req: Pick<SynthesisRequest, 'voiceId' | 'dialect'>): TtsProvider {
  return byVoice[req.voiceId] ?? byDialect[req.dialect] ?? fakeProvider;
}

export function getProvider(): TtsProvider {
  return { id: 'router', synthesize: (req: SynthesisRequest): Promise<SynthesisResult> => providerFor(req).synthesize(req) };
}
