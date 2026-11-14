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
      var out=[],keys=['pexp','cpar','rnec','mono','pdeg','pred','padd','psub','pmon','pbim','pbb','ppat','pdm','pdb','peq','pvaly','nneg','nabs','nval','ncmp','nadd1','nadd2','nadd3','nsub','nexp','ndec','npb','nmul','nmuls','ndiv','nmulc','nmd','ndvd','ncrit','npgcd','nppcm','npre','nfac','npp','nfrac','nden','nparith','nrac','ncomp','ndecim','nreel'],MM=window.MM;
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
    # 1AC : nombres négatifs, abscisses, valeur absolue, comparaison
    neg = pg.evaluate("""function(){var MM=window.MM,bad=[];
      function n(v){return +String(v).replace('−','-').replace(',','.')}
      for(var i=0;i<400;i++){
        var it=MM.genItem('nval',1),m=/valeur absolue de (−?\\d+) \\?$/.exec(it.q);
        if(!m||Math.abs(n(m[1]))!==it.a){bad.push('nval1 '+it.q+' '+it.a);break}
        it=MM.genItem('nabs',2);m=/abscisse (−?\\d+)\\. Le point B est situé à (\\d+) unités à droite/.exec(it.q);
        if(!m||n(m[1])+n(m[2])!==it.a){bad.push('nabs2 '+it.q);break}
        it=MM.genItem('nabs',3);m=/abscisse (−?\\d+)\\. Le point B est situé à (\\d+) unités à gauche/.exec(it.q);
        if(!m||n(m[1])-n(m[2])!==it.a){bad.push('nabs3 '+it.q);break}
        it=MM.genItem('nneg',2);m=/liste : (.*) \\?$/.exec(it.q);
        if(!m||m[1].split(' ; ').filter(function(v){return n(v)<0}).length!==it.a){bad.push('nneg2 '+it.q);break}
        it=MM.genItem('ncmp',3);m=/croissant : (.*)\\.$/.exec(it.q);
        var sol=m[1].split(' ; ').map(n).sort(function(a,b){return a-b}).join(',');
        var ch=it.o[it.a].split(' < ').map(n).join(',');
        if(sol!==ch){bad.push('ncmp3 '+it.q+' => '+it.o[it.a]);break}
        var other=it.o.filter(function(o,j){return j!==it.a&&o.split(' < ').map(n).join(',')===sol});
        if(other.length){bad.push('ncmp3 distracteur '+it.q);break}
        it=MM.genItem('ncmp',2);m=/Compare : (−?\\d+) ◻ \\(?(−?\\d+)\\)?$/.exec(it.q);
        var r=n(m[1])<n(m[2])?'<':'>';if(it.o[it.a]!==r){bad.push('ncmp2 '+it.q);break}
      }
      return bad}()""")
    check(not neg, 'nombres négatifs : réponses exactes (%s)' % (neg[:2],))
    # 1AC : sommes et différences d'entiers relatifs, évaluées par JavaScript
    ent = pg.evaluate("""function(){var MM=window.MM,bad=[];
      function ev(t){return Function('return ('+t.replace(/−/g,'-').replace(/×/g,'*').replace(/÷/g,'/')+')')()}
      [['nadd1',[1,2]],['nadd2',[1,2]],['nadd3',[1,2,3]],['nsub',[1,2,3]],['nexp',[1,2,3]],['nmul',[1,3]],['nmuls',[1,3]],['ndiv',[1,2]],['nmulc',[1,2]]].forEach(function(p){p[1].forEach(function(s){for(var i=0;i<300;i++){
        var it=MM.genItem(p[0],s),m=/^Calcule (?:en regroupant les nombres bien choisis : )?(.*?)(?: en utilisant la droite numérique| en regroupant les facteurs bien choisis)?\\.$/.exec(it.q);
        if(!m){bad.push(p[0]+s+' format '+it.q);break}
        if(ev(m[1])!==it.a){bad.push(p[0]+s+' '+it.q+' => '+it.a);break}
      }})});
      for(var i=0;i<300;i++){var it=MM.genItem('nadd1',3),m=/abscisse (−?\\d+), on se déplace de (−?\\d+) puis de (−?\\d+)\\./.exec(it.q);
        if(!m||ev(m[1]+'+('+m[2]+')+('+m[3]+')')!==it.a){bad.push('nadd1-3 '+it.q);break}}
      return bad}()""")
    check(not ent, 'entiers relatifs : sommes et différences exactes (%s)' % (ent[:2],))

    # 1AC semaine 3 : décimaux, fractions, problèmes, produit
    wk3 = pg.evaluate("""function(){var MM=window.MM,bad=[];
      function ev(t){try{return Function('return ('+t.replace(/−/g,'-').replace(/,/g,'.')+')')()}catch(e){throw new Error('EV '+t)}}
      [1,2,3].forEach(function(s){for(var i=0;i<300;i++){
        var it=MM.genItem('ndec',s),q=it.q.replace(/<span class="fr"><span>(−?\\d+)<\\/span><span>(\\d+)<\\/span><\\/span>/g,'($1/$2)').replace(/^Calcule /,'').replace(/ \\(décimal ou fraction\\)\\.$/,'').replace(/\\.$/,'');
        if(Math.abs(ev(q)-it.a)>1e-9){bad.push('ndec'+s+' '+q+' => '+it.a);break}
      }});
      for(var i=0;i<300;i++){var it=MM.genItem('npb',1),m=/de (−?\\d+) €\\. Il reçoit (\\d+) € puis paie (\\d+) €/.exec(it.q);
        if(!m||+m[1].replace('−','-')+ +m[2]- +m[3]!==it.a){bad.push('npb1 '+it.q);break}}
      for(var i=0;i<300;i++){var it=MM.genItem('npb',2),m=/est de (−?\\d+) °C\\. Elle baisse de (\\d+) °C puis elle monte de (\\d+) °C/.exec(it.q);
        if(!m||+m[1].replace('−','-')- +m[2]+ +m[3]!==it.a){bad.push('npb2 '+it.q);break}}
      for(var i=0;i<300;i++){var it=MM.genItem('npb',3),m=/\\+(\\d+) points, puis −(\\d+) points, puis −(\\d+) points, puis \\+(\\d+) points/.exec(it.q);
        if(!m||+m[1]- +m[2]- +m[3]+ +m[4]!==it.a){bad.push('npb3 '+it.q);break}}
      for(var i=0;i<300;i++){var it=MM.genItem('nmul',2);
        if(it.o.length!==3||it.o[it.a]!=='négatif'){bad.push('nmul2 '+it.q);break}}
      return bad}()""")
    check(not wk3, 'semaine 3 (1AC) : décimaux, fractions, problèmes, produits exacts (%s)' % (wk3[:2],))

    wk4 = pg.evaluate("""function(){var MM=window.MM,bad=[];
      function ev(t){try{return Function('return ('+t.replace(/−/g,'-').replace(/,/g,'.').replace(/×/g,'*').replace(/÷/g,'/')+')')()}catch(e){throw new Error('EV '+t)}}
      function cl(q){return q.replace(/<span class="fr"><span>(−?\\d+)<\\/span><span>(\\d+)<\\/span><\\/span>/g,'($1/$2)').replace(/^Calcule /,'').replace(/ \\(décimal ou fraction\\)\\.$/,'').replace(/\\.$/,'')}
      [[ 'nmd',[1,2,3]],['ndiv',[3]]].forEach(function(p){p[1].forEach(function(s){for(var i=0;i<300;i++){
        var it=MM.genItem(p[0],s),q=cl(it.q);
        if(Math.abs(ev(q)-it.a)>1e-9){bad.push(p[0]+s+' '+q+' => '+it.a);break}
      }})});
      for(var i=0;i<300;i++){var it=MM.genItem('nmuls',2);
        if(it.o.length!==3||it.o[it.a]!=='positif'){bad.push('nmuls2 '+it.q);break}}
      for(var i=0;i<300;i++){var it=MM.genItem('nmulc',3),q=it.q.replace(/^Quel est le signe du produit /,'').replace(/ \\?$/,''),v=ev(q);
        if(it.o.length!==3||it.o[it.a]!==(v<0?'négatif':'positif')){bad.push('nmulc3 '+it.q);break}}
      return bad}()""")
    check(not wk4, 'semaine 4 (1AC) : produits, quotients, décimaux, fractions exacts (%s)' % (wk4[:2],))

    wk31 = pg.evaluate("""function(){var MM=window.MM,bad=[],i,it,m;
      function g(a,b){while(b){var t=b;b=a%b;a=t}return a}
      for(i=0;i<300;i++){it=MM.genItem('ndvd',1);m=/de (\\d+) par (\\d+)/.exec(it.q);if(!m||+m[1]%+m[2]!==it.a){bad.push('ndvd1 '+it.q);break}}
      for(i=0;i<300;i++){it=MM.genItem('ndvd',2);m=/diviseur de (\\d+)/.exec(it.q);if(it.o.length!==4||+m[1]%+it.o[it.a]!==0||it.o.filter(function(v){return +m[1]%+v===0}).length!==1){bad.push('ndvd2 '+it.q+it.o);break}}
      for(i=0;i<300;i++){it=MM.genItem('ndvd',3);m=/de (\\d+) strictement inférieur à (\\d+)/.exec(it.q);if(!m||it.a%+m[1]!==0||it.a>=+m[2]||it.a+ +m[1]<+m[2]){bad.push('ndvd3 '+it.q+it.a);break}}
      for(i=0;i<300;i++){it=MM.genItem('ncrit',1);m=/divisible par (\\d+)/.exec(it.q);var X=+m[1];if(it.o.length!==4||it.o.filter(function(v){return +v%X===0}).length!==1||+it.o[it.a]%X!==0){bad.push('ncrit1 '+it.q+it.o);break}}
      for(i=0;i<300;i++){it=MM.genItem('ncrit',2);m=/nombre (\\d)\\?(\\d) soit/.exec(it.q);if(!m||it.a<1||it.a>8||(+m[1]+it.a+ +m[2])%9!==0){bad.push('ncrit2 '+it.q+it.a);break}}
      for(i=0;i<300;i++){it=MM.genItem('ncrit',3);if(it.o.length!==4||it.o.filter(function(v){return +v%4===0}).length!==1||+it.o[it.a]%4!==0){bad.push('ncrit3 '+it.o);break}}
      [1,2,3].forEach(function(s){for(var i=0;i<300;i++){var it=MM.genItem('npgcd',s),m=/PGCD de (\\d+) et (\\d+)/.exec(it.q);if(!m||g(+m[1],+m[2])!==it.a){bad.push('npgcd'+s+' '+it.q+it.a);break}}});
      [1,2,3].forEach(function(s){for(var i=0;i<300;i++){var it=MM.genItem('nppcm',s),m=/PPCM de (\\d+) et (\\d+)/.exec(it.q);if(!m||+m[1]*+m[2]/g(+m[1],+m[2])!==it.a){bad.push('nppcm'+s+' '+it.q+it.a);break}}});
      return bad}()""")
    check(not wk31, '3AC semaine 1 : diviseurs, critères, PGCD, PPCM exacts (%s)' % (wk31[:2],))

    wk32 = pg.evaluate("""function(){var MM=window.MM,bad=[],i,it,m;
      function g(a,b){while(b){var t=b;b=a%b;a=t}return a}
      function isP(n){if(n<2)return false;for(var i=2;i*i<=n;i++)if(n%i===0)return false;return true}
      function frs(q){var o=[],re=/<span class="fr"><span>(−?\\d+)<\\/span><span>(\\d+)<\\/span><\\/span>/g,m;while((m=re.exec(q)))o.push([+m[1].replace('−','-'),+m[2]]);return o}
      function decv(s){var v=1,toks=s.replace(/<sup>(\\d+)<\\/sup>/g,'^$1').split(' × ');toks.forEach(function(t){var b=t.split('^');v*=Math.pow(+b[0],b[1]?+b[1]:1)});return v}
      function allP(s){return s.replace(/<sup>(\\d+)<\\/sup>/g,'').split(' × ').every(function(t){return isP(+t)})}
      for(i=0;i<300;i++){it=MM.genItem('npre',1);if(it.o.length!==4||it.o.filter(function(v){return isP(+v)}).length!==1||!isP(+it.o[it.a])){bad.push('npre1 '+it.o);break}}
      for(i=0;i<300;i++){it=MM.genItem('npre',2);m=/≤ (\\d+)\\. Combien/.exec(it.q);var c=0;for(var p=2;p*p<=+m[1];p++)if(isP(p))c++;if(c!==it.a){bad.push('npre2 '+it.q);break}}
      for(i=0;i<300;i++){it=MM.genItem('npre',3);if(it.o.length!==4||it.o.filter(function(v){return !isP(+v)}).length!==1||isP(+it.o[it.a])){bad.push('npre3 '+it.o);break}}
      [1,2,3].forEach(function(s){for(var i=0;i<300;i++){var it=MM.genItem('nfac',s),m=/décomposition de (\\d+) en/.exec(it.q),n=+m[1];
        var good=it.o.filter(function(o){return allP(o)&&decv(o)===n});
        if(it.o.length<3||good.length!==1||it.o[it.a]!==good[0]){bad.push('nfac'+s+' '+it.q+it.o.join('|'));break}}});
      [1,2].forEach(function(s){for(var i=0;i<300;i++){var it=MM.genItem('npp',s),m=/A = (.*?) et B = (.*?)\\. Calcule le (PGCD|PPCM)/.exec(it.q),A=decv(m[1]),B=decv(m[2]),r=m[3]==='PGCD'?g(A,B):A*B/g(A,B);if(r!==it.a){bad.push('npp'+s+' '+it.q);break}}});
      for(i=0;i<300;i++){it=MM.genItem('npp',3);m=/A = (\\d+) = (.*?) et B = (\\d+) = (.*?)\\. Calcule/.exec(it.q);if(!m||decv(m[2])!==+m[1]||decv(m[4])!==+m[3]||g(+m[1],+m[3])!==it.a){bad.push('npp3 '+it.q);break}}
      for(i=0;i<300;i++){it=MM.genItem('nfrac',1);var f=frs(it.q)[0],good=it.o.filter(function(o){var x=o.split('/');return +x[0]*f[1]===+x[1]*f[0]&&g(+x[0],+x[1])===1});
        if(it.o.length<3||good.length!==1||it.o[it.a]!==good[0]){bad.push('nfrac1 '+it.q+it.o);break}}
      for(i=0;i<300;i++){it=MM.genItem('nfrac',2);f=frs(it.q)[0];if(f[1]/g(f[0],f[1])!==it.a){bad.push('nfrac2 '+it.q);break}}
      for(i=0;i<300;i++){it=MM.genItem('nfrac',3);var good3=it.o.filter(function(o){var x=o.split('/');return g(+x[0],+x[1])===1});if(it.o.length!==4||good3.length!==1||it.o[it.a]!==good3[0]){bad.push('nfrac3 '+it.o);break}}
      [1,2,3].forEach(function(s){for(var i=0;i<300;i++){var it=MM.genItem('nden',s),f=frs(it.q),L=f[0][1]*f[1][1]/g(f[0][1],f[1][1]),r=s===1?L:s===2?f[0][0]*L/f[0][1]:f[0][0]*L/f[0][1]+f[1][0]*L/f[1][1];if(r!==it.a){bad.push('nden'+s+' '+it.q);break}}});
      for(i=0;i<300;i++){it=MM.genItem('nparith',1);m=/a (\\d+) fraises tagada et (\\d+) bonbons/.exec(it.q);if(g(+m[1],+m[2])!==it.a){bad.push('nparith1 '+it.q);break}}
      for(i=0;i<300;i++){it=MM.genItem('nparith',2);m=/a (\\d+) fraises tagada et (\\d+) bonbons/.exec(it.q);if(+m[1]/g(+m[1],+m[2])!==it.a){bad.push('nparith2 '+it.q);break}}
      for(i=0;i<300;i++){it=MM.genItem('nparith',3);m=/toutes les (\\d+) minutes et la seconde toutes les (\\d+) minutes/.exec(it.q);if(+m[1]*+m[2]/g(+m[1],+m[2])!==it.a){bad.push('nparith3 '+it.q);break}}
      return bad}()""")
    check(not wk32, '3AC semaine 2 : premiers, décompositions, fractions, problèmes exacts (%s)' % (wk32[:2],))

    wk33 = pg.evaluate("""function(){var MM=window.MM,bad=[],i,it,m;
      function g(a,b){while(b){var t=b;b=a%b;a=t}return a}
      function isSq(n){var r=Math.round(Math.sqrt(n));return r*r===n}
      function val(t){t=t.trim();if(t==='π')return Math.PI;if(t[0]==='√')return Math.sqrt(+t.slice(1));return +t.replace('−','-').replace(',','.')}
      function cls(t){t=t.trim();if(t==='π')return 2;if(t[0]==='√')return isSq(+t.slice(1))?0:2;if(t.indexOf('/')>-1||t.indexOf(',')>-1)return 1;return 0}
      for(i=0;i<300;i++){it=MM.genItem('nrac',1);m=/√(\\d+)/.exec(it.q);if(Math.sqrt(+m[1])!==it.a){bad.push('nrac1 '+it.q);break}}
      for(i=0;i<300;i++){it=MM.genItem('nrac',2);if(it.o.length!==4||it.o.filter(function(v){return isSq(+v)}).length!==1||!isSq(+it.o[it.a])){bad.push('nrac2 '+it.o);break}}
      for(i=0;i<300;i++){it=MM.genItem('nrac',3);m=/√(\\d+) arrondie/.exec(it.q);if(isSq(+m[1])||Math.abs(Math.round(Math.sqrt(+m[1])*100)/100-it.a)>1e-9){bad.push('nrac3 '+it.q);break}}
      for(i=0;i<300;i++){it=MM.genItem('ncomp',1);m=/√(\\d+) ◻ √(\\d+)/.exec(it.q);if(it.o.length!==3||it.o[it.a]!==(+m[1]<+m[2]?'<':'>')){bad.push('ncomp1 '+it.q);break}}
      for(i=0;i<300;i++){it=MM.genItem('ncomp',2);m=/√(\\d+) ◻ (\\d+)/.exec(it.q);if(it.o.length!==3||it.o[it.a]!==(Math.sqrt(+m[1])<+m[2]?'<':'>')||Math.sqrt(+m[1])===+m[2]){bad.push('ncomp2 '+it.q);break}}
      for(i=0;i<300;i++){it=MM.genItem('ncomp',3);m=/ordre croissant : (.*)\\.$/.exec(it.q);var xs=m[1].split(' ; ').map(function(t){return val(t)});var want=m[1].split(' ; ').sort(function(a,b){return val(a)-val(b)}).join(' < ');
        if(it.o.length!==4||it.o[it.a]!==want||new Set(xs.map(function(v){return v.toFixed(6)})).size!==4){bad.push('ncomp3 '+it.q);break}}
      [1,2,3].forEach(function(s){for(var i=0;i<400;i++){var it=MM.genItem('ndecim',s),m=/de (\\d+)\\/(\\d+) \\?/.exec(it.q),want;
        if(m){var a=+m[1],b=+m[2],d=b/g(a,b);while(d%2===0)d/=2;while(d%5===0)d/=5;want=d===1?'décimale finie':'illimitée périodique'}
        else{m=/de √(\\d+) \\?/.exec(it.q);want=isSq(+m[1])?'décimale finie':'illimitée non périodique'}
        if(it.o.length!==3||it.o[it.a]!==want){bad.push('ndecim'+s+' '+it.q+it.o[it.a]);break}}});
      var labels=['un entier','un rationnel non entier','un irrationnel'];
      for(i=0;i<400;i++){it=MM.genItem('nreel',1);m=/^Le nombre (.*) est :$/.exec(it.q);if(it.o.length!==3||it.o[it.a]!==labels[cls(m[1])]){bad.push('nreel1 '+it.q+it.o[it.a]);break}}
      for(i=0;i<300;i++){it=MM.genItem('nreel',2);if(it.o.length!==4||it.o.filter(function(v){return cls(v)===2}).length!==1||cls(it.o[it.a])!==2){bad.push('nreel2 '+it.o);break}}
      for(i=0;i<300;i++){it=MM.genItem('nreel',3);m=/liste : (.*) \\?$/.exec(it.q);var c=m[1].split(' ; ').filter(function(t){return cls(t)===2}).length;if(c!==it.a){bad.push('nreel3 '+it.q);break}}
      return bad}()""")
    check(not wk33, '3AC semaine 3 : racines, comparaison, écritures décimales, réels exacts (%s)' % (wk33[:2],))
    for cid, title in (('pi2-15', 'Puissances à exposant positif'), ('pi2-16', 'Pourquoi la racine carrée'), ('pi2-17', 'Monômes'), ('pi2-18', 'Polynômes : le degré'), ('pi2-19', 'Réduire un polynôme'), ('pi2-20', 'Additionner deux polynômes'), ('pi2-21', 'Soustraire deux polynômes'), ('pi2-22', 'Multiplier deux monômes'), ('pi2-23', 'Multiplier un binôme par un monôme'), ('pi2-24', 'Multiplier deux binômes'), ('pi2-25', 'Problème de motifs'), ('pi2-26', 'Diviser un monôme par un monôme'), ('pi2-27', 'Diviser un binôme par un monôme'), ('pi2-28', 'Traduire une situation'), ('pi2-29', 'Calculer y pour une valeur de x'), ('pi1-16', 'Les nombres négatifs'), ('pi1-17', 'Droite graduée et abscisse'), ('pi1-18', 'La valeur absolue'), ('pi1-19', 'Comparer et ranger'), ('pi1-20', 'Additionner sur la droite numérique'), ('pi1-21', 'Additionner avec les valeurs absolues'), ('pi1-22', 'Commutativité et associativité'), ('pi1-23', 'La soustraction des nombres entiers'), ('pi1-24', 'Expressions numériques'), ('pi1-25', 'décimaux et des fractions'), ('pi1-26', 'Résoudre un problème'), ('pi1-27', 'Multiplier des entiers de signes différents'), ('pi1-28', 'Multiplier des entiers de même signe'), ('pi1-29', 'Diviser des nombres entiers'), ('pi1-30', 'Commutativité et associativité de la multiplication'), ('pi1-31', 'Multiplier et diviser des décimaux'), ('pi3-16', 'Diviseurs et multiples'), ('pi3-17', 'critères de divisibilité'), ('pi3-18', 'Le PGCD'), ('pi3-19', 'Le PPCM'), ('pi3-20', 'Les nombres premiers'), ('pi3-21', 'Décomposer en produit'), ('pi3-22', 'PGCD et PPCM par la décomposition'), ('pi3-23', 'Simplifier une fraction'), ('pi3-24', 'Réduire deux fractions'), ('pi3-25', 'Problèmes d’arithmétique'), ('pi3-26', 'La racine carrée'), ('pi3-27', 'Comparer des racines'), ('pi3-28', 'Écritures décimales'), ('pi3-29', 'Rationnels, irrationnels')):
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
    pg.evaluate("location.hash='#home'"); pg.wait_for_timeout(300)
    pg.locator('#plevels button').nth(0).click(); pg.wait_for_timeout(400)
    hrefs1 = pg.evaluate("Array.from(document.querySelectorAll('#pcontent a.chap')).map(function(a){return a.getAttribute('href')})")
    check(all(('#pi1-%d' % n) in hrefs1 for n in range(16,32)), 'séquences listées dans le parcours pionnier 1AC')
    pg.evaluate("location.hash='#home'"); pg.wait_for_timeout(300)
    pg.locator('#plevels button').nth(2).click(); pg.wait_for_timeout(400)
    hrefs3 = pg.evaluate("Array.from(document.querySelectorAll('#pcontent a.chap')).map(function(a){return a.getAttribute('href')})")
    check(all(('#pi3-%d' % n) in hrefs3 for n in range(16,30)), 'séquences listées dans le parcours pionnier 3AC')
    check(not errs, 'aucune erreur JS %s' % errs[:1])
    b.close()
print('FAILS: %d' % len(fails))
raise SystemExit(1 if fails else 0)
