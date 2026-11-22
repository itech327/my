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

// When Google refuses for any reason (quota 429, overload, key or network problem),
// a free voice speaks instead, if one is running. The reason goes to the server log.
function withQuotaFallback(primary: TtsProvider, backup: TtsProvider | undefined, backupName: string): TtsProvider {
  if (!backup) return primary;
  return {
    id: primary.id,
    async synthesize(req) {
      try {
        return await primary.synthesize(req);
      } catch (e) {
        // Any refusal from Google (quota, overload, key or network problem): the free voice speaks.
        console.error(`[tts] ${primary.id} failed, using ${backupName}: ${(e instanceof Error ? e.message : String(e)).slice(0, 200)}`);
        return { ...(await backup.synthesize(req)), fallback: backupName };
      }
    },
  };
}

// Both Moroccan voices use the studio engine when it is available. Without it,
// إدريس falls back to the fast Piper voice (same speaker, M1).
const byVoice: Record<string, TtsProvider> = {
  ...(speakerUrl ? { 'v-ar-MA-f1': f5Provider(speakerUrl, 'F1'), 'v-ar-MA-0': f5Provider(speakerUrl, 'M1') } : {}),
  // Gemini TTS (official API, key injected by the network proxy). Darija is not officially supported: measure it.
  ...(process.env.TTS_GEMINI === '1' ? {
    // Backup when Google refuses: the studio voices (F5) if running, else the fast Piper voice
    // of إدريس, which runs well on any CPU (e.g. an Intel Mac).
    'v-ar-MA-g1': speakerUrl
      ? withQuotaFallback(geminiProvider('Kore', 'female'), f5Provider(speakerUrl, 'F1'), 'هند')
      : withQuotaFallback(geminiProvider('Kore', 'female'), darijaUrl ? piperProvider(darijaUrl) : undefined, 'إدريس'),
    'v-ar-MA-g2': withQuotaFallback(geminiProvider('Charon', 'male'),
      speakerUrl ? f5Provider(speakerUrl, 'M1') : darijaUrl ? piperProvider(darijaUrl) : undefined, 'إدريس'),
  } : {}),
};
const byDialect: Partial<Record<DialectCode, TtsProvider>> = darijaUrl ? { 'ar-MA': piperProvider(darijaUrl) } : {};

export function providerFor(req: Pick<SynthesisRequest, 'voiceId' | 'dialect'>): TtsProvider {
  return byVoice[req.voiceId] ?? byDialect[req.dialect] ?? fakeProvider;
}

export function getProvider(): TtsProvider {
  return { id: 'router', synthesize: (req: SynthesisRequest): Promise<SynthesisResult> => providerFor(req).synthesize(req) };
}
