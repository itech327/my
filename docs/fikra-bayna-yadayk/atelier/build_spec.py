"""Build a « Le concept en main » lesson from a JSON spec, without writing code.

  python3 build_spec.py SPEC.json OUT.html [TEMPLATE.html]

The LESSON block becomes: fikra-spec.js + the spec + one call to FikraSpec.lessonFromSpec.
STYLE and ENGINE come unchanged from the skill template, so flow_test.py applies as is.
"""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_TEMPLATE = os.path.join(HERE, '..', '..', '..', '..', 'my', 'skills', 'fikra-lesson', 'template', 'lesson-template.html')

def main():
    if len(sys.argv) not in (3, 4): sys.exit(__doc__)
    spec = json.load(open(sys.argv[1], encoding='utf-8'))
    tpl = open(sys.argv[3] if len(sys.argv) == 4 else os.environ.get('FIKRA_TEMPLATE', DEFAULT_TEMPLATE), encoding='utf-8').read()
    adapter = open(os.path.join(HERE, 'fikra-spec.js'), encoding='utf-8').read()
    data = json.dumps(spec, ensure_ascii=False, indent=1).replace('</', '<\\/')
    block = ('/* LESSON:BEGIN · built from a JSON spec by atelier/build_spec.py. Edit the spec, not this block. */\n'
             + adapter + '\nconst SPEC = ' + data + ';\nconst LESSON = FikraSpec.lessonFromSpec(SPEC);\n/* LESSON:END */')
    m = re.search(r'/\* LESSON:BEGIN.*?/\* LESSON:END \*/', tpl, re.S)
    out = tpl[:m.start()] + block + tpl[m.end():]
    title = spec.get('meta', {}).get('title', 'Leçon')
    out = re.sub(r'<title>.*?</title>', lambda _: '<title>%s · Le concept en main</title>' % title.replace('<', ''), out, count=1)
    open(sys.argv[2], 'w', encoding='utf-8').write(out); print('wrote', sys.argv[2])

if __name__ == '__main__': main()
