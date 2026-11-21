---
name: darija-voice
description: >-
  Builds, tunes and measures a Moroccan Darija text-to-speech voice from open
  models and data: finds candidate models on Hugging Face and checks their
  licences, normalizes Darija text (numbers in Moroccan words, Arabizi like
  "3afak" to Arabic letters, Moroccan letters), speaks it with an open Piper
  voice on a CPU, and scores intelligibility by transcribing the audio back
  with a Darija speech recognizer (CER and WER), then picks the best settings.
  Use when the user says "Moroccan voice", "Darija TTS", "صوت مغربي",
  "الدارجة", "make it speak Darija", "which Darija model", "test the Moroccan
  voice", or wants a Darija engine for the TTS clone.
---

# darija-voice

A Moroccan voice built from what is openly published, with numbers to prove
how good it is. Three parts:

1. **Front end** (`scripts/normalize.py`, standard library). Most Darija TTS
   errors come from the text, not the model: digits, Arabizi, French words,
   Moroccan letters. Fix them before the voice sees them.
2. **Voice** (`scripts/speak.py`). An open Piper model, 63 MB, CPU only,
   about 25 times faster than real time.
3. **Yardstick** (`scripts/evaluate.py`). Speak, transcribe with a Darija
   recognizer, compare. Tunes the settings by measurement.

## The rules

- **Licences first.** Read the model card and the training data licence
  before using a model. `cc-by-nc` means no commercial use. GPL code is fine
  on a server. Record the attribution the licence asks for.
- **Consent for voices.** Never train or clone a voice from people's videos,
  podcasts or social posts without their permission. Public is not the same
  as licensed. Use datasets whose licence and speakers allow it.
- **Measure, then listen.** CER and WER say whether it is understandable, not
  whether it sounds natural. A human listens to the best settings before
  they ship.
- **Say what is a guess.** The recognizer has its own errors. Report its
  limits next to the numbers.

## Step 1: find candidates

```bash
curl -s "https://huggingface.co/api/models?search=darija&filter=text-to-speech&sort=downloads&limit=20"
curl -s "https://huggingface.co/api/models/OWNER/NAME?blobs=true"   # licence, base model, files, size
```

Needs `huggingface.co` and its file host (`us.aws.cdn.hf.co`) allowed in the
environment. Check each candidate for: licence, base model and its licence,
training data and its licence, size, what runtime it needs. Write the table
into `references/models.md`.

## Step 2: get the voice running

```bash
python3 -m venv venv && ./venv/bin/pip install piper-tts==1.8.0
curl -L -o voice.onnx      https://huggingface.co/maromoya/piper-darija/resolve/main/ary_MA-darija_m1-medium-v2.onnx
curl -L -o voice.onnx.json https://huggingface.co/maromoya/piper-darija/resolve/main/ary_MA-darija_m1-medium-v2.onnx.json
./venv/bin/python scripts/speak.py --model voice.onnx --out hello.wav "سلام، واش نتا لاباس؟"
```

Check the download against the `x-linked-etag` sha256 Hugging Face returns.

## Step 3: front end

```bash
python3 scripts/normalize.py --test
python3 scripts/normalize.py "salam khoya, 3andi 350 dh"   # سلام خويا، عندي تلتمية وخمسين درهم
```

When a sentence comes out wrong, add a test case first, then fix it.
Common fixes: a word missing from `LEXICON`, a French word missing from
`FRENCH`, a number form.

## Step 4: measure and tune

```bash
./venv/bin/pip install torch transformers soundfile
# recognizer: boumehdi/wav2vec2-large-xlsr-moroccan-darija (Apache-2.0)
./venv/bin/python scripts/evaluate.py --model voice.onnx --asr ASR_DIR \
  --sentences data/test_sentences.txt --grid --json results.json
```

It tries tashkeel on or off, three speeds and two noise levels, ranks them by
CER, and prints the worst sentences. Fix those in the front end, run again.
Keep the results in `references/results.md` with the date.

Measured so far (`references/results.md`): **turn Piper's tashkeel off** for
Darija. Its diacritizer is trained on Standard Arabic. With tashkeel off and
French loanwords spoken in Darija form, CER fell from 0.444 to 0.120.
`speak.py` and `server.py` now default to tashkeel off.

Listen: `samples/demo-all.wav` (all 15 test sentences at the best settings).

## Step 5: plug into the app

The app expects a `TtsProvider` (`app/src/lib/tts/provider.ts`). Run the
voice as a small HTTP service next to the app (`server.py`), and write a
provider that calls it. The settings chosen in step 4 go in the service.

