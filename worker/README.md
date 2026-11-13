# Alertes Telegram

Le site est statique : il ne peut pas garder un secret. Le jeton du bot reste donc dans un petit relais Cloudflare Worker. Le site envoie les événements au relais, et le relais écrit à Telegram.

## Alertes envoyées

| Événement | Contenu |
| --- | --- |
| Ouverture d'une page | Nom de l'application. Visite anonyme, sans nom ni IP. Le pays seul (code à deux lettres) est ajouté par le relais. |
| Connexion | Nom, appareil, IP, ville. Seulement si l'élève a coché le consentement. |
| Série terminée | Nom, chapitre, niveau, score, points. |
| Fin de session (bouton Terminer) | Résumé complet, niveaux, fiches à revoir. |
| Fermeture de la page | Résumé de la session en cours. Une seule fois sans nouvelle réponse. |

Quand le relais est actif, le formulaire de session exige le consentement et dit que les résultats sont envoyés à l'enseignant.

## Installation

1. Telegram, `@BotFather`, commande `/newbot`. Note le jeton.
2. Écris un message à ton bot. Ouvre `https://api.telegram.org/bot<JETON>/getUpdates` et repère `chat` puis `id`.
3. Cloudflare, Workers et Pages, Create, Worker. Colle `worker/worker.js` et déploie. Avec la ligne de commande : `npx wrangler deploy` depuis le dossier `worker/`.
4. Réglages du Worker, variables et secrets :
   - secret `BOT_TOKEN` : le jeton
   - secret `CHAT_ID` : ton identifiant de conversation
   - variable `ALLOWED_ORIGIN` : `https://itech327.github.io` (sans chemin)
5. Copie l'adresse du Worker dans `lab/notify-config.js`, entre les guillemets de `LAB_NOTIFY_URL`, puis pousse le fichier.

Ne mets jamais le jeton dans le dépôt ni dans une conversation.

## Protections

- Origine contrôlée, taille du message limitée, texte nettoyé, envoi en texte brut.
- Limite : 40 messages par minute et par IP, 60 par heure et par session. La limite est en mémoire et se remet à zéro quand le Worker redémarre.
- Une personne qui connaît l'adresse du relais peut tenter d'envoyer de faux messages hors navigateur. Les limites réduisent l'effet. Si cela arrive, change l'adresse du Worker.

## Tests

```
node worker/test_worker.mjs
python3 tests/notify_test.py
```
