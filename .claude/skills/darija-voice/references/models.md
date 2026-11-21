# Darija TTS candidates

Read from the Hugging Face API on 2026-11-21. Licence is the model card's
`license` field. Check the training data licence too before shipping.

| model | licence | base | runtime | size | commercial? | notes |
| --- | --- | --- | --- | --- | --- | --- |
| maromoya/piper-darija | CC BY 4.0 | Piper ar_JO "Kareem" | Piper (ONNX, CPU) | 63 MB per voice | yes, with attribution | trained on DODa M1 voice (CC BY 4.0, AtlasIA). 206 epochs. **Chosen first: runs on any CPU** |
| KandirResearch/DarijaTTS-v0.1-500M | Apache-2.0 | OuteTTS 0.2 500M | transformers | 2.5 GB | yes | data: KandirResearch/DarijaTTS-clean. LLM-style, slower on CPU |
| Jip7e/habibi-tts-doda-darija | Apache-2.0 | Habibi-TTS (F5-TTS) | f5-tts | 6 GB | yes, check base and data | DODa audio. Likely the most natural. Needs a GPU |
| Tilas/neutts-air-darija-v1 | Apache-2.0 | NeuTTS Air | custom | 3 GB | check base | |
| medmac01/xtt2_darija_v0.1 | not stated | Coqui XTTS-v2 | coqui | 5.6 GB | **no**: XTTS-v2 base is non-commercial (CPML) | |
| Oussamamaat/golha-darija-tts | CC BY-NC 4.0 | Chatterbox | peft | 384 MB | **no** | |
| ai-ssam/darija-omnivoice-kore-v1 | CC BY-NC 4.0 | OmniVoice | omnivoice | 2.5 GB | **no** | |
| loubna1101/Qwen3-TTS-Darija-LoRa | not stated | Qwen3-TTS 1.7B | LoRA | 13 MB | unclear | |

Recognizer used as the yardstick:

| model | licence | notes |
| --- | --- | --- |
| boumehdi/wav2vec2-large-xlsr-moroccan-darija | Apache-2.0 | wav2vec2 CTC, 1.26 GB, CPU fine |

Open Darija data seen (licences not all checked yet): atlasia/DODa-audio-dataset,
Jip7e/doda-darija-cosyvoice2 (CC BY 4.0 per the Piper card),
KandirResearch/DarijaTTS-clean, atlasia/Moroccan-Darija-Wiki-Audio-Dataset,
BrunoHays/DVOICEv2.0-Darija, ai-ssam/darija-tts-8400.

Attribution for the product, as the Piper voice's licence asks:
"Darija voice based on maromoya/piper-darija (CC BY 4.0), trained on the
DODa corpus by AtlasIA and Jip7e/doda-darija-cosyvoice2."
