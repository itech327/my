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
