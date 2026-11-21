# Evaluation results

Voice: `maromoya/piper-darija` v2 (`ary_MA-darija_m1-medium-v2.onnx`).
Yardstick: `boumehdi/wav2vec2-large-xlsr-moroccan-darija`, round trip on the
15 sentences in `data/test_sentences.txt`. CER and WER after removing
diacritics and punctuation and unifying alef, ya and ta marbuta.
Run on a 4-core CPU, 2026-11-21.

## Run 1: model defaults vs settings, original front end

| tashkeel | speed | noise | CER | WER |
| --- | --- | --- | --- | --- |
| on (Piper default) | 1.0 | 0.667 (default) | 0.444 | 0.854 |
| on | 1.0 | 0.5 | 0.421 | 0.743 |
| off | 1.0 | 0.5 | 0.331 | 0.537 |
| off | 1.1 | 0.5 | 0.327 | 0.595 |

Finding: Piper's automatic diacritizer is trained on Standard Arabic and adds
MSA vowels to Darija words. Turning it off cut CER by about a quarter.

The worst sentence was Arabizi with French words left in Latin letters
(CER 2.33). The voice reads Arabic letters only.

## Run 2: French loanwords spoken in Darija form, bigger lexicon

| tashkeel | speed | noise | CER | WER |
| --- | --- | --- | --- | --- |
| on | 1.0 | 0.667 | 0.253 | 0.673 |
| off | 0.9 | 0.667 | 0.136 | 0.367 |
| **off** | **1.0** | **0.667** | **0.120** | 0.438 |
| off | 1.1 | 0.667 | 0.147 | 0.429 |

Best: **tashkeel off, speed 1.0, model's default noise.** CER went from 0.444
(defaults, original front end) to 0.120: about 3.7 times fewer character errors.

## Limits of these numbers

- The recognizer makes its own mistakes. Part of the remaining error is its
  error, not the voice's. A human recording through the same recognizer
  would also score above zero.
- noise adds randomness to each synthesis. Differences of 0.02 to 0.03 CER
  between settings can be chance. The tashkeel finding is far larger than that.
- 15 sentences is a small test. Grow `data/test_sentences.txt`.
- CER measures intelligibility, not naturalness or accent. Listen.

## Remaining weak spots (best settings)

- "عطيني جوج كيلو د الطماطم": the "د" particle and long vowel words.
- "الدرس" heard as "الترس", "بيكم" as "كيكون": consonant clarity.
- Final words of long sentences are sometimes dropped by the recognizer.

Next: more test sentences, then compare against the Apache-2.0 F5-TTS and
OuteTTS Darija models on a GPU.

## Female voice: Habibi F5-TTS with DODa speaker F1 (2026-11-21)

`Jip7e/habibi-tts-doda-darija` (Apache-2.0), reference `data/refs/F1.wav`.
Sentence: the tajine recipe in Arabizi with numbers.

| measure | value |
| --- | --- |
| pitch, F1 reference | 214 Hz |
| pitch, generated | 202 Hz (female range) |
| CER / WER | **0.06** / 0.31 |
| speed on 4 CPU cores | 9.1 s of audio in 87 s (about 10 times slower than real time) |

More natural and more intelligible than the Piper voice on this sentence,
but too slow on a CPU for the app. Needs a GPU in production, or a Piper
voice trained on F1 for fast CPU use.

## Run 3: stutter and pauses, 30 sentences incl. Standard Arabic (2026-11-21)

Grid over duration noise (noise_w 0.3, 0.5, 0.8), speed (0.9, 1.0) and
phrase pauses (on, off), tashkeel off.

| setting | CER | WER |
| --- | --- | --- |
| **speed 1.0, noise_w 0.5, pauses on** | **0.160** | 0.506 |
| speed 1.0, noise_w 0.3, pauses off | 0.171 | 0.527 |
| speed 0.9, noise_w 0.8, pauses off | 0.237 | 0.560 |

Finding: **settings have reached their ceiling.** Most differences are
within the run-to-run noise (about 0.03). The larger test set scores worse
than run 2 because it adds Standard Arabic: the voice was trained on Darija
only, and the recognizer is a Darija recognizer, so both sides are weak on
MSA. Remaining errors are the model's limits, not its settings.

Next real gain needs **training**, not tuning: fine-tune on more licensed
speech (Darija and Moroccan-read MSA) on a GPU. See SKILL.md, "Training".
