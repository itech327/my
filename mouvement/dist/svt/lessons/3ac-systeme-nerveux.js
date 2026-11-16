/* @meta {"id":"3ac-systeme-nerveux","level":"3","order":7,"theme":"Relation","title":"Le système nerveux","ar":"الجهاز العصبي","lead":"La main touche une casserole brûlante et se retire avant même qu'on sente la douleur. On suit le message nerveux, du doigt au muscle."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;
  var N = { // nœuds du trajet : x, y, nom
    rec: [310, 95, 'récepteur (peau)', 30, -18, 'end'], sens: [220, 105, 'nerf sensitif', 0, 28], moe: [90, 130, 'moelle épinière', 0, 26],
    cer: [90, 40, 'cerveau', 0, -18], mot: [220, 165, 'nerf moteur', -14, 22, 'end'], mus: [310, 175, 'muscle', 0, 26]
  };

  function schema(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), lk = {}, nd = {};
    [['rec', 'sens'], ['sens', 'moe'], ['moe', 'cer'], ['moe', 'mot'], ['mot', 'mus']].forEach(function (p) {
      lk[p.join('-')] = S('line', { x1: N[p[0]][0], y1: N[p[0]][1], x2: N[p[1]][0], y2: N[p[1]][1], stroke: '#5b6068', 'stroke-width': 4 }, g);
    });
    Object.keys(N).forEach(function (k) {
      var n = N[k]; nd[k] = S('circle', { cx: n[0], cy: n[1], r: 11, fill: '#1d1f23', stroke: '#5b6068', 'stroke-width': 2.5 }, g);
      T(g, n[0] + n[3], n[1] + n[4], n[2], 'tag', n[5]);
    });
    g.set = function (on) { // liste de nœuds allumés, dans l'ordre
      on = on || [];
      Object.keys(nd).forEach(function (k) { var a = on.indexOf(k) >= 0; nd[k].setAttribute('stroke', a ? 'var(--acc)' : '#5b6068'); nd[k].setAttribute('fill', a ? 'rgba(86,208,127,.35)' : '#1d1f23'); });
      Object.keys(lk).forEach(function (k) { var p = k.split('-'), a = on.indexOf(p[0]) >= 0 && on.indexOf(p[1]) >= 0; lk[k].setAttribute('stroke', a ? 'var(--acc)' : '#5b6068'); });
    };
    return g;
  }
  var REFLEXE = ['rec', 'sens', 'moe', 'mot', 'mus'];

  MV.lesson({
    id: '3ac-systeme-nerveux',
    objectif: {
      fr: 'Décrire le trajet du message nerveux (récepteur, nerf sensitif, centre nerveux, nerf moteur, effecteur) et distinguer réflexe et mouvement volontaire.',
      ar: 'وصف مسار السيالة العصبية (مستقبل، عصب حسي، مركز عصبي، عصب حركي، منفذ) والتمييز بين المنعكس والحركة الإرادية.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'Une casserole brûlante',
      hud: [['t', 'temps'], ['a', 'action'], ['q', 'qui commande ?']],
      draw: function (svg) { var e = {}; e.s = schema(svg); return e; },
      steps: [
        { cap: 'La main touche par erreur une **casserole brûlante**.', hud: { t: ['0 s'], a: 'contact', q: '–' }, run: function (e) { e.s.set(['rec']); } },
        { cap: 'Elle se **retire** en une fraction de seconde, puis on sent la **douleur**.', hud: { t: ['< 0,1 s'], a: ['retrait'], q: '–' }, run: function (e) { e.s.set(['rec', 'mus']); } },
        { cap: 'Qui a commandé ce retrait si rapide ? On le saura à la fin.', hud: { t: '< 0,1 s', a: 'retrait', q: ['?'] }, run: function (e) { e.s.set(['rec', 'mus']); } }
      ]
    },

    prepare: [
      ['La peau contient des récepteurs sensibles à la chaleur.', true, 'Ils captent la stimulation.'],
      ['Les muscles se contractent sans recevoir de message.', false, 'Ils obéissent à un message nerveux.'],
      ['La moelle épinière est protégée par la colonne vertébrale.', true, 'Elle se trouve dans le canal des vertèbres.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Le trajet du message nerveux',
      hud: [['o', 'organe'], ['r', 'rôle'], ['m', 'message']],
      draw: function (svg) { var e = {}; e.s = schema(svg); return e; },
      steps: [
        { cap: 'Le **récepteur** de la peau capte la chaleur et crée un **message nerveux**.', ar: 'المستقبل في الجلد يلتقط الحرارة وينشئ سيالة عصبية.', hud: { o: ['récepteur'], r: 'capter', m: 'naît' }, run: function (e) { e.s.set(['rec']); } },
        { cap: 'Le **nerf sensitif** conduit le message vers un **centre nerveux**.', ar: 'العصب الحسي ينقل السيالة نحو مركز عصبي.', hud: { o: ['nerf sensitif'], r: 'conduire', m: 'monte' }, run: function (e) { e.s.set(['rec', 'sens']); } },
        { cap: 'Pour un **réflexe**, le centre est la **moelle épinière** : elle répond tout de suite.', ar: 'في المنعكس يكون المركز هو النخاع الشوكي فيستجيب فورا.', hud: { o: ['moelle épinière'], r: ['centre du réflexe'], m: 'traité' }, run: function (e) { e.s.set(['rec', 'sens', 'moe']); } },
        { cap: 'Le **nerf moteur** porte la réponse au **muscle**, qui se contracte : la main se retire.', ar: 'العصب الحركي ينقل الأمر إلى العضلة فتتقلص وتنسحب اليد.', hud: { o: ['nerf moteur, muscle'], r: 'agir', m: ['descend'] }, run: function (e) { e.s.set(REFLEXE); } },
        { cap: 'Le message monte aussi au **cerveau** : on **sent** la douleur, un peu après.', ar: 'تصعد السيالة أيضا إلى الدماغ فنحس بالألم بعد ذلك بقليل.', hud: { o: ['cerveau'], r: 'sensation consciente', m: 'plus tard' }, run: function (e) { e.s.set(REFLEXE.concat(['cer'])); } },
        { cap: 'Un mouvement **volontaire** (prendre un verre) est commandé par le **cerveau**.', ar: 'الحركة الإرادية يتحكم فيها الدماغ.', hud: { o: 'cerveau', r: ['mouvement volontaire'], m: 'cerveau → muscle' }, run: function (e) { e.s.set(['cer', 'moe', 'mot', 'mus']); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Allume le trajet du réflexe, étape par étape.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Trajet nerveux' }, st);
          var s = schema(svg), set = MV.hud(c, [['o', 'organe'], ['n', 'étape', 1]]);
          MV.slider(c, { label: 'étape', min: 0, max: 5, value: 0 }, function (k) { s.set(REFLEXE.slice(0, k)); set('n', k + ' / 5'); set('o', k ? N[REFLEXE[k - 1]][2] : '–'); if (k === 5) done(); });
          c.querySelector('input[type=range]').dispatchEvent(new Event('input'));
        } },
      { title: 'Résolvons ensemble', intro: 'Le message nerveux va à environ 50 m/s dans ces nerfs. Trajet doigt, moelle, muscle : 1,5 m.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Le centre nerveux de ce réflexe est :', o: ['la moelle épinière', 'le cerveau'], a: 0 },
            { q: 'Étape 2. Durée du trajet : 1,5 ÷ 50 = ? s', a: 0.03 },
            { q: 'Étape 3. En millisecondes (1 s = 1 000 ms) ?', a: 30 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'Le nerf qui conduit le message vers le centre nerveux est :', o: ['sensitif', 'moteur'], a: 0 },
      { lvl: 'Niveau 2', q: 'L\'organe qui exécute la réponse est :', o: ['le muscle', 'le récepteur'], a: 0 },
      { lvl: 'Niveau 3', q: 'Écrire une lettre est un mouvement commandé par :', o: ['le cerveau', 'la moelle épinière seule'], a: 0 },
      { lvl: 'Niveau 4', q: 'Combien d\'éléments dans le trajet du réflexe (récepteur, nerfs, centre, muscle) ?', a: 5 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'Le retrait de la main',
      hud: [['c', 'centre'], ['t', 'trajet'], ['d', 'douleur']],
      draw: function (svg) { var e = {}; e.s = schema(svg); return e; },
      steps: [
        { cap: 'C\'est un **réflexe** : la **moelle épinière** commande, sans attendre le cerveau.', hud: { c: ['moelle épinière'], t: ['court'], d: '–' }, run: function (e) { e.s.set(REFLEXE); } },
        { cap: 'Le cerveau reçoit le message ensuite : la **douleur** arrive après le geste.', ar: 'سحب اليد منعكس يتحكم فيه النخاع الشوكي، ثم يصل الإحساس بالألم إلى الدماغ.', hud: { c: 'moelle épinière', t: 'court', d: ['après le geste'] }, run: function (e) { e.s.set(REFLEXE.concat(['cer'])); } }
      ]
    },

    retenir: [
      'Trajet du message nerveux : <b>récepteur</b> → <b>nerf sensitif</b> → <b>centre nerveux</b> → <b>nerf moteur</b> → <b>muscle</b> (effecteur).',
      'Un <b>réflexe</b> est rapide et involontaire, commandé par la <b>moelle épinière</b>. Un mouvement <b>volontaire</b> et la sensation consciente dépendent du <b>cerveau</b>.'
    ],
    retenirAr: 'مسار السيالة العصبية: مستقبل، ثم عصب حسي، ثم مركز عصبي، ثم عصب حركي، ثم عضلة. المنعكس سريع ولاإرادي ويتحكم فيه النخاع الشوكي، أما الحركة الإرادية والإحساس الواعي فمن الدماغ.',
    voc: [['un récepteur', 'مستقبل'], ['le nerf sensitif', 'العصب الحسي'], ['le nerf moteur', 'العصب الحركي'], ['la moelle épinière', 'النخاع الشوكي'], ['un réflexe', 'منعكس']]
  });
})();
