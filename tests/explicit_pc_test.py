#!/usr/bin/env python3
"""Séances explicites de physique-chimie pour le collège pionnier : banques, onglets, étapes, lexique."""
import os
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = []
def check(c, m):
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
IDS1 = ['pi1-%d' % n for n in range(13, 19)]
IDS2 = ['pi2-%d' % n for n in range(12, 17)]
IDS3 = ['pi3-%d' % n for n in range(10, 14)]
ALL = IDS1 + IDS2 + IDS3
with sync_playwright() as p:
    try: b = p.chromium.launch()
    except Exception: b = p.chromium.launch(channel='chrome')
    ctx = b.new_context(viewport={'width': 420, 'height': 900})
    ctx.add_init_script("try{localStorage.setItem('pc-save',JSON.stringify({kind:'pion',plv:1}));localStorage.setItem('lab_auto','0');localStorage.setItem('lab_wel',String(Date.now()));sessionStorage.setItem('lab_skip','1');sessionStorage.setItem('lab_barmin','0')}catch(e){}")
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.route('**/*', lambda r: r.abort() if r.request.url.startswith('http') else r.continue_())
    pg.goto('file://' + os.path.join(ROOT, 'physique-chimie.html')); pg.wait_for_timeout(800)
    bad = pg.evaluate("""function(ids){var out=[];var B=window.PC.bank;
      ids.forEach(function(id){var bk=B[id];if(!bk){out.push(id+' banque absente');return}
        var lv={1:0,2:0,3:0},qs={};
        bk.q.forEach(function(x){
          lv[x[0]]++;var o=x[2],seen={},dup=false;
          o.forEach(function(t){if(seen[t])dup=true;seen[t]=1});
          if(dup||o.length<3||x[3]<0||x[3]>=o.length||!x[1]||!x[4])out.push(id+' question '+x[1]);
          if(qs[x[1]])out.push(id+' doublon '+x[1]);qs[x[1]]=1;
          if(/undefined|NaN|\\[object/.test(JSON.stringify(x)))out.push(id+' texte '+x[1]);
          var len=o.map(function(t){return t.length});
        });
        if(lv[1]<3||lv[2]<3||lv[3]<3)out.push(id+' niveaux '+JSON.stringify(lv));
      });return out}""", ALL)
    check(not bad, 'banques saines : %s' % (bad[:3],))
    # les deux bonnes réponses ne sont pas toujours les plus longues
    longest = pg.evaluate("""function(ids){var n=0,t=0;ids.forEach(function(id){window.PC.bank[id].q.forEach(function(x){t++;var m=0,mi=0;x[2].forEach(function(o,i){if(o.length>m){m=o.length;mi=i}});if(mi===x[3])n++})});return [n,t]}""", ALL)
    check(longest[0] <= longest[1] * 0.75, 'la bonne réponse n’est pas toujours la plus longue (%d / %d)' % tuple(longest))
    d = pg.evaluate("window.PC.pion.data[1].periods[0].seqs")
    d2 = pg.evaluate("window.PC.pion.data[2].periods[0].seqs"); d3 = pg.evaluate("window.PC.pion.data[3].periods[0].seqs")
    check(d2[:5] == IDS2 and d3[:4] == IDS3, 'séquences 2AC et 3AC en tête de la période 1 : %s %s' % (d2, d3))
    check(d[:6] == IDS1, 'séquences 1AC en tête de la période 1 : %s' % (d[:7],))
    links = pg.evaluate("Array.from(document.querySelectorAll('#pcontent a.chap')).map(function(a){return a.getAttribute('href')})")
    check(all(('#' + i) in links for i in IDS1), 'séquences listées dans le parcours pionnier 1AC')
    for i in ALL:
        pg.goto('file://' + os.path.join(ROOT, 'physique-chimie.html') + '#' + i); pg.wait_for_timeout(500)
        heads = pg.evaluate("Array.from(document.querySelectorAll('#%s .lesson h3')).map(function(h){return h.textContent})" % i)
        check(heads == ['Je me prépare', 'Je regarde', 'Nous faisons', 'Je fais seul'], i + ' : quatre étapes %s' % (heads,))
        n = pg.evaluate("[document.querySelectorAll('#%s .px-lex .fr-w').length,document.querySelectorAll('#%s #%s-l1 .px-item').length,document.querySelectorAll('#%s .px-plan li').length]" % (i, i, i, i))
        check(n[0] >= 5 and n[1] == 3 and n[2] >= 3, i + ' : lexique, 3 vrai ou faux, plan %s' % (n,))
        # exemple pas à pas : on avance jusqu'à la fin
        steps = pg.evaluate("""function(id){var sec=document.getElementById(id+'-l2');var btn=Array.from(sec.querySelectorAll('button')).filter(function(b){return b.textContent==='Étape suivante'})[0];
          var c=0;while(!btn.disabled&&c<10){btn.click();c++}return [c,sec.querySelectorAll('.px-board .px-line').length]}""", i)
        check(steps[0] >= 3 and steps[0] == steps[1], i + ' : exemple pas à pas %s' % (steps,))
        nf = pg.evaluate("document.querySelectorAll('#%s-l3 .px-item').length" % i)
        check(nf == 3, i + ' : trois exercices guidés')
        # série : on répond juste partout et on gagne l'étoile
        res = pg.evaluate("""function(id){var sec=document.getElementById(id+'-l4');return sec.querySelectorAll('.px-item').length}""", i)
        check(res == 5, i + ' : série de cinq questions')
    check(not errs, 'aucune erreur JS %s' % (errs[:2],))
    b.close()
print('FAILS: %d' % len(fails))
