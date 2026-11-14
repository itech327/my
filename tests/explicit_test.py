#!/usr/bin/env python3
"""Séances explicites 2AC pionnier (période 1, semaine 1) : générateurs, onglets, étapes, lexique."""
import os
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = []
def check(c, m):
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
with sync_playwright() as p:
    try: b = p.chromium.launch()
    except Exception: b = p.chromium.launch(channel='chrome')
    ctx = b.new_context(viewport={'width': 420, 'height': 900})
    ctx.add_init_script("try{localStorage.setItem('mm-kind','pion');localStorage.setItem('lab_auto','0');localStorage.setItem('lab_wel',String(Date.now()));sessionStorage.setItem('lab_skip','1');sessionStorage.setItem('lab_barmin','0')}catch(e){}")
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.route('**/*', lambda r: r.abort() if r.request.url.startswith('http') else r.continue_())
    pg.goto('file://' + os.path.join(ROOT, 'maths.html')); pg.wait_for_timeout(800)
    # générateurs : 400 tirages par clé et niveau
    bad = pg.evaluate("""function(){
      var out=[],keys=['pexp','cpar','rnec','mono'],MM=window.MM;
      keys.forEach(function(k){[1,2,3].forEach(function(s){for(var i=0;i<400;i++){
        var it=MM.genItem(k,s),txt=JSON.stringify(it);
        if(/undefined|NaN|\\[object/.test(txt)){out.push(k+s+' texte '+it.q);break}
        if(it.t==='num'&&!(isFinite(it.a))){out.push(k+s+' réponse');break}
        if(it.t==='qcm'){var seen={},dup=false;it.o.forEach(function(o){if(seen[o])dup=true;seen[o]=1});
          if(dup||it.a<0||it.a>=it.o.length||it.o.length<3){out.push(k+s+' qcm '+it.q);break}}
      }})});return out}()""")
    check(not bad, 'générateurs sains sur 400 tirages (%s)' % (bad[:2],))
    # exactitude : num de pexp et mono rejouables
    exact = pg.evaluate("""function(){var MM=window.MM,bad=0;
      for(var i=0;i<300;i++){var it=MM.genItem('pexp',1);var m=/^(\\d+)<sup>(\\d+)<\\/sup> = \\?$/.exec(it.q);if(m&&Math.pow(+m[1],+m[2])!==it.a)bad++}
      return bad}()""")
    check(exact == 0, 'pexp niveau 1 : valeurs exactes')
    for cid, title in (('pi2-15', 'Puissances à exposant positif'), ('pi2-16', 'Pourquoi la racine carrée'), ('pi2-17', 'Monômes')):
        pg.evaluate("location.hash='#%s'" % cid); pg.wait_for_timeout(500)
        sec = pg.locator('#%s' % cid)
        check(sec.count() == 1 and title in sec.inner_text(), cid + ' : page affichée')
        heads = pg.locator('#%s .lesson h3' % cid).all_inner_texts()
        check(len(heads) == 4 and 'Je me prépare' in heads[0] and 'Je regarde' in heads[1], cid + ' : 4 parties dont « Je me prépare » (%s)' % heads)
        check(pg.locator('#%s .px-lex .fr-w' % cid).count() >= 5, cid + ' : carte lexicale')
        check(pg.locator('#%s .lesson:first-of-type .px-item' % cid).count() == 3, cid + ' : trois questions vrai ou faux')
        check(pg.locator('#%s .px-plan li' % cid).count() == 3, cid + ' : trois étapes fixes du modelage')
    pg.evaluate("location.hash='#pi2-15'"); pg.wait_for_timeout(300)
    first = pg.locator('#pi2-15 .lesson:first-of-type .px-item').first
    first.locator('.opt').first.click(); pg.wait_for_timeout(200)
    check(pg.locator('#pi2-15 .px-item.is-ok, #pi2-15 .px-item.is-ko').count() == 1, 'vrai ou faux : réponse corrigée avec explication')
    pg.evaluate("location.hash='#home'"); pg.wait_for_timeout(300)
    lv2 = pg.locator('#plevels button').nth(1); lv2.click(); pg.wait_for_timeout(400)
    hrefs = pg.evaluate("Array.from(document.querySelectorAll('#pcontent a.chap')).map(function(a){return a.getAttribute('href')})")
    check('#pi2-15' in hrefs and '#pi2-16' in hrefs and '#pi2-17' in hrefs, 'séquences listées dans le parcours pionnier 2AC')
    check(not errs, 'aucune erreur JS %s' % errs[:1])
    b.close()
print('FAILS: %d' % len(fails))
raise SystemExit(1 if fails else 0)
