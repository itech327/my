import { DIALECTS } from '../dialects';
import type { UseCase, Voice } from '../types';

// The built-in voice catalog, shared by every data layer. Cloned voices
// (ownerId set) will live in the database once cloning exists.
const FEMALE = ['ليلى', 'هدى', 'سارة', 'رانية', 'دينا', 'زينب', 'سلوى', 'ريم', 'إيمان', 'لمياء'];
const MALE = ['كريم', 'طارق', 'عمر', 'زياد', 'أنس', 'بلال', 'هشام', 'إدريس', 'سامي', 'نبيل'];
const USES: UseCase[] = ['ads', 'stories', 'documentary', 'education', 'podcast', 'dialogue'];

export function seedVoices(): Voice[] {
  const out: Voice[] = [];
  // Google Gemini TTS voices (official API): the main Moroccan engine, chosen by a native
  // listener over our open voices and AudioDarija. Only when that engine is switched on.
  if (process.env.TTS_GEMINI === '1') {
    out.push({ id: 'v-ar-MA-g1', name: 'نور', dialect: 'ar-MA', gender: 'female', useCase: 'ads', isPremium: false, ownerId: null, steerable: true });
    out.push({ id: 'v-ar-MA-g2', name: 'يونس', dialect: 'ar-MA', gender: 'male', useCase: 'documentary', isPremium: false, ownerId: null, steerable: true });
    out.push({ id: 'v-ar-MA-g3', name: 'أكرم', dialect: 'ar-MA', gender: 'male', useCase: 'education', isPremium: false, ownerId: null, steerable: true });
  }
  // Moroccan Darija has one real open voice (Piper darija_m1, male, measured
  // median pitch 141 Hz). List exactly that, so the picker does not promise
  // voices that would all sound the same.
  // DODa speaker M1 (male). Studio engine (F5-TTS) when available, else the fast Piper voice of the same speaker.
  out.push({ id: 'v-ar-MA-0', name: 'إدريس', dialect: 'ar-MA', gender: 'male', useCase: 'dialogue', isPremium: false, ownerId: null, slow: true, styles: ['calm', 'lively'] });
  // DODa speaker F1 (female), via F5-TTS. Higher quality, slower. Premium.
  out.push({ id: 'v-ar-MA-f1', name: 'هند', dialect: 'ar-MA', gender: 'female', useCase: 'stories', isPremium: true, ownerId: null, slow: true, styles: ['calm', 'lively'] });
  DIALECTS.forEach((d, di) => {
    if (d.code === 'ar-MA') return;
    for (let i = 0; i < 4; i++) {
      const female = i % 2 === 0;
      const pool = female ? FEMALE : MALE;
      out.push({
        id: `v-${d.code}-${i}`,
        name: pool[(di * 2 + i) % pool.length],
        dialect: d.code,
        gender: female ? 'female' : 'male',
        useCase: USES[(di + i) % USES.length],
        isPremium: i >= 2,
        ownerId: null,
      });
    }
  });
  return out;
}

