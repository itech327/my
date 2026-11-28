/* LESSON:BEGIN · SVT 3AC · L'amylase salivaire et la température */
const LESSON = {
  meta: {
    kicker: 'SVT · 3e année collège · La digestion · Le concept en main',
    title: "L'amylase salivaire et la température",
    titleAr: 'الأميلاز اللعابي ودرجة الحرارة',
    short: 'Amylase et température',
    classes: ['3APIC'],
    footer: 'Prototype « Le concept en main » pour taalim.men, hors production. Textes, valeurs et dessins originaux. Modèle simplifié. Non relu par un professeur de SVT.'
  },

  misconceptions: {
    chaleur: { fr: "Plus chaud ne veut pas dire plus rapide : l'amylase agit le mieux vers 37 °C, et une forte chaleur la détruit.", ar: 'الحرارة الأعلى لا تعني نشاطا أسرع: الأميلاز ينشط أكثر قرب 37 °C والحرارة المرتفعة تخرّبه.' },
    pareil: { fr: "La température change la vitesse d'action de l'enzyme : elle n'agit pas pareil à 0 °C et à 37 °C.", ar: 'درجة الحرارة تغيّر سرعة نشاط الأنزيم.' },
    iode: { fr: "L'eau iodée bleu-noir montre qu'il reste de l'amidon. Elle ne détecte pas le sucre.", ar: 'الماء اليودي الأزرق الداكن يدل على وجود النشا، ولا يكشف السكر.' },
    reversible: { fr: "Une forte chaleur détruit l'amylase : en refroidissant, elle n'agit plus.", ar: 'الحرارة المرتفعة تخرّب الأميلاز، ولا يعود إلى النشاط بعد التبريد.' },
    froid: { fr: "Le froid ralentit l'amylase sans la détruire : à 37 °C, elle agit de nouveau.", ar: 'البرودة تبطئ الأميلاز دون أن تخرّبه، ويعود نشاطه عند 37 °C.' },
    seule: { fr: "L'amidon ne se transforme pas tout seul : le tube témoin sans salive reste bleu-noir.", ar: 'النشا لا يتحول وحده: الأنبوب الشاهد بدون لعاب يبقى أزرق داكنا.' },
    lecture: { fr: "Le temps le plus court correspond à l'action la plus rapide.", ar: 'أقصر مدة توافق أسرع نشاط.' },
    difference: { fr: 'Pour dire « combien de fois plus rapide », on divise les durées, on ne les soustrait pas.', ar: 'لمعرفة كم مرة أسرع نقسم المدتين ولا نطرحهما.' },
    inverse: { fr: 'On divise la durée la plus longue par la plus courte.', ar: 'نقسم المدة الأطول على المدة الأقصر.' },
    restant: { fr: "Tu as calculé le pourcentage qui reste, pas celui qui a été digéré.", ar: 'حسبت النسبة المتبقية وليس النسبة المهضومة.' },
    pourcent: { fr: "Il faut exprimer le résultat en pourcentage de la masse de départ.", ar: 'يجب التعبير بالنسبة المئوية من الكتلة الأصلية.' }
  },

  hook: {
    title: 'Le pain qui devient sucré',
    audio: 'audio/svt-3ac-amylase-question.mp3',
    audioText: 'مضغ طرف ديال الخبز مدة طويلة فالفم ديالك، غادي تحس بيه ولّى حلو شوية. شكون اللي بدّل النشا اللي فالخبز لسكر؟ وإلا كان الفم سخون بزاف، بحال تمانين درجة، واش غادي يولّي حلو كتر، ولا قل، ولا ما غاديش يتبدل والو؟ دير التوقع ديالك.',
    svg: `<svg class="fig" viewBox="0 0 640 220" role="img" aria-label="Un morceau de pain mâché, et une bouche imaginaire à 80 degrés">
      <path class="ink" fill="var(--card)" d="M90 150 Q80 80 150 70 Q230 60 250 110 Q262 150 240 160 L110 168 Q92 166 90 150 Z"/>
      <path class="ink" d="M120 110 q10 -8 20 0 M160 100 q10 -8 20 0 M200 112 q10 -8 20 0" style="stroke-width:1.6;opacity:.6"/>
      <path class="ink" d="M280 115 h60 M330 105 l12 10 l-12 10" />
      <text x="420" y="104" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="24" fill="var(--glow-text)">sucré ?</text>
      <text x="420" y="140" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="20" fill="var(--ink)">après 2 à 3 min de mastication</text>
      <text x="420" y="190" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="20" fill="var(--heat-text)">et si la bouche était à 80 °C ?</text></svg>`,
    text: "Mâche longtemps un morceau de pain sans l'avaler : il finit par avoir un goût légèrement sucré. Le pain contient de l'amidon, qui n'est pas sucré. Que se passe-t-il dans la bouche ? Et est-ce que ça marcherait mieux si la bouche était beaucoup plus chaude ?",
    ar: 'امضغ قطعة خبز مدة طويلة دون أن تبلعها: يصبح طعمها حلوا قليلا. الخبز يحتوي على النشا وهو غير حلو. ماذا يحدث في الفم؟ وهل يكون ذلك أسرع لو كان الفم أكثر حرارة؟'
  },

  predict: [
    { q: "On mélange de l'amidon et de la salive dans trois tubes, à 0 °C, 37 °C et 80 °C. Dans quel tube l'amidon disparaît-il le plus vite ?", ar: 'نخلط النشا واللعاب في ثلاثة أنابيب عند 0 °C و 37 °C و 80 °C. في أي أنبوب يختفي النشا بسرعة أكبر؟',
      options: [['à 80 °C', 'chaleur'], ['à 37 °C', ''], ['à la même vitesse dans les trois', 'pareil']] },
    { q: "Après 10 minutes, une goutte du mélange devient bleu-noir avec l'eau iodée. Cela signifie :", ar: 'بعد 10 دقائق تصبح قطرة من الخليط زرقاء داكنة مع الماء اليودي. هذا يعني:',
      options: [["qu'il reste de l'amidon", ''], ["qu'il s'est formé du sucre", 'iode'], ["que l'amylase a fini son travail", 'iode']] }
  ],

  experiment: {
    title: 'Le bain-marie et la plaque à godets',
    intro: "Choisis le tube et la température du bain-marie, puis lance 10 minutes. Chaque minute, une goutte est déposée sur la plaque avec de l'eau iodée.",
    html: `<svg class="fig" viewBox="0 0 640 280" role="img" aria-label="Tube au bain-marie et plaque à godets d'eau iodée">
      <rect id="bath" x="30" y="110" width="200" height="150" rx="14" fill="var(--blue)" opacity=".18"/><rect x="30" y="110" width="200" height="150" rx="14" class="ink" fill="none"/>
      <rect x="110" y="40" width="40" height="180" rx="20" class="ink" fill="var(--card)"/><rect id="liq" x="114" y="120" width="32" height="96" rx="16" fill="#f3ead2"/>
      <text id="tub" x="130" y="30" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="16" fill="var(--ink)"></text>
      <g transform="translate(190 60)"><rect x="-6" y="0" width="12" height="150" rx="6" class="ink" fill="var(--card)"/><rect id="th" x="-3" y="140" width="6" height="8" rx="3" fill="var(--heat)"/><circle cy="156" r="10" fill="var(--heat)"/></g>
      <text id="tt" x="190" y="248" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="18" fill="var(--heat-text)"></text>
      <rect x="270" y="90" width="350" height="150" rx="16" class="ink" fill="var(--card)"/>
      <g id="wells"></g>
      <text x="445" y="80" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="16" fill="var(--ink)">eau iodée, minute par minute</text>
      <text id="clk" x="445" y="268" text-anchor="middle" font-family="Kalam" font-weight="700" font-size="18" fill="var(--ink)"></text></svg>
    <div class="readout">
      <div class="card"><small>Activité de l'amylase</small><b id="act"></b></div>
      <div class="card"><small>Amidon restant</small><b id="st"></b></div>
      <div class="card"><small>Eau iodée</small><b id="io"></b></div>
      <div class="card"><small>Fehling à chaud</small><b id="fe"></b></div></div>
    <div class="ctl">
      <div><label>Tube</label><div class="seg" id="tube"><button data-t="s" class="on">amidon + salive</button><button data-t="b">amidon + salive bouillie</button><button data-t="e">amidon + eau (témoin)</button></div></div>
      <div><label for="T">Bain-marie <span id="To"></span></label><input id="T" type="range" min="0" max="100" step="5" value="37"></div></div>
    <div class="row"><button class="b primary" id="go">Lancer 10 minutes</button><button class="b" id="fresh">Nouvelle salive</button><span class="note" id="sal"></span></div>
    <h3>Mon carnet</h3>
    <div class="scroll"><table><thead><tr><th>Essai</th><th>Tube</th><th>T (°C)</th><th>Amidon restant</th><th>Eau iodée</th><th>Fehling</th></tr></thead><tbody id="log"><tr><td colspan="6" class="note">Aucun essai pour l'instant.</td></tr></tbody></table></div>`,
    missions: [
      { id: 'temp', text: "Avec de la salive, compare 37 °C et une température de 10 °C ou moins." },
      { id: 'chaud', text: "Chauffe la salive à 70 °C ou plus, puis refais l'essai à 37 °C avec la même salive." },
      { id: 'temoin', text: 'Fais le tube témoin, sans salive, à 37 °C.' }
    ],
    required: ['temp'],
    note: "Modèle simplifié : activité maximale à 37 °C, divisée par deux tous les 10 °C en dessous, en baisse au-dessus, nulle à partir de 65 °C. À 37 °C, l'amidon disparaît en 4 minutes environ. Les durées réelles dépendent de la salive et de la quantité d'amidon.",
    mount(root, api) {
      const $ = s => root.querySelector(s), $$ = s => [...root.querySelectorAll(s)], nf = api.nf;
      const act = T => T >= 65 ? 0 : T <= 37 ? Math.pow(2, (T - 37) / 10) : Math.max(0, 1 - ((T - 37) / 28) ** 2);
      const K = Math.log(20) / 4; // at 37 °C, 95 % of the starch is gone after 4 min
      const mix = (S) => { const a = [29, 42, 107], b = [205, 150, 60], t = Math.max(0, Math.min(1, S)); return `rgb(${a.map((v, i) => Math.round(b[i] + (v - b[i]) * t)).join(',')})`; };
      const ioWord = S => S > .5 ? 'bleu-noir' : S > .1 ? 'bleu pâle' : 'brun-jaune';
      let tube = 's', busy = false, denat = false, heated = false; const runs = [];
      $('#wells').innerHTML = Array.from({ length: 10 }, (_, i) => `<circle id="w${i}" cx="${305 + (i % 5) * 70}" cy="${i < 5 ? 135 : 195}" r="22" class="ink" fill="#f6f1e3" style="stroke-width:1.6"/><text x="${305 + (i % 5) * 70}" y="${(i < 5 ? 135 : 195) + 38}" text-anchor="middle" font-size="12" fill="var(--soft)">${i + 1} min</text>`).join('');
      const eff = T => tube === 'e' || tube === 'b' || denat ? 0 : act(T);
      const show = () => {
        const T = +$('#T').value; $('#To').textContent = '= ' + T + ' °C'; $('#tt').textContent = T + ' °C';
        $('#th').setAttribute('y', 148 - T * 1.3); $('#th').setAttribute('height', 8 + T * 1.3);
        $('#bath').setAttribute('fill', T >= 50 ? 'var(--heat)' : 'var(--blue)'); $('#bath').setAttribute('opacity', (.1 + Math.abs(T - 37) / 300).toFixed(2));
        $('#tub').textContent = { s: 'salive', b: 'salive bouillie', e: 'témoin' }[tube];
        $('#act').textContent = nf(eff(T) * 100, 0) + ' %';
        $('#sal').textContent = tube === 's' && denat ? 'Cette salive a été chauffée : elle est détruite.' : '';
      };
      const set = (S, m) => {
        $('#liq').setAttribute('fill', mix(S)); $('#st').textContent = nf(S * 100, 0) + ' %'; $('#io').textContent = ioWord(S);
        $('#clk').textContent = m.toFixed(0) + ' min'; $('#fe').textContent = m >= 10 ? (1 - S > .2 ? 'rouge brique' : 'bleu') : '…';
      };
      const reset = () => { for (let i = 0; i < 10; i++) $('#w' + i).setAttribute('fill', '#f6f1e3'); set(1, 0); $('#fe').textContent = '·'; };
      const missions = () => {
        const s37 = runs.some(r => r.tube === 's' && !r.denat && r.T === 37), cold = runs.some(r => r.tube === 's' && !r.denat && r.T <= 10);
        if (s37 && cold) api.done('temp');
        if (runs.some(r => r.tube === 's' && r.denat && r.T === 37 && r.heatedBefore)) api.done('chaud');
        if (runs.some(r => r.tube === 'e' && r.T === 37)) api.done('temoin');
      };
      const log = r => {
        runs.push(r);
        $('#log').innerHTML = runs.slice(-8).map((x, i, arr) => `<tr><td>${runs.length - arr.length + i + 1}</td><td>${{ s: 'salive', b: 'salive bouillie', e: 'témoin' }[x.tube]}${x.denat && x.tube === 's' ? ' (chauffée)' : ''}</td><td>${x.T}</td><td>${nf(x.S * 100, 0)} %</td><td>${ioWord(x.S)}</td><td>${1 - x.S > .2 ? 'rouge brique' : 'bleu'}</td></tr>`).join('');
        missions();
      };
      const lock = b => { busy = b; $('#go').disabled = $('#fresh').disabled = $('#T').disabled = b; $$('#tube button').forEach(x => x.disabled = b); };
      const run = () => {
        if (busy) return; const T = +$('#T').value, a = eff(T), wasDenat = denat; reset(); lock(true);
        let t0 = null; const DUR = 5000;
        const step = now => {
          if (t0 === null) t0 = now; const m = api.reduce ? 10 : Math.min(10, (now - t0) / DUR * 10), S = Math.exp(-K * a * m);
          set(S, m); for (let i = 0; i < Math.floor(m); i++) $('#w' + i).setAttribute('fill', mix(Math.exp(-K * a * (i + 1))));
          if (m < 10) requestAnimationFrame(step);
          else {
            lock(false);
            if (tube === 's' && T >= 65) { denat = true; heated = true; }
            log({ tube, T, S, denat: wasDenat, heatedBefore: heated && wasDenat }); show();
          }
        };
        requestAnimationFrame(step);
      };
      $('#T').addEventListener('input', () => { show(); reset(); });
      $$('#tube button').forEach(b => b.onclick = () => { tube = b.dataset.t; $$('#tube button').forEach(x => x.classList.toggle('on', x === b)); show(); reset(); });
      $('#fresh').onclick = () => { denat = false; heated = false; show(); reset(); };
      $('#go').onclick = run; show(); reset();
    }
  },

  rule: {
    audio: 'audio/svt-3ac-amylase-regle.mp3',
    audioText: 'القاعدة هي: الأميلاز اللي فاللعاب أنزيم، كايبدّل النشا لسكر سميتو المالتوز. الماء اليودي كايزرق إلا كان النشا، ومحلول فهلينغ كايعطي لون أحمر آجوري مع المالتوز. الأميلاز كايخدم مزيان قريب من سبعة وتلاتين درجة، بحال حرارة الجسم. البرد كايبطّأو بلا ما يخسرو، أما الحرارة القوية كاتخسرو نهائيا، وما كايرجعش يخدم حتى إلا برد.',
    blocks: [
      { formula: 'amidon → maltose', text: "L'amylase de la salive est une enzyme : elle transforme l'amidon en maltose, un sucre. L'eau iodée bleuit en présence d'amidon. La liqueur de Fehling donne, à chaud, un précipité rouge brique avec le maltose.", ar: 'الأميلاز اللعابي أنزيم يحوّل النشا إلى مالتوز وهو سكر. الماء اليودي يزرقّ بوجود النشا، ومحلول فهلينغ يعطي راسبا أحمر آجوريا مع المالتوز عند التسخين.' },
      { formula: 'optimum vers 37 °C', text: "Le froid ralentit l'amylase sans la détruire. Une forte chaleur, vers 65 °C et plus, la détruit : son action ne revient pas en refroidissant. Le tube témoin sans salive montre que l'amidon ne se transforme pas tout seul.", ar: 'البرودة تبطئ الأميلاز دون أن تخرّبه، والحرارة المرتفعة تخرّبه نهائيا. الأنبوب الشاهد يبيّن أن النشا لا يتحول وحده.' }
    ],
    seen: "à 37 °C les gouttes passent du bleu-noir au brun-jaune en 4 minutes environ. À 0 °C presque rien ne change, mais la même salive agit de nouveau à 37 °C. Après 70 °C, elle n'agit plus jamais. Le témoin reste bleu-noir."
  },

  proof: {
    title: 'Pourquoi le froid et le chaud ne font pas la même chose ?',
    html: `<p>L'amylase est une substance fragile fabriquée par les glandes salivaires. Dans le froid, tout ralentit : elle rencontre moins souvent l'amidon, mais elle reste intacte. Réchauffée à 37 °C, elle travaille de nouveau.</p>
      <p>Une forte chaleur, elle, l'abîme pour de bon, comme la cuisson d'un blanc d'œuf : il ne redevient pas liquide en refroidissant.</p>
      <p>Le <b>tube témoin</b> est indispensable : sans lui, on ne saurait pas si l'amidon disparaît grâce à la salive ou tout seul.</p>`,
    ar: 'البرودة تبطئ الأميلاز دون أن تخرّبه، فيعود إلى العمل عند 37 °C. أما الحرارة المرتفعة فتخرّبه نهائيا كما يتخثر بياض البيض ولا يعود سائلا. والأنبوب الشاهد ضروري لنعرف أن اختفاء النشا سببه اللعاب.'
  },

  exercises: {
    levels: [
      { label: 'Niveau 1', make(R) {
        const act = T => T >= 65 ? 0 : T <= 37 ? Math.pow(2, (T - 37) / 10) : Math.max(0, 1 - ((T - 37) / 28) ** 2);
        const set = R.pick([[10, 20, 37, 60], [0, 20, 37, 50], [10, 37, 50, 70], [20, 37, 50, 70]]);
        const rows = set.map(T => { const a = act(T); return [T, a ? Math.round(4 / a * (0.92 + 0.16 * Math.random())) : null]; });
        const finite = rows.filter(r => r[1] !== null), slow = finite.reduce((x, y) => y[1] > x[1] ? y : x)[0];
        const txt = rows.map(([T, t]) => `${T} °C : ${t === null ? 'pas de changement en 30 min' : t + ' min'}`).join(' ; ');
        return { q: `Durée pour que l'eau iodée ne bleuisse plus : ${txt}. À quelle température l'amylase agit-elle le plus vite ?`, unit: '°C', ans: 37, digits: 0,
          traps: [[Math.max(...set), 'chaleur'], [slow, 'lecture']] }; } },
      { label: 'Niveau 2', make(R) { const t1 = R.pick([3, 4, 5]), k = R.pick([2, 3, 4, 5]), t2 = t1 * k, T2 = R.pick([10, 15, 20]);
        return { q: `À 37 °C, l'amidon disparaît en ${t1} min. À ${T2} °C, il disparaît en ${t2} min. Combien de fois l'amylase est-elle plus rapide à 37 °C ?`, unit: 'fois', ans: k, digits: 1,
          traps: [[t2 - t1, 'difference'], [t1 / t2, 'inverse']] }; } },
      // Niveau 3: no 50 %, it would make « restant » equal the answer
      { label: 'Niveau 3', make(R) { const m0 = R.pick([2, 4, 5, 8, 10]), p = R.pick([20, 25, 40, 60, 75, 80]), mr = Math.round(m0 * (100 - p)) / 100;
        return { q: `Un tube contient ${R.nf(m0)} g d'amidon. Après l'action de la salive, il en reste ${R.nf(mr, 2)} g. Quel pourcentage de l'amidon a été digéré ?`, unit: '%', ans: p, digits: 0,
          traps: [[100 - p, 'restant'], [m0 - mr, 'pourcent']] }; } }
    ]
  },

  check: [
    { q: "De la salive a été chauffée à 90 °C, puis ramenée à 37 °C et mélangée à de l'amidon. Après 10 min, l'eau iodée est :", ar: 'سُخّن لعاب إلى 90 °C ثم أُرجع إلى 37 °C وخُلط مع النشا. بعد 10 دقائق يكون الماء اليودي:',
      options: [["bleu-noir : l'amylase a été détruite", ''], ["brun-jaune : l'amylase agit de nouveau", 'reversible'], ["brun-jaune : la chaleur a transformé l'amidon", 'seule']] },
    { q: "Un tube amidon + salive à 5 °C ne change presque pas. On le place ensuite à 37 °C. L'amidon :", ar: 'أنبوب نشا ولعاب عند 5 °C لا يتغير تقريبا. نضعه بعد ذلك عند 37 °C. النشا:',
      options: [['disparaît : le froid avait seulement ralenti l’amylase', ''], ['reste : le froid a détruit l’amylase', 'froid'], ['reste : il faut une température bien plus haute que 37 °C', 'chaleur']] }
  ]
};
/* LESSON:END */
