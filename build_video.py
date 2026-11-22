import sys, os, json, subprocess, time
from playwright.sync_api import sync_playwright
# usage: build_video.py out.mp4 [timings.json] [--frames-only DIR] [--stills t1 t2 ...]
out = sys.argv[1]; tj = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2].endswith('.json') else None
FPS = 30
here = os.path.dirname(os.path.abspath(__file__)); fr = os.path.join(here, 'frames'); os.makedirs(fr, exist_ok=True)
for f in os.listdir(fr): os.remove(os.path.join(fr, f))
srv = subprocess.Popen(['python3', '-m', 'http.server', '8767', '--bind', '127.0.0.1', '--directory', here], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(.8)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': 720, 'height': 1280}, device_scale_factor=1)
        pg.goto('http://127.0.0.1:8767/lab.html?render=1'); pg.wait_for_timeout(1000)
        dur = pg.evaluate('window.__cinemaDuration')
        if tj:
            tm = json.load(open(os.path.join(here, tj)))['lines']; dur = pg.evaluate('(tm)=>setTimings(tm)', tm)
        n = int(dur * FPS)
        print('frames', n, 'dur', dur, flush=True)
        for i in range(n):
            pg.evaluate(f'render({i / FPS})'); pg.screenshot(path=f'{fr}/{i:05d}.jpg', type='jpeg', quality=93)
            if i % 150 == 0: print(i, flush=True)
        b.close()
finally:
    srv.terminate()
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', f'{fr}/%05d.jpg', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], check=True)
print('done', out)
