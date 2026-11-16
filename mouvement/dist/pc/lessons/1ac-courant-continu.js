/* @meta {"id":"1ac-courant-continu","level":"1","order":10,"theme":"Électricité","title":"Le courant électrique continu","ar":"التيار الكهربائي المستمر","lead":"On retourne la pile d'une petite voiture : elle part en marche arrière. Le courant a donc un sens, et une diode le prouve."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T;

  /* boucle : pile à gauche (polarité inversable), récepteur à droite (moteur ou diode), flèches du courant */
  function circuit(svg) {
    var g = S('g', { 'data-keep': 1 }, svg), dyn = S('g', {}, g);
    S('path', { d: 'M60 40 H300 V85 M300 125 V180 H60 V125 M60 85 V40', fill: 'none', stroke: '#e9e9ea', 'stroke-width': 3 }, g);
    g.set = function (inv, rec) { // inv : pile retournée ; rec : 'moteur' ou 'diode'
      while (dyn.firstChild) dyn.removeChild(dyn.firstChild);
      // pile : grand trait = borne +
      var yP = inv ? 112 : 98, yM = inv ? 98 : 112;
      S('line', { x1: 44, y1: yP, x2: 76, y2: yP, stroke: '#e9e9ea', 'stroke-width': 3 }, dyn); S('line', { x1: 52, y1: yM, x2: 68, y2: yM, stroke: '#e9e9ea', 'stroke-width': 6 }, dyn);
      S('path', { d: 'M60 85 V98 M60 112 V125', stroke: '#e9e9ea', 'stroke-width': 3 }, dyn);
      T(dyn, 84, yP + 5, '+', 'lbl', 'start'); T(dyn, 84, yM + 5, '−', 'lbl', 'start'); T(dyn, 30, 108, 'pile', 'tag', 'end');
      var passe = true;
      if (rec === 'moteur') {
        S('circle', { cx: 300, cy: 105, r: 20, fill: '#1d1f23', stroke: '#e9e9ea', 'stroke-width': 3 }, dyn); T(dyn, 300, 110, 'M', 'lbl');
        var fl = S('path', { d: inv ? 'M318 80 a26 26 0 0 0 -36 0' : 'M282 80 a26 26 0 0 1 36 0', fill: 'none', stroke: '#56d07f', 'stroke-width': 3 }, dyn);
        S('path', { d: inv ? 'M282 80 l-2 -9 m2 9 l9 -2' : 'M318 80 l2 -9 m-2 9 l-9 -2', stroke: '#56d07f', 'stroke-width': 3, fill: 'none' }, dyn);
        T(dyn, 330, 110, inv ? 'arrière' : 'avant', 'tag', 'start');
      } else {
        // diode : triangle pointant vers le bas (passante si le courant descend à droite)
        S('path', { d: 'M286 92 H314 L300 116 Z', fill: 'var(--acc)' }, dyn); S('line', { x1: 286, y1: 118, x2: 314, y2: 118, stroke: '#e9e9ea', 'stroke-width': 3 }, dyn);
        S('path', { d: 'M300 85 V92 M300 118 V125', stroke: '#e9e9ea', 'stroke-width': 3 }, dyn); T(dyn, 324, 110, 'diode', 'tag', 'start');
        passe = !inv;
      }
      if (passe) { // flèches du sens conventionnel : de + vers − à l'extérieur de la pile
        S('path', { d: inv ? 'M180 180 l10 -6 m-10 6 l10 6 M180 40 l-10 -6 m10 6 l-10 6' : 'M180 40 l-10 -6 m10 6 l-10 6 M180 180 l10 -6 m-10 6 l10 6', stroke: '#f2c14e', 'stroke-width': 3, fill: 'none' }, dyn);
        T(dyn, 180, 28, 'I', 'lbl');
      } else T(dyn, 180, 120, 'aucun courant', 'lbl acc');
      return passe;
    };
    return g;
  }

  MV.lesson({
    id: '1ac-courant-continu',
    objectif: {
      fr: 'Savoir que le courant électrique a un sens conventionnel, de la borne + vers la borne − à l\'extérieur du générateur, et le mettre en évidence avec un moteur et une diode.',
      ar: 'معرفة أن للتيار الكهربائي منحى اصطلاحيا، من القطب الموجب نحو القطب السالب خارج المولد، وإبرازه بمحرك وصمام ثنائي.'
    },

    ouverture: {
      vb: '0 0 360 210', label: 'La petite voiture',
      hud: [['p', 'pile'], ['m', 'moteur'], ['q', 'pourquoi ?']],
      draw: function (svg) { var e = {}; e.c = circuit(svg); return e; },
      steps: [
        { cap: 'Une petite voiture électrique avance : son **moteur** tourne.', hud: { p: ['normale'], m: ['avant'], q: '–' }, run: function (e) { e.c.set(0, 'moteur'); } },
        { cap: 'On **retourne la pile** : la voiture part en **marche arrière**.', hud: { p: ['retournée'], m: ['arrière'], q: '–' }, run: function (e) { e.c.set(1, 'moteur'); } },
        { cap: 'Que s\'est-il passé dans les fils ? On le saura à la fin.', hud: { p: 'retournée', m: 'arrière', q: ['?'] }, run: function (e) { e.c.set(1, 'moteur'); } }
      ]
    },

    prepare: [
      ['Une pile possède une borne + et une borne −.', true, 'Sur le symbole, le grand trait est la borne +.'],
      ['Une lampe brille même si on retourne la pile.', true, 'La lampe n\'est pas sensible au sens du courant.'],
      ['Le courant ne circule que dans un circuit ouvert.', false, 'Il faut un circuit fermé.']
    ],

    regarde: {
      vb: '0 0 360 210', label: 'Le sens du courant',
      hud: [['r', 'récepteur'], ['s', 'sens du courant'], ['o', 'observation']],
      draw: function (svg) { var e = {}; e.c = circuit(svg); return e; },
      steps: [
        { cap: 'Par **convention**, à l\'extérieur de la pile, le courant va de la borne **+** vers la borne **−**.', ar: 'اصطلاحا، يتجه التيار خارج العمود من القطب الموجب نحو القطب السالب.', hud: { r: 'moteur', s: ['+ → −'], o: 'tourne' }, run: function (e) { e.c.set(0, 'moteur'); } },
        { cap: 'Pile retournée : le courant **change de sens**, le moteur tourne **dans l\'autre sens**.', ar: 'عند قلب العمود يتغير منحى التيار فيدور المحرك في الاتجاه المعاكس.', hud: { r: 'moteur', s: ['inversé'], o: ['sens inversé'] }, run: function (e) { e.c.set(1, 'moteur'); } },
        { cap: 'Une **diode** ne laisse passer le courant que **dans un sens** : le **sens passant**.', ar: 'الصمام الثنائي لا يسمح بمرور التيار إلا في منحى واحد: المنحى المار.', hud: { r: ['diode'], s: '+ → −', o: ['passant'] }, run: function (e) { e.c.set(0, 'diode'); } },
        { cap: 'Dans l\'autre sens, elle **bloque** le courant : **sens bloquant**.', ar: 'في المنحى الآخر يمنع مرور التيار: المنحى المغلق.', hud: { r: 'diode', s: 'inversé', o: ['bloquant'] }, run: function (e) { e.c.set(1, 'diode'); } },
        { cap: 'Une pile fournit un courant **continu** : il circule toujours dans le **même sens**.', ar: 'العمود يزود بتيار مستمر يسري دائما في نفس المنحى.', hud: { r: '–', s: ['toujours le même'], o: ['courant continu'] }, run: function (e) { e.c.set(0, 'diode'); } }
      ]
    },

    faisons: [
      { title: 'Explore', intro: 'Choisis le récepteur et retourne la pile. Trouve le cas où rien ne passe.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 210', role: 'img', 'aria-label': 'Circuit avec pile' }, st);
          var ci = circuit(svg), inv = 0, rec = 'moteur', set = MV.hud(c, [['r', 'récepteur'], ['p', 'pile'], ['o', 'courant', 1]]);
          function upd() { var ok = ci.set(inv, rec); set('r', rec); set('p', inv ? 'retournée' : 'normale'); set('o', ok ? 'passe' : 'bloqué'); if (!ok) done(); }
          var row = MV.H('div', 'row', '', c);
          [['Moteur', 'moteur'], ['Diode', 'diode']].forEach(function (x) { var b = MV.H('button', 'btn', x[0], row); b.onclick = function () { rec = x[1]; upd(); }; });
          var bp = MV.H('button', 'btn', 'Retourner la pile', row); bp.onclick = function () { inv = 1 - inv; upd(); };
          upd();
        } },
      { title: 'Résolvons ensemble', intro: 'Une diode et une lampe sont en série avec une pile ; la lampe est éteinte.',
        build: function (c, MV, done) {
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. La diode est sans doute dans le sens :', o: ['bloquant', 'passant'], a: 0 },
            { type: 'opt', q: 'Étape 2. Pour allumer la lampe, on :', o: ['retourne la pile ou la diode', 'ajoute un fil'], a: 0 },
            { type: 'opt', q: 'Étape 3. Hors de la pile, le courant va :', o: ['de + vers −', 'de − vers +'], a: 0 }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'À l\'extérieur de la pile, le courant va :', o: ['de + vers −', 'de − vers +'], a: 0 },
      { lvl: 'Niveau 2', q: 'Le composant qui laisse passer le courant dans un seul sens est :', o: ['la diode', 'la lampe'], a: 0 },
      { lvl: 'Niveau 3', q: 'On retourne la pile d\'un moteur. Il :', o: ['tourne en sens inverse', 's\'arrête'], a: 0 },
      { lvl: 'Niveau 4', q: 'Une diode en sens bloquant : quelle intensité, en A, traverse le circuit ?', a: 0 }
    ],

    bilan: {
      vb: '0 0 360 210', label: 'La marche arrière',
      hud: [['a', 'avant'], ['r', 'après'], ['e', 'explication']],
      draw: function (svg) { var e = {}; e.c = circuit(svg); return e; },
      steps: [
        { cap: 'Pile normale : le courant va dans un sens, le moteur tourne **vers l\'avant**.', hud: { a: ['+ → − : avant'], r: '–', e: '–' }, run: function (e) { e.c.set(0, 'moteur'); } },
        { cap: 'Pile retournée : le **courant change de sens**, donc le moteur aussi.', ar: 'عند قلب العمود يتغير منحى التيار فيتغير منحى دوران المحرك.', hud: { a: '+ → − : avant', r: ['inversé : arrière'], e: ['le courant a un sens'] }, run: function (e) { e.c.set(1, 'moteur'); } }
      ]
    },

    retenir: [
      'Le courant électrique a un <b>sens conventionnel</b> : à l\'extérieur du générateur, il va de la borne <b>+</b> vers la borne <b>−</b>. Une pile fournit un courant <b>continu</b>.',
      'Une <b>diode</b> laisse passer le courant dans un seul sens (passant) et le bloque dans l\'autre (bloquant). Un moteur change de sens de rotation si le courant change de sens.'
    ],
    retenirAr: 'للتيار الكهربائي منحى اصطلاحي: خارج المولد يتجه من القطب الموجب نحو القطب السالب. العمود يزود بتيار مستمر. الصمام الثنائي يمرر التيار في منحى واحد ويمنعه في المنحى الآخر.',
    voc: [['le sens conventionnel', 'المنحى الاصطلاحي'], ['le courant continu', 'التيار المستمر'], ['une diode', 'صمام ثنائي'], ['passant', 'مار'], ['bloquant', 'مغلق']]
  });
})();
