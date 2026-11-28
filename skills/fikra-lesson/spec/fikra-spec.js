/* fikra-spec v0 · turns a lesson SPEC (pure JSON, no code) into the LESSON object the engine expects.
   A SPEC can come from a teacher form or from an AI proposal: it never contains JavaScript or HTML.
   Every text is escaped, every formula goes through a small safe expression parser (no eval),
   and the experiment is one widget from a closed library. Exposes one global: FikraSpec. */
var FikraSpec = (function () {
  'use strict';
  const esc = t => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- safe expressions: + - * / ^, comparisons, && ||, ( ), functions, variables ---------- */
  const FN = { sqrt: Math.sqrt, abs: Math.abs, floor: Math.floor, ceil: Math.ceil, min: Math.min, max: Math.max, pow: Math.pow,
    round: (x, d = 0) => Math.round(x * 10 ** d) / 10 ** d,
    // trigonometry in degrees, as in the collège programme
    cosd: x => Math.cos(x * Math.PI / 180), sind: x => Math.sin(x * Math.PI / 180), tand: x => Math.tan(x * Math.PI / 180),
    acosd: x => Math.acos(x) * 180 / Math.PI, asind: x => Math.asin(x) * 180 / Math.PI, atand: x => Math.atan(x) * 180 / Math.PI };
  const CONST = { pi: Math.PI };
  function tokenize(src) {
    const out = [], re = /\s*(?:(\d+(?:\.\d+)?)|([A-Za-z_]\w*)|(<=|>=|==|!=|&&|\|\||[-+*/^(),<>!]))/y;
    let m; re.lastIndex = 0;
    while (re.lastIndex < src.length) {
      const at = re.lastIndex; m = re.exec(src);
      if (!m) { if (/^\s*$/.test(src.slice(at))) break; throw new Error(`symbole inattendu dans « ${src} » à la position ${at + 1}`); }
      out.push(m[1] ? { t: 'n', v: +m[1] } : m[2] ? { t: 'id', v: m[2] } : { t: 'op', v: m[3] });
    }
    return out;
  }
  function parse(src, known) {
    const tk = tokenize(String(src)); let i = 0;
    const peek = () => tk[i], eat = v => { if (tk[i] && tk[i].v === v) { i++; return true; } return false; };
    const need = v => { if (!eat(v)) throw new Error(`« ${v} » attendu dans « ${src} »`); };
    const bin = (next, ops) => () => { let a = next(); for (;;) { const p = peek(); if (p && p.t === 'op' && ops.includes(p.v)) { i++; a = { op: p.v, a, b: next() }; } else return a; } };
    let or;
    const atom = () => {
      const p = tk[i++]; if (!p) throw new Error(`expression incomplète : « ${src} »`);
      if (p.t === 'n') return { n: p.v };
      if (p.t === 'op' && p.v === '(') { const e = or(); need(')'); return e; }
      if (p.t === 'op' && (p.v === '-' || p.v === '!')) return { op: 'u' + p.v, a: unary() };
      if (p.t === 'id') {
        if (eat('(')) { if (!FN[p.v]) throw new Error(`fonction inconnue « ${p.v} »`); const args = []; if (!eat(')')) { do args.push(or()); while (eat(',')); need(')'); } return { f: p.v, args }; }
        if (p.v in CONST) return { n: CONST[p.v] };
        if (known && !known.includes(p.v)) throw new Error(`variable inconnue « ${p.v} » dans « ${src} »`);
        return { v: p.v };
      }
      throw new Error(`symbole « ${p.v} » mal placé dans « ${src} »`);
    };
    const unary = atom;
    const pow = () => { const a = unary(); return eat('^') ? { op: '^', a, b: pow() } : a; };
    const mul = bin(pow, ['*', '/']), add = bin(mul, ['+', '-']), cmp = bin(add, ['<', '>', '<=', '>=', '==', '!=']), and = bin(cmp, ['&&']);
    or = bin(and, ['||']);
    const e = or(); if (i < tk.length) throw new Error(`fin inattendue dans « ${src} »`); return e;
  }
  function ev(e, env) {
    if ('n' in e) return e.n;
    if ('v' in e) { if (!(e.v in env)) throw new Error(`variable « ${e.v} » sans valeur`); return env[e.v]; }
    if (e.f) return FN[e.f](...e.args.map(a => ev(a, env)));
    const a = ev(e.a, env);
    switch (e.op) {
      case 'u-': return -a; case 'u!': return a ? 0 : 1;
      case '&&': return a && ev(e.b, env) ? 1 : 0; case '||': return a || ev(e.b, env) ? 1 : 0;
    }
    const b = ev(e.b, env);
    switch (e.op) {
      case '+': return a + b; case '-': return a - b; case '*': return a * b; case '/': return a / b; case '^': return a ** b;
      case '<': return +(a < b); case '>': return +(a > b); case '<=': return +(a <= b); case '>=': return +(a >= b);
      case '==': return +(Math.abs(a - b) < 1e-9); case '!=': return +(Math.abs(a - b) >= 1e-9);
    }
  }
  const compile = (src, known) => { const ast = parse(src, known); return env => ev(ast, env); };

  /* ---------- text templates: {x} or {x:2} ---------- */
  const fill = (tpl, env, nf) => esc(tpl).replace(/\{(\w+)(?::(\d))?\}/g, (m, k, d) => {
    if (!(k in env)) throw new Error(`{${k}} sans valeur dans « ${tpl} »`); return nf(env[k], d == null ? 2 : +d);
  });

  /* ---------- widgets ---------- */
  const WIDGETS = {};
  function sliders(ins) {
    return ins.map(s => `<label for="w-${s.id}">${esc(s.label)} <span id="w-${s.id}-o"></span></label>
      <input id="w-${s.id}" type="range" min="${+s.min}" max="${+s.max}" step="${+(s.step || 1)}" value="${+(s.value ?? s.min)}">`).join('');
  }
  function cards(outs) {
    return `<div class="readout">${outs.map(o => `<div class="card"><small>${esc(o.label)}</small><b id="w-${o.id}"></b></div>`).join('')}</div>`;
  }
  const carnet = (ins, outs) => `<div class="row"><button type="button" class="b" id="w-note">Noter dans mon carnet</button></div>
    <div class="scroll"><table><thead><tr>${ins.concat(outs).map(c => `<th>${esc(c.label)}${c.unit ? ` (${esc(c.unit)})` : ''}</th>`).join('')}</tr></thead><tbody id="w-log"></tbody></table></div>`;

  function core(p, extraDraw) {
    const ins = p.inputs || [], outs = p.outputs || [], names = ins.map(s => s.id);
    const fx = []; outs.forEach(o => { fx.push([o, compile(o.expr, names.concat(fx.map(f => f[0].id)))]); });
    return { ins, outs, names: names.concat(outs.map(o => o.id)), mount(root, api, missions) {
      const $ = s => root.querySelector(s);
      const read = () => { const env = {}; ins.forEach(s => env[s.id] = +$('#w-' + s.id).value); fx.forEach(([o, f]) => env[o.id] = f(env)); return env; };
      const unit = u => u ? ' ' + esc(u) : '';
      const draw = () => {
        const env = read();
        ins.forEach(s => $(`#w-${s.id}-o`).textContent = '= ' + api.nf(env[s.id], 2) + (s.unit ? ' ' + s.unit : ''));
        outs.forEach(o => $('#w-' + o.id).innerHTML = (isFinite(env[o.id]) ? api.nf(env[o.id], o.digits ?? 2) : '—') + unit(o.unit));
        if (extraDraw) extraDraw(root, env, api);
        missions.forEach(m => m.step(env));
      };
      ins.forEach(s => $('#w-' + s.id).addEventListener('input', draw));
      $('#w-note').addEventListener('click', () => {
        const env = read(), tr = document.createElement('tr');
        tr.innerHTML = ins.concat(outs).map(c => `<td>${api.nf(env[c.id], c.digits ?? 2)}</td>`).join(''); $('#w-log').prepend(tr);
        if (extraDraw && extraDraw.note) extraDraw.note(root, env);
      });
      draw();
    } };
  }

  /* curseurs: sliders, computed values, optional bars, a carnet */
  WIDGETS.curseurs = p => {
    const c = core(p, (root, env) => (p.bars || []).forEach(b => {
      const el = root.querySelector('#w-bar-' + b.id); el.style.width = Math.max(0, Math.min(100, 100 * env[b.id] / b.max)) + '%';
    }));
    const bars = (p.bars || []).map(b => `<div class="wbar"><small>${esc(b.label || b.id)}</small><div><i id="w-bar-${b.id}"></i></div></div>`).join('');
    return { names: c.names, mount: c.mount,
      html: `<style>.wbar{margin:6px 0}.wbar div{height:14px;border:1.5px solid var(--ink);border-radius:8px;overflow:hidden;background:var(--card)}.wbar i{display:block;height:100%;width:0;background:var(--blue);transition:width .2s}</style>`
        + cards(c.outs) + bars + sliders(c.ins) + carnet(c.ins, c.outs) };
  };

  /* graphe: a curve y = f(var) drawn with the current slider values, a moving point, ghost curves when noted */
  WIDGETS.graphe = p => {
    const g = p.curve, W = 400, H = 300, m = 34;
    const names = (p.inputs || []).map(s => s.id);
    const f = compile(g.expr, names);
    const X = x => m + (x - g.xmin) / (g.xmax - g.xmin) * (W - 2 * m), Y = y => H - m - (y - g.ymin) / (g.ymax - g.ymin) * (H - 2 * m);
    const clampY = y => Math.max(g.ymin - 1e3, Math.min(g.ymax + 1e3, y));
    const path = env => { let d = ''; for (let k = 0; k <= 120; k++) { const x = g.xmin + (g.xmax - g.xmin) * k / 120, y = f({ ...env, [g.var]: x }); if (isFinite(y)) d += (d ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(clampY(y)).toFixed(1); } return d; };
    const draw = (root, env) => {
      root.querySelector('#w-curve').setAttribute('d', path(env));
      const x = env[g.var], y = f(env), pt = root.querySelector('#w-pt'), inside = y >= g.ymin && y <= g.ymax;
      pt.setAttribute('cx', X(x)); pt.setAttribute('cy', Y(Math.max(g.ymin, Math.min(g.ymax, y)))); pt.style.opacity = inside ? 1 : .3;
      root.querySelector('#w-px').setAttribute('d', `M${X(x)} ${Y(0)}V${Y(Math.max(g.ymin, Math.min(g.ymax, y)))}H${X(0)}`);
    };
    draw.note = (root, env) => { const gh = document.createElementNS('http://www.w3.org/2000/svg', 'path'); gh.setAttribute('d', path(env)); gh.setAttribute('class', 'ghost'); root.querySelector('#w-ghosts').appendChild(gh); };
    const c = core(p, draw);
    let grid = '';
    const step = (a, b) => { const r = b - a; return r <= 12 ? 1 : r <= 30 ? 2 : r <= 60 ? 5 : r <= 120 ? 10 : Math.pow(10, Math.floor(Math.log10(r / 6))); };
    const sx = step(g.xmin, g.xmax), sy = step(g.ymin, g.ymax);
    for (let x = Math.ceil(g.xmin / sx) * sx; x <= g.xmax; x += sx) grid += `<path d="M${X(x)} ${m}V${H - m}"/>` + (x ? `<text x="${X(x)}" y="${Y(0) + 14 > H - 4 ? H - 4 : Y(0) + 14}" text-anchor="middle">${x}</text>` : '');
    for (let y = Math.ceil(g.ymin / sy) * sy; y <= g.ymax; y += sy) grid += `<path d="M${m} ${Y(y)}H${W - m}"/>` + (y ? `<text x="${X(0) - 5}" y="${Y(y) + 4}" text-anchor="end">${y}</text>` : '');
    const svg = `<svg class="fig" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(g.label || 'Représentation graphique')}">
      <style>.wg path{stroke:var(--line,#ccc);stroke-width:1}.wg text{font:11px sans-serif;fill:var(--ink)}.ghost{fill:none;stroke:#999;stroke-width:1.5;stroke-dasharray:4 4}</style>
      <g class="wg">${grid}</g><path d="M${m} ${Y(0)}H${W - m}M${X(0)} ${m}V${H - m}" stroke="var(--ink)" stroke-width="1.5"/>
      <text x="${W - m + 4}" y="${Y(0) - 6}" font-size="13" font-family="sans-serif" fill="var(--ink)">${esc(g.xlabel || g.var)}</text>
      <text x="${X(0) + 6}" y="${m - 8}" font-size="13" font-family="sans-serif" fill="var(--ink)">${esc(g.ylabel || 'y')}</text>
      <g id="w-ghosts"></g><path id="w-curve" fill="none" stroke="var(--blue)" stroke-width="3"/>
      <path id="w-px" fill="none" stroke="var(--heat)" stroke-width="1.5" stroke-dasharray="5 4"/><circle id="w-pt" r="7" fill="var(--heat)"/></svg>`;
    return { names: c.names, mount: c.mount, html: svg + cards(c.outs) + sliders(c.ins) + carnet(c.ins, c.outs) };
  };

  /* tubes: lab tubes (each with its own constants), shared sliders, reagents that colour each tube from an expression,
     optional plaque à godets (one tube, one reagent, a variable stepped over the wells). Mission names: the inputs,
     <tube>_<reagent> (the computed value), reactif (1-based index of the reagent applied, 0 before any). */
  WIDGETS.tubes = p => {
    const ins = p.inputs || [], tubes = p.tubes || [], rs = p.reagents || [], plate = p.plate, inNames = ins.map(s => s.id);
    if (!tubes.length || !rs.length) throw new Error('tubes : il faut au moins un tube et un réactif');
    const tv = [...new Set(tubes.flatMap(t => Object.keys(t.vars || {})))], base = inNames.concat(tv);
    const R = rs.map(r => ({ ...r, f: compile(r.expr, base), sc: (r.colors || []).slice().sort((a, b) => b[0] - a[0]) }));
    const colourOf = (r, v) => { for (const c of r.sc) if (v >= c[0]) return c; return r.sc[r.sc.length - 1] || [0, '', '#ccc']; };
    const names = inNames.concat(['reactif'], tubes.flatMap(t => rs.map(r => `${t.id}_${r.id}`)));
    const pr = plate ? { tube: tubes.find(t => t.id === plate.tube), r: R.find(r => r.id === plate.reagent) } : null;
    if (plate && (!pr.tube || !pr.r)) throw new Error('tubes : plaque, tube ou réactif inconnu');
    const TW = 54, gap = 18, W = Math.max(320, tubes.length * (TW + gap) + gap), H = 230;
    const tubeSvg = tubes.map((t, i) => { const x = gap + i * (TW + gap);
      return `<g><path d="M${x} 20V170a${TW / 2} ${TW / 2} 0 0 0 ${TW} 0V20" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
        <path id="w-liq-${esc(t.id)}" d="M${x + 3} 80V170a${TW / 2 - 3} ${TW / 2 - 3} 0 0 0 ${TW - 6} 0V80Z" fill="#e8eef5"/>
        <text x="${x + TW / 2}" y="16" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">${esc(t.short || String(i + 1))}</text></g>`; }).join('');
    const legend = tubes.map((t, i) => `<li><b>${esc(t.short || String(i + 1))}</b> · ${esc(t.label)} <span class="tres" id="w-res-${esc(t.id)}"></span></li>`).join('');
    const btns = rs.map((r, i) => `<button type="button" class="b" data-r="${i}">${esc(r.label)}</button>`).join(' ');
    const wells = plate ? plate.values.map((v, k) => `<div class="well"><i id="w-well-${k}"></i><small>${esc(String(v).replace('.', ','))}${plate.unit ? ' ' + esc(plate.unit) : ''}</small></div>`).join('') : '';
    const html = `<style>.wtl{list-style:none;padding:0;margin:6px 0}.wtl li{margin:4px 0}.tres{font-weight:700}.wplate{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}.well{display:flex;flex-direction:column;align-items:center;gap:2px}.well i{width:34px;height:34px;border-radius:50%;border:2px solid var(--ink);background:#f4f4f2}</style>
      <svg class="fig" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(p.label || 'Tubes à essai')}">${tubeSvg}</svg>
      <ul class="wtl">${legend}</ul><div class="row">${btns}</div>
      ${plate ? `<p class="note" style="margin-bottom:0">${esc(plate.label || 'Plaque à godets')}</p><div class="wplate">${wells}</div>` : ''}`
      + sliders(ins);
    return { names, html, mount(root, api, missions) {
      const $ = s => root.querySelector(s); let cur = -1;
      const envOf = () => { const e = {}; ins.forEach(s => e[s.id] = +$('#w-' + s.id).value); return e; };
      const draw = () => {
        const g = envOf(), env = { ...g, reactif: cur + 1 };
        ins.forEach(s => $(`#w-${s.id}-o`).textContent = '= ' + api.nf(g[s.id], 2) + (s.unit ? ' ' + s.unit : ''));
        tubes.forEach(t => {
          const te = { ...g }; tv.forEach(k => te[k] = (t.vars || {})[k] ?? 0);
          R.forEach(r => env[`${t.id}_${r.id}`] = r.f(te));
          const liq = $('#w-liq-' + t.id), res = $('#w-res-' + t.id);
          if (cur < 0) { liq.setAttribute('fill', '#e8eef5'); res.textContent = ''; }
          else { const c = colourOf(R[cur], env[`${t.id}_${R[cur].id}`]); liq.setAttribute('fill', c[2]); res.textContent = '→ ' + c[1]; }
        });
        if (pr) plate.values.forEach((v, k) => { const te = { ...g, [plate.var]: v }; tv.forEach(n => te[n] = (pr.tube.vars || {})[n] ?? 0);
          $('#w-well-' + k).style.background = colourOf(pr.r, pr.r.f(te))[2]; });
        missions.forEach(m => m.step(env));
      };
      ins.forEach(s => $('#w-' + s.id).addEventListener('input', draw));
      root.querySelectorAll('[data-r]').forEach(b => b.addEventListener('click', () => { cur = +b.dataset.r; root.querySelectorAll('[data-r]').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); }));
      draw();
    } };
  };

  /* ---------- missions: « valeurs » (each listed value of one input seen, optionally while a condition holds) or « condition » ---------- */
  function missionRunners(list, names, api) {
    return list.map(ms => {
      if (ms.type === 'valeurs') {
        const when = ms.when ? compile(ms.when, names) : () => 1, seen = new Set();
        return { step(env) { if (!when(env)) return; ms.values.forEach(v => { if (Math.abs(env[ms.input] - v) < 1e-9) seen.add(v); }); if (seen.size === ms.values.length) api.done(ms.id); } };
      }
      if (ms.type === 'condition') { const c = compile(ms.expr, names); return { step(env) { if (c(env)) api.done(ms.id); } }; }
      throw new Error(`mission « ${ms.id} » : type inconnu « ${ms.type} »`);
    });
  }

  /* ---------- exercises: vars, then question template, answer and traps as expressions ---------- */
  function level(lv) {
    const names = [], gens = (lv.vars || []).map(([k, def]) => {
      const d = String(def).trim(), w = d.split(/\s+/); let g;
      if (w[0] === 'int') { const [a, b, s] = w.slice(1).map(Number); g = R => R.int(a, b, s || 1); }
      else if (w[0] === 'pick') { const list = w.slice(1).map(Number); if (list.some(isNaN)) throw new Error(`liste invalide pour ${k}`); g = R => R.pick(list); }
      else { const f = compile(d, names.slice()); g = (R, env) => f(env); }
      names.push(k); return [k, g];
    });
    const ans = compile(lv.answer, names), traps = (lv.traps || []).map(([e, c]) => [compile(e, names), c]);
    return { label: lv.label, make(R) {
      const env = {}; gens.forEach(([k, g]) => env[k] = g(R, env));
      return { q: fill(lv.q, env, R.nf).replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
        unit: lv.unit || ' ', ans: ans(env), digits: lv.digits ?? 2, traps: traps.map(([f, c]) => [f(env), c]) };
    } };
  }

  /* ---------- the whole lesson ---------- */
  function lessonFromSpec(S) {
    const need = (o, k, where) => { if (o == null || o[k] == null || o[k] === '') throw new Error(`${where}.${k} manquant`); return o[k]; };
    ['meta', 'misconceptions', 'hook', 'predict', 'experiment', 'rule', 'proof', 'exercises', 'check'].forEach(k => need(S, k, 'spec'));
    const x = S.experiment, mk = WIDGETS[x.widget];
    if (!mk) throw new Error(`widget inconnu « ${x.widget} ». Disponibles : ${Object.keys(WIDGETS).join(', ')}`);
    const w = mk(x.params || {});
    (x.missions || []).forEach(m => { if (m.type === 'valeurs' && !w.names.includes(m.input)) throw new Error(`mission « ${m.id} » : curseur « ${m.input} » inconnu`); });
    const q = arr => arr.map(it => ({ q: esc(it.q), ar: String(it.ar || ''), options: it.options.map(([l, c]) => [esc(l), String(c)]) }));
    const mis = {}; Object.entries(S.misconceptions).forEach(([k, v]) => mis[k] = { fr: esc(v.fr), ar: String(v.ar || '') });
    const voice = o => o.audio ? { audio: String(o.audio), audioText: String(o.audioText || '') } : {};
    const levels = S.exercises.levels.map(level);
    return {
      meta: { kicker: esc(S.meta.kicker), title: esc(need(S.meta, 'title', 'meta')), titleAr: String(S.meta.titleAr || ''), short: esc(S.meta.short || S.meta.title), classes: (S.meta.classes || []).map(String), footer: String(S.meta.footer || '') },
      misconceptions: mis,
      hook: { title: esc(S.hook.title), svg: '', text: esc(S.hook.text), ar: String(S.hook.ar || ''), ...voice(S.hook) },
      predict: q(S.predict),
      experiment: { title: esc(x.title), intro: esc(x.intro || ''), html: w.html,
        missions: (x.missions || []).map(m => ({ id: String(m.id), text: esc(m.text) })), required: x.required && x.required.length ? x.required.map(String) : undefined, note: esc(x.note || ''),
        mount(root, api) { w.mount(root, api, missionRunners(x.missions || [], w.names, api)); } },
      rule: { blocks: S.rule.blocks.map(b => ({ formula: esc(b.formula), text: esc(b.text || ''), ar: String(b.ar || '') })), seen: esc(S.rule.seen || ''), ...voice(S.rule) },
      proof: { title: esc(S.proof.title), html: (S.proof.paras || []).map((p, i) => `<p${i === 0 && S.proof.firstIsFormula ? ' class="hand" style="font-size:20px"' : ''}>${esc(p)}</p>`).join(''), ar: String(S.proof.ar || '') },
      exercises: { levels },
      check: q(S.check)
    };
  }

  return { lessonFromSpec, compile, widgets: () => Object.keys(WIDGETS), version: 'v1.1' };
})();
