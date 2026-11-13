# Sécurité et vie privée

## État actuel (aucun serveur)

- Aucune donnée n'est envoyée par défaut. Tout reste dans le `localStorage` du navigateur.
- Adresse IP et ville : demandées à un service tiers seulement après consentement.
- Résumé à l'enseignant : seulement si le relais est configuré et si l'élève consent.
- Aucune police, script ni image externe. La CSP bloque tout le reste.
- Contenu dynamique : tout texte venant de l'utilisateur ou du réseau est échappé avant affichage. Les sessions relues depuis le `localStorage` sont validées et bornées (`cleanSess`). L'export CSV neutralise les formules.

## CSP

Générée par `tools/build.py` : `script-src` avec hachage de chaque script en ligne (pas de `unsafe-inline`, pas de `unsafe-eval`), `connect-src` limité aux trois services d'IP et au relais, `frame-ancestors 'none'` dans `_headers`.

## Si un serveur est ajouté plus tard

- Identifiant de session aléatoire. Pas de compte élève, pas d'e-mail, pas de téléphone.
- Ne pas stocker l'IP complète : garder la ville ou l'IP tronquée (/24 pour IPv4), ou un hachage salé.
- Consentement enregistré avec la date. Durée de conservation fixée (par exemple 90 jours), suppression automatique.
- Écriture seulement par une API qui valide chaque champ (type, longueur, liste de valeurs). Requêtes paramétrées. Limite de débit par IP et par session.
- CORS : une seule origine autorisée (celle du site).
- Tableau de bord enseignant : authentification forte, lecture seule, journal d'accès.
- Droit d'accès et d'effacement : un identifiant de session suffit pour retrouver et supprimer.
- Chiffrement en transit (TLS) et au repos. Sauvegardes chiffrées.
- Ne jamais mettre de jeton (bot, base de données) dans le code du navigateur. Seuls les secrets du serveur ou du Worker les contiennent.

## Vérifier

```
python3 tests/security_test.py
```
