#!/usr/bin/env python3
"""Moroccan Darija text front end for TTS. Standard library only.

    python3 normalize.py "عندي 25 درهم و 3afak jib l'mail"
    python3 normalize.py --test

What it does, in order:
  1. Unicode clean-up: NFKC, Arabic-Indic digits to ASCII, strip tatweel,
     emoji and repeated letters ("زوييييين" -> "زويين").
  2. Arabizi (Darija in Latin letters with 3 7 9) to Arabic script, word by
     word, only for words that look like Arabizi. French words are left alone.
  3. Numbers to Darija words: 25 -> "خمسة وعشرين", 2 -> "جوج", 1500 -> "ألف وخمسمية".
  4. Moroccan letters the voice model does not know: ڭ/گ -> ق, ڤ -> ف, پ -> ب.
  5. Punctuation kept as pause cues. Latin quotes and brackets removed.
"""
import os
import re
import sys
import unicodedata

# --- numbers ---------------------------------------------------------------
ONES = ['صفر', 'واحد', 'جوج', 'تلاتة', 'ربعة', 'خمسة', 'ستة', 'سبعة', 'تمنية', 'تسعود']
# units inside compounds use "تنين" not "جوج": 22 = تنين وعشرين
UNIT_IN_COMPOUND = ['', 'واحد', 'تنين', 'تلاتة', 'ربعة', 'خمسة', 'ستة', 'سبعة', 'تمنية', 'تسعة']
TEENS = {10: 'عشرة', 11: 'حضاش', 12: 'طناش', 13: 'تلطاش', 14: 'ربعطاش', 15: 'خمسطاش',
         16: 'سطاش', 17: 'سبعطاش', 18: 'تمنطاش', 19: 'تسعطاش'}
TENS = {20: 'عشرين', 30: 'تلاتين', 40: 'ربعين', 50: 'خمسين', 60: 'ستين', 70: 'سبعين', 80: 'تمانين', 90: 'تسعين'}
HUNDREDS = {1: 'مية', 2: 'ميتين', 3: 'تلتمية', 4: 'ربعمية', 5: 'خمسمية', 6: 'ستمية', 7: 'سبعمية', 8: 'تمنمية', 9: 'تسعمية'}


def below_100(n: int, standalone: bool) -> str:
    if n < 10:
        return ONES[n] if standalone else UNIT_IN_COMPOUND[n]
    if n < 20:
        return TEENS[n]
    t, u = divmod(n, 10)
    return TENS[t * 10] if u == 0 else f'{UNIT_IN_COMPOUND[u]} و{TENS[t * 10]}'


def below_1000(n: int, standalone: bool = True) -> str:
    h, r = divmod(n, 100)
    parts = []
    if h:
        parts.append(HUNDREDS[h])
    if r or not h:
        parts.append(below_100(r, standalone and not h))
    return ' و'.join(parts)


def thousands(k: int) -> str:
    if k == 1:
        return 'ألف'
    if k == 2:
        return 'جوج آلاف'
    if 3 <= k <= 10:
        return f'{below_100(k, True)} آلاف'
    return f'{below_1000(k)} ألف'


def number_to_darija(n: int) -> str:
    if n < 0:
        return 'ناقص ' + number_to_darija(-n)
    if n < 1000:
        return below_1000(n)
    if n < 1_000_000:
        k, r = divmod(n, 1000)
        return thousands(k) + (f' و{below_1000(r, False)}' if r else '')
    m, r = divmod(n, 1_000_000)
    head = 'مليون' if m == 1 else ('جوج مليون' if m == 2 else f'{below_1000(m)} مليون')
    return head + (f' و{number_to_darija(r)}' if r else '')


def spell_number(tok: str) -> str:
    tok = tok.replace(',', '')
    if '.' in tok:
        a, b = tok.split('.', 1)
        return f'{number_to_darija(int(a or 0))} فاصلة {" ".join(ONES[int(d)] for d in b)}'
    if len(tok) > 9:  # phone numbers and long ids: read digit by digit
        return ' '.join(ONES[int(d)] for d in tok)
    return number_to_darija(int(tok))


