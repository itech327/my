/* Banques 3AC · modules 1 et 2 : [niveau, question, options, bonne réponse (index), explication] */
B.evo = [
  [1, 'Un système où l’énergie et la commande sont humaines est :', ['primitif', 'mécanisé', 'automatisé'], 0, 'La force musculaire fournit l’énergie, la personne commande.'],
  [1, 'Un tracteur conduit par un agriculteur est un système :', ['mécanisé', 'primitif', 'robotisé'], 0, 'Un moteur fournit l’énergie, la commande reste humaine.'],
  [1, 'Un arrosage qui démarre seul quand le sol est sec est :', ['automatisé', 'primitif', 'mécanisé'], 0, 'Un capteur d’humidité commande la pompe sans l’humain.'],
  [1, 'Un bras programmable avec caméra, qui s’adapte à la pièce, est :', ['robotisé', 'primitif', 'mécanisé'], 0, 'Programmable et adaptable : système robotisé.'],
  [1, 'Une pelle est un système :', ['primitif', 'automatisé', 'robotisé'], 0, 'Énergie musculaire et commande humaine.'],
  [2, 'Qu’est-ce qui distingue un système automatisé d’un système mécanisé ?', ['la commande automatique', 'la couleur', 'le nombre de roues'], 0, 'Tous deux ont un moteur ; seul l’automatisé se commande seul.'],
  [2, 'Un lave-linge qui déroule un programme fixe est :', ['automatisé', 'primitif', 'mécanisé'], 0, 'Le programme se déroule sans intervention.'],
  [2, 'Un robot aspirateur est dit robotisé car il :', ['est programmable et s’adapte grâce à ses capteurs', 'n’a pas de moteur', 'est commandé à la main'], 0, 'Il adapte son trajet à la pièce.'],
  [2, 'Une frise chronologique sert à :', ['ranger les étapes dans le temps', 'mesurer une tension', 'dessiner une pièce'], 0, 'On y voit l’évolution d’un système d’une époque à l’autre.'],
  [2, 'En technologie câblée, la logique du système est :', ['dans les composants et les fils', 'dans un programme', 'dans la pile'], 0, 'On la modifie en changeant le câblage.'],
  [3, 'Pour ajouter une temporisation à un circuit câblé, on doit :', ['modifier le câblage', 'changer seulement une ligne de programme', 'ne rien faire'], 0, 'Il faut ajouter composants et fils.'],
  [3, 'Pour la même modification en technologie programmée, on :', ['change le programme', 'ressoude des fils', 'change la pile'], 0, 'Aucun fil à changer : on téléverse un nouveau programme.'],
  [3, 'Quelle combinaison n’est pas un type de système étudié ?', ['énergie humaine avec commande automatique', 'énergie moteur avec commande humaine', 'énergie moteur avec commande programmée'], 0, 'Sans moteur, aucune commande automatique ne peut agir.'],
  [3, 'Dans la barrière automatique, le capteur de présence appartient à la chaîne :', ['d’information (acquérir)', 'd’énergie (agir)', 'd’énergie (convertir)'], 0, 'Il acquiert l’information « une voiture est là ».']
];
B.acq = [
  [1, 'Un capteur fournit un signal :', ['qui varie avec la grandeur mesurée', 'toujours égal à 1', 'jamais électrique'], 0, 'C’est un signal analogique.'],
  [1, 'Un détecteur fournit un signal :', ['à deux états : 0 ou 1', 'continu qui varie sans cesse', 'sonore'], 0, 'Il compare la mesure à un seuil.'],
  [1, 'Quel composant mesure la distance d’un obstacle ?', ['le capteur à ultrasons', 'le buzzer', 'le relais'], 0, 'Il mesure le temps d’un écho.'],
  [1, 'La photorésistance réagit à :', ['la lumière', 'la température', 'le son'], 0, 'Sa résistance change avec l’éclairement.'],
  [1, 'Quels composants réalisent la fonction « acquérir » ?', ['les capteurs et les boutons', 'les moteurs', 'les afficheurs'], 0, 'Acquérir : recueillir l’information.'],
  [2, 'Le seuil d’un détecteur est :', ['la valeur à partir de laquelle il change d’état', 'sa tension d’alimentation', 'sa couleur'], 0, 'Au-dessus du seuil : 1, en dessous : 0 (ou l’inverse).'],
  [2, 'Un capteur à ultrasons mesure :', ['le temps aller-retour d’un son', 'la couleur d’un objet', 'la masse d’un objet'], 0, 'Puis il calcule d = v × t ÷ 2.'],
  [2, 'Dans d = v × t ÷ 2, on divise par 2 car :', ['le son fait l’aller et le retour', 'le son va deux fois plus vite', 'il y a deux capteurs'], 0, 'Le temps mesuré correspond à deux fois la distance.'],
  [2, 'Pour savoir si une porte est fermée, on utilise :', ['un détecteur tout ou rien', 'un capteur de température', 'un servomoteur'], 0, 'Deux états seulement : ouverte ou fermée.'],
  [2, 'Pour afficher la température d’une salle, il faut :', ['un capteur analogique', 'un détecteur tout ou rien', 'un relais'], 0, 'On veut une valeur qui varie.'],
  [3, 'Un écho met 5,8 ms à revenir (v = 340 m/s). L’obstacle est à environ :', ['1 m', '2 m', '10 cm'], 0, 'd = 340 × 0,0058 ÷ 2 ≈ 0,99 m.'],
  [3, 'Pour indiquer le niveau d’eau d’un réservoir en pourcentage, on choisit :', ['un capteur analogique', 'un détecteur de présence', 'un bouton'], 0, 'La grandeur est continue de 0 à 100 %.'],
  [3, 'Un lampadaire qui s’allume à la nuit utilise :', ['un détecteur de luminosité réglé sur un seuil', 'un capteur à ultrasons', 'un fin de course'], 0, 'Une seule décision : assez de lumière ou non.'],
  [3, 'Pour transformer un signal analogique en 0 ou 1, on :', ['le compare à un seuil', 'le multiplie par 2', 'l’amplifie sans limite'], 0, 'C’est le rôle d’un détecteur.']
];
B.trait = [
  [1, 'Un algorithme est :', ['une suite ordonnée d’instructions', 'un composant électronique', 'un type de moteur'], 0, 'Il décrit comment traiter l’information.'],
  [1, 'Quelle fonction réalise le microcontrôleur d’une carte programmable ?', ['traiter', 'alimenter', 'agir'], 0, 'Il exécute le programme.'],
  [1, 'Une porte ET donne 1 en sortie quand :', ['A et B valent 1', 'A ou B vaut 1', 'A vaut 0'], 0, 'ET exige toutes les conditions.'],
  [1, 'Quel symbole d’organigramme représente un test ?', ['le losange', 'l’ovale', 'le rectangle'], 0, 'Le losange pose une question : oui ou non.'],
  [1, 'Dans un programme Arduino, loop() :', ['se répète sans fin', 's’exécute une seule fois', 'efface le programme'], 0, 'La carte relit la boucle en permanence.'],
  [2, 'Dans un programme Arduino, setup() :', ['s’exécute une seule fois au démarrage', 'se répète sans fin', 'mesure la distance'], 0, 'On y règle les broches.'],
  [2, 'Quelle instruction définit la broche 13 comme sortie ?', ['pinMode(13, OUTPUT)', 'digitalRead(13)', 'delay(13)'], 0, 'pinMode choisit le mode de la broche.'],
  [2, 'A = 1 et B = 0. La sortie d’une porte OU vaut :', ['1', '0', '2'], 0, 'Un seul 1 suffit.'],
  [2, 'La porte NON appliquée à 1 donne :', ['0', '1', '2'], 0, 'Elle inverse l’entrée.'],
  [2, 'Un chronogramme montre :', ['les niveaux d’un signal dans le temps', 'les pièces d’un objet', 'le prix d’un composant'], 0, 'Haut ou bas, en fonction du temps.'],
  [3, 'Une lampe doit s’allumer s’il fait nuit ET s’il y a quelqu’un. On utilise :', ['une porte ET', 'une porte OU', 'une porte NON seule'], 0, 'Les deux conditions doivent être vraies.'],
  [3, 'digitalWrite(13,HIGH); delay(500); digitalWrite(13,LOW); delay(500); donne une période de :', ['1 s', '0,5 s', '2 s'], 0, '500 ms allumée + 500 ms éteinte.'],
  [3, '« Si jour alors éteindre, sinon allumer » est une structure :', ['conditionnelle', 'répétitive', 'linéaire'], 0, 'Un test choisit le chemin.'],
  [3, 'Pour changer la durée de clignotement sans toucher au câblage, on :', ['modifie la valeur dans delay()', 'change la LED', 'ajoute un fil'], 0, 'Technologie programmée : on édite le programme.']
];
B.comm = [
  [1, 'La fonction « communiquer » sert à :', ['transmettre le résultat à l’utilisateur ou à un autre système', 'mesurer une grandeur', 'produire de l’énergie'], 0, 'Acquérir, traiter, communiquer.'],
  [1, 'Un afficheur LCD réalise la fonction :', ['communiquer', 'acquérir', 'traiter'], 0, 'Il présente l’information à l’utilisateur.'],
  [1, 'Un buzzer communique par :', ['le son', 'la lumière', 'la chaleur'], 0, 'C’est un signal sonore.'],
  [1, 'Un octet contient :', ['8 bits', '4 bits', '16 bits'], 0, '1 octet = 8 bits.'],
  [1, 'Le Bluetooth est une liaison :', ['sans fil, par ondes radio', 'câblée', 'mécanique'], 0, 'Pas de fil entre émetteur et récepteur.'],
  [2, 'La liaison infrarouge exige :', ['une vue directe entre émetteur et récepteur', 'un fil', 'une pile de 9 V'], 0, 'Un obstacle ou un mur la bloque.'],
  [2, 'La liaison radio, par rapport à l’infrarouge :', ['traverse les murs mais s’affaiblit avec la distance', 'ne traverse jamais rien', 'ne s’affaiblit jamais'], 0, 'Elle est plus souple, mais pas infinie.'],
  [2, 'Principal avantage d’une liaison câblée :', ['sa fiabilité', 'sa liberté de mouvement', 'son absence de matériel'], 0, 'Le fil protège le signal.'],
  [2, 'Avec 8 bits, on peut coder les nombres de :', ['0 à 255', '0 à 8', '0 à 100'], 0, '2⁸ = 256 valeurs.'],
  [2, 'Un voyant LED « batterie faible » est un signal :', ['visuel', 'sonore', 'thermique'], 0, 'On le voit.'],
  [3, 'Combien de valeurs différentes un octet peut-il prendre ?', ['256', '8', '128'], 0, '2 × 2 × … (8 fois) = 256.'],
  [3, 'La télécommande d’un téléviseur fonctionne le plus souvent en :', ['infrarouge', 'câblé', 'ultrasons'], 0, 'Voilà pourquoi un obstacle gêne.'],
  [3, 'Pour avertir une personne malvoyante, on choisit un signal :', ['sonore', 'visuel', 'thermique'], 0, 'Elle l’entend sans le voir.'],
  [3, 'L’octet 01000001 vaut 65. En code ASCII, il représente la lettre :', ['A', 'B', 'a'], 0, '65 correspond à « A » majuscule.']
];
