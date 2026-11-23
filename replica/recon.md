# Recon map: ArabyVoice (web)

Scope (proposed, not yet confirmed): the core text-to-speech loop. Pick a
dialect and voice, type Arabic text, tag emotions, generate, play and
download. Plus prepaid minute credits and the free trial minute.
For: unconfirmed. Assumed to be a product to sell to Arabic content creators.
Date: 2026-11-21

Status: built from public pages only. Screens S08 to S16 are inferred from
the marketing site and terms. None were seen logged in. A pass through the
user's own account would confirm them.

## Sources

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | marketing home | https://arabyvoice.com/ | voices, dialects, cloning, SFX, emotion tags, FAQ. Read 2026-11-21 |
| 2 | pricing | https://arabyvoice.com/pricing | rendered in a browser 2026-11-21: Free 60 s; 6 $/month for 30 min; 15 $/month for 2 h; 49 $/3 months for 7 h; 69 $/6 months for 15 h. Unused minutes roll over when you renew before expiry. The page's schema.org block says 10/20/99 $ and is out of date |
| 3 | terms | https://arabyvoice.com/terms | API, cloning, credits, retention, deletion, free regenerate. Last updated 2026-09-25 |
| 4 | dialect landing | https://arabyvoice.com/Egypt | one of 17 SEO pages, same template per dialect |
| 4b | dialect landing | https://arabyvoice.com/Morocco | same template as /Egypt. Only the dialect name, 6 voice cards and FAQ wording change. Read 2026-11-21 |
| 5 | about | https://arabyvoice.com/about | solo founder, Morocco |
| 6 | help center | none found | no docs link on the site |
| 7 | public API docs | none found | terms mention an API, no public docs linked |
| 8 | app store listing | none found | web only (schema says operatingSystem Web) |
| 9 | changelog | none found | |
| 10 | user's own account | not used | needs the user, driven by them |

Terms check: no clause forbids using an account to build a competing
product. Section 11 says they can read all text you enter. Do not paste
anything private into their app while doing recon.

## Core loop

Type Arabic text, pick a dialect and a voice, generate realistic speech,
download the audio. Usage is paid in minutes, bought as plans of 1, 3 or 6 months. Unused minutes roll over on renewal.

## Screens

| ID | screen | route / how to reach | purpose | key components | states seen |
| --- | --- | --- | --- | --- | --- |
| S01 | home | / | pitch, voice samples, dialects, cloning and SFX demos, FAQ | top nav, hero CTA, voice sample cards with player, dialect chips, before/after clone players, SFX cards, emotion tag demo, FAQ accordion, footer | filled |
| S02 | dialect landing x17 | /Egypt, /Morocco, /Saudi-Arabia, /Fusha ... | SEO page per dialect, same template, dialect-specific voices | same as S01, dialect word swapped in title, meta, headline, voices heading and first FAQ. 6 voice cards per dialect with use-case tags. Morocco uses "الدارجة المغربية", not "اللهجة". Clone and SFX demos are shared across all pages | filled |
| S03 | pricing | /pricing | plans and local-currency pay | 4 paid plan cards with a name tab, price, minutes, feature checks, validity note, savings pill, subscribe button. Free card centred below | loading (full-page spinner), filled. Screenshot in screens/S03-desktop.png |
| S04 | blog index | /blog | SEO content | post list | not read |
| S05 | contact | /contact | support form | form | not read |
| S06 | about | /about | founder story | text, founder card | filled |
| S07 | terms, privacy | /terms, /privacy | legal | long text | filled |
| S08 | sign up | /signup | create account, get 1 free minute | email, password, Google (guess) | not seen |
| S09 | log in | /login | sign in | form | not seen |
| S10 | generate (editor) | after login (inferred) | the core loop | text area, dialect picker, voice picker, emotion tag toolbar, speed, generate button, player, download, minutes left | not seen. Inferred from S01 and terms 13 |
| S11 | voice library | inferred | browse 3000+ voices by dialect and use case | filters (dialect, gender, use case), voice cards with preview, premium badge | not seen. Inferred from S01 voice cards |
| S12 | voice cloning | inferred | upload a sample, create a private or public voice | upload, consent checkbox, privacy toggle, name | not seen. Inferred from S01 and terms 8 |
| S13 | sound effects | inferred | text prompt to SFX | prompt box, duration, generate, player | not seen. Inferred from S01 |
| S14 | history | inferred | past generations, re-download, free regenerate | list, player, download, regenerate, 7-day expiry note | not seen. Inferred from terms 10 and 13 |
| S15 | billing / wallet | inferred | buy minutes, see balance and expiry, invoices | plan cards, local currency, balance | not seen. Inferred from terms 6 and pricing meta |
| S16 | account settings, API keys | inferred ("إعدادات الحساب" named in terms 12) | profile, delete account, API keys | key list, create and revoke, delete account | not seen |

## Flows

