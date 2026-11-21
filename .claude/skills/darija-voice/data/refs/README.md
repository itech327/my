# Reference voices

| file | speaker | transcript (verbatim) | source |
| --- | --- | --- | --- |
| F1.wav + F1.txt | DODa F1, female, 4.16 s, 24 kHz | كانت هاديك هي الطريقة الوحيدة باش نجعلوهم يردو لينا ماكلتنا | `Jip7e/doda-darija-cosyvoice2`, utterance `doda_000286`. Chosen by `select_ref.py` out of 7 clips: CER 0.014 vs 0.031 for the 2.7 s clip |

| M1.wav + M1.txt | DODa M1, male, 3.95 s, 24 kHz | على كل حال اصلا ما عمر ما عجبوني هاد الأفلام الفرنسية | utterance `doda_004235`. Chosen by `select_ref.py` out of 6 clips: CER 0.014. Same speaker as the Piper voice, much clearer through F5-TTS |

| F1-lively.* | DODa F1, 3.2 s, expressive | فحالة وقعات كسيدة اش خاصنا نديرو | `doda_000027`, top of `rank_expressive.py`, CER 0.032 in `select_ref.py`. Output pitch movement 5.7 st vs 3.1 st calm |
| M1-lively.* | DODa M1, 3.2 s, expressive | اه شوية ولكن كتنسى | `doda_004916`, top of `rank_expressive.py`, CER 0.032 |

Styles: `SPEAKER` is the calm tone, `SPEAKER-lively` the lively tone. The app
sends `speaker` + `-lively` when the user picks "حيّة".

Licence: CC BY 4.0. Attribution: DODa corpus by AtlasIA, prepared by Jip7e.
These speakers recorded for an open speech dataset. Do not replace them with
voices taken from the internet without the person's consent.

Other DODa speakers (same dataset): F2, F3, F4 (female), M1, M2, M3 (male).
Their published reference sentences are in the Habibi model card.
