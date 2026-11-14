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
      var out=[],keys=['pexp','cpar','rnec','mono','pdeg','pred','padd','psub','pmon','pbim','pbb','ppat','pdm','pdb','peq','pvaly'],MM=window.MM;
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
    # exactitude des polynômes : on évalue question et bonne réponse en x = 2, y = 3
    pol = pg.evaluate("""function(){
      var MM=window.MM,bad=[];
      function ev1(t,x,y){t=t.replace(/([xy])<sup>(\\d+)<\\/sup>/g,'Math.pow($1,$2)').replace(/−/g,'-').replace(/×/g,'*').replace(/÷/g,'/').replace(/(\\d)([xy]|Math)/g,'$1*$2').replace(/([xy])([xy]|Math)/g,'$1*$2').replace(/(\\d|[xy])\\(/g,'$1*(').replace(/\\)\\(/g,')*(').replace(/\\)(Math|[xy])/g,')*$1');
        return Function('x','y','return ('+t+')')(x,y)}
      function ev(t){return [ev1(t,2,3),ev1(t,5,-1)].map(function(v){return Math.round(v*1e6)/1e6}).join('|')}
      ['pred','padd','psub','pmon','pbim','pbb','pdm','pdb'].forEach(function(k){[2,3].forEach(function(s){for(var i=0;i<300;i++){
        var it=MM.genItem(k,s);if(it.t!=='qcm')continue;
        var q=it.q.replace(/^[^:(]*?(?=[\\d(x−])/,'').replace(/\\.$/,'');
        var m=/^(?:Réduis |Effectue l’addition : |Effectue la soustraction : |Calcule |Développe |Effectue la division : )(.*)\\.$/.exec(it.q);if(!m)continue;
        var expr=m[1];
        try{var a=ev(expr),b=ev(it.o[it.a]);if(a!==b){bad.push(k+s+' '+expr+' => '+it.o[it.a]);break}
          var wrong=it.o.filter(function(o,j){return j!==it.a&&ev(o)===a});if(wrong.length){bad.push(k+s+' faux ok '+expr);break}}
        catch(e){bad.push(k+s+' eval '+expr+' '+e);break}
      }})});return bad}()""")
    check(not pol, 'polynômes : bonne réponse exacte, distracteurs faux (%s)' % (pol[:2],))
    # motifs : la formule choisie doit redonner les rangs 1, 2 et 3 de l'énoncé
    pat = pg.evaluate("""function(){var MM=window.MM,bad=[];
      for(var i=0;i<400;i++){var it=MM.genItem('ppat',2);var m=/^Rang 1 : (\\d+) .*?rang 2 : (\\d+) .*?rang 3 : (\\d+) /.exec(it.q);
        if(!m){bad.push('format '+it.q);break}
        var f=/^(\\d*)n(?: \\+ (\\d+))?$/.exec(it.o[it.a]);if(!f){bad.push('formule '+it.o[it.a]);break}
        var a=f[1]===''?1:+f[1],b=f[2]?+f[2]:0;
        if(a+b!==+m[1]||2*a+b!==+m[2]||3*a+b!==+m[3]){bad.push(it.q+' => '+it.o[it.a]);break}
        var ok=it.o.filter(function(o,j){if(j===it.a)return false;var g=/^(\\d*)n(?: \\+ (\\d+))?$/.exec(o);if(!g)return false;var c=g[1]===''?1:+g[1],d=g[2]?+g[2]:0;return c+d===+m[1]&&2*c+d===+m[2]});
        if(ok.length){bad.push('distracteur valide '+it.q);break}}
      return bad}()""")
    check(not pat, 'motifs : formule cohérente avec les rangs (%s)' % (pat[:2],))
    # équations : la valeur calculée doit vérifier l'équation
    eqs = pg.evaluate("""function(){var MM=window.MM,bad=[];
      for(var i=0;i<400;i++){var it=MM.genItem('pvaly',1+i%3);
        var m=/^Dans l’équation (−?\\d*)x ([+−]) (\\d*)y = (−?\\d+), calcule (x|y) pour (x|y) = (−?\\d+)\\.$/.exec(it.q);
        if(!m){bad.push('format '+it.q);break}
        var n=function(v){return +v.replace('−','-')};
        var a=m[1]===''?1:(m[1]==='−'?-1:n(m[1])),b=(m[3]===''?1:+m[3])*(m[2]==='−'?-1:1),c=n(m[4]),v=n(m[7]);
        var x=m[6]==='x'?v:it.a,y=m[6]==='x'?it.a:v;
        if(a*x+b*y!==c){bad.push(it.q+' => '+it.a);break}}
      return bad}()""")
    check(not eqs, 'équations : valeur calculée exacte (%s)' % (eqs[:2],))
    for cid, title in (('pi2-15', 'Puissances à exposant positif'), ('pi2-16', 'Pourquoi la racine carrée'), ('pi2-17', 'Monômes'), ('pi2-18', 'Polynômes : le degré'), ('pi2-19', 'Réduire un polynôme'), ('pi2-20', 'Additionner deux polynômes'), ('pi2-21', 'Soustraire deux polynômes'), ('pi2-22', 'Multiplier deux monômes'), ('pi2-23', 'Multiplier un binôme par un monôme'), ('pi2-24', 'Multiplier deux binômes'), ('pi2-25', 'Problème de motifs'), ('pi2-26', 'Diviser un monôme par un monôme'), ('pi2-27', 'Diviser un binôme par un monôme'), ('pi2-28', 'Traduire une situation'), ('pi2-29', 'Calculer y pour une valeur de x')):
        pg.evaluate("location.hash='#%s'" % cid); pg.wait_for_timeout(500)
        sec = pg.locator('#%s' % cid)
        check(sec.count() == 1 and title in sec.inner_text(), cid + ' : page affichée')
        heads = pg.locator('#%s .lesson h3' % cid).all_inner_texts()
        check(len(heads) == 4 and 'Je me prépare' in heads[0] and 'Je regarde' in heads[1], cid + ' : 4 parties dont « Je me prépare » (%s)' % heads)
        check(pg.locator('#%s .px-lex .fr-w' % cid).count() >= 5, cid + ' : carte lexicale')
        check(pg.locator('#%s .lesson:first-of-type .px-item' % cid).count() == 3, cid + ' : trois questions vrai ou faux')
        check(pg.locator('#%s .px-plan li' % cid).count() >= 2, cid + ' : étapes fixes du modelage')
    pg.evaluate("location.hash='#pi2-15'"); pg.wait_for_timeout(300)
    first = pg.locator('#pi2-15 .lesson:first-of-type .px-item').first
    first.locator('.opt').first.click(); pg.wait_for_timeout(200)
    check(pg.locator('#pi2-15 .px-item.is-ok, #pi2-15 .px-item.is-ko').count() == 1, 'vrai ou faux : réponse corrigée avec explication')
    pg.evaluate("location.hash='#home'"); pg.wait_for_timeout(300)
    lv2 = pg.locator('#plevels button').nth(1); lv2.click(); pg.wait_for_timeout(400)
    hrefs = pg.evaluate("Array.from(document.querySelectorAll('#pcontent a.chap')).map(function(a){return a.getAttribute('href')})")
    check('#pi2-15' in hrefs and '#pi2-16' in hrefs and '#pi2-17' in hrefs and all(('#pi2-%d' % n) in hrefs for n in range(18,30)), 'séquences listées dans le parcours pionnier 2AC')
    check(not errs, 'aucune erreur JS %s' % errs[:1])
    b.close()
print('FAILS: %d' % len(fails))
raise SystemExit(1 if fails else 0)
