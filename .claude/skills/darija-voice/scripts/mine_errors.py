#!/usr/bin/env python3
"""Find the words the voice gets wrong most often, from evaluate.py results.

    mine_errors.py results.json [--top 25]

Aligns what we asked for with what the recognizer heard, word by word, and
counts the words that come back wrong. Each one is a candidate for
data/respell.tsv: write the word, a tab, and a spelling that makes the voice
say it right. Then run evaluate.py again and keep the entry only if CER drops.
That is how the skill learns: by measured changes written to files.
"""
import argparse
import collections
import difflib
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from evaluate import canon  # noqa: E402
from normalize import normalize  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('results')
    ap.add_argument('--top', type=int, default=25)
    a = ap.parse_args()
    runs = json.load(open(a.results, encoding='utf-8'))
    best = min(runs, key=lambda r: r['cer'])
    wrong, seen, examples = collections.Counter(), collections.Counter(), {}
    for row in best['rows']:
        ref, hyp = canon(normalize(row['text'])).split(), canon(row['heard']).split()
        seen.update(ref)
        sm = difflib.SequenceMatcher(a=ref, b=hyp, autojunk=False)
        for op, i1, i2, j1, j2 in sm.get_opcodes():
            if op in ('replace', 'delete'):
                for w in ref[i1:i2]:
                    wrong[w] += 1
                    examples.setdefault(w, ' '.join(hyp[j1:j2]) or '(dropped)')
    print(f'{"word":16} wrong/seen  heard as')
    for w, n in wrong.most_common(a.top):
        print(f'{w:16} {n}/{seen[w]}       {examples[w]}')


if __name__ == '__main__':
    main()
