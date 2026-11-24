/* LESSON:BEGIN · Mathématiques 3AC · Le théorème de Pythagore */
const LESSON = {
  meta: {
    kicker: 'Mathématiques · 3e année collège · Le concept en main',
    title: 'Le théorème de Pythagore',
    titleAr: 'مبرهنة فيثاغورس',
    short: 'Pythagore',
    classes: ['3APIC-1', '3APIC-2', '3APIC-3'],
    footer: 'Prototype « Le concept en main » pour taalim.men, hors production. Textes, valeurs et dessins originaux. Non relu par un professeur de mathématiques.'
  },

  misconceptions: {
    somme: { fr: "Les longueurs ne s'additionnent pas : ce sont les carrés des longueurs qui s'additionnent.", ar: 'الأطوال لا تُجمع، بل مربعات الأطوال هي التي تُجمع.' },
    oubliracine: { fr: 'Tu as trouvé le carré de la longueur, pas la longueur : il faut prendre la racine carrée.', ar: 'وجدت مربع الطول وليس الطول: يجب أخذ الجذر المربع.' },
    double: { fr: "Élever au carré n'est pas multiplier par 2 : 3² = 9, pas 6.", ar: 'المربع ليس الضرب في 2: مربع 3 هو 9 وليس 6.' },
    hypotenuse: { fr: "L'hypoténuse est le plus long côté : pour un côté de l'angle droit, on soustrait, AC² = BC² − AB².", ar: 'الوتر هو أطول ضلع: لحساب ضلع من ضلعي الزاوية القائمة نطرح.' },
    soustraction: { fr: 'On soustrait les carrés, pas les longueurs : AC² = BC² − AB².', ar: 'نطرح المربعات وليس الأطوال.' },
    nonrectangle: { fr: "L'égalité de Pythagore n'est vraie que si le triangle est rectangle.", ar: 'علاقة فيثاغورس لا تصح إلا إذا كان المثلث قائم الزاوية.' },
    jamais: { fr: "Elle est vraie dès que l'angle en A est droit : c'est le théorème de Pythagore.", ar: 'تصح كلما كانت الزاوية في A قائمة: هذه هي مبرهنة فيثاغورس.' }
  },

  hook: {
    title: '40 cm et 30 cm… donc 70 cm ?',
    svg: `<svg class="fig" viewBox="0 0 640 260" role="img" aria-label="Écran de 40 cm sur 30 cm avec sa diagonale">
      <rect class="ink" x="170" y="30" width="300" height="190" rx="10" fill="var(--card)"/>
      <rect class="ink" x="186" y="44" width="268" height="162" rx="4" style="stroke-width:1.4;opacity:.6"/>
      <line class="ink" x1="186" y1="206" x2="454" y2="44" style="stroke:var(--heat);stroke-dasharray:10 8"/>
            <text x="320" y="248" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="20" fill="var(--blue)">40 cm</text>
      <text x="492" y="132" font-family="Kalam" font-weight="700" font-size="20" fill="var(--blue)">30 cm</text>
      <text x="300" y="118" font-family="Kalam" font-weight="700" font-size="30" fill="var(--heat)">?</text></svg>`,
    text: "Un écran mesure 40 cm de large et 30 cm de haut. Sa diagonale mesure-t-elle 40 + 30 = 70 cm ? Plus ? Moins ?",
    ar: 'شاشة عرضها 40 cm وارتفاعها 30 cm. هل طول قطرها 70 cm؟ أكثر أم أقل؟'
  },

  predict: [
    { q: "Un triangle est rectangle. Les deux côtés de l'angle droit mesurent 3 cm et 4 cm. Le troisième côté mesure :", ar: 'مثلث قائم الزاوية، ضلعا الزاوية القائمة 3 cm و 4 cm. طول الضلع الثالث هو:',
      options: [['7 cm', 'somme'], ['5 cm', ''], ['25 cm', 'oubliracine']] },
    { q: "L'égalité BC² = AB² + AC² est vraie :", ar: 'المتساوية BC² = AB² + AC² صحيحة:',
      options: [['dans tous les triangles', 'nonrectangle'], ['seulement si le triangle est rectangle en A', ''], ['dans aucun triangle', 'jamais']] }
  ],

  experiment: {
    title: 'Les trois carrés',
    intro: "Sur chaque côté du triangle, on construit un carré. Change les côtés et l'angle en A, puis compare les aires.",
    html: `<svg class="fig" id="py" viewBox="0 0 640 560" role="img" aria-label="Triangle ABC et les carrés construits sur ses côtés">
      <polygon id="sAB" fill="var(--blue)" fill-opacity=".16" stroke="var(--blue)" stroke-width="2"/>
      <polygon id="sAC" fill="var(--glow)" fill-opacity=".2" stroke="var(--glow)" stroke-width="2"/>
      <polygon id="sBC" fill="var(--heat)" fill-opacity=".14" stroke="var(--heat)" stroke-width="2"/>
      <polygon id="tri" class="ink" fill="var(--card)"/>
      <path id="ra" class="ink" style="stroke-width:1.6"/>
      <text id="tAB" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="20" fill="var(--blue)"></text>
      <text id="tAC" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="20" fill="var(--ink)"></text>
      <text id="tBC" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="20" fill="var(--heat)"></text>
      <text id="lA" font-family="Kalam" font-weight="700" font-size="22" fill="var(--ink)">A</text>
      <text id="lB" font-family="Kalam" font-weight="700" font-size="22" fill="var(--ink)">B</text>
      <text id="lC" font-family="Kalam" font-weight="700" font-size="22" fill="var(--ink)">C</text></svg>
    <div class="readout">
      <div class="card"><small>AB² + AC²</small><b id="xs" style="color:var(--blue)"></b></div>
      <div class="card"><small>BC²</small><b id="xh" style="color:var(--heat)"></b></div>
      <div class="card"><small>Comparaison</small><b id="xc"></b></div>
      <div class="card"><small>BC</small><b id="xb"></b></div></div>
    <div class="ctl">
      <div><label for="ab">AB <span id="oab"></span></label><input id="ab" type="range" min="1" max="8" step="1" value="3"></div>
      <div><label for="ac">AC <span id="oac"></span></label><input id="ac" type="range" min="1" max="8" step="1" value="2"></div>
      <div><label for="an">Angle en A <span id="oan"></span></label><input id="an" type="range" min="60" max="120" step="5" value="90"></div></div>`,
    missions: [
      { id: 'droit', text: 'Avec un angle droit en A, compare AB² + AC² et BC² pour deux triangles différents.' },
      { id: 'pasdroit', text: "Change l'angle en A : l'égalité tient-elle encore ?" },
      { id: 'trois', text: 'Trouve le triangle rectangle où AB = 3 cm, AC = 4 cm. Combien mesure BC ?' }
    ],
    required: ['droit'],
    note: "BC² est calculé à partir des coordonnées des sommets à chaque mouvement. Les aires sont en cm².",
    mount(root, api) {
      const $ = s => root.querySelector(s), nf = api.nf, s = 18, A = { x: 250, y: 370 };
      const rights = new Set();
      const pts = arr => arr.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
      const square = (P, Q, G) => { // square on PQ, on the side away from the triangle's centre G
        let n = { x: Q.y - P.y, y: -(Q.x - P.x) };
        if (n.x * (G.x - P.x) + n.y * (G.y - P.y) > 0) n = { x: -n.x, y: -n.y };
        return [P, Q, { x: Q.x + n.x, y: Q.y + n.y }, { x: P.x + n.x, y: P.y + n.y }];
      };
      const centre = q => ({ x: q.reduce((a, p) => a + p.x, 0) / 4, y: q.reduce((a, p) => a + p.y, 0) / 4 + 7 });
      const draw = () => {
        const ab = +$('#ab').value, ac = +$('#ac').value, an = +$('#an').value, t = an * Math.PI / 180;
        const B = { x: A.x + ab * s, y: A.y }, C = { x: A.x + ac * s * Math.cos(t), y: A.y - ac * s * Math.sin(t) };
        const G = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 };
        const bc2 = ((B.x - C.x) ** 2 + (B.y - C.y) ** 2) / (s * s), sum = ab * ab + ac * ac;
        const qAB = square(A, B, G), qAC = square(A, C, G), qBC = square(B, C, G);
        $('#sAB').setAttribute('points', pts(qAB)); $('#sAC').setAttribute('points', pts(qAC)); $('#sBC').setAttribute('points', pts(qBC));
        $('#tri').setAttribute('points', pts([A, B, C]));
        const place = (id, q, txt) => { const c = centre(q); $(id).setAttribute('x', c.x); $(id).setAttribute('y', c.y); $(id).textContent = txt; };
        place('#tAB', qAB, nf(ab * ab, 0)); place('#tAC', qAC, nf(ac * ac, 0)); place('#tBC', qBC, nf(bc2, 1));
        const lab = (id, P, dx, dy) => { $(id).setAttribute('x', P.x + dx); $(id).setAttribute('y', P.y + dy); };
        lab('#lA', A, -22, 22); lab('#lB', B, 6, 22); lab('#lC', C, -8, -10);
        const k = 14, u = { x: (B.x - A.x) / (ab * s), y: 0 }, w = { x: (C.x - A.x) / (ac * s), y: (C.y - A.y) / (ac * s) };
        $('#ra').setAttribute('d', an === 90 ? `M${A.x + k * u.x} ${A.y} L${A.x + k * u.x + k * w.x} ${A.y + k * w.y} L${A.x + k * w.x} ${A.y + k * w.y}` : '');
        $('#xs').textContent = nf(sum, 1) + ' cm²'; $('#xh').textContent = nf(bc2, 1) + ' cm²'; $('#xb').textContent = nf(Math.sqrt(bc2), 2) + ' cm';
        const eq = Math.abs(bc2 - sum) < 1e-9;
        $('#xc').textContent = eq ? 'égales' : bc2 > sum ? 'BC² plus grand' : 'BC² plus petit'; $('#xc').style.color = eq ? 'var(--ok)' : 'var(--bad)';
        $('#oab').textContent = '= ' + ab + ' cm'; $('#oac').textContent = '= ' + ac + ' cm'; $('#oan').textContent = '= ' + an + '°';
        // frame the figure: fit the drawing with a margin, never smaller than 320 × 280
        const all = [A, B, C, ...qAB, ...qAC, ...qBC], xs = all.map(p => p.x), ys = all.map(p => p.y);
        const bb = { x: Math.min(...xs), y: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) };
        const svg = $('#py'), W = Math.max(bb.width + 60, 320), H = Math.max(bb.height + 60, 280);
        svg.setAttribute('viewBox', `${(bb.x + bb.width / 2 - W / 2).toFixed(0)} ${(bb.y + bb.height / 2 - H / 2).toFixed(0)} ${W.toFixed(0)} ${H.toFixed(0)}`);
        if (an === 90) { rights.add(ab + 'x' + ac); if (rights.size >= 2) api.done('droit'); if ((ab === 3 && ac === 4) || (ab === 4 && ac === 3)) api.done('trois'); }
        else api.done('pasdroit');
      };
      ['#ab', '#ac', '#an'].forEach(id => $(id).addEventListener('input', draw)); draw();
    }
  },

  rule: {
    blocks: [
      { formula: 'BC² = AB² + AC²', text: "Si le triangle ABC est rectangle en A, alors le carré de l'hypoténuse BC est égal à la somme des carrés des deux autres côtés. L'hypoténuse est le côté opposé à l'angle droit : c'est le plus long.", ar: 'إذا كان المثلث ABC قائم الزاوية في A فإن مربع الوتر BC يساوي مجموع مربعي الضلعين الآخرين. الوتر هو الضلع المقابل للزاوية القائمة وهو أطول الأضلاع.' },
      { formula: 'AC² = BC² − AB²', text: "Pour calculer un côté de l'angle droit, on soustrait les carrés. On trouve la longueur avec la racine carrée, à la calculatrice si besoin.", ar: 'لحساب ضلع من ضلعي الزاوية القائمة نطرح المربعات، ثم نأخذ الجذر المربع.' }
    ],
    seen: "avec un angle droit, l'aire du grand carré est exactement la somme des deux autres. Dès que l'angle change, l'égalité disparaît : angle plus grand, BC² plus grand ; angle plus petit, BC² plus petit."
  },

  proof: {
    title: 'Pourquoi ça marche ?',
    html: `<svg class="fig" viewBox="0 0 340 170" role="img" aria-label="Deux carrés de côté a plus b, découpés de deux façons">
      <g transform="translate(10 10)"><rect class="ink" width="140" height="140" fill="var(--card)"/>
        <polygon points="60,0 140,60 80,140 0,80" fill="var(--heat)" fill-opacity=".16" stroke="var(--heat)" stroke-width="2"/>
        <text x="70" y="78" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="20" fill="var(--heat)">c²</text></g>
      <g transform="translate(190 10)"><rect class="ink" width="140" height="140" fill="var(--card)"/>
        <rect width="60" height="60" fill="var(--blue)" fill-opacity=".16" stroke="var(--blue)" stroke-width="2"/>
        <rect x="60" y="60" width="80" height="80" fill="var(--glow)" fill-opacity=".2" stroke="var(--glow)" stroke-width="2"/>
        <path class="ink" d="M60 0 L140 60 M0 60 L60 140" style="stroke-width:1.6"/>
        <text x="30" y="37" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="18" fill="var(--blue)">a²</text>
        <text x="100" y="107" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="18" fill="var(--ink)">b²</text></g></svg>
      <p>Les deux grands carrés ont le même côté a + b. Chacun contient les quatre mêmes triangles rectangles, de côtés a et b et d'hypoténuse c.</p>
      <p>Ce qui reste a donc la même aire : à gauche c², à droite a² + b². Ainsi <b>c² = a² + b²</b>.</p>`,
    ar: 'للمربعين الكبيرين نفس الضلع a + b، وفي كل منهما نفس المثلثات القائمة الأربعة. ما يتبقى له نفس المساحة: c² في اليسار و a² + b² في اليمين.'
  },

  exercises: {
    levels: [
      { label: 'Niveau 1', make(R) { const [a, b, c] = R.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25], [15, 20, 25]]);
        return { q: `Le triangle ABC est rectangle en A, avec AB = ${a} cm et AC = ${b} cm. Calcule BC.`, unit: 'cm', ans: c, digits: 1,
          traps: [[a + b, 'somme'], [c * c, 'oubliracine'], [2 * a + 2 * b, 'double']] }; } },
      { label: 'Niveau 2', make(R) { const [a, b, c] = R.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25]]);
        const [g, x] = R.pick([[a, b], [b, a]]);
        return { q: `Le triangle ABC est rectangle en A, avec BC = ${c} cm et AB = ${g} cm. Calcule AC.`, unit: 'cm', ans: x, digits: 1,
          traps: [[Math.sqrt(c * c + g * g), 'hypotenuse'], [c - g, 'soustraction'], [c * c - g * g, 'oubliracine']] }; } },
      { label: 'Niveau 3', make(R) { const a = R.int(3, 12), b = R.int(3, 12), c = Math.round(Math.sqrt(a * a + b * b) * 10) / 10;
        return { q: `Le triangle ABC est rectangle en A, avec AB = ${a} cm et AC = ${b} cm. Calcule BC à la calculatrice, arrondi au dixième.`, unit: 'cm', ans: c, digits: 1,
          traps: [[a + b, 'somme'], [a * a + b * b, 'oubliracine'], [2 * a + 2 * b, 'double']] }; } }
    ]
  },

  check: [
    { q: "Un triangle est rectangle. Les côtés de l'angle droit mesurent 6 cm et 8 cm. L'hypoténuse mesure :", ar: 'مثلث قائم الزاوية ضلعا زاويته القائمة 6 cm و 8 cm. طول الوتر هو:',
      options: [['14 cm', 'somme'], ['10 cm', ''], ['100 cm', 'oubliracine']] },
    { q: 'Un triangle a des côtés de 5 cm, 6 cm et 7 cm. Peut-on écrire 7² = 5² + 6² ?', ar: 'مثلث أضلاعه 5 cm و 6 cm و 7 cm. هل نكتب 7² = 5² + 6²؟',
      options: [['oui, c’est le théorème de Pythagore', 'nonrectangle'], ['non, car ce triangle n’est pas rectangle', ''], ['oui, car 7 est le plus grand côté', 'nonrectangle']] }
  ]
};
/* LESSON:END */
