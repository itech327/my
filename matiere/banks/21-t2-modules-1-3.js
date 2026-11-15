/* Banques 2AC · besoins, modélisation, schémas, alimentation, signalisation, commutation */
B.ing1 = [
  [1, 'Un besoin est :', ['une nécessité ressentie', 'un objet fabriqué', 'un schéma'], 0, 'Le besoin vient d’abord ; l’objet technique lui répond.'],
  [1, 'Un objet technique est créé pour :', ['répondre à un besoin', 'décorer uniquement', 'remplacer la nature'], 0, 'Il satisfait un besoin.'],
  [1, 'Les ciseaux sont :', ['un objet technique simple', 'un système automatisé', 'un robot'], 0, 'Ni capteur ni commande : la main fait tout.'],
  [1, 'Un portail automatique est :', ['un système technique', 'un objet technique simple', 'une matière première'], 0, 'Il détecte, traite et agit.'],
  [1, 'Un système technique reçoit :', ['de l’énergie et des informations', 'seulement du bois', 'seulement de l’eau'], 0, 'Puis il agit.'],
  [2, 'Un objet technique simple n’a :', ['ni capteur ni commande', 'ni forme ni matière', 'aucune fonction'], 0, 'Il fonctionne par la force de la personne.'],
  [2, 'Quel élément est un système technique ?', ['le distributeur de savon automatique', 'le marteau', 'le stylo'], 0, 'Un capteur détecte la main et commande la pompe.'],
  [2, 'Le besoin « traverser une rivière » est satisfait par :', ['un pont', 'un livre', 'une pile'], 0, 'L’objet technique répond au besoin.'],
  [2, 'Quel est l’ordre du cycle ?', ['besoin, objet technique, satisfaction, nouveau besoin', 'objet, besoin, vente, oubli', 'schéma, pile, besoin, objet'], 0, 'Le besoin évolue et l’objet est amélioré.'],
  [2, 'Le marteau est :', ['un objet technique simple', 'un système automatisé', 'un système robotisé'], 0, 'Il n’a ni capteur ni commande.'],
  [3, 'Si le besoin évolue, on :', ['améliore l’objet : le cycle recommence', 'détruit l’objet', 'oublie le besoin'], 0, 'Les objets s’améliorent avec les besoins.'],
  [3, 'Ce qui distingue un système d’un objet simple est :', ['la présence de capteurs, d’un traitement et d’une action', 'sa couleur', 'son prix'], 0, 'Il reçoit des informations et agit.'],
  [3, 'Lequel n’est pas un système technique ?', ['le stylo', 'l’ascenseur', 'le distributeur de billets'], 0, 'Le stylo n’a ni capteur ni commande.'],
  [3, 'Un système technique agit :', ['en fonction des informations qu’il reçoit', 'au hasard', 'sans énergie'], 0, 'Les capteurs informent, le traitement décide.']
];
B.ing2 = [
  [1, 'Le diagramme de cas d’utilisation montre :', ['les services rendus aux acteurs', 'les pièces du moteur', 'le prix du système'], 0, 'Qui utilise le système et pour quoi.'],
  [1, 'L’acteur principal est celui qui :', ['bénéficie du service', 'répare le système', 'fabrique le système'], 0, 'On le place à gauche.'],
  [1, 'L’acteur secondaire :', ['aide à rendre le service', 'bénéficie du service', 'est le système lui-même'], 0, 'On le place à droite.'],
  [1, 'Le diagramme de contexte montre :', ['l’environnement du système', 'les couleurs du système', 'la facture'], 0, 'Ce qui entoure le système et interagit avec lui.'],
  [1, 'Le diagramme des exigences décrit :', ['les fonctionnalités et les contraintes', 'les circuits imprimés', 'les acteurs seulement'], 0, 'Ce que le système doit faire et respecter.'],
  [2, 'Un bloc, dans le diagramme de définition des blocs, est :', ['une solution technique', 'une exigence', 'un acteur'], 0, 'Moteur, capteur, carte…'],
  [2, 'Le lien « satisfy » relie :', ['un bloc à une exigence', 'deux acteurs', 'deux couleurs'], 0, 'Le bloc satisfait l’exigence.'],
  [2, 'Une fonctionnalité est :', ['ce que le système fait', 'une limite imposée', 'un acteur'], 0, 'Par exemple : ouvrir le portail.'],
  [2, 'Une contrainte est :', ['une limite à respecter', 'une pièce du système', 'un utilisateur'], 0, 'Coût, taille, sécurité…'],
  [2, 'Dans le contexte d’un portail, la pluie est :', ['dans l’environnement', 'dans le système', 'un acteur principal'], 0, 'Elle entoure le système sans en faire partie.'],
  [3, 'Le moteur du portail appartient :', ['au système', 'à l’environnement', 'aux acteurs'], 0, 'C’est un bloc du système.'],
  [3, 'Le lien de contenance (⊕) signifie qu’une exigence :', ['en contient d’autres', 'est refusée', 'est un acteur'], 0, 'Elle est composée de sous-exigences.'],
  [3, 'Le lien « refine » sert à :', ['préciser une exigence', 'supprimer un bloc', 'ajouter un acteur'], 0, 'Une exigence plus fine détaille la première.'],
  [3, 'Pour savoir qui utilise le portail et pour quoi faire, on lit :', ['le diagramme de cas d’utilisation', 'le diagramme de blocs', 'le schéma électrique'], 0, 'Il décrit les services.']
];
B.sch = [
  [1, 'Une fonction technique est :', ['une action réalisée par un composant', 'une couleur', 'un prix'], 0, 'Alimenter, détecter, commuter…'],
  [1, 'Les cinq fonctions étudiées sont :', ['alimenter, détecter, temporiser, commuter, signaler', 'dessiner, peindre, coller, couper, plier', 'pousser, tirer, tourner, plier, couper'], 0, 'Elles se retrouvent dans de nombreux circuits.'],
  [1, 'Un schéma électronique utilise :', ['des symboles normalisés', 'des photos', 'des dessins libres'], 0, 'Chaque composant a le sien.'],
  [1, 'Sur une résistance, les bandes 1 et 2 donnent :', ['les deux premiers chiffres', 'le nombre de zéros', 'la tolérance'], 0, 'La bande 3 donne le multiplicateur.'],
  [1, 'Jaune, violet, rouge : la résistance vaut :', ['4 700 Ω', '470 Ω', '47 Ω'], 0, '4, 7 puis 2 zéros.'],
  [2, 'Marron, noir, rouge : la résistance vaut :', ['1 000 Ω', '100 Ω', '10 Ω'], 0, '1, 0 puis 2 zéros.'],
  [2, 'Rouge, rouge, marron : la résistance vaut :', ['220 Ω', '2 200 Ω', '22 Ω'], 0, '2, 2 puis 1 zéro.'],
  [2, 'Pourquoi utilise-t-on des symboles normalisés ?', ['pour que tout le monde lise le schéma de la même façon', 'pour économiser de l’encre', 'pour faire joli'], 0, 'C’est un langage commun.'],
  [2, 'Orange, orange, marron : la résistance vaut :', ['330 Ω', '3 300 Ω', '33 Ω'], 0, '3, 3 puis 1 zéro.'],
  [2, 'Sur un schéma, la LED est une diode accompagnée de :', ['flèches de lumière', 'un ressort', 'une roue dentée'], 0, 'Elle émet de la lumière.'],
  [3, 'Marron, noir, orange : la résistance vaut :', ['10 kΩ', '1 kΩ', '100 kΩ'], 0, '1, 0 puis 3 zéros = 10 000 Ω.'],
  [3, 'Vert, bleu, marron : la résistance vaut :', ['560 Ω', '5 600 Ω', '56 Ω'], 0, '5, 6 puis 1 zéro.'],
  [3, 'Rouge, violet, orange : la résistance vaut :', ['27 kΩ', '2,7 kΩ', '270 Ω'], 0, '2, 7 puis 3 zéros.'],
  [3, 'Quels composants réalisent la fonction « commuter » ?', ['interrupteur, relais, transistor', 'pile, accumulateur, bloc secteur', 'LED, buzzer, lampe'], 0, 'Ils ouvrent ou ferment le circuit.']
];
B.ali2 = [
  [1, 'La fonction « alimentation » :', ['fournit l’énergie électrique', 'mesure une grandeur', 'affiche un message'], 0, 'Pile, accumulateur, bloc secteur.'],
  [1, 'Un accumulateur est :', ['une pile rechargeable', 'une pile à jeter', 'un bloc secteur'], 0, 'On peut le recharger.'],
  [1, 'Un bloc secteur se branche :', ['sur la prise du mur', 'sur le soleil', 'sur une pile'], 0, 'Il alimente l’appareil depuis le réseau.'],
  [1, 'Des piles en série : les tensions', ['s’additionnent', 'se soustraient', 'se multiplient'], 0, '2 piles de 1,5 V font 3 V.'],
  [1, 'L’autonomie se calcule par :', ['C ÷ I', 'C × I', 'I ÷ C'], 0, 'C en mAh, I en mA, résultat en heures.'],
  [2, 'Trois piles de 1,5 V en série donnent :', ['4,5 V', '1,5 V', '3 V'], 0, '3 × 1,5 = 4,5 V.'],
  [2, 'Une batterie de 1000 mAh alimente un appareil de 100 mA. L’autonomie est de :', ['10 h', '1 h', '100 h'], 0, '1000 ÷ 100 = 10 h.'],
  [2, 'Une ampoule de 3 V alimentée sous 6 V :', ['risque de griller', 'brille moins', 'ne change pas'], 0, 'Trop de tension la détruit.'],
  [2, 'Le mAh est l’unité de :', ['la capacité d’une pile', 'la tension', 'la résistance'], 0, 'Milliampère-heure.'],
  [2, 'Une pile qu’on peut recharger s’appelle :', ['un accumulateur', 'une pile saline', 'un transformateur'], 0, 'Elle sert plusieurs fois.'],
  [3, 'Deux piles de 1,5 V et 1000 mAh en série donnent :', ['3 V et 1000 mAh', '1,5 V et 2000 mAh', '3 V et 2000 mAh'], 0, 'La tension double, la capacité reste.'],
  [3, 'Deux piles de 1,5 V et 1000 mAh en parallèle donnent :', ['1,5 V et 2000 mAh', '3 V et 1000 mAh', '3 V et 2000 mAh'], 0, 'La capacité double, la tension reste.'],
  [3, 'Une batterie de 2000 mAh alimente un appareil de 250 mA. L’autonomie est de :', ['8 h', '2 h', '80 h'], 0, '2000 ÷ 250 = 8 h.'],
  [3, 'Pour qu’un appareil fonctionne plus longtemps, on peut :', ['augmenter la capacité de la batterie', 'augmenter le courant consommé', 'diminuer la capacité'], 0, 'Autonomie = C ÷ I.']
];
B.sig = [
  [1, 'La LED laisse passer le courant :', ['dans un seul sens', 'dans les deux sens', 'dans aucun sens'], 0, 'Elle est polarisée.'],
  [1, 'On place une résistance en série avec une LED pour :', ['limiter le courant', 'augmenter la lumière', 'produire du son'], 0, 'Sans elle, la LED peut griller.'],
  [1, 'Le buzzer est un moyen de signalisation :', ['sonore', 'lumineux', 'thermique'], 0, 'Il émet un son.'],
  [1, 'Le courant circule si la boucle est :', ['fermée', 'ouverte', 'coupée'], 0, 'Un circuit ouvert ne laisse rien passer.'],
  [1, 'Une LED est un moyen de signalisation :', ['lumineux', 'sonore', 'mécanique'], 0, 'Elle émet de la lumière.'],
  [2, 'La résistance de protection se calcule par :', ['R = (E − U_LED) ÷ I', 'R = E × I', 'R = I ÷ E'], 0, 'U_LED vaut environ 2 V.'],
  [2, 'E = 5 V, U_LED = 2 V, I = 10 mA. La résistance vaut :', ['300 Ω', '30 Ω', '3 000 Ω'], 0, '(5 − 2) ÷ 0,01 = 300 Ω.'],
  [2, 'La série E12 est :', ['une liste de valeurs normalisées de résistances', 'un type de LED', 'une famille de piles'], 0, '10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82…'],
  [2, 'Une LED branchée sans résistance :', ['risque d’être détruite', 'brille moins', 'consomme moins'], 0, 'Le courant devient trop grand.'],
  [2, 'Une LED branchée à l’envers :', ['ne s’allume pas', 'brille plus fort', 'grille tout de suite'], 0, 'Elle est polarisée.'],
  [3, 'E = 9 V, U_LED = 2 V, I = 20 mA : la valeur E12 au-dessus de 350 Ω est :', ['390 Ω', '330 Ω', '470 Ω'], 0, 'On prend la valeur normalisée juste au-dessus.'],
  [3, 'E = 5 V, U_LED = 2 V, R = 330 Ω. Le courant vaut environ :', ['9 mA', '90 mA', '0,9 mA'], 0, '3 ÷ 330 ≈ 0,009 A.'],
  [3, 'Si on augmente la résistance en série avec la LED, le courant :', ['diminue', 'augmente', 'ne change pas'], 0, 'I = (E − U) ÷ R.'],
  [3, 'On choisit la valeur E12 juste au-dessus de la valeur calculée pour :', ['que le courant ne dépasse pas la valeur prévue', 'que la LED brille plus fort', 'économiser de l’argent'], 0, 'Une résistance plus grande limite davantage.']
];
B.com = [
  [1, 'Commuter signifie :', ['ouvrir ou fermer un circuit', 'mesurer une tension', 'stocker de l’énergie'], 0, 'Fonction réalisée par un interrupteur, un relais, un transistor.'],
  [1, 'Un interrupteur :', ['garde sa position', 'revient seul à sa position', 'produit du courant'], 0, 'On l’actionne une fois, il reste.'],
  [1, 'Un bouton-poussoir :', ['ferme le circuit pendant l’appui', 'garde sa position', 'ne ferme jamais'], 0, 'Comme une sonnette.'],
  [1, 'Le relais permet de commander :', ['un gros courant avec un petit', 'un petit courant avec un gros', 'seulement le son'], 0, 'Commande et puissance sont séparées.'],
  [1, 'Le transistor est :', ['un interrupteur électronique', 'une pile', 'une lampe'], 0, 'Sans pièce mobile.'],
  [2, 'Un inverseur :', ['choisit entre deux voies', 'coupe toujours', 'produit de la lumière'], 0, 'Il dirige le courant vers l’une ou l’autre sortie.'],
  [2, 'Dans un relais, la commande et la puissance sont :', ['séparées', 'confondues', 'identiques'], 0, 'Deux circuits distincts.'],
  [2, 'Un transistor commence à conduire quand la base dépasse environ :', ['0,6 V', '6 V', '60 V'], 0, 'Seuil de la jonction base–émetteur.'],
  [2, 'Quel composant n’a aucune pièce mobile ?', ['le transistor', 'le relais', 'l’interrupteur'], 0, 'Il commute électroniquement.'],
  [2, 'Pour une sonnette, on choisit :', ['un bouton-poussoir', 'un interrupteur', 'un inverseur'], 0, 'Le circuit se ferme seulement pendant l’appui.'],
  [3, 'Pour allumer une lampe depuis deux endroits (va-et-vient), on utilise :', ['deux inverseurs', 'deux boutons-poussoirs', 'un relais'], 0, 'Chaque inverseur peut changer l’état.'],
  [3, 'Base d’un transistor NPN à 0 V : il est :', ['bloqué', 'conducteur', 'cassé'], 0, 'Sous 0,6 V il ne conduit pas.'],
  [3, 'Base d’un transistor NPN à 5 V par une résistance : il est :', ['conducteur', 'bloqué', 'détruit'], 0, 'Au-delà de 0,6 V il conduit.'],
  [3, 'Avec un relais de 5 V, on peut commander :', ['une lampe sur le secteur', 'seulement une LED', 'rien'], 0, 'Le relais isole les deux circuits.']
];
