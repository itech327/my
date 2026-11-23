// Moroccan Darija text front end, shared by the app and the Cloudflare connector.
// A TypeScript port of .claude/skills/darija-voice/scripts/normalize.py. With
// profile 'open' it matches the Python output exactly (checked by
// app/scripts/test-normalize.mts on the Python test set and more).
//
// Profiles:
//   'open'         our F5/Piper voices: everything, plus the DODa spellings they
//                  were trained on (needs `vocab`) and letters they know (ڭ/گ -> ق).
//   'gemini'       Darija mode on Gemini: numbers in Darija, Arabizi, French words,
//                  units, clean-up and respellings. Keeps hamzas and گ, which
//                  Gemini reads correctly.
//   'gemini-fusha' Standard Arabic on Gemini: clean-up and respellings only.
// Only standard JavaScript, so it runs on Workers and in Node.

import respellData from './darija/respell.json';

export type NormalizeProfile = 'open' | 'gemini' | 'gemini-fusha';

// --- numbers ---------------------------------------------------------------
const ONES = ['صفر', 'واحد', 'جوج', 'تلاتة', 'ربعة', 'خمسة', 'ستة', 'سبعة', 'تمنية', 'تسعود'];
// units inside compounds use "تنين" not "جوج": 22 = تنين وعشرين
const UNIT_IN_COMPOUND = ['', 'واحد', 'تنين', 'تلاتة', 'ربعة', 'خمسة', 'ستة', 'سبعة', 'تمنية', 'تسعة'];
const TEENS: Record<number, string> = {
  10: 'عشرة', 11: 'حضاش', 12: 'طناش', 13: 'تلطاش', 14: 'ربعطاش', 15: 'خمسطاش', 16: 'سطاش', 17: 'سبعطاش', 18: 'تمنطاش', 19: 'تسعطاش',
};
const TENS: Record<number, string> = { 20: 'عشرين', 30: 'تلاتين', 40: 'ربعين', 50: 'خمسين', 60: 'ستين', 70: 'سبعين', 80: 'تمانين', 90: 'تسعين' };
const HUNDREDS: Record<number, string> = { 1: 'مية', 2: 'ميتين', 3: 'تلتمية', 4: 'ربعمية', 5: 'خمسمية', 6: 'ستمية', 7: 'سبعمية', 8: 'تمنمية', 9: 'تسعمية' };

function below100(n: number, standalone: boolean): string {
  if (n < 10) return standalone ? ONES[n] : UNIT_IN_COMPOUND[n];
  if (n < 20) return TEENS[n];
  const t = Math.floor(n / 10), u = n % 10;
  return u === 0 ? TENS[t * 10] : `${UNIT_IN_COMPOUND[u]} و${TENS[t * 10]}`;
}

function below1000(n: number, standalone = true): string {
  const h = Math.floor(n / 100), r = n % 100;
  const parts: string[] = [];
  if (h) parts.push(HUNDREDS[h]);
  if (r || !h) parts.push(below100(r, standalone && !h));
  return parts.join(' و');
}

function thousands(k: number): string {
  if (k === 1) return 'ألف';
  if (k === 2) return 'جوج آلاف';
  if (k >= 3 && k <= 10) return `${below100(k, true)} آلاف`;
  return `${below1000(k)} ألف`;
}

export function numberToDarija(n: number): string {
  if (n < 0) return 'ناقص ' + numberToDarija(-n);
  if (n < 1000) return below1000(n);
  if (n < 1_000_000) {
    const k = Math.floor(n / 1000), r = n % 1000;
    return thousands(k) + (r ? ` و${below1000(r, false)}` : '');
  }
  const m = Math.floor(n / 1_000_000), r = n % 1_000_000;
  const head = m === 1 ? 'مليون' : m === 2 ? 'جوج مليون' : `${below1000(m)} مليون`;
  return head + (r ? ` و${numberToDarija(r)}` : '');
}

function spellNumber(token: string): string {
  const tok = token.replace(/,/g, '');
  if (tok.includes('.')) {
    const i = tok.indexOf('.');
    const a = tok.slice(0, i), b = tok.slice(i + 1);
    return `${numberToDarija(Number(a || 0))} فاصلة ${[...b].map((d) => ONES[Number(d)]).join(' ')}`;
  }
  if (tok.length > 9) return [...tok].map((d) => ONES[Number(d)]).join(' '); // phone numbers, long ids
  return numberToDarija(Number(tok));
}

