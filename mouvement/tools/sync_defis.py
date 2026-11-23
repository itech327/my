#!/usr/bin/env python3
"""Copie le moteur des défis depuis le site principal (branche lessons-site) vers mouvement/defis/.

python3 mouvement/tools/sync_defis.py CHEMIN_DU_SITE_PRINCIPAL

Fichiers produits (à committer, la construction ne lit que ceux-ci) :
  defis/lab.js        moteur partagé (lab/lab.js), utilisé ici en mode intégré
  defis/maths.js      générateurs de maths (extraits de source/maths.fragment.html) + lab/lab-maths.js
  defis/pc.js         aides, molécules, générateurs et banque de physique-chimie + lab/lab-pc.js
  defis/svt.js        lab/lab-svt.js (banque autonome)
  defis/chapitres.json  chapitres des défis par matière : [id, niveau, titre, titre arabe]
  defis/enigmes.json    énigmes du jour par matière
La Riyada n'est pas copiée (elle reste dans les pages « Exercices et défis »)."""
import json, re, sys
from pathlib import Path

SRC = Path(sys.argv[1] if len(sys.argv) > 1 else '../wt-ls2')
OUT = Path(__file__).resolve().parent.parent / 'defis'
rd = lambda p: (SRC / p).read_text(encoding='utf-8')
EMBED = '\nwindow.LAB_CONFIG && (window.LAB_CONFIG.embed = true);\n'


def block(text, start_marker, end_marker='\n</script>'):
    """Corps du <script> qui contient start_marker."""
    i = text.index(start_marker)
    a = text.rindex('<script>', 0, i) + len('<script>')
    b = text.index(end_marker, i)
    return text[a:b].strip('\n') + '\n'


def lines_between(text, first, last):
    a = text.index(first)
    b = text.index(last, a) + len(last)
    return text[a:b]


def main():
    OUT.mkdir(exist_ok=True)
    (OUT / 'lab.js').write_text(rd('lab/lab.js'), encoding='utf-8')
    m = rd('source/maths.fragment.html')
    gm = block(m, 'M.G=G;')
    assert 'var M=window.MM,G={};' in gm and 'M.genItem=function' in gm
    (OUT / 'maths.js').write_text('/* généré par sync_defis.py : ne pas modifier ici */\nwindow.MM = window.MM || {};\n' + gm + rd('lab/lab-maths.js') + EMBED, encoding='utf-8')
    p = rd('source/physique-chimie.fragment.html')
    helpers = lines_between(p, 'function fmt(x,d){', 'function clamp(x,a,b){return Math.min(b,Math.max(a,x))}')
    rnd = lines_between(p, 'PC.rnd=function', "PC.shuffle=function(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a};")
    mol = lines_between(p, 'var AT={H:', 'L.MOL=MOL;L.AT=AT;')
    gen = block(p, 'var G=PC.gen={};')
    bank = block(p, 'var B=PC.bank={};')
    pc = ('/* généré par sync_defis.py : ne pas modifier ici */\n(function(){\nvar PC=window.PC=window.PC||{};\n' + helpers +
          '\nPC.fmt=fmt;PC.clamp=clamp;\n' + rnd + '\nvar L=PC.lib=PC.lib||{};\n' + mol + '\n})();\n' + gen + bank + rd('lab/lab-pc.js') + EMBED)
    (OUT / 'pc.js').write_text(pc, encoding='utf-8')
    (OUT / 'svt.js').write_text('/* généré par sync_defis.py : ne pas modifier ici */\n' + rd('lab/lab-svt.js') + EMBED, encoding='utf-8')
    # chapitres : identifiant, niveau, titre, titre arabe, lus dans les pages classiques construites
    pat = re.compile(r"""id\s*:\s*'([cs](\d)-\d+)'(.{0,400}?)title\s*:\s*'((?:[^'\\]|\\.)*)'(?:\s*,\s*ar\s*:\s*'((?:[^'\\]|\\.)*)')?""", re.S)
    out = {}
    for s, page in (('maths', 'maths.html'), ('pc', 'physique-chimie.html'), ('svt', 'svt.html')):
        seen, lst = set(), []
        for mm in pat.finditer(rd(page)):
            cid = mm.group(1)
            if cid in seen or '{' in mm.group(3):
                continue
            seen.add(cid)
            unq = lambda t: (t or '').replace("\\'", "'")
            lst.append([cid, mm.group(2), unq(mm.group(4)), unq(mm.group(5))])
        out[s] = lst
    (OUT / 'chapitres.json').write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding='utf-8')
    # énigmes du jour : lues en exécutant lab-<matière>.js dans node (le fichier ne fait que déclarer sa configuration)
    import subprocess
    en = {}
    for s, f in (('maths', 'lab/lab-maths.js'), ('pc', 'lab/lab-pc.js'), ('svt', 'lab/lab-svt.js')):
        js = 'global.window={};require(process.argv[1]);process.stdout.write(JSON.stringify(window.LAB_CONFIG.riddles||[]))'
        en[s] = json.loads(subprocess.run(['node', '-e', js, str((SRC / f).resolve())], capture_output=True, text=True, check=True).stdout)
    (OUT / 'enigmes.json').write_text(json.dumps(en, ensure_ascii=False, indent=1), encoding='utf-8')
    print({k: len(v) for k, v in out.items()}, {k: len(v) for k, v in en.items()})


if __name__ == '__main__':
    main()
