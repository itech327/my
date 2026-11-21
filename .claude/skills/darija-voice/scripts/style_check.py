#!/usr/bin/env python3
"""Check a text against the Moroccan style guide (references/darija-style.md).

    style_check.py "النص"
    style_check.py --file script.txt
    style_check.py --test

Flags: words from other dialects (with the Darija word to use), digits,
Latin letters, stretched letters, sentences that are too long or too short
for the voice, and automatic tashkeel. Standard library only.
Exit code 1 when anything is flagged, so it can gate a script.
"""
import argparse
import re
import sys

# words that sound Egyptian, Levantine or Gulf, and the Moroccan word to use.
# Left out on purpose because they mean something else in Morocco:
# ليه (to him), إيه (yes), ماشي (not), خلاص (payment), طيب (cooked), عربية (Arabic), جدا (fine in MSA)
OTHER_DIALECTS = {
    'دلوقتي': 'دابا', 'هلق': 'دابا', 'هلأ': 'دابا', 'الحين': 'دابا',
    'عايز': 'بغيت', 'عايزة': 'بغيت', 'بدي': 'بغيت', 'بدك': 'بغيتي', 'أبغى': 'بغيت', 'ابغى': 'بغيت',
    'كويس': 'مزيان', 'كويسة': 'مزيانة', 'منيح': 'مزيان', 'منيحة': 'مزيانة',
    'أوي': 'بزاف', 'كتير': 'بزاف', 'وايد': 'بزاف',
    'ايش': 'شنو', 'شو': 'شنو', 'إزاي': 'كيفاش', 'ازاي': 'كيفاش', 'شلون': 'كيفاش',
    'ليش': 'علاش', 'إمتى': 'إمتا', 'إيمتى': 'إمتا',
    'مفيش': 'ما كاينش', 'ما في': 'ما كاينش', 'ماكو': 'ما كاينش',
    'كده': 'هكا', 'هيك': 'هكا', 'بس': 'غير', 'ولا حاجة': 'والو',
    'أتوبيس': 'طوبيس', 'عيّل': 'دري', 'عيال': 'دراري',
    'إديني': 'عطيني',
    'إزيك': 'لاباس عليك', 'ازيك': 'لاباس عليك', 'كيفك': 'كيداير', 'شلونك': 'كيداير',
}
TASHKEEL = re.compile(r'[ً-ْ]')
MIN_WORDS, MAX_WORDS = 3, 20


def check(text: str) -> list[str]:
    issues = []
    for bad, good in OTHER_DIALECTS.items():
        if re.search(rf'(?<![ء-ي]){re.escape(bad)}(?![ء-ي])', text):
            issues.append(f'dialect: "{bad}" is not Moroccan. Use "{good}"')
    if re.search(r'[0-9٠-٩]', text):
        issues.append('digits: write numbers as Darija words (normalize.py can, but words are better)')
    latin = re.findall(r'[A-Za-z]{2,}', text)
    if latin:
        issues.append(f'latin: {", ".join(sorted(set(latin))[:5])}. Write French words as they sound, in Arabic letters')
    if re.search(r'([ء-ي])\1{2,}', text):
        issues.append('stretched letters: "زوييين" is read letter by letter. Write "زوين"')
    if len(TASHKEEL.findall(text)) > max(3, len(text) // 40):
        issues.append('tashkeel: too many diacritics. Keep them only for a truly ambiguous word')
    for s in re.split(r'[.!?؟]+', text):
        n = len(s.split())
        if n > MAX_WORDS:
            issues.append(f'long sentence ({n} words): split it. "{" ".join(s.split()[:6])}…"')
        elif 0 < n < MIN_WORDS and len(re.split(r'[.!?؟]+', text.strip(' .!?؟'))) > 1:
            issues.append(f'very short sentence ({n} words): join it to the next one. "{s.strip()}"')
    return issues


TESTS = [
    ('واش بغيتي تمشي معايا للسوق دابا؟', []),
    ('أنا عايز أروح دلوقتي', ['dialect: "دلوقتي"', 'dialect: "عايز"']),
    ('عندي 25 درهم', ['digits']),
    ('صيفط ليا message', ['latin']),
    ('الفيلم زوييين بزاف', ['stretched']),
    ('هاد الجملة طويلة بزاف حيت فيها كلمات كثيرة واخا ما خاصهاش تكون هكا فالنص ديال الصوت حيت الصوت كيضيع ليه الكلام', ['long sentence']),
    ('سلام. اليوم غادي نهضرو على الماكلة المغربية.', ['very short']),
    ('ماشي هادي، عطيه ليه هو. إيه، الخلاص غادي يكون غدا.', []),
]


def self_test() -> int:
    bad = 0
    for text, want in TESTS:
        got = check(text)
        ok = len(got) == len(want) and all(any(w in g for g in got) for w in want)
        if not ok:
            bad += 1
            print(f'FAIL {text!r}\n  got  {got}\n  want {want}')
    print(f'{len(TESTS) - bad}/{len(TESTS)} style tests pass')
    return 1 if bad else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--file')
    ap.add_argument('--test', action='store_true')
    ap.add_argument('text', nargs='*')
    a = ap.parse_args()
    if a.test:
        sys.exit(self_test())
    text = open(a.file, encoding='utf-8').read() if a.file else ' '.join(a.text)
    issues = check(text)
    for i in issues:
        print('-', i)
    print('clean: reads as Moroccan' if not issues else f'{len(issues)} issue(s)')
    sys.exit(1 if issues else 0)


if __name__ == '__main__':
    main()
