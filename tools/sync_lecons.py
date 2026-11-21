#!/usr/bin/env python3
"""Lit les leçons publiées sur les sous-domaines (mouvement/dist/<matière>/<leçon>/index.html)
et écrit source/lecons.json, utilisé par build.py pour relier le portail aux leçons pas à pas.
Usage : python3 tools/sync_lecons.py /chemin/vers/mouvement/dist"""
import sys, re, json, os, html
dist = sys.argv[1]
out = {}
for s in ('maths', 'pc', 'svt'):
    items = []
    for d in sorted(os.listdir(os.path.join(dist, s))):
        f = os.path.join(dist, s, d, 'index.html')
        m = re.match(r'(1ac|2ac|3ac)-', d)
        if not (m and os.path.exists(f)): continue
        t = re.search(r'<title>(.*?)</title>', open(f, encoding='utf8').read(), re.S).group(1)
        t = html.unescape(t).rsplit(' · ', 1)[0]
        ar, fr = [x.strip() for x in t.split(' | ', 1)]
        items.append({'slug': d, 'niveau': m.group(1), 'ar': ar, 'fr': fr})
    out[s] = items
json.dump(out, open(os.path.join(os.path.dirname(__file__), '..', 'source', 'lecons.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print({k: len(v) for k, v in out.items()})
