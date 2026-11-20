# Modèles pilotes (non publiés)

Ce dossier n'est **pas** lu par `mouvement/tools/build.py` : rien de ce qu'il contient n'est construit ni déployé.

- `maths/2ac-pythagore-modele.js` : premier modèle de la phase 0 du plan « Pro ». Il applique les garde-fous du registre
  d'erreurs (branche `plan/modeles-pro`, `docs/registre-erreurs-et-garde-fous.md`).
- `mouvement/tests/modele_pilote_test.py` : le parcourt comme un élève et vérifie les portes
  G-GRID, G-MATH, G-DIAG, G-ORDER, G-LANG, G-LEX, G-KEYS, G-MOBILE, G-CSP, G-GAME, G-MEASURE, G-A11Y (avec `AXE_JS=…/axe.min.js`).

```
python3 mouvement/tools/build.py
AXE_JS=/chemin/axe.min.js python3 mouvement/tests/modele_pilote_test.py     # « FAILS: 0 » attendu
PILOT_FILE=autre-modele.js python3 mouvement/tests/modele_pilote_test.py    # même banc pour un autre modèle
```

Nouveautés du moteur (`mouvement/core/mv.js`), compatibles avec les leçons existantes :

| Option | Effet |
|---|---|
| `numQ … diag: [{v, tol, msg}]` | une erreur courante reçoit son propre message (ex. 14 = « tu as additionné les côtés ») |
| `optQ … shuffle: true` | l'ordre des choix est mélangé : la bonne réponse n'est pas toujours la première |
| `optQ … why: [..]` | une explication par mauvais choix |
| `lesson … defi: [..]` | défi facultatif, sans chronomètre ; il ne compte pas dans la note ; on se compare à sa meilleure série |

Pour publier un modèle un jour : le déplacer dans `mouvement/lessons/<matière>/`, ajouter son plan de réponses dans
`mouvement/tests/mouvement_test.py`, passer les trois suites habituelles, et seulement alors fusionner.
