#!/usr/bin/env python3
"""Measure the live Sada connector: text -> voice -> Darija recognizer -> error rates.

Calls speak_moroccan on the deployed connector (so the whole pipeline is tested:
normalizer, respellings, style, designed voice), transcribes each WAV with a
Darija speech recognizer, and reports CER and WER against the requested text.
Lower is better. It measures intelligibility, not naturalness: still listen.

    connector_eval.py --asr ASR_DIR --out results.json
    connector_eval.py --asr ASR_DIR --voice nour --mode darija --delivery conversational
    connector_eval.py --asr ASR_DIR --compare before.json      # show the change per sentence

Needs: pip install torch transformers soundfile numpy
Recognizer: boumehdi/wav2vec2-large-xlsr-moroccan-darija (Apache-2.0). Download with
HF_HUB_DISABLE_XET=1, which keeps the download on huggingface.co and us.aws.cdn.hf.co.
Connector: SADA_URL (default https://voice.taalim.men/mcp) and, outside the cloud
session whose proxy adds it, SADA_KEY (sent as header x-sada-key).
"""
import argparse
import json
import os
import re
import sys
import tempfile
import urllib.request
import wave

import numpy as np

UA = 'sada-eval/1.0'  # Cloudflare answers 403 to the default Python user agent
HERE = os.path.dirname(os.path.abspath(__file__))
DIAC = re.compile('[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed\u0640]')


def canon(t: str) -> str:
    t = DIAC.sub('', t)
    t = re.sub(r'[إأآٱ]', 'ا', t).replace('ة', 'ه').replace('ؤ', 'و').replace('ئ', 'ي')
    t = re.sub(r'[^ء-ي\s]', ' ', t)
    t = re.sub(r'[اىه](?=\s|$)', 'ا', t).replace('ى', 'ي')
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
            sr, ch = wf.getframerate(), wf.getnchannels()
            x = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float32) / 32768
        if ch > 1:
            x = x.reshape(-1, ch).mean(axis=1)
        if sr != 16000:
            n = int(len(x) * 16000 / sr)
            x = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)
        # the recognizer was trained on short clips: cut long audio into 20 s pieces
        pieces = [x[i:i + 16000 * 20] for i in range(0, len(x), 16000 * 20)]
        out = []
        for p in pieces:
            inp = self.proc(p, sampling_rate=16000, return_tensors='pt')
            with self.torch.no_grad():
                ids = self.model(inp.input_values).logits.argmax(-1)
            out.append(self.proc.batch_decode(ids)[0])
        return ' '.join(out)


def post(url, body, key):
    h = {'user-agent': UA, 'content-type': 'application/json', 'accept': 'application/json, text/event-stream'}
    if key:
        h['x-sada-key'] = key
    req = urllib.request.Request(url, json.dumps(body).encode(), h)
    return json.load(urllib.request.urlopen(req, timeout=90))


def speak(url, key, text, voice, mode, delivery, pace, dest):
    args = {'text': text, 'voice': voice, 'mode': mode, 'delivery': delivery}
    if pace:
        args['pace'] = pace
    r = post(url, {'jsonrpc': '2.0', 'id': 1, 'method': 'tools/call', 'params': {'name': 'speak_moroccan', 'arguments': args}}, key)
    link = next((c['uri'] for c in r['result']['content'] if c.get('type') == 'resource_link'), None)
    if not link:
        raise RuntimeError(r['result']['content'][0]['text'][:200])
    with urllib.request.urlopen(urllib.request.Request(link, headers={'user-agent': UA}), timeout=60) as r, open(dest, 'wb') as f:
        f.write(r.read())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--asr', required=True)
    ap.add_argument('--sentences', default=os.path.join(HERE, '..', 'data', 'test_sentences.txt'))
    ap.add_argument('--voice', default='younes')
    ap.add_argument('--mode', default='darija')
    ap.add_argument('--delivery', default='conversational')
    ap.add_argument('--pace')
    ap.add_argument('--limit', type=int)
    ap.add_argument('--out')
    ap.add_argument('--compare', help='an earlier --out file to compare with')
    a = ap.parse_args()
    url = os.environ.get('SADA_URL', 'https://voice.taalim.men/mcp')
    key = os.environ.get('SADA_KEY')
    sents = [l.strip() for l in open(a.sentences, encoding='utf-8') if l.strip() and not l.startswith('#')][:a.limit]
    asr = Asr(a.asr)
    rows = []
    with tempfile.TemporaryDirectory() as tmp:
        for i, s in enumerate(sents):
            wav = os.path.join(tmp, f's{i}.wav')
            try:
                speak(url, key, s, a.voice, a.mode, a.delivery, a.pace, wav)
                heard = asr(wav)
            except Exception as e:  # keep going: one failure must not hide the rest
                print(f'FAIL {i + 1}: {e}', file=sys.stderr)
                continue
            cer, wer = rates(s, heard)
            rows.append({'text': s, 'heard': heard, 'cer': round(cer, 3), 'wer': round(wer, 3)})
            print(f'{i + 1:2d}  CER {cer:.3f}  WER {wer:.3f}  {s[:50]}', flush=True)
    if not rows:
        sys.exit('no sentence worked')
    mc = sum(r['cer'] for r in rows) / len(rows)
    mw = sum(r['wer'] for r in rows) / len(rows)
    print(f'\n{a.voice}/{a.mode}/{a.delivery}: {len(rows)} sentences, mean CER {mc:.3f}, mean WER {mw:.3f}')
    result = {'voice': a.voice, 'mode': a.mode, 'delivery': a.delivery, 'pace': a.pace, 'cer': round(mc, 4), 'wer': round(mw, 4), 'rows': rows}
    if a.compare:
        old = json.load(open(a.compare, encoding='utf-8'))
        by = {r['text']: r for r in old['rows']}
        print(f"before: CER {old['cer']:.3f}  WER {old['wer']:.3f}   change CER {mc - old['cer']:+.3f}")
        for r in rows:
            o = by.get(r['text'])
            if o and abs(r['cer'] - o['cer']) >= 0.05:
                print(f"  {o['cer']:.3f} -> {r['cer']:.3f}  {r['text'][:50]}")
    if a.out:
        json.dump(result, open(a.out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
