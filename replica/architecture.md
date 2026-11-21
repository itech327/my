# Architecture: working name TBD (a rebuild of ArabyVoice's core features)

Reads `replica/recon.md` and `replica/features.csv`. Scope is still the
proposed one: the core TTS loop plus credits. Cloning, SFX and the API are
planned but come after the vertical slice.

## Stack

| layer | choice | why |
| --- | --- | --- |
| web | Next.js App Router + TypeScript | one codebase for the marketing pages, the app and the API routes. Server components keep the 17 dialect pages fast for SEO |
| styling | Tailwind with logical properties (`ms-`, `pe-`, `start-`) | the product is RTL Arabic first. Logical properties make RTL the default and LTR cheap later |
| database | Postgres on Supabase | RLS, auth and storage in one managed service. Credit maths needs real transactions and row locks |
| ORM | Drizzle | thin, typed, keeps the SQL in `schema.sql` readable |
| auth | Supabase Auth, email plus Google | built in, works with RLS through `auth.uid()` |
| speech engine | **open decision**, behind one `TtsProvider` interface | the product lives or dies on this. See below |
| payments | **open decision**: Stripe if your business entity can use it, else a merchant of record such as Paddle or Lemon Squeezy | local-currency checkout matters for Morocco, Saudi and Egypt. Check eligibility for your country before choosing |
| email | Resend | sign-up verification, receipts, "your audio expires tomorrow" |
| jobs | Inngest | long generations, retries, the daily expiry sweep. Vercel functions alone time out on long texts |
| files | Supabase Storage, private bucket, signed URLs | audio is private to its owner and deleted after 7 days |
| hosting | Vercel | zero config for Next.js, preview deploys per branch |

### The speech engine decision

Recon found that the original runs its audio through a third-party provider.
The clone must pick and license its own. Requirements from the recon:

1. Natural speech in as many of the 17 dialects as possible. Maghreb dialects
   (ar-MA, ar-DZ, ar-TN) and ar-MR are the hardest to find.
2. Correct pronunciation with and without tashkeel.
3. Style or emotion control: whisper, laugh, sad, angry, pace.
4. Voice cloning with consent, and text-to-SFX, for the later milestones.
5. A commercial licence that lets your users own and sell the audio.
6. A cost per audio minute well under what you charge. The original's
   cheapest pack is $10 for 30 minutes, about $0.33 a minute. Its biggest is
   $99 for 900, about $0.11 a minute.

Candidates to evaluate: Azure AI Speech, ElevenLabs, Google Cloud
Text-to-Speech, and any Arabic-specialist vendor. I have not checked their
current dialect lists, prices or terms. Network access to their docs is not
on in this environment. Do this before writing provider code:

- list each candidate's Arabic locales and voices against the 17 dialects
- generate the same 5 test sentences per dialect and listen. One must be
  Moroccan Darija, one undiacritised MSA
- confirm the commercial terms and the per-minute price at your expected volume

The `TtsProvider` interface keeps this swappable, and a mix is possible:
one engine for the Gulf and Levant, another for Darija.

```ts
interface TtsProvider {
  id: string;
  listVoices(): Promise<ProviderVoice[]>;
  synthesize(req: {
    voiceId: string; dialect: Dialect; text: string; tags: EmotionSpan[];
  }): Promise<{ audio: ReadableStream; seconds: number; format: 'mp3' }>;
  cloneVoice?(sample: Blob, consent: ConsentRecord): Promise<ProviderVoice>;
  soundEffect?(prompt: string, seconds?: number): Promise<{ audio: ReadableStream; seconds: number }>;
}
```

Emotion tags live in the text as our own neutral markup, for example
`[همس]...[/همس]`. Each provider adapter translates them to whatever that
engine supports, and drops the ones it cannot do.

## Schema

Tables: 9. Access rules: Postgres RLS on every table. Full SQL in
`replica/schema.sql`, loaded and tested on Postgres 16.

| table | holds |
| --- | --- |
| profiles | one row per auth user |
| trial_claims | a hash of each email that got the free minute. Survives account deletion |
| purchases | paid orders, kept after deletion for accounting |
| credit_lots | each grant of seconds with its own expiry |
| credit_ledger | append-only log of every change in seconds |
| voices | stock voices from the engine, and users' cloned voices |
| generations | each TTS or SFX job, its text, audio key, charge and 7-day expiry |
| api_keys | hashed keys, shown once |
| webhook_events | payment webhook ids already handled |

Rules the database enforces, not the UI:

- credits only move through `reserve_credits` and `release_credits`, which
  lock rows so two parallel generations cannot spend the same seconds.
  Tested: reserve 100 from 1860 leaves 1760, release 30 leaves 1790, an
  overdraw returns false
- one free regeneration per original (`one_free_regen` unique index).
  Tested: the second insert is rejected
- a cloned voice cannot exist without a consent time
- a TTS generation needs a voice and a dialect

Metering: seconds of output audio, the unit the original sells in. Before a
generation, reserve an estimate from the character count. After it, release
the difference between the estimate and the real length. On failure,
release it all.

## API

### Pages (server-rendered)

| route | screen | notes |
| --- | --- | --- |
| `/` | S01 | marketing home |
| `/[dialect]` | S02 | one template, 17 static pages from a dialect config file |
| `/pricing` | S03 | |
| `/login`, `/signup` | S08, S09 | Supabase Auth UI |
| `/app` | S10 | the editor |
| `/app/voices` | S11 | |
| `/app/history` | S14 | |
| `/app/billing` | S15 | |
| `/app/settings` | S16 | profile, API keys, delete account |
| `/app/clone` | S12 | milestone 3 |
| `/app/sfx` | S13 | milestone 4 |

