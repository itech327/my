# نشر تطبيق صدى على Cloudflare

دليل خطوة بخطوة لنشر تطبيق الويب (`app/`). الموصل (`connector/`) له نشره المنفصل في `voice.taalim.men` ولا يتأثر بهذا الدليل.

الحالة: البناء والمعاينة المحلية على Cloudflare Workers اختُبرا. النشر الفعلي لم يُجرَ بعد.

## ما تحتاجه

- حساب Cloudflare، وخطة **Workers Paid** على الحساب. الخطة المجانية تحدّ المعالج بـ 10 مللي ثانية للطلب، وهذا لا يكفي لصفحات التطبيق.
- حاسوب فيه Node (الـ Mac يكفي) ومجلد المشروع `~/my`.
- مفتاح Gemini من المشروع المدفوع الذي فيه الأصوات المصممة. المعرّفات في `app/src/lib/tts/designed-voices.json` تعمل مع مفتاح مشروعها فقط.
- قاعدة للنطاق إن أردت عنوانا خاصا، مثل `sada.taalim.men`.

## الخطوات

كل الأوامر من مجلد `app/`.

### 1. الشيفرة

```bash
cd ~/my
git fetch origin
git checkout claude/new-session-thirii
git pull origin claude/new-session-thirii
cd app
npm install
```

### 2. تسجيل الدخول إلى Cloudflare

```bash
npx wrangler login
```

يفتح المتصفح. سجّل الدخول بحساب Cloudflare الذي عليه الخطة المدفوعة.

### 3. إنشاء قاعدة البيانات

```bash
npx wrangler d1 create sada
```

انسخ `database_id` الذي يظهر، وضعه في `wrangler.jsonc` داخل `d1_databases`:

```jsonc
"d1_databases": [{ "binding": "DB", "database_name": "sada", "database_id": "<الرقم هنا>", "migrations_dir": "migrations" }],
```

إن عرض عليك wrangler إضافتها إلى الملف تلقائيا، فوافق وتأكد أن `binding` هو `DB`.

### 4. إنشاء الجداول

```bash
npx wrangler d1 migrations apply sada --remote
```

يجب أن ترى `0001_init.sql` بعلامة النجاح.

### 5. الأسرار

```bash
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put MCP_ACCESS_KEY
```

- كل أمر يطلب القيمة في الطرفية. الصقها هناك.
- **لا تضع المفاتيح في المحادثة ولا في الملفات ولا في git.**
- `MCP_ACCESS_KEY`: رمز عشوائي من أحرف وأرقام فقط، 32 حرفا. مثلا: `openssl rand -hex 16`.
- مخزن الصوت (`AUDIO`، من نوع KV) يُنشأ عند أول نشر ولا يحتاج خطوة.

### 6. النشر

```bash
npm run deploy
```

يبني التطبيق ثم يرفعه باسم `sada-app`. في آخر المخرجات عنوان من نوع `https://sada-app.<حسابك>.workers.dev`.

### 7. عنوان خاص (اختياري)

أضف إلى `wrangler.jsonc`:

```jsonc
"routes": [{ "pattern": "sada.taalim.men", "custom_domain": true }],
```

ثم `npm run deploy` من جديد. Cloudflare ينشئ سجل DNS والشهادة. النطاق `taalim.men` يجب أن يكون في نفس حساب Cloudflare.

## بعد النشر: ما تتأكد منه

1. تفتح العنوان، وتظهر الصفحة الرئيسية.
2. تسجّل حسابا جديدا بالبريد، فتدخل صفحة `/app`.
3. في الأصوات: نور ويونس وأكرم.
4. تولّد صوتا قصيرا. إن لم يخرج صوت، افتح السجلات: `npx wrangler tail`.
5. في D1: `npx wrangler d1 execute sada --remote --command "select email from users"` يُظهر حسابك.

## التراجع

```bash
npx wrangler rollback
```

يعيد النسخة السابقة من التطبيق. بيانات D1 لا تتراجع.

## مشاكل معروفة وحلولها

| العَرَض | السبب والحل |
| --- | --- |
| خطأ 1102 (تجاوز المعالج) | الحساب على الخطة المجانية. فعّل Workers Paid. |
| الصوت المصمم لا يُسمع، ويتكلم صوت Google العادي | المفتاح من مشروع غير الذي أُنشئت فيه الأصوات. ضع مفتاح المشروع الصحيح، أو أعد تصميم الأصوات بمفتاحك الجديد: `gemini_design_voices.py`. |
| "انتهت حصة Google اليومية" | حصة المفتاح الحالية. المستوى الأول 100 طلب يوميا للنموذج. ارفع المستوى من AI Studio. |
| الأصوات المجانية الاحتياطية لا تعمل | على Workers لا يوجد خادم F5 ولا Piper. لتفعيلها ضع `TTS_SPEAKERS_URL` أو `TTS_DARIJA_URL` في `vars` داخل `wrangler.jsonc`، إن كان عندك خادم لها. |
| تسجيل الدخول لا يعمل | تأكد أن الجداول أُنشئت بالخطوة 4 وأن `binding` هو `DB`. |

## ما لا يغطيه هذا الدليل

- **الدفع:** لم يُربط مزوّد دفع بعد. الرصيد يُمنح بالتجربة المجانية فقط.
- **الحصة اليومية لـ Gemini:** لا تكفي مستخدمين كثيرين. راقب الاستهلاك قبل الإطلاق العام.
- **النسخ الاحتياطي لـ D1:** لم يُجهَّز. قبل الإطلاق خطّط له.

## التشغيل المحلي (للتجربة قبل النشر)

```bash
cd ~/my/app
npx wrangler d1 migrations apply sada --local
npm run preview
```

يعمل على Workers محليا بقاعدة D1 محلية.
