/* @meta {"id":"2ac-rationnels-modele","level":"2","order":99,"theme":"Nombres et calcul","title":"Les nombres rationnels (modèle pilote)","ar":"الأعداد الجذرية","lead":"La température baisse de 7 °C en 2 heures : −7/2 par heure. On trouve le signe d'un quotient, on le place sur une droite graduée et on le compare."} */
/* MODÈLE PILOTE du club de révision (2AC, premiers cours) : hors mouvement/lessons, donc jamais publié.
   Cibles : les erreurs fréquentes sur les quotients de relatifs et la comparaison des négatifs. */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, X0 = 180, U = 36; // 0 au centre, 1 unité = 36 px

  function droite(svg, y) {
    var g = S('g', {}, svg);
    S('line', { x1: 10, y1: y, x2: 350, y2: y, stroke: '#9aa0a8', 'stroke-width': 2 }, g);
    for (var k = -4; k <= 4; k++) { S('line', { x1: X0 + k * U, y1: y - 7, x2: X0 + k * U, y2: y + 7, stroke: '#9aa0a8', 'stroke-width': k ? 1.5 : 3 }, g); T(g, X0 + k * U, y + 26, k < 0 ? '−' + (-k) : k, 'lbl'); }
    g.setAttribute('data-keep', 1);
    return g;
  }
  function point(svg, y) {
    var g = S('g', {}, svg);
    S('circle', { cx: 0, cy: y, r: 8, fill: 'var(--acc)', stroke: '#fff', 'stroke-width': 2 }, g);
    var t = T(g, 0, y - 18, '', 'lbl big acc');
    g.style.transition = 'transform .9s ease-in-out';
    g.at = function (v, lab) { g.style.transform = 'translate(' + (X0 + v * U) + 'px,0)'; t.textContent = lab; };
    return g;
  }

  MV.lesson({
    id: '2ac-rationnels-modele',
    objectif: {
      fr: 'Écrire un quotient de deux nombres relatifs, trouver son signe, le placer sur une droite graduée et comparer deux rationnels.',
      ar: 'كتابة خارج عددين نسبيين، وتحديد إشارته، وتمثيله على مستقيم مدرج، ومقارنة عددين جذريين.'
    },

    ouverture: {
      vb: '0 0 360 220', label: 'Une température qui baisse',
      hud: [['d', 'départ'], ['a', 'arrivée'], ['h', 'par heure']],
      draw: function (svg) {
        var e = {};
        S('rect', { x: 166, y: 20, width: 28, height: 170, rx: 14, fill: '#2b2e33', stroke: '#9aa0a8', 'stroke-width': 2 }, svg);
        for (var k = 0; k <= 8; k++) { S('line', { x1: 194, y1: 40 + k * 16, x2: 204, y2: 40 + k * 16, stroke: '#9aa0a8' }, svg); T(svg, 214, 44 + k * 16, 4 - k < 0 ? '−' + (k - 4) : 4 - k, 'tag', 'start'); }
        var m = S('rect', { x: 174, y: 0, width: 12, height: 0, rx: 6, fill: 'var(--acc)' }, svg);
        m.style.transition = 'all 1s'; e.m = m; m.setAttribute('data-keep', 1);
        e.lv = function (t) { var y = 40 + (4 - t) * 16; m.setAttribute('y', y); m.setAttribute('height', 182 - y); };
        T(svg, 90, 60, 'Ifrane, une nuit d\'hiver', 'tag');
        return e;
      },
      steps: [
        { cap: 'À Ifrane, à 20 h, il fait **3 °C**.', ar: 'في إفران، على الساعة الثامنة مساء، الحرارة [[3 °C]].', hud: { d: ['3 °C'], a: '–', h: '–' }, run: function (e) { e.lv(3); } },
        { cap: 'À 22 h, il fait **−4 °C** : la température a baissé de 7 °C en 2 heures.', ar: 'على العاشرة ليلا تصبح [[−4 °C]]: انخفضت 7 درجات في ساعتين.', hud: { d: '3 °C', a: ['−4 °C'], h: '–' }, run: function (e) { e.lv(-4); } },
        { cap: 'Baisse par heure : **−7 ÷ 2**. **Devine** : plus proche de −3 ou de −4 ? On vérifie à la fin.', ar: 'الانخفاض في الساعة هو [[−7 ÷ 2]]. خمّن: هل هو أقرب إلى [[−3]] أم [[−4]]؟', hud: { d: '3 °C', a: '−4 °C', h: ['−7/2 ?'] }, run: function (e) { e.lv(-4); } }
      ]
    },

    // la première affirmation est un pari ; les suivantes testent les prérequis : règle des signes et ordre des négatifs
    prepare: [
      ['Je parie : −7/2 se place entre −4 et −3 sur la droite graduée.', true, '7 moitiés font 3,5 : −3,5 est entre −4 et −3. La scène suivante le montre.'],
      ['(−6) ÷ (−2) = −3', false, 'Même signe : le quotient est positif. (−6) ÷ (−2) = 3.'],
      ['(−6) × 2 = −12', true, 'Signes contraires : le produit est négatif.'],
      ['Sur une droite graduée, −2 est à gauche de −1.', true, 'Plus un nombre est petit, plus il est à gauche.']
    ],

    regarde: {
      vb: '0 0 360 200', label: 'Des quotients sur la droite graduée',
      hud: [['q', 'quotient'], ['s', 'signe'], ['v', 'valeur']],
      draw: function (svg) {
        var e = {}; droite(svg, 120); e.p = point(svg, 120); e.p.setAttribute('data-keep', 1);
        e.p2 = point(svg, 120);
        return e;
      },
      steps: [
        { cap: 'Un **nombre rationnel** s\'écrit a/b, avec a et b relatifs et b ≠ 0.', ar: 'العدد الجذري يكتب على شكل [[a/b]] حيث [[a]] و [[b]] عددان نسبيان و [[b ≠ 0]].', hud: { q: '3/2', s: '+', v: ['1,5'] }, run: function (e) { e.p.at(1.5, '3/2'); } },
        { cap: 'Signes contraires : le quotient est **négatif**. −6/3 = −2.', ar: 'إذا اختلفت الإشارتان فالخارج سالب: [[−6/3 = −2]].', hud: { q: '−6/3', s: ['−'], v: ['−2'] }, run: function (e) { e.p.at(-2, '−6/3'); } },
        { cap: 'Et 6/(−3) = **−2** aussi : le signe moins peut être en haut ou en bas.', ar: 'ونفس الشيء: [[6/(−3) = −6/3 = −2]].', hud: { q: '6/(−3)', s: '−', v: ['−2'] }, run: function (e) { e.p.at(-2, '6/(−3)'); } },
        { cap: 'Même signe : le quotient est **positif**. (−6)/(−3) = 2.', ar: 'إذا تشابهت الإشارتان فالخارج موجب: [[(−6)/(−3) = 2]].', hud: { q: '(−6)/(−3)', s: ['+'], v: ['2'] }, run: function (e) { e.p.at(2, '(−6)/(−3)'); } },
        { cap: '−7/2 : on coupe chaque unité en 2, on compte **7 moitiés** vers la gauche. Ton pari ?', ar: 'لتمثيل [[−7/2]] نقسم الوحدة إلى نصفين ونعد 7 أنصاف نحو اليسار: بين [[−4]] و [[−3]].', hud: { q: '−7/2', s: '−', v: ['−3,5'] }, run: function (e) { e.p.at(-3.5, '−7/2'); } },
        { cap: 'Comme pour les fractions : −2/3 = **−4/6**. Même point de la droite.', ar: 'كما في الكسور: [[−2/3 = −4/6]]، نفس النقطة على المستقيم.', on: ['p2'], hud: { q: '−2/3 = −4/6', s: '−', v: ['≈ −0,67'] }, run: function (e) { e.p.at(-0.667, '−2/3'); e.p2.at(-0.667, ''); } },
        { cap: 'Pour comparer, on regarde la droite : **−7/2 < −1/2**, car −7/2 est plus à gauche.', ar: 'العدد الموجود على اليسار هو الأصغر: [[−7/2 < −1/2]].', on: ['p2'], hud: { q: '−7/2 et −1/2', s: '−', v: ['−3,5 < −0,5'] }, run: function (e) { e.p.at(-3.5, '−7/2'); e.p2.at(-0.5, '−1/2'); } },
        { cap: 'Attention : 3/4 > 1/2, mais pour les négatifs c\'est l\'**inverse** : **−3/4 < −1/2**.', ar: 'انتبه: [[3/4 > 1/2]] لكن عند الأعداد السالبة ينعكس الترتيب: [[−3/4 < −1/2]].', on: ['p2'], hud: { q: '−3/4 et −1/2', s: '−', v: ['−0,75 < −0,5'] }, run: function (e) { e.p.at(-0.75, '−3/4'); e.p2.at(-0.5, '−1/2'); } }
      ]
    },

    faisons: [
      { title: 'J\'explore', intro: 'Change le numérateur a et le dénominateur b. Regarde le signe et la place du point.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 140', role: 'img', 'aria-label': 'Droite graduée' }, st);
          droite(svg, 80); var p = point(svg, 80), a = -7, b = 2, set;
          function upd() { var v = a / b, x = Math.max(-4.6, Math.min(4.6, v)); p.at(x, (a < 0 ? '−' + (-a) : a) + '/' + (b < 0 ? '(−' + (-b) + ')' : b)); if (set) { set('q', a + '/' + b); set('s', v > 0 ? '+' : v < 0 ? '−' : '0'); set('v', MV.fmt(Math.round(v * 100) / 100)); } }
          MV.slider(c, { label: 'a', min: -10, max: 10, value: -7 }, function (v) { a = v; upd(); });
          MV.slider(c, { label: 'b', min: -5, max: 5, value: 2 }, function (v) { b = v === 0 ? 1 : v; upd(); });
          set = MV.hud(c, [['q', 'a/b'], ['s', 'signe', 1], ['v', 'valeur', 1]]);
          MV.H('p', 'small', 'b = 0 est interdit : le curseur prend alors b = 1.', c);
          upd();
          MV.guide(c, [
            { type: 'opt', q: 'Quand a et b ont des signes contraires, a/b est :', shuffle: true,
              o: ['négatif', 'positif', 'égal à 0', 'impossible à dire'], a: 0,
              why: [null, 'C\'est la règle pour deux signes identiques. Avec des signes contraires, le quotient est négatif.', 'Un quotient vaut 0 seulement si le numérateur vaut 0.', 'On peut toujours le dire : c\'est le signe qui se lit sur les signes de a et de b.'],
              e: 'Signes contraires : quotient négatif. Mêmes signes : quotient positif.' },
            { q: 'Pour a = −12 et b = 4, que vaut a/b ?', a: -3, hint: '12 ÷ 4 = 3, et les signes sont contraires.',
              diag: [{ v: 3, msg: 'Tu as oublié le signe. Signes contraires : le quotient est négatif.' }, { v: -48, msg: 'Tu as multiplié. Un quotient est une division : −12 ÷ 4.' }, { v: -8, msg: 'Tu as soustrait (−12 + 4). Un quotient est une division : −12 ÷ 4.' }], ok: '−12/4 = −3.' }
          ], done);
        } },

      { title: 'Je simplifie et je place', intro: 'Simplifie −18/24 puis situe-le sur la droite.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Le signe de −18/24 est :', shuffle: true, o: ['négatif', 'positif', 'nul'], a: 0,
              why: [null, 'Il n\'y a qu\'un seul signe moins : le quotient est négatif.', 'Le numérateur 18 n\'est pas nul : le quotient n\'est pas nul.'], e: 'Un seul signe moins : négatif.' },
            { q: 'Étape 2. On divise 18 et 24 par 6 : −18/24 = ?/4. Écris le numérateur avec son signe.', a: -3, hint: '18 ÷ 6 = 3, et on garde le signe moins.',
              diag: [{ v: 3, msg: 'Tu as perdu le signe moins : −18/24 est négatif, donc −3/4.' }, { v: -6, msg: '6 est le diviseur, pas le résultat. 18 ÷ 6 = 3.' }], ok: '−18/24 = −3/4.' },
            { type: 'opt', q: 'Étape 3. −3/4 = −0,75 se trouve entre :', shuffle: true, o: ['−1 et 0', '0 et 1', '−2 et −1'], a: 0,
              why: [null, 'Ces nombres sont positifs. −0,75 est négatif : il est à gauche de 0.', '−0,75 est plus grand que −1, donc à droite de −1.'], e: '−1 < −0,75 < 0.' }
          ], done);
        } },

      { title: 'Je compare des négatifs', intro: 'Compare −3/4 et −1/2 en mettant les deux au même dénominateur.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: 'Écris −1/2 avec le dénominateur 4 : −1/2 = ?/4.', a: -2, hint: 'Multiplie le haut et le bas par 2.',
              diag: [{ v: 2, msg: 'Tu as perdu le signe moins : −1/2 est négatif, donc −2/4.' }, { v: -1, msg: 'On multiplie le numérateur par 2 aussi, comme le dénominateur : −1 × 2.' }], ok: '−1/2 = −2/4.' },
            { type: 'opt', q: 'Entre −3/4 et −2/4, lequel est le plus à gauche sur la droite ?', shuffle: true, o: ['−3/4', '−2/4', 'ils sont au même endroit'], a: 0,
              why: [null, '−2/4 est plus proche de 0 : il est à droite de −3/4.', 'Ce sont deux points différents : −3/4 = −0,75 et −2/4 = −0,5.'], e: '−0,75 est à gauche de −0,5.' },
            { type: 'opt', q: 'Conclusion :', shuffle: true, o: ['−3/4 < −1/2', '−3/4 > −1/2 car 3 > 1', '−3/4 = −1/2'], a: 0,
              why: [null, '3 > 1 est vrai, mais avec des nombres négatifs l\'ordre s\'inverse : celui qui est le plus loin de 0 est le plus petit.', 'Les deux nombres sont différents : −0,75 et −0,5.'], e: 'Pour les négatifs, le plus éloigné de 0 est le plus petit.' }
          ], done);
        } },

      { title: 'Je lis différentes écritures', intro: 'Un même rationnel peut s\'écrire de plusieurs façons.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { q: '6/(−3) = ?', a: -2, hint: 'Signes contraires : le quotient est négatif. 6 ÷ 3 = 2.',
              diag: [{ v: 2, msg: 'Signes contraires : le quotient est négatif, donc −2.' }, { v: -18, msg: 'Tu as multiplié. Un quotient est une division : 6 ÷ (−3).' }], ok: '6/(−3) = −6/3 = −2.' },
            { type: 'opt', q: 'Laquelle de ces écritures n\'est PAS égale à −2/5 ?', shuffle: true, o: ['2/5', '−2/5', '2/(−5)', '−4/10'], a: 0,
              why: [null, 'C\'est exactement le nombre de l\'énoncé.', '2/(−5) = −2/5 : le signe moins peut être au dénominateur.', '−4/10 = −2/5 : on a multiplié haut et bas par 2.'], e: '2/5 est positif, alors que −2/5 est négatif.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Calcule −15/5.', a: -3, hint: '15 ÷ 5 = 3. Signes contraires.',
        diag: [{ v: 3, msg: 'Tu as oublié le signe. Signes contraires : le quotient est négatif.' }, { v: -75, msg: 'Tu as multiplié. Un quotient est une division : −15 ÷ 5.' }, { v: -10, msg: 'Tu as soustrait (−15 + 5). Un quotient est une division : −15 ÷ 5.' }], ok: '−15/5 = −3.' },
      { lvl: 'Niveau 2', q: 'Le signe de 7/(−2) est :', o: ['négatif', 'positif', 'on ne peut pas savoir'], a: 0, shuffle: true,
        why: [null, 'Le numérateur et le dénominateur ont des signes différents : le quotient est négatif.', 'On peut toujours le savoir : il suffit de comparer les signes de 7 et de −2.'], e: 'Signes contraires : négatif.' },
      { lvl: 'Niveau 3', q: 'Compare −3/4 et −1/2.', o: ['−3/4 < −1/2', '−3/4 > −1/2', 'égaux'], a: 0, shuffle: true,
        why: [null, 'Tu as comparé 3 et 1. Pour des négatifs, l\'ordre s\'inverse : −3/4 = −0,75 est plus à gauche que −0,5.', 'Ce sont deux points différents de la droite : −0,75 et −0,5.'], e: '−0,75 est à gauche de −0,5.' },
      { lvl: 'Niveau 4', q: 'Une citerne perd 9 L en 4 heures. Quelle est sa variation par heure, en litres ? (nombre décimal)', a: -2.25, unit: 'L', hint: 'On divise la variation, −9, par la durée, 4.',
        diag: [{ v: 2.25, msg: 'La citerne perd de l\'eau : la variation est négative, donc −2,25.' }, { v: -0.44, tol: 0.01, msg: 'Tu as divisé 4 par 9. On divise la variation (−9) par la durée (4).' }, { v: -13, msg: 'Tu as additionné (−9 − 4). Par heure : on divise −9 par 4.' }], ok: '−9/4 = −2,25 L par heure.' }
    ],

    bilan: {
      vb: '0 0 360 200', label: 'La baisse par heure',
      hud: [['q', 'quotient'], ['v', 'valeur'], ['s', 'sens']],
      draw: function (svg) { var e = {}; droite(svg, 120); e.p = point(svg, 120); e.p.setAttribute('data-keep', 1); return e; },
      steps: [
        { cap: 'Retour à Ifrane. Baisse de 7 °C en 2 h : **−7/2** °C par heure.', ar: 'نعود إلى إفران: انخفاض [[7 °C]] في ساعتين، أي [[−7/2]] في الساعة.', hud: { q: ['−7/2'], v: '–', s: '–' }, run: function (e) { e.p.at(0, ''); } },
        { cap: '−7/2 = **−3,5** : entre −4 et −3. La température baisse de 3,5 °C par heure.', ar: 'تنخفض الحرارة ب [[3,5 °C]] في كل ساعة: [[−7/2 = −3,5]]. هل كان تخمينك قريبا؟', hud: { q: '−7/2', v: ['−3,5'], s: ['baisse'] }, run: function (e) { e.p.at(-3.5, '−7/2'); } },
        { cap: 'Retiens : signes contraires → négatif, mêmes signes → positif. Et pour les négatifs, le plus loin de 0 est le plus petit.', ar: 'إشارتان مختلفتان: الخارج سالب. إشارتان متشابهتان: موجب. وعند السالبة: الأبعد عن الصفر هو الأصغر.', hud: { q: '−7/2', v: '−3,5', s: 'baisse' }, run: function (e) { e.p.at(-3.5, '−7/2'); } }
      ]
    },

    defi: [
      { q: 'Calcule (−21)/(−7).', a: 3, diag: [{ v: -3, msg: 'Même signe : le quotient est positif.' }, { v: 147, msg: 'Tu as multiplié. Un quotient est une division : (−21) ÷ (−7).' }] },
      { q: 'Une plongeuse descend de 12 m en 5 s. Quelle est sa variation de profondeur par seconde, en mètres ? (décimal)', unit: 'm', a: -2.4, diag: [{ v: 2.4, msg: 'Elle descend : la variation d\'altitude est négative, donc −2,4.' }, { v: -0.42, tol: 0.01, msg: 'Tu as divisé 5 par 12. On divise la variation (−12) par la durée (5).' }, { v: -7, msg: 'Tu as soustrait. Par seconde : on divise −12 par 5.' }] },
      { q: 'Complète : −2/3 = ?/12.', a: -8, diag: [{ v: 8, msg: 'Tu as perdu le signe moins : −2/3 est négatif.' }, { v: -2, msg: 'Le dénominateur a été multiplié par 4 : multiplie aussi le numérateur par 4.' }] }
    ],

    retenir: [
      'Un <b>nombre rationnel</b> s\'écrit a/b avec a et b relatifs, b ≠ 0. Même signe : quotient <b>positif</b> ; signes contraires : quotient <b>négatif</b>.',
      'On ne change pas a/b en multipliant ou en divisant a et b par un même nombre non nul. a/(−b) = −a/b.',
      'Sur la droite graduée, le plus petit est à gauche. Pour deux négatifs, celui qui est le <b>plus loin de 0</b> est le plus petit : −3/4 &lt; −1/2.'
    ],
    retenirAr: 'العدد الجذري يكتب [[a/b]] حيث [[a]] و [[b]] نسبيان و [[b ≠ 0]]. إذا تشابهت إشارتاهما فالخارج موجب، وإذا اختلفتا فهو سالب. عند مقارنة عددين سالبين، الأبعد عن الصفر هو الأصغر: [[−3/4 < −1/2]].',
    voc: [['un nombre rationnel', 'عدد جذري'], ['le quotient', 'الخارج'], ['le numérateur', 'البسط'], ['le dénominateur', 'المقام'], ['le signe', 'الإشارة'], ['la droite graduée', 'المستقيم المدرج']]
  });
})();
