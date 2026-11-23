import { getCloudflareContext } from '@opennextjs/cloudflare';
import { d1Data, type D1Like, type KVLike } from './d1';
import { fakeData } from './fake';
import type { DataLayer } from './layer';

// The only place that picks the implementation, per call:
//   - on Cloudflare (Workers, or `next dev` / `wrangler dev` with local bindings) the D1 layer,
//     when the DB and AUDIO bindings exist (see wrangler.jsonc);
//   - anywhere else (`npm start` on a laptop) the in-memory layer.
let d1: DataLayer | undefined;
let d1Env: unknown;

function pick(): DataLayer {
  try {
    const { env } = getCloudflareContext() as { env: { DB?: D1Like; AUDIO?: KVLike } };
    if (env?.DB && env?.AUDIO) {
      if (!d1 || d1Env !== env) { d1 = d1Data(env.DB, env.AUDIO); d1Env = env; }
      return d1;
    }
  } catch {
    // no Cloudflare context here
  }
  return fakeData;
}

// Bindings only exist while a request runs, so the layer is looked up on every call.
export const data: DataLayer = new Proxy({} as DataLayer, {
  get: (_t, key) => {
    if (typeof key === 'symbol' || key === 'then') return undefined;
    return (...args: unknown[]) => (pick() as unknown as Record<string, (...a: unknown[]) => unknown>)[key](...args);
  },
});
