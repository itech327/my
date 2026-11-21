import type { DialectCode } from '../dialects';
import type { Balance, Generation, Result, User, Voice, VoiceStyle } from '../types';

// The one interface every screen and route uses. The fake implementation keeps
// data in memory. /replica-backend writes a Supabase one with the same shape.
export interface DataLayer {
  // users and sessions
  createUser(email: string, password: string): Promise<Result<User>>;
  verifyUser(email: string, password: string): Promise<Result<User>>;
  getUser(id: string): Promise<User | null>;
  deleteUser(id: string): Promise<void>;
  createSession(userId: string): Promise<string>;
  userForSession(token: string): Promise<User | null>;
  endSession(token: string): Promise<void>;

  // free trial: once per email, ever
  claimTrial(userId: string): Promise<boolean>;

  // credits
  getBalance(userId: string): Promise<Balance>;
  grantSeconds(userId: string, seconds: number, source: 'trial' | 'purchase', expiresAt: Date | null): Promise<void>;

  // voices
  listVoices(filter: { dialect?: DialectCode; userId?: string }): Promise<Voice[]>;
  getVoice(id: string): Promise<Voice | null>;

  // generations
  createGeneration(input: {
    userId: string; voiceId: string; dialect: DialectCode; text: string; regeneratedFrom?: string; style?: VoiceStyle;
  }): Promise<Result<Generation>>;
  getGeneration(id: string, userId: string): Promise<Generation | null>;
  listGenerations(userId: string, limit?: number): Promise<Generation[]>;
  completeGeneration(id: string, audio: Uint8Array, mime: string, seconds: number): Promise<void>;
  failGeneration(id: string, error: string): Promise<void>;
  getAudio(id: string, userId: string): Promise<{ audio: Uint8Array; mime: string } | null>;
}
