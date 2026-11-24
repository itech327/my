"""Copy the decor kit into a pop-up 3D lesson, between /* DECOR:BEGIN and /* DECOR:END */.

  python3 tools/inject_decor.py LESSON.html [LESSON2.html ...]

The lesson must already hold the two markers (an empty block is enough):
  /* DECOR:BEGIN */ /* DECOR:END */
Run it again every time template/decor-kit.js changes.
"""
import os, re, sys
KIT = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'template', 'decor-kit.js'), encoding='utf-8').read().strip()
if len(sys.argv) < 2: sys.exit(__doc__)
for path in sys.argv[1:]:
    s = open(path, encoding='utf-8').read()
    s2, n = re.subn(r'/\* DECOR:BEGIN.*?/\* DECOR:END \*/', lambda _: KIT, s, flags=re.S)
    if n != 1: sys.exit(f'{path}: expected one DECOR block, found {n}')
    open(path, 'w', encoding='utf-8').write(s2); print('decor kit injected into', path)
