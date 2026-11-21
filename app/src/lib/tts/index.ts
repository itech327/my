import { fakeProvider } from './fake';
import type { TtsProvider } from './provider';

// Swap here once the engine is chosen, e.g. by reading TTS_PROVIDER from env.
export function getProvider(): TtsProvider {
  return fakeProvider;
}
