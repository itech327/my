/* LESSON:BEGIN · Mathématiques 3AC · La racine carrée */
const LESSON = {
  meta: {
    kicker: 'Mathématiques · 3e année collège · Le concept en main',
    title: 'La racine carrée',
    titleAr: 'الجذر المربع',
    short: 'Racine carrée',
    classes: ['3APIC'],
    footer: 'Prototype « Le concept en main » pour taalim.men, hors production. Textes et valeurs originaux. Non relu par un professeur de mathématiques.'
  },

  misconceptions: {
    somme: { fr: "La racine d'une somme n'est pas la somme des racines : √(9 + 16) = √25 = 5, alors que √9 + √16 = 7.", ar: 'جذر المجموع ليس مجموع الجذرين: √(9 + 16) = 5 بينما √9 + √16 = 7.' },
    moitie: { fr: 'La racine carrée n’est pas la moitié : √16 = 4, car 4 × 4 = 16, et non 8.', ar: 'الجذر المربع ليس النصف: √16 = 4 لأن 4 × 4 = 16.' },
    carre: { fr: 'Tu as élevé au carré au lieu de prendre la racine : on cherche le nombre positif dont le carré donne ce nombre.', ar: 'رفعت إلى المربع بدل أخذ الجذر: نبحث عن العدد الموجب الذي مربعه يساوي العدد.' },
    negatif: { fr: 'Une racine carrée est toujours positive : √49 = 7. Le nombre −7 est l’autre solution de x² = 49, mais ce n’est pas √49.', ar: 'الجذر المربع دائما موجب: √49 = 7. العدد −7 حل آخر للمعادلة x² = 49 وليس √49.' },
    simplif: { fr: "En sortant un carré de la racine, on sort sa racine : √50 = √(25 × 2) = 5√2, et non 25√2.", ar: 'عند إخراج مربع من الجذر نخرج جذره: √50 = 5√2 وليس 25√2.' },
    partie: { fr: 'Le nombre devant la racine et le nombre sous la racine ont été inversés.', ar: 'بدّلت العدد خارج الجذر بالعدد تحته.' },
    racine: { fr: 'Il manque la racine carrée à la fin : tu as trouvé le carré de la longueur, pas la longueur.', ar: 'تنقص الجذر المربع في الأخير: وجدت مربع الطول لا الطول.' }
  },

  hook: {
    title: 'Deux carrés, un troisième',
    svg: `<svg class="fig" viewBox="0 0 640 220" role="img" aria-label="Un carré de 9 mètres carrés, un carré de 16 mètres carrés, et un carré de 25 mètres carrés dont le côté est inconnu">
      <rect class="ink" x="40" y="128" width="72" height="72" fill="var(--card)" style="stroke:var(--blue)"/>
      <rect class="ink" x="140" y="104" width="96" height="96" fill="var(--card)" style="stroke:var(--blue)"/>
      <text x="76" y="170" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="22" fill="var(--blue)">9 m²</text>
      <text x="188" y="158" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="22" fill="var(--blue)">16 m²</text>
      <text x="268" y="160" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="30" fill="var(--ink)">+</text>
      <text x="310" y="160" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="30" fill="var(--ink)">=</text>
      <rect class="ink" x="350" y="80" width="120" height="120" fill="var(--card)" style="stroke:var(--heat);stroke-dasharray:8 6"/>
      <text x="410" y="148" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="24" fill="var(--heat-text)">25 m²</text>
      <text x="410" y="70" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="26" fill="var(--heat-text)">côté ?</text>
      <text x="76" y="122" text-anchor="middle" font-family="Kalam" font-size="18" fill="var(--ink)">3 m</text>
      <text x="188" y="98" text-anchor="middle" font-family="Kalam" font-size="18" fill="var(--ink)">4 m</text></svg>`,
    text: "Deux dalles carrées ont des côtés de 3 m et de 4 m, donc des aires de 9 m² et 16 m². On veut une seule dalle carrée de même aire totale : 25 m². Son côté mesure-t-il 3 + 4 = 7 m ?",
    ar: 'بلاطتان مربعتان طول ضلعيهما 3 m و 4 m، ومساحتاهما 9 m² و 16 m². نريد بلاطة مربعة واحدة مساحتها 25 m². هل طول ضلعها 3 + 4 = 7 m؟',
    audio: 'audio/maths-3ac-racine-carree-question.mp3',
    audioText: 'عندنا جوج زلايج مربعين. الأولى ضلعها تلاتة ميترو، والتانية ضلعها ربعة ميترو. بغينا زليجة مربعة وحدة فيها نفس المساحة كاملة، يعني خمسة وعشرين ميترو مربع. واش الضلع ديالها غادي يكون سبعة ميترو، حيت تلاتة زايد ربعة سبعة؟ دير التوقع ديالك.'
  },

  predict: [
    { q: 'Un carré a une aire de 9 + 16 = 25 m². Son côté mesure :', ar: 'مربع مساحته 9 + 16 = 25 m². طول ضلعه:',
      options: [['7 m, car 3 + 4 = 7', 'somme'], ['5 m', ''], ['12,5 m, la moitié de 25', 'moitie']] },
    { q: '√16 est égal à :', ar: '√16 يساوي:',
      options: [['4', ''], ['8', 'moitie'], ['256', 'carre']] }
  ],

  experiment: {
    title: 'Le banc des carrés',
    intro: 'Choisis les aires a et b de deux carrés. Le troisième carré a pour aire a + b. Compare les côtés.',
    html: `<svg class="fig" id="sq" viewBox="0 0 540 230" role="img" aria-label="Deux carrés d'aires a et b, et un troisième carré d'aire a plus b">
      <line class="ink" x1="10" y1="200" x2="2000" y2="200" style="opacity:.4"/>
      <rect id="A" class="ink" fill="var(--card)" style="stroke:var(--blue)"/><rect id="B" class="ink" fill="var(--card)" style="stroke:var(--blue)"/>
      <rect id="C" class="ink" fill="var(--card)" style="stroke:var(--heat)"/>
      <rect id="barS" y="210" height="8" rx="4" fill="var(--blue)"/><rect id="barC" y="222" height="8" rx="4" fill="var(--heat)"/>
      <text id="tA" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="16" fill="var(--blue)"></text>
      <text id="tB" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="16" fill="var(--blue)"></text>
      <text id="tC" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="16" fill="var(--heat-text)"></text></svg>
    <div class="readout">
      <div class="card"><small>√a + √b (côtés mis bout à bout)</small><b id="s" style="color:var(--blue)"></b></div>
      <div class="card"><small>√(a + b) (côté du grand carré)</small><b id="c" style="color:var(--heat-text)"></b></div>
      <div class="card"><small>√a × √b</small><b id="p1"></b></div>
      <div class="card"><small>√(a × b)</small><b id="p2" style="color:var(--glow-text)"></b></div></div>
    <div class="ctl" style="margin-top:10px">
      <div><label for="a">Aire a <span id="ao"></span></label><input id="a" type="range" min="0" max="50" step="1" value="4"></div>
      <div><label for="b">Aire b <span id="bo"></span></label><input id="b" type="range" min="0" max="50" step="1" value="9"></div></div>`,
    missions: [
      { id: 'somme', text: 'Mets a = 9 et b = 16 : compare √a + √b et √(a + b).' },
      { id: 'zero', text: 'Trouve un réglage où √a + √b est égal à √(a + b).' },
      { id: 'produit', text: 'Trouve deux aires dont les racines ne sont pas entières, mais dont le produit a une racine entière (par exemple a = 2).' }
    ],
    required: ['somme'],
    note: 'Côtés calculés à chaque mouvement : √a, √b et √(a + b). Les barres du bas comparent √a + √b (bleu) et √(a + b) (orange). Échelle : 1 m = 20 px.',
    mount(root, api) {
      const $ = s => root.querySelector(s), nf = api.nf, U = 20, BASE = 200, GAP = 18;
      const isSq = n => Number.isInteger(Math.sqrt(n));
      const put = (r, t, x, side, label) => {
        r.setAttribute('x', x); r.setAttribute('y', BASE - side * U); r.setAttribute('width', Math.max(side * U, .01)); r.setAttribute('height', Math.max(side * U, .01));
        r.style.opacity = side > 0 ? 1 : .15; t.setAttribute('x', x + side * U / 2); t.setAttribute('y', Math.max(BASE - side * U - 6, 14)); t.textContent = label;
      };
      const draw = () => {
        const a = +$('#a').value, b = +$('#b').value, ra = Math.sqrt(a), rb = Math.sqrt(b), rc = Math.sqrt(a + b);
        $('#ao').textContent = '= ' + a + ' m²'; $('#bo').textContent = '= ' + b + ' m²';
        const xA = 14, xB = xA + ra * U + GAP / 2, xC = xB + rb * U + GAP * 1.5;
        put($('#A'), $('#tA'), xA, ra, '√a = ' + nf(ra, 2));
        put($('#B'), $('#tB'), xB, rb, '√b = ' + nf(rb, 2));
        put($('#C'), $('#tC'), xC, rc, '√(a+b) = ' + nf(rc, 2));
        $('#barS').setAttribute('x', 14); $('#barS').setAttribute('width', (ra + rb) * U);
        $('#barC').setAttribute('x', 14); $('#barC').setAttribute('width', rc * U);
        const w = Math.max(300, xC + rc * U + 14), top = BASE - Math.max(rc * U, 60) - 30; $('#sq').setAttribute('viewBox', `0 ${top.toFixed(0)} ${w.toFixed(0)} ${(236 - top).toFixed(0)}`);
        $('#s').textContent = nf(ra + rb, 2) + ' m'; $('#c').textContent = nf(rc, 2) + ' m';
        $('#p1').textContent = nf(ra * rb, 2); $('#p2').textContent = nf(Math.sqrt(a * b), 2);
        if (a === 9 && b === 16) api.done('somme');
        if ((a === 0 || b === 0) && a + b > 0) api.done('zero');
        if (a > 0 && b > 0 && !isSq(a) && !isSq(b) && isSq(a * b)) api.done('produit');
      };
      $('#a').addEventListener('input', draw); $('#b').addEventListener('input', draw); draw();
    }
  },

  rule: {
    blocks: [
      { formula: '√a, pour a ≥ 0', text: 'La racine carrée de a est le nombre positif dont le carré est a : (√a)² = a. Exemples : √16 = 4, √2 ≈ 1,41.', ar: 'الجذر المربع لـ a هو العدد الموجب الذي مربعه a.' },
      { formula: '√(a × b) = √a × √b', text: 'Avec a ≥ 0 et b ≥ 0. De même √(a ÷ b) = √a ÷ √b pour b > 0.', ar: 'جذر الجداء يساوي جداء الجذرين، وجذر الخارج يساوي خارج الجذرين.' },
      { formula: '√(a + b) ≠ √a + √b', text: "En général, la racine d'une somme n'est pas la somme des racines. L'égalité n'a lieu que si a = 0 ou b = 0.", ar: 'جذر المجموع لا يساوي في الغالب مجموع الجذرين.' },
      { formula: '√50 = √(25 × 2) = 5√2', text: 'Pour simplifier, on fait apparaître le plus grand carré possible sous la racine, puis on sort sa racine.', ar: 'للتبسيط نُظهر أكبر مربع ممكن تحت الجذر ثم نُخرج جذره.' }
    ],
    seen: 'Bout à bout, les côtés de deux carrés font toujours plus que le côté du carré de même aire totale, sauf si un carré est vide. Pour le produit, au contraire, les racines se multiplient sans perte.',
    audio: 'audio/maths-3ac-racine-carree-regle.mp3',
    audioText: 'الجذر المربع ديال شي عدد هو العدد الموجب اللي إلا ضربناه فراسو كيعطينا داك العدد. مثلا جذر ستاش هو ربعة، حيت ربعة في ربعة ستاش. جذر الجداء كيساوي جداء الجذور. ولكن رد البال: جذر المجموع ماشي هو مجموع الجذور. جذر تسعة زايد ستاش هو خمسة، ماشي سبعة. وباش نبسطو، كنخرجو أكبر مربع من تحت الجذر: جذر خمسين هو خمسة جذر جوج.'
  },

  proof: {
    title: 'Pourquoi le produit marche, et pas la somme ?',
    html: `<p class="hand" style="font-size:20px">(√a × √b)² = (√a)² × (√b)² = a × b</p>
      <p>√a × √b est positif et son carré vaut a × b : c'est donc exactement √(a × b).</p>
      <p class="hand" style="font-size:20px">(√a + √b)² = a + b + 2√a√b</p>
      <p>Le carré de la somme contient un morceau de plus, 2√a√b, comme les deux rectangles d'un carré découpé. Il n'est nul que si a = 0 ou b = 0 : sinon √a + √b est plus grand que √(a + b).</p>`,
    ar: 'جداء الجذرين موجب ومربعه a × b فهو √(a × b). أما مربع المجموع ففيه زيادة 2√a√b، فلا يتساوى المجموع مع جذر المجموع إلا إذا كان أحد العددين صفرا.'
  },

  exercises: {
    levels: [
      { label: 'Niveau 1 · calculer', make(R) {
        let p = R.int(2, 9), q = R.int(2, 9); while (q === p) q = R.int(2, 9);
        const x = p * p, y = q * q;
        return { q: `Calcule √${x} + √${y}.`, unit: '(nombre)', ans: p + q, digits: 2,
          traps: [[Math.sqrt(x + y), 'somme'], [(x + y) / 2, 'moitie']] }; } },
      { label: 'Niveau 2 · simplifier', make(R) {
        for (;;) {
          const a = R.int(2, 9), b = R.pick([2, 3, 5, 6, 7]);
          if (a === b) continue;
          return { q: `Écris √${a * a * b} sous la forme a√b, avec b le plus petit possible. Donne a.`, unit: '(a)', ans: a, digits: 0,
            traps: [[a * a, 'simplif'], [b, 'partie']] };
        } } },
      { label: 'Niveau 3 · Pythagore', make(R) {
        for (;;) {
          const p = R.int(3, 12), q = R.int(3, 12), h = Math.sqrt(p * p + q * q);
          if (p === q) continue;
          return { q: `Un triangle rectangle a des côtés de l'angle droit de ${p} cm et ${q} cm. Calcule la longueur de l'hypoténuse, arrondie au centième.`, unit: 'cm', ans: h, digits: 2,
            traps: [[p + q, 'somme'], [p * p + q * q, 'racine']] };
        } } }
    ]
  },

  check: [
    { q: '√(36 + 64) est égal à :', ar: '√(36 + 64) يساوي:',
      options: [['10', ''], ['14', 'somme'], ['50', 'moitie']] },
    { q: '√49 est égal à :', ar: '√49 يساوي:',
      options: [['7', ''], ['−7 et 7', 'negatif'], ['24,5', 'moitie']] },
    { q: '√72 s’écrit :', ar: '√72 يُكتب:',
      options: [['6√2', ''], ['36√2', 'simplif'], ['2√6', 'partie']] }
  ]
};
/* LESSON:END */
