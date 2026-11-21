// Text helpers shared by the editor and the server.

// Arabic diacritics (tashkeel), tatweel and our emotion-tag markup are not charged.
const TASHKEEL = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;
export const TAG_RE = /\[\/?(ضحك|همس|حزن|غضب|أسرع|أبطأ)\]/g;

export const EMOTION_TAGS = [
  { id: 'ضحك', label: 'ضحك' },
  { id: 'همس', label: 'همس' },
  { id: 'حزن', label: 'حزن' },
  { id: 'غضب', label: 'غضب' },
  { id: 'أسرع', label: 'أسرع' },
  { id: 'أبطأ', label: 'أبطأ' },
] as const;

export function plainText(input: string): string {
  return input.replace(TAG_RE, '').replace(TASHKEEL, '').replace(/\s+/g, ' ').trim();
}

export function countChars(input: string): number {
  return plainText(input).length;
}

export function countWords(input: string): number {
  const t = plainText(input);
  return t ? t.split(' ').length : 0;
}

// About 14 characters per second of Arabic speech. Always at least 1 second.
export const CHARS_PER_SECOND = 14;
export function estimateSeconds(input: string): number {
  const c = countChars(input);
  return c === 0 ? 0 : Math.max(1, Math.ceil(c / CHARS_PER_SECOND));
}

export const MAX_CHARS_PER_REQUEST = 5000;
export const FREE_REGEN_MAX_WORDS = 500;

export function formatSeconds(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Arabic number agreement: 1 and 2 have their own forms, 3 to 10 take the
// plural, 11 and up take the singular accusative.
type Forms = [one: string, two: string, few: string, many: string];
const SEC: Forms = ['ثانية واحدة', 'ثانيتان', 'ثوانٍ', 'ثانية'];
const MIN: Forms = ['دقيقة واحدة', 'دقيقتان', 'دقائق', 'دقيقة'];
const HOUR: Forms = ['ساعة واحدة', 'ساعتان', 'ساعات', 'ساعة'];

export function arabicCount(n: number, f: Forms): string {
  if (n === 1) return f[0];
  if (n === 2) return f[1];
  const mod = n % 100;
  return `${n} ${mod >= 3 && mod <= 10 ? f[2] : f[3]}`;
}

export function formatBalance(total: number): string {
  if (total < 60) return arabicCount(total, SEC);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h === 0) return arabicCount(m, MIN);
  return m ? `${arabicCount(h, HOUR)} و${arabicCount(m, MIN)}` : arabicCount(h, HOUR);
}
