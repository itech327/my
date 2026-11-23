#!/usr/bin/env python3
"""Tune F5-TTS settings for one speaker, by measurement.

    tune_f5.py --ckpt C --vocab V --asr A --sentences data/test_sentences.txt \
        --ref M1=data/refs/M1.wav --ref M1x2=refs/M1x2.wav --nfe 16 32 --cfg 2 3 --n 6

Every config speaks the same sentences with the same random seed per
sentence, so differences come from the settings and not from luck.
Each --ref NAME=WAV needs WAV's transcript next to it (same name, .txt).
"""
import argparse
import itertools
import os
import sys
import tempfile
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from normalize import normalize  # noqa: E402
from evaluate import Asr, rates  # noqa: E402

import soundfile as sf  # noqa: E402
import torch  # noqa: E402
from f5_tts.infer.utils_infer import infer_process, load_model, load_vocoder, preprocess_ref_audio_text  # noqa: E402
from f5_tts.model import DiT  # noqa: E402

CFG = dict(dim=1024, depth=22, heads=16, ff_mult=2, text_dim=512, conv_layers=4)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--ckpt', required=True)
    ap.add_argument('--vocab', required=True)
    ap.add_argument('--asr', required=True)
    ap.add_argument('--sentences', required=True)
    ap.add_argument('--ref', action='append', required=True, help='NAME=path.wav (transcript in path.txt)')
    ap.add_argument('--nfe', type=int, nargs='+', default=[16, 32])
    ap.add_argument('--cfg', type=float, nargs='+', default=[2.0, 3.0])
    ap.add_argument('--speed', type=float, default=0.9)
    ap.add_argument('--n', type=int, default=6)
    a = ap.parse_args()
    torch.set_num_threads(os.cpu_count() or 4)
    sents = [l.strip() for l in open(a.sentences, encoding='utf-8') if l.strip() and not l.startswith('#')]
    sents = sents[::max(1, len(sents) // a.n)][:a.n]
    model = load_model(DiT, CFG, a.ckpt, vocab_file=a.vocab)
    vocoder = load_vocoder('vocos')
    asr = Asr(a.asr)
    refs = {}
    for spec in a.ref:
        name, path = spec.split('=', 1)
        refs[name] = preprocess_ref_audio_text(path, open(path[:-4] + '.txt', encoding='utf-8').read().strip())
    results = []
    with tempfile.TemporaryDirectory() as tmp:
        for (rname, (ra, rt)), nfe, cfg in itertools.product(refs.items(), a.nfe, a.cfg):
            t0, cers, secs = time.time(), [], 0.0
            for i, s in enumerate(sents):
                torch.manual_seed(1000 + i)
                wav, sr, _ = infer_process(ra, rt, normalize(s), model, vocoder, nfe_step=nfe, cfg_strength=cfg,
                                           speed=a.speed, sway_sampling_coef=-1.0, show_info=lambda *x: None)
                p = os.path.join(tmp, 'x.wav'); sf.write(p, wav, sr, subtype='PCM_16'); secs += len(wav) / sr
                cers.append(rates(normalize(s), asr(p))[0])
            cer = sum(cers) / len(cers)
            results.append((cer, rname, nfe, cfg))
            print(f'ref={rname:6} nfe={nfe:2} cfg={cfg:.1f}  CER {cer:.3f}  {[round(c, 2) for c in cers]}  {(time.time() - t0) / secs:.1f}x real time', flush=True)
    results.sort()
    c, r, n, g = results[0]
    print(f'\nbest: ref={r} nfe={n} cfg={g}  CER {c:.3f}')


if __name__ == '__main__':
    main()
