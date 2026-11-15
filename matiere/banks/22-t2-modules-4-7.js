/* Banques 2AC · détection, temporisation, mouvement, circuit imprimé, entreprise */
B.det = [
  [1, 'La photorésistance (LDR) détecte :', ['la lumière', 'la température', 'le son'], 0, 'Sa résistance change avec l’éclairement.'],
  [1, 'Plus il y a de lumière, la résistance d’une LDR :', ['diminue', 'augmente', 'ne change pas'], 0, 'Elle laisse mieux passer le courant.'],
  [1, 'La thermistance CTN détecte :', ['la température', 'la lumière', 'la distance'], 0, 'Sa résistance dépend de la température.'],
  [1, 'Quand il fait plus chaud, la résistance d’une CTN :', ['diminue', 'augmente', 'reste identique'], 0, 'CTN : coefficient de température négatif.'],
  [1, 'Un capteur « tout ou rien » a :', ['deux états', 'une infinité d’états', 'aucun état'], 0, '0 ou 1.'],
  [2, 'Un capteur analogique donne :', ['une valeur qui varie progressivement', 'seulement 0 ou 1', 'seulement du son'], 0, 'La valeur suit la grandeur mesurée.'],
  [2, 'Un fin de course est :', ['un détecteur tout ou rien', 'un capteur analogique', 'une source d’énergie'], 0, 'Il détecte si la pièce est arrivée ou non.'],
  [2, 'Un thermostat utilise :', ['un capteur de température', 'une photorésistance', 'un buzzer'], 0, 'Il mesure la température.'],
  [2, 'L’éclairage public qui s’allume la nuit utilise :', ['une photorésistance', 'une thermistance', 'un fin de course'], 0, 'Il détecte le manque de lumière.'],
  [2, 'Dans l’obscurité, la résistance d’une LDR est :', ['élevée', 'faible', 'nulle'], 0, 'Moins de lumière, plus de résistance.'],
  [3, 'Une CTN vaut 10 kΩ à 25 °C. À 40 °C, sa résistance est :', ['plus petite', 'plus grande', 'identique'], 0, 'Elle diminue quand la température monte.'],
  [3, 'Un détecteur de présence infrarouge donne un signal :', ['tout ou rien', 'analogique uniquement', 'sonore'], 0, 'Présence ou absence.'],
  [3, 'Pour mesurer en continu le niveau d’un liquide en %, on utilise un capteur :', ['analogique', 'tout ou rien', 'mécanique seulement'], 0, 'La grandeur varie de 0 à 100 %.'],
  [3, 'Pour que la lampe s’allume à la nuit, la LDR associée à une résistance :', ['forme un pont diviseur de tension', 'est mise en parallèle d’une pile', 'est supprimée'], 0, 'La tension change avec la lumière.']
];
B.tmp = [
  [1, 'La temporisation sert à :', ['retarder une action', 'mesurer une distance', 'produire de la lumière'], 0, 'Par exemple : l’éclairage d’un escalier.'],
  [1, 'Une temporisation simple utilise :', ['une résistance et un condensateur', 'deux LED', 'un moteur'], 0, 'Le condensateur se charge lentement.'],
  [1, 'La constante de temps vaut :', ['τ = R × C', 'τ = R ÷ C', 'τ = R + C'], 0, 'Elle fixe la durée de charge.'],
  [1, 'Plus R est grande, le délai est :', ['plus long', 'plus court', 'identique'], 0, 'La charge est plus lente.'],
  [1, 'Plus C est grande, le délai est :', ['plus long', 'plus court', 'identique'], 0, 'Il faut plus de charge.'],
  [2, 'Le délai est environ :', ['0,69 × R × C', '10 × R × C', 'R ÷ C'], 0, 'Valeur pour atteindre la moitié de la tension.'],
  [2, 'R = 10 kΩ et C = 100 µF. La constante de temps vaut :', ['1 s', '10 s', '0,1 s'], 0, '10 000 × 0,0001 = 1 s.'],
  [2, 'Un condensateur se charge :', ['progressivement', 'instantanément', 'jamais'], 0, 'La tension monte peu à peu.'],
  [2, 'Pour doubler le délai, on peut :', ['doubler R', 'diviser R par 2', 'supprimer C'], 0, 'τ = R × C.'],
  [2, 'La minuterie d’un escalier est une application de :', ['la temporisation', 'la détection de lumière', 'la transmission'], 0, 'La lumière s’éteint après un délai.'],
  [3, 'R = 47 kΩ, C = 100 µF : τ vaut :', ['4,7 s', '47 s', '0,47 s'], 0, '47 000 × 0,0001 = 4,7 s.'],
  [3, 'Pour τ = 1 s, le délai est environ :', ['0,69 s', '2 s', '6,9 s'], 0, '0,69 × 1.'],
  [3, 'Pour raccourcir le délai en gardant C, on :', ['diminue R', 'augmente R', 'supprime la pile'], 0, 'τ = R × C diminue.'],
  [3, 'L’unité usuelle d’un condensateur de temporisation est le :', ['microfarad (µF)', 'volt', 'ohm'], 0, 'Capacité en farads.']
];
B.mvt2 = [
  [1, 'Une courroie entre deux poulies fait tourner la seconde :', ['dans le même sens', 'en sens inverse', 'jamais'], 0, 'Montage ouvert.'],
  [1, 'Deux roues dentées en contact tournent :', ['en sens inverse', 'dans le même sens', 'à l’arrêt'], 0, 'Les dents s’engrènent.'],
  [1, 'Pour des poulies : N2 =', ['N1 × d1 ÷ d2', 'N1 × d2 ÷ d1', 'N1 + d1'], 0, 'La plus grande poulie tourne plus lentement.'],
  [1, 'Chaîne et pignons font tourner les deux pignons :', ['dans le même sens', 'en sens inverse', 'jamais'], 0, 'Comme sur un vélo.'],
  [1, 'La fonction « transmettre » :', ['amène le mouvement du moteur jusqu’à l’actionneur', 'mesure la vitesse', 'stocke l’énergie'], 0, 'Poulies, engrenages, chaîne…'],
  [2, 'Poulie de 40 mm à 600 tr/min entraînant une poulie de 80 mm : la seconde tourne à :', ['300 tr/min', '1200 tr/min', '600 tr/min'], 0, '600 × 40 ÷ 80.'],
  [2, 'Pignon de 10 dents à 100 tr/min entraînant un pignon de 20 dents : le second tourne à :', ['50 tr/min', '200 tr/min', '100 tr/min'], 0, '100 × 10 ÷ 20.'],
  [2, 'Une petite poulie motrice entraîne une grande poulie : la vitesse :', ['diminue', 'augmente', 'reste la même'], 0, 'N2 = N1 × d1 ÷ d2 avec d2 plus grand.'],
  [2, 'Un pignon de 20 dents entraîne un pignon de 10 dents : le second tourne :', ['deux fois plus vite', 'deux fois moins vite', 'à la même vitesse'], 0, 'N2 = N1 × 20 ÷ 10.'],
  [2, 'Trois roues dentées alignées : la dernière tourne :', ['dans le même sens que la première', 'en sens inverse de la première', 'à l’arrêt'], 0, 'Chaque contact inverse le sens.'],
  [3, 'N1 = 300 tr/min, z1 = 20, z2 = 40. N2 vaut :', ['150 tr/min', '600 tr/min', '300 tr/min'], 0, '300 × 20 ÷ 40.'],
  [3, 'Une poulie de 60 mm à 300 tr/min entraîne une poulie de 20 mm. Celle-ci tourne à :', ['900 tr/min', '100 tr/min', '300 tr/min'], 0, '300 × 60 ÷ 20.'],
  [3, 'Une courroie peut patiner car :', ['elle transmet par frottement', 'elle a des dents', 'elle est en acier'], 0, 'La chaîne et les engrenages, eux, ne glissent pas.'],
  [3, 'Un rapport de transmission de 1/2 signifie que la vitesse :', ['est divisée par 2', 'est doublée', 'ne change pas'], 0, 'N2 = N1 × 1/2.']
];
B.pcb = [
  [1, 'Un circuit imprimé remplace les fils par :', ['des pistes de cuivre', 'des fils de laine', 'des tuyaux'], 0, 'Elles relient les pastilles.'],
  [1, 'Les composants se soudent sur :', ['les pastilles', 'le plastique', 'les pistes entre elles'], 0, 'Les pastilles reçoivent les broches.'],
  [1, 'L’ordre de fabrication est :', ['schéma, typon, insolation, révélation, gravure, perçage, soudure', 'soudure, schéma, gravure, perçage', 'perçage, soudure, typon, schéma'], 0, 'Du dessin du schéma à l’assemblage.'],
  [1, 'Le typon est :', ['un film portant le dessin des pistes', 'un fer à souder', 'un composant'], 0, 'Il sert à insoler la plaque.'],
  [1, 'La soudure sert à :', ['fixer et relier les composants', 'dessiner les pistes', 'percer la plaque'], 0, 'Elle assure le contact électrique.'],
  [2, 'L’insolation :', ['expose la résine à la lumière à travers le typon', 'découpe la plaque', 'chauffe l’étain'], 0, 'Le dessin des pistes se transfère.'],
  [2, 'La gravure :', ['enlève le cuivre non protégé', 'ajoute du cuivre', 'colle les composants'], 0, 'Il ne reste que les pistes.'],
  [2, 'Chaque piste relie :', ['deux pastilles du schéma', 'deux plaques', 'deux fers à souder'], 0, 'Comme un fil du schéma.'],
  [2, 'Le perçage a lieu :', ['après la gravure', 'avant le typon', 'après la vente'], 0, 'On perce les pastilles.'],
  [2, 'Pour souder en sécurité, on porte :', ['des lunettes de protection', 'un manteau de pluie', 'rien'], 0, 'Aussi des gants et un local aéré.'],
  [3, 'Deux pistes voisines qui se touchent provoquent :', ['un court-circuit', 'une meilleure liaison', 'un gain d’énergie'], 0, 'Le courant passe là où il ne doit pas.'],
  [3, 'Le fer à souder chaud se pose :', ['sur son support', 'sur la table', 'dans la main'], 0, 'Il atteint plus de 300 °C.'],
  [3, 'Recycler signifie :', ['réutiliser les matériaux d’un appareil usagé', 'jeter à la poubelle', 'brûler les déchets'], 0, 'On évite de gaspiller les matières premières.'],
  [3, 'On aère le local pendant la soudure pour :', ['éloigner les fumées', 'refroidir le fer', 'aller plus vite'], 0, 'Les fumées de soudure sont nocives.']
];
B.ent1 = [
  [1, 'Un bien est :', ['un objet matériel', 'une activité rendue', 'un diagramme'], 0, 'Téléphone, cahier…'],
  [1, 'Un service est :', ['une activité rendue à quelqu’un', 'un objet matériel', 'une matière première'], 0, 'Coupe de cheveux, transport…'],
  [1, 'Le client est celui qui :', ['achète', 'fabrique', 'répare'], 0, 'Il paie le produit ou le service.'],
  [1, 'Le consommateur est celui qui :', ['consomme le produit', 'fabrique le produit', 'vend le produit'], 0, 'L’utilisateur se sert du produit.'],
  [1, 'Une coupe de cheveux est :', ['un service', 'un bien', 'une matière'], 0, 'C’est une activité.'],
  [2, 'La demande est :', ['ce que les clients veulent acheter', 'ce que les producteurs vendent', 'le prix de revient'], 0, 'Elle diminue quand le prix monte.'],
  [2, 'L’offre est :', ['ce que les producteurs vendent', 'ce que les clients achètent', 'un impôt'], 0, 'Elle augmente avec le prix.'],
  [2, 'Quand le prix monte, en général :', ['la demande baisse et l’offre augmente', 'la demande et l’offre baissent', 'la demande monte'], 0, 'Clients prudents, producteurs motivés.'],
  [2, 'L’équilibre du marché est atteint quand :', ['l’offre est égale à la demande', 'le prix est nul', 'il n’y a pas de client'], 0, 'Il détermine le prix d’équilibre.'],
  [2, 'Un téléphone est :', ['un bien', 'un service', 'une exigence'], 0, 'Objet matériel.'],
  [3, 'Une gelée détruit des récoltes : l’offre baisse. Le prix :', ['augmente', 'diminue', 'ne change pas'], 0, 'Moins de produits pour la même demande.'],
  [3, 'Une mode fait monter la demande. Le prix d’équilibre :', ['augmente', 'diminue', 'reste nul'], 0, 'Plus de clients pour la même offre.'],
  [3, 'Un parent achète un jouet pour son enfant. Le parent est :', ['le client, et l’enfant l’utilisateur', 'le consommateur, et l’enfant le client', 'ni client ni utilisateur'], 0, 'Celui qui achète n’est pas toujours celui qui s’en sert.'],
  [3, 'Quand l’offre dépasse la demande, le prix a tendance à :', ['baisser', 'monter', 'rester fixe'], 0, 'Les producteurs doivent attirer les clients.']
];
B.ent2 = [
  [1, 'Le secteur primaire concerne :', ['les ressources de la nature', 'les services', 'la transformation seulement'], 0, 'Agriculture, pêche, mines.'],
  [1, 'Le secteur secondaire :', ['transforme les matières', 'récolte les matières', 'vend seulement'], 0, 'Usines, ateliers.'],
  [1, 'Le secteur tertiaire regroupe :', ['les services', 'les mines', 'les usines'], 0, 'Commerce, transport, enseignement.'],
  [1, 'Le secteur quaternaire repose sur :', ['le savoir et l’innovation', 'la pêche', 'la fabrication de masse'], 0, 'Recherche, informatique.'],
  [1, 'L’approvisionnement consiste à :', ['acheter les matières et fournitures', 'fabriquer le produit', 'vendre le produit'], 0, 'Première fonction de l’entreprise.'],
  [2, 'La production consiste à :', ['fabriquer le produit', 'acheter la matière', 'faire de la publicité'], 0, 'Transformer les matières en produits.'],
  [2, 'La commercialisation consiste à :', ['vendre le produit', 'fabriquer le produit', 'acheter la matière'], 0, 'Distribution, vente, publicité.'],
  [2, 'Un boulanger relève du secteur :', ['secondaire', 'primaire', 'quaternaire'], 0, 'Il transforme la farine en pain.'],
  [2, 'Un agriculteur relève du secteur :', ['primaire', 'secondaire', 'tertiaire'], 0, 'Il exploite la nature.'],
  [2, 'Un enseignant relève du secteur :', ['tertiaire', 'primaire', 'secondaire'], 0, 'Il rend un service.'],
  [3, 'Un laboratoire de recherche relève du secteur :', ['quaternaire', 'primaire', 'secondaire'], 0, 'Il produit du savoir.'],
  [3, 'Acheter la farine pour fabriquer du pain relève de :', ['l’approvisionnement', 'la production', 'la commercialisation'], 0, 'On se procure les matières.'],
  [3, 'Transformer la farine en pain relève de :', ['la production', 'l’approvisionnement', 'la commercialisation'], 0, 'C’est la fabrication.'],
  [3, 'Une entreprise de transport relève du secteur :', ['tertiaire', 'primaire', 'secondaire'], 0, 'Elle rend un service.']
];
B.ent3 = [
  [1, 'Une mini-entreprise est :', ['un projet où des élèves créent et gèrent une activité', 'une grande usine', 'un jeu vidéo'], 0, 'On apprend en agissant.'],
  [1, 'La première étape est :', ['l’idée', 'la vente', 'la comptabilité'], 0, 'Tout part d’une idée qui répond à un besoin.'],
  [1, 'L’étude de marché sert à :', ['connaître les clients et leurs besoins', 'fabriquer le produit', 'réparer le produit'], 0, 'Elle précède la production.'],
  [1, 'Le coût de revient est :', ['matières + main-d’œuvre + charges', 'prix de vente seulement', 'marge seulement'], 0, 'Tout ce que coûte un produit.'],
  [1, 'Le prix de vente est :', ['coût de revient + marge', 'coût de revient − marge', 'marge seulement'], 0, 'La marge est le gain.'],
  [2, 'Matières 20 DH, main-d’œuvre 10 DH, charges 5 DH. Le coût de revient est :', ['35 DH', '30 DH', '15 DH'], 0, '20 + 10 + 5.'],
  [2, 'Coût de revient 35 DH, marge 10 DH. Le prix de vente est :', ['45 DH', '25 DH', '350 DH'], 0, '35 + 10.'],
  [2, 'Le nom et le logo servent à :', ['identifier l’entreprise et son produit', 'calculer le coût', 'fabriquer le produit'], 0, 'C’est son identité.'],
  [2, 'La marge sert à :', ['dégager un gain', 'payer l’électricité seulement', 'réduire le prix'], 0, 'Elle permet de réaliser un bénéfice.'],
  [2, 'Si le coût augmente et le prix reste fixe, la marge :', ['diminue', 'augmente', 'ne change pas'], 0, 'Marge = prix − coût.'],
  [3, 'On vend 20 articles avec une marge de 10 DH chacun. Le bénéfice total est :', ['200 DH', '30 DH', '2 000 DH'], 0, '20 × 10.'],
  [3, 'Quel est l’ordre des étapes ?', ['idée, étude de marché, nom et logo, coût de revient, distribution, production, vente', 'vente, idée, logo, production', 'production, idée, vente, étude'], 0, 'On étudie avant de produire.'],
  [3, 'On calcule le coût de revient avant le prix pour :', ['ne pas vendre à perte', 'faire plus de publicité', 'embaucher plus d’élèves'], 0, 'Le prix doit couvrir le coût.'],
  [3, 'Si le prix de vente est inférieur au coût de revient, l’entreprise réalise :', ['une perte', 'un bénéfice', 'un équilibre parfait'], 0, 'Elle perd de l’argent sur chaque article.']
];
