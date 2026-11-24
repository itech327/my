"""Build the teacher atelier, one standalone HTML file: the form, the adapter, the engine template and example specs.

  python3 tools/build_atelier.py OUT.html [SPECS_DIR] [AUDIO_BASE_DIR]

SPECS_DIR defaults to examples/specs. Audio paths in the specs are inlined from AUDIO_BASE_DIR when the files exist.
"""
import glob, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
if len(sys.argv) < 2: sys.exit(__doc__)
OUT = sys.argv[1]
SPECS = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, 'examples', 'specs')
AUDIO = sys.argv[3] if len(sys.argv) > 3 else ROOT
tpl_path = os.path.join(ROOT, 'template', 'lesson-template.html')
src = open(os.path.join(ROOT, 'spec', 'atelier-src.html'), encoding='utf-8').read()
adapter = open(os.path.join(ROOT, 'spec', 'fikra-spec.js'), encoding='utf-8').read()
tpl = open(tpl_path, encoding='utf-8').read()
ex = {os.path.basename(p)[:-5]: json.load(open(p, encoding='utf-8')) for p in sorted(glob.glob(os.path.join(SPECS, '*.json')))}
import base64
def inline(spec):  # examples carry their audio inside, so the preview can play it
    for part in ('hook', 'rule'):
        a = spec.get(part, {}).get('audio', '')
        fp = os.path.join(AUDIO, a)
        if a and not a.startswith('data:') and os.path.isfile(fp):
            spec[part]['audio'] = 'data:audio/mpeg;base64,' + base64.b64encode(open(fp, 'rb').read()).decode()
    return spec
ex = {k: inline(v) for k, v in ex.items()}
js = lambda o: json.dumps(o, ensure_ascii=False).replace('</', '<\\/')
out = (src.replace('/*@@ADAPTER@@*/', '/*@@BEGIN-ADAPTER@@*/\n' + adapter + '\n/*@@END-ADAPTER@@*/', 1)
          .replace("/*@@TEMPLATE@@*/''", js(tpl), 1).replace('/*@@EXAMPLES@@*/{}', js(ex), 1))
open(OUT, 'w', encoding='utf-8').write(out)
print('wrote', OUT, len(out) // 1024, 'KB,', len(ex), 'examples')
