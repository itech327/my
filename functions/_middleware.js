/* taalim.men Pro · accès réservé au pilote.
   Toute page exige un laissez-passer signé, obtenu avec le code d'accès PRO_CODE
   (secret Cloudflare Pages, jamais dans le dépôt). Sans PRO_CODE valide, le site reste fermé.
   Changer PRO_CODE invalide tous les laissez-passer en cours. */

const COOKIE = 'pro_pass';
const DAYS = 30;
const enc = new TextEncoder();
const HTML_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin'
};

const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function sign(key, msg) {
  const k = await crypto.subtle.importKey('raw', enc.encode('taalim-pro|' + key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64u(await crypto.subtle.sign('HMAC', k, enc.encode(msg)));
}

async function same(a, b) {
  const [x, y] = await Promise.all([a, b].map(v => crypto.subtle.digest('SHA-256', enc.encode(String(v)))));
  return crypto.subtle.timingSafeEqual(x, y);
}

async function validPass(request, code) {
  const m = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)pro_pass=(\d{13})\.([\w-]{40,50})/);
  if (!m || Number(m[1]) < Date.now()) return false;
  return same(m[2], await sign(code, 'v1|' + m[1]));
}

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  if (url.pathname === '/robots.txt') return next();

  const code = env.PRO_CODE;
  if (!code || code.length < 8) return new Response(page('closed'), { status: 503, headers: HTML_HEADERS });

  if (url.pathname === '/__login') {
    if (request.method !== 'POST') return Response.redirect(url.origin + '/', 303);
    const form = await request.formData().catch(() => null);
    const given = String((form && form.get('code')) || '').trim();
    if (!given || given.length > 128 || !(await same(given, code))) return new Response(page('wrong'), { status: 401, headers: HTML_HEADERS });
    const exp = Date.now() + DAYS * 864e5;
    return new Response(null, { status: 303, headers: {
      Location: '/',
      'Cache-Control': 'no-store',
      'Set-Cookie': `${COOKIE}=${exp}.${await sign(code, 'v1|' + exp)}; Path=/; Max-Age=${DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`
    } });
  }

  if (url.pathname === '/__logout') {
    return new Response(null, { status: 303, headers: { Location: '/', 'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` } });
  }

  if (await validPass(request, code)) {
    const res = await next();
    const out = new Response(res.body, res);
    out.headers.set('X-Robots-Tag', 'noindex, nofollow');
    out.headers.set('Cache-Control', 'private, no-store');
    return out;
  }
  return new Response(page(''), { status: 401, headers: HTML_HEADERS });
}

function page(state) {
  const msg = {
    wrong: ['Ce code ne correspond pas. Vérifie-le auprès de ton professeur, majuscules comprises.', 'هذا الرمز غير صحيح. تحقّق منه عند أستاذك.'],
    closed: ["L'espace pilote n'est pas encore ouvert.", 'فضاء التجربة لم يُفتح بعد.']
  }[state];
  const form = state === 'closed' ? '' : `
      <form method="post" action="/__login" autocomplete="off">
        <label for="code">Code d'accès <span lang="ar" dir="rtl">رمز الدخول</span></label>
        <div class="field"><input id="code" name="code" type="password" required maxlength="128" autocapitalize="off" spellcheck="false" ${state === 'wrong' ? 'aria-invalid="true" aria-describedby="err"' : ''} autofocus><button type="submit">Entrer</button></div>
      </form>`;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>Espace pilote · taalim.men Pro</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Sans+Arabic:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{--paper:#F2F5F7;--grid:#DCE3EA;--ink:#13233A;--mute:#55667A;--maths:#2D55D6;--bad:#B3261E;--panel:#fff}
*{box-sizing:border-box}html,body{margin:0;min-height:100%}
body{font:16px/1.55 "IBM Plex Sans","IBM Plex Sans Arabic",system-ui,sans-serif;color:var(--ink);background:var(--paper);
 background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:28px 28px;display:grid;place-items:center;min-height:100vh;padding:24px}
main{width:min(440px,100%);background:var(--panel);border:1px solid var(--grid);border-radius:4px;padding:36px 32px;box-shadow:0 1px 0 var(--grid),0 24px 48px -32px rgba(19,35,58,.35)}
.mark{font:700 15px/1 "Bricolage Grotesque",sans-serif;letter-spacing:-.01em;display:flex;align-items:center;gap:10px;margin:0 0 36px}
.mark svg{flex:none}
h1{font:700 40px/1.02 "Bricolage Grotesque",sans-serif;letter-spacing:-.025em;margin:0 0 6px}
.ar{font:500 20px/1.4 "IBM Plex Sans Arabic",sans-serif;color:var(--mute);margin:0 0 20px;text-align:right}
p{margin:0 0 26px;color:var(--mute);max-width:36ch}
label{display:flex;justify-content:space-between;font-weight:600;font-size:14px;margin-bottom:8px}label span{font-family:"IBM Plex Sans Arabic",sans-serif;font-weight:500;color:var(--mute)}
.field{display:flex;border:1.5px solid var(--ink);border-radius:3px;overflow:hidden;background:#fff}
input{flex:1;min-width:0;border:0;padding:14px 14px;font:500 18px/1 "IBM Plex Sans",monospace;letter-spacing:.08em;color:var(--ink);background:transparent}
input:focus{outline:none}.field:focus-within{box-shadow:0 0 0 3px rgba(45,85,214,.25);border-color:var(--maths)}
input[aria-invalid=true]{color:var(--bad)}
button{border:0;background:var(--ink);color:#fff;font:600 16px/1 "IBM Plex Sans",sans-serif;padding:0 22px;cursor:pointer}
button:hover{background:var(--maths)}button:focus-visible{outline:3px solid var(--maths);outline-offset:-3px}
.msg{margin:16px 0 0;padding:12px 14px;border-left:3px solid var(--bad);background:#FBEDEC;color:var(--bad);font-size:14px}
.msg span{display:block;font-family:"IBM Plex Sans Arabic",sans-serif;text-align:right;margin-top:4px}
footer{margin-top:30px;font-size:13px;color:var(--mute)}
@media(max-width:420px){main{padding:28px 22px}h1{font-size:34px}}
</style></head><body><main>
  <div class="mark"><svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path d="M2 18 L20 4" stroke="#2D55D6" stroke-width="2.4" stroke-linecap="round"/><path d="M2 6 L20 16" stroke="#13233A" stroke-width="2.4" stroke-linecap="round"/><circle cx="11.6" cy="10.6" r="2.6" fill="#fff" stroke="#13233A" stroke-width="1.6"/></svg>taalim.men Pro</div>
  <h1>Espace pilote</h1>
  <p class="ar" lang="ar" dir="rtl">فضاء التجربة</p>
  <p>Les leçons « Le concept en main » de la classe pilote. Entre le code donné par ton professeur.</p>${form}
  ${msg ? `<div class="msg" id="err" role="alert">${msg[0]}<span lang="ar" dir="rtl">${msg[1]}</span></div>` : ''}
  <footer>Aucun nom n'est demandé. Le code reste valable 30 jours sur cet appareil.</footer>
</main></body></html>`;
}
