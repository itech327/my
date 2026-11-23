#!/usr/bin/env python3
"""python3 render.py [sortie.mp4] : rend board.html en vidéo muette 1920x1080, 30 i/s (images JPEG)."""
import subprocess, sys, os
from playwright.sync_api import sync_playwright
FPS = 30
out = sys.argv[1] if len(sys.argv) > 1 else 'pythagore-2ac-muet.mp4'
tmp = out[:-4] + '.part.mp4'
ff = subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','image2pipe','-c:v','mjpeg','-framerate',str(FPS),'-i','-',
    '-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',tmp], stdin=subprocess.PIPE)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width':1920,'height':1080})
    pg.goto('file://' + os.path.abspath('board.html')); pg.evaluate('document.fonts.ready')
    n = int(pg.evaluate('DURATION') * FPS)
    for i in range(n):
        pg.evaluate('t => render(t)', i / FPS)
        ff.stdin.write(pg.screenshot(type='jpeg', quality=92))
        if i % 300 == 0: print(i, n, flush=True)
    b.close()
ff.stdin.close()
if ff.wait() == 0: os.replace(tmp, out); print('done', out)
