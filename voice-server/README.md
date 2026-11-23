# Sada free voice server

Our own Moroccan voices on a GPU: هند (`F1`) and إدريس (`M1`), from the
F5-TTS Habibi DODa model (`Jip7e/habibi-tts-doda-darija`, Apache-2.0).
It is the backup when Google refuses (daily quota, overload).

On a CPU a short sentence takes about 35 s. A GPU is needed to answer within
Claude's 60 s connector limit.

## Build and run

From the repository root:

```bash
docker build -f voice-server/Dockerfile -t sada-voice .
docker run --gpus all -e F5_TOKEN=<private code, 24+ characters> -p 8080:8080 sada-voice
```

- `POST /synthesize` with `{"text": "...", "speaker": "M1"}` and header
  `Authorization: Bearer <F5_TOKEN>` returns a WAV.
- `GET /health` lists the speakers.
- Without `F5_TOKEN` the server refuses to listen beyond loopback.
- The image is large: torch with CUDA plus the 674 MB model.

## Hosting

Any GPU host that runs a Docker image and gives it an HTTPS address works.
Prefer one that scales to zero when idle, to pay only when Google refuses.
A cold start loads the model, so the first request after a pause can take
longer than Claude's 60 s limit.

## Connect it

- **Connector** (Cloudflare): in the Worker's Variables and Secrets, set
  `FREE_VOICE_URL` (variable, the server's HTTPS address) and
  `FREE_VOICE_TOKEN` (secret, the same F5_TOKEN).
- **Web app**: set `TTS_SPEAKERS_URL` to the address and `TTS_SPEAKERS_TOKEN`
  to the token.
