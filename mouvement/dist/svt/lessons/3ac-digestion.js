/* @meta {"id":"3ac-digestion","level":"3","order":1,"theme":"Nutrition","title":"La digestion et l'absorption","ar":"الهضم والامتصاص","lead":"Une bouchée de pain traverse le tube digestif : l'amidon est coupé en glucose, qui passe dans le sang."} */
(function () {
  'use strict';
  var S = MV.S, T = MV.T, SANG = '#c95a5a';

  /* tube digestif simplifié, à gauche de la scène */
  function tube(svg, small) {
    var g = S('g', { fill: 'none', stroke: '#8b8f96', 'stroke-width': small ? 5 : 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg), z = {};
    S('path', { d: 'M100 30 V112' }, g);                                   // bouche + œsophage
    z.estomac = S('ellipse', { cx: 124, cy: 132, rx: 30, ry: 20 }, g);      // estomac
    z.grele = S('path', { d: 'M126 152 v10 h-40 v14 h70 v14 h-70 v14 h70 v14 h-70 v14 h40' }, g);   // intestin grêle
    z.gros = S('path', { d: 'M80 262 H62 V176 H170 V262 H130 V290' }, g);   // gros intestin
    z.bouche = S('circle', { cx: 100, cy: 30, r: 9 }, g);
    return z;
  }
  var POS = { bouche: [100, 30], estomac: [124, 132], grele: [116, 205], gros: [130, 288] };

  MV.lesson({
    id: '3ac-digestion',
    objectif: {
      fr: 'Expliquer comment la digestion transforme les aliments en nutriments qui passent dans le sang.',
      ar: 'تفسير كيف يحول الهضم الأغذية إلى مغذيات تمر إلى الدم.'
    },

    ouverture: {
      vb: '0 0 360 260', label: 'Du pain au muscle',
      hud: [['a', 'aliment'], ['m', 'utilisé par'], ['c', 'comment ?']],
      draw: function (svg) {
        var e = {};
        e.pain = S('g', {}, svg);
        S('path', { d: 'M30 150 q0 -50 55 -50 q55 0 55 50 v20 h-110 z', fill: '#c9a35a', stroke: '#e0c27f', 'stroke-width': 2 }, e.pain);
        T(e.pain, 85, 196, 'pain', 'lbl');
        e.muscle = S('g', {}, svg);
        S('ellipse', { cx: 285, cy: 140, rx: 48, ry: 26, fill: '#a8584f', stroke: '#d07a70', 'stroke-width': 2 }, e.muscle);
        S('path', { d: 'M237 140 h-14 M333 140 h14', stroke: '#cfd3d8', 'stroke-width': 4 }, e.muscle);
        T(e.muscle, 285, 196, 'muscle', 'lbl');
        e.mur = S('g', {}, svg);
        S('line', { x1: 180, y1: 90, x2: 180, y2: 190, stroke: '#9aa0a8', 'stroke-width': 3, 'stroke-dasharray': '3 6' }, e.mur);
        T(e.mur, 180, 80, 'paroi de l\'intestin', 'tag');
        e.q = S('g', {}, svg);
        S('path', { d: 'M140 130 C 175 60, 200 60, 232 125', fill: 'none', stroke: 'var(--acc)', 'stroke-width': 3, 'stroke-dasharray': '7 6' }, e.q);
        T(e.q, 186, 55, '?', 'lbl big acc');
        return e;
      },
      steps: [
        { cap: 'Au petit-déjeuner, tu manges du **pain**.', on: ['pain'], hud: { a: ['pain'], m: '–', c: '–' } },
        { cap: 'Deux heures plus tard, tes **muscles** utilisent son énergie.', on: ['pain', 'muscle'], hud: { a: 'pain', m: ['muscle'], c: '–' } },
        { cap: 'Mais un morceau de pain ne peut pas **traverser** la paroi de l\'intestin.', on: ['pain', 'muscle', 'mur'], hud: { a: 'pain', m: 'muscle', c: '–' } },
        { cap: 'Comment arrive-t-il **jusqu\'au muscle** ? On le saura à la fin.', on: ['pain', 'muscle', 'mur', 'q'], hud: { a: 'pain', m: 'muscle', c: ['?'] } }
      ]
    },

    prepare: [
      ['Le pain contient de l\'amidon.', true, 'L\'amidon est le principal constituant de la farine.'],
      ['Les aliments passent dans le sang dès la bouche, sans transformation.', false, 'Ils doivent d\'abord être transformés en très petites molécules.'],
      ['Le sang circule dans tout le corps, jusqu\'aux muscles.', true, 'Il transporte ce dont les organes ont besoin.']
    ],

    regarde: {
      vb: '0 0 360 320', label: 'La bouchée traverse le tube digestif',
      hud: [['o', 'organe'], ['d', 'digestion'], ['m', 'molécule']],
      draw: function (svg) {
        var z = tube(svg), e = {};
        e.estomac = z.estomac; e.grele = z.grele; e.gros = z.gros; e.bouche = z.bouche;
        ['estomac', 'grele', 'gros', 'bouche'].forEach(function (n) { e[n].style.opacity = 1; });
        // bouchée
        var b = S('circle', { cx: 0, cy: 0, r: 9, fill: 'var(--acc)' }, svg);
        b.style.cssText = 'transition:transform 1.1s ease-in-out;transform-box:view-box';
        e.bol = b; e.bol.go = function (k) { var p = POS[k]; b.style.transform = 'translate(' + p[0] + 'px,' + p[1] + 'px)'; };
        // encart des molécules
        e.encart = S('g', {}, svg);
        S('rect', { x: 196, y: 24, width: 156, height: 276, rx: 12, fill: '#17181a', stroke: '#2c2f34' }, e.encart);
        e.nom = T(e.encart, 274, 48, 'amidon', 'lbl');
        e.chaine = S('g', {}, svg);
        var beads = [], links = [];
        for (var i = 0; i < 5; i++) links.push(S('line', { x1: 220 + i * 26, y1: 90, x2: 246 + i * 26, y2: 90, stroke: '#cfd3d8', 'stroke-width': 3 }, e.chaine));
        for (i = 0; i < 6; i++) {
          var c = S('circle', { cx: 0, cy: 0, r: 8, fill: 'var(--acc)' }, e.chaine);
          c.style.cssText = 'transition:transform 1s ease-in-out;transform-box:view-box;transition-delay:' + (i * 60) + 'ms';
          beads.push(c);
        }
        e.paroi = S('g', {}, svg);
        S('rect', { x: 206, y: 150, width: 136, height: 16, fill: '#3b3e44' }, e.paroi);
        for (i = 0; i < 6; i++) S('rect', { x: 214 + i * 22, y: 150, width: 8, height: 16, fill: '#17181a' }, e.paroi);
        T(e.paroi, 274, 182, 'paroi de l\'intestin grêle', 'tag');
        S('rect', { x: 206, y: 226, width: 136, height: 40, rx: 20, fill: 'none', stroke: SANG, 'stroke-width': 3 }, e.paroi);
        T(e.paroi, 274, 286, 'vaisseau sanguin', 'tag');
        e.chaine.state = function (s) {
          // s : 0 chaîne, 1 coupée, 2 dans le sang
          beads.forEach(function (c, i) {
            var x = s === 0 ? 220 + i * 26 : 218 + i * 22 + 4, y = s === 2 ? 246 : (s === 1 ? 110 : 90);
            if (s === 1) x = 210 + i * 26;
            c.style.transform = 'translate(' + x + 'px,' + y + 'px)';
          });
          links.forEach(function (l) { l.style.opacity = s === 0 ? 1 : 0; l.style.transition = 'opacity .4s'; });
          e.nom.textContent = s === 0 ? 'amidon' : 'glucose';
        };
        e.chaine.state(0);
        return e;
      },
      steps: [
        { cap: 'Le **tube digestif** va de la bouche à l\'anus.', ar: 'الأنبوب الهضمي يمتد من الفم إلى الشرج.', on: ['bouche', 'estomac', 'grele', 'gros'], hud: { o: '–', d: '–', m: '–' }, run: function (e) { e.bol.go('bouche'); e.chaine.state(0); e.bol.style.opacity = 0; } },
        { cap: 'Dans la **bouche**, on mâche. La salive commence à couper l\'amidon.', ar: 'في الفم نمضغ الطعام، واللعاب يبدأ تفكيك النشا.', on: ['bouche', 'estomac', 'grele', 'gros', 'bol', 'encart', 'chaine'], hot: ['bouche'], hud: { o: ['bouche'], d: 'mécanique', m: 'amidon' }, run: function (e) { e.bol.go('bouche'); e.chaine.state(0); } },
        { cap: 'L\'**estomac** brasse la bouchée et continue la digestion.', ar: 'المعدة تخلط الطعام وتواصل الهضم.', on: ['bouche', 'estomac', 'grele', 'gros', 'bol', 'encart', 'chaine'], hud: { o: ['estomac'], d: 'brassage', m: 'amidon' }, run: function (e) { e.bol.go('estomac'); e.chaine.state(0); } },
        { cap: 'Dans l\'**intestin grêle**, les enzymes coupent l\'amidon en **glucose**.', ar: 'في المعي الدقيق تفكك الأنزيمات النشا إلى كليكوز.', on: ['bouche', 'estomac', 'grele', 'gros', 'bol', 'encart', 'chaine'], hud: { o: ['intestin grêle'], d: ['chimique'], m: ['glucose'] }, run: function (e) { e.bol.go('grele'); e.chaine.state(1); } },
        { cap: 'Petit, le glucose **traverse la paroi** et passe dans le **sang**.', ar: 'الكليكوز صغير، فيعبر جدار المعي ويمر إلى الدم: هذا هو الامتصاص.', on: ['bouche', 'estomac', 'grele', 'gros', 'bol', 'encart', 'chaine', 'paroi'], hud: { o: 'intestin grêle', d: ['absorption'], m: 'glucose' }, run: function (e) { e.bol.go('grele'); e.chaine.state(2); } },
        { cap: 'Ce qui n\'est pas digéré continue vers le **gros intestin**.', ar: 'ما لم يهضم يتابع طريقه نحو المعي الغليظ.', on: ['bouche', 'estomac', 'grele', 'gros', 'bol'], hud: { o: ['gros intestin'], d: '–', m: 'restes' }, run: function (e) { e.bol.go('gros'); e.chaine.state(2); } }
      ]
    },

    faisons: [
      { title: 'Coupe et fais passer', intro: 'Touche un lien pour le couper, comme une enzyme. Puis essaie de faire passer les morceaux à travers la paroi.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '0 0 360 230', role: 'img', 'aria-label': 'Molécule d\'amidon à couper' }, st);
          S('rect', { x: 20, y: 120, width: 320, height: 16, fill: '#3b3e44' }, svg);
          for (var p = 0; p < 6; p++) S('rect', { x: 46 + p * 52, y: 120, width: 10, height: 16, fill: '#17181a' }, svg);
          T(svg, 340, 152, 'paroi', 'tag', 'end');
          S('rect', { x: 20, y: 178, width: 320, height: 36, rx: 18, fill: 'none', stroke: SANG, 'stroke-width': 3 }, svg);
          T(svg, 340, 228, 'sang', 'tag', 'end');
          var N = 6, cut = [false, false, false, false, false], beads = [], links = [], X = function (i) { return 51 + i * 52; };
          for (var i = 0; i < N - 1; i++) {
            (function (i) {
              var l = S('line', { x1: X(i), y1: 70, x2: X(i + 1), y2: 70, stroke: '#cfd3d8', 'stroke-width': 4 }, svg);
              var h = S('rect', { x: X(i) + 10, y: 52, width: 32, height: 36, fill: 'transparent', tabindex: 0, role: 'button', 'aria-label': 'Couper le lien ' + (i + 1) }, svg);
              h.style.cursor = 'pointer';
              function snip() { if (cut[i]) return; cut[i] = true; l.style.opacity = 0; l.style.transition = 'opacity .3s'; upd(); }
              h.addEventListener('click', snip); h.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); snip(); } });
              links.push(l);
            })(i);
          }
          for (i = 0; i < N; i++) {
            var b = S('circle', { cx: 0, cy: 0, r: 10, fill: 'var(--acc)' }, svg);
            b.style.cssText = 'transition:transform .8s cubic-bezier(.5,.1,.3,1);transform-box:view-box;transform:translate(' + X(i) + 'px,70px)';
            beads.push(b);
          }
          var set = MV.hud(c, [['m', 'morceaux'], ['g', 'glucose seul', 1], ['s', 'dans le sang', 1]]);
          var fb = MV.H('div', 'fb', '', c), row = MV.H('div', 'row', '', c);
          var go = MV.H('button', 'btn pri', 'Faire passer', row), again = MV.H('button', 'btn', 'Recommencer', row);
          function pieces() { var out = [], cur = [0]; for (var i = 1; i < N; i++) { if (cut[i - 1]) { out.push(cur); cur = [i]; } else cur.push(i); } out.push(cur); return out; }
          function upd() { var ps = pieces(); set('m', ps.length); set('g', ps.filter(function (x) { return x.length === 1; }).length); set('s', '0'); }
          go.onclick = function () {
            var n = 0;
            pieces().forEach(function (pc) {
              pc.forEach(function (i) {
                beads[i].style.transform = pc.length === 1 ? 'translate(' + X(i) + 'px,196px)' : 'translate(' + X(i) + 'px,104px)';
                if (pc.length > 1) setTimeout(function () { beads[i].style.transform = 'translate(' + X(i) + 'px,70px)'; }, 800);
              });
              if (pc.length === 1) n++;
            });
            set('s', n);
            if (n === N) { fb.className = 'fb ok'; fb.textContent = 'Bravo : toutes les molécules sont devenues assez petites pour passer dans le sang.'; done(); go.disabled = true; }
            else { fb.className = 'fb ko'; fb.textContent = n + ' sur 6 passent. Les morceaux encore liés sont trop gros : coupe tous les liens.'; }
          };
          again.onclick = function () {
            for (var i = 0; i < N - 1; i++) { cut[i] = false; links[i].style.opacity = 1; }
            beads.forEach(function (b, i) { b.style.transform = 'translate(' + X(i) + 'px,70px)'; });
            go.disabled = false; fb.textContent = ''; upd();
          };
          upd();
        } },
      { title: 'Résolvons ensemble', intro: 'Retrouve les étapes sur le schéma du tube digestif.',
        build: function (c, MV, done) {
          var st = MV.H('div', 'stage', '', c), svg = S('svg', { viewBox: '30 10 170 300', role: 'img', 'aria-label': 'Schéma du tube digestif' }, st);
          st.style.maxWidth = '240px'; st.style.margin = '0 auto';
          var z = tube(svg, true);
          function hit(el) { el.setAttribute('pointer-events', 'stroke'); el.setAttribute('stroke-width', 12); el.style.stroke = '#8b8f96'; return el; }
          var tg = { bouche: hit(z.bouche), estomac: hit(z.estomac), 'intestin grêle': hit(z.grele), 'gros intestin': hit(z.gros) };
          Object.keys(tg).forEach(function (k) { tg[k].style.strokeOpacity = 0.55; });
          MV.guide(c, [
            { type: 'opt', q: 'Étape 1. Où commence la digestion de l\'amidon ?', o: ['Dans l\'estomac', 'Dans la bouche', 'Dans le gros intestin'], a: 1, e: 'La salive commence à couper l\'amidon.' },
            { type: 'tap', q: 'Étape 2. Touche l\'organe où le glucose passe dans le sang.', targets: tg, good: 'intestin grêle', ok: 'C\'est dans l\'intestin grêle que se fait l\'absorption.', ko: 'Pas ici. Cherche le long tube replié, après l\'estomac.', onGood: function () { tg['intestin grêle'].style.stroke = 'var(--acc)'; tg['intestin grêle'].style.strokeOpacity = 1; } },
            { type: 'opt', q: 'Étape 3. Pourquoi le glucose peut-il traverser la paroi ?', o: ['Parce qu\'il est très petit', 'Parce qu\'il est sucré', 'Parce que la paroi est déchirée'], a: 0, e: 'Seules les petites molécules, les nutriments, traversent la paroi.' }
          ], done);
        } }
    ],

    seul: [
      { lvl: 'Niveau 1', q: 'La digestion de l\'amidon donne :', o: ['du glucose', 'des acides aminés', 'des acides gras'], a: 0, e: 'Amidon → glucose.' },
      { lvl: 'Niveau 2', q: 'Le rôle des enzymes digestives est de :', o: ['écraser les aliments', 'couper les grosses molécules en petites', 'transporter les nutriments dans le sang'], a: 1, e: 'Elles réalisent la digestion chimique.' },
      { lvl: 'Niveau 3', q: 'L\'absorption intestinale, c\'est :', o: ['le passage des nutriments de l\'intestin grêle vers le sang', 'le mélange des aliments dans l\'estomac', 'la sortie des restes non digérés'], a: 0, e: 'Elle se fait à travers la paroi de l\'intestin grêle.' },
      { lvl: 'Niveau 4', q: 'Après un repas riche en pain, où trouve-t-on le plus de glucose ?', o: ['Dans le sang qui sort de l\'intestin grêle', 'Dans le sang qui arrive à l\'intestin grêle', 'Dans l\'œsophage'], a: 0, e: 'Le sang se charge en glucose en passant le long de l\'intestin grêle.' }
    ],

    bilan: {
      vb: '0 0 360 240', label: 'Du pain au muscle, réponse',
      hud: [['a', 'molécule'], ['o', 'lieu'], ['f', 'arrive au']],
      draw: function (svg) {
        var e = {};
        S('path', { d: 'M14 130 q0 -40 40 -40 q40 0 40 40 v14 h-80 z', fill: '#c9a35a' }, svg); T(svg, 54, 170, 'pain', 'tag');
        S('ellipse', { cx: 310, cy: 120, rx: 38, ry: 22, fill: '#a8584f' }, svg); T(svg, 310, 170, 'muscle', 'tag');
        e.amidon = S('g', {}, svg);
        for (var i = 0; i < 4; i++) S('circle', { cx: 112 + i * 14, cy: 70, r: 6, fill: 'var(--acc)' }, e.amidon);
        S('line', { x1: 112, y1: 70, x2: 154, y2: 70, stroke: '#cfd3d8', 'stroke-width': 2 }, e.amidon);
        T(e.amidon, 133, 56, 'amidon', 'tag');
        e.glucose = S('g', {}, svg);
        for (i = 0; i < 4; i++) S('circle', { cx: 112 + i * 18, cy: 110, r: 6, fill: 'var(--acc)' }, e.glucose);
        T(e.glucose, 140, 134, 'glucose', 'tag');
        e.sang = S('g', {}, svg);
        S('path', { d: 'M100 200 H270', stroke: SANG, 'stroke-width': 14, 'stroke-linecap': 'round', fill: 'none' }, e.sang);
        T(e.sang, 185, 228, 'sang', 'tag');
        e.trajet = S('path', { d: 'M150 120 C 160 190, 250 210, 300 142', fill: 'none', stroke: 'var(--acc)', 'stroke-width': 3, 'stroke-dasharray': '7 6' }, svg);
        return e;
      },
      steps: [
        { cap: 'Le pain contient de l\'**amidon**, une grosse molécule.', on: ['amidon'], hud: { a: ['amidon'], o: 'bouche', f: '–' } },
        { cap: 'La digestion le coupe en **glucose**, une petite molécule.', ar: 'الهضم يفكك النشا إلى كليكوز.', on: ['amidon', 'glucose'], hud: { a: ['glucose'], o: 'intestin grêle', f: '–' } },
        { cap: 'Le glucose passe dans le **sang** à travers l\'intestin grêle.', ar: 'يمر الكليكوز إلى الدم عبر جدار المعي الدقيق.', on: ['glucose', 'sang'], hud: { a: 'glucose', o: ['sang'], f: '–' } },
        { cap: 'Le sang le transporte jusqu\'au **muscle**, qui l\'utilise.', ar: 'ينقله الدم إلى العضلة التي تستعمله لإنتاج الطاقة.', on: ['glucose', 'sang', 'trajet'], hud: { a: 'glucose', o: 'sang', f: ['muscle'] } }
      ]
    },

    retenir: [
      'La <b>digestion</b> transforme les aliments en <b>nutriments</b> grâce à une action mécanique et à l\'action chimique des <b>enzymes</b>. Exemple : amidon → glucose.',
      'L\'<b>absorption intestinale</b> est le passage des nutriments à travers la paroi de l\'intestin grêle vers le sang.'
    ],
    retenirAr: 'الهضم يحول الأغذية إلى مغذيات بفعل ميكانيكي وبفعل كيميائي للأنزيمات. الامتصاص المعوي هو مرور المغذيات عبر جدار المعي الدقيق إلى الدم.',
    voc: [['le tube digestif', 'الأنبوب الهضمي'], ['une enzyme digestive', 'أنزيم هضمي'], ['un nutriment', 'مغذ'], ['l\'amidon', 'النشا'], ['le glucose', 'الكليكوز'], ['l\'intestin grêle', 'المعي الدقيق'], ['l\'absorption intestinale', 'الامتصاص المعوي']]
  });
})();
