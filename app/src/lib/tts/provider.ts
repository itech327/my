import type { DialectCode } from '../dialects';

export interface SynthesisRequest {
  voiceId: string;
  dialect: DialectCode;
  text: string; // with our own emotion-tag markup
}

export interface SynthesisResult {
  audio: Uint8Array;
  mime: 'audio/wav' | 'audio/mpeg';
  seconds: number;
}

// Every speech engine sits behind this. See replica/architecture.md.
export interface TtsProvider {
  id: string;
  synthesize(req: SynthesisRequest): Promise<SynthesisResult>;
}
