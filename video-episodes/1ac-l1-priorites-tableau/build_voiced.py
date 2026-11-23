#!/usr/bin/env python3
"""python3 build_voiced.py DOSSIER_WAV [sortie.mp4]
DOSSIER_WAV contient 01.wav ... 09.wav (une voix par segment, voir SEG).
Recale le temps de la vidéo sur la durée de chaque voix, rend les images, mixe l'audio."""
import sys, os, json, subprocess, wave
from playwright.sync_api import sync_playwright
FPS = 25
SEG = [(0.4, 11.6), (12.6, 18.6), (18.8, 29.6), (30.4, 37.0), (37.2, 44.0), (45.0, 58.0), (59.0, 66.0), (66.4, 78.0), (79.6, 83.6)]
ORIG_END = 84.0
folder = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else 'priorites-1ac-tableau-voix.mp4'
def dur(f):
    with wave.open(f) as w: return w.getnframes() / w.getframerate()
lens = [dur(os.path.join(folder, '%02d.wav' % (i + 1))) for i in range(len(SEG))]
K = [[0.0, 0.0]]; starts = []; po, pn = 0.0, 0.0
for (a, b), L in zip(SEG, lens):
    n0 = pn + (a - po); D = max(b - a, L + 0.6)
    K += [[a, n0], [b, n0 + D]]; starts.append(n0); po, pn = b, n0 + D
total = pn + (ORIG_END - po)
K.append([ORIG_END, total])
print('durées voix', [round(x, 1) for x in lens], 'total', round(total, 1))
# audio : delais ffmpeg
cmd = ['ffmpeg', '-y', '-loglevel', 'error']
for i in range(len(SEG)): cmd += ['-i', os.path.join(folder, '%02d.wav' % (i + 1))]
fl = ';'.join('[%d:a]aresample=48000,adelay=%d|%d[a%d]' % (i, int((starts[i] + 0.15) * 1000), int((starts[i] + 0.15) * 1000), i) for i in range(len(SEG)))
fl += ';' + ''.join('[a%d]' % i for i in range(len(SEG))) + 'amix=inputs=%d:normalize=0,apad,atrim=0:%.2f[aout]' % (len(SEG), total)
cmd += ['-filter_complex', fl, '-map', '[aout]', 'voices.wav']
subprocess.run(cmd, check=True)
ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', str(FPS), '-i', '-', '-i', 'voices.wav',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1920, 'height': 1080})
    pg.goto('file://' + os.path.abspath('board.html')); pg.evaluate('document.fonts.ready')
    pg.evaluate('K => { window.KN = K; }', K)
    n = int(total * FPS)
    for i in range(n):
        pg.evaluate('t => render(t)', i / FPS)
        ff.stdin.write(pg.screenshot(type='png'))
        if i % 250 == 0: print(i, n, flush=True)
    b.close()
ff.stdin.close(); ff.wait(); print('done', out, round(total, 1), 's')
