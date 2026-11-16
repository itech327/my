# Cours en mouvement : maths, pc, svt

Trois sites légers, un par matière, qui partagent un même moteur de leçon.
Chaque leçon suit la séance de l'enseignement explicite (ouverture, je me prépare, je regarde, nous faisons, je fais seul, bilan)
et explique par le mouvement : scènes animées pas à pas, mot clé en gras, une seule couleur d'accent, tableau de valeurs fixe.

| Sous-domaine | Projet Cloudflare Pages | Dossier de sortie |
| --- | --- | --- |
| https://maths.taalim.men | `mv-maths` | `mouvement/dist/maths` |
| https://pc.taalim.men | `mv-pc` | `mouvement/dist/pc` |
| https://svt.taalim.men | `mv-svt` | `mouvement/dist/svt` |

Branche de production des trois projets : **`mouvement`**. Pas de commande de build : le dossier `dist` est versionné.
Chaque push sur `mouvement` redéploie les trois sites. Le site `taalim.men` (branche `lessons-site`) n'est pas touché.

## Commandes

```
python3 mouvement/tools/build.py          # régénère mouvement/dist/<matière>
python3 mouvement/tests/mouvement_test.py # parcourt chaque leçon avec la CSP réelle ; finit par « FAILS: N »
python3 mouvement/tests/mouvement_test.py --shots /tmp/shots   # + captures à 420 px
```

## Fichiers

- `core/mv.js` : moteur sans dépendance (`MV.lesson`, scènes, `MV.guide`, `MV.numQ`, `MV.optQ`, `MV.tapQ`, `MV.slider`, `MV.hud`).
- `core/mv.css` : style commun ; accent par matière via `html[data-s]` (maths orange, pc bleu, svt vert).
- `lessons/<matière>/<niveau>ac-<sujet>.js` : une leçon par fichier. La première ligne est l'en-tête
  `/* @meta {"id","level","order","theme","title","ar","lead"} */` lu par le build ; `id` = nom du fichier.
- `tools/build.py` : pages d'accueil, une page par leçon (`/<id>/`), `_headers` (CSP stricte, aucun script en ligne), `robots.txt`, `sitemap.xml`, `404.html`.

## Écrire une leçon

```js
MV.lesson({
  id: '2ac-pythagore',
  objectif: { fr: '…', ar: '…' },
  ouverture: scène, regarde: scène, bilan: scène,
  prepare: [['énoncé', true|false, 'explication'], …],          // trois vrai ou faux
  faisons: [{ title, intro, build: function (carte, MV, fini) { … fini(); } }],
  seul: [{ lvl, q, a, unit, hint } | { lvl, q, o: [...], a, e }], // quatre niveaux
  retenir: ['…'], retenirAr: '…', voc: [['fr', 'ar'], …]
});
```

Une scène : `{ vb, hud: [[clé, titre]], draw: function (svg, MV) { return { nom: élément } }, steps: [{ cap, ar, hud, on: [noms], hot: [noms], run }] }`.
Dans `cap`, `**mot**` met le mot clé en gras. Dans `ar`, `[[formule]]` garde une formule en sens gauche-droite.
Un élément marqué `data-keep` reste toujours visible : le moteur ne le gère pas.
Une valeur du HUD donnée entre crochets, `['25']`, s'affiche dans la couleur d'accent.

## Mise en ligne (une fois)

Dans Cloudflare, Workers et Pages, Créer, Pages, connecter `itech327/my`, pour chacun des trois projets :
branche de production `mouvement`, préréglage aucun, commande de build vide, dossier de sortie du tableau ci-dessus.
Puis Domaines personnalisés : `maths.taalim.men`, `pc.taalim.men`, `svt.taalim.men`.
