"""Build atelier.html, one standalone file: the form, the adapter, the engine template and the example specs.

  python3 build_atelier.py [TEMPLATE.html]      # template defaults to $FIKRA_TEMPLATE
"""
import glob, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
tpl_path = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('FIKRA_TEMPLATE')
if not tpl_path: sys.exit(__doc__)
src = open(os.path.join(HERE, 'atelier-src.html'), encoding='utf-8').read()
adapter = open(os.path.join(HERE, 'fikra-spec.js'), encoding='utf-8').read()
tpl = open(tpl_path, encoding='utf-8').read()
ex = {os.path.basename(p)[:-5]: json.load(open(p, encoding='utf-8')) for p in sorted(glob.glob(os.path.join(HERE, 'specs', '*.json')))}
import base64
def inline(spec):  # examples carry their audio inside, so the preview can play it
    for part in ('hook', 'rule'):
        a = spec.get(part, {}).get('audio', '')
        fp = os.path.join(HERE, '..', 'lecons', a)
        if a and not a.startswith('data:') and os.path.isfile(fp):
            spec[part]['audio'] = 'data:audio/mpeg;base64,' + base64.b64encode(open(fp, 'rb').read()).decode()
    return spec
ex = {k: inline(v) for k, v in ex.items()}
js = lambda o: json.dumps(o, ensure_ascii=False).replace('</', '<\\/')
out = (src.replace('/*@@ADAPTER@@*/', '/*@@BEGIN-ADAPTER@@*/\n' + adapter + '\n/*@@END-ADAPTER@@*/', 1)
          .replace("/*@@TEMPLATE@@*/''", js(tpl), 1).replace('/*@@EXAMPLES@@*/{}', js(ex), 1))
open(os.path.join(HERE, 'atelier.html'), 'w', encoding='utf-8').write(out)
print('wrote atelier.html', len(out) // 1024, 'KB,', len(ex), 'examples')
