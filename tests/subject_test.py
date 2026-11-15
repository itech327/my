#!/usr/bin/env python3
"""Site de la matière isolée (matiere/site) : chargement, chaque chapitre, interactions, défis, session, hors ligne."""
import sys, os, json
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'matiere', 'site')
SHOTS = os.environ.get('SHOTS')
fails = []
def check(c, m):
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
UA = 'Mozilla/5.0 (Linux; Android 13; SM-A536B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
with sync_playwright() as p:
    try: b = p.chromium.launch()
    except Exception: b = p.chromium.launch(channel='chrome')
    ctx = b.new_context(viewport={'width': 420, 'height': 900}, user_agent=UA)
    ctx.add_init_script("try{localStorage.setItem('lab_auto','0');sessionStorage.setItem('lab_skip','1');sessionStorage.setItem('lab_barmin','0')}catch(e){}")
    pg = ctx.new_page()
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_' not in m.text and 'Failed to load resource' not in m.text else None)
    pg.route('**/*', lambda r: r.abort() if r.request.url.startswith('http') else r.continue_())
    pg.goto('file://' + os.path.join(SITE, 'index.html')); pg.wait_for_timeout(700)
    check(not errs, 'aucune erreur au chargement ' + str(errs[:3]))
    check('Technologie en mouvement' in pg.title(), 'titre : ' + pg.title())
    check(pg.locator('.lvl-card').count() == 2, 'écran de choix du niveau (2e / 3e)')
    check(pg.evaluate("(function(){var r=document.querySelector('.lvl-card').getBoundingClientRect();return r.bottom<window.innerHeight})()"), 'le choix du niveau est visible sans défiler')
    pg.click('.lvl-card[data-lvl="3"]'); pg.wait_for_timeout(400)
    check(pg.locator('.lab-modal').count() == 1, 'la fenêtre « Ma session » s’ouvre après le choix du niveau')
    pg.click('#lab-skip'); pg.wait_for_timeout(200)
    check(pg.locator('.lvl-seg button[aria-pressed=true]').count() == 1 and pg.locator('#lv-3:not([hidden])').count() == 1, 'niveau choisi : liste du niveau affichée')
    # régression : changer de niveau ne rouvre pas la fenêtre « Ma session » (elle bloquait les clics sur les leçons)
    pg.click('.lvl-seg button >> nth=0'); pg.wait_for_timeout(400); pg.click('.lvl-seg button >> nth=1'); pg.wait_for_timeout(400)
    check(pg.locator('.lab-modal').count() == 0, 'changer de niveau ne rouvre pas la fenêtre « Ma session »')
    pg.click('#lv-3 a.chap >> nth=4'); pg.wait_for_timeout(500)
    check(pg.evaluate("(function(){var c=document.querySelector('#t3-5');return !!c&&c.getBoundingClientRect().height>100})()"), 'un clic sur un chapitre l’ouvre')
    pg.evaluate("location.hash=''"); pg.wait_for_timeout(300)
    pg.click('.mod-chips button >> nth=1'); pg.wait_for_timeout(300)
    links = pg.evaluate("Array.from(document.querySelectorAll('#chapters a.chap')).map(a=>a.getAttribute('href').slice(1))")
    check(len(links) >= 1, '%d chapitres au sommaire' % len(links))
    st = pg.evaluate('Lab.selftest(30)')
    check(st['badCount'] == 0, 'générateurs valides (%d tirages, %d invalides) %s' % (st['total'], st['badCount'], st['bad'][:3]))
    cfg_ids = pg.evaluate('Object.keys(LAB_CONFIG.map)')
    check(sorted(cfg_ids) == sorted(links), 'chaque chapitre a une configuration de défis : ' + str(set(links) ^ set(cfg_ids)))
    # chaque chapitre : leçons construites, interactions sans erreur
    for cid in links:
        errs.clear()
        pg.evaluate("location.hash='#%s'" % cid); pg.wait_for_timeout(450)
        n = pg.locator('#%s section.lesson' % cid).count()
        check(n >= 3, '%s : %d leçons (dont Défis)' % (cid, n))
        bad = pg.locator('#%s :text("ne s’est pas chargée")' % cid).count()
        check(bad == 0, cid + ' : toutes les animations se chargent')
        empty = pg.evaluate("Array.from(document.querySelectorAll('#%s section.lesson')).filter(s=>!s.querySelector('svg,table,.quiz,.lab-ex,.lab-box,button')).map(s=>s.id)" % cid)
        check(not empty, cid + ' : aucune leçon vide ' + str(empty))
        # interactions : onglets, boutons, curseurs (hors Défis)
        pg.evaluate("""(cid)=>{
          const ls=Array.from(document.querySelectorAll('#'+cid+' section.lesson')).filter(s=>!/Défis/.test(s.querySelector('h3')?.textContent||'')&&!/entraîne/.test(s.querySelector('h3')?.textContent||''));
          ls.forEach(s=>{
            s.querySelectorAll('.seg button').forEach(b=>b.click());
            s.querySelectorAll('input[type=range]').forEach(r=>{ [r.max,r.min,Math.round((+r.max+ +r.min)/2)].forEach(v=>{r.value=v;r.dispatchEvent(new Event('input',{bubbles:true}));}); });
            s.querySelectorAll('button.btn').forEach(b=>{ try{b.click()}catch(e){} });
            s.querySelectorAll('button.opt,button[data-k]').forEach(b=>{ try{b.click()}catch(e){} });
          });
        }""", cid)
        pg.wait_for_timeout(250)
        check(not errs, cid + ' : interactions sans erreur ' + str(errs[:3]))
        if SHOTS:
            os.makedirs(SHOTS, exist_ok=True)
            pg.evaluate("document.querySelector('#%s section.lesson').scrollIntoView()" % cid)
            pg.screenshot(path=os.path.join(SHOTS, cid + '-l1.png'))
    # plein écran : le bouton ouvre l'animation sur tout l'écran, Échap la ferme
    pg.evaluate("location.hash='#%s'" % links[0]); pg.wait_for_timeout(450)
    pg.evaluate("document.querySelector('#%s .fs-btn').click()" % links[0]); pg.wait_for_timeout(200)
    check(pg.evaluate("!!document.querySelector('.fs-on .stage')"), 'plein écran : ouverture')
    pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
    check(pg.evaluate("!document.querySelector('.fs-on')"), 'plein écran : fermeture avec Échap')
    # atelier de dépannage : une panne tirée au hasard doit toujours se résoudre (barrière, perceuse)
    for cid, ttl in [('t3-1', 'Atelier : la barrière'), ('t3-5', 'Atelier : la perceuse')]:
        pg.evaluate("location.hash='#%s'" % cid); pg.wait_for_timeout(450)
        sec = pg.locator('#%s section.lesson:has(h3:has-text("%s"))' % (cid, ttl)).first
        okc = 0
        for _ in range(6):
            sec.locator('button:has-text("Nouvelle panne")').click()
            kids = sec.evaluate("(s)=>Array.from(s.querySelector('svg > g:last-of-type').children).map(e=>e.tagName)")
            sec.locator('button:has-text("Je sais où")').click()
            for i, t in enumerate(kids):
                if t != 'rect': continue
                sec.evaluate("(a)=>{const g=a.querySelector('svg > g:last-of-type');g.children[%d].dispatchEvent(new MouseEvent('click',{bubbles:true}))}" % i)
                if 'Bravo' in sec.locator('.info').inner_text(): okc += 1; break
                sec.locator('button:has-text("Je sais où")').click()
        check(okc == 6, '%s : la panne se trouve toujours (%d/6)' % (cid, okc))
    # laboratoire de circuits : mission « allumer la LED » réalisable au clavier ; la LED grille sans résistance adaptée
    pg.evaluate("location.hash='#t2-5'"); pg.wait_for_timeout(450)
    lab = pg.locator('#t2-5 section.lesson:has(h3:has-text("Laboratoire : construis"))').first
    def lab_press(i):
        pg.evaluate("""(i)=>{const s=[...document.querySelectorAll('#t2-5 section.lesson')].find(x=>/Laboratoire : construis/.test(x.textContent));const g=s.querySelector('svg > g:last-of-type');g.children[i].dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))}""", i)
    for _ in range(8): lab.locator('button:has-text("◀ Mission")').click()
    lab.locator('button:has-text("Mission ▶")').click(); lab.locator('button:has-text("Mission ▶")').click()
    for tok, slot in [(0, 12), (3, 9), (5, 10)]: lab_press(tok); lab_press(slot)   # interrupteur, 220 Ω, LED
    lab_press(12); pg.wait_for_timeout(1700)
    check('Mission réussie' in lab.locator('.info').inner_text(), 'laboratoire : la mission « LED sans la griller » se réussit')
    lab.locator('button:has-text("Mission ▶")').click()   # 9 V : 220 Ω ne suffit plus
    for tok, slot in [(0, 12), (3, 9), (5, 10)]: lab_press(tok); lab_press(slot)
    lab_press(12); pg.wait_for_timeout(700)
    check('grill' in lab.locator('.info').inner_text(), 'laboratoire : sous 9 V avec 220 Ω la LED grille')
    # jeux : tri express (au clavier), chrono-défi (résolu en lisant les cartes), mix énergétique (solutions connues)
    def lesson(cid, ttl):
        pg.evaluate("location.hash='#%s'" % cid); pg.wait_for_timeout(450)
        s = pg.locator('#%s section.lesson:has(h3:has-text("%s"))' % (cid, ttl)).first
        s.scroll_into_view_if_needed(); return s
    tri = lesson('t3-11', 'Jeu : tri express')
    pg.evaluate("""()=>{const s=[...document.querySelectorAll('#t3-11 section.lesson')].find(x=>/Jeu : tri express/.test(x.textContent));s.querySelector('svg > g:last-of-type').children[0].dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))}""")
    for _ in range(40):
        pg.evaluate("""()=>{const s=[...document.querySelectorAll('#t3-11 section.lesson')].find(x=>/Jeu : tri express/.test(x.textContent));s.querySelector('svg > g:last-of-type').children[0].dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}))}""")
        if 'rejouer' in tri.locator('.info').inner_text(): break
    check('rejouer' in tri.locator('.info').inner_text(), 'tri express : la partie se termine quand les vies sont épuisées')
    chr_ = lesson('t3-1', 'Jeu : chrono-défi')
    YEARS = {'Noria': -300, 'vapeur': 1769, 'Moteur': 1834, 'Ampoule': 1879, 'Robot': 1961, 'Microprocesseur': 1971, 'smartphones': 2007, 'site': 1991}
    def chrono_order():
        return pg.evaluate("""()=>{const s=[...document.querySelectorAll('#t3-1 section.lesson')].find(x=>/Jeu : chrono-défi/.test(x.textContent));
          const gs=s.querySelectorAll('svg > g');const dyn=gs[gs.length-2];const TX=[[70,196],[200,196],[330,196],[135,256],[265,256]];const o=TX.map(()=>[]);
          dyn.querySelectorAll('text').forEach(t=>{const x=+t.getAttribute('x'),y=+t.getAttribute('y');if(y<190||y>300)return;let b=0,bd=1e9;TX.forEach((p,k)=>{const d=Math.hypot(x-p[0],y-(p[1]+19));if(d<bd){bd=d;b=k}});o[b].push(t.textContent)});return o.map(a=>a.join(' '))}""")
    def chrono_press(i):
        pg.evaluate("""(i)=>{const s=[...document.querySelectorAll('#t3-1 section.lesson')].find(x=>/Jeu : chrono-défi/.test(x.textContent));s.querySelector('svg > g:last-of-type').children[i].dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))}""", i)
    names = chrono_order()
    yrs = [next((v for k, v in YEARS.items() if k in n), None) for n in names]
    check(None not in yrs, 'chrono-défi : cartes lisibles ' + str(names))
    if None not in yrs:
        for slot, tok in enumerate(sorted(range(5), key=lambda k: yrs[k])): chrono_press(tok); chrono_press(5 + slot)
        chr_.locator('button:has-text("Vérifier")').click()
        check('Ordre exact' in chr_.locator('.info').inner_text(), 'chrono-défi : le bon ordre est accepté')
    mix = lesson('t3-14', 'Projet : alimente la ville')
    def mix_set(vals, tab):
        mix.locator('.tabs button, [role=tab]').nth(tab).click() if mix.locator('.tabs button, [role=tab]').count() > tab else None
        pg.evaluate("""([vals])=>{const s=[...document.querySelectorAll('#t3-14 section.lesson')].find(x=>/Projet : alimente la ville/.test(x.textContent));const r=s.querySelectorAll('input[type=range]');vals.forEach((v,i)=>{r[i].value=v;r[i].dispatchEvent(new Event('input',{bubbles:true}))})}""", [vals])
        pg.wait_for_timeout(150)
    # ordre des curseurs : solaire, éolien, hydraulique, stockage, gaz, charbon
    for tab, vals, name in [(0, [0, 6, 2, 0, 6, 0], 'jour normal'), (1, [6, 0, 3, 0, 6, 1], 'jour sans vent'), (2, [2, 6, 3, 0, 5, 0], 'objectif Maroc 2030')]:
        mix_set(vals, tab)
        check('La ville est alimentée' in mix.locator('.info').inner_text(), 'mix énergétique : solution connue du niveau « %s »' % name)
    mix_set([0, 0, 0, 0, 0, 0], 0)
    check('Coupures' in mix.locator('.info').inner_text() and 'La ville est alimentée' not in mix.locator('.info').inner_text(), 'mix énergétique : aucune production = coupures')
    # fiche A4 : le bouton construit une fiche (leçons, vocabulaire) avant l'impression
    pg.evaluate("location.hash='#t3-5'"); pg.wait_for_timeout(450); pg.evaluate("window.print=function(){}")
    pg.locator('#t3-5 .fiche-btn').click()
    check(pg.evaluate("document.querySelectorAll('#fiche .fi-les').length") >= 5 and pg.evaluate("document.querySelectorAll('#fiche .fi-words td').length") >= 8 and pg.evaluate("document.body.classList.contains('printing')"), 'fiche A4 : leçons et vocabulaire présents')
    pg.evaluate("window.dispatchEvent(new Event('afterprint'))")
    check(pg.evaluate("!document.getElementById('fiche') && !document.body.classList.contains('printing')"), 'fiche A4 : nettoyage après impression')
    # jeux d'évasion : une solution connue par module ; une mauvaise réponse ajoute 10 s
    ESC = [('t3-1', 'Module 1', [('o', 0), ('n', 5), ('o', 1), ('n', 3)]), ('t3-4', 'Module 2', [('o', 0), ('n', 8), ('o', 2), ('n', 5)]),
           ('t3-9', 'Module 3', [('n', 5), ('o', 0), ('n', 3), ('o', 0)]), ('t3-10', 'Module 4', [('n', 2), ('n', 3), ('o', 1), ('o', 1)]),
           ('t3-14', 'Module 5', [('n', 3), ('o', 1), ('n', 1), ('o', 1)]),
           ('t2-2', 'Module 1', [('o', 0), ('o', 1), ('n', 0), ('o', 0)]), ('t2-9', 'Module 2', [('n', 1), ('n', 3), ('n', 5), ('o', 0)]),
           ('t2-10', 'Module 3', [('o', 1), ('o', 0), ('n', 7), ('o', 0)]), ('t2-13', 'Module 4', [('n', 5), ('n', 6), ('o', 0), ('o', 1)])]
    for cid, mod, sol in ESC:
        pg.reload(); pg.wait_for_timeout(500)   # état neuf : le test d'interactions a déjà cliqué les boutons
        es = lesson(cid, "Jeu d’évasion · " + mod)
        if cid == 't3-1':
            es.locator('.esc-opts button').nth(1).click()
            check('+10 s' in es.locator('.info').inner_text(), 'évasion : une mauvaise réponse coûte 10 s')
            es.locator('button:has-text("Indice")').click()
            check('Indice' in es.locator('.info').inner_text(), 'évasion : l’indice s’affiche')
        for kind, v in sol:
            if kind == 'o': es.locator('.esc-opts button').nth(v).click()
            else: es.locator('.esc-in').fill(str(v)); es.locator('.esc-opts button:has-text("Valider")').click()
        check('Porte ouverte' in es.locator('.info').inner_text(), 'évasion %s : la porte s’ouvre avec la solution' % mod)
    # jeux 2AC : code couleurs, tri (bien/service, capteurs), chrono-défis
    def press(cid, ttl, i, key='Enter'):
        pg.evaluate("""([cid,ttl,i,key])=>{const s=[...document.querySelectorAll('#'+cid+' section.lesson')].find(x=>x.querySelector('h3')&&x.querySelector('h3').textContent.indexOf(ttl)>-1);s.querySelector('svg > g:last-of-type').children[i].dispatchEvent(new KeyboardEvent('keydown',{key:key,bubbles:true}))}""", [cid, ttl, i, key])
    pg.reload(); pg.wait_for_timeout(500)
    cc = lesson('t2-3', 'Jeu : fabrique la résistance')
    BANDS = {'100 Ω': [1, 0, 1], '150 Ω': [1, 5, 1], '220 Ω': [2, 2, 1], '330 Ω': [3, 3, 1], '470 Ω': [4, 7, 1], '680 Ω': [6, 8, 1], '1 kΩ': [1, 0, 2], '2,2 kΩ': [2, 2, 2], '4,7 kΩ': [4, 7, 2], '10 kΩ': [1, 0, 3]}
    import re as _re
    for rnd in range(5):
        m = _re.search(r'[Ff]abrique ([0-9, ]+ ?k?Ω)', cc.locator('.info').inner_text().replace('\u202f', ' ').replace('\xa0', ' '))
        val = m.group(1).strip() if m else ''
        if rnd == 0:
            for _ in range(3): press('t2-3', 'Jeu : fabrique la résistance', 3 + 0)
            cc.locator('button:has-text("Valider")').click()
            check('Non' in cc.locator('.info').inner_text(), 'code couleurs : mauvaises bandes refusées')
        check(val in BANDS, 'code couleurs : valeur demandée lisible (%s)' % val)
        if val not in BANDS: break
        for sel_i, c in enumerate(BANDS[val]):
            press('t2-3', 'Jeu : fabrique la résistance', sel_i); press('t2-3', 'Jeu : fabrique la résistance', 3 + c)
        cc.locator('button:has-text("Valider")').click()
    check('Cinq résistances' in cc.locator('.info').inner_text(), 'code couleurs : cinq résistances réussies')
    for cid, ttl in [('t2-11', 'Jeu : bien ou service ?'), ('t2-7', 'Jeu : tout ou rien ou analogique ?')]:
        tg = lesson(cid, ttl); press(cid, ttl, 0)
        for _ in range(60):
            press(cid, ttl, 0, 'ArrowLeft')
            if 'rejouer' in tg.locator('.info').inner_text(): break
        check('rejouer' in tg.locator('.info').inner_text(), '%s : la partie se termine' % ttl)
    def chrono_read(cid, ttl):
        return pg.evaluate("""([cid,ttl])=>{const s=[...document.querySelectorAll('#'+cid+' section.lesson')].find(x=>x.querySelector('h3')&&x.querySelector('h3').textContent.indexOf(ttl)>-1);
          const gs=s.querySelectorAll('svg > g');const dyn=gs[gs.length-2];const TX=[[70,196],[200,196],[330,196],[135,256],[265,256]];const o=TX.map(()=>[]);
          dyn.querySelectorAll('text').forEach(t=>{const x=+t.getAttribute('x'),y=+t.getAttribute('y');if(y<190||y>300)return;let b=0,bd=1e9;TX.forEach((p,k)=>{const d=Math.hypot(x-p[0],y-(p[1]+19));if(d<bd){bd=d;b=k}});o[b].push(t.textContent)});return o.map(a=>a.join(' '))}""", [cid, ttl])
    for cid, ttl, order in [('t2-10', 'Jeu : chrono-défi · circuit imprimé', ['Schéma', 'Typon', 'Insolation', 'Révélation', 'Gravure', 'Perçage', 'Soudure']),
                            ('t2-13', 'Jeu : chrono-défi · mini-entreprise', ['Idée', 'Étude de marché', 'Nom et logo', 'Coût de revient', 'Distribution', 'Production', 'Vente'])]:
        ch2 = lesson(cid, ttl); names = chrono_read(cid, ttl); ks = [order.index(n) if n in order else None for n in names]
        check(None not in ks, '%s : cartes lisibles %s' % (ttl, names))
        if None not in ks:
            for slot, tok in enumerate(sorted(range(5), key=lambda k: ks[k])): press(cid, ttl, tok); press(cid, ttl, 5 + slot)
            ch2.locator('button:has-text("Vérifier")').click()
            check('Ordre exact' in ch2.locator('.info').inner_text(), '%s : le bon ordre est accepté' % ttl)
    # le mot de bienvenue se ferme d'un toucher n'importe où
    ctxw = b.new_context(viewport={'width': 420, 'height': 800}); pgw = ctxw.new_page(); pgw.route('**/*', lambda r: r.abort() if r.request.url.startswith('http') else r.continue_()); pgw.goto('file://' + os.path.join(SITE, 'index.html')); pgw.wait_for_timeout(800)
    check(pgw.locator('.lab-welcome').count() == 1, 'bienvenue : visible à la première ouverture')
    pgw.locator('.lab-welcome-card p').first.click(); pgw.wait_for_timeout(600)
    check(pgw.locator('.lab-welcome').count() == 0, 'bienvenue : un toucher sur le texte la ferme')
    ctxw.close()
    # aperçu isolé (iframe sandbox, sans stockage) : pas de fenêtre « Ma session » avant le choix du niveau, et le chapitre s'ouvre
    import json as _json
    src = open(os.path.join(SITE, 'index.html'), encoding='utf-8').read()
    pg2 = ctx.new_page(); pg2.route('**/*', lambda r: r.abort() if r.request.url.startswith('http') else r.continue_())
    pg2.set_content('<body style="margin:0"><iframe id="f" sandbox="allow-scripts allow-popups allow-forms allow-modals" style="width:420px;height:800px;border:0"></iframe></body>')
    pg2.evaluate("(h)=>{document.getElementById('f').srcdoc=h}", src.replace('<head>', '<head><base href="file://' + SITE + '/">', 1)); pg2.wait_for_timeout(1500)
    fr2 = pg2.frames[1] if len(pg2.frames) > 1 else None
    check(fr2 is not None and fr2.evaluate("document.querySelectorAll('.lab-modal').length") == 0, 'iframe sans stockage : pas de fenêtre « Ma session » avant le choix du niveau')
    if fr2 is not None:
        fr2.evaluate("(function(){var w=document.querySelector('.lab-welcome');if(w)w.remove()})()")
        fr2.evaluate("document.querySelector('.lvl-card[data-lvl=\"3\"]').click()"); pg2.wait_for_timeout(400)
        fr2.evaluate("(function(){var b=document.getElementById('lab-skip');if(b)b.click()})()"); pg2.wait_for_timeout(200)
        fr2.evaluate("document.querySelectorAll('#lv-3 a.chap')[4].click()"); pg2.wait_for_timeout(600)
        check(fr2.evaluate("(function(){var c=document.querySelector('#t3-5');return !!c&&c.getBoundingClientRect().height>100})()"), 'iframe sans stockage : un chapitre s’ouvre')
    pg2.close()
    # défis + session sur le premier chapitre
    pg.evaluate("location.hash='#%s'" % links[0]); pg.wait_for_timeout(300)
    pg.evaluate("Lab.openStart && Lab.openStart()") if pg.evaluate("!!(window.Lab&&Lab.openStart)") else None
    if pg.locator('#lab-name').count():
        pg.fill('#lab-name', 'Salma Test'); pg.check('#lab-cons'); pg.click('#lab-go'); pg.wait_for_timeout(300)
        check(pg.locator('.lab-bar2 b').inner_text() == 'Salma Test', 'barre de session')
    cid = links[0]
    tabs = pg.locator('#%s .lab-tab' % cid)
    check(tabs.count() == 6, '6 onglets de défis dans ' + cid)
    for lvl in range(5):
        pg.locator('#%s .lab-tab' % cid).nth(lvl).click()
        pg.locator('#%s .btn:has-text("Lancer la série")' % cid).click()
        for _ in range(12):
            if pg.locator('#%s .lab-done' % cid).count(): break
            o = pg.locator('#%s .lab-opts button:not([disabled])' % cid)
            if o.count(): o.first.click()
            else:
                inp = pg.locator('#%s .lab-ex input[type=text], #%s .lab-ex input:not([type])' % (cid, cid))
                if inp.count(): inp.first.fill('1'); pg.locator('#%s .lab-ex button:has-text("Valider")' % cid).first.click()
            nx = pg.locator('#%s button:has-text("Suivant"), #%s button:has-text("Terminer")' % (cid, cid))
            if nx.count(): nx.first.click()
            pg.wait_for_timeout(60)
    check(pg.evaluate('Lab.Session && Lab.Session.cur() ? Lab.Session.cur().answers.length : 0') > 0, 'des réponses sont enregistrées dans la session')
    # sécurité de base
    check(pg.evaluate("!!document.querySelector('meta[http-equiv=Content-Security-Policy]')"), 'CSP présente')
    ctx.close(); b.close()
print('\n%d échec(s)' % len(fails))
sys.exit(1 if fails else 0)
