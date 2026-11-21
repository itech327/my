#!/usr/bin/env python3
"""Speak Darija in a chosen DODa speaker's voice with the Habibi F5-TTS model.

    speak_f5.py --ckpt model_ema.safetensors --vocab vocab.txt \
        --ref F1_ref.wav --ref-text "هوما مخبيين شي حاجة انا متيقن" \
        --out out.wav "النص بالدارجة"

Model: Jip7e/habibi-tts-doda-darija (Apache-2.0). Reference clips: the DODa
speakers F1-F4 and M1-M3 (Jip7e/doda-darija-cosyvoice2, CC BY 4.0). Only use
reference voices you have the right to use. Never a real person's voice
taken from the internet without their consent.
Needs: pip install f5-tts vocos soundfile (slow on CPU, fast on a GPU).
"""
import argparse
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from normalize import normalize  # noqa: E402

import soundfile as sf  # noqa: E402
from f5_tts.infer.utils_infer import infer_process, load_model, load_vocoder, preprocess_ref_audio_text  # noqa: E402
from f5_tts.model import DiT  # noqa: E402

CFG = dict(dim=1024, depth=22, heads=16, ff_mult=2, text_dim=512, conv_layers=4)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--ckpt', required=True)
    ap.add_argument('--vocab', required=True)
    ap.add_argument('--ref', required=True)
    ap.add_argument('--ref-text', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--nfe', type=int, default=32, help='quality steps: 16 is faster, 32 is the card default')
    ap.add_argument('--speed', type=float, default=1.0)
    ap.add_argument('text', nargs='+')
    a = ap.parse_args()
    t0 = time.time()
    model = load_model(DiT, CFG, a.ckpt, vocab_file=a.vocab)
    vocoder = load_vocoder('vocos')
    ref_audio, ref_text = preprocess_ref_audio_text(a.ref, a.ref_text)
    t1 = time.time()
    wav, sr, _ = infer_process(ref_audio, ref_text, normalize(' '.join(a.text)), model, vocoder,
                               nfe_step=a.nfe, sway_sampling_coef=-1.0, speed=a.speed)
    sf.write(a.out, wav, sr)
    print(f'{a.out}  {len(wav) / sr:.2f}s audio  (load {t1 - t0:.0f}s, synth {time.time() - t1:.0f}s)')


if __name__ == '__main__':
    main()