# --- arabizi ---------------------------------------------------------------
DIGRAPHS = [('ch', 'ش'), ('sh', 'ش'), ('kh', 'خ'), ('gh', 'غ'), ('dj', 'ج'), ('ou', 'و'), ('th', 'ث')]
SINGLE = {'3': 'ع', '7': 'ح', '9': 'ق', '5': 'خ', '2': 'ء', '8': 'ه', 'b': 'ب', 't': 'ت', 'j': 'ج', 'h': 'ه',
          'd': 'د', 'r': 'ر', 'z': 'ز', 's': 'س', 'f': 'ف', 'q': 'ق', 'k': 'ك', 'l': 'ل', 'm': 'م',
          'n': 'ن', 'w': 'و', 'y': 'ي', 'g': 'ڭ', 'v': 'ف', 'p': 'ب', 'x': 'كس', 'c': 'ك',
          'i': 'ي', 'u': 'و', 'o': 'و'}
# frequent Darija words, so they are spelled the way people write them
LEXICON = {
    'wach': 'واش', 'wech': 'واش', '3afak': 'عافاك', 'safi': 'صافي', 'bzaf': 'بزاف', 'bezzaf': 'بزاف',
    'daba': 'دابا', 'mzyan': 'مزيان', 'mezyan': 'مزيان', 'zwin': 'زوين', 'zwina': 'زوينة', 'kifach': 'كيفاش',
    'fin': 'فين', 'chno': 'شنو', 'chnou': 'شنو', 'ana': 'أنا', 'nta': 'نتا', 'nti': 'نتي', 'howa': 'هوا',
    'hiya': 'هيا', 'hna': 'حنا', '7na': 'حنا', 'ntoma': 'نتوما', 'homa': 'هوما', 'bghit': 'بغيت',
    'khoya': 'خويا', 'khti': 'ختي', 'salam': 'سلام', 'labas': 'لاباس', 'lah': 'الله', 'allah': 'الله',
    'inchallah': 'إن شاء الله', 'nchallah': 'نشالله', 'hamdollah': 'الحمد لله', 'baraka': 'باركة',
    'chokran': 'شكرا', 'choukran': 'شكرا', 'mra': 'مرة', 'dyal': 'ديال', 'dial': 'ديال', 'had': 'هاد',
    'hadi': 'هادي', 'hada': 'هادا', 'ghadi': 'غادي', 'ghir': 'غير', 'walo': 'والو', 'kolchi': 'كلشي',
    'chi': 'شي', 'mn': 'من', 'men': 'من', 'f': 'ف', 'l': 'ل', 'w': 'و', 'o': 'و', 'ma': 'ما', 'la': 'لا',
    'iyeh': 'إيه', 'ah': 'آه', 'ewa': 'إيوا', 'yallah': 'يالله', 'ta': 'تا', 'tal': 'تال', 'lyoum': 'اليوم',
    'ghda': 'غدا', 'lbar7': 'البارح', 'sbah': 'صباح', 'lil': 'الليل', 'flous': 'فلوس', 'dar': 'دار',
    'sift': 'صيفط', 'sifet': 'صيفط', 'lia': 'ليا', 'liya': 'ليا', 'lik': 'ليك', 'lih': 'ليه', 'liha': 'ليها',
    'mwajed': 'موجد', 'wajed': 'واجد', 'lmatch': 'الماتش', 'match': 'ماتش', 'khdma': 'خدمة', 'lkhdma': 'الخدمة',
    'bghiti': 'بغيتي', 'tchri': 'تشري', 'nchri': 'نشري', 'jib': 'جيب', 'jibi': 'جيبي', 'kayn': 'كاين', 'kayna': 'كاينة',
    'n3tik': 'نعطيك', 'n3tikom': 'نعطيكم', '3tini': 'عطيني', '3tih': 'عطيه', 'wasfa': 'وصفة', 'lwasfa': 'الوصفة',
    'khodra': 'خضرة', 'lkhodra': 'الخضرة', 'l7em': 'اللحم', 'l7am': 'اللحم', 'lham': 'اللحم', 'gram': 'ڭرام',
    'bssa7tkom': 'بصحتكم', 'bsa7tkom': 'بصحتكم', 'bssa7tek': 'بصحتك', 'bsa7tek': 'بصحتك', 'smiti': 'سميتي',
    'tajine': 'طاجين', 'tajin': 'طاجين', 'khassek': 'خاصك', 'khassni': 'خاصني', 'khass': 'خاص', 'zitoun': 'زيتون',
    'zzitoun': 'الزيتون', '3likom': 'عليكم', '3lik': 'عليك', 'wa7d': 'واحد', 'wahed': 'واحد', 'tomatich': 'ماطيشة',
    'ara': 'أرا', 'aji': 'أجي', 'bttikha': 'بطيخة', 'btikha': 'بطيخة', 'dlla7': 'الدلاح', 'nakloha': 'ناكلوها',
    'naklo': 'ناكلو', 'kol': 'كول', 'sbah': 'صباح', 'ssbah': 'الصباح', 'sba7': 'صباح', 'ssba7': 'الصباح',
    'l3cha': 'العشا', 'lftour': 'الفطور', 'atay': 'أتاي', 'lkhobz': 'الخبز', 'khobz': 'خبز',
    'dyali': 'ديالي', 'dyalek': 'ديالك', 'dyalo': 'ديالو', 'dyalha': 'ديالها', 'dyalna': 'ديالنا',
    'dyalkom': 'ديالكم', 'dyalhom': 'ديالهم', 'dialna': 'ديالنا', 'dyali': 'ديالي',
    'makaynch': 'ماكاينش', 'ma3ndich': 'ماعنديش', '3ndi': 'عندي', '3andi': 'عندي', 'm3a': 'مع', 'ta7aja': 'تاحاجة',
}
# French words as Moroccans say them, written for an Arabic voice
FRENCH_SPOKEN = {
    'adresse': 'لادريس', "l'adresse": 'لادريس', 'message': 'ميساج', 'mail': 'ميل', 'email': 'إيميل',
    'internet': 'لانترنيت', 'wifi': 'الويفي', 'ok': 'أوكي', 'merci': 'ميرسي', 'bonjour': 'بونجور',
    'oui': 'وي', 'non': 'نو', 'video': 'فيديو', 'vidéo': 'فيديو', 'très': 'تري', 'tres': 'تري',
    'portable': 'بورطابل', 'tomobile': 'طوموبيل', 'voiture': 'فواتير', 'bus': 'الطوبيس', 'taxi': 'طاكسي',
    'café': 'قهوة', 'cafe': 'قهوة', 'rendez-vous': 'روندي فو', 'normal': 'نورمال', 'normalement': 'نورمالمون',
    'facebook': 'فيسبوك', 'whatsapp': 'واتساب', 'instagram': 'إنستغرام', 'youtube': 'يوتيوب', 'google': 'ڭوڭل',
}
# common French words that should stay Latin (the reader says them in French)
FRENCH = {'le', 'la', 'les', 'de', 'des', 'du', 'et', 'un', 'une', 'pour', 'avec', 'mais'} | set(FRENCH_SPOKEN)


