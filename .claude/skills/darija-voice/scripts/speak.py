#!/usr/bin/env python3
"""Speak Moroccan Darija with an open Piper voice.

    speak.py --model ary_MA-darija_m1-medium-v2.onnx --out out.wav "واش نتا لاباس؟"
    speak.py --model M --out-dir out/ --file sentences.txt
    speak.py ... --speed 1.1 --tashkeel

Text goes through normalize.py first (numbers, Arabizi, Moroccan letters).
Needs: pip install piper-tts
"""
import argparse
import os
import sys
import time
import wave

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from normalize import normalize  # noqa: E402

from piper import PiperVoice  # noqa: E402
from piper.config import SynthesisConfig  # noqa: E402


def load(model: str, tashkeel: bool) -> PiperVoice:
    v = PiperVoice.load(model)
    v.use_tashkeel = tashkeel
    return v


# Pause after each phrase, in seconds: short after a comma, longer at the end
# of a sentence, so the listener hears where one idea stops and the next starts.
PAUSE = {'،': 0.25, ',': 0.25, '؛': 0.3, ';': 0.3, ':': 0.3, '.': 0.5, '!': 0.5, '?': 0.5, '؟': 0.5}


def phrases(text: str) -> list[tuple[str, float]]:
    out, cur = [], ''
    for ch in text:
        cur += ch
        if ch in PAUSE:
            if cur.strip(' ' + ch):
                out.append((cur.strip(), PAUSE[ch]))
            cur = ''
    if cur.strip():
        out.append((cur.strip(), 0.0))
    return out


def speak(voice: PiperVoice, text: str, path: str, speed: float = 1.0, noise: float | None = None,
          noise_w: float | None = 0.5, raw: bool = False, pauses: bool = True) -> float:
    cfg = SynthesisConfig(length_scale=1.0 / speed, noise_scale=noise, noise_w_scale=noise_w)
    clean = text if raw else normalize(text)
    sr = voice.config.sample_rate
    audio = bytearray()
    for part, pause in (phrases(clean) if pauses else [(clean, 0.0)]):
        for chunk in voice.synthesize(part, syn_config=cfg):
            audio += chunk.audio_int16_bytes
        audio += b'\x00\x00' * int(sr * pause)
    with wave.open(path, 'wb') as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(sr)
        wf.writeframes(bytes(audio))
    return len(audio) / 2 / sr


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', required=True)
    ap.add_argument('--out')
    ap.add_argument('--out-dir')
    ap.add_argument('--file')
    ap.add_argument('--speed', type=float, default=1.0)
    ap.add_argument('--noise', type=float)
    ap.add_argument('--noise-w', type=float, default=0.5, help='duration noise: lower is steadier. 0.5 measured best')
    ap.add_argument('--tashkeel', action='store_true', help='MSA diacritizer. Off by default: measured worse for Darija')
    ap.add_argument('--raw', action='store_true', help='skip normalize.py')
    ap.add_argument('--no-pauses', action='store_true')
    ap.add_argument('text', nargs='*')
    a = ap.parse_args()
    voice = load(a.model, a.tashkeel)
    lines = [l.strip() for l in open(a.file, encoding='utf-8') if l.strip() and not l.startswith('#')] if a.file else [' '.join(a.text)]
    for i, line in enumerate(lines, 1):
        path = a.out if (a.out and len(lines) == 1) else os.path.join(a.out_dir or '.', f's{i:02d}.wav')
        t0 = time.time()
        dur = speak(voice, line, path, a.speed, a.noise, a.noise_w, a.raw, not a.no_pauses)
        print(f'{path}  {dur:.2f}s audio in {time.time() - t0:.2f}s')


if __name__ == '__main__':
    main()
