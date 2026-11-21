#!/usr/bin/env python3
"""Small HTTP service around the Darija voice, for the app's TtsProvider.

    server.py --model voice.onnx --port 5005 [--speed 1.0] [--tashkeel]

POST /synthesize  {"text": "...", "speed": 1.0}  -> audio/wav
GET  /health                                      -> {"ok": true, ...}

Binds to 127.0.0.1 only. Put it behind the app, never on the open internet.
"""
import argparse
import io
import json
import os
import sys
import threading
import wave
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from normalize import normalize  # noqa: E402
from speak import load  # noqa: E402
from piper.config import SynthesisConfig  # noqa: E402

MAX_CHARS = 5000


def make_handler(voice, defaults):
    lock = threading.Lock()  # one synthesis at a time per voice

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
                return self._send(200, json.dumps({'ok': True, **defaults}).encode())
            self._send(404, b'{"error":"not found"}')

        def do_POST(self):
            if self.path != '/synthesize':
                return self._send(404, b'{"error":"not found"}')
            try:
                n = int(self.headers.get('Content-Length', 0))
                req = json.loads(self.rfile.read(min(n, 200_000)) or b'{}')
                text = str(req.get('text', ''))
                speed = float(req.get('speed', defaults['speed']))
            except (ValueError, json.JSONDecodeError):
                return self._send(400, b'{"error":"bad json"}')
            clean = normalize(text)
            if not clean or len(clean) > MAX_CHARS or not 0.5 <= speed <= 2.0:
                return self._send(400, b'{"error":"empty, too long, or bad speed"}')
            buf = io.BytesIO()
            cfg = SynthesisConfig(length_scale=1.0 / speed, noise_scale=defaults['noise'])
            with lock, wave.open(buf, 'wb') as wf:
                voice.synthesize_wav(clean, wf, syn_config=cfg)
            buf.seek(0)
            with wave.open(buf) as wf:
                seconds = wf.getnframes() / wf.getframerate()
            self._send(200, buf.getvalue(), 'audio/wav', {'X-Audio-Seconds': f'{seconds:.3f}'})

        def log_message(self, fmt, *args):
            sys.stderr.write('tts %s\n' % (fmt % args))

    return H


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', required=True)
    ap.add_argument('--port', type=int, default=5005)
    ap.add_argument('--speed', type=float, default=1.0)
    ap.add_argument('--noise', type=float, default=None)
    ap.add_argument('--tashkeel', action='store_true', help='MSA diacritizer. Off by default: measured worse for Darija')
    a = ap.parse_args()
    voice = load(a.model, a.tashkeel)
    defaults = {'speed': a.speed, 'noise': a.noise, 'tashkeel': a.tashkeel, 'model': os.path.basename(a.model)}
    srv = ThreadingHTTPServer(('127.0.0.1', a.port), make_handler(voice, defaults))
    print(f'darija voice on http://127.0.0.1:{a.port}  {defaults}', flush=True)
    srv.serve_forever()


if __name__ == '__main__':
    main()
