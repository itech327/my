/* LESSON:BEGIN · Physique-Chimie 3AC · L'énergie cinétique et la distance d'arrêt */
const CAR = `<path class="ink" fill="var(--card)" d="M-84 154 L-84 134 Q-83 127 -74 126 L-62 126 L-52 109 Q-49 104 -42 104 L-26 104 Q-19 104 -15 111 L-8 126 Q0 127 0 136 L0 154 Z"/><path class="ink" style="stroke-width:1.8" d="M-58 126 L-50 112 L-38 112 L-38 126 Z M-34 126 L-34 112 L-22 112 L-16 126 Z"/><circle class="ink" fill="var(--card)" cx="-62" cy="158" r="11"/><circle class="ink" fill="var(--card)" cx="-14" cy="158" r="11"/>`;
const LESSON = {
  meta: {
    kicker: 'Physique-Chimie · 3e année collège · Le concept en main',
    title: "L'énergie cinétique et la distance d'arrêt",
    titleAr: 'الطاقة الحركية ومسافة التوقف',
    short: 'Énergie cinétique',
    classes: ['3APIC-1', '3APIC-2', '3APIC-3'],
    footer: 'Prototype « Le concept en main » pour taalim.men, hors production. Textes et valeurs originaux. Non relu par un professeur de physique.'
  },

  misconceptions: {
    lineaire: { fr: "Tu as pensé que tout est proportionnel : doubler la vitesse double l'énergie. Mais la vitesse est au carré.", ar: 'اعتبرت أن كل شيء متناسب، لكن السرعة مرفوعة إلى المربع.' },
    constante: { fr: "Tu as pensé que l'énergie ou la distance ne dépend pas de la vitesse. Elle en dépend, et fortement.", ar: 'اعتبرت أن الطاقة أو المسافة لا تتعلق بالسرعة، وهي تتعلق بها بقوة.' },
    demi: { fr: 'Oubli du ½ dans Ec = ½·m·v².', ar: 'نسيت المعامل ½.' },
    carre: { fr: "La vitesse n'a pas été élevée au carré.", ar: 'لم ترفع السرعة إلى المربع.' },
    conversion: { fr: "La vitesse n'a pas été convertie de km/h en m/s (÷ 3,6).", ar: 'لم تحوّل السرعة إلى m/s.' },
    conv36: { fr: 'La conversion a été faite dans le mauvais sens : il faut diviser par 3,6, pas multiplier.', ar: 'التحويل في الاتجاه الخاطئ: نقسم على 3,6.' },
    unite: { fr: "Bonne démarche, mais l'unité ne correspond pas : vérifie J ou kJ.", ar: 'انتبه إلى الوحدة: J أو kJ.' },
    racine: { fr: 'Il manque la racine carrée : on trouve v² et non v.', ar: 'تنقص الجذر المربع.' },
    reaction: { fr: 'La distance de réaction a été oubliée : DA = DR + DF.', ar: 'نسيت مسافة رد الفعل.' }
  },

  hook: {
    title: 'Deux fois plus vite… deux fois plus loin ?',
    svg: `<svg class="fig" viewBox="0 0 640 220" role="img" aria-label="Deux voitures à 50 et 100 km/h devant un ballon">
      <line class="ink" x1="0" y1="40" x2="640" y2="40" style="stroke-width:1.6;opacity:.5"/><line class="ink" x1="0" y1="212" x2="640" y2="212" style="stroke-width:1.6;opacity:.5"/>
      <line class="ink" x1="0" y1="128" x2="640" y2="128" style="stroke-dasharray:14 12;stroke-width:1.6;opacity:.4"/>
      <g transform="translate(150 -45)">${CAR}</g><path class="ink" d="M54 75 h-20 M50 89 h-28" style="stroke-width:2"/>
      <g transform="translate(150 40)">${CAR}</g><path class="ink" d="M54 160 h-40 M50 174 h-56 M54 188 h-36" style="stroke-width:2;stroke:var(--heat)"/>
      <circle cx="560" cy="128" r="16" fill="var(--card)" class="ink"/>
      <text x="172" y="98" font-family="Kalam" font-weight="700" font-size="22" fill="var(--blue)">50 km/h</text>
      <text x="172" y="184" font-family="Kalam" font-weight="700" font-size="22" fill="var(--heat)">100 km/h</text></svg>`,
    text: "Un ballon roule sur la route. Deux voitures identiques freinent au même endroit : l'une roule à 50 km/h, l'autre à 100 km/h. La seconde va deux fois plus vite. A-t-elle besoin de deux fois plus de distance pour s'arrêter ?",
    ar: 'كرة تتدحرج على الطريق. سيارتان متماثلتان تكبحان في نفس المكان، الأولى بسرعة 50 km/h والثانية بسرعة 100 km/h. هل تحتاج الثانية إلى ضعف المسافة لتتوقف؟'
  },

  predict: [
    { q: 'La voiture passe de 50 km/h à 100 km/h. Son énergie cinétique est multipliée par :', ar: 'السرعة تتضاعف من 50 إلى 100 km/h. الطاقة الحركية تُضرب في:',
      options: [['× 2', 'lineaire'], ['× 4', ''], ['elle ne change pas', 'constante']] },
    { q: 'À 50 km/h, elle freine sur 14 m. À 100 km/h, sa distance de freinage devient environ :', ar: 'عند 50 km/h مسافة الكبح 14 m. عند 100 km/h تصبح تقريبا:',
      options: [['28 m', 'lineaire'], ['55 m', ''], ['14 m, la même', 'constante']] }
  ],

  experiment: {
    title: "Le banc d'essai",
    intro: 'Règle la voiture, puis appuie sur « Freiner ». Chaque essai s’ajoute au carnet.',
    html: `<svg class="fig" viewBox="0 0 800 240" role="img" aria-label="Voiture sur une route avec distance de réaction et de freinage">
      <defs><radialGradient id="g"><stop offset="0" stop-color="#f5a300" stop-opacity=".75"/><stop offset=".55" stop-color="#f5a300" stop-opacity=".25"/><stop offset="1" stop-color="#f5a300" stop-opacity="0"/></radialGradient></defs>
      <path class="ink" style="stroke-width:1.3;opacity:.4" d="M0 110 Q90 74 180 102 T380 94 Q480 70 560 100 T800 92"/>
      <line class="ink" x1="0" y1="171" x2="800" y2="171"/><line class="ink" x1="0" y1="212" x2="800" y2="212"/>
      <line class="ink" x1="0" y1="192" x2="800" y2="192" style="stroke-width:2;stroke-dasharray:16 14;opacity:.5"/>
      <rect id="wet" x="0" y="172" width="800" height="39" fill="var(--blue)" opacity="0"/>
      <rect id="mr" y="220" height="8" rx="4" fill="var(--blue)" width="0"/><rect id="mf" y="220" height="8" rx="4" fill="var(--heat)" width="0"/>
      <g id="sign" style="opacity:0"><line class="ink" id="pole" x1="0" y1="170" x2="0" y2="104"/><path id="tri" fill="var(--bg)" class="ink" d=""/><text id="ex" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="26" fill="var(--heat)">!</text></g>
      <g id="car"><circle id="glow" cx="-36" cy="138" r="40" fill="url(#g)"/><g id="lines" class="ink" style="stroke-width:2"><path d="M-84 120 h-26 M-90 135 h-34 M-84 150 h-22"/></g>${CAR}<circle class="brk" cx="-62" cy="158" r="6" fill="var(--heat)" opacity="0"/><circle class="brk" cx="-14" cy="158" r="6" fill="var(--heat)" opacity="0"/></g></svg>
    <div class="readout">
      <div class="card"><small>Énergie cinétique</small><b id="ec" style="color:var(--glow)"></b></div>
      <div class="card"><small>Distance de réaction</small><b id="dr" style="color:var(--blue)"></b></div>
      <div class="card"><small>Distance de freinage</small><b id="df" style="color:var(--heat)"></b></div>
      <div class="card"><small>Distance d'arrêt</small><b id="da"></b></div></div>
    <div class="bars"><span>Énergie cinétique de la voiture</span><div class="bar"><i id="bk" style="background:var(--glow);width:100%"></i></div><span>Énergie thermique dans les freins</span><div class="bar"><i id="bh" style="background:var(--heat);width:0"></i></div></div>
    <div class="ctl" style="margin-top:10px">
      <div><label for="m">Masse <span id="mo"></span></label><input id="m" type="range" min="500" max="2000" step="100" value="1000"></div>
      <div><label for="v">Vitesse <span id="vo"></span></label><input id="v" type="range" min="10" max="130" step="10" value="50"></div>
      <div><label>Route</label><div class="seg" id="road"><button data-a="7" class="on">sèche</button><button data-a="5">mouillée</button></div></div>
      <div><label>Conducteur</label><div class="seg" id="drv"><button data-t="1" class="on">attentif · 1 s</button><button data-t="2">distrait · 2 s</button></div></div></div>
    <div class="row"><button class="b primary" id="go">Danger ! Freiner</button></div>
    <h3>Mon carnet d'essais</h3>
    <div class="scroll"><table><thead><tr><th>Essai</th><th>m (kg)</th><th>v (km/h)</th><th>Route</th><th>Ec (kJ)</th><th>DF (m)</th><th>DA (m)</th></tr></thead><tbody id="log"><tr><td colspan="7" class="note">Aucun essai pour l'instant.</td></tr></tbody></table></div>`,
    missions: [
      { id: 'v', text: 'Freiner à 50 km/h puis à 100 km/h, avec la même masse et la même route.' },
      { id: 'm', text: 'Freiner deux fois à la même vitesse, la seconde avec une masse double.' },
      { id: 'route', text: 'Comparer route sèche et route mouillée à la même vitesse.' }
    ],
    required: ['v'],
    note: 'Modèle : décélération constante de 7 m/s² sur route sèche et 5 m/s² sur route mouillée. Les valeurs réelles dépendent des pneus, des freins et du véhicule.',
    mount(root, api) {
      const $ = s => root.querySelector(s), $$ = s => [...root.querySelectorAll(s)], nf = api.nf;
      const ms = k => k / 3.6, EC = (m, k) => .5 * m * ms(k) ** 2, EMAX = EC(2000, 130), START = -14, RATE = 1.4;
      const X = d => 20 + (d + 25) * 4.75;
      let A = 7, TR = 1, busy = false; const runs = [];
      const cur = () => { const m = +$('#m').value, v = +$('#v').value, s = ms(v); return { m, v, s, a: A, tr: TR, e: EC(m, v), dr: s * TR, df: s * s / (2 * A) }; };
      const setCar = (d, vf, hf) => { $('#car').setAttribute('transform', `translate(${X(d).toFixed(1)} 0)`); $('#lines').style.opacity = vf; $$('.brk').forEach(b => b.setAttribute('opacity', hf.toFixed(2))); };
      const setGlow = e => $('#glow').setAttribute('r', (18 + 72 * Math.sqrt(e / EMAX)).toFixed(1));
      const marks = (r, a, b) => { const x0 = X(0), x1 = X(r.dr); $('#mr').setAttribute('x', x0); $('#mr').setAttribute('width', Math.max(0, X(a) - x0)); $('#mf').setAttribute('x', x1); $('#mf').setAttribute('width', Math.max(0, X(r.dr + b) - x1)); };
      const x = X(0); $('#pole').setAttribute('x1', x); $('#pole').setAttribute('x2', x); $('#tri').setAttribute('d', `M${x} 66 L${x + 24} 104 L${x - 24} 104 Z`); $('#ex').setAttribute('x', x); $('#ex').setAttribute('y', 100);
      const update = () => {
        const r = cur();
        $('#mo').textContent = '= ' + nf(r.m, 0) + ' kg'; $('#vo').textContent = `= ${r.v} km/h (${nf(r.s)} m/s)`;
        $('#ec').textContent = nf(r.e / 1000) + ' kJ'; $('#dr').textContent = nf(r.dr, 0) + ' m'; $('#df').textContent = nf(r.df, 0) + ' m'; $('#da').textContent = nf(r.dr + r.df, 0) + ' m';
        setCar(START, 1, 0); setGlow(r.e); marks(r, 0, 0); $('#sign').style.opacity = 0; $('#bk').style.width = '100%'; $('#bh').style.width = '0'; $('#wet').setAttribute('opacity', A === 5 ? .12 : 0);
      };
      const lock = b => { busy = b; $('#m').disabled = $('#v').disabled = $('#go').disabled = b; $$('#road button,#drv button').forEach(x => x.disabled = b); };
      const missions = () => {
        const has = f => runs.some((a, i) => runs.some((b, j) => i !== j && f(a, b)));
        if (has((a, b) => a.m === b.m && a.a === b.a && a.v === 50 && b.v === 100)) api.done('v');
        if (has((a, b) => a.v === b.v && a.a === b.a && b.m === 2 * a.m)) api.done('m');
        if (has((a, b) => a.v === b.v && a.a === 7 && b.a === 5)) api.done('route');
      };
      const logRun = r => {
        runs.push(r);
        $('#log').innerHTML = runs.slice(-8).map((x, i, arr) => `<tr><td>${runs.length - arr.length + i + 1}</td><td>${nf(x.m, 0)}</td><td>${x.v}</td><td>${x.a === 7 ? 'sèche' : 'mouillée'}</td><td>${nf(x.e / 1000)}</td><td>${nf(x.df, 0)}</td><td>${nf(x.dr + x.df, 0)}</td></tr>`).join('');
        missions();
      };
      const run = () => {
        if (busy) return; update(); lock(true);
        const r = cur(), s = r.s, tA = -START / s, tB = tA + r.tr, tC = tB + s / r.a; let t0 = null;
        const step = now => {
          if (t0 === null) t0 = now;
          let t = api.reduce ? tC : (now - t0) / 1000 * RATE; if (t > tC) t = tC;
          let d, vc; if (t < tB) { d = START + s * t; vc = s; } else { const tb = t - tB; vc = Math.max(0, s - r.a * tb); d = START + s * tB + s * tb - .5 * r.a * tb * tb; }
          const ef = (vc / s) ** 2;
          setCar(d, vc / s, t >= tB ? 1 - ef : 0); setGlow(r.e * ef); $('#sign').style.opacity = t >= tA ? 1 : 0;
          marks(r, Math.min(Math.max(d, 0), r.dr), Math.max(0, d - r.dr));
          $('#bk').style.width = ef * 100 + '%'; $('#bh').style.width = (1 - ef) * 100 + '%'; $('#ec').textContent = nf(r.e * ef / 1000) + ' kJ';
          if (t < tC) requestAnimationFrame(step); else { lock(false); logRun(r); }
        };
        requestAnimationFrame(step);
      };
      $('#m').oninput = $('#v').oninput = update; $('#go').onclick = run;
      $$('#road button').forEach(b => b.onclick = () => { A = +b.dataset.a; $$('#road button').forEach(x => x.classList.toggle('on', x === b)); update(); });
      $$('#drv button').forEach(b => b.onclick = () => { TR = +b.dataset.t; $$('#drv button').forEach(x => x.classList.toggle('on', x === b)); update(); });
      update();
    }
  },

  rule: {
    blocks: [
      { formula: 'E<sub>c</sub> = ½ · m · v²', text: 'Ec en joules (J), m en kilogrammes (kg), v en mètres par seconde (m/s). Pour convertir : v (m/s) = v (km/h) ÷ 3,6.', ar: 'الطاقة الحركية تساوي نصف جداء الكتلة في مربع السرعة. نحوّل السرعة إلى m/s بالقسمة على 3,6.' },
      { formula: 'D<sub>A</sub> = D<sub>R</sub> + D<sub>F</sub>', text: "La distance d'arrêt est la somme de la distance parcourue pendant le temps de réaction et de la distance de freinage.", ar: 'مسافة التوقف = مسافة رد الفعل + مسافة الكبح.' }
    ],
    seen: 'masse double, Ec double. Vitesse double, Ec quadruple, et la distance de freinage aussi. Route mouillée ou conducteur distrait : la distance d’arrêt s’allonge.'
  },

  proof: {
    title: 'Pourquoi « × 4 » ?',
    html: `<p class="hand" style="font-size:20px">½ · m · (2v)² = ½ · m · 4v² = 4 × E<sub>c</sub></p>
      <p>La vitesse est <b>au carré</b> dans la formule : doubler la vitesse multiplie l'énergie par 2 × 2 = 4.</p>
      <p>Pour s'arrêter, les freins transforment toute l'énergie cinétique en énergie thermique. Ils en absorbent à peu près la même quantité à chaque mètre. Quatre fois plus d'énergie demande donc environ quatre fois plus de mètres : 14 m à 50 km/h, environ 55 m à 100 km/h.</p>`,
    ar: 'السرعة مرفوعة إلى المربع، فمضاعفتها تضرب الطاقة الحركية في 4. الفرامل تحوّل هذه الطاقة إلى حرارة بقدر متقارب في كل متر، لذلك تتضاعف مسافة الكبح أربع مرات تقريبا.'
  },

  exercises: {
    levels: [
      { label: 'Niveau 1', make(R) { const m = R.int(500, 2000, 100), v = R.int(5, 30), E = .5 * m * v * v;
        return { q: `Une voiture de masse m = ${R.nf(m, 0)} kg roule à v = ${v} m/s. Calcule son énergie cinétique.`, unit: 'J', ans: E, digits: 0,
          traps: [[2 * E, 'demi'], [.5 * m * v, 'carre'], [E / 1000, 'unite']] }; } },
      { label: 'Niveau 2', make(R) { const m = R.int(600, 2000, 100), k = R.pick([36, 54, 72, 90, 108]), v = k / 3.6, E = .5 * m * v * v / 1000;
        return { q: `Une voiture de masse ${R.nf(m, 0)} kg roule à ${k} km/h. Calcule son énergie cinétique en kilojoules.`, unit: 'kJ', ans: E, digits: 2,
          traps: [[.5 * m * k * k / 1000, 'conversion'], [.5 * m * (k * 3.6) ** 2 / 1000, 'conv36'], [m * v * v / 1000, 'demi'], [E * 1000, 'unite'], [.5 * m * v / 1000, 'carre']] }; } },
      { label: 'Niveau 3', make(R) {
        if (Math.random() < .5) { const k = R.pick([36, 54, 72, 90]), v = k / 3.6, tr = R.pick([1, 1.5, 2]), df = Math.round(v * v / 14);
          return { q: `Un conducteur roule à ${k} km/h. Son temps de réaction est ${R.nf(tr)} s et la distance de freinage est ${df} m. Calcule la distance d'arrêt.`, unit: 'm', ans: v * tr + df, digits: 1,
            traps: [[df, 'reaction'], [k * tr + df, 'conversion']] }; }
        const m = R.int(5, 20) * 100, v = R.int(6, 30), E = .5 * m * v * v;
        return { q: `Un véhicule de masse ${R.nf(m, 0)} kg possède une énergie cinétique de ${R.nf(E, 0)} J. Calcule sa vitesse en m/s.`, unit: 'm/s', ans: v, digits: 1,
          traps: [[v * v, 'racine'], [Math.sqrt(E / m), 'demi']] }; } }
    ]
  },

  check: [
    { q: 'Un scooter passe de 20 km/h à 60 km/h : sa vitesse est multipliée par 3. Son énergie cinétique est multipliée par :', ar: 'سرعة دراجة نارية تُضرب في 3. الطاقة الحركية تُضرب في:',
      options: [['× 3', 'lineaire'], ['× 6', 'lineaire'], ['× 9', '']] },
    { q: "Sur route sèche, à 30 km/h, la distance de freinage est d'environ 5 m. À 60 km/h, elle est d'environ :", ar: 'عند 30 km/h مسافة الكبح حوالي 5 m. عند 60 km/h تصبح حوالي:',
      options: [['10 m', 'lineaire'], ['20 m', ''], ['5 m', 'constante']] }
  ]
};
/* LESSON:END */
