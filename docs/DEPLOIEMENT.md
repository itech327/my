# Déploiement (site statique)

Le site n'a pas de serveur : ce sont des fichiers HTML, JS et polices. Un hébergeur de pages statiques suffit.

## Option recommandée : Cloudflare Pages + nom de domaine

1. Créer un compte sur dash.cloudflare.com.
2. Workers & Pages > Create > Pages > Connect to Git. Choisir le dépôt `itech327/my`.
3. Branche de production : `lessons-site`.
4. Build command : vide. Build output directory : `/` (racine).
5. Deploy. Le site est en ligne sur `https://<projet>.pages.dev` avec HTTPS.
6. Nom de domaine : projet > Custom domains > Set up a domain. Suivre l'assistant (si le domaine est chez Cloudflare, tout est automatique ; sinon, ajouter l'enregistrement CNAME demandé chez le registrar).
7. SSL/TLS : mode `Full (strict)`. Activer `Always Use HTTPS` et `Automatic HTTPS Rewrites`.
8. Les en-têtes de sécurité viennent du fichier `_headers` (généré, déjà dans le dépôt). Rien à configurer.

Cloudflare fournit aussi la protection DDoS de base et le CDN, gratuitement.

## Changer l'adresse du site (canonical, sitemap)

```
SITE_URL=https://mon-domaine.ma python3 tools/build.py
git add -A && git commit -m "URL du site" && git push
```

Cette commande régénère `sitemap.xml`, `robots.txt`, les balises canoniques et la CSP.

## Netlify

Même principe : Add new site > Import from Git > branche `lessons-site`, build vide, publish directory `/`. Le fichier `_headers` est lu tel quel.

## Vercel

Vercel ne lit pas `_headers`. Créer un `vercel.json` avec la clé `headers` et recopier les valeurs de `_headers`.

## GitHub Pages (actuel)

`_headers` est ignoré. La CSP reste active grâce à la balise `<meta>`, mais `frame-ancestors`, HSTS et `X-Frame-Options` ne peuvent pas être posés. Pour un nom de domaine : Settings > Pages > Custom domain, puis `Enforce HTTPS`.

## Après chaque modification

```
python3 tools/build.py      # régénère les pages, la CSP, _headers, sitemap
python3 tests/security_test.py
```

Ne jamais modifier à la main les blocs entre `<!--gen:head-->` et `<!--/gen:head-->`.

## Alertes Telegram

Voir `worker/README.md`. L'adresse du relais va dans `lab/notify-config.js`. Relancer `python3 tools/build.py` : l'origine du relais est ajoutée automatiquement à la CSP (`connect-src`).
