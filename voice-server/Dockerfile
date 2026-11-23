# Free Moroccan voices (هند F1, إدريس M1) on a GPU host: the F5-TTS Habibi DODa model.
# Build from the repository root:  docker build -f voice-server/Dockerfile -t sada-voice .
# Run:  docker run --gpus all -e F5_TOKEN=<24+ chars> -p 8080:8080 sada-voice
# Library versions are the ones measured in the darija-voice skill (2026-11-21).
# PyPI's Linux torch wheels include CUDA, so the same image runs on CPU or GPU.
FROM python:3.13-slim

ENV PIP_NO_CACHE_DIR=1 PYTHONUNBUFFERED=1 HF_HUB_DISABLE_XET=1

RUN apt-get update \
 && apt-get install -y --no-install-recommends ffmpeg curl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

RUN pip install torch==2.15.0 torchaudio==2.11.1 f5-tts==1.1.22 transformers==5.24.0 \
    soundfile==0.14.0 numpy==2.5.5 vocos==0.1.0 accelerate==1.16.0

WORKDIR /srv

# Model: Jip7e/habibi-tts-doda-darija, Apache-2.0. Hashes checked against the files we tested.
ARG HF=https://huggingface.co/Jip7e/habibi-tts-doda-darija/resolve/main
RUN mkdir -p models \
 && curl -fsSL -o models/model_ema.safetensors "$HF/model_ema.safetensors" \
 && curl -fsSL -o models/vocab.txt "$HF/vocab.txt" \
 && echo "38bfe6aeb86fdfafdf1a3175032b10576d9ce8540143af1ccfe4409b89bb5e4d  models/model_ema.safetensors" | sha256sum -c - \
 && echo "a49a0b74e12cb91de49a636f59c4045e3a1683d389fa6c223b53024faa9afbea  models/vocab.txt" | sha256sum -c -

# Fetch the vocoder at build time so a cold start does not download it.
RUN python -c "from f5_tts.infer.utils_infer import load_vocoder; load_vocoder('vocos')"

COPY .claude/skills/darija-voice/scripts/ scripts/
COPY .claude/skills/darija-voice/data/ data/

EXPOSE 8080
CMD ["sh", "-c", "exec python scripts/f5_server.py --ckpt models/model_ema.safetensors --vocab models/vocab.txt --refs data/refs --host 0.0.0.0 --port ${PORT:-8080}"]
