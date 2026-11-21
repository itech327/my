#!/usr/bin/env python3
"""Measure how intelligible the Darija voice is, and tune it.

Round trip: text -> voice -> Darija speech recognition -> text, then the
character and word error rate (CER, WER) between what we asked for and what
the recognizer heard. Lower is better. This is a proxy for intelligibility,
not for naturalness: still listen to the best settings yourself.

    evaluate.py --model VOICE.onnx --asr ASR_DIR --sentences data/test_sentences.txt
    evaluate.py ... --grid       # try settings and rank them

Needs: pip install piper-tts torch transformers soundfile
"""
import argparse
import itertools
import json
import os
import re
import sys
import tempfile
import time
import wave

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from normalize import normalize  # noqa: E402
from speak import load, speak  # noqa: E402

DIAC = re.compile(r'[ؐ-ًؚ-ٰٟۖ-ۭـ]')


def canon(t: str) -> str:
    """Compare texts fairly: no diacritics or punctuation, one spelling per letter."""
    t = DIAC.sub('', t)
    t = re.sub(r'[إأآٱ]', 'ا', t).replace('ى', 'ي').replace('ة', 'ه').replace('ؤ', 'و').replace('ئ', 'ي')
    t = re.sub(r'[^ء-ي\s]', ' ', t)
    return re.sub(r'\s+', ' ', t).strip()


def edit(a, b) -> int:
    prev = list(range(len(b) + 1))
    for i, x in enumerate(a, 1):
        cur = [i]
        for j, y in enumerate(b, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (x != y)))
        prev = cur
    return prev[-1]


def rates(ref: str, hyp: str) -> tuple[float, float]:
    r, h = canon(ref), canon(hyp)
    cer = edit(r.replace(' ', ''), h.replace(' ', '')) / max(1, len(r.replace(' ', '')))
    wer = edit(r.split(), h.split()) / max(1, len(r.split()))
    return cer, wer


class Asr:
    def __init__(self, path: str):
        import torch
        from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
        self.torch = torch
        self.proc = Wav2Vec2Processor.from_pretrained(path)
        self.model = Wav2Vec2ForCTC.from_pretrained(path).eval()

    def __call__(self, wav_path: str) -> str:
        with wave.open(wav_path) as wf:
            sr = wf.getframerate()
            x = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float32) / 32768
        if sr != 16000:  # linear resample is enough for a recognizer
            n = int(len(x) * 16000 / sr)
            x = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)
        inp = self.proc(x, sampling_rate=16000, return_tensors='pt')
        with self.torch.no_grad():
            ids = self.model(inp.input_values).logits.argmax(-1)
        return self.proc.batch_decode(ids)[0]


def run(voice, asr, sentences, tmp, **cfg):
    rows = []
    for i, s in enumerate(sentences):
        path = os.path.join(tmp, f'e{i}.wav')
        speak(voice, s, path, **cfg)
        hyp = asr(path)
        cer, wer = rates(normalize(s), hyp)
        rows.append({'text': s, 'heard': hyp, 'cer': round(cer, 3), 'wer': round(wer, 3)})
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', required=True)
    ap.add_argument('--asr', required=True)
    ap.add_argument('--sentences', required=True)
    ap.add_argument('--grid', action='store_true')
    ap.add_argument('--json')
    a = ap.parse_args()
    sentences = [l.strip() for l in open(a.sentences, encoding='utf-8') if l.strip() and not l.startswith('#')]
    asr = Asr(a.asr)

    # sanity check of the yardstick itself: a recognizer that cannot read our
    # canon form would make every voice look bad
    grid = [dict(tashkeel=t, speed=s, noise=n) for t, s, n in itertools.product(
        [True, False], [0.9, 1.0, 1.1], [0.5, 0.667])] if a.grid else [dict(tashkeel=True, speed=1.0, noise=None)]
    results, voices = [], {}
    with tempfile.TemporaryDirectory() as tmp:
        for g in grid:
            v = voices.setdefault(g['tashkeel'], load(a.model, g['tashkeel']))
            t0 = time.time()
            rows = run(v, asr, sentences, tmp, speed=g['speed'], noise=g['noise'])
            cer = sum(r['cer'] for r in rows) / len(rows)
            wer = sum(r['wer'] for r in rows) / len(rows)
            results.append({**g, 'cer': round(cer, 3), 'wer': round(wer, 3), 'rows': rows})
            print(f"tashkeel={g['tashkeel']!s:5} speed={g['speed']:.1f} noise={g['noise']}  CER {cer:.3f}  WER {wer:.3f}  ({time.time() - t0:.1f}s)")
    best = min(results, key=lambda r: (r['cer'], r['wer']))
    print(f"\nbest: tashkeel={best['tashkeel']} speed={best['speed']} noise={best['noise']}  CER {best['cer']}  WER {best['wer']}")
    print('worst sentences at best settings:')
    for r in sorted(best['rows'], key=lambda r: -r['cer'])[:5]:
        print(f"  CER {r['cer']:.2f}  said: {r['text']}\n            heard: {r['heard']}")
    if a.json:
        json.dump(results, open(a.json, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
