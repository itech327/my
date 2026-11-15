/* Banques 3AC · module 3 : chaîne d’énergie */
B.ali = [
  [1, 'Dans quel ordre vient la chaîne d’énergie ?', ['alimenter, distribuer, convertir, transmettre, agir', 'agir, convertir, distribuer, alimenter, transmettre', 'convertir, alimenter, agir, distribuer, transmettre'], 0, 'L’énergie part de la source et finit par agir.'],
  [1, 'Quel composant réalise la fonction « alimenter » dans une perceuse sans fil ?', ['la batterie', 'le foret', 'la gâchette'], 0, 'Elle stocke l’énergie électrique.'],
  [1, 'Des piles en série : les tensions', ['s’additionnent', 'se soustraient', 'restent séparées'], 0, '4 piles de 1,5 V en série font 6 V.'],
  [1, 'Des piles en parallèle : les capacités', ['s’additionnent', 'se multiplient par la tension', 'disparaissent'], 0, 'La tension reste la même, la capacité augmente.'],
  [1, 'La prise du mur au Maroc délivre :', ['du courant alternatif 220 V, 50 Hz', 'du continu 5 V', 'du continu 12 V'], 0, 'Le sens du courant s’inverse 100 fois par seconde.'],
  [2, 'Quatre piles de 1,5 V en série donnent :', ['6 V', '1,5 V', '3 V'], 0, '4 × 1,5 = 6 V.'],
  [2, 'Deux piles de 2000 mAh en parallèle donnent :', ['4000 mAh', '2000 mAh', '1000 mAh'], 0, 'Les capacités s’additionnent.'],
  [2, 'Une batterie de 2000 mAh alimente un moteur de 400 mA. Son autonomie est de :', ['5 h', '2 h', '20 h'], 0, '2000 ÷ 400 = 5 h.'],
  [2, 'Dans un chargeur, le transformateur :', ['abaisse la tension', 'ne laisse passer qu’un sens', 'lisse le courant'], 0, 'Il passe de 220 V à quelques volts, toujours alternatifs.'],
  [2, 'Dans un chargeur, le redresseur :', ['ne laisse passer le courant que dans un sens', 'augmente la tension', 'stocke l’énergie'], 0, 'Les diodes bloquent l’autre sens.'],
  [3, 'Le condensateur de filtrage d’un chargeur sert à :', ['lisser le signal redressé', 'inverser le courant', 'produire de l’énergie'], 0, 'Le courant devient presque continu.'],
  [3, 'Un panneau photovoltaïque produit :', ['du courant continu', 'du courant alternatif', 'du son'], 0, 'Un onduleur le convertira si besoin.'],
  [3, 'Un moteur 6 V reçoit 7,5 V (5 piles en série). Il :', ['subit une surtension', 'tourne normalement', 'ne tourne pas du tout'], 0, 'Tension trop élevée : risque de dégât.'],
  [3, 'Pour doubler l’autonomie sans changer la tension, on ajoute :', ['une branche identique en parallèle', 'une pile en série', 'un fil'], 0, 'La capacité double, la tension reste.']
];
B.dis = [
  [1, 'Le pré-actionneur :', ['distribue l’énergie à l’actionneur selon l’ordre reçu', 'mesure une grandeur', 'affiche un résultat'], 0, 'Il est entre la commande et l’actionneur.'],
  [1, 'Une broche de carte programmable supporte environ :', ['20 mA', '2 A', '20 A'], 0, 'Au-delà, elle chauffe.'],
  [1, 'Le relais permet de commander :', ['un fort courant avec un faible courant', 'un faible courant avec un fort courant', 'seulement des LED'], 0, 'Il isole aussi la commande de la puissance.'],
  [1, 'Le pont en H sert à :', ['inverser le sens d’un moteur', 'mesurer une température', 'lisser un signal'], 0, 'Il inverse la polarité aux bornes du moteur.'],
  [1, 'Un transistor peut :', ['commander un grand courant avec un petit', 'produire de la lumière', 'stocker l’énergie'], 0, 'Un petit courant de base en commande un grand.'],
  [2, 'Pour commander une lampe de jardin 220 V depuis une carte, on choisit :', ['un relais', 'une résistance', 'une LED'], 0, 'Tension secteur : on isole.'],
  [2, 'Pour régler la vitesse d’un ventilateur 5 V par PWM :', ['un transistor', 'un fusible', 'un relais lent'], 0, 'Il doit commuter très vite.'],
  [2, 'Une LED avec sa résistance (10 mA) se branche :', ['directement sur la broche', 'obligatoirement sur un relais', 'sur le secteur'], 0, 'Le courant est sous la limite.'],
  [2, 'Dans un pont en H, pour « Avant », on ferme :', ['S1 et S4', 'S1 et S3', 'S3 et S4 seulement'], 0, 'Le courant traverse le moteur de gauche à droite.'],
  [2, 'Pourquoi ne pas brancher un moteur de 300 mA directement sur une broche ?', ['elle dépasse sa limite et peut être détruite', 'le moteur tourne à l’envers', 'la broche devient plus rapide'], 0, '300 mA, c’est beaucoup plus que 20 mA.'],
  [3, 'Dans un pont en H, S1 et S3 fermés ensemble provoquent :', ['un court-circuit', 'le sens avant', 'le freinage'], 0, 'La batterie est reliée à elle-même par deux interrupteurs.'],
  [3, 'Pour freiner un moteur avec un pont en H, on :', ['relie ses deux bornes entre elles', 'coupe tout sans rien relier', 'double la tension'], 0, 'Le moteur ralentit rapidement.'],
  [3, 'Moteur de 300 mA et transistor de gain 100 : le courant de commande vaut :', ['3 mA', '30 mA', '300 mA'], 0, '300 ÷ 100 = 3 mA, compatible avec la broche.'],
  [3, 'Avantage essentiel du relais :', ['isoler la commande de la puissance', 'être plus rapide qu’un transistor', 'ne jamais s’user'], 0, 'La carte reste protégée du secteur.'],
  [3, 'Une porte coulissante qui s’ouvre et se ferme a besoin :', ['d’un pont en H', 'd’un seul relais tout ou rien', 'd’aucun pré-actionneur'], 0, 'Moteur à deux sens de rotation.']
];
B.conv = [
  [1, 'Un convertisseur d’énergie :', ['change la forme de l’énergie', 'crée de l’énergie', 'mesure l’énergie'], 0, 'L’énergie se transforme, elle ne se crée pas.'],
  [1, 'Un moteur électrique convertit l’énergie électrique en :', ['énergie mécanique', 'énergie sonore', 'énergie lumineuse'], 0, 'Il produit une rotation.'],
  [1, 'Une résistance chauffante convertit l’électricité en :', ['chaleur', 'mouvement', 'son'], 0, 'Énergie thermique.'],
  [1, 'Une LED convertit l’énergie électrique en :', ['lumière', 'chaleur uniquement', 'mouvement'], 0, 'Énergie lumineuse.'],
  [1, 'PWM signifie :', ['modulation de largeur d’impulsion', 'puissance en watts moyens', 'pile à tension minimale'], 0, 'On règle la largeur des impulsions.'],
  [2, 'Un rapport cyclique de 50 % sous 5 V donne une tension moyenne de :', ['2,5 V', '5 V', '0 V'], 0, '50 % de 5 V.'],
  [2, 'Un servomoteur reçoit une impulsion de 1,5 ms. Son angle est :', ['90°', '0°', '180°'], 0, '1 ms → 0°, 2 ms → 180°.'],
  [2, 'Le rendement d’un moteur est :', ['puissance utile ÷ puissance absorbée', 'puissance absorbée ÷ puissance utile', 'tension × courant'], 0, 'η est toujours inférieur à 1.'],
  [2, 'Un moteur absorbe 40 W et fournit 30 W utiles. Son rendement vaut :', ['75 %', '25 %', '133 %'], 0, '30 ÷ 40 = 0,75.'],
  [2, 'analogWrite(255) correspond à un rapport cyclique de :', ['100 %', '50 %', '0 %'], 0, '255 est la valeur maximale.'],
  [3, 'La différence entre puissance absorbée et utile est perdue surtout sous forme de :', ['chaleur', 'son', 'lumière'], 0, 'Les pertes échauffent le moteur.'],
  [3, 'analogWrite(51) correspond à un rapport cyclique de :', ['20 %', '51 %', '80 %'], 0, '51 ÷ 255 = 0,2.'],
  [3, 'Un servomoteur reçoit une impulsion de 2 ms. Il se place à :', ['180°', '90°', '0°'], 0, 'La largeur d’impulsion donne l’angle.'],
  [3, 'Un moteur absorbe 50 W avec un rendement de 60 %. Les pertes valent :', ['20 W', '30 W', '10 W'], 0, 'Utile : 30 W ; pertes : 50 − 30.']
];
B.trans = [
  [1, 'La fonction « transmettre » :', ['amène le mouvement du moteur à l’actionneur en adaptant vitesse et force', 'stocke l’énergie', 'mesure la vitesse'], 0, 'Un réducteur est un exemple.'],
  [1, 'Un engrenage est composé de :', ['roues dentées en contact', 'une courroie et deux poulies', 'une vis et un écrou'], 0, 'Les dents s’engrènent.'],
  [1, 'Une courroie entre deux poulies fait tourner la seconde :', ['dans le même sens', 'toujours en sens inverse', 'dans aucun sens'], 0, 'Sauf montage croisé.'],
  [1, 'Un système vis-écrou transforme :', ['une rotation en translation', 'une translation en rotation uniquement', 'la chaleur en son'], 0, 'L’écrou avance quand la vis tourne.'],
  [1, 'Le vélo utilise pour entraîner la roue :', ['une chaîne et des pignons', 'une vis', 'une courroie crantée'], 0, 'Le pédalier entraîne la roue arrière.'],
  [2, 'z1 = 12 dents, z3 = 24 dents, N1 = 600 tr/min. N3 vaut :', ['300 tr/min', '1200 tr/min', '600 tr/min'], 0, '600 × 12 ÷ 24.'],
  [2, 'Une roue intermédiaire dans un train d’engrenages modifie :', ['le sens de rotation', 'le rapport de vitesse', 'rien du tout'], 0, 'Seul compte z1 ÷ z3 pour la vitesse.'],
  [2, 'Une vis de pas 2 mm fait 10 tours. L’écrou avance de :', ['20 mm', '5 mm', '12 mm'], 0, '10 × 2 mm.'],
  [2, 'Une petite poulie entraîne une grande poulie. La grande tourne :', ['plus lentement', 'plus vite', 'à la même vitesse'], 0, 'N2 = N1 × d1 ÷ d2.'],
  [2, 'Pour baisser la vitesse et augmenter la force d’un moteur, on utilise :', ['un réducteur', 'une LED', 'un capteur'], 0, 'Le réducteur adapte vitesse et force.'],
  [3, 'Un pignon de 10 dents à 600 tr/min entraîne un pignon de 30 dents. Ce dernier tourne à :', ['200 tr/min', '1800 tr/min', '600 tr/min'], 0, '600 × 10 ÷ 30.'],
  [3, 'Une poulie de 40 mm à 600 tr/min entraîne une poulie de 80 mm. Celle-ci tourne à :', ['300 tr/min', '1200 tr/min', '600 tr/min'], 0, '600 × 40 ÷ 80.'],
  [3, 'Une vis de pas 5 mm tourne à 60 tr/min. L’écrou avance à :', ['5 mm/s', '300 mm/s', '12 mm/s'], 0, '1 tr/s × 5 mm.'],
  [3, 'Une courroie peut glisser en cas de surcharge, contrairement à :', ['un engrenage', 'une poulie lisse', 'un ressort'], 0, 'Les dents imposent le mouvement.'],
  [3, 'Quel système transmet le mieux de grandes forces par un mouvement lent et précis ?', ['la vis-écrou', 'la courroie', 'la roue libre'], 0, 'Étau et presse en sont des exemples.']
];
B.agir = [
  [1, 'La fonction « agir » :', ['produit l’effet voulu sur la matière d’œuvre', 'alimente le système', 'traite les données'], 0, 'C’est la dernière fonction de la chaîne d’énergie.'],
  [1, 'L’effecteur est l’élément qui :', ['agit directement sur la matière d’œuvre', 'mémorise le programme', 'stocke l’énergie'], 0, 'Foret, vérin, lampe…'],
  [1, 'Un buzzer produit un effet :', ['sonore', 'thermique', 'mécanique'], 0, 'Il fait du son.'],
  [1, 'Dans la chaîne d’énergie, « agir » vient :', ['en dernier', 'en premier', 'au milieu'], 0, 'Après transmettre.'],
  [1, 'Un vérin pneumatique utilise :', ['de l’air comprimé', 'de l’eau chaude', 'un fil'], 0, 'La pression pousse le piston.'],
  [2, 'La force d’un vérin se calcule par :', ['F = P × S', 'F = P ÷ S', 'F = S − P'], 0, 'Avec 1 bar = 0,1 N/mm².'],
  [2, 'Piston de 50 mm (S ≈ 1963 mm²) à 6 bar. La force vaut environ :', ['1178 N', '118 N', '11 780 N'], 0, '6 × 0,1 × 1963.'],
  [2, 'La matière d’œuvre d’une perceuse est :', ['la pièce à percer', 'le foret', 'la batterie'], 0, 'C’est ce que le système transforme.'],
  [2, 'La valeur ajoutée est :', ['le changement apporté à la matière d’œuvre', 'le prix de l’outil', 'la couleur du système'], 0, 'Avant et après l’action.'],
  [2, 'Un radiateur produit un effet :', ['thermique', 'sonore', 'mécanique'], 0, 'Il chauffe l’air.'],
  [3, 'On double le diamètre du piston. La force est multipliée par :', ['4', '2', '8'], 0, 'S dépend du carré du diamètre.'],
  [3, 'Un vérin développe 1178 N. Peut-il soulever 80 kg (poids ≈ 785 N) ?', ['oui', 'non', 'seulement à vide'], 0, '1178 N est supérieur à 785 N.'],
  [3, 'Les trois types de matière d’œuvre sont :', ['matière, énergie, information', 'bois, fer, verre', 'solide, liquide, gaz'], 0, 'Un système agit sur l’un des trois.'],
  [3, 'Un lave-linge : matière d’œuvre et valeur ajoutée sont :', ['le linge ; propre au lieu de sale', 'l’eau ; plus chaude', 'le moteur ; plus rapide'], 0, 'Le linge change d’état.'],
  [3, 'Pour augmenter la force d’un vérin pneumatique sans changer son diamètre, on :', ['augmente la pression', 'diminue la masse du piston', 'ajoute un fil'], 0, 'F = P × S.']
];
