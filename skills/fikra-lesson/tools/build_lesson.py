"""Build or update a « Le concept en main » lesson.

  python3 build_lesson.py new  LESSON_BLOCK.js  OUT.html   # template + your LESSON block
  python3 build_lesson.py sync LESSON.html                  # refresh STYLE and ENGINE from the template

The lesson keeps its own LESSON block; STYLE and ENGINE always come from
template/lesson-template.html, so every lesson runs the same tested engine.
"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(HERE, '..', 'template', 'lesson-template.html')

def block(text, name):
    m = re.search(r'/\* %s:BEGIN.*?/\* %s:END \*/' % (name, name), text, re.S)
    if not m: sys.exit('marker %s not found' % name)
    return m

def replace(text, name, new):
    m = block(text, name); return text[:m.start()] + new + text[m.end():]

def title_of(lesson_js):
    m = re.search(r"title:\s*(['\"])(.*?)\1", lesson_js)
    return (m.group(2) + ' · Le concept en main') if m else 'Le concept en main'

def main():
    t = open(TEMPLATE, encoding='utf-8').read()
    if len(sys.argv) == 4 and sys.argv[1] == 'new':
        lesson = open(sys.argv[2], encoding='utf-8').read()
        lesson_block = block(lesson, 'LESSON').group(0)
        out = replace(t, 'LESSON', lesson_block)
        out = re.sub(r'<title>.*?</title>', '<title>%s</title>' % title_of(lesson_block).replace('\\', ''), out, count=1)
        open(sys.argv[3], 'w', encoding='utf-8').write(out); print('wrote', sys.argv[3])
    elif len(sys.argv) == 4 and sys.argv[1] == 'bundle':
        # one standalone file: every audio/xxx.mp3 next to the lesson is inlined as a data URI
        import base64
        src = sys.argv[2]; s = open(src, encoding='utf-8').read(); base = os.path.dirname(os.path.abspath(src))
        def inline(m):
            fp = os.path.join(base, m.group(2))
            if not os.path.isfile(fp): return m.group(0)  # e.g. the example path in the engine comment
            return m.group(1) + 'data:audio/mpeg;base64,' + base64.b64encode(open(fp, 'rb').read()).decode() + m.group(3)
        s, n = re.subn(r'''(["']?audio["']?:\s*["'])([\w./-]+\.mp3)(["'])''', inline, s)
        open(sys.argv[3], 'w', encoding='utf-8').write(s); print('wrote', sys.argv[3], f'({n} audio inlined)')
    elif len(sys.argv) == 3 and sys.argv[1] == 'sync':
        p = sys.argv[2]; s = open(p, encoding='utf-8').read()
        for name in ('STYLE', 'ENGINE'): s = replace(s, name, block(t, name).group(0))
        open(p, 'w', encoding='utf-8').write(s); print('synced', p)
    else:
        sys.exit(__doc__)

if __name__ == '__main__':
    main()
