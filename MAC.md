# Run Sada on a MacBook Pro

Two parts, each optional:

1. **The web app** in your browser, with the Gemini voices نور and يونس.
2. **Our free voices** هند and إدريس, on your Mac.
   - On Apple M chips the voice library uses the Mac's GPU (`mps`) automatically.
   - On Intel Macs it runs on the processor, which is slow: about 35 s for a short sentence.

## 0. Install once

- **Homebrew**, from brew.sh.
- Then: `brew install node@22 python@3.13 git ffmpeg`

```bash
git clone https://github.com/itech327/my.git
cd my && git checkout claude/new-session-thirii
```

## 1. Web app

```bash
cd app
npm install
npm run build
```

Create `app/.env.local`. Git ignores it, so your key stays on your Mac:

```
TTS_GEMINI=1
GEMINI_API_KEY=your Gemini key
```

Then:

```bash
npm start
```

Open http://localhost:3000.

- Accounts and history live in memory: they reset when you stop the app.
- Payments are test-only.

## 2. Fast free voice for Intel Macs (recommended on Intel)

The fast version of إدريس (Piper) runs well on any processor.
- It speaks when you pick إدريس.
- It replaces نور and يونس automatically when Google's daily quota is spent.

From the repository root:

```bash
.claude/skills/darija-voice/scripts/setup.sh ~/sada-piper
```

Start it in a second Terminal window, and leave it open:

```bash
cd ~/my
~/sada-piper/venv/bin/python .claude/skills/darija-voice/scripts/server.py \
  --model ~/sada-piper/models/ary_MA-darija_m1-medium-v2.onnx --port 5005
```

Add this line to `app/.env.local`:

```
TTS_DARIJA_URL=http://127.0.0.1:5005
```

Then rebuild and restart the app: `npm run build && npm start`.

## 3. Studio free voices (optional, best on Apple M chips)

From the repository root:

```bash
python3.13 -m venv ~/sada-voice
~/sada-voice/bin/pip install torch==2.15.0 torchaudio==2.11.1 f5-tts==1.1.22 transformers==5.24.0 soundfile==0.14.0
mkdir -p ~/sada-voice/models && cd ~/sada-voice/models
HF=https://huggingface.co/Jip7e/habibi-tts-doda-darija/resolve/main
curl -fLO "$HF/model_ema.safetensors" && curl -fLO "$HF/vocab.txt"
shasum -a 256 model_ema.safetensors vocab.txt
```

Check the two fingerprints:

- `model_ema.safetensors`: `38bfe6aeb86fdfafdf1a3175032b10576d9ce8540143af1ccfe4409b89bb5e4d`
- `vocab.txt`: `a49a0b74e12cb91de49a636f59c4045e3a1683d389fa6c223b53024faa9afbea`

Start the voice service from the repository root:

```bash
HF_HUB_DISABLE_XET=1 ~/sada-voice/bin/python .claude/skills/darija-voice/scripts/f5_server.py \
  --ckpt ~/sada-voice/models/model_ema.safetensors --vocab ~/sada-voice/models/vocab.txt \
  --refs .claude/skills/darija-voice/data/refs --port 5007
```

The first start downloads the vocoder. The log line shows `device=mps` on an M chip.

Then add to `app/.env.local` and restart the app:

```
TTS_SPEAKERS_URL=http://127.0.0.1:5007
```

- هند and إدريس now speak in the app.
- نور and يونس switch to them automatically when Google's daily quota runs out.

## 4. Optional: your Mac as the connector's backup

A Cloudflare Tunnel can give the voice service a public address, so the Claude
connector uses your Mac when Google refuses. It only works while the Mac is on.
See `voice-server/README.md` and `connector/README.md`, section
"Free-voice backup".

**Never** open port 5007 to the internet without `F5_TOKEN`. The server
refuses to listen beyond your Mac without one.
