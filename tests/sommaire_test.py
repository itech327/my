#!/usr/bin/env python3
"""2e année : la liste et l'ordre des chapitres suivent le sommaire du manuel."""
import os, sys, re
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BOOK = ['Introduction des nombres rationnels', 'Addition et soustraction des nombres rationnels', 'Symétrie axiale',
 'Multiplication et division des nombres rationnels', 'Triangle et parallèles', 'Les quatre opérations sur les nombres rationnels',
 'Droites remarquables dans un triangle', 'Puissances', 'Calcul littéral', 'Triangle rectangle et cercle', 'Théorème de Pythagore',
 'Cosinus d’un angle aigu', 'Équations', 'Vecteurs et translations', 'Ordre des nombres rationnels et opérations', 'Proportionnalité',
 'Statistique', 'Pyramides et cônes de révolution']
fails = []
def check(c, m):
    print(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
with sync_playwright() as p:
    try: b = p.chromium.launch()
    except Exception: b = p.chromium.launch(channel='chrome')
    ctx = b.new_context(viewport={'width': 420, 'height': 900})
    ctx.add_init_script("try{sessionStorage.setItem('lab_skip','1');localStorage.setItem('mm-kind','ord')}catch(e){}")
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.route('**/*', lambda r: r.abort() if r.request.url.startswith('http') else r.continue_())
    pg.goto('file://' + os.path.join(ROOT, 'maths.html')); pg.wait_for_timeout(700)
    pg.locator('#levels button[data-lv="2"]').click(); pg.wait_for_timeout(300)
    cards = pg.evaluate("Array.from(document.querySelectorAll('#chapters .chap')).map(function(c){return {t:c.querySelector('strong').textContent,href:c.getAttribute('href'),soon:c.classList.contains('soon'),ar:(c.querySelector('.ar-t')||{}).textContent||''}})")
    check(len(cards) == 18, '18 chapitres comme le manuel (%d)' % len(cards))
    titles = [re.sub(r'^\d+\.\s*', '', c['t']) for c in cards]
    check(titles == BOOK, 'titres et ordre identiques au sommaire ' + str([x for x, y in zip(titles, BOOK) if x != y][:3]))
    check([int(re.match(r'(\d+)\.', c['t']).group(1)) for c in cards] == list(range(1, 19)), 'numérotation 1 à 18')
    check(all(not c['soon'] and c['href'] for c in cards), 'tous les chapitres sont disponibles')
    check(all(c['ar'] for c in cards), 'titre arabe sur chaque carte')
    # chaque chapitre : eyebrow = numéro du manuel
    for i, c in enumerate(cards):
        eb = pg.evaluate("(function(h){var e=document.getElementById(h);return e?e.querySelector('.eyebrow').textContent:''})('%s')" % c['href'][1:])
        check(('Chapitre %d ' % (i + 1)) in eb, 'eyebrow %s : %s' % (c['href'], eb))
    # invariants géométriques des droites remarquables
    def chips(lesson):
        pg.evaluate("location.hash='#c2-9-l%d'" % lesson); pg.wait_for_timeout(250)
        return pg.evaluate("Array.from(document.querySelectorAll('#c2-9-l%d .chip')).map(function(c){return c.textContent})" % lesson)
    nums = lambda L: [float(re.findall(r'(\d+,\d+)', x)[0].replace(',', '.')) for x in L[:3]]
    c1 = nums(chips(1)); check(max(c1) - min(c1) < 0.15, 'médiatrices : OA = OB = OC ' + str(c1))
    c2 = nums(chips(2)); check(max(c2) - min(c2) < 0.15, 'bissectrices : trois distances égales ' + str(c2))
    c4 = chips(4); check('0,67' in ' '.join(c4), 'médianes : AG ÷ AA′ = 0,67 ' + ' | '.join(c4))
    c3 = chips(3); check('même point H' in ' '.join(c3), 'hauteurs : concourantes')
    # arabe présent dans les nouveaux chapitres
    for cid, n in [('c2-9', 4), ('c2-16', 2), ('c2-17', 3), ('c2-18', 2), ('c2-13', 2)]:
        k = pg.evaluate("document.querySelectorAll('#%s details.ar').length" % cid)
        check(k == n, '%s : %d encadrés arabes (%d)' % (cid, n, k))
    check(not errs, 'aucune erreur JS ' + str(errs[:2]))
    ctx.close(); b.close()
print('FAILS:', len(fails)); sys.exit(1 if fails else 0)