### Server actions and routes

| method path | does | who | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| action `claimTrial` | grant 60 s once per email hash | signed-in user, on first login | none | balance | F01 |
| GET `/api/voices` | list ready voices for a dialect | signed in | dialect, use_case | voices | F02 |
| POST `/api/generations` | validate, reserve, queue job | signed in | voice_id, dialect, text | generation id | F02 |
| GET `/api/generations/:id` | status and signed audio URL | owner | id | status, url, seconds | F02 |
| POST `/api/generations/:id/regenerate` | free once if under 500 words and same inputs, else charged | owner | id | new generation id | F03 |
| GET `/api/generations` | history, newest first, paged | owner | cursor | list | F02 |
| POST `/api/checkout` | start a checkout for a pack in the user's currency | signed in | pack, currency | checkout URL | F05 |
| GET `/api/balance` | seconds left, next expiry | signed in | none | balance | F05 |
| POST `/api/keys` | create a key, return it once | signed in | name | key | F07 |
| DELETE `/api/keys/:id` | revoke | owner | id | ok | F07 |
| POST `/api/v1/tts` | public API: same as generations, key auth | API key | voice_id, text | id, then poll | F07 |
| DELETE `/api/account` | delete account, keep the trial hash and purchases | signed in | confirm | ok | F08 |
| POST `/api/voices/clone` | upload sample with consent | signed in | file, name, consent, visibility | voice id | F04 |
| POST `/api/sfx` | text to sound effect | signed in | prompt | generation id | F06 |

Webhooks in: payment provider (`payment succeeded` grants a credit lot,
`refunded` claws it back). Verify the signature, insert the event id into
`webhook_events` first, skip if it already exists.

Webhooks out: none at launch. API users poll.

Jobs:

| job | schedule | does |
| --- | --- | --- |
| `synthesize` | on each queued generation | call the provider, stream audio to storage, settle credits, retry twice, then fail and release |
| `expire-audio` | daily | delete storage objects and clear text where `expires_at` has passed, mark rows `expired` |
| `expire-credits` | daily | zero expired lots, write `expire` ledger rows |
| `expiry-reminder` | daily | email users whose audio expires in 24 h |

## The parts that bite

- **RTL and mixed text:** Arabic with Latin brand names and numbers. Use
  `dir="auto"` on the editor, test cursor movement and selection for the
  emotion-tag toolbar.
- **Diacritics:** tashkeel is optional input. Normalise text before
  counting characters, so diacritics do not inflate the charge.
- **Races:** two tabs generating at once. Handled by the row locks in
  `reserve_credits`.
- **Idempotency:** payment webhooks arrive twice. `webhook_events` primary
  key. The synthesize job must not charge twice on retry: settle once, keyed
  by generation id.
- **Long texts:** split at sentence boundaries, synthesize in chunks,
  concatenate. Keeps each call under provider and function limits.
- **Rate limits:** per user and per API key on `/api/generations` and
  `/api/v1/tts`. Sign-up rate limit to protect the free minute.
- **Abuse of the free minute:** hashed email claims stop re-signups with the
  same address. Disposable-email domains need a blocklist.
- **Voice cloning misuse:** consent checkbox stored with a time, a takedown
  path, and the provider's own rules on top.
- **Data retention:** the original deletes audio and text after 7 days.
  Keep that, and say so on the pricing page.
- **Deletion:** account delete removes generations, voices, lots and the
  ledger. It keeps purchases for accounting and the trial hash only.
- **Time zones:** times stored as UTC `timestamptz`. Credit expiry shown in
  the user's zone.
- **Currency:** prices are stored per currency, not converted live. Money in
  integer minor units with a currency code.

## Build order

1. **Vertical slice.** Sign up, get the free minute, pick a dialect and
   voice, type text, generate, play, download. One provider, two dialects,
   ar-MA and ar-fusha. Ugly UI.
   Screens S08, S09, S10. Tables profiles, trial_claims, credit_lots,
   credit_ledger, voices, generations. Routes `claimTrial`, `/api/voices`,
   `/api/generations`, `/api/generations/:id`. Job `synthesize`.
2. **Must-haves.** All 17 dialects the engine supports, diacritics checks,
   history, minutes shown and charged, buy packs, account deletion.
   Screens S14, S15, S16. Tables purchases, webhook_events. Routes checkout,
   balance, account delete, the payment webhook. Jobs expire-audio,
   expire-credits.
3. **Should-haves.** Emotion tags, local-currency prices, the voice library
   with filters, the 7-day expiry email, voice cloning, the API.
   Screens S11, S12. Table api_keys. Routes keys, `/api/v1/tts`, clone.
4. **Could-haves.** Free regeneration, sound effects, the 17 dialect landing
   pages, the blog. Screens S02, S04, S13.
5. **Fixes from replica-entrepreneur.** Not run yet. One candidate already:
   the original's credits expire, and expiry is a common complaint about
   prepaid tools. Decide after reading real reviews.

## Open decisions for you

1. The speech engine, after the listening test above.
2. The payment provider, after checking which ones serve your country.
3. Confirm the scope: sell it as a product, or use it for your own content.
