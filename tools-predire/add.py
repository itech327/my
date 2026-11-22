#!/usr/bin/env python3
"""python3 add.py batch.json : insère un champ predire avant « prepare: [ » de chaque leçon listée."""
import json, re, sys
base = '/home/claude/site-mv/mouvement/lessons/'
data = json.load(open(sys.argv[1], encoding='utf-8'))
for key, d in data.items():
    p = base + key + '.js'
    s = open(p, encoding='utf-8').read()
    if '    predire: {' in s:
        print('déjà fait', key); continue
    assert 0 <= d['a'] < len(d['o']) and d['q'] and d['e'] and d.get('ear') and d.get('ar'), key
    body = '    predire: {\n' + ',\n'.join('      %s: %s' % (k, json.dumps(d[k], ensure_ascii=False)) for k in ['q', 'ar', 'o', 'a', 'e', 'ear']) + '\n    },\n'
    m = re.search(r"\n    prepare: \[", s); assert m, key
    s = s[:m.start()] + '\n' + body + s[m.start():]
    open(p, 'w', encoding='utf-8').write(s); print('ok', key)