## Other voices: female and other speakers

`scripts/speak_f5.py` speaks in any of the 7 DODa speakers' voices (F1-F4,
M1-M3) with the Habibi F5-TTS model (Apache-2.0, 674 MB). Give it a clean
3-6 s reference clip and its exact transcript (`data/refs/`).

```bash
./venv/bin/pip install f5-tts vocos
curl -L -o model_ema.safetensors https://huggingface.co/Jip7e/habibi-tts-doda-darija/resolve/main/model_ema.safetensors
curl -L -o vocab.txt https://huggingface.co/Jip7e/habibi-tts-doda-darija/resolve/main/vocab.txt
HF_HUB_DISABLE_XET=1 ./venv/bin/python scripts/speak_f5.py --ckpt model_ema.safetensors --vocab vocab.txt \
  --ref data/refs/F1.wav --ref-text "هوما مخبيين شي حاجة انا متيقن" --out f1.wav "سلام عليكم"
```

`HF_HUB_DISABLE_XET=1` makes the vocoder download use plain HTTP when the
Xet transfer host is not allowed. Measured: female pitch 202 Hz, CER 0.06,
but about 10 times slower than real time on a CPU. Use a GPU in production.

## The learning loop (no GPU needed)

The skill improves between sessions only through files. Each round:

1. `evaluate.py ... --json results.json` measures the voice.
2. `mine_errors.py results.json` lists the words heard wrong most often.
3. Fix each one where it belongs: a missing word in `LEXICON` (Arabizi), a
   number form, or a respelling in `data/respell.tsv` (word, tab, a spelling
   the voice says right).
4. Run `evaluate.py` again. Keep the change only if CER drops. Add a test.

`select_ref.py` does the same for F5 voices: it ranks candidate reference
clips by measured CER, because the reference clip decides most of the
stutter. `f5_server.py` serves the chosen clips (`data/refs/SPEAKER.wav` +
`.txt`) to the app, sentence by sentence with pauses.

The comparison treats a final ا, ى and ه as one sound (دابا = دابه), so
spelling habits of the recognizer are not counted as voice errors.

`f5_server.py --asr ASR_DIR --best-of 3` makes the voice check itself: each
sentence gets up to 3 takes, the recognizer scores each one, the clearest is
kept. Measured: CER 0.080 to 0.040 on a 4-sentence paragraph, 2.5 times slower.

## Training: the only way past the ceiling

Tuning settings stopped helping (results run 3). A model learns new
pronunciation only by being trained on more speech. It does not learn from
being used, and Claude does not keep learning between sessions: whatever is
learned must be written into data, tests, the lexicon or model weights.

What to train, in order of value:

1. **Female Piper voice from DODa F1** (2,000 clips, CC BY 4.0). Same recipe
   as the existing voice: start from the Arabic Piper checkpoint `ar_JO`
   Kareem, fine-tune on F1. The male voice took 206 epochs, about 20 hours on
   a free Kaggle T4. Result: a female voice that runs fast on any CPU.
2. **Multi-speaker voice** from all 7 DODa speakers (12,105 clips).
3. **Moroccan-read Standard Arabic**: add licensed MSA speech read by
   Moroccan speakers, so news and lessons improve too.

Data rules:

- Only speech whose licence allows training, and whose speakers agreed to
  publication. Open datasets list this on their card.
- **Not** voices from social media posts, YouTube, TV or podcasts. Being
  public does not make them licensed, and it would clone real people
  without their consent.
- Text is different from voices: open Darija text corpora can grow the
  lexicon and the test set without cloning anyone.

Compute: this container has 4 CPU cores and no GPU. Training needs a GPU
(Kaggle or Colab free tier, or a rented cloud GPU). Prepare the data and the
config here, run the training there, bring the `.onnx` back, and measure it
with `evaluate.py` against the current voice before switching.

## Going further

- **Better voice:** fine-tune the Piper voice longer, or on more speakers,
  from licensed Darija speech (DODa audio, CC BY 4.0). Needs a GPU, about
  20 hours on a T4 for the current voice.
- **Bigger models:** F5-TTS and OuteTTS Darija fine-tunes (Apache-2.0) in
  `references/models.md` are more natural but need a GPU to be fast.
- **Several dialects:** the same method works for any dialect that has an
  open voice and an open recognizer.

## Output

A working voice, `references/models.md` (candidates and licences),
`references/results.md` (scores, best settings, worst sentences), and the
attribution text for the product.
