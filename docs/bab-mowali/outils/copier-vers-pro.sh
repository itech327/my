#!/bin/sh
# Copie le moteur et toutes les cartes de cartes.json vers un dossier jeu/ de pro-site.
# Usage : sh docs/bab-mowali/outils/copier-vers-pro.sh /chemin/vers/pro-site/jeu
# Réservé à la session « دروس Pro » (seule à écrire dans pro-site). Ne supprime rien.
set -eu
SRC=$(cd "$(dirname "$0")/.." && pwd); DST=${1:?dossier jeu/ de pro-site}
mkdir -p "$DST/chapitres" "$DST/audio"
cp "$SRC/bab.js" "$DST/"
node -e '
const c=require(process.argv[1]);
for(const k of c.cartes){console.log([k.page,k.carte].concat(k.audio).join("\n"))}' "$SRC/cartes.json" | while read -r f; do cp "$SRC/$f" "$DST/$f"; done
node -e 'const c=require(process.argv[1]);console.log("Copié : bab.js + "+c.cartes.length+" cartes. Liens pour la bibliothèque :");for(const k of c.cartes)console.log("  "+k.niveau+" · "+k.titre+" → "+k.lien)' "$SRC/cartes.json"
