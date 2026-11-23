# مكتبة صدى الصوتية

A reference audio library in Moroccan Darija and Moroccan-style Standard
Arabic, for teaching on platforms, apps and websites.

## Pilot

Middle school (الإعدادي), numbers and operations, 20 items:

- **10 in Standard Arabic, voice نور:** counting, large numbers, negatives, decimals, fractions, percentages, the four operations.
- **10 in Darija, voice يونس:** counting in Darija, everyday explanations of the same ideas, classroom phrases.

## Files

| Path | What |
| --- | --- |
| `catalog.json` | Every item: id, level, subject, topic, title, mode, voice, delivery, text, status, file |
| `audio/<id>.mp3` | The audio, mono 64 kbps |
| `generate.mts` | Makes the missing audio with the Gemini voices |

Status flow: `pending`, then `generated`, then `approved` or `rejected` after a native listener reviews it.
Only `approved` items are reference material.

## Generate

From the repository root:

```bash
npx --prefix app tsx library/generate.mts
```

- Needs `GEMINI_API_KEY` and ffmpeg.
- In the cloud session, run it from `app/` as `NODE_USE_ENV_PROXY=1 npx tsx ../library/generate.mts`. Without it Node skips the proxy and Google answers 400 invalid key.
- It stops cleanly when Google's daily quota is spent. Run it again the next day to continue.
- `--only ID` makes one item. `--redo` remakes items that already have audio.

## Rights and use

- **Allowed:** using these Gemini voices in teaching material and apps.
- **Not allowed:** Google's terms forbid using Gemini output to develop a competing speech model. Never train a voice on this library.
- **Disclosure:** tell learners the voices are AI-generated.
