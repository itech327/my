import { fakeData } from './fake';
import type { DataLayer } from './layer';

// The only place that picks the implementation. In-memory for local runs; the D1
// layer (./d1.ts, tested by `npm run test:d1`) is wired in when the app moves to
// Cloudflare Workers, which needs the Workers Paid plan.
export const data: DataLayer = fakeData;