// --- arabizi ---------------------------------------------------------------
const DIGRAPHS: [string, string][] = [['ch', 'ش'], ['sh', 'ش'], ['kh', 'خ'], ['gh', 'غ'], ['dj', 'ج'], ['ou', 'و'], ['th', 'ث']];
const SINGLE: Record<string, string> = {
  '3': 'ع', '7': 'ح', '9': 'ق', '5': 'خ', '2': 'ء', '8': 'ه', b: 'ب', t: 'ت', j: 'ج', h: 'ه', d: 'د', r: 'ر', z: 'ز', s: 'س',
  f: 'ف', q: 'ق', k: 'ك', l: 'ل', m: 'م', n: 'ن', w: 'و', y: 'ي', g: 'ڭ', v: 'ف', p: 'ب', x: 'كس', c: 'ك', i: 'ي', u: 'و', o: 'و',
};
// frequent Darija words, spelled the way people write them
const LEXICON: Record<string, string> = {
  wach: 'واش', wech: 'واش', '3afak': 'عافاك', safi: 'صافي', bzaf: 'بزاف', bezzaf: 'بزاف', daba: 'دابا', mzyan: 'مزيان', mezyan: 'مزيان',
  zwin: 'زوين', zwina: 'زوينة', kifach: 'كيفاش', fin: 'فين', chno: 'شنو', chnou: 'شنو', ana: 'أنا', nta: 'نتا', nti: 'نتي', howa: 'هوا',
  hiya: 'هيا', hna: 'حنا', '7na': 'حنا', ntoma: 'نتوما', homa: 'هوما', bghit: 'بغيت', khoya: 'خويا', khti: 'ختي', salam: 'سلام',
  labas: 'لاباس', lah: 'الله', allah: 'الله', inchallah: 'إن شاء الله', nchallah: 'نشالله', hamdollah: 'الحمد لله', baraka: 'باركة',
  chokran: 'شكرا', choukran: 'شكرا', mra: 'مرة', dyal: 'ديال', dial: 'ديال', had: 'هاد', hadi: 'هادي', hada: 'هادا', ghadi: 'غادي',
  ghir: 'غير', walo: 'والو', kolchi: 'كلشي', chi: 'شي', mn: 'من', men: 'من', f: 'ف', l: 'ل', w: 'و', o: 'و', ma: 'ما', la: 'لا',
  iyeh: 'إيه', ah: 'آه', ewa: 'إيوا', yallah: 'يالله', ta: 'تا', tal: 'تال', lyoum: 'اليوم', ghda: 'غدا', lbar7: 'البارح', sbah: 'صباح',
  lil: 'الليل', flous: 'فلوس', dar: 'دار', sift: 'صيفط', sifet: 'صيفط', lia: 'ليا', liya: 'ليا', lik: 'ليك', lih: 'ليه', liha: 'ليها',
  mwajed: 'موجد', wajed: 'واجد', lmatch: 'الماتش', match: 'ماتش', khdma: 'خدمة', lkhdma: 'الخدمة', bghiti: 'بغيتي', tchri: 'تشري',
  nchri: 'نشري', jib: 'جيب', jibi: 'جيبي', kayn: 'كاين', kayna: 'كاينة', n3tik: 'نعطيك', n3tikom: 'نعطيكم', '3tini': 'عطيني',
  '3tih': 'عطيه', wasfa: 'وصفة', lwasfa: 'الوصفة', khodra: 'خضرة', lkhodra: 'الخضرة', l7em: 'اللحم', l7am: 'اللحم', lham: 'اللحم',
  gram: 'ڭرام', bssa7tkom: 'بصحتكم', bsa7tkom: 'بصحتكم', bssa7tek: 'بصحتك', bsa7tek: 'بصحتك', smiti: 'سميتي', tajine: 'طاجين',
  tajin: 'طاجين', khassek: 'خاصك', khassni: 'خاصني', khass: 'خاص', zitoun: 'زيتون', zzitoun: 'الزيتون', '3likom': 'عليكم',
  '3lik': 'عليك', wa7d: 'واحد', wahed: 'واحد', tomatich: 'ماطيشة', ara: 'أرا', aji: 'أجي', bttikha: 'بطيخة', btikha: 'بطيخة',
  dlla7: 'الدلاح', nakloha: 'ناكلوها', naklo: 'ناكلو', kol: 'كول', ssbah: 'الصباح', sba7: 'صباح', ssba7: 'الصباح',
  l3cha: 'العشا', lftour: 'الفطور', atay: 'أتاي', lkhobz: 'الخبز', khobz: 'خبز', dyali: 'ديالي', dyalek: 'ديالك', dyalo: 'ديالو',
  dyalha: 'ديالها', dyalna: 'ديالنا', dyalkom: 'ديالكم', dyalhom: 'ديالهم', dialna: 'ديالنا', makaynch: 'ماكاينش',
  ma3ndich: 'ماعنديش', '3ndi': 'عندي', '3andi': 'عندي', m3a: 'مع', ta7aja: 'تاحاجة',
};
// French words as Moroccans say them, written for an Arabic voice
const FRENCH_SPOKEN: Record<string, string> = {
  adresse: 'لادريس', "l'adresse": 'لادريس', message: 'ميساج', mail: 'ميل', email: 'إيميل', internet: 'لانترنيت', wifi: 'الويفي',
  ok: 'أوكي', merci: 'ميرسي', bonjour: 'بونجور', oui: 'وي', non: 'نو', video: 'فيديو', 'vidéo': 'فيديو', 'très': 'تري', tres: 'تري',
  portable: 'بورطابل', tomobile: 'طوموبيل', voiture: 'فواتير', bus: 'الطوبيس', taxi: 'طاكسي', 'café': 'قهوة', cafe: 'قهوة',
  'rendez-vous': 'روندي فو', normal: 'نورمال', normalement: 'نورمالمون', facebook: 'فيسبوك', whatsapp: 'واتساب',
  instagram: 'إنستغرام', youtube: 'يوتيوب', google: 'ڭوڭل',
};
// common French words that stay Latin (the reader says them in French)
const FRENCH = new Set(['le', 'la', 'les', 'de', 'des', 'du', 'et', 'un', 'une', 'pour', 'avec', 'mais', ...Object.keys(FRENCH_SPOKEN)]);
const SUN_DOUBLE = /^(tt|dd|rr|zz|ss|nn|ll)/;
const has = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);

