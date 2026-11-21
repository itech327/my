#!/usr/bin/env python3
"""Put real pauses where the text has " - ", without touching the voice itself.

    insert_pauses.py --asr ASR_DIR --in voice.wav --out paused.wav \
        --text "آجِي تقراو - و - فابور" [--pause 0.35]

Generate the sentence first WITHOUT the dashes (one piece keeps the voice
clean). This finds when each word starts with the Darija recognizer's
letter timings, and inserts silence before every word that follows a " - ",
at the quietest point nearby, with 5 ms fades so there is no click.

Measured lesson (results.md): stretching or cutting the voice damages it;
inserting silence between intact words does not.
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from evaluate import Asr  # noqa: E402
from normalize import normalize  # noqa: E402

import librosa  # noqa: E402
import numpy as np  # noqa: E402
import soundfile as sf  # noqa: E402
import torch  # noqa: E402


def letter_times(asr: Asr, x: np.ndarray, sr: int) -> list[tuple[float, str]]:
    y = librosa.resample(x, orig_sr=sr, target_sr=16000)
    inp = asr.proc(y, sampling_rate=16000, return_tensors='pt')
    with torch.no_grad():
        ids = asr.model(inp.input_values).logits.argmax(-1)[0].tolist()
    spf = len(y) / 16000 / len(ids)
    tok, prev, out = asr.proc.tokenizer, None, []
    for f, i in enumerate(ids):
        if i != prev and i != tok.pad_token_id:
            out.append((f * spf, tok.convert_ids_to_tokens(i)))
        prev = i
    return out


def word_starts(letters: list[tuple[float, str]]) -> list[float]:
    starts, new = [], True
    for t, c in letters:
        if c in ('|', ' '):
            new = True
        elif new:
            starts.append(t)
            new = False
    return starts


def plain(w: str) -> str:
    w = normalize(w)
    for a, b in (('آ', 'ا'), ('أ', 'ا'), ('إ', 'ا'), ('ى', 'ا'), ('ة', 'ا')):
        w = w.replace(a, b)
    return ''.join(c for c in w if '\u0621' <= c <= '\u064A')


def align_words(letters, words: list[str]) -> list[float | None]:
    """Walk the recognised letters in order, word by word. Each word consumes its own
    letters, so in "تقراو و" the final و of تقراو is used up before the lone و is matched."""
    seq = [(t, c.replace('ة', 'ا')) for t, c in letters if c not in ('|', ' ')]
    starts, k = [], 0
    for w in words:
        lw = plain(w)
        j = next((i for i in range(k, len(seq)) if seq[i][1] == lw[:1]), None)
        if j is None:
            starts.append(None)
            continue
        starts.append(seq[j][0])
        k = j + 1
        for ch in lw[1:]:  # consume the rest of the word, skipping letters the recognizer missed
            m = next((i for i in range(k, min(k + 3, len(seq))) if seq[i][1] == ch), None)
            if m is not None:
                k = m + 1
    return starts


def snap_to_onset(x: np.ndarray, sr: int, t: float, max_back: float = 0.2) -> int:
    """The recognizer marks a letter 20-60 ms late. Walk back from its time to where the
    sound really starts, so a pause never splits a consonant (measured: a cut inside the
    hiss of ف left half of it before the pause, which sounds like a stutter).
    - starting on a loud voiced frame (vowel, و): go back to the silence before it
    - starting on a hiss or a quiet frame (ف, س, ش): go back to where the voiced sound before it ends"""
    f = int(sr * 0.01)
    frames = [(np.sqrt((x[i:i + f] ** 2).mean()), np.mean(np.abs(np.diff(np.sign(x[i:i + f])))) / 2)
              for i in range(0, len(x) - f, f)]
    peak = max(e for e, _ in frames) or 1.0
    voiced = lambda k: frames[k][0] > 0.1 * peak and frames[k][1] < 0.08
    quiet = lambda k: frames[k][0] < 0.03 * peak
    k = min(len(frames) - 1, int(t / 0.01))
    stop = max(0, k - int(max_back / 0.01))
    if voiced(k):
        k0, near = k, max(0, k - 8)  # look for silence within 80 ms only
        while k > near and not quiet(k - 1):
            k -= 1
        if not quiet(max(0, k - 1)):
            # words run together (no silence, e.g. "تقراو و"): cut at the energy dip instead
            lo, hi = max(0, k0 - 8), min(len(frames), k0 + 2)
            k = min(range(lo, hi), key=lambda j: frames[j][0])
    else:
        while k > stop and not voiced(k - 1):
            k -= 1
    return k * f


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--asr', required=True)
    ap.add_argument('--in', dest='inp', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--text', required=True, help='the sentence with " - " where pauses go')
    ap.add_argument('--pause', type=float, default=0.35)
    a = ap.parse_args()
    x, sr = sf.read(a.inp)
    x = x.astype(np.float32)
    parts = [p.split() for p in a.text.split(' - ')]
    words = [w for p in parts for w in p]
    # index of the first word after each dash
    targets, n = [], 0
    for p in parts[:-1]:
        n += len(p)
        targets.append(n)
    letters = letter_times(Asr(a.asr), x, sr)
    aligned = align_words(letters, words)
    print('word starts:', ' '.join(f'{w}@{t:.2f}' if t is not None else f'{w}@?' for w, t in zip(words, aligned)))
    times = []
    for k in targets:
        if aligned[k] is None:
            sys.exit(f'could not place the pause before "{words[k]}": the recognizer did not hear it')
        times.append(aligned[k])
    fade = int(sr * 0.005)
    cuts = [snap_to_onset(x, sr, t) for t in times]
    print('cut points after snapping to sound onsets:', ', '.join(f'{c / sr:.2f}s' for c in cuts))
    pieces, last = [], 0
    for c in cuts:
        seg = x[last:c].copy()
        if len(seg) > fade:
            seg[-fade:] *= np.linspace(1, 0, fade)
        if last and len(seg) > fade:
            seg[:fade] *= np.linspace(0, 1, fade)
        pieces += [seg, np.zeros(int(sr * a.pause), dtype=np.float32)]
        last = c
    tail = x[last:].copy()
    tail[:fade] *= np.linspace(0, 1, fade)
    pieces.append(tail)
    y = np.concatenate(pieces)
    sf.write(a.out, y, sr, subtype='PCM_16')
    print(f'pauses of {a.pause}s before: {", ".join(words[k] for k in targets)} at {", ".join(f"{t:.2f}s" for t in times)} -> {a.out}')


if __name__ == '__main__':
    main()
