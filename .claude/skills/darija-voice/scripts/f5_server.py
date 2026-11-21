#!/usr/bin/env python3
"""HTTP service for DODa speaker voices (F5-TTS), keeps the model loaded.

    f5_server.py --ckpt model_ema.safetensors --vocab vocab.txt --refs data/refs --port 5007 [--nfe 16]

POST /synthesize {"text": "...", "speaker": "F1"} -> audio/wav (X-Audio-Seconds header)
GET  /health                                      -> {"ok": true, "speakers": [...]}

data/refs holds SPEAKER.wav and SPEAKER.txt (exact transcript). 127.0.0.1 only.
Long text is split into sentences so each generation stays short and steady.
"""
import argparse
import glob
import io
import json
import os
import re
import sys
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from normalize import normalize  # noqa: E402

import numpy as np  # noqa: E402
import soundfile as sf  # noqa: E402
import torch  # noqa: E402
from f5_tts.infer.utils_infer import infer_process, load_model, load_vocoder, preprocess_ref_audio_text  # noqa: E402
from f5_tts.model import DiT  # noqa: E402

CFG = dict(dim=1024, depth=22, heads=16, ff_mult=2, text_dim=512, conv_layers=4)
PAUSE = {'.': 0.45, '!': 0.45, '؟': 0.45, '?': 0.45, '،': 0.2, ',': 0.2}


MIN_WORDS = 5  # F5-TTS skips or garbles very short pieces: merge them


def sentences(text: str) -> list[tuple[str, float]]:
    parts = [p.strip() for p in re.findall(r'[^.!?؟،,]+[.!?؟،,]?', text) if p.strip('.!?؟،, ')]
    out: list[tuple[str, float]] = []
    buf = ''
    for p in parts:
        buf = f'{buf} {p}'.strip()
        ends_sentence = p[-1] in '.!?؟'
        if len(buf.split()) >= MIN_WORDS and (ends_sentence or len(buf.split()) >= 12):
            out.append((buf, PAUSE.get(buf[-1], 0.0)))
            buf = ''
    if buf:
        if out and len(buf.split()) < MIN_WORDS:
            prev, _ = out.pop()
            buf = f'{prev} {buf}'
        out.append((buf, PAUSE.get(buf[-1], 0.0)))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--ckpt', required=True)
    ap.add_argument('--vocab', required=True)
    ap.add_argument('--refs', required=True)
    ap.add_argument('--port', type=int, default=5007)
    ap.add_argument('--nfe', type=int, default=16)
    ap.add_argument('--speed', type=float, default=0.9, help='below 1 gives each word more time: fewer skipped words')
    a = ap.parse_args()
    torch.set_num_threads(os.cpu_count() or 4)
    model = load_model(DiT, CFG, a.ckpt, vocab_file=a.vocab)
    vocoder = load_vocoder('vocos')
    refs = {}
    for wav in glob.glob(os.path.join(a.refs, '*.wav')):
        spk = os.path.splitext(os.path.basename(wav))[0]
        refs[spk] = preprocess_ref_audio_text(wav, open(wav[:-4] + '.txt', encoding='utf-8').read().strip())
    lock = threading.Lock()

    class H(BaseHTTPRequestHandler):
        def _send(self, code, body, ctype='application/json', extra=None):
            self.send_response(code)
            self.send_header('Content-Type', ctype)
            self.send_header('Content-Length', str(len(body)))
            for k, v in (extra or {}).items():
                self.send_header(k, v)
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            if self.path == '/health':
                return self._send(200, json.dumps({'ok': True, 'speakers': sorted(refs), 'nfe': a.nfe}).encode())
            self._send(404, b'{"error":"not found"}')

        def do_POST(self):
            if self.path != '/synthesize':
                return self._send(404, b'{"error":"not found"}')
            try:
                req = json.loads(self.rfile.read(min(int(self.headers.get('Content-Length', 0)), 200_000)) or b'{}')
            except (ValueError, json.JSONDecodeError):
                return self._send(400, b'{"error":"bad json"}')
            spk, clean = str(req.get('speaker', '')), normalize(str(req.get('text', '')))
            try:
                speed = float(req.get('speed', a.speed))
            except (TypeError, ValueError):
                speed = a.speed
            speed = min(1.5, max(0.6, speed))
            if spk not in refs or not clean or len(clean) > 2000:
                return self._send(400, b'{"error":"unknown speaker, empty or too long"}')
            ref_audio, ref_text = refs[spk]
            pieces, sr = [], 24000
            with lock:
                for part, pause in sentences(clean):
                    wav, sr, _ = infer_process(ref_audio, ref_text, part, model, vocoder, nfe_step=a.nfe, speed=speed,
                                               sway_sampling_coef=-1.0, show_info=lambda *x: None)
                    pieces += [wav, np.zeros(int(sr * pause), dtype=np.float32)]
            audio = np.concatenate(pieces) if pieces else np.zeros(1, dtype=np.float32)
            buf = io.BytesIO()
            sf.write(buf, audio, sr, format='WAV', subtype='PCM_16')
            self._send(200, buf.getvalue(), 'audio/wav', {'X-Audio-Seconds': f'{len(audio) / sr:.3f}'})

        def log_message(self, fmt, *args):
            sys.stderr.write('f5 %s\n' % (fmt % args))

    srv = ThreadingHTTPServer(('127.0.0.1', a.port), H)
    print(f'speaker voices on http://127.0.0.1:{a.port}  speakers={sorted(refs)} nfe={a.nfe}', flush=True)
    srv.serve_forever()


if __name__ == '__main__':
    main()
