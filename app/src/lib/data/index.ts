import { fakeData } from './fake';
import type { DataLayer } from './layer';

// The only place that picks the implementation. /replica-backend swaps it.
export const data: DataLayer = fakeData;