def looks_arabizi(w: str) -> bool:
    lw = w.lower()
    if lw in LEXICON:
        return True
    if lw in FRENCH or not re.fullmatch(r"[a-z0-9']+", lw):
        return False
    return bool(re.search(r'[a-z]', lw) and re.search(r'[23579]', lw)) or bool(re.search(r'(kh|gh|ch)', lw) and not re.search(r'[éèêàç]', lw))


def arabizi_word(w: str) -> str:
    lw = w.lower().replace("'", '')
    if lw in LEXICON:
        return LEXICON[lw]
    # l- / el- article glued to the word: "lmghrib" -> "المغريب"
    prefix = ''
    # assimilated article: a doubled sun letter at the start is "ال" ("ddar" -> الدار)
    m2 = re.match(r'^(tt|dd|rr|zz|ss|nn|ll)(?=[a-z0-9])', lw)
    if m2 and len(lw) > 3:
        prefix, lw = 'ال', lw[1:]
    if prefix and lw in LEXICON:  # known word after the article: "ddar" -> ال + دار
        return prefix + LEXICON[lw].removeprefix('ال')
    m = re.match(r'^(e?l)(?=[^aeiou])', lw)
    if m and len(lw) > 3 and not re.match(r'^(tt|dd|rr|zz|ss|nn|ll)', lw):
        prefix, lw = 'ال', lw[m.end():]
    out, i = [], 0
    while i < len(lw):
        two = lw[i:i + 2]
        hit = next((ar for lat, ar in DIGRAPHS if two == lat), None)
        if hit:
            out.append(hit); i += 2; continue
        ch = lw[i]
        if ch in 'ou' and 0 < i < len(lw) - 1 and lw[i + 1:i + 2] not in 'ou':
            i += 1  # a single o/u inside a word is a short vowel: "lkhobz" -> "الخبز"
            continue
        if ch in 'ae':
            # short vowels are not written in Darija, except a long or final "a"
            if ch == 'a' and (i == len(lw) - 1 or lw[i + 1:i + 2] == 'a'):
                out.append('ا' if i else 'أ')
            elif ch == 'a' and i == 0:
                out.append('أ')
            i += 2 if lw[i + 1:i + 2] == ch else 1
            continue
        out.append(SINGLE.get(ch, '')); i += 1
    word = ''.join(out)
    word = re.sub(r'(.)\1+', r'\1', word) if len(word) > 2 else word
    return prefix + word


