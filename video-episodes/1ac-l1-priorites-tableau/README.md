# 1AC · leçon 1 · Les priorités opératoires (vidéo pour le tableau)

Vidéo silencieuse de 84 s, 1920×1080, 25 i/s, pour projection en classe. Une page HTML déterministe (`render(t)`), rendue par Playwright et ffmpeg.

- `python3 shot.py 3 16 41` : images de contrôle dans `stills/`.
- `python3 render.py sortie.mp4` : rendu complet (environ 2 min).
- Les légendes et les temps sont dans `EP.caps` et `BEATS` de `board.html`.
- Contenu : ticket du hanout (7 + 3 × 1,5), règle ( ) puis × ÷ puis + −, parenthèses, gauche à droite (20 − 8 + 2), question « À toi » avec minuteur de 6 s, récapitulatif.
- Les calculs viennent de `mouvement/lessons/maths/1ac-priorites.js`. Pas de voix : le professeur commente. Pour une version voix, passer par `speak_moroccan` et `retime`.
- Légendes arabes : les expressions sont isolées en LTR (`.m`), vérifié au pixel.

## Version avec voix (en cours, 23 nov. 00:10)
- `voice-script.json` : 9 segments de voix (younes, fusha). **4 générés** (01, 02, 04, 06, liens valables jusqu'au 30 nov.), **5 manquants** (03, 05, 07, 08, 09) car la quota Google du jour est épuisée.
- Quand la quota revient : générer les segments manquants avec `speak_moroccan` (texte `say`), récupérer chaque WAV (`fetch_audio` + `unpack_audio.py`, ou lien si le réseau le permet), les nommer `01.wav` ... `09.wav` dans un dossier, puis `python3 build_voiced.py DOSSIER sortie.mp4`. Le script recale le temps sur la durée de chaque voix (`window.KN`), rend et mixe.
- `build_voiced.py` testé sur des WAV factices : calcul des nœuds et du mixage OK ; le rendu complet n'a pas été vérifié jusqu'au bout (interrompu).
- Ne pas mélanger deux voix (pas de Piper) : attendre la quota ou activer la facturation Google.
