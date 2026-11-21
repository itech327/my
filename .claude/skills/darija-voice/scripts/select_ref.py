#!/usr/bin/env python3
"""Pick the best reference clip for a speaker, by measurement.

For F5-TTS the reference clip decides a lot: too short, noisy or with a
transcript that does not match, and the voice stutters or skips words. This
speaks the same test sentences with every candidate clip, transcribes them
with the Darija recognizer, and ranks the clips by CER.

    select_ref.py --ckpt model_ema.safetensors --vocab vocab.txt --asr ASR_DIR \
        --refs refs_dir/ --sentences data/test_sentences.txt --n 4 --nfe 16

refs_dir holds pairs: NAME.wav and NAME.txt (exact transcript).
"""
import argparse
import glob
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
    ap.add_argument('--refs', required=True)
    ap.add_argument('--sentences', required=True)
    ap.add_argument('--n', type=int, default=4, help='how many test sentences per clip')
    ap.add_argument('--nfe', type=int, default=16)
    a = ap.parse_args()
    torch.set_num_threads(os.cpu_count() or 4)
    sents = [l.strip() for l in open(a.sentences, encoding='utf-8') if l.strip() and not l.startswith('#')]
    # spread the picks over the file so MSA and Darija are both represented
    step = max(1, len(sents) // a.n)
    sents = sents[::step][:a.n]
    model = load_model(DiT, CFG, a.ckpt, vocab_file=a.vocab)
    vocoder = load_vocoder('vocos')
    asr = Asr(a.asr)
    results = []
    with tempfile.TemporaryDirectory() as tmp:
        for wav in sorted(glob.glob(os.path.join(a.refs, '*.wav'))):
            name = os.path.splitext(os.path.basename(wav))[0]
            ref_text = open(wav[:-4] + '.txt', encoding='utf-8').read().strip()
            ref_audio, ref_text = preprocess_ref_audio_text(wav, ref_text)
            t0, cers, audio_s = time.time(), [], 0.0
            for i, s in enumerate(sents):
                out, sr, _ = infer_process(ref_audio, ref_text, normalize(s), model, vocoder,
                                           nfe_step=a.nfe, sway_sampling_coef=-1.0, show_info=lambda *x: None)
                path = os.path.join(tmp, f'{name}-{i}.wav')
                sf.write(path, out, sr, subtype='PCM_16')
                audio_s += len(out) / sr
                cers.append(rates(normalize(s), asr(path))[0])
            cer = sum(cers) / len(cers)
            rtf = (time.time() - t0) / audio_s
            results.append((cer, name, rtf))
            print(f'{name:14} CER {cer:.3f}  per sentence {[round(c, 2) for c in cers]}  {rtf:.1f}x real time', flush=True)
    results.sort()
    print(f'\nbest reference: {results[0][1]}  CER {results[0][0]:.3f}')


if __name__ == '__main__':
    main()
