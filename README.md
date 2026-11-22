# Club de révision : paquet hors ligne

Séparé de la plateforme taalim.men. Cette branche ne contient que le constructeur du paquet, pas la plateforme.

Construire : `python3 build_club.py CHEMIN/mouvement/dist SORTIE` (par défaut : `../site-mv/mouvement/dist`).
Le script copie les sites `maths` et `pc` du dossier `dist`, adapte les COPIES au protocole `file://`
(liens de dossier vers `index.html`, pas de liens externes, pas d'envoi réseau, 2AC d'abord) et ajoute
l'accueil du club, la fiche de résultats d'un poste (impression, CSV) et le guide de séance.
La plateforme n'est jamais modifiée. Les résultats restent dans le stockage local de chaque navigateur.

Après toute mise à jour de la plateforme : reconstruire `dist`, relancer ce script, redistribuer le dossier.
Les remplacements sur `mv.js`, `revise.js` et `exam.js` sont vérifiés par des `assert` : si la plateforme change ces lignes, le script s'arrête.