# --- pipeline --------------------------------------------------------------
EMOJI = re.compile('[\U0001F000-\U0001FAFF☀-➿️]')
ARABIC_DIGITS = str.maketrans('٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹', '01234567890123456789')
TATWEEL = 'ـ'


RESPELL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'respell.tsv')


def load_respell(path: str = RESPELL_PATH) -> dict[str, str]:
    """Measured pronunciation fixes: word<TAB>spelling the voice says right."""
    out = {}
    if os.path.exists(path):
        for line in open(path, encoding='utf-8'):
            if line.strip() and not line.startswith('#') and '\t' in line:
                w, r = line.rstrip('\n').split('\t', 1)
                out[w.strip()] = r.strip()
    return out


RESPELL = load_respell()

VOCAB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'doda_vocab.tsv')


def load_vocab(path: str = VOCAB_PATH) -> dict[str, int]:
    """Word frequencies from the DODa transcripts: the spelling the voices learned."""
    out = {}
    if os.path.exists(path):
        for line in open(path, encoding='utf-8'):
            if line.startswith('#') or '\t' not in line:
                continue
            w, n = line.rstrip('\n').split('\t')
            out[w] = int(n)
    return out


VOCAB = load_vocab()


def doda_spelling(word: str) -> str:
    """Prefer the spelling the voice was trained on, when a hamza or ya/alef variant of the
    word is in the corpus and the word itself is not: إلى -> الى, أصلا -> اصلا."""
    if not VOCAB or word in VOCAB:
        return word
    variants = {
        re.sub('[أإآ]', 'ا', word),
        re.sub('[أإآ]', 'ا', word).replace('ئ', 'ي').replace('ؤ', 'و'),
        word.replace('ى', 'ا'), word.replace('ى', 'ي'),
        re.sub('[أإآ]', 'ا', word).replace('ى', 'ي'),
    } - {word}
    known = [(VOCAB[v], v) for v in variants if v in VOCAB]
    return max(known)[1] if known else word


def normalize(text: str) -> str:
    t = unicodedata.normalize('NFKC', text).translate(ARABIC_DIGITS).replace(TATWEEL, '')
    t = EMOJI.sub(' ', t)
    t = re.sub(r'([ء-ي])\1{2,}', r'\1\1', t)          # stretched Arabic letters
    t = re.sub(r'([!?؟.])\1+', r'\1', t)
    t = re.sub(r'(\d+)\s*%', r'\1 فالمية', t)
    t = re.sub(r'(\d+)\s*(dh|DH|MAD|درهم)\b', r'\1 درهم', t)
    # units after a number: "2 كلم" would be read as the verb كلّم
    for pat, word in ((r'كلم|كم|km|KM', 'كيلومتر'), (r'كغ|kg|KG', 'كيلو'), (r'سم|cm', 'سونتيمتر'),
                      (r'مم|mm', 'ميليمتر'), (r'لتر|l\b', 'لتر'), (r'م|m\b', 'متر'), (r'h|س', 'ساعة'), (r'min|د', 'دقيقة')):
        t = re.sub(rf'(\d+)\s*(?:{pat})(?![\u0621-\u064Aa-zA-Z])', rf'\1 {word}', t)

    latin = [w for w in re.findall(r"[A-Za-z0-9']+", t) if re.search(r'[A-Za-z]', w)]
    mostly_arabizi = bool(latin) and sum(looks_arabizi(w) for w in latin) / len(latin) >= 0.4

    def word(m: re.Match) -> str:
        w = m.group(0)
        if re.fullmatch(r'\d[\d,]*(\.\d+)?', w):
            return spell_number(w)
        if looks_arabizi(w) or (mostly_arabizi and w.lower() not in FRENCH and re.fullmatch(r"[A-Za-z0-9']+", w)):
            return arabizi_word(w)
        return w
    t = re.sub(r"[A-Za-z0-9'éèêàç]+(?:[.,]\d+)?", word, t)
    t = re.sub(r"[A-Za-z'éèêàç-]+", lambda m: FRENCH_SPOKEN.get(m.group(0).lower(), arabizi_word(m.group(0))), t)
    t = re.sub(r'(?<=\d)(?=[؀-ۿ])|(?<=[؀-ۿ])(?=\d)', ' ', t)
    t = re.sub(r'\d[\d,]*(\.\d+)?', lambda m: spell_number(m.group(0)), t)
    t = t.replace('ڭ', 'ق').replace('گ', 'ق').replace('ڤ', 'ف').replace('پ', 'ب').replace('ک', 'ك').replace('ی', 'ي')
    t = re.sub(r'["«»“”()\[\]{}*_#]', ' ', t)
    if not re.search(r'[A-Za-z]', t):  # fully Arabic now: use Arabic punctuation
        t = t.replace(',', '،').replace('?', '؟').replace(';', '؛')
    t = re.sub(r'\s+', ' ', t).strip()
    t = re.sub(r'[\u0621-\u064A]+', lambda m: doda_spelling(m.group(0)), t)
    if RESPELL:
        t = re.sub(r'[\u0621-\u064A]+', lambda m: RESPELL.get(m.group(0), m.group(0)), t)
    return t


