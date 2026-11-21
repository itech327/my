import type { DialectCode } from '../dialects';

export interface SynthesisRequest {
  voiceId: string;
  dialect: DialectCode;
  text: string; // with our own emotion-tag markup
  style?: 'calm' | 'lively';
  styleText?: string;            // delivery description for engines steered by words (Gemini)
  speed?: number;                // for engines with a speed control (F5)
  pauseScale?: number;           // longer or shorter pauses between sentences
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
