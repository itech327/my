#!/usr/bin/env python3
"""python3 unpack_audio.py out.wav slice1.txt [slice2.txt ...]
Joins the base64 slices returned by the Sada connector tool fetch_audio (in call order)
into one WAV. Each slice file is the saved tool result: JSON content blocks or plain text.
The base64 is the longest [A-Za-z0-9+/=] run in the file."""
import sys, re, base64
out, parts = sys.argv[1], sys.argv[2:]
data = b''
for p in parts:
    txt = open(p, encoding='utf-8', errors='ignore').read()
    runs = re.findall(r'[A-Za-z0-9+/]{1000,}={0,2}', txt)
    assert runs, f'no base64 found in {p}'
    data += base64.b64decode(max(runs, key=len))
assert data[:4] == b'RIFF', 'not a WAV: the slices are missing or out of order'
open(out, 'wb').write(data)
print(out, len(data), 'bytes')
