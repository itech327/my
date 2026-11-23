import 'server-only';
import type { RegisterId } from './delivery';
import { rewriteWith } from './rewrite-core';

// The key is injected by the session's network proxy; elsewhere set GEMINI_API_KEY.
export const rewriteText = (text: string, register?: RegisterId | null) =>
  rewriteWith(process.env.GEMINI_API_KEY ?? 'proxy-injected', text, register);
