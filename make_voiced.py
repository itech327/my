#!/usr/bin/env python3
"""python3 make_voiced.py links.txt [out.mp4]
links.txt : 8 lines, one per voice line, in order. Each is a voice.taalim.men/audio/<id> link
(from speak_moroccan) or a local .wav path. Downloads, then runs retime_lab.py.
Needs voice.taalim.men in the environment's allowed domains."""
import sys, os, shutil, subprocess, urllib.request
here = os.path.dirname(os.path.abspath(__file__))
src = [l.strip() for l in open(sys.argv[1]) if l.strip()]
assert len(src) == 8, f'need 8 lines, got {len(src)}'
d = os.path.join(here, 'voice_final'); os.makedirs(d, exist_ok=True)
for i, s in enumerate(src, 1):
    dst = os.path.join(d, f'{i:02d}.wav')
    if s.startswith('http'):
        with urllib.request.urlopen(s, timeout=60) as r, open(dst, 'wb') as f: shutil.copyfileobj(r, f)
    else:
        shutil.copy(s, dst)
    print(i, os.path.getsize(dst), 'bytes')
subprocess.run(['python3', os.path.join(here, 'retime_lab.py'), d] + sys.argv[2:3], check=True, cwd=here)
