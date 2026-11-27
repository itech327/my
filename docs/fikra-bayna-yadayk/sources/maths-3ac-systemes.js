/* LESSON:BEGIN · Mathématiques 3AC · Systèmes de deux équations du premier degré à deux inconnues */
const LESSON = {
  meta: {
    kicker: 'Mathématiques · 3e année collège · Le concept en main',
    title: 'Les systèmes de deux équations à deux inconnues',
    titleAr: 'نظمة معادلتين من الدرجة الأولى بمجهولين',
    short: 'Systèmes 2×2',
    classes: ['3APIC-1', '3APIC-2', '3APIC-3'],
    footer: 'Prototype « Le concept en main » pour taalim.men, hors production. Textes et valeurs originaux. Non relu par un professeur de mathématiques.'
  },

  misconceptions: {
    unique: { fr: "Une seule équation à deux inconnues ne suffit pas : beaucoup de couples (x ; y) la vérifient. Il en faut une deuxième.", ar: 'معادلة واحدة بمجهولين لا تكفي: أزواج كثيرة تحققها، ونحتاج معادلة ثانية.' },
    aucun: { fr: "Une équation à deux inconnues a toujours des solutions : choisis une valeur de x, tu trouves la valeur de y qui va avec.", ar: 'المعادلة بمجهولين لها دائما حلول: اختر قيمة لـ x تجد قيمة y المناسبة.' },
    toujours: { fr: "Un système n'a pas toujours une solution : si les deux droites sont parallèles, elles ne se coupent jamais.", ar: 'النظمة ليس لها دائما حل: إذا كان المستقيمان متوازيين فإنهما لا يتقاطعان أبدا.' },
    confondues: { fr: "Une infinité de solutions, seulement si les deux équations décrivent la même droite. Ici les droites sont différentes.", ar: 'ما لا نهاية من الحلول فقط إذا مثّلت المعادلتان نفس المستقيم.' },
    partiel: { fr: "Tu as donné l'autre inconnue. Relis la question : on demande celle-ci.", ar: 'أعطيت المجهول الآخر. أعد قراءة السؤال.' },
    ordre: { fr: "x et y ont été inversés : dans (3 ; −1), la première valeur est x, la seconde est y.", ar: 'بدّلت x و y: القيمة الأولى هي x والثانية هي y.' },
    divise: { fr: "Il manque la dernière division : après avoir éliminé une inconnue, divise par son coefficient.", ar: 'تنقص القسمة الأخيرة على معامل المجهول.' },
    signe: { fr: "Erreur de signe en passant un terme de l'autre côté ou en soustrayant les équations.", ar: 'خطأ في الإشارة عند نقل حدّ أو عند طرح المعادلتين.' },
    combinaison: { fr: "Tu as soustrait les équations sans égaliser d'abord les coefficients : une inconnue reste mélangée à l'autre.", ar: 'طرحت المعادلتين دون توحيد المعاملات أولا، فبقي المجهولان معا.' }
  },

  hook: {
    title: 'Deux tickets de caisse',
    svg: `<svg class="fig" viewBox="0 0 640 210" role="img" aria-label="Deux tickets de caisse : 3 cahiers et 2 stylos pour 24 DH, 1 cahier et 2 stylos pour 12 DH">
      <rect class="ink" x="70" y="20" width="210" height="170" rx="6" fill="var(--card)"/>
      <rect class="ink" x="360" y="20" width="210" height="170" rx="6" fill="var(--card)"/>
      <text x="175" y="52" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="20" fill="var(--ink)">Ticket 1</text>
      <text x="465" y="52" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="20" fill="var(--ink)">Ticket 2</text>
      <text x="90" y="95" font-family="Kalam" font-size="20" fill="var(--blue)">3 cahiers</text><text x="90" y="125" font-family="Kalam" font-size="20" fill="var(--heat-text)">2 stylos</text>
      <text x="380" y="95" font-family="Kalam" font-size="20" fill="var(--blue)">1 cahier</text><text x="380" y="125" font-family="Kalam" font-size="20" fill="var(--heat-text)">2 stylos</text>
      <line class="ink" x1="90" y1="142" x2="260" y2="142" style="stroke-dasharray:6 6;opacity:.5"/><line class="ink" x1="380" y1="142" x2="550" y2="142" style="stroke-dasharray:6 6;opacity:.5"/>
      <text x="260" y="174" text-anchor="end" font-family="Kalam" font-weight="700" font-size="22" fill="var(--ink)">24 DH</text>
      <text x="550" y="174" text-anchor="end" font-family="Kalam" font-weight="700" font-size="22" fill="var(--ink)">12 DH</text></svg>`,
    text: "Deux élèves achètent les mêmes cahiers et les mêmes stylos dans la même librairie. Les tickets ne donnent que les totaux. Avec un seul ticket, peut-on trouver le prix d'un cahier ? Et avec les deux ?",
    ar: 'تلميذان يشتريان نفس الدفاتر ونفس الأقلام من نفس المكتبة. الوصلان لا يعطيان إلا المجموع. هل يمكن إيجاد ثمن دفتر بوصل واحد؟ وبالوصلين معا؟',
    audio: 'audio/maths-3ac-systemes-question.mp3',
    audioText: 'شوف معايا هاد جوج وصلات. فالأول: تلاتة دفاتر وجوج ستيلوات بربعة وعشرين درهم. فالتاني: دفتر واحد وجوج ستيلوات بطناش درهم. بوصل واحد، واش تقدر تعرف تمن الدفتر، ولا خاصك جوج وصلات؟ دير التوقع ديالك.'
  },

  predict: [
    { q: 'Le ticket 1 seul donne 3x + 2y = 24 (x : prix d’un cahier, y : prix d’un stylo). Combien de couples (x ; y) vérifient cette équation ?', ar: 'الوصل الأول وحده يعطي 3x + 2y = 24. كم زوجا (x ; y) يحقق هذه المعادلة؟',
      options: [['un seul couple', 'unique'], ['une infinité de couples', ''], ['aucun couple', 'aucun']] },
    { q: 'Les deux droites d’un système sont parallèles et distinctes. Le système a :', ar: 'مستقيما نظمة متوازيان ومختلفان. للنظمة:',
      options: [['une seule solution', 'toujours'], ['aucune solution', ''], ['une infinité de solutions', 'confondues']] }
  ],

  experiment: {
    title: 'Deux droites, un point commun ?',
    intro: 'La droite bleue est fixe : x + y = 6. Règle la droite orange y = m·x + p et observe où elles se coupent.',
    html: `<svg class="fig" id="plot" viewBox="0 0 420 330" role="img" aria-label="Repère avec deux droites et leur point d'intersection">
      <defs><clipPath id="box"><rect x="20" y="10" width="380" height="300"/></clipPath></defs>
      <g id="grid"></g>
      <g clip-path="url(#box)"><line id="l1" class="ink" style="stroke:var(--blue);stroke-width:3"/><line id="l2" class="ink" style="stroke:var(--heat);stroke-width:3"/>
      <circle id="pt" r="7" fill="var(--glow)" class="ink" style="display:none"/></g>
      <text id="ptl" font-family="Kalam" font-weight="700" font-size="18" fill="var(--ink)"></text></svg>
    <div class="readout">
      <div class="card"><small>Droite orange</small><b id="eq2" style="color:var(--heat-text)"></b></div>
      <div class="card"><small>Solution (x ; y)</small><b id="sol" style="color:var(--glow-text)"></b></div>
      <div class="card"><small>Vérif. x + y</small><b id="v1" style="color:var(--blue)"></b></div>
      <div class="card"><small>Nombre de solutions</small><b id="nb"></b></div></div>
    <div class="ctl" style="margin-top:10px">
      <div><label for="m">Pente m <span id="mo"></span></label><input id="m" type="range" min="-3" max="3" step="0.5" value="2"></div>
      <div><label for="p">Ordonnée à l'origine p <span id="po"></span></label><input id="p" type="range" min="-4" max="8" step="1" value="-3"></div></div>`,
    missions: [
      { id: 'sol', text: 'Règle la droite orange pour que la solution du système soit x = 2 et y = 4.' },
      { id: 'aucune', text: 'Trouve un réglage où le système n’a aucune solution.' },
      { id: 'infini', text: 'Trouve un réglage où le système a une infinité de solutions.' }
    ],
    required: ['sol'],
    note: 'Le point commun est calculé à chaque mouvement : x = (6 − p) ÷ (1 + m) et y = m·x + p, sauf si m = −1 (droites parallèles ou confondues).',
    mount(root, api) {
      const $ = s => root.querySelector(s), nf = api.nf;
      const X0 = -2, X1 = 8, Y0 = -4, Y1 = 10, L = 20, T = 10, W = 380, H = 300;
      const sx = x => L + (x - X0) / (X1 - X0) * W, sy = y => T + (Y1 - y) / (Y1 - Y0) * H;
      let g = '';
      for (let x = X0; x <= X1; x++) g += `<line x1="${sx(x)}" y1="${T}" x2="${sx(x)}" y2="${T + H}" stroke="var(--line)" stroke-width="${x === 0 ? 2 : 1}" opacity="${x === 0 ? .9 : .45}"/>`;
      for (let y = Y0; y <= Y1; y++) g += `<line x1="${L}" y1="${sy(y)}" x2="${L + W}" y2="${sy(y)}" stroke="var(--line)" stroke-width="${y === 0 ? 2 : 1}" opacity="${y === 0 ? .9 : .45}"/>`;
      for (let x = X0; x <= X1; x += 2) if (x) g += `<text x="${sx(x)}" y="${sy(0) + 16}" text-anchor="middle" font-size="12" fill="var(--ink)">${x}</text>`;
      for (let y = Y0 + 2; y < Y1; y += 2) if (y) g += `<text x="${sx(0) - 6}" y="${sy(y) + 4}" text-anchor="end" font-size="12" fill="var(--ink)">${y}</text>`;
      $('#grid').innerHTML = g;
      const seg = (el, f) => { el.setAttribute('x1', sx(X0)); el.setAttribute('y1', sy(f(X0))); el.setAttribute('x2', sx(X1)); el.setAttribute('y2', sy(f(X1))); };
      seg($('#l1'), x => 6 - x);
      const term = (k, s) => k === 0 ? '' : (k === 1 ? s : k === -1 ? '−' + s : nf(k, 1).replace('-', '−') + s);
      const eqText = (m, p) => { const a = term(m, 'x'); const b = p === 0 ? '' : (p > 0 ? (a ? ' + ' : '') + p : (a ? ' − ' : '−') + (-p)); return 'y = ' + ((a + b) || '0'); };
      const near = (a, b) => Math.abs(a - b) < 1e-9;
      const draw = () => {
        const m = +$('#m').value, p = +$('#p').value;
        $('#mo').textContent = '= ' + nf(m, 1).replace('-', '−'); $('#po').textContent = '= ' + String(p).replace('-', '−');
        seg($('#l2'), x => m * x + p); $('#eq2').textContent = eqText(m, p);
        const pt = $('#pt'), lab = $('#ptl');
        if (near(m, -1)) {
          pt.style.display = 'none'; lab.textContent = '';
          if (near(p, 6)) { $('#sol').textContent = 'tous les points de la droite'; $('#nb').textContent = 'une infinité'; $('#v1').textContent = 'toujours 6'; api.done('infini'); }
          else { $('#sol').textContent = 'aucun point commun'; $('#nb').textContent = 'aucune'; $('#v1').textContent = '—'; api.done('aucune'); }
          return;
        }
        const x = (6 - p) / (1 + m), y = m * x + p;
        $('#sol').textContent = `(${nf(x, 2).replace('-', '−')} ; ${nf(y, 2).replace('-', '−')})`;
        $('#v1').textContent = nf(x + y, 2).replace('-', '−'); $('#nb').textContent = 'une seule';
        const inView = x >= X0 && x <= X1 && y >= Y0 && y <= Y1;
        pt.style.display = inView ? '' : 'none';
        if (inView) { pt.setAttribute('cx', sx(x)); pt.setAttribute('cy', sy(y)); lab.setAttribute('x', Math.min(sx(x) + 10, L + W - 70)); lab.setAttribute('y', Math.max(sy(y) - 10, T + 18)); lab.textContent = `(${nf(x, 1).replace('-', '−')} ; ${nf(y, 1).replace('-', '−')})`; }
        else lab.textContent = '';
        if (near(x, 2) && near(y, 4)) api.done('sol');
      };
      $('#m').addEventListener('input', draw); $('#p').addEventListener('input', draw); draw();
    }
  },

  rule: {
    blocks: [
      { formula: '{ a·x + b·y = c ; a′·x + b′·y = c′ }', text: "Résoudre le système, c'est trouver le couple (x ; y) qui vérifie les deux équations en même temps. Graphiquement, c'est le point commun des deux droites.", ar: 'حلّ النظمة هو إيجاد الزوج (x ; y) الذي يحقق المعادلتين معا. مبيانيا، هو نقطة تقاطع المستقيمين.' },
      { formula: 'Combinaison : égaliser, puis soustraire', text: "On multiplie une équation pour que les coefficients d'une inconnue soient égaux, puis on soustrait : cette inconnue disparaît. On trouve l'autre, puis on remplace.", ar: 'طريقة التأليفة الخطية: نضرب معادلة لنوحّد معاملي مجهول، ثم نطرح فيختفي، ونجد الآخر ثم نعوّض.' },
      { formula: 'Substitution : isoler, puis remplacer', text: "On écrit une inconnue en fonction de l'autre dans une équation (par exemple y = 6 − x), puis on remplace dans l'autre équation.", ar: 'طريقة التعويض: نعبّر عن مجهول بدلالة الآخر في معادلة، ثم نعوّض في المعادلة الأخرى.' },
      { formula: 'APPRO · sécantes, parallèles, confondues', text: 'Droites sécantes : une seule solution. Parallèles et distinctes : aucune. Confondues : une infinité.', ar: 'تعمّق: مستقيمان متقاطعان: حل وحيد. متوازيان ومختلفان: لا حل. منطبقان: ما لا نهاية من الحلول.' }
    ],
    seen: 'Une seule équation laisse une infinité de couples : toute une droite. La deuxième équation est une deuxième droite ; leur point commun est la solution. Pente égale : aucun point commun, ou la même droite.',
    audio: 'audio/maths-3ac-systemes-regle.mp3',
    audioText: 'القاعدة هي: معادلة وحدة فيها جوج مجاهيل كتعطي بزاف ديال الحلول، كاملين على مستقيم. باش نلقاو حل واحد، خاصنا معادلة تانية، يعني مستقيم تاني. الحل هو النقطة فين كيتلاقاو. وباش نحسبوه: يا إما كنساويو المعامل ديال شي مجهول وكنطرحو، يا إما كنعبرو على مجهول بالآخر وكنعوضو. وإلا كانو المستقيمات متوازيين، ما كاينش حل.'
  },

  proof: {
    title: 'Pourquoi le point commun, et pourquoi soustraire ?',
    html: `<p>Un point de la droite bleue vérifie la première équation. Un point de la droite orange vérifie la seconde. Seul le point commun vérifie les deux à la fois : c'est la solution.</p>
      <p class="hand" style="font-size:20px">(3x + 2y) − (x + 2y) = 24 − 12, donc 2x = 12 et x = 6</p>
      <p>Les deux tickets ont le même nombre de stylos : en soustrayant, les stylos disparaissent. Il reste 2 cahiers pour 12 DH, donc un cahier coûte 6 DH. Puis 6 + 2y = 12 donne y = 3 : un stylo coûte 3 DH.</p>`,
    ar: 'نقطة من المستقيم الأزرق تحقق المعادلة الأولى، ونقطة من البرتقالي تحقق الثانية، والنقطة المشتركة وحدها تحققهما معا. في الوصلين نفس عدد الأقلام، فبالطرح تختفي الأقلام ويبقى دفتران بـ 12 درهما، أي أن الدفتر بـ 6 دراهم والقلم بـ 3 دراهم.'
  },

  exercises: {
    levels: [
      { label: 'Niveau 1 · combinaison directe', make(R) {
        const x = R.int(3, 12), y = R.int(1, x - 1), S = x + y, D = x - y;
        return { q: `Résous le système { x + y = ${S} ; x − y = ${D} }. Donne la valeur de x.`, unit: '(x)', ans: x, digits: 0,
          traps: [[y, 'partiel'], [S + D, 'divise']] }; } },
      { label: 'Niveau 2 · substitution', make(R) {
        for (let k = 0; k < 60; k++) {
          const x0 = R.int(1, 6), a = R.int(2, 4), b = R.pick([-3, -2, -1, 1, 2, 3, 4, 5]), y0 = a * x0 + b, S = x0 + y0;
          const xs = (S + b) / (1 + a), ys = a * xs + b, xd = S - b, yd = a * xd + b;
          const vals = [y0, x0, ys, yd];
          if (new Set(vals.map(v => Math.round(v * 100))).size < 4) continue;
          const bt = b > 0 ? `+ ${b}` : `− ${-b}`;
          return { q: `Résous le système { y = ${a}x ${bt} ; x + y = ${S} } par substitution. Donne la valeur de y.`, unit: '(y)', ans: y0, digits: 2,
            traps: [[x0, 'partiel'], [ys, 'signe'], [yd, 'divise']] };
        }
        return { q: 'Résous le système { y = 2x + 1 ; x + y = 7 } par substitution. Donne la valeur de y.', unit: '(y)', ans: 5, digits: 2, traps: [[2, 'partiel'], [7, 'divise']] }; } },
      { label: 'Niveau 3 · problème', make(R) {
        for (let k = 0; k < 60; k++) {
          const t = R.pick([4, 5, 6, 7, 8, 9]), p = R.pick([3, 4, 5, 6]);
          if (t === p) continue;
          const A = 2 * t + 3 * p, B = t + 2 * p, tc = A - B, ts = 5 * B - 2 * A;
          if (new Set([t, p, tc, ts]).size < 4) continue;
          return { q: `Au marché, 2 kg de tomates et 3 kg de pommes de terre coûtent ${A} DH. 1 kg de tomates et 2 kg de pommes de terre coûtent ${B} DH. Quel est le prix d'un kilogramme de tomates ?`, unit: 'DH', ans: t, digits: 2,
            traps: [[p, 'partiel'], [tc, 'combinaison'], [ts, 'signe']] };
        }
        return { q: "Au marché, 2 kg de tomates et 3 kg de pommes de terre coûtent 24 DH. 1 kg de tomates et 2 kg de pommes de terre coûtent 14 DH. Quel est le prix d'un kilogramme de tomates ?", unit: 'DH', ans: 6, digits: 2, traps: [[4, 'partiel'], [10, 'combinaison']] }; } }
    ]
  },

  check: [
    { q: "L'équation 2x − y = 5, seule, est vérifiée par :", ar: 'المعادلة 2x − y = 5 وحدها يحققها:',
      options: [['un seul couple (x ; y)', 'unique'], ['une infinité de couples (x ; y)', ''], ['aucun couple', 'aucun']] },
    { q: 'Les deux droites d’un système se coupent au point (3 ; −1). La solution du système est :', ar: 'مستقيما نظمة يتقاطعان في النقطة (3 ; −1). حل النظمة هو:',
      options: [['x = 3 et y = −1', ''], ['x = −1 et y = 3', 'ordre'], ['une infinité de solutions', 'confondues']] },
    { q: 'Les droites y = 2x + 1 et y = 2x − 3 forment un système. Il a :', ar: 'المستقيمان y = 2x + 1 و y = 2x − 3 يكوّنان نظمة. لها:',
      options: [['une seule solution', 'toujours'], ['aucune solution', ''], ['une infinité de solutions', 'confondues']] }
  ]
};
/* LESSON:END */
