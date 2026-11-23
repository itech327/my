import 'server-only';
import { randomBytes } from 'node:crypto';

// Audio made through the MCP connector, kept in memory for 7 days behind an
// unguessable id. The link is the only key, so anyone holding it can listen,
// the same as a private share link. Moves to object storage with the backend.
const TTL_MS = 7 * 24 * 3600 * 1000;
const MAX_ITEMS = 200;

type Item = { audio: Uint8Array; mime: string; expires: number };
const g = globalThis as unknown as { __mcpAudio?: Map<string, Item> };
const store = (g.__mcpAudio ??= new Map());

export function putAudio(audio: Uint8Array, mime: string): string {
  const now = Date.now();
  for (const [k, v] of store) if (v.expires < now) store.delete(k);
  while (store.size >= MAX_ITEMS) store.delete(store.keys().next().value!);
  const id = randomBytes(18).toString('base64url');
  store.set(id, { audio, mime, expires: now + TTL_MS });
  return id;
}

export function getAudio(id: string): Item | null {
  const it = store.get(id);
  if (!it || it.expires < Date.now()) return null;
  return it;
}
