import sys, asyncio
from playwright.sync_api import sync_playwright
ts=[float(x) for x in sys.argv[1:]]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1920,'height':1080})
    pg.goto('file:///home/claude/video-1ac-l1/board.html'); pg.evaluate('document.fonts.ready')
    import os; os.makedirs('stills',exist_ok=True)
    for t in ts:
        pg.evaluate(f'render({t})'); pg.screenshot(path=f'stills/t{t:05.1f}.png')
    b.close()
