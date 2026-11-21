#!/usr/bin/env bash
# Install the Darija voice (and optionally the recognizer used to score it).
#   scripts/setup.sh DIR            voice only, ~70 MB
#   scripts/setup.sh DIR --eval     plus torch, transformers and the recognizer, a few GB
# Needs huggingface.co and us.aws.cdn.hf.co reachable.
set -euo pipefail
DIR=${1:?usage: setup.sh DIR [--eval]}
mkdir -p "$DIR/models"
python3 -m venv "$DIR/venv"
"$DIR/venv/bin/pip" install -q piper-tts==1.8.0
HF=https://huggingface.co
V=ary_MA-darija_m1-medium-v2
for f in "$V.onnx" "$V.onnx.json"; do
  [ -s "$DIR/models/$f" ] || curl -fsSL -o "$DIR/models/$f" "$HF/maromoya/piper-darija/resolve/main/$f"
done
echo "c73cc15a9c34746c8a17347a5e8a6fb03ba4f7f0681c34c36d3a42eb7279778b  $DIR/models/$V.onnx" | sha256sum -c -
if [ "${2:-}" = "--eval" ]; then
  "$DIR/venv/bin/pip" install -q torch transformers soundfile
  mkdir -p "$DIR/models/asr"
  for f in config.json preprocessor_config.json special_tokens_map.json tokenizer_config.json vocab.json pytorch_model.bin; do
    [ -s "$DIR/models/asr/$f" ] || curl -fsSL -o "$DIR/models/asr/$f" "$HF/boumehdi/wav2vec2-large-xlsr-moroccan-darija/resolve/main/$f"
  done
fi
echo "ready. speak:  $DIR/venv/bin/python $(dirname "$0")/speak.py --model $DIR/models/$V.onnx --out hello.wav 'سلام'"
