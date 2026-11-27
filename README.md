# pro.taalim.men · espace pilote (branche `pro-site`)

Site Cloudflare Pages `pro`, servi tel quel (pas de build). Toutes les pages sont fermées par `functions/_middleware.js` :
il faut le code d'accès, secret `PRO_CODE` dans Cloudflare (Pages → pro → Settings → Variables and Secrets, au moins 8 caractères).
Sans ce secret, le site affiche « pas encore ouvert ». Changer le code déconnecte tous les appareils.

- `index.html` : la bibliothèque. Ajouter une leçon = une ligne dans `LESSONS` + le fichier dans `lecons/` (et ses `lecons/audio/*.mp3`).
- Les leçons viennent de `docs/fikra-bayna-yadayk/lecons/` (branche `plan/modeles-pro`). Le contenu payant (`itech327/taalim-pro`) n'est pas servi ici.
- `robots.txt` et `_headers` : pas d'indexation.
