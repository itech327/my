import type { DialectCode } from './dialects';

export type UseCase = 'documentary' | 'ads' | 'education' | 'dialogue' | 'podcast' | 'stories';

export const USE_CASE_LABELS: Record<UseCase, string> = {
  documentary: 'وثائقي',
  ads: 'إعلانات',
  education: 'تعليم',
  dialogue: 'حوار',
  podcast: 'بودكاست',
  stories: 'قصص',
};

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  createdAt: string;
}

export interface Voice {
  id: string;
  name: string;
  dialect: DialectCode;
  gender: 'female' | 'male';
  useCase: UseCase;
  isPremium: boolean;
  ownerId: string | null;
  slow?: boolean; // studio-quality engine that takes about a minute per short paragraph on CPU
  styles?: VoiceStyle[]; // tones this voice offers, from its reference clips
  steerable?: boolean;    // engine follows written style and accent (Gemini)
}

export type VoiceStyle = 'calm' | 'lively';
export const STYLE_LABELS: Record<VoiceStyle, string> = { calm: 'هادئة', lively: 'حيّة' };

export type GenerationStatus = 'queued' | 'running' | 'done' | 'failed' | 'expired';

export interface Generation {
  id: string;
  userId: string;
  kind: 'tts' | 'sfx';
  voiceId: string | null;
  dialect: DialectCode | null;
  inputText: string;
  charCount: number;
  wordCount: number;
  status: GenerationStatus;
  secondsReserved: number;
  secondsCharged: number | null;
  error: string | null;
  regeneratedFrom: string | null;
  style: VoiceStyle | null;
  delivery: string | null;
  pace: string | null;
  accent: string | null;
  isFreeRegen: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface Balance {
  secondsLeft: number;
  nextExpiry: string | null;
}

export interface Plan {
  id: 'free' | 'starter' | 'creator' | 'pro' | 'studio';
  name: string;
  priceUsd: number;
  periodMonths: number;
  seconds: number;
  highlight?: boolean;
}

export type Result<T> = { ok: true; value: T } | { ok: false; error: string; code: ErrorCode };
export type ErrorCode = 'not_found' | 'forbidden' | 'insufficient_credits' | 'invalid' | 'conflict' | 'provider_failed';
