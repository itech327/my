import subprocess, sys
from playwright.sync_api import sync_playwright
FPS=25; DUR=84
out=sys.argv[1] if len(sys.argv)>1 else 'priorites-1ac-tableau.mp4'
ff=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','image2pipe','-framerate',str(FPS),'-i','-','-c:v','libx264','-preset','veryfast','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',out],stdin=subprocess.PIPE)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1920,'height':1080})
    pg.goto('file:///home/claude/video-1ac-l1/board.html'); pg.evaluate('document.fonts.ready')
    n=FPS*DUR
    for i in range(n):
        pg.evaluate(f'render({i/FPS})')
        ff.stdin.write(pg.screenshot(type='png'))
        if i%250==0: print(i,n,flush=True)
    b.close()
ff.stdin.close(); ff.wait(); print('done')