function looksArabizi(w: string): boolean {
  const lw = w.toLowerCase();
  if (has(LEXICON, lw)) return true;
  if (FRENCH.has(lw) || !/^[a-z0-9']+$/.test(lw)) return false;
  return (/[a-z]/.test(lw) && /[23579]/.test(lw)) || (/(kh|gh|ch)/.test(lw) && !/[éèêàç]/.test(lw));
}

function arabiziWord(w: string): string {
  let lw = w.toLowerCase().replace(/'/g, '');
  if (has(LEXICON, lw)) return LEXICON[lw];
  let prefix = '';
  // assimilated article: a doubled sun letter at the start is "ال" ("ddar" -> الدار)
  if (/^(tt|dd|rr|zz|ss|nn|ll)(?=[a-z0-9])/.test(lw) && lw.length > 3) {
    prefix = 'ال';
    lw = lw.slice(1);
  }
  if (prefix && has(LEXICON, lw)) return prefix + LEXICON[lw].replace(/^ال/, '');
  const m = /^(e?l)(?=[^aeiou])/.exec(lw);
  if (m && lw.length > 3 && !SUN_DOUBLE.test(lw)) {
    prefix = 'ال';
    lw = lw.slice(m[0].length);
  }
  const out: string[] = [];
  let i = 0;
  while (i < lw.length) {
    const two = lw.slice(i, i + 2);
    const hit = DIGRAPHS.find(([lat]) => two === lat)?.[1];
    if (hit) { out.push(hit); i += 2; continue; }
    const ch = lw[i];
    const next = lw.slice(i + 1, i + 2);
    if ('ou'.includes(ch) && i > 0 && i < lw.length - 1 && !'ou'.includes(next)) { i += 1; continue; } // short vowel
    if ('ae'.includes(ch)) {
      // short vowels are not written in Darija, except a long or final "a"
      if (ch === 'a' && (i === lw.length - 1 || next === 'a')) out.push(i ? 'ا' : 'أ');
      else if (ch === 'a' && i === 0) out.push('أ');
      i += next === ch ? 2 : 1;
      continue;
    }
    out.push(has(SINGLE, ch) ? SINGLE[ch] : '');
    i += 1;
  }
  let word = out.join('');
  if ([...word].length > 2) word = word.replace(/(.)\1+/gu, '$1');
  return prefix + word;
}

// --- pipeline --------------------------------------------------------------
const EMOJI = /[\u{1F000}-\u{1FAFF}☀-➿️]/gu;
const ARABIC_DIGITS: Record<string, string> = Object.fromEntries(
  [...'٠١٢٣٤٥٦٧٨٩'].map((d, i) => [d, String(i)]).concat([...'۰۱۲۳۴۵۶۷۸۹'].map((d, i) => [d, String(i)])),
);
const AR_WORD = /[ء-ي]+/g;
const NOT_LETTER = '(?![\\u0621-\\u064Aa-zA-Z])';
const UNITS: [string, string][] = [
  ['كلم|كم|km|KM', 'كيلومتر'], ['كغ|kg|KG', 'كيلو'], ['سم|cm', 'سونتيمتر'], ['مم|mm', 'ميليمتر'],
  ['لتر|l(?![\\p{L}\\p{N}_])', 'لتر'], ['م|m(?![\\p{L}\\p{N}_])', 'متر'], ['h|س', 'ساعة'], ['min|د', 'دقيقة'],
];
export const RESPELL: Record<string, string> = respellData as Record<string, string>;

function dodaSpelling(word: string, vocab: Map<string, number>): string {
  if (!vocab.size || vocab.has(word)) return word;
  const noHamza = word.replace(/[أإآ]/g, 'ا');
  const variants = new Set([
    noHamza, noHamza.replace(/ئ/g, 'ي').replace(/ؤ/g, 'و'), word.replace(/ى/g, 'ا'), word.replace(/ى/g, 'ي'), noHamza.replace(/ى/g, 'ي'),
  ]);
  variants.delete(word);
  // Python: max((count, variant)) -> highest count, ties broken by the larger string
  let best: [number, string] | null = null;
  for (const v of variants) {
    const n = vocab.get(v);
    if (n === undefined) continue;
    if (!best || n > best[0] || (n === best[0] && v > best[1])) best = [n, v];
  }
  return best ? best[1] : word;
}

export interface NormalizeOptions {
  profile?: NormalizeProfile;
  vocab?: Map<string, number>;          // DODa word counts, profile 'open' only
  respell?: Record<string, string>;     // defaults to the shared respell list
}

export function normalizeDarija(text: string, opts: NormalizeOptions = {}): string {
  const profile = opts.profile ?? 'gemini';
  const respell = opts.respell ?? RESPELL;
  let t = text.normalize('NFKC').replace(/[٠-٩۰-۹]/g, (d) => ARABIC_DIGITS[d]).replace(/ـ/g, '');
  t = t.replace(EMOJI, ' ');
  t = t.replace(/([ء-ي])\1{2,}/gu, '$1$1'); // stretched Arabic letters
  t = t.replace(/([!?؟.])\1+/g, '$1');
  // Maths: "5x6" is read "5 في 6" in Darija and "5 مضروبة في 6" in Standard Arabic;
  // "(-3)" and "5 - 3" are read with "ناقص" (never "سالب").
  t = t.replace(/(\d)\s*[x×✕*]\s*(?=\d)/gi, `$1 ${profile === 'gemini-fusha' ? 'مضروبة في' : 'في'} `);
  t = t.replace(/(^|[\s(،,:;])[-−–]\s?(?=\d)/g, '$1ناقص ');

  if (profile !== 'gemini-fusha') {
    t = t.replace(/(\d+)\s*%/g, '$1 فالمية');
    t = t.replace(/(\d+)\s*(dh|DH|MAD|درهم)(?![\p{L}\p{N}_])/gu, '$1 درهم');
    // units after a number: "2 كلم" would be read as the verb كلّم
    for (const [pat, word] of UNITS) t = t.replace(new RegExp(`(\\d+)\\s*(?:${pat})${NOT_LETTER}`, 'gu'), `$1 ${word}`);

    const latin = (t.match(/[A-Za-z0-9']+/g) ?? []).filter((w) => /[A-Za-z]/.test(w));
    const mostlyArabizi = latin.length > 0 && latin.filter(looksArabizi).length / latin.length >= 0.4;
    t = t.replace(/[A-Za-z0-9'éèêàç]+(?:[.,]\d+)?/g, (w) => {
      if (/^\d[\d,]*(\.\d+)?$/.test(w)) return spellNumber(w);
      if (looksArabizi(w) || (mostlyArabizi && !FRENCH.has(w.toLowerCase()) && /^[A-Za-z0-9']+$/.test(w))) return arabiziWord(w);
      return w;
    });
    t = t.replace(/[A-Za-z'éèêàç-]+/g, (w) => (has(FRENCH_SPOKEN, w.toLowerCase()) ? FRENCH_SPOKEN[w.toLowerCase()] : arabiziWord(w)));
    t = t.replace(/(?<=\d)(?=[؀-ۿ])|(?<=[؀-ۿ])(?=\d)/g, ' ');
    t = t.replace(/\d[\d,]*(\.\d+)?/g, (w) => spellNumber(w));
  }
  if (profile === 'open') {
    t = t.replace(/ڭ/g, 'ق').replace(/گ/g, 'ق').replace(/ڤ/g, 'ف').replace(/پ/g, 'ب').replace(/ک/g, 'ك').replace(/ی/g, 'ي');
  } else {
    // Gemini reads گ as the Moroccan "g"; use the common form of the letter
    t = t.replace(/ڭ/g, 'گ').replace(/ک/g, 'ك').replace(/ی/g, 'ي');
  }
  t = t.replace(/["«»“”()[\]{}*_#]/g, ' ');
  if (!/[A-Za-z]/.test(t)) t = t.replace(/,/g, '،').replace(/\?/g, '؟').replace(/;/g, '؛'); // fully Arabic now
  t = t.replace(/\s+/g, ' ').trim();
  if (profile === 'open' && opts.vocab) {
    const vocab = opts.vocab;
    t = t.replace(AR_WORD, (w) => dodaSpelling(w, vocab));
  }
  t = t.replace(AR_WORD, (w) => (has(respell, w) ? respell[w] : w));
  return t;
}
