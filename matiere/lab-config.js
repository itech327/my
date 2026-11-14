/* Configuration des défis : Technologie en mouvement (3AC).
   Même contrat que lab/lab-svt.js : window.LAB_CONFIG = { app, appName, map, gen, riddles }.
   SUBJECT est injecté par tools/build_subject.py depuis matiere/config.json. */
(function () {
  'use strict';
  var SUBJECT = /*__SUBJECT__*/null;
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function fm(x, d) { var s = (+x).toFixed(d === undefined ? 1 : d); if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, ''); return s.replace('.', ','); }
  function num(q, a, u, e, h, tol) { return { t: 'num', q: q, a: a, u: u || '', e: e, h: h || '', tol: tol === undefined ? (Math.abs(a - Math.round(a)) < 1e-9 ? 0.5 : 0.006) : tol, sol: fm(a, 2) + (u ? ' ' + u : '') }; }

  /* [niveau, question, options, bonne réponse (index), explication] */
  var B = {
    evo: [
      [1, 'Un système où l’énergie et la commande sont humaines est :', ['primitif', 'mécanisé', 'automatisé'], 0, 'La force musculaire fournit l’énergie.'],
      [1, 'Un tracteur conduit par un agriculteur est :', ['mécanisé', 'primitif', 'robotisé'], 0, 'Moteur pour l’énergie, commande humaine.'],
      [2, 'Quel système n’a pas besoin d’intervention humaine pour sa commande ?', ['le système automatisé', 'le système primitif', 'le système mécanisé'], 0, 'Des capteurs et une unité de traitement commandent le système.'],
      [2, 'Un robot se distingue d’un automate simple par :', ['sa programmabilité et sa polyvalence', 'son absence de moteur', 'sa commande humaine'], 0, 'Il s’adapte grâce à ses capteurs et à son programme.'],
      [3, 'Pour changer le comportement d’un système à technologie programmée, il faut :', ['modifier le programme', 'refaire le câblage', 'changer l’alimentation'], 0, 'Le comportement dépend du programme.'],
      [3, 'Quel critère distingue le système mécanisé du système automatisé ?', ['le type de commande', 'la couleur', 'le prix'], 0, 'Commande humaine pour le mécanisé, automatique pour l’automatisé.']
    ],
    acq: [
      [1, 'Quel composant détecte la présence d’une personne ?', ['le détecteur de présence', 'la photorésistance', 'le moteur'], 0, 'Il détecte le rayonnement infrarouge d’une personne en mouvement.'],
      [1, 'Un signal qui ne prend que les valeurs 0 ou 1 est :', ['logique', 'analogique', 'sonore'], 0, 'Il n’a que deux états.'],
      [2, 'Un capteur de température fournit un signal :', ['analogique', 'logique uniquement', 'inexistant'], 0, 'Le signal varie de façon continue avec la température.'],
      [2, 'Quel composant mesure l’éclairement ?', ['la photorésistance', 'le fin de course', 'le relais'], 0, 'Sa résistance dépend de la lumière reçue.'],
      [3, 'La différence entre un capteur et un détecteur est que le détecteur :', ['donne un signal à deux états', 'mesure en continu', 'fournit de l’énergie'], 0, 'Il compare à un seuil et donne 0 ou 1.'],
      [3, 'Pour mesurer la distance d’un obstacle, on utilise :', ['un capteur à ultrasons', 'un fin de course', 'un buzzer'], 0, 'Il mesure la durée de l’écho.']
    ],
    trait: [
      [1, 'Quel symbole d’organigramme représente un test ?', ['le losange', 'l’ovale', 'le rectangle'], 0, 'Le losange pose une question : oui ou non.'],
      [1, 'Un algorithme est :', ['une suite ordonnée d’opérations', 'un composant électronique', 'un type de moteur'], 0, 'Il décrit comment résoudre un problème.'],
      [2, 'La structure « tant que … faire » est :', ['répétitive', 'linéaire', 'conditionnelle'], 0, 'Elle répète des actions.'],
      [2, 'Une variable est :', ['une case mémoire nommée', 'un câble', 'une pile'], 0, 'Sa valeur peut changer.'],
      [3, 'Téléverser un programme, c’est :', ['l’envoyer dans la carte', 'le supprimer', 'le dessiner'], 0, 'Il passe de l’ordinateur à la mémoire de la carte.'],
      [3, 'Dans « si obstacle alors arrêter sinon avancer », la structure est :', ['conditionnelle', 'répétitive', 'linéaire'], 0, 'Le choix dépend d’une condition.'],
      [1, 'Quelle fonction réalise le microcontrôleur de la carte Arduino ?', ['Traiter', 'Alimenter', 'Transmettre'], 0, 'Le microcontrôleur exécute le programme : il traite les informations.'],
      [2, 'Quelle fonction est exécutée une seule fois au démarrage d’un programme Arduino ?', ['setup()', 'loop()', 'delay()'], 0, 'setup() s’exécute une fois, loop() se répète sans fin.'],
      [2, 'Quelle instruction définit une broche comme sortie ?', ['pinMode(broche, OUTPUT)', 'digitalRead(broche)', 'delay(broche)'], 0, 'pinMode choisit le mode de la broche.'],
      [3, 'Que fait l’instruction delay(500) ?', ['elle attend 500 millisecondes', 'elle attend 500 secondes', 'elle répète 500 fois'], 0, 'Le delay est exprimé en millisecondes.'],
      [3, 'Avec digitalRead(btnPin) puis digitalWrite(ledPin, val), la LED :', ['recopie l’état du bouton', 'clignote toujours', 'reste éteinte'], 0, 'La valeur lue est recopiée sur la LED.']
    ],
    comm: [
      [1, 'Un voyant lumineux est une communication :', ['visuelle', 'sonore', 'câblée'], 0, 'Il informe par la lumière.'],
      [1, 'Un buzzer assure une communication :', ['sonore', 'visuelle', 'sans fil'], 0, 'Il émet un son.'],
      [2, 'Le Bluetooth est une communication :', ['sans fil', 'câblée', 'sonore'], 0, 'L’information voyage par ondes.'],
      [2, 'Un câble USB relève de la communication :', ['câblée', 'visuelle', 'sonore'], 0, 'L’information circule dans un câble.'],
      [3, 'Quelles communications s’adressent à l’utilisateur ?', ['visuelle et sonore', 'câblée et sans fil', 'aucune'], 0, 'Voyants, écrans et sons informent l’être humain.'],
      [3, 'Une télécommande infrarouge utilise une communication :', ['sans fil', 'câblée', 'sonore'], 0, 'Pas de câble entre les deux appareils.']
    ],
    ali: [
      [1, 'Le côté long du symbole d’une pile est la borne :', ['+', '−', 'neutre'], 0, 'Le trait long représente la borne positive.'],
      [1, 'La fonction « Alimenter » :', ['fournit l’énergie au système', 'mesure une grandeur', 'transmet un mouvement'], 0, 'Elle apporte l’énergie nécessaire au fonctionnement.'],
      [2, 'Un circuit ouvert :', ['ne laisse pas passer le courant', 'laisse passer le courant', 'augmente la tension'], 0, 'Le courant ne circule que dans un circuit fermé.'],
      [2, 'Une pile fournit un courant :', ['continu (CC)', 'alternatif uniquement', 'sonore'], 0, 'Les piles et batteries donnent du courant continu.'],
      [3, 'Pour augmenter l’autonomie d’un système, on peut :', ['réduire sa consommation', 'diminuer la capacité de la batterie', 'ouvrir le circuit en permanence'], 0, 'Autonomie = capacité ÷ courant consommé.'],
      [3, 'Les caractéristiques d’une source d’alimentation sont :', ['tension, courant, autonomie', 'forme, couleur, prix', 'vitesse, angle, température'], 0, 'Ce sont les trois grandeurs à connaître.']
    ],
    dis: [
      [1, 'Quel composant est un pré-actionneur ?', ['le relais', 'le moteur', 'la photorésistance'], 0, 'Le moteur est un actionneur, la photorésistance un capteur.'],
      [1, 'Un bouton poussoir ferme le circuit :', ['tant qu’on appuie', 'définitivement', 'jamais'], 0, 'Il s’ouvre dès qu’on le relâche.'],
      [2, 'Le relais permet de :', ['commander un circuit de puissance avec un petit courant', 'mesurer une température', 'stocker de l’énergie'], 0, 'La bobine ferme un contact du circuit de puissance.'],
      [2, 'Un transistor bloqué se comporte comme :', ['un interrupteur ouvert', 'un interrupteur fermé', 'une pile'], 0, 'Aucun courant ne passe.'],
      [3, 'Un transistor devient saturé quand sa tension de commande :', ['dépasse son seuil (≈ 0,7 V)', 'est nulle', 'est négative'], 0, 'Il se comporte alors comme un interrupteur fermé.'],
      [3, 'La fonction « Distribuer » :', ['envoie l’énergie vers les actionneurs', 'produit l’énergie', 'mesure une grandeur'], 0, 'Elle utilise des pré-actionneurs.']
    ],
    conv: [
      [1, 'Une résistance chauffante convertit l’énergie électrique en :', ['chaleur', 'translation', 'lumière uniquement'], 0, 'L’énergie électrique devient de l’énergie thermique.'],
      [1, 'Un moteur à courant continu produit :', ['une rotation', 'une translation', 'de la chaleur uniquement'], 0, 'Il convertit l’énergie électrique en mouvement de rotation.'],
      [2, 'Quel actionneur utilise de l’air comprimé pour produire une translation ?', ['le vérin', 'le moteur CC', 'le servomoteur'], 0, 'La tige du vérin sort ou rentre.'],
      [2, 'Pour inverser le sens d’un moteur CC, on :', ['inverse la polarité', 'coupe l’alimentation', 'ajoute une résistance'], 0, 'Le sens dépend du sens du courant.'],
      [3, 'Un servomoteur se commande par :', ['un angle', 'une température', 'une pression'], 0, 'Il se positionne à l’angle demandé et le maintient.'],
      [3, 'La fonction « Convertir » est assurée par :', ['les actionneurs', 'les capteurs', 'les pré-actionneurs'], 0, 'Un actionneur transforme l’énergie reçue.']
    ],
    trans: [
      [1, 'Deux engrenages en contact tournent :', ['en sens inverses', 'dans le même sens', 'sans tourner'], 0, 'Les dents s’engrènent et inversent le sens.'],
      [1, 'Une poulie et une courroie assurent :', ['la transmission d’un mouvement', 'la mesure d’une grandeur', 'la production d’énergie'], 0, 'La courroie relie deux poulies.'],
      [2, 'Quelle solution transforme une rotation en translation ?', ['le pignon-crémaillère', 'la poulie-courroie', 'les roues de friction'], 0, 'La crémaillère avance en ligne droite.'],
      [2, 'La bielle-manivelle donne une translation :', ['alternative', 'continue dans un seul sens', 'nulle'], 0, 'Le coulisseau fait des allers-retours.'],
      [3, 'Si la roue menée est plus petite que la roue menante, elle tourne :', ['plus vite', 'moins vite', 'à la même vitesse'], 0, 'r = D₁ ÷ D₂ est supérieur à 1.'],
      [3, 'Quelle solution permet une très forte réduction de vitesse ?', ['la roue et la vis sans fin', 'les roues de friction', 'la poulie-courroie de même diamètre'], 0, 'Un tour de vis fait avancer la roue d’une dent.'],
      [1, 'Quel système transforme une rotation en translation ?', ['le pignon-crémaillère', 'la poulie-courroie', 'les roues de friction'], 0, 'La crémaillère avance en ligne droite.'],
      [2, 'Dans un système vis-écrou, un tour de vis fait avancer l’écrou :', ['d’un pas', 'de deux pas', 'de la moitié d’un pas'], 0, 'Le pas est la translation obtenue pour un tour.'],
      [3, 'Un système bielle-manivelle transforme :', ['une rotation continue en translation alternative', 'une translation en rotation lente', 'une rotation en lumière'], 0, 'Le piston fait des allers-retours.'],
      [3, 'Un système pignon-crémaillère est :', ['réversible', 'toujours irréversible', 'sans mouvement'], 0, 'On peut passer de la rotation à la translation et inversement.']
    ],
    agir: [
      [1, 'Le foret d’une perceuse est :', ['l’effecteur', 'le capteur', 'le pré-actionneur'], 0, 'Il agit directement sur la pièce.'],
      [1, 'La matière d’œuvre est :', ['ce sur quoi agit le système', 'la source d’énergie', 'le programme'], 0, 'C’est la matière, l’énergie ou l’information traitée.'],
      [2, 'Dans un chauffe-eau, la valeur ajoutée est un changement de :', ['température', 'forme', 'position'], 0, 'L’eau froide devient de l’eau chaude.'],
      [2, 'Dans un ascenseur, la valeur ajoutée est un changement de :', ['position', 'forme', 'température'], 0, 'Les personnes sont déplacées d’un étage à un autre.'],
      [3, 'Quelle chaîne contient la fonction « Traiter » ?', ['la chaîne d’information', 'la chaîne d’énergie', 'aucune'], 0, 'Acquérir, Traiter, Communiquer : chaîne d’information.'],
      [3, 'Quelle fonction termine la chaîne d’énergie ?', ['Agir', 'Alimenter', 'Acquérir'], 0, 'L’effecteur agit sur la matière d’œuvre.']
    ],
    des: [
      [1, 'Quel trait représente les contours visibles ?', ['continu fort', 'interrompu fin', 'mixte fin'], 0, 'Les arêtes visibles sont en trait continu fort.'],
      [1, 'Le trait mixte fin sert à dessiner :', ['les axes', 'les contours cachés', 'les cotes'], 0, 'Axes de symétrie, de trous et de cylindres.'],
      [2, 'Quel trait représente les contours cachés ?', ['interrompu fin', 'continu fort', 'mixte fin'], 0, 'Les arêtes cachées se dessinent en traits interrompus fins.'],
      [2, 'Un schéma montre :', ['le fonctionnement avec des symboles', 'toutes les cotes d’une pièce', 'un assemblage éclaté'], 0, 'Il ne montre pas la forme réelle.'],
      [3, 'En perspective cavalière, la profondeur est :', ['tracée à 45° et réduite de moitié', 'en vraie grandeur', 'supprimée'], 0, 'Seule la face avant est en vraie grandeur.'],
      [3, 'Quel dessin définit une seule pièce de façon complète ?', ['le dessin de définition', 'le schéma', 'le croquis'], 0, 'Il contient les vues, les cotes et la matière.']
    ],
    ener: [
      [1, 'Quelle énergie est non renouvelable ?', ['le pétrole', 'le vent', 'le Soleil'], 0, 'Le pétrole est une énergie fossile.'],
      [1, 'La biomasse est une énergie :', ['renouvelable', 'fossile', 'qui ne se renouvelle pas'], 0, 'Les plantes repoussent.'],
      [2, 'Quelle source émet le moins de CO₂ en fonctionnement ?', ['l’éolien', 'le charbon', 'le gaz'], 0, 'L’éolien ne brûle aucun combustible.'],
      [2, 'Les énergies fossiles sont :', ['le pétrole, le charbon et le gaz', 'le vent et l’eau', 'le Soleil et la biomasse'], 0, 'Elles se sont formées sur des millions d’années.'],
      [3, 'Quel est un inconvénient possible d’un barrage ?', ['il modifie le milieu naturel', 'il émet beaucoup de CO₂ en fonctionnement', 'il ne produit jamais d’électricité'], 0, 'Un barrage change le paysage et les écosystèmes.'],
      [3, 'Les trois énergies renouvelables les plus utilisées à grande échelle sont :', ['hydroélectricité, éolien, solaire', 'pétrole, gaz, charbon', 'bois, tourbe, charbon'], 0, 'Ce sont les trois du programme.']
    ],
    hyd: [
      [1, 'Dans une centrale hydroélectrique, la turbine entraîne :', ['la génératrice', 'le barrage', 'la conduite forcée'], 0, 'La génératrice produit l’électricité.'],
      [1, 'Quel composant d’une éolienne porte la nacelle ?', ['le mât', 'la pale', 'l’anémomètre'], 0, 'Il la place en hauteur.'],
      [2, 'Où l’énergie hydraulique est-elle stockée ?', ['dans des bassins', 'dans des piles', 'dans des câbles'], 0, 'L’eau en altitude est une réserve d’énergie.'],
      [2, 'Quel composant contient la génératrice d’une éolienne ?', ['la nacelle', 'le mât', 'la pale'], 0, 'La nacelle abrite aussi le multiplicateur de vitesse.'],
      [3, 'Quand le vent dépasse environ 25 m/s, l’éolienne :', ['s’arrête par sécurité', 'produit encore plus', 'accélère'], 0, 'Les pales sont mises en drapeau.'],
      [3, 'Pour une petite éolienne, on stocke l’énergie dans :', ['des batteries', 'un grand bassin', 'un barrage'], 0, 'Les batteries conviennent aux petites installations.']
    ],
    sol: [
      [1, 'Le solaire thermique produit surtout :', ['de la chaleur', 'du vent', 'du son'], 0, 'Un capteur plan chauffe de l’eau.'],
      [1, 'Un panneau photovoltaïque produit :', ['de l’électricité', 'de la chaleur uniquement', 'du vent'], 0, 'Il transforme la lumière en électricité.'],
      [2, 'Quel appareil transforme le courant continu en courant alternatif ?', ['l’onduleur', 'le régulateur', 'le panneau'], 0, 'L’onduleur alimente les appareils en courant alternatif.'],
      [2, 'Dans une centrale à tour, les héliostats :', ['renvoient les rayons vers le récepteur', 'produisent la vapeur', 'stockent l’eau'], 0, 'Ils suivent le Soleil et visent le récepteur.'],
      [3, 'Le régulateur d’une installation photovoltaïque sert à :', ['protéger la batterie', 'produire de l’électricité', 'orienter les panneaux'], 0, 'Il évite les surcharges et les décharges profondes.'],
      [3, 'L’absorbeur d’un capteur solaire plan est de couleur noire pour :', ['absorber un maximum de rayonnement', 'refléter le Soleil', 'stocker l’électricité'], 0, 'Une surface noire absorbe mieux la lumière.']
    ],
    eff: [
      [1, 'Quelle classe de l’étiquette énergie est la plus économe ?', ['A', 'D', 'G'], 0, 'La classe A consomme le moins.'],
      [1, 'L’étiquette énergie sert à :', ['comparer la consommation des appareils', 'mesurer la température', 'régler la vitesse'], 0, 'Elle classe les appareils de A à G.'],
      [2, 'Deux appareils rendent le même service. Le moins gourmand a :', ['la meilleure efficacité énergétique', 'la moins bonne efficacité', 'aucune efficacité'], 0, 'Il consomme moins pour le même service.'],
      [2, 'Quelle classe est la plus gourmande ?', ['G', 'A', 'C'], 0, 'G est en bas de l’échelle.'],
      [3, 'Le diagramme des exigences décrit :', ['les fonctions et les contraintes', 'les composants électroniques', 'les utilisateurs uniquement'], 0, 'Il précise ce que le système doit faire.'],
      [3, 'Dans le projet « maisonnette solaire », l’éclairage est commandé par :', ['un interrupteur crépusculaire', 'une éolienne', 'un chauffe-eau'], 0, 'Une photorésistance détecte la tombée de la nuit.'],
      [1, 'Dans le diagramme des exigences du robot auto-tampon, quel bloc satisfait « Se propulser » ?', ['les moteurs', 'le pare-chocs', 'l’interrupteur'], 0, 'Les moteurs propulsent le robot sur le sol.'],
      [2, 'Une exigence de raffinement :', ['précise une exigence unitaire', 'représente un bloc', 'remplace l’utilisateur'], 0, 'Elle apporte des informations qualitatives ou quantitatives.'],
      [2, 'La liaison de contenance relie :', ['deux exigences', 'un bloc et un utilisateur', 'deux blocs seulement'], 0, 'Une exigence est contenue dans une autre.'],
      [3, 'Dans un diagramme de cas d’utilisation, la relation entre « utilisateur » et « homme » est :', ['une généralisation', 'une satisfaction', 'un raffinement'], 0, 'Homme et femme sont des cas particuliers d’utilisateur.']
    ]
  };
  function fromBank(key, d) {
    var q = B[key]; if (!q) return null;
    var pool = q.filter(function (x) { return d === 1 ? x[0] <= 2 : (d === 2 ? true : x[0] >= 2); });
    var x = pick(pool), idx = shuffle(x[2].map(function (_, i) { return i; }));
    return { t: 'mcq', q: x[1], o: idx.map(function (i) { return x[2][i]; }), a: idx.indexOf(x[3]), e: x[4], h: 'Relis la leçon du chapitre.' };
  }
  var G = {
    volt: function (d) {
      var t = ri(1, 5) * 8, info = ' (0 V à 0 °C, 5 V à 40 °C, signal proportionnel)';
      if (d === 1) return num('Un capteur de température fournit une tension proportionnelle à la température' + info + '. Quelle tension à ' + t + ' °C ?', 5 * t / 40, 'V', 'U = 5 × ' + t + ' ÷ 40 = ' + fm(5 * t / 40, 3) + ' V.', 'Produit en croix : 5 V correspondent à 40 °C.', 0.02);
      var t2 = ri(3, 37);
      if (d === 2) return num('Un capteur de température fournit une tension proportionnelle à la température' + info + '. Quelle tension à ' + t2 + ' °C ?', 5 * t2 / 40, 'V', 'U = 5 × ' + t2 + ' ÷ 40 = ' + fm(5 * t2 / 40, 3) + ' V.', 'Produit en croix : 5 V correspondent à 40 °C.', 0.02);
      var u = ri(1, 9) * 0.5;
      if (d === 3) return num('Un capteur de température fournit une tension proportionnelle à la température' + info + '. Il indique ' + fm(u, 1) + ' V. Quelle est la température ?', u * 8, '°C', 'T = ' + fm(u, 1) + ' × 40 ÷ 5 = ' + fm(u * 8, 1) + ' °C.', 'Chaque volt correspond à 8 °C.', 0.1);
      var seuil = ri(2, 4) * 5;
      return num('Un capteur de température fournit une tension proportionnelle à la température' + info + '. Un détecteur passe à 1 dès que la température atteint ' + seuil + ' °C. Quelle est la tension du capteur à ce seuil ?', 5 * seuil / 40, 'V', 'U = 5 × ' + seuil + ' ÷ 40 = ' + fm(5 * seuil / 40, 3) + ' V.', 'Applique la proportionnalité au seuil.', 0.02);
    },
    ech: function (d) {
      var r = pick([20, 40, 60, 80, 100, 120, 150]), e = pick([2, 5, 10]);
      if (d === 1) return num('Une pièce de ' + r + ' mm est dessinée à l’échelle 1:2. Quelle est sa longueur sur le dessin ?', r / 2, 'mm', r + ' × 1/2 = ' + (r / 2) + ' mm.', 'Longueur sur le dessin = longueur réelle × échelle.');
      if (d === 2) return num('Une pièce de ' + r + ' mm est dessinée à l’échelle 1:' + e + '. Quelle est sa longueur sur le dessin ?', r / e, 'mm', r + ' ÷ ' + e + ' = ' + fm(r / e, 2) + ' mm.', 'Divise par ' + e + '.', 0.01);
      var dd = pick([10, 20, 25, 30, 40, 50]);
      if (d === 3) return num('Sur un dessin à l’échelle 1:' + e + ', une longueur mesure ' + dd + ' mm. Quelle est la longueur réelle ?', dd * e, 'mm', dd + ' × ' + e + ' = ' + (dd * e) + ' mm.', 'Longueur réelle = longueur dessinée × ' + e + '.');
      return num('Une pièce mesure ' + r + ' mm en réalité et ' + (r / e) + ' mm sur le dessin. Quel est le dénominateur n de l’échelle 1:n ?', e, '', r + ' ÷ ' + (r / e) + ' = ' + e + '.', 'n = longueur réelle ÷ longueur dessinée.');
    },
    mvt: function (d) {
      var R = pick([20, 30, 40, 45, 50]), th = pick([0.5, 1, 1.5, 2, 3]), Pm = pick([1, 2, 3, 4]), n = ri(5, 25);
      if (d === 1) return num('Un pignon de rayon ' + R + ' mm tourne de ' + fm(th, 1) + ' rad. De combien avance la crémaillère, en mm ?', R * th, 'mm', 'L = R × θ = ' + R + ' × ' + fm(th, 1) + ' = ' + fm(R * th, 1) + ' mm.', 'Utilise L = R × θ, avec θ en radians.', 0.1);
      if (d === 2) return num('Une vis de pas ' + Pm + ' mm fait ' + n + ' tours. De combien avance l’écrou, en mm ?', Pm * n, 'mm', 'L = P × n = ' + Pm + ' × ' + n + ' = ' + (Pm * n) + ' mm.', 'Un tour fait avancer l’écrou d’un pas.');
      if (d === 3) { var V = pick([2, 4, 5, 8, 10]); return num('Une vis de pas ' + Pm + ' mm doit faire avancer un écrou à ' + V + ' mm/s. Combien de tours par seconde doit faire la vis ?', V / Pm, 'tr/s', 'n = V ÷ P = ' + V + ' ÷ ' + Pm + ' = ' + fm(V / Pm, 2) + ' tr/s.', 'Divise la vitesse par le pas.', 0.01); }
      var V4 = pick([2, 4, 5, 10]);
      return num('Une vis de pas ' + Pm + ' mm avance à ' + V4 + ' mm/s. Elle est entraînée par un motoréducteur de rapport 1/48. Quelle est la vitesse du moteur, en tr/s ?', V4 / Pm * 48, 'tr/s', 'Vis : ' + V4 + ' ÷ ' + Pm + ' = ' + fm(V4 / Pm, 2) + ' tr/s ; moteur : × 48 = ' + fm(V4 / Pm * 48, 1) + ' tr/s.', 'Le moteur tourne 48 fois plus vite que la vis.', 0.1);
    },
    puiss: function (d) {
      var sf = ri(1, 6), g0 = ri(2, 10) * 100, eta = pick([15, 18, 20]);
      if (d === 1) return num('Un panneau photovoltaïque reçoit ' + g0 + ' W/m² sur ' + sf + ' m² avec un rendement de ' + eta + ' %. Quelle puissance produit-il ?', sf * g0 * eta / 100, 'W', sf + ' × ' + g0 + ' × ' + eta + ' ÷ 100 = ' + fm(sf * g0 * eta / 100, 1) + ' W.', 'P = surface × ensoleillement × rendement.', 0.1);
      var p = ri(3, 12) * 50;
      if (d === 2) return num('Un panneau produit ' + p + ' W pendant 5 h. Quelle énergie fournit-il, en Wh ?', p * 5, 'Wh', p + ' × 5 = ' + (p * 5) + ' Wh.', 'Énergie = puissance × durée.');
      if (d === 3) return num('Un panneau de ' + p + ' W produit pendant 5 h. Une lampe de 20 W doit fonctionner 4 h. Combien de lampes peut-on alimenter au maximum ?', Math.floor(p * 5 / 80), '', 'Énergie produite : ' + p + ' × 5 = ' + (p * 5) + ' Wh. Une lampe consomme 20 × 4 = 80 Wh. Nombre de lampes : ' + Math.floor(p * 5 / 80) + '.', 'Divise l’énergie produite par l’énergie consommée par une lampe.');
      var pe = ri(2, 6) * 100, he = ri(4, 10);
      return num('Une éolienne de ' + pe + ' W fonctionne à pleine puissance pendant ' + he + ' h. Quelle énergie produit-elle, en kWh ?', pe * he / 1000, 'kWh', pe + ' × ' + he + ' = ' + (pe * he) + ' Wh = ' + fm(pe * he / 1000, 2) + ' kWh.', 'Énergie = puissance × durée, puis divise les Wh par 1 000.', 0.01);
    },
    cout: function (d) {
      var a = pick([90, 120, 150, 190]), b = pick([230, 280, 340]), p = pick([1, 1.2, 1.5, 2]);
      if (d === 1) return num('Un appareil consomme ' + a + ' kWh par an. Le kWh coûte ' + fm(p, 1) + ' DH. Quel est le coût annuel ?', a * p, 'DH', a + ' × ' + fm(p, 1) + ' = ' + fm(a * p, 1) + ' DH.', 'Coût = énergie × prix du kWh.', 0.1);
      if (d === 2) return num('Un appareil de classe A consomme ' + a + ' kWh par an et un appareil de classe G ' + b + ' kWh par an. Quelle est la différence de consommation, en kWh ?', b - a, 'kWh', b + ' − ' + a + ' = ' + (b - a) + ' kWh.', 'Soustrais les deux consommations.');
      if (d === 3) return num('Un appareil consomme ' + a + ' kWh par an et un autre ' + b + ' kWh par an. Avec un kWh à ' + fm(p, 1) + ' DH, combien économise-t-on par an avec le premier ?', (b - a) * p, 'DH', '(' + b + ' − ' + a + ') × ' + fm(p, 1) + ' = ' + fm((b - a) * p, 1) + ' DH.', 'Différence de consommation × prix.', 0.1);
      var y = ri(5, 10);
      return num('Un appareil consomme ' + a + ' kWh par an et un autre ' + b + ' kWh par an. Avec un kWh à ' + fm(p, 1) + ' DH, combien économise-t-on en ' + y + ' ans avec le premier ?', (b - a) * p * y, 'DH', '(' + b + ' − ' + a + ') × ' + fm(p, 1) + ' × ' + y + ' = ' + fm((b - a) * p * y, 1) + ' DH.', 'Économie annuelle × nombre d’années.', 0.1);
    },
    auto: function (d) {
      var i = ri(2, 10) * 50, c = ri(2, 8) * 500;
      if (d === 1) return num('Une batterie de ' + c + ' mAh alimente un système qui consomme ' + i + ' mA. Quelle est son autonomie ?', c / i, 'h', c + ' ÷ ' + i + ' = ' + fm(c / i, 2) + ' h.', 'Autonomie = capacité ÷ courant.', 0.05);
      if (d === 2) return num('Un système consomme ' + i + ' mA. Il doit fonctionner ' + (c / i >= 4 ? 4 : 2) + ' h. Quelle capacité minimale (en mAh) faut-il ?', i * (c / i >= 4 ? 4 : 2), 'mAh', i + ' × ' + (c / i >= 4 ? 4 : 2) + ' = ' + (i * (c / i >= 4 ? 4 : 2)) + ' mAh.', 'Capacité = courant × durée.');
      var h2 = ri(2, 6);
      if (d === 3) return num('Une batterie de ' + c + ' mAh alimente un système qui consomme ' + i + ' mA. Après ' + h2 + ' h, quelle capacité reste-t-il (en mAh) ?', Math.max(0, c - i * h2), 'mAh', c + ' − ' + i + ' × ' + h2 + ' = ' + Math.max(0, c - i * h2) + ' mAh.', 'Retire la capacité consommée.');
      return num('Un système consomme ' + i + ' mA en fonctionnement et ' + (i / 10) + ' mA en veille. Il fonctionne ' + h2 + ' h par jour. Quelle capacité consomme-t-il par jour (en mAh) ?', i * h2 + (i / 10) * (24 - h2), 'mAh', i + ' × ' + h2 + ' + ' + (i / 10) + ' × ' + (24 - h2) + ' = ' + fm(i * h2 + (i / 10) * (24 - h2), 1) + ' mAh.', 'Additionne la consommation en marche et en veille.', 0.1);
    },
    ratio: function (d) {
      var z1 = pick([10, 12, 15, 20, 24, 30]), z2 = pick([20, 30, 40, 45, 60]), n1 = pick([60, 120, 150, 300]);
      if (d === 1) return num('Un pignon de ' + z1 + ' dents entraîne un pignon de ' + z2 + ' dents. Quel est le rapport de transmission r = Z₁ ÷ Z₂ ?', z1 / z2, '', 'r = ' + z1 + ' ÷ ' + z2 + ' = ' + fm(z1 / z2, 3) + '.', 'Divise le nombre de dents du pignon menant par celui du pignon mené.', 0.01);
      if (d === 2) return num('Un pignon de ' + z1 + ' dents tourne à ' + n1 + ' tr/min et entraîne un pignon de ' + z2 + ' dents. Quelle est la vitesse du second, en tr/min ?', n1 * z1 / z2, 'tr/min', 'n₂ = ' + n1 + ' × ' + z1 + ' ÷ ' + z2 + ' = ' + fm(n1 * z1 / z2, 1) + ' tr/min.', 'n₂ = n₁ × Z₁ ÷ Z₂.', 0.1);
      var d1 = pick([40, 60, 80]), d2 = pick([20, 30, 120, 160]);
      if (d === 3) return num('Une poulie de diamètre ' + d1 + ' mm, qui tourne à ' + n1 + ' tr/min, entraîne par courroie une poulie de diamètre ' + d2 + ' mm. Quelle est la vitesse de la seconde, en tr/min ?', n1 * d1 / d2, 'tr/min', 'n₂ = ' + n1 + ' × ' + d1 + ' ÷ ' + d2 + ' = ' + fm(n1 * d1 / d2, 1) + ' tr/min.', 'n₂ = n₁ × D₁ ÷ D₂.', 0.1);
      return num('Un moteur tourne à ' + n1 + ' tr/min. Un pignon de ' + z1 + ' dents entraîne un pignon de ' + z2 + ' dents, solidaire d’un pignon de 10 dents qui entraîne une roue de 40 dents. Quelle est la vitesse finale, en tr/min ?', n1 * z1 / z2 * 10 / 40, 'tr/min', 'n₂ = ' + n1 + ' × ' + z1 + ' ÷ ' + z2 + ' = ' + fm(n1 * z1 / z2, 2) + ' tr/min. Puis × 10 ÷ 40 = ' + fm(n1 * z1 / z2 * 10 / 40, 2) + ' tr/min.', 'Calcule étage par étage : chaque étage multiplie par Z menant ÷ Z mené.', 0.1);
    },
    algo: function (d) {
      var k = ri(3, 8), st = ri(2, 5);
      if (d === 1) return num('Un programme répète ' + k + ' fois « n ← n + 1 » en partant de n = 0. Quelle est la valeur finale de n ?', k, '', k + ' répétitions, chacune ajoute 1 : n = ' + k + '.', 'Une répétition ajoute 1.');
      if (d === 2) return num('Un programme répète ' + k + ' fois « n ← n + ' + st + ' » en partant de n = 0. Quelle est la valeur finale de n ?', k * st, '', k + ' × ' + st + ' = ' + (k * st) + '.', 'Chaque répétition ajoute ' + st + '.');
      var lim = ri(10, 30);
      if (d === 3) return num('n vaut 0. Tant que n < ' + lim + ', on fait « n ← n + ' + st + ' ». Combien de répétitions sont effectuées ?', Math.ceil(lim / st), '', 'On répète jusqu’à dépasser ' + lim + ' : ' + Math.ceil(lim / st) + ' fois.', 'Compte combien de pas de ' + st + ' il faut pour atteindre ' + lim + '.');
      var a0 = ri(1, 6);
      return num('n vaut ' + a0 + '. Tant que n < ' + lim + ', on fait « n ← n + ' + st + ' ». Quelle est la valeur finale de n ?', a0 + st * Math.ceil((lim - a0) / st), '', 'Il faut ' + Math.ceil((lim - a0) / st) + ' répétitions : n = ' + a0 + ' + ' + st + ' × ' + Math.ceil((lim - a0) / st) + ' = ' + (a0 + st * Math.ceil((lim - a0) / st)) + '.', 'Répète tant que n est inférieur à ' + lim + '.');
    }
  };
  var M = {};
  M['t3-1'] = { topics: ['b:evo'] };
  M['t3-2'] = { topics: ['b:acq', 'b:acq', 'g:volt'] };
  M['t3-3'] = { topics: ['b:trait', 'b:trait', 'g:algo'] };
  M['t3-4'] = { topics: ['b:comm'] };
  M['t3-5'] = { topics: ['b:ali', 'b:ali', 'g:auto'] };
  M['t3-6'] = { topics: ['b:dis'] };
  M['t3-7'] = { topics: ['b:conv'] };
  M['t3-8'] = { topics: ['b:trans', 'b:trans', 'g:ratio', 'g:mvt'] };
  M['t3-9'] = { topics: ['b:agir'] };
  M['t3-10'] = { topics: ['b:des', 'b:des', 'g:ech'] };
  M['t3-11'] = { topics: ['b:ener'] };
  M['t3-12'] = { topics: ['b:hyd'] };
  M['t3-13'] = { topics: ['b:sol', 'b:sol', 'g:puiss'] };
  M['t3-14'] = { topics: ['b:eff', 'b:eff', 'g:cout'] };

  window.LAB_CONFIG = {
    riddles: [
      { q: "Quel composant mesure une grandeur physique ?", qa: "أي مكوّن يقيس مقدارا فيزيائيا؟", o: ["le capteur", "l’actionneur", "le relais"], a: 0, e: "Un capteur transforme une grandeur physique en signal.", ea: "اللاقط يحوّل مقدارا فيزيائيا إلى إشارة." },
      { q: "Quel composant transforme l’énergie électrique en mouvement ?", qa: "أي مكوّن يحوّل الطاقة الكهربائية إلى حركة؟", o: ["le moteur", "la photorésistance", "la pile"], a: 0, e: "Le moteur est un actionneur.", ea: "المحرك مُنفِّذ." },
      { q: "Un organigramme commence par :", qa: "يبدأ المنظّم الانسيابي بـ:", o: ["Début", "Fin", "une boucle"], a: 0, e: "Il se lit de Début à Fin.", ea: "يُقرأ من البداية إلى النهاية." },
      { q: "Quelle structure répète des actions ?", qa: "أي بنية تكرر الأفعال؟", o: ["la boucle répétitive", "la séquence", "le test unique"], a: 0, e: "La boucle répète tant que la condition est vraie.", ea: "الحلقة تكرر ما دام الشرط صحيحا." },
      { q: "Quelle énergie est renouvelable ?", qa: "أي طاقة متجددة؟", o: ["l’éolien", "le charbon", "le gaz"], a: 0, e: "Le vent se renouvelle sans cesse.", ea: "الرياح تتجدد باستمرار." },
      { q: "Quel dispositif stocke l’énergie électrique d’un panneau solaire ?", qa: "أي جهاز يخزّن الطاقة الكهربائية للوح شمسي؟", o: ["la batterie", "l’onduleur", "le régulateur"], a: 0, e: "La batterie stocke l’énergie.", ea: "البطارية تخزّن الطاقة." },
      { q: "Le composant qui commande un fort courant avec un faible courant est :", qa: "المكوّن الذي يتحكم في تيار قوي بتيار ضعيف هو:", o: ["le transistor", "la résistance", "le fil"], a: 0, e: "Le transistor sert de pré-actionneur.", ea: "الترانزستور يعمل كمُنفِّذ مسبق." },
      { q: "Une vue de face, de dessus et de gauche forment :", qa: "منظر أمامي وعلوي وأيسر يشكّلون:", o: ["les trois vues", "la perspective", "l’échelle"], a: 0, e: "Elles décrivent la pièce en dessin technique.", ea: "تصف القطعة في الرسم التقني." },
      { q: "Un trait interrompu court représente :", qa: "الخط المتقطع القصير يمثل:", o: ["les contours cachés", "les contours visibles", "les axes"], a: 0, e: "Ce sont les arêtes cachées.", ea: "هي الحواف المخفية." },
      { q: "Une échelle 1:2 signifie que le dessin est :", qa: "المقياس 1:2 يعني أن الرسم:", o: ["deux fois plus petit", "deux fois plus grand", "de même taille"], a: 0, e: "1 cm sur le dessin = 2 cm réel.", ea: "1 سم على الرسم = 2 سم حقيقي." },
      { q: "Quel appareil transforme le courant continu en alternatif ?", qa: "أي جهاز يحوّل التيار المستمر إلى متناوب؟", o: ["l’onduleur", "la pile", "le capteur"], a: 0, e: "C’est le rôle de l’onduleur.", ea: "هذا دور المحوِّل." },
      { q: "Dans une éolienne, la génératrice se trouve dans :", qa: "في المروحة الريحية يوجد المولّد في:", o: ["la nacelle", "le mât", "la pale"], a: 0, e: "La nacelle abrite la génératrice.", ea: "الغرفة تحتوي المولّد." },
      { q: "Quelle classe énergie consomme le moins ?", qa: "أي فئة طاقية تستهلك أقل؟", o: ["A", "D", "G"], a: 0, e: "A est la plus économe.", ea: "A الأكثر اقتصادا." },
      { q: "Une photorésistance détecte :", qa: "المقاومة الضوئية تكشف:", o: ["la lumière", "la température", "le son"], a: 0, e: "Sa résistance change avec la lumière.", ea: "تتغير مقاومتها مع الضوء." },
      { q: "Un système qui commence par un capteur, puis traite, puis agit suit la chaîne :", qa: "نظام يبدأ بلاقط ثم معالجة ثم فعل يتبع سلسلة:", o: ["d’information puis d’énergie", "du dessin", "de la perspective"], a: 0, e: "Acquérir, traiter, communiquer, alimenter, distribuer, convertir, transmettre, agir.", ea: "اكتساب ومعالجة وتواصل وتغذية وتوزيع وتحويل ونقل وفعل." },
      { q: "Un système vis-écrou transforme :", qa: "نظام لولب-صامولة يحوّل:", o: ["une rotation en translation", "la chaleur en lumière", "la chaleur en son"], a: 0, e: "La rotation de la vis déplace l’écrou.", ea: "دوران اللولب يحرّك الصامولة." },
      { q: "Un héliostat est un miroir qui :", qa: "الهيليوستات مرآة:", o: ["suit le Soleil", "stocke l’eau", "mesure le vent"], a: 0, e: "Il renvoie les rayons vers le récepteur.", ea: "تعكس الأشعة نحو المستقبِل." },
      { q: "Le Bluetooth est un moyen de communication :", qa: "البلوتوث وسيلة تواصل:", o: ["sans fil", "filaire", "mécanique"], a: 0, e: "Il utilise des ondes radio.", ea: "يستعمل موجات راديو." },
      { q: "Pour doubler la puissance d’un panneau à rendement fixe, on double :", qa: "لمضاعفة قدرة لوح بمردود ثابت نضاعف:", o: ["la surface", "le nom", "la couleur du fil"], a: 0, e: "P = surface × ensoleillement × rendement.", ea: "القدرة = المساحة × الإشعاع × المردود." }
    ],
    app: SUBJECT.key, appName: SUBJECT.name + ' en mouvement', map: M,
    gen: function (key, d) {
      var k = key.slice(2);
      if (key.charAt(0) === 'b') return fromBank(k, d === 4 ? 3 : d);
      return G[k](d);
    }
  };
})();
