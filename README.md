# Cours en mouvement

Trois applications de cours pour le collège, option française. Chaque fichier HTML est autonome.

| Fichier | Contenu |
| --- | --- |
| `index.html` | Portail, démarrage de session, rapport |
| `maths.html` | Maths en mouvement, 1re à 3e année, collège ordinaire et pionnier |
| `physique-chimie.html` | Physique-Chimie en mouvement, 1re à 3e année, ordinaire et pionnier |
| `svt.html` | SVT en mouvement, 3e année : digestion, respiration, circulation, excrétion, immunité |

## Ce qui a été ajouté

- Leçon « Défis » dans chaque chapitre qui a des exercices : Facile, Moyen, Difficile, Défi chronométré et mode adaptatif.
- Le niveau Défi : problèmes à plusieurs étapes, 45 secondes par question, sans indice, une seule tentative, points x5.
- Session : nom du visiteur, consentement, appareil, adresse IP et ville.
- Rapport de session : appareil, IP, ville, résultats par niveau et par chapitre, recommandations, erreurs à revoir. Export PDF, CSV et JSON.
- `svt.html` : nouvelle application dans le même style (figures animées et résumé en arabe).

## Vie privée

- Les données restent dans le navigateur du visiteur (`localStorage`). Aucun serveur n'est utilisé.
- L'IP et la ville viennent de services publics (ipwho.is, puis ipapi.co, puis api.ipify.org) appelés par le navigateur du visiteur, et seulement s'il coche la case de consentement.
- La ville est approximative. Sans réponse des services, la ville est déduite du fuseau horaire.
- L'enseignant ne voit pas les sessions des élèves à distance. L'élève envoie son rapport en PDF ou en JSON.
- Le bouton « Effacer mes données » du rapport supprime tout.

## Alertes Telegram

Optionnelles. Voir `worker/README.md`. Tant que `lab/notify-config.js` est vide, rien n'est envoyé et les données restent dans le navigateur.

## Publier avec GitHub Pages

Réglages du dépôt, Pages, source « Deploy from a branch », branche `lessons-site`, dossier racine.

## Développement

```
python3 tools/build.py        # assemble les trois applications
python3 tests/ui_test.py      # session, séries, rapport
python3 tests/chapters_test.py  # ouvre tous les chapitres
python3 tests/net_test.py     # IP simulée, consentement, CSV
python3 tests/notify_test.py  # alertes avec relais simulé
node worker/test_worker.mjs   # relais Telegram
```

Les tests demandent `playwright` et un Chromium.

Sources : `source/` contient les deux applications d'origine. `lab/` contient le module d'exercices et de session et la configuration de chaque application. `svt/svt.js` contient les chapitres de SVT.

## Limites connues

- Les exercices utilisent les générateurs déjà présents dans les applications, plus des problèmes de niveau Défi. Certains chapitres n'ont pas d'exercices par niveaux (par exemple pression, lentilles, courant alternatif en physique-chimie ; droites et angles en 1re année de maths).
- Les séquences du collège pionnier gardent leurs propres exercices. Leurs réponses ne sont pas enregistrées dans le rapport.
- Il faut vérifier l'ordre et le contenu des chapitres de SVT avec la répartition annuelle de l'établissement.
