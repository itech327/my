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

## Run 4: female voice, measured fixes (2026-11-21)

Habibi F5-TTS, DODa speaker F1, 16 quality steps, on a 4-core CPU.

1. **Reference clip** (`select_ref.py`, 7 clips x 4 sentences): the 4.16 s
   clip `doda_000286` scored CER 0.014. The 2.7 s clip scored 0.031. Longer,
   clean reference: half the errors.
2. **Short pieces**: the service split at every comma, and 2-word pieces
   like "أنا هند" were dropped. Pieces under 5 words now merge with their
   neighbour.
3. **Speed** (8 sentences, Darija and MSA):

| speed | CER |
| --- | --- |
| 1.0 | 0.041 |
| **0.9 (default)** | **0.026** |
| 0.8 | 0.045 |
| 0.75 | 0.028 |

Differences are within chance. Speed is not the lever; the reference clip is.

| voice | CER on its test | speed on CPU |
| --- | --- | --- |
| Piper male (fast) | 0.16 (30 sentences) | about 25 times faster than real time |
| **F5 female F1** | **about 0.03** (8 sentences) | about 5 to 10 times slower than real time |

The female voice is the most intelligible Darija voice measured so far. It
is in the app as a premium "studio" voice with a slower-generation note.

## Run 5: best-of-N with self-checking (2026-11-21)

F5-TTS is random: the same sentence can come out clean once and with a
swallowed word the next time. The weather paragraph scored CER 0.080 on one
take ("والشمس طالعة" heard as "وشم طلعة").

`f5_server.py --asr ASR_DIR --best-of 3`: up to 3 takes per sentence, each
transcribed by the Darija recognizer, the clearest kept, stopping early when
a take reaches CER 0.03.

| version | CER | takes per sentence | time |
| --- | --- | --- | --- |
| single take | 0.080 | 1, 1, 1 | 80 s |
| **best of 3, self-checked** | **0.040** | 3, 3, 1 | 204 s |

Half the errors, at about 2.5 times the time. Use it for studio voiceovers.

## Run 6: إدريس moved to F5-TTS with DODa M1 (2026-11-21)

`select_ref.py` on 6 M1 clips: best `doda_004235` (3.95 s), CER 0.014.
Then the user's 110-word well-permit story, best of 3 takes per piece,
transcribed in 20 s windows:

| voice | engine | CER | WER | time for 46-62 s of audio |
| --- | --- | --- | --- | --- |
| إدريس before | Piper (M1) | 0.228 | 0.691 | 2 s |
| **إدريس now** | **F5-TTS + M1 reference, self-checked** | **0.094** | 0.473 | 937 s |
| هند | F5-TTS + F1 reference, self-checked | 0.101 | 0.455 | 930 s |

Same speaker, 2.4 times fewer character errors. The cost is time: about 20
times slower than real time on 4 CPU cores. A GPU would make it near real time.

## Run 7: F5 settings for إدريس (M1), same seeds per sentence (2026-11-21)

`tune_f5.py`, 6 sentences, the same random seed for each sentence in every config.

| reference | NFE | CFG | CER | per sentence |
| --- | --- | --- | --- | --- |
| M1 (3.95 s) | 16 | 2.0 | 0.041 | 0, .08, .10, .02, 0, .05 |
| M1 | 16 | 3.0 | 0.041 | identical |
| M1 | 32 | 2.0 | 0.041 | identical |
| M1 | 32 | 3.0 | 0.041 | identical |
| M1x2 (9.1 s, two clips) | 16 | 2.0 | 0.047 | .04, .08, .10, .02, 0, .05 |

Finding: **the F5 settings are exhausted.** Quality steps, text adherence and a
longer reference change nothing measurable; NFE 32 only doubles the time.
The remaining errors sit on the same words every time: systematic, not luck.

Text side: a DODa spelling rule (prefer the corpus spelling: إلى -> الى,
أصلا -> اصلا) is in `normalize.py` with `data/doda_vocab.tsv`. It did not touch
these 6 sentences, so no measurable change here. The corpus itself mixes
spellings (الثمن 13 times, التمن 0), so ث/ذ/ظ have no safe rule.

Next lever: a different or better-trained model, not settings.

## Run 8: another open model, KandirResearch/DarijaTTS-v0.1-500M (2026-11-21)

Apache-2.0, OuteTTS 0.2 base, run through `outetts==0.3.3` (transformers, CPU),
temperature 0.3, the same 6 sentences as run 7.

| model | CER | speed on 4 CPU cores |
| --- | --- | --- |
| **Habibi F5-TTS + M1 reference** | **0.041** | about 8 times slower than real time |
| DarijaTTS 500M | 0.468 | about 6 times slower than real time |

DarijaTTS repeats and invents words ("السلام ليكم ليكم"). Not a candidate.
Habibi F5-TTS stays the engine. Not yet tested: Tilas/neutts-air-darija-v1 (Apache-2.0).