```
F01 New user tries it free
    S01 -> S08 sign up -> S10 generate with 1 free minute -> download
    happy path clicks: about 5 (guess)
    edge: email reused after deletion gets no free minute (terms 12),
          free minute used up mid-text

F02 Generate a voiceover (core loop)
    S10 pick dialect -> pick voice -> type text -> tag emotions -> generate -> play -> download
    happy path clicks: about 6 (guess)
    edge: text longer than balance, diacritics (tashkeel) handling,
          mixed dialect text, generation fails

F03 Regenerate once for free
    S14 or S10 -> regenerate same text, voice, dialect and style
    edge: over 500 words (no free regen), second regen is charged,
          API users excluded, no active subscription

F04 Clone own voice
    S12 upload sample -> confirm consent -> set private/public -> use in S10
    edge: no consent, poor audio, private voice still held by the provider

F05 Buy minutes
    S03 or S15 -> pick plan -> pay in local currency -> balance updates
    edge: payment fails, minutes expire at the end of the period,
          renewing early adds leftover minutes to the new balance and extends expiry

F06 Make a sound effect
    S13 describe the scene -> generate -> play -> download

F07 Use the API
    S16 create key -> call API -> minutes deducted
    edge: key leaked, abuse suspension

F08 Delete account
    S16 -> confirm -> all audio, balance gone, email kept to block a second free minute
```

## Components

| component | variants | states | used on |
| --- | --- | --- | --- |
| Top nav | marketing, app (guess) | default, mobile menu | all |
| Button | primary (start free), secondary | default, hover, disabled, loading | all |
| Voice card | standard, premium badge | idle, playing | S01, S02, S11 |
| Audio player | inline mini, before/after pair | idle, playing, ended | S01, S02, S10, S13, S14 |
| Dialect chip | 17 dialects | default, selected | S01, S02, S10, S11 |
| Emotion tag | laugh, whisper, sad, angry, fast, slow, more | default, applied to selection | S01 demo, S10 |
| SFX card | with prompt caption | idle, playing | S01, S13 |
| FAQ accordion | | closed, open | S01, S02 |
| Plan card | free, 3 paid packs | default, highlighted (guess) | S03, S15 |
| Text editor | rich, with tagged spans | empty, filled, over limit | S10 |

The site is RTL Arabic throughout. The clone needs RTL first, not as a toggle.

## Inferred data model

```
User         id, email, created_at, free_minute_granted (bool)
             evidence: terms 12 (email kept after deletion to stop a second free minute)
             confidence: high

Wallet       user_id, minutes_balance, expires_at
             evidence: terms 6 (credit valid for the pack's period, then lost)
             confidence: high

Purchase     id, user_id, pack, amount, currency, created_at
             evidence: pricing meta (pay in local currency), terms 12 (payment records kept)
             confidence: high

Voice        id, name, dialect, use_case (documentary, ads, education, dialogue,
             podcast, stories), premium (bool), owner_user_id (null for stock),
             visibility (private | public), source (stock | cloned)
             evidence: S01 voice cards, terms 8 (private option)
             confidence: medium

Generation   id, user_id, voice_id, dialect, style, text, word_count,
             duration_seconds, minutes_charged, audio_url, created_at,
             expires_at (created_at + 7 days), regenerated_from_id, free_regen_used (bool)
             evidence: terms 10 (7-day deletion of audio and text), terms 13 (free regen rules)
             confidence: medium

EmotionSpan  generation_id, start, end, tag
             evidence: S01 emotion demo
             confidence: guess. May be inline markup in text instead

SoundEffect  id, user_id, prompt, audio_url, created_at
             evidence: S01 SFX demos
             confidence: guess

ApiKey       id, user_id, prefix, hash, created_at, revoked_at
             evidence: terms 7
             confidence: medium
```

Relationships: User 1-1 Wallet, User 1-n Purchase, User 1-n Generation,
User 1-n Voice (cloned), Voice 1-n Generation, User 1-n ApiKey.

## Feature matrix

See `features.csv`. Must: 12, should: 9, could: 7, skip: 3.

## Out of scope (cannot or should not be cloned)

- **The speech engine itself.** Terms 8 says audio runs through a third-party
  provider. The quality you heard is that provider's model. The clone must
  pick its own TTS engine with its own licence.
- **The 3000+ voice library.** Most of it is very likely the provider's
  stock voices. The clone gets whatever voices its own engine licenses.
- **Their named voices and demo audio** (Rashed, Lalla Nadia, Marwa...).
  Owned or licensed by them. Never reuse names, samples or clips.
- **The rating of 4.9 from 1250** in their schema data. Not something to copy.

## Size

Screens 16 (7 seen, 9 inferred), flows 8, entities 8. Hard parts: choosing
and licensing a TTS engine with real Arabic dialect quality; emotion tags
mapped to what that engine supports; prepaid minutes with expiry and
local-currency payments (Morocco, Saudi, Egypt). Size: M, a few weeks, once
the engine is chosen. Engine quality decides whether it can compete at all.
