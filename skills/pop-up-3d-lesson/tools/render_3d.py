"""Real rendering test: open a pop-up 3D page with the real three.js r160 and take one
screenshot per mode (each [data-m] chip), in portrait and landscape.

The CDN is often blocked in test sandboxes. Get three.js once from GitHub (git works there):
  git clone -q --depth 1 --branch r160 --filter=blob:none --sparse https://github.com/mrdoob/three.js /tmp/three
  cd /tmp/three && git sparse-checkout set --no-cone /build/three.module.js /examples/jsm/controls/OrbitControls.js

Usage: THREE_DIR=/tmp/three python3 tools/render_3d.py PAGE.html OUTDIR
Writes OUTDIR/portrait-<mode>.png, OUTDIR/landscape-<mode>.png and OUTDIR/sheet.png. Look at the sheet.
Animations are skipped (reduced motion), so every shot shows the final state of the decor.
"""
import os, sys
from playwright.sync_api import sync_playwright
TH = os.environ.get('THREE_DIR', '/tmp/three')
if len(sys.argv) < 3: sys.exit(__doc__)
page, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
CORS = {'Access-Control-Allow-Origin': '*'}; shots = []; errs = []
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    for name, (w, h) in [('portrait', (400, 860)), ('landscape', (900, 500))]:
        pg = b.new_page(viewport={'width': w, 'height': h}, reduced_motion='reduce')
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        pg.route('**/three.module.js', lambda r: r.fulfill(path=TH + '/build/three.module.js', content_type='application/javascript', headers=CORS))
        pg.route('**/controls/OrbitControls.js', lambda r: r.fulfill(path=TH + '/examples/jsm/controls/OrbitControls.js', content_type='application/javascript', headers=CORS))
        pg.goto('file://' + os.path.abspath(page)); pg.wait_for_timeout(2500)
        for m in [e.get_attribute('data-m') for e in pg.query_selector_all('[data-m]')]:
            pg.click(f'[data-m="{m}"]'); pg.wait_for_timeout(1500); f = f'{out}/{name}-{m}.png'; pg.screenshot(path=f); shots.append(f)
        pg.close()
    b.close()
try:
    from PIL import Image
    ims = [Image.open(f) for f in shots]; cols = 4; W = max(i.size[0] for i in ims); H = max(i.size[1] for i in ims)
    sheet = Image.new('RGB', (W * cols, H * ((len(ims) + cols - 1) // cols)), 'white')
    for k, im in enumerate(ims): sheet.paste(im, ((k % cols) * W, (k // cols) * H))
    sheet.thumbnail((2000, 2000)); sheet.save(f'{out}/sheet.png')
except ImportError: pass
print(len(shots), 'shots in', out); print('ERRORS:', errs or 'none'); sys.exit(1 if errs else 0)
