#!/usr/bin/env python3
"""Tests parallèles du club de révision (2AC) : Rationnels (maths) et Air (physique-chimie).

    python3 docs/club/generer_tests.py            # contrôles, puis écrit tests.json, tests-maths.md, tests-pc.md, corriges.md

Trois versions (1, 2, 3) par matière, de même plan : mêmes types d'items, mêmes points, mêmes codes d'erreur, nombres de même difficulté.
Chaque clé est recalculée ici avec des fractions exactes ; les distracteurs d'un QCM sont des erreurs réelles et codées, jamais au hasard.
Le script échoue si : un total n'est pas 20, deux versions n'ont pas le même plan, deux réponses d'une version sont égales,
une erreur codée égale la clé, une clé de QCM occupe trop souvent la même place, ou un item reprend les nombres d'une question
des leçons modèles (mouvement/modeles, répertoire donné par LECONS_DIR).

Notation : tout ou rien par item. Le code d'erreur classe la faute ; il ne donne pas de demi-point.
Passation (carré latin selon le code de l'élève modulo 3) : ordre 0 = V1, V2, V3 ; ordre 1 = V2, V3, V1 ; ordre 2 = V3, V1, V2.
Équivalence : vérifiée sur le plan et les nombres seulement. La difficulté réelle se vérifie par un essai sur quelques élèves hors échantillon.
"""
import json
import math
import os
import re
import sys
from fractions import Fraction as F
from pathlib import Path

OUT = Path(__file__).resolve().parent
LECONS = Path(os.environ.get('LECONS_DIR', '/home/claude/wt-mv/mouvement/modeles'))
MIN = '−'


def sg(n):
    n = F(n)
    assert n.denominator == 1, n
    return f'{MIN}{-n.numerator}' if n < 0 else str(n.numerator)


def dec(x):
    """Écriture décimale française exacte (virgule, signe moins typographique)."""
    x = F(x)
    a = abs(x)
    ip, fp = divmod(a, 1)
    out, n = str(int(ip)), 0
    if fp:
        out += ','
        while fp and n < 6:
            fp *= 10
            d, fp = divmod(fp, 1)
            out += str(int(d))
            n += 1
        assert not fp, f'développement décimal non fini : {x}'
    return (MIN if x < 0 else '') + out


def approx(x):
    return 'environ ' + (MIN if x < 0 else '') + f'{abs(float(x)):.2f}'.replace('.', ',')


def fr(a, b):
    """a/b ; le numérateur négatif est mis entre parenthèses quand le dénominateur l'est aussi."""
    na = f'({sg(a)})' if (a < 0 and b < 0) else sg(a)
    return f'{na}/({sg(b)})' if b < 0 else f'{na}/{sg(b)}'


def paren(a):
    return f'({sg(a)})' if a < 0 else sg(a)


def val(v):
    return v if isinstance(v, str) else dec(v)


# ------------------------------------------------------------------ fabrique d'items
def num(id_, pts, skill, stem, key, errs, unit=''):
    return dict(id=id_, kind='num', pts=pts, skill=skill, stem=stem, unit=unit, key=dec(key), keyv=str(F(key)),
                errs=[dict(value=val(v), code=c, label=l) for v, c, l in errs])


def mcq(id_, pts, skill, stem, opts, key_text, pos):
    """opts : [(texte, code)], la bonne réponse porte le code 'OK'. pos : place de la bonne réponse dans la liste affichée."""
    good = [o for o in opts if o[1] == 'OK']
    assert len(good) == 1 and good[0][0] == key_text, (id_, 'une seule bonne réponse attendue')
    wrong = [o for o in opts if o[1] != 'OK']
    order = wrong[:pos] + good + wrong[pos:]
    assert len({o[0] for o in order}) == len(order), (id_, 'options en double')
    return dict(id=id_, kind='mcq', pts=pts, skill=skill, stem=stem, key=chr(65 + order.index(good[0])), key_text=key_text,
                opts=[dict(letter=chr(65 + i), text=t, code=c) for i, (t, c) in enumerate(order)])