TESTS = [
    ('عندي 2 دراري', 'عندي جوج دراري'),
    ('25 درهم', 'خمسة وعشرين درهم'),
    ('22', 'تنين وعشرين'),
    ('11', 'حضاش'),
    ('100', 'مية'),
    ('125', 'مية وخمسة وعشرين'),
    ('1500', 'ألف وخمسمية'),
    ('2000', 'جوج آلاف'),
    ('3000', 'تلاتة آلاف'),
    ('٤٥', 'خمسة وربعين'),
    ('2.5', 'جوج فاصلة خمسة'),
    ('50%', 'خمسين فالمية'),
    ('wach nta labas', 'واش نتا لاباس'),
    ('3afak', 'عافاك'),
    ('7na hna', 'حنا حنا'),
    ('bghit nchri lkhobz', 'بغيت نشري الخبز'),
    ('merci bzaf', 'ميرسي بزاف'),
    ('واحد 2 كلم باش تلقاه', 'واحد جوج كيلومتر باش تلقاه'),
    ('5 كغ و 20 km', 'خمسة كيلو و عشرين كيلومتر'),
    ('خاصني 3 كلمات', 'خاصني تلاتة كلمات'),
    ('مشيت إلى الدار', 'مشيت الى الدار'),
    ('أصلا ما عرفتش', 'اصلا ما عرفتش'),
    ('ara chi bttikha nakloha m3a ssbah', 'ارا شي بطيخة ناكلوها مع الصباح'),
    ('ddar dyalna', 'الدار ديالنا'),
    ("3afak sift lia l'adresse f message", 'عافاك صيفط ليا لادريس ف ميساج'),
    ('chouf had video f youtube', 'شوف هاد فيديو ف يوتيوب'),
    ('khassek 2 kilo d l7em, bssa7tkom', 'خاصك جوج كيلو د اللحم، بصحتكم'),
    ('ڭالها', 'قالها'),
    ('زوييييين 😍😍', 'زويين'),
    ('شنو هادا؟؟؟', 'شنو هادا؟'),
    ('salam khoya, chno bghiti tchri? 3andi 350 dh f jibi', 'سلام خويا، شنو بغيتي تشري؟ عندي تلتمية وخمسين درهم ف جيبي'),
    ('عيط ليا 0612345678', 'عيط ليا صفر ستة واحد جوج تلاتة ربعة خمسة ستة سبعة تمنية'),
]


def self_test() -> int:
    bad = 0
    for src, want in TESTS:
        got = normalize(src)
        if got != want:
            bad += 1
            print(f'FAIL  {src!r}\n  got  {got!r}\n  want {want!r}')
    print(f'{len(TESTS) - bad}/{len(TESTS)} normalizer tests pass')
    return 1 if bad else 0


if __name__ == '__main__':
    if sys.argv[1:] == ['--test']:
        sys.exit(self_test())
    print(normalize(' '.join(sys.argv[1:]) if sys.argv[1:] else sys.stdin.read()))
