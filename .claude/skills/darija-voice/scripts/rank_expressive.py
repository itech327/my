#!/usr/bin/env python3
"""Rank a speaker's clips by how expressive they sound, to pick reference clips
for a lively style.

    rank_expressive.py --parquet shard.parquet --speaker F1 --out refs_dir --top 5

F5-TTS copies the melody and energy of its reference clip. A calm reference
gives a flat voice (measured: Hind's first reference ranked 228 of 253 and the
output moved 2.4 semitones; an expressive reference doubled that). Score =
spread of pitch in semitones + 4 x relative spread of loudness, on clean
3-7 s clips with Arabic-only transcripts.

Reads the DODa CosyVoice2 parquet shards (Jip7e/doda-darija-cosyvoice2, CC BY 4.0).
Writes NAME.wav and NAME.txt for the top clips, ready for select_ref.py or f5_server.py.
"""
import argparse
import io
import os
import re

import librosa
import numpy as np
import pyarrow.parquet as pq
import soundfile as sf


def score(x: np.ndarray, sr: int, fmin: float, fmax: float) -> tuple[float, float] | None:
    y = librosa.resample(x.astype(np.float32), orig_sr=sr, target_sr=16000)
    f0 = librosa.yin(y, fmin=fmin, fmax=fmax, sr=16000, frame_length=1024)
    voiced = f0[(f0 > fmin * 1.05) & (f0 < fmax * 0.98)]
    if len(voiced) < 20:
        return None
    semis = np.std(12 * np.log2(voiced / np.median(voiced)))
    rms = librosa.feature.rms(y=y, frame_length=1024, hop_length=256)[0]
    loud = rms[rms > rms.max() * 0.1]
    return semis + 4 * np.std(loud) / (np.mean(loud) + 1e-9), semis


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--parquet', required=True)
    ap.add_argument('--speaker', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--top', type=int, default=5)
    ap.add_argument('--male', action='store_true', help='pitch range for a male voice')
    a = ap.parse_args()
    fmin, fmax = (70, 300) if a.male else (120, 450)
    rows = pq.read_table(a.parquet, columns=['utt', 'audio_data', 'text', 'spk']).to_pylist()
    scored = []
    for r in rows:
        if r['spk'] != a.speaker or not re.fullmatch(r'[ء-ي\s]+', r['text']) or len(r['text'].split()) < 4:
            continue
        x, sr = sf.read(io.BytesIO(r['audio_data']))
        if not 3.0 <= len(x) / sr <= 7.0:
            continue
        s = score(x, sr, fmin, fmax)
        if s:
            scored.append((s[0], s[1], r['utt'], r['text'], x, sr))
    scored.sort(key=lambda t: -t[0])
    os.makedirs(a.out, exist_ok=True)
    print(f'{len(scored)} clips scored for {a.speaker}. median score {scored[len(scored) // 2][0]:.2f}')
    for sc, semis, utt, text, x, sr in scored[:a.top]:
        sf.write(os.path.join(a.out, f'{utt}.wav'), x, sr)
        open(os.path.join(a.out, f'{utt}.txt'), 'w', encoding='utf-8').write(text)
        print(f'{utt}  score {sc:.2f}  pitch movement {semis:.1f} st  {len(x) / sr:.1f}s  {text}')


if __name__ == '__main__':
    main()
