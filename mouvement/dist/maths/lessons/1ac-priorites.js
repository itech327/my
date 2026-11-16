/* @meta {"id":"1ac-priorites","level":"1","order":1,"theme":"Nombres et calcul","title":"Les priorités opératoires","ar":"أسبقية العمليات","lead":"Au hanout, deux élèves calculent le même ticket et trouvent deux prix : les priorités décident qui a raison."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, CW = 14.5; // largeur d'un caractère en police mono 24 px

  /* une ligne de calcul : jetons, avec une partie surlignée */
  function ligne(svg, y) {
    var g = S('g', {}, svg);
    g.set = function (toks, hi) {
      while (g.firstChild) g.removeChild(g.firstChild);
      var len = toks.join(' ').length, x = 180 - len * CW / 2;
      toks.forEach(function (t, i) {
        var w = t.length * CW, on = hi && i >= hi[0] && i <= hi[1];
        if (on) {
          var x0 = x - 4, last = i === hi[1];
          S('rect', { x: x0, y: y - 22, width: w + (last ? 8 : CW + 8), height: 32, rx: 6, fill: 'var(--acc)' }, g);
        }
        var tx = T(g, x + w / 2, y, t, 'lbl'); tx.style.fontSize = '24px'; if (on) tx.style.fill = '#141517';
        x += w + CW;
      });
    };
    return g;
  }

  MV.lesson({
    id: '1ac-priorites',
    objectif: {
      fr: 'Calculer une expression avec plusieurs opérations en respectant les priorités.',
      ar: 'حساب تعبير عددي يضم عدة عمليات مع احترام أسبقية العمليات.'
    },

    ouverture: {
      vb: '0 0 360 260', label: 'Un ticket du hanout',
      hud: [['a', 'Amine'], ['s', 'Salma'], ['v', 'le bon prix']],
      draw: function (svg) {
        var e = {};
        e.ticket = S('g', {}, svg);
        S('rect', { x: 90, y: 20, width: 180, height: 130, rx: 8, fill: '#e9e9ea' }, e.ticket);
        [['1 lait', '7 DH'], ['3 pains', '1,5 DH l\'un']].forEach(function (r, i) {
          T(e.ticket, 104, 56 + i * 30, r[0], 'lbl', 'start').style.fill = '#141517';
          T(e.ticket, 256, 56 + i * 30, r[1], 'lbl', 'end').style.fill = '#141517';
        });
        T(e.ticket, 180, 132, 'Total = 7 + 3 × 1,5', 'lbl').style.fill = '#141517';
        e.a = T(svg, 90, 200, 'Amine : 15 DH', 'lbl big'); e.s = T(svg, 270, 200, 'Salma : 11,5 DH', 'lbl big');
        e.q = T(svg, 180, 240, 'Qui a raison ?', 'lbl big acc');
        return e;
      },
      steps: [
        { cap: 'Au **hanout**, on achète un lait et trois pains.', on: ['ticket'], hud: { a: '–', s: '–', v: '–' } },
        { cap: 'Amine calcule de gauche à droite : il trouve **15 DH**.', on: ['ticket', 'a'], hud: { a: ['15'], s: '–', v: '–' } },
        { cap: 'Salma calcule d\'abord 3 × 1,5 : elle trouve **11,5 DH**.', on: ['ticket', 'a', 's'], hud: { a: '15', s: ['11,5'], v: '–' } },
        { cap: 'Le même calcul, deux prix. **Qui a raison** ? On le saura à la fin.', on: ['ticket', 'a', 's', 'q'], hud: { a: '15', s: '11,5', v: ['?'] } }
      ]
    },

    prepare: [
      ['3 × 1,5 = 4,5', true, 'Trois fois 1,5 : 1,5 + 1,5 + 1,5 = 4,5.'],
      ['20 − 8 = 8 − 20', false, 'La soustraction ne se fait pas dans n\'importe quel ordre : 20 − 8 = 12.'],
      ['4 × 5 = 5 × 4', true, 'On peut échanger les deux nombres d\'une multiplication.']
    ],

    regarde: {
      vb: '0 0 360 220', label: 'Un calcul se réduit étape par étape',
      hud: [['r', 'règle'], ['o', 'opération'], ['v', 'résultat']],
      draw: function (svg) {
        var e = {};
        e.l1 = ligne(svg, 70); e.fl = T(svg, 180, 118, '↓', 'lbl big acc'); e.l2 = ligne(svg, 168);
        e.l1.setAttribute('data-keep', 1); e.l2.setAttribute('data-keep', 1);
        return e;
      },
      steps: [
        { cap: 'Sans parenthèses, on fait d\'abord les **multiplications** et les divisions.', ar: 'بدون أقواس، نبدأ بالضرب والقسمة.', on: ['fl'], hud: { r: ['× ÷ d\'abord'], o: '3 × 1,5', v: '–' },
          run: function (e) { e.l1.set(['7', '+', '3', '×', '1,5'], [2, 4]); e.l2.set(['7', '+', '4,5']); } },
        { cap: 'Puis les **additions** et les soustractions : 7 + 4,5 = 11,5.', ar: 'ثم الجمع والطرح: [[7 + 4,5 = 11,5]].', on: ['fl'], hud: { r: 'puis + −', o: ['7 + 4,5'], v: ['11,5'] },
          run: function (e) { e.l1.set(['7', '+', '4,5'], [0, 2]); e.l2.set(['11,5']); } },
        { cap: 'Les **parenthèses** passent avant tout : on calcule l\'intérieur d\'abord.', ar: 'نحسب ما بين القوسين أولا.', on: ['fl'], hud: { r: ['( ) d\'abord'], o: '7 + 3', v: '–' },
          run: function (e) { e.l1.set(['(7', '+', '3)', '×', '1,5'], [0, 2]); e.l2.set(['10', '×', '1,5']); } },
        { cap: 'Ici le calcul est différent : (7 + 3) × 1,5 = **15**.', ar: 'الأقواس تغير النتيجة: [[(7 + 3) × 1,5 = 15]].', on: ['fl'], hud: { r: '( ) d\'abord', o: ['10 × 1,5'], v: ['15'] },
          run: function (e) { e.l1.set(['10', '×', '1,5'], [0, 2]); e.l2.set(['15']); } },
        { cap: 'Avec seulement + et −, on calcule **de gauche à droite**.', ar: 'إذا كانت العمليات كلها جمعا وطرحا، نحسب من اليسار إلى اليمين.', on: ['fl'], hud: { r: ['gauche → droite'], o: '20 − 8', v: '–' },
          run: function (e) { e.l1.set(['20', '−', '8', '+', '2'], [0, 2]); e.l2.set(['12', '+', '2']); } },
        { cap: 'Donc 20 − 8 + 2 = **14**, et pas 10.', ar: 'إذن [[20 − 8 + 2 = 14]] وليس 10.', on: ['fl'], hud: { r: 'gauche → droite', o: ['12 + 2'], v: ['14'] },
          run: function (e) { e.l1.set(['12', '+', '2'], [0, 2]); e.l2.set(['14']); } },
        { cap: 'Même règle pour × et ÷ seuls : 24 ÷ 4 × 2 = 6 × 2 = **12**.', ar: 'ونفس القاعدة مع الضرب والقسمة وحدهما: [[24 ÷ 4 × 2 = 12]].', on: ['fl'], hud: { r: 'gauche → droite', o: ['24 ÷ 4'], v: ['12'] },
          run: function (e) { e.l1.set(['24', '÷', '4', '×', '2'], [0, 2]); e.l2.set(['6', '×', '2', '=', '12']); } }
      ]
    },

    faisons: [
      { title: 'À toi de choisir', intro: 'Touche l\'opération à faire en premier. Le calcul se réduit à chaque bonne réponse.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 120', role: 'img', 'aria-label': 'Expression à calculer' }, st);
          var fb = MV.H('div', 'fb', '', c); fb.setAttribute('aria-live', 'polite');
          var toks = ['5', '+', '2', '×', '4', '−', '6', '÷', '3'];
          function val(s) { return MV.parseNum(s); }
          function ok(i) { // i : indice d'un opérateur
            var hasMul = toks.some(function (t) { return t === '×' || t === '÷'; });
            if (hasMul) return (toks[i] === '×' || toks[i] === '÷') && !(toks[i - 2] === '×' || toks[i - 2] === '÷');
            return i === 1;
          }
          function draw() {
            while (svg.firstChild) svg.removeChild(svg.firstChild);
            var len = toks.join(' ').length, x = 180 - len * CW / 2;
            toks.forEach(function (t, i) {
              var w = t.length * CW, isOp = i % 2 === 1;
              if (isOp) {
                var b = S('rect', { x: x - 6, y: 34, width: w + 12, height: 40, rx: 8, fill: 'var(--acc-bg)', stroke: 'var(--acc)', tabindex: 0, role: 'button', 'aria-label': 'Opération ' + t + ' numéro ' + ((i + 1) / 2) }, svg);
                b.style.cursor = 'pointer';
                var pick = function () {
                  if (!ok(i)) { fb.className = 'fb ko'; fb.textContent = t === '+' || t === '−' ? 'Pas encore : il reste une multiplication ou une division.' : 'Avec × et ÷ côte à côte, on va de gauche à droite.'; return; }
                  var a = val(toks[i - 1]), bb = val(toks[i + 1]), r = t === '×' ? a * bb : t === '÷' ? a / bb : t === '+' ? a + bb : a - bb;
                  toks.splice(i - 1, 3, MV.fmt(Math.round(r * 1000) / 1000));
                  fb.className = 'fb ok'; fb.textContent = 'Juste : ' + MV.fmt(a) + ' ' + t + ' ' + MV.fmt(bb) + ' = ' + MV.fmt(r) + '.';
                  draw();
                  if (toks.length === 1) { fb.textContent = 'Bravo : le résultat est ' + toks[0] + '.'; done(); }
                };
                b.addEventListener('click', pick); b.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pick(); } });
              }
              var tx = T(svg, x + w / 2, 62, t, 'lbl'); tx.style.fontSize = '24px'; tx.style.pointerEvents = 'none';
              x += w + CW;
            });
          }
          draw();
        } },
      { title: 'Résolvons ensemble', intro: 'Calcule A = 18 − (4 + 2) × 2.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Quel calcul fais-tu en premier ?', o: ['18 − 4', '4 + 2', '2 × 2'], a: 1, e: 'Les parenthèses d\'abord.', ko: 'Regarde s\'il y a des parenthèses.' },
            { q: 'Étape 2. A = 18 − 6 × 2. Que vaut 6 × 2 ?', a: 12, hint: 'La multiplication passe avant la soustraction.' },
            { q: 'Étape 3. A = 18 − 12 = ?', a: 6, ok: 'A = 6.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Calcule 12 + 3 × 4.', a: 24, hint: 'D\'abord 3 × 4 = 12.' },
      { lvl: 'Niveau 2', q: 'Calcule 30 − 10 − 5.', a: 15, hint: 'De gauche à droite : 30 − 10 = 20.' },
      { lvl: 'Niveau 3', q: 'Calcule (8 + 2) × (5 − 3).', a: 20, hint: 'Deux parenthèses : 10 et 2.' },
      { lvl: 'Niveau 4', q: 'Yassine achète 4 cahiers à 6,5 DH et un stylo à 3 DH. Calcule le prix total.', a: 29, unit: 'DH', hint: 'Écris 4 × 6,5 + 3.' }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'Le bon prix du ticket',
      hud: [['c', 'calcul'], ['v', 'prix'], ['q', 'qui a raison']],
      draw: function (svg) {
        var e = {};
        e.l1 = ligne(svg, 70); e.l2 = ligne(svg, 150); e.l1.setAttribute('data-keep', 1); e.l2.setAttribute('data-keep', 1);
        e.fl = T(svg, 180, 112, '↓', 'lbl big acc');
        return e;
      },
      steps: [
        { cap: 'Le ticket : 7 + 3 × 1,5. La **multiplication** d\'abord.', on: ['fl'], hud: { c: ['3 × 1,5'], v: '–', q: '–' }, run: function (e) { e.l1.set(['7', '+', '3', '×', '1,5'], [2, 4]); e.l2.set(['7', '+', '4,5']); } },
        { cap: 'Puis 7 + 4,5 = **11,5 DH**.', ar: 'الثمن الصحيح [[11,5 DH]].', on: ['fl'], hud: { c: '7 + 4,5', v: ['11,5 DH'], q: '–' }, run: function (e) { e.l1.set(['7', '+', '4,5'], [0, 2]); e.l2.set(['11,5']); } },
        { cap: '**Salma** a raison. Amine a calculé comme si on achetait 10 pains.', ar: 'سلمى على حق: أمين حسب كأنه اشترى 10 خبزات.', hud: { c: '7 + 3 × 1,5', v: '11,5 DH', q: ['Salma'] }, run: function (e) { e.l1.set(['7', '+', '3', '×', '1,5']); e.l2.set(['11,5']); } }
      ]
    },

    retenir: [
      'Dans une expression, on calcule d\'abord entre <b>parenthèses</b>, puis les <b>multiplications et divisions</b>, enfin les <b>additions et soustractions</b>.',
      'Quand les opérations ont la même priorité, on calcule <b>de gauche à droite</b>.'
    ],
    retenirAr: 'نحسب أولا ما بين الأقواس، ثم الضرب والقسمة، ثم الجمع والطرح. وإذا تساوت الأسبقية نحسب من اليسار إلى اليمين.',
    voc: [['une expression numérique', 'تعبير عددي'], ['les parenthèses', 'الأقواس'], ['la priorité', 'الأسبقية'], ['de gauche à droite', 'من اليسار إلى اليمين']]
  });
})();
