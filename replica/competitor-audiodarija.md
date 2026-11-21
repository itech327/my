# Competitor: AudioDarija.ma

Read 2026-11-21 from the public home page (https://audiodarija.ma/). Free,
5 visitor tries, unlimited after a free sign-up. Downloads in MP3 and WAV.

## What it offers

| feature | details | do we have it |
| --- | --- | --- |
| 6 Moroccan voices | 3 male, 3 female, each with a use case (Reels, corporate, podcast, luxury ads, education, stories) | 2 voices (إدريس, هند) |
| Delivery style | conversational, enthusiastic ads/Reels, radio, storyteller (حكواتي), customer service | calm and lively, story pace |
| Pace with natural pauses | calm (explanations), medium (recommended), fast (Reels) | story pace only |
| Regional accent | Casablanca, Rabat, North (Tangier, Tetouan), Marrakech, Fes, "white" simple Darija | no |
| Script templates | ad, welcome message, TikTok intro, company presentation | no |
| Auto-adapt text to Darija | a button rewrites the text into Moroccan Darija | no (our style_check only flags) |
| Playback speed | 0.8x to 1.5x | no |
| Library | saved generations after sign-up | history, 7 days |

## What engine it likely uses (inference)

The voice names are **Puck, Charon, Fenrir, Aoede, Kore, Zephyr**. These are
the names of Google Gemini's prebuilt text-to-speech voices. Style, pace and
accent are chosen in natural language, which matches how Gemini's TTS is
steered by prompt. Likely: Google Gemini TTS behind the site, plus an LLM
that rewrites text into Darija. **Not confirmed by the site.**

## Measured against us (the user generated the clips there)

Same 110-word well-permit story, judged by the Darija recognizer:

| | AudioDarija | هند | إدريس |
| --- | --- | --- | --- |
| CER | 0.088 | 0.101 | 0.094 |
| pitch movement | 7.6 st | 5.8 st (story) | |
| pauses of 0.15 s or more | 19, mean 0.69 s | 7, mean 0.99 s | |
| pace | about 139 words/min | about 116 | |

Clarity is level. The gap is prosody: more frequent and shorter breathing
pauses inside sentences, more pitch movement, a livelier pace.

## Rules

- Their output is a benchmark only. We do not clone their voices or train on
  their output: the voices are their product, built on a provider's voices.
- Their admin panel is not something to look at.

## Ideas worth taking (features, not assets)

1. Delivery-style presets with a one-line description each.
2. Pace presets with natural pauses.
3. Script templates for ads, welcome messages, Reels, company intros.
4. A "make it Darija" button (an LLM rewrite, with `style_check.py` after it).
5. Regional accent choice, once an engine can actually do it.
6. Test Google Gemini TTS ourselves through its official API with our own
   key, as an engine candidate for natural prosody.