def pos_for(form, i, n):
    return (form + 2 * i) % n          # la bonne réponse change de place d'un item à l'autre et d'une version à l'autre


# ------------------------------------------------------------------ maths : les nombres rationnels
def maths(f):
    items = []
    a, b = [(48, 6), (54, 9), (63, 7)][f]
    items.append(num('M1', 2, 'quotient de deux négatifs', f'Calcule : {fr(-a, -b)} =', F(a, b),
                     [(F(-a, b), 'SIGNE', 'résultat négatif alors que les signes sont identiques'), (F(a - b), 'OPERATION', 'soustraction au lieu de division')]))
    a, b = [(45, 5), (56, 7), (42, 6)][f]
    items.append(num('M2', 2, 'quotient de signes contraires', f'Calcule : {fr(-a, b)} =', F(-a, b),
                     [(F(a, b), 'SIGNE', 'résultat positif alors que les signes sont contraires'), (F(-a - b), 'OPERATION', 'addition au lieu de division')]))
    a, b = [(-7, 4), (-11, 4), (-13, 4)][f]
    items.append(num('M3', 2, 'quotient décimal', f'Écris {fr(a, b)} sous forme décimale (avec une virgule) :', F(a, b),
                     [(F(-a, b), 'SIGNE', 'résultat positif'), (approx(F(b, a)), 'INVERSION', 'dénominateur divisé par le numérateur')]))
    sa, sb = [((-17, -23), (19, -31)), ((-13, -29), (23, -17)), ((-19, -37), (29, -13))][f]
    for k, (x, y) in enumerate((sa, sb)):
        ans = 'positif' if (x < 0) == (y < 0) else 'négatif'
        other = 'négatif' if ans == 'positif' else 'positif'
        items.append(mcq(f'M4{"ab"[k]}', 1, 'signe sans calcul', f'Sans calculer, le quotient {fr(x, y)} est-il positif ou négatif ?',
                         [(ans, 'OK'), (other, 'SIGNE'), ('nul', 'ZERO'), ('on ne peut pas savoir', 'SAVOIR')], ans, pos_for(f, 4 + k, 4)))
    a, b = [(5, 8), (7, 3), (4, 9)][f]
    items.append(mcq('M5', 2, 'écriture équivalente', f'Quelle écriture est égale à {fr(a, -b)} ?',
                     [(fr(-a, b), 'OK'), (fr(a, b), 'SIGNE'), (fr(-b, a), 'INVERSION'), (fr(b, a), 'INVERSION')], fr(-a, b), pos_for(f, 6, 4)))
    n = [7, 9, 5][f]
    lo = -(n // 2) - 1
    pair = lambda p: f'{sg(p)} et {sg(p + 1)}'
    items.append(mcq('M6', 2, 'position sur la droite graduée', f'Le nombre {fr(-n, 2)} se trouve entre deux entiers consécutifs. Lesquels ?',
                     [(pair(lo), 'OK'), (pair(-lo - 1), 'SIGNE'), (pair(lo + 1), 'DECALAGE'), (pair(-n), 'NUMERATEUR')], pair(lo), pos_for(f, 7, 4)))
    x, y = [((5, 4), (7, 4)), ((8, 5), (6, 5)), ((4, 3), (5, 3))][f]
    left, right = F(-x[0], x[1]), F(-y[0], y[1])
    sym = '>' if left > right else '<'
    items.append(mcq('M7a', 1, 'comparer deux négatifs', f'Recopie avec le bon signe (< ou >) : {fr(-x[0], x[1])} ○ {fr(-y[0], y[1])}',
                     [('<', 'OK' if sym == '<' else 'COMPARAISON'), ('>', 'OK' if sym == '>' else 'COMPARAISON'), ('=', 'EGAL')], sym,
                     0 if sym == '<' else 1))
    small, big, den = [(1, 3, 2), (1, 5, 4), (2, 5, 3)][f]
    cands = [F(-small, den), F(-big, den), F(-1)]
    smallest, largest = min(cands), max(cands)
    txt = lambda q: sg(q) if q.denominator == 1 else fr(q.numerator, q.denominator)
    code = lambda q: 'OK' if q == smallest else ('COMPARAISON' if q == largest else 'AUTRE')
    items.append(mcq('M7b', 1, 'ranger des négatifs', 'Quel est le plus petit de ces nombres ?',
                     [(txt(q), code(q)) for q in cands], txt(smallest), pos_for(f, 9, 3)))
    ctx = [('La température baisse de 15 °C en 6 heures. Quelle est la variation de température par heure ?', 15, 6, '°C par heure'),
           ('Le niveau d\'eau d\'un réservoir baisse de 21 cm en 6 jours. Quelle est la variation du niveau par jour ?', 21, 6, 'cm par jour'),
           ('Un sous-marin descend de 9 m en 6 secondes. Quelle est la variation d\'altitude par seconde ?', 9, 6, 'm par seconde')][f]
    items.append(num('M8', 3, 'situation : variation par unité', ctx[0], F(-ctx[1], ctx[2]),
                     [(F(ctx[1], ctx[2]), 'SIGNE', 'variation positive pour une baisse'), (approx(F(ctx[2], -ctx[1])), 'INVERSION', 'durée divisée par la variation'),
                      (F(-ctx[1] + ctx[2]), 'OPERATION', 'soustraction au lieu de division')], unit=ctx[3]))
    a, c = [(-30, 6), (-20, 5), (-18, 3)][f]
    items.append(num('M9', 3, 'quotient inconnu', f'Complète : {paren(a)}/…… = {c}', F(a, c),
                     [(F(-a, c), 'SIGNE', 'diviseur positif'), (F(a * c), 'PRODUIT', 'produit au lieu de quotient')]))
    return items


# ------------------------------------------------------------------ physique-chimie : l'air autour de nous
def physique(f):
    items = []
    gaz_o = lambda good, a, b, c: [(good, 'OK'), (a, 'N2' if 'diazote' in a else 'O2'), (b, 'CO2'), (c, 'AUTRE')]
    if f == 0:
        qs = [('Dans l\'air, le gaz le plus abondant est :', 'le diazote', [('le dioxygène', 'O2'), ('le dioxyde de carbone', 'CO2'), ('le dihydrogène', 'AUTRE')]),
              ('Le gaz que nous utilisons pour respirer est :', 'le dioxygène', [('le diazote', 'N2'), ('le dioxyde de carbone', 'CO2'), ('le dihydrogène', 'AUTRE')])]
    elif f == 1:
        qs = [('Dans l\'air, le diazote représente environ :', '78 %', [('21 %', 'O2'), ('1 %', 'AUTRE'), ('50 %', 'AUTRE')]),
              ('Dans l\'air, le dioxygène représente environ :', '21 %', [('78 %', 'N2'), ('1 %', 'AUTRE'), ('50 %', 'AUTRE')])]
    else:
        qs = [('Quel gaz représente environ 78 % de l\'air ?', 'le diazote', [('le dioxygène', 'O2'), ('le dioxyde de carbone', 'CO2'), ('le dihydrogène', 'AUTRE')]),
              ('Quel gaz représente environ 21 % de l\'air ?', 'le dioxygène', [('le diazote', 'N2'), ('le dioxyde de carbone', 'CO2'), ('le dihydrogène', 'AUTRE')])]
    for k, (stem, good, bad) in enumerate(qs):
        items.append(mcq(f'P1{"ab"[k]}', 1, 'composition de l\'air', stem, [(good, 'OK')] + bad, good, pos_for(f, k, 4)))
    for i, (gaz, pct, vols) in enumerate((('diazote', 78, [300, 400, 600]), ('dioxygène', 21, [400, 600, 300]))):
        V = vols[f]
        items.append(num(f'P{2 + i}', 3, 'volume à partir d\'un pourcentage',
                         f'L\'air contient {pct} % de {gaz}. Quel est le volume de {gaz} dans {V} L d\'air ?', F(pct * V, 100),
                         [(F(pct * V), 'POURCENT', 'oubli de la division par 100'), (F(pct * V, 10000), 'DECIMAL', 'division par 100 en trop'),
                          (F(V - pct), 'SOUSTRAIT', 'soustraction du pourcentage'), (F(V + pct), 'ADDITION', 'addition du pourcentage')], unit='L'))
    g, V = [(78, 100), (117, 150), (195, 250)][f]
    assert F(78, 100) * V == g
    items.append(num('P4', 3, 'volume d\'air à partir du gaz',
                     f'Dans un local, on trouve {g} L de diazote. L\'air contient 78 % de diazote. Quel est le volume d\'air du local ?', F(V),
                     [(F(78, 100) * g, 'MULTIPLIE', 'pourcentage appliqué au volume de gaz'), (F(78 * g), 'POURCENT', 'oubli de la division par 100')], unit='L'))
    ctx5 = ['Une pompe à vélo a sa sortie bouchée. On enfonce la poignée : le volume de l\'air passe de 60 mL à 25 mL. La pression de l\'air enfermé…',
            'On serre dans la main un ballon de baudruche fermé : le volume de l\'air passe de 1,0 L à 0,6 L. La pression de l\'air dans le ballon…',
            'Une seringue est fermée au bout. On enfonce le piston : le volume de l\'air passe de 30 mL à 12 mL. La pression de l\'air enfermé…'][f]
    items.append(mcq('P5', 2, 'compression et pression', ctx5,
                     [('augmente', 'OK'), ('diminue', 'INVERSE'), ('ne change pas', 'NOCHANGE')], 'augmente', pos_for(f, 4, 3)))
    ctx6 = ['Une seringue est fermée au bout. On tire le piston : le volume de l\'air passe de 10 mL à 25 mL. La pression de l\'air enfermé…',
            'Un soufflet fermé (comme un accordéon) contient de l\'air. On l\'étire : le volume de l\'air passe de 1,0 L à 2,0 L. La pression de l\'air enfermé…',
            'Une pompe à vélo a sa sortie bouchée. On tire la poignée : le volume de l\'air passe de 40 mL à 70 mL. La pression de l\'air enfermé…'][f]
    items.append(mcq('P6', 2, 'expansion et pression', ctx6,
                     [('diminue', 'OK'), ('augmente', 'INVERSE'), ('ne change pas', 'NOCHANGE')], 'diminue', pos_for(f, 5, 3)))
    ctx7 = ['On enfonce le piston d\'une seringue fermée au bout. Que se passe-t-il pour les particules de l\'air enfermé ?',
            'On écrase une bouteille en plastique bien bouchée. Que se passe-t-il pour les particules de l\'air qu\'elle contient ?',
            'On enfonce la poignée d\'une pompe à vélo dont la sortie est bouchée. Que se passe-t-il pour les particules de l\'air enfermé ?'][f]
    good = 'Leur nombre ne change pas : elles se rapprochent.'
    items.append(mcq('P7', 3, 'particules et compression', ctx7,
                     [(good, 'OK'), ('Elles rétrécissent.', 'RETRECISSENT'), ('Une partie de l\'air disparaît.', 'DISPARAIT'), ('Leur nombre augmente.', 'NOMBRE')],
                     good, pos_for(f, 6, 4)))
    obj, de = [('un ballon de basket', 'du ballon de basket'), ('un pneu de vélo', 'du pneu de vélo'), ('un ballon de football', 'du ballon de football')][f]
    items.append(mcq('P8', 2, 'l\'air a une masse', f'On gonfle avec de l\'air {obj} qui était dégonflé. La masse {de}…',
                     [('augmente', 'OK'), ('diminue', 'INVERSE'), ('ne change pas', 'AIRSANSMASSE')], 'augmente', pos_for(f, 7, 3)))
    return items


# ------------------------------------------------------------------ contrôles
def lesson_questions(subject):
    d = LECONS / subject
    qs = []
    for p in d.glob('2ac-*-modele.js'):
        for m in re.finditer(r"\bq: '((?:[^'\\]|\\.)*)'", p.read_text(encoding='utf-8')):
            qs.append((p.name, re.findall(r'\d+', m.group(1)), m.group(1)))
    return qs


def controles(subject, forms):
    fails = []
    plan = lambda items: [(i['id'], i['kind'], i['pts'], i['skill'], len(i.get('opts', [])), tuple(sorted({e['code'] for e in i.get('errs', [])}))) for i in items]
    lq = lesson_questions(subject)
    if not lq:
        print(f'  (leçons modèles introuvables dans {LECONS / subject} : contrôle de reprise non fait)')
    for f, items in enumerate(forms):
        tag = f'{subject} V{f + 1}'
        total = sum(i['pts'] for i in items)
        if total != 20:
            fails.append(f'{tag}: total {total} ≠ 20')
        if plan(items) != plan(forms[0]):
            fails.append(f'{tag}: plan différent de la version 1')
        keys = [i['key'] for i in items if i['kind'] == 'num']
        if len(set(keys)) != len(keys):
            fails.append(f'{tag}: deux réponses numériques égales {keys}')
        for i in items:
            if i['kind'] == 'num':
                vals = [e['value'] for e in i['errs']]
                if i['key'] in vals or len(set(vals)) != len(vals):
                    fails.append(f'{tag} {i["id"]}: erreur codée égale à la clé ou en double {vals}')
                toks = re.findall(r'\d+', i['stem'])
                for fn, lt, text in lq:
                    if sorted(toks) == sorted(lt) and toks:
                        fails.append(f'{tag} {i["id"]}: mêmes nombres que la leçon {fn} : {text[:60]}')
        letters = [i['key'] for i in items if i['kind'] == 'mcq']
        if max(letters.count(x) for x in set(letters)) > math.ceil(len(letters) / 3) + 1:
            fails.append(f'{tag}: clés de QCM trop souvent à la même place {letters}')
    return fails


# ------------------------------------------------------------------ sorties
TITRE = {'maths': 'Mathématiques · les nombres rationnels', 'pc': 'Physique-chimie · l\'air qui nous entoure'}
CONSIGNE_FR = ('Réponds seul(e), sans calculatrice et sans regarder tes notes. Pour les questions à choix, entoure une seule lettre. '
               'Si tu ne sais pas, écris « je ne sais pas » : c\'est mieux que de deviner.')
CONSIGNE_AR = 'أجب وحدك دون آلة حاسبة ودون النظر إلى ملاحظاتك. في أسئلة الاختيار ضع دائرة حول حرف واحد. إذا كنت لا تعرف فاكتب «لا أعرف».'


def pts(n):
    return f'{n} pt' + ('s' if n > 1 else '')


def to_md(subject, forms):
    out = []
    for f, items in enumerate(forms):
        out += [f'## Version {f + 1}', '', f'{TITRE[subject]} · 2ᵉ année collège', '', 'Code élève : ____________   Date : ____________   Total : ______ / 20', '',
                CONSIGNE_FR, '', CONSIGNE_AR, '']
        for i in items:
            label = i['id'][1:]
            if i['kind'] == 'num':
                tail = f' …………… {i["unit"]}' if i['unit'] else ' ……………'
                out += [f'**{label}.** ({pts(i["pts"])}) {i["stem"]}{tail}', '']
            else:
                out += [f'**{label}.** ({pts(i["pts"])}) {i["stem"]}', '']
                out += [f'- {o["letter"]}) {o["text"]}' for o in i['opts']] + ['']
    return '\n'.join(out)


def corriges_md(data):
    ordre = ['Ordre 0 (code ÷ 3, reste 0) : V1, V2, V3', 'Ordre 1 (reste 1) : V2, V3, V1', 'Ordre 2 (reste 2) : V3, V1, V2']
    out = ['# Corrigés et grille de correction (réservé aux enseignants)', '',
           'Ne jamais distribuer ce document aux élèves. Corriger sans connaître le groupe de l\'élève : ne regarder que son code.', '',
           '## Règles de correction', '',
           '- Chaque item vaut tout ou rien. Total sur 20.',
           '- Réponse numérique : valable si la valeur est exacte, sous n\'importe quelle écriture équivalente (−5/2, −2,5, −2.5). Le signe doit être correct.',
           '- « Je ne sais pas » ou case vide : 0 point, code VIDE. Une réponse fausse qui ne figure pas dans la liste : code AUTRE.',
           '- Pour chaque item faux, écrire le code d\'erreur dans la feuille d\'analyse (colonne de l\'item). Un item juste n\'a pas de code.', '',
           '## Ordre de passation (carré latin)', ''] + [f'- {o}' for o in ordre] + [
           '', 'Les trois versions sont données dans cet ordre à l\'avant-test, à l\'après-test immédiat et au test différé, pour chaque matière. '
           'Ainsi aucune version n\'est toujours placée à la même occasion. Le code élève est un numéro ; le reste de sa division par 3 donne l\'ordre.', '']
    names = {'maths': 'Mathématiques', 'pc': 'Physique-chimie'}
    for subject in ('maths', 'pc'):
        out += [f'## {names[subject]}', '']
        for f, items in enumerate(data[subject]):
            out += [f'### Version {f + 1}', '', '| Item | Points | Compétence | Bonne réponse | Erreurs codées (valeur : code) |', '|---|---|---|---|---|']
            for i in items:
                if i['kind'] == 'num':
                    ans = i['key'] + (f' {i["unit"]}' if i['unit'] else '')
                    errs = ' ; '.join(f'{e["value"]} : {e["code"]}' for e in i['errs'])
                else:
                    ans = f'{i["key"]}) {i["key_text"]}'
                    errs = ' ; '.join(f'{o["letter"]} : {o["code"]}' for o in i['opts'] if o['code'] != 'OK')
                out.append(f'| {i["id"][1:]} | {i["pts"]} | {i["skill"]} | {ans} | {errs} |')
            out.append('')
    out += ['## Codes d\'erreur', '',
            '| Code | Sens |', '|---|---|',
            '| SIGNE | mauvais signe du résultat |', '| OPERATION | opération fausse (soustraction, addition) |', '| INVERSION | numérateur et dénominateur échangés |',
            '| PRODUIT | produit au lieu d\'un quotient |', '| ZERO / SAVOIR / EGAL | réponse « nul », « on ne peut pas savoir », « = » |',
            '| DECALAGE / NUMERATEUR | position sur la droite : entiers voisins décalés, ou numérateur utilisé comme position |',
            '| COMPARAISON | négatifs comparés comme des positifs (le plus grand en valeur absolue jugé le plus grand) |',
            '| POURCENT / DECIMAL | pourcentage : division par 100 oubliée, ou faite deux fois |', '| SOUSTRAIT / ADDITION | pourcentage soustrait ou ajouté au lieu d\'être appliqué |',
            '| MULTIPLIE | pourcentage appliqué au mauvais volume |', '| O2 / N2 / CO2 | gaz confondu |', '| INVERSE | sens de variation inversé (pression, masse) |',
            '| NOCHANGE | « ne change pas » pour la pression |', '| RETRECISSENT / DISPARAIT / NOMBRE | idées fausses sur les particules |', '| AIRSANSMASSE | l\'air est jugé sans masse |',
            '| AUTRE / VIDE | réponse hors liste / pas de réponse |', '']
    return '\n'.join(out)


def main():
    data, fails = {}, []
    for subject, fn in (('maths', maths), ('pc', physique)):
        forms = [fn(f) for f in range(3)]
        fails += controles(subject, forms)
        data[subject] = forms
        (OUT / f'tests-{subject}.md').write_text(to_md(subject, forms), encoding='utf-8')
    (OUT / 'tests.json').write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding='utf-8')
    (OUT / 'corriges.md').write_text(corriges_md(data), encoding='utf-8')
    for m in fails:
        print('ÉCHEC', m)
    print(f'ÉCHECS : {len(fails)}')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
