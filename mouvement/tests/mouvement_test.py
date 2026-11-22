#!/usr/bin/env python3
"""Parcourt chaque leçon des sites maths, pc et svt comme un élève, avec la CSP du fichier _headers.

    python3 mouvement/tools/build.py && python3 mouvement/tests/mouvement_test.py [--shots DOSSIER]

Se termine par « FAILS: N ».
"""
import asyncio
import functools
import http.server
import re
import os
import sys
import threading
from pathlib import Path

from playwright.async_api import async_playwright

DIST = Path(__file__).resolve().parents[1] / 'dist'
SHOTS = Path(sys.argv[sys.argv.index('--shots') + 1]) if '--shots' in sys.argv else None
FAILS = []

# réponses : (type, valeur) dans l'ordre des questions de « Nous faisons », puis réponses de « Je fais seul »
PLAN = {
    'tech/2ac-besoin': {'buttons': ['À qui rend-il', 'Sur quoi agit-il', 'Dans quel but'], 'guide': [('opt', 'à l’élève'), ('opt', 'sur les stylos'), ('opt', 'un objet technique')], 'seul': ['répondre à un besoin', 'la matière d’œuvre', 'un système technique', '8']},
    'tech/2ac-sysml': {'buttons': ['Cas d’utilisation', 'Contexte', 'Exigences'], 'guide': [('opt', 'un acteur'), ('opt', 'de contexte'), ('num', '3')], 'seul': ['un service rendu', 'des exigences', 'une exigence', '12']},
    'tech/2ac-schema': {'sliders': [8], 'guide': [('num', '220'), ('num', '1000'), ('opt', 'deux flèches qui sortent')], 'seul': ['une lampe', 'représenter le circuit', '4700', '330']},
    'tech/2ac-alimentation': {'sliders': [200], 'guide': [('num', '4,5'), ('num', '5'), ('opt', 'rechargeable')], 'seul': ['abaisser', '6', '12', '300']},
    'tech/2ac-signalisation': {'sliders': [7], 'guide': [('num', '3'), ('num', '150'), ('opt', 'risque de griller')], 'seul': ['dans le bon sens', 'sonore', '20', '500']},
    'tech/2ac-commutation': {'buttons': ['Basculer en bas', 'Basculer en haut'], 'guide': [('opt', 'tant qu’on appuie'), ('opt', 'interrupteur commandé'), ('opt', 'un circuit puissant')], 'seul': ['laisse passer', 'deux inverseurs', 'est arrêté', '1']},
    'tech/2ac-detection': {'sliders': [20], 'guide': [('opt', 'diminue'), ('opt', 'une thermistance'), ('opt', 'un ILS')], 'seul': ['la lumière', 'la chaleur', 'diminue', '40']},
    'tech/2ac-temporisation': {'sliders': [3], 'guide': [('num', '4,7'), ('num', '22'), ('opt', 'augmente R ou C')], 'seul': ['stocke', '63 %', '4,7', '100']},
    'tech/2ac-mouvement': {'sliders': [80], 'guide': [('num', '300'), ('opt', 'dans le même sens'), ('opt', 'en sens inverse')], 'seul': ['moins vite', '300', 'dans le même sens', '48']},
    'tech/2ac-circuit-imprime': {'buttons': ['Étape suivante'] * 7, 'guide': [('opt', 'le cuivre non protégé'), ('opt', 'gants et lunettes'), ('num', '80')], 'seul': ['le dessin des pistes', 'perce les trous', 'bidon', '32']},
    'tech/2ac-marche': {'sliders': [50], 'guide': [('opt', 'un service'), ('opt', 'diminue'), ('num', '70')], 'seul': ['un bien', 'le parent', 'baisser', '40']},
    'tech/2ac-entreprise': {'buttons': ['Pêche à Agadir', 'Usine automobile', 'Banque', 'Extraction des phosphates'], 'guide': [('opt', 'secondaire'), ('opt', 'la fonction commerciale'), ('opt', 'les ressources humaines')], 'seul': ['primaire', 'tertiaire', 'financière', '4']},
    'tech/2ac-mini-entreprise': {'sliders': [20], 'guide': [('num', '15'), ('num', '5'), ('num', '300')], 'seul': ['trouver une idée', 'connaître les clients', '240', '120']},
    'tech/3ac-transmettre': {'sliders': [36], 'guide': [('num', '500'), ('opt', 'dans le même sens'), ('num', '30')], 'seul': ['en sens inverse', '200', 'une rotation en', '160']},
    'tech/3ac-agir': {'buttons': ['Sortir la tige', 'Rentrer la tige'], 'guide': [('opt', 'air comprimé'), ('num', '100'), ('opt', 'transmettre puis agir')], 'seul': ['translation', 'un ressort', 'agir', '300']},
    'tech/3ac-dessin': {'buttons': ['Vue de face', 'Vue de dessus', 'Vue de gauche'], 'guide': [('num', '40'), ('num', '30'), ('opt', 'interrompu fin')], 'seul': ['sous la vue', 'continu fort', '50', '70']},
    'tech/3ac-sources': {'buttons': ['Soleil', 'Vent', 'Eau des barrages'], 'guide': [('num', '3538'), ('num', '51'), ('opt', 'non renouvelable')], 'seul': ['renouvelable', 'le charbon', '2392', '10400']},
    'tech/3ac-hydro-eolien': {'sliders': [12], 'guide': [('num', '301'), ('num', '20'), ('opt', 'se met en sécurité')], 'seul': ['une turbine', 'augmente la vitesse', '12', '75']},
    'tech/3ac-solaire': {'sliders': [30], 'guide': [('num', '3000'), ('opt', 'un onduleur'), ('num', '510')], 'seul': ['électrique', 'le continu en alternatif', 'au stockage', '1500']},
    'tech/3ac-efficacite': {'sliders': [5], 'guide': [('num', '1,5'), ('num', '11,25'), ('num', '9,75')], 'seul': ['classe A', 'éteint', '1,5', '1248']},
    'tech/3ac-systemes': {'sliders': [3], 'guide': [('opt', 'système primitif'), ('opt', 'système mécanisé'), ('opt', 'système automatisé')], 'seul': ['un moteur', 'automatisée', 'programmée', '18']},
    'tech/3ac-acquerir': {'sliders': [20], 'guide': [('num', '136'), ('num', '68'), ('opt', 'analogique')], 'seul': ['logique (0', 'un capteur de', 'aimant', '10']},
    'tech/3ac-traiter': {'buttons': ['Basculer A', 'Basculer B'], 'guide': [('opt', 'la porte OU'), ('num', '1'), ('num', '0')], 'seul': ['0', 'une suite ordonnée', '1', '8']},
    'tech/3ac-communiquer': {'sliders': [10], 'guide': [('num', '4'), ('num', '13'), ('opt', 'les ondes radio')], 'seul': ['sonore', 'infrarouge', '6', '256']},
    'tech/3ac-alimenter': {'sliders': [4], 'guide': [('num', '4,5'), ('num', '1,5'), ('opt', 'alternatif en continu')], 'seul': ['alimenter', '6', 'abaisse', '5']},
    'tech/3ac-distribuer': {'buttons': ['Fermer K1 et K4', 'Fermer K2 et K3'], 'guide': [('opt', 'un grand courant'), ('opt', 'le sens du courant'), ('opt', 'un distributeur')], 'seul': ['la commande et', 'un relais', 'un court-circuit', '200']},
    'tech/3ac-convertir': {'sliders': [50], 'guide': [('num', '1000'), ('num', '80'), ('opt', 'de la chaleur')], 'seul': ['mécanique', 'lumineuse', '150', '60']},
    'maths/2ac-ordre': {'sliders': [-2], 'guide': [('opt', '8'), ('opt', '<'), ('opt', '>')], 'seul': ['−4', '<', '>', '1']},
    'maths/2ac-proportionnalite': {'sliders': [14], 'guide': [('num', '1,5'), ('num', '24'), ('num', '48')], 'seul': ['3', '2', '75', '30']},
    'maths/2ac-statistique': {'sliders': [16], 'guide': [('num', '10'), ('num', '13,7'), ('num', '14')], 'seul': ['9', '12', '5', '10']},
    'maths/2ac-pyramides-cones': {'sliders': [3], 'guide': [('num', '36'), ('num', '360'), ('num', '120')], 'seul': ['50', '30', '37,68', '6']},
    'maths/3ac-statistiques': {'sliders': [23000], 'guide': [('opt', '7, 9, 10'), ('num', '10,5'), ('num', '10,7')], 'seul': ['5', '7', '9,5', 'la médiane']},
    'pc/1ac-protection': {'buttons': ['+ radiateur', '+ fer', '+ bouilloire'], 'guide': [('num', '9'), ('opt', 'ne fond pas'), ('opt', 'fond')], 'seul': ['le disjoncteur', 'un court-circuit', 'les personnes', '2']},
    'pc/1ac-temperature-chaleur': {'sliders': [400], 'guide': [('opt', 'de l\'air vers'), ('opt', 'se réchauffe'), ('num', '25')], 'seul': ['le thermomètre', 'du chaud vers', '40', '17']},
    'pc/1ac-conservation-masse': {'buttons': ['Congeler', 'Faire fondre'], 'guide': [('num', '265'), ('opt', 'toujours présent'), ('opt', 'exactement')], 'seul': ['se conserve', 'augmente', '325', '2,18']},
    'pc/1ac-resistance': {'sliders': [100], 'guide': [('opt', '47 Ω'), ('opt', '220 Ω'), ('opt', 'ne change pas')], 'seul': ['ohm', 'diminue', 'un conducteur', '3']},
    'pc/2ac-installation-domestique': {'buttons': ['Tester la borne rouge', 'Tester la borne bleue'], 'guide': [('opt', 'en dérivation'), ('opt', 'la phase'), ('opt', 'coupe')], 'seul': ['la phase', 'vert et jaune', 'en dérivation', '150']},
    'maths/1ac-proportionnalite': {'sliders': [6], 'guide': [('num', '4'), ('num', '32'), ('num', '8')], 'seul': ['5', '112', '24', 'non']},
    'maths/1ac-statistiques': {'sliders': [12], 'buttons': ['Circulaire'], 'guide': [('num', '0,4'), ('num', '40'), ('num', '144')], 'seul': ['3', '12', '25', '90']},
    'maths/2ac-translation': {'sliders': [7, 3], 'guide': [('opt', 'DC'), ('opt', 'C'), ('num', '5')], 'seul': ['glisser', 'la même longueur', '7', '5']},
    'maths/3ac-fonctions': {'sliders': [11], 'guide': [('num', '3'), ('num', '7'), ('opt', 'affine, non linéaire')], 'seul': ['15', '7', '4', '7']},
    'pc/1ac-lois-circuits': {'sliders': [4, 4], 'guide': [('opt', 'additivité'), ('num', '2,5'), ('opt', 'les deux')], 'seul': ['en dérivation', '0,65', '5', '0,7']},
    'pc/2ac-courant-alternatif': {'sliders': [100], 'guide': [('num', '10'), ('num', '100'), ('num', '10')], 'seul': ['50 Hz', '20', '40', '10']},
    'pc/3ac-mouvement': {'buttons': ['Trajectoire circulaire', 'Vitesse : uniforme'], 'guide': [('opt', 'rectiligne'), ('opt', 'ralenti'), ('opt', 'immobile')], 'seul': ['rectiligne', 'circulaire', 'uniforme', '30']},
    'maths/1ac-repere': {'sliders': [-3, 2], 'guide': [('num', '7'), ('num', '1,5'), ('opt', 'axe des ordonnées')], 'seul': ['5', '7', 'sous', '-2']},
    'maths/2ac-triangle-rectangle-cercle': {'sliders': [90], 'guide': [('opt', 'I, milieu'), ('num', '5'), ('num', '5')], 'seul': ['hypoténuse', '6,5', '90', '9']},
    'maths/2ac-cosinus': {'sliders': [60], 'guide': [('opt', 'EG'), ('opt', 'EG = EF × cos'), ('num', '5')], 'seul': ['adjacent ÷', '0,8', '3', 'cosinus 0,2']},
    'maths/3ac-agrandissement': {'sliders': [4], 'guide': [('opt', 'agrandissement'), ('num', '1000000'), ('num', '500000')], 'seul': ['12', '45', '56', '5']},
    'pc/1ac-intensite': {'buttons': ['après la lampe', 'près de la pile', 'Calibre 200 mA'], 'guide': [('num', '350'), ('opt', '2 A'), ('opt', 'toujours')], 'seul': ['en série', '0,25', '0,2 A', '1200']},
    'pc/2ac-loupe-oeil': {'buttons': ['myope + lunettes', 'hypermétrope + lunettes'], 'guide': [('opt', 'hypermétrope'), ('opt', 'convergentes'), ('opt', 'minces')], 'seul': ['la rétine', 'divergente', 'entre la loupe', '12,5']},
    'pc/3ac-energie-electrique': {'sliders': [10], 'buttons': ['téléviseur'], 'guide': [('num', '400'), ('num', '12'), ('num', '12')], 'seul': ['le watt', '24', '1,5', '1000']},
    'maths/1ac-cercle': {'sliders': [5], 'guide': [('num', '7'), ('opt', 'extérieur'), ('opt', 'non')], 'seul': ['12', '4,5', 'intérieur', '16']},
    'maths/2ac-quatre-operations': {'sliders': [2], 'guide': [('opt', '1/2 × 5/6'), ('opt', '5/12'), ('opt', '1/3')], 'seul': ['1', '−2/3', '1,5', '0,375']},
    'maths/2ac-droites-remarquables': {'buttons': ['médiatrices', 'hauteurs', 'médianes', 'bissectrices'], 'guide': [('opt', 'médianes'), ('num', '6'), ('num', '3')], 'seul': ['circonscrit', 'orthocentre', 'le milieu', '8']},
    'maths/3ac-equation-droite': {'sliders': [2, 1], 'guide': [('num', '3'), ('num', '-5'), ('opt', 'y = 3x − 5')], 'seul': ['-4', '-3', '3', '2']},
    'pc/1ac-courant-continu': {'buttons': ['Diode', 'Retourner'], 'guide': [('opt', 'bloquant'), ('opt', 'retourne'), ('opt', 'de + vers −')], 'seul': ['de + vers −', 'la diode', 'sens inverse', '0']},
    'pc/2ac-lentilles': {'sliders': [60], 'guide': [('num', '0,1'), ('num', '10'), ('opt', 'convergente')], 'seul': ['convergente', 'le foyer image', '2', '20']},
    'pc/3ac-loi-ohm': {'sliders': [12], 'buttons': ['R = 200'], 'guide': [('opt', 'U = R × I'), ('num', '11'), ('num', '0,1')], 'seul': ['ohm', '10', '0,03', '300']},
    'maths/1ac-angles': {'sliders': [90], 'guide': [('num', '70'), ('num', '70'), ('num', '110')], 'seul': ['égaux', '55', '55', 'non']},
    'maths/2ac-droite-milieux': {'sliders': [50], 'guide': [('opt', 'elles sont parallèles'), ('num', '6'), ('num', '15')], 'seul': ['parallèle au troisième', '5', '7', '12']},
    'maths/3ac-repere': {'sliders': [5], 'guide': [('num', '1'), ('num', '-1'), ('num', '10')], 'seul': ['7', '4', '5', '13']},
    'pc/1ac-circuit-simple': {'buttons': ['Ouvrir', 'clou en fer', 'règle en plastique', 'pièce de monnaie', 'gomme'], 'guide': [('opt', 'complète'), ('opt', 'un isolant'), ('opt', 'un court-circuit')], 'seul': ['fermé', 'un conducteur', 'un isolant', '2']},
    'pc/2ac-propagation': {'sliders': [70], 'guide': [('opt', 'en ligne droite'), ('num', '8'), ('opt', 'de la Lune')], 'seul': ['en ligne droite', 'son ombre propre', 'diminue', '600000']},
    'pc/3ac-masse-poids': {'sliders': [100], 'buttons': ['Sur la Lune'], 'guide': [('num', '50'), ('num', '5'), ('num', '8')], 'seul': ['le newton', 'reste la même', '19,6', '15']},
    'svt/3ac-reponses-immunitaires': {'buttons': ['Vaccin', 'Sérum'], 'guide': [('opt', 'le vaccin'), ('opt', 'le sérum'), ('opt', 'aux cellules mémoire')], 'seul': ['les lymphocytes B', 'plus rapide', 'curative', '14']},
    'maths/1ac-parallelogrammes': {'sliders': [80, 90], 'guide': [('opt', 'un rectangle'), ('num', '5'), ('opt', 'un carré')], 'seul': ['ont le même milieu', 'un losange', '7', '24']},
    'maths/2ac-symetrie': {'sliders': [180], 'guide': [('opt', 'la médiatrice'), ('num', '4'), ('num', '90')], 'seul': ['lui-même', '5', '35', '4']},
    'maths/3ac-vecteurs': {'sliders': [6, 3], 'guide': [('opt', 'DC'), ('opt', 'AC'), ('opt', 'C')], 'seul': ['direction', 'MP', '6', '5']},
    'pc/1ac-electricite': {'buttons': ['Couper', 'télévision', 'lampe de poche', 'ventilateur'], 'guide': [('opt', 'une source'), ('opt', 'un récepteur'), ('opt', 'après avoir')], 'seul': ['une source', 'chaleur', '220 V', '4,5']},
    'pc/2ac-couleurs': {'buttons': ['Lumière blanche', 'Lumière rouge', 'Lumière verte', 'Lumière bleue'], 'guide': [('opt', 'surtout la lumière verte'), ('opt', 'verte'), ('opt', 'noire')], 'seul': ['le prisme', 'rouge', 'noir', '7']},
    'pc/3ac-equilibre-forces': {'sliders': [12, 0], 'guide': [('opt', 'le poids et'), ('opt', 'vers le haut'), ('num', '6')], 'seul': ['un dynamomètre', 'opposés', '4', '3,5']},
    'svt/3ac-micro-organismes': {'sliders': [37], 'guide': [('opt', 'un virus'), ('opt', 'non'), ('opt', 'se laver')], 'seul': ['pathogène', 'le pain', 'les bactéries', '8']},
    'maths/1ac-droites': {'sliders': [10], 'guide': [('opt', 'P2'), ('opt', '(d) ⊥ (d₂)'), ('num', '90')], 'seul': ['parallèles', '(a) // (b)', '(a) // (b)', '8']},
    'maths/2ac-equations': {'sliders': [5], 'guide': [('opt', '5x − 4 = 11'), ('num', '15'), ('num', '3')], 'seul': ['5', '5', '7', '12']},
    'maths/3ac-thales': {'sliders': [50], 'guide': [('opt', 'AM/AB = MN/BC'), ('opt', '4 × 15 ÷ 10'), ('num', '6')], 'seul': ['parallèles', '9', 'parallèles', '15']},
    'pc/1ac-traitement-eaux': {'sliders': [4], 'guide': [('opt', 'le dégrillage'), ('opt', 'la filtration'), ('opt', 'la désinfection')], 'seul': ['sans danger', 'tuer', 'station', '840']},
    'pc/2ac-lumiere': {'buttons': ['verre', 'papier calque', 'carton'], 'guide': [('opt', 'une source primaire'), ('opt', 'un objet diffusant'), ('opt', 'opaque')], 'seul': ['une source primaire', 'translucide', 'entre dans', '1']},
    'pc/3ac-tests-ions': {'buttons': ['Ajouter soude', 'Fe³⁺', 'Ajouter soude', 'Zn²⁺', 'Ajouter soude'], 'guide': [('opt', 'Fe³⁺'), ('opt', 'Cl⁻'), ('opt', 'chlorure de fer')], 'seul': ['Cu²⁺', 'Fe²⁺', 'nitrate', '3']},
    'svt/1ac-ressources-eau': {'sliders': [8, 8], 'guide': [('opt', 'de surface'), ('opt', 'souterraines'), ('opt', 'fermer')], 'seul': ['évaporation', 's\'infiltre', 'souterraine', '120']},
    'svt/3ac-systeme-musculaire': {'sliders': [50], 'guide': [('opt', 'le biceps'), ('opt', 'de dioxygène'), ('opt', 's\'échauffer')], 'seul': ['raccourcit', 'le triceps', 'antagonistes', '240']},
    'maths/1ac-equations': {'sliders': [5], 'guide': [('opt', 'ajoute 4'), ('num', '13'), ('num', '7')], 'seul': ['oui', '18', '7', '15']},
    'maths/2ac-calcul-litteral': {'sliders': [10], 'guide': [('opt', 'x², −x, 5x, −5'), ('num', '4'), ('opt', 'x² + 4x − 5')], 'seul': ['4', 'x² + 5x + 4', '5(2y − 3)', '30']},
    'maths/3ac-trigonometrie': {'sliders': [45], 'guide': [('opt', 'le sinus'), ('opt', 'AC × sin 30°'), ('num', '5')], 'seul': ['adjacent ÷ hypoténuse', '1', '0,8', '4']},
    'pc/1ac-separation': {'sliders': [38], 'guide': [('num', '72'), ('opt', 'saturée'), ('num', '8')], 'seul': ['le soluté', 'évaporation', 'saturée', '140']},
    'pc/2ac-pollution-air': {'sliders': [2], 'buttons': ['Filtre sur'], 'guide': [('num', '1200'), ('num', '4800'), ('num', '3600')], 'seul': ['le monoxyde', 'SO₂', 'prendre le bus', '2700']},
    'pc/3ac-metaux-acides': {'buttons': ['fer', 'zinc', 'aluminium', 'cuivre', 'Soude', 'fer', 'zinc', 'aluminium'], 'guide': [('opt', 'des bulles'), ('opt', 'le dihydrogène'), ('opt', 'Zn²⁺')], 'seul': ['le cuivre', 'zinc et aluminium', 'H₂', '2']},
    'svt/1ac-sedimentation': {'sliders': [5], 'guide': [('opt', 'couche A'), ('opt', 'couche C'), ('opt', 'dans l')], 'seul': ['érosion', 'la sédimentation', 'la plus récente', '300']},
    'svt/3ac-systeme-nerveux': {'sliders': [5], 'guide': [('opt', 'la moelle'), ('num', '0,03'), ('num', '30')], 'seul': ['sensitif', 'le muscle', 'le cerveau', '5']},
    'maths/1ac-developpement': {'sliders': [3, 5, 2], 'guide': [('num', '10'), ('num', '15'), ('opt', '6(y + 3)')], 'seul': ['20', '918', '7(a + b)', '1300']},
    'maths/2ac-puissances': {'sliders': [9], 'guide': [('num', '2'), ('num', '1'), ('num', '3')], 'seul': ['125', '7', '-8', '-4']},
    'maths/3ac-systemes': {'sliders': [10, 12], 'guide': [('opt', '2x = 14'), ('num', '7'), ('num', '3')], 'seul': ['oui', '3', '7', '18']},
    'pc/1ac-melanges': {'buttons': ['Décanter', 'Filtrer'], 'guide': [('opt', 'décantation'), ('opt', 'un filtre'), ('opt', 'distillation')], 'seul': ['hétérogène', 'homogène', 'limpide mais', '10']},
    'pc/2ac-matieres': {'sliders': [8], 'guide': [('opt', 'naturelle'), ('opt', 'synthétique'), ('opt', 'du pétrole')], 'seul': ['naturelle', 'synthétique', 'minérale', '25']},
    'pc/3ac-acides-bases': {'sliders': [4], 'buttons': ['Acide pH 2'], 'guide': [('opt', 'acide'), ('opt', 'augmente vers 7'), ('opt', 'non')], 'seul': ['basique', 'pH 2', '5', '3']},
    'svt/1ac-classification': {'sliders': [5], 'guide': [('opt', 'vertébré'), ('opt', 'poils'), ('opt', 'mammifère')], 'seul': ['oiseau', 'amphibien', 'mammifère', '5']},
    'svt/2ac-heredite': {'buttons': ['Spermatozoïde X', 'Spermatozoïde Y'], 'guide': [('num', '46'), ('num', '23'), ('opt', 'du père')], 'seul': ['les chromosomes', '23', 'un garçon', '50']},
    'svt/3ac-nutrition': {'buttons': ['Pain', 'Orange', 'Lait', 'Œuf', 'Huile'], 'guide': [('num', '760'), ('num', '595'), ('opt', 'presque pas')], 'seul': ['des protéines', 'des caries', 'pain, lait', '380']},
    'maths/1ac-operations-relatifs': {
        'sliders': [-2, 6],
        'guide': [('opt', 'ajouter +3'), ('opt', 'contraires'), ('num', '−4')],
        'seul': ['-9', '-3', '3', '-5'],
    },
    'maths/2ac-multiplication-rationnels': {
        'sliders': [2, 5, 1, 2],
        'guide': [('opt', '3/10'), ('opt', 'négatif'), ('num', '4')],
        'seul': ['6', 'positif', '2', '180'],
    },
    'maths/3ac-equations': {
        'sliders': [4],
        'guide': [('opt', '3x − 7 = 8'), ('num', '15'), ('num', '5')],
        'seul': ['7', '7', 'x < −4', '8'],
    },
    'pc/1ac-pression': {
        'sliders': [400],
        'guide': [('opt', 'augmente'), ('num', '2200'), ('opt', 'le baromètre')],
        'seul': ['un manomètre', '1 013 hPa', 'diminue', '273'],
    },
    'pc/2ac-lois-reaction': {
        'sliders': [2, 1, 2],
        'guide': [('opt', 'du dioxyde de carbone'), ('num', '44'), ('opt', 'oui')],
        'seul': ['se conserve', '4', '2', '22'],
    },
    'pc/3ac-reactions-air': {
        'sliders': [30],
        'buttons': ['eau', 'peinture'],
        'guide': [('opt', 'dioxygène et eau'), ('opt', 'empêche'), ('opt', 'couche de zinc')],
        'seul': ['dioxygène et eau', 'Sa couche', '6', '2'],
    },
    'svt/1ac-chaines-alimentaires': {
        'clicks': ['[aria-label="herbe"]', '[aria-label="criquet"]', '[aria-label="lézard"]', '[aria-label="faucon"]'],
        'guide': [('opt', 'des souris'), ('opt', 'augmente'), ('opt', 'est plus consommée')],
        'seul': ['un producteur', 'est mangée par', '3', 'diminuer'],
    },
    'svt/2ac-reproduction-homme': {
        'sliders': [9],
        'guide': [('opt', "l'ovulation"), ('opt', 'dans la trompe'), ('opt', "dans l'utérus")],
        'seul': ['les testicules', 'la fécondation', '9', 'par le placenta'],
    },
    'svt/3ac-immunite': {
        'sliders': [3],
        'guide': [('opt', 'fabriquer une mémoire'), ('opt', 'vite et en grande'), ('opt', 'non, la réponse')],
        'seul': ['la peau', 'des globules blancs', 'les lymphocytes', 'pour entretenir'],
    },
    'maths/1ac-relatifs': {
        'sliders': [5],
        'guide': [('opt', '−7'), ('opt', '−1'), ('opt', '−7 < −1 < 0 < 3')],
        'seul': ['8', '−4 > −9', '12', 'Azrou'],
    },
    'maths/2ac-addition-rationnels': {
        'sliders': [2, -3],
        'guide': [('opt', '10'), ('num', '6'), ('num', '−1')],
        'seul': ['5', '-3', '-1', '3'],
    },
    'maths/3ac-ordre': {
        'sliders': [-1, 3, -2],
        'guide': [('opt', '6 ≤ 3x ≤ 15'), ('num', '5'), ('num', '14')],
        'seul': ['<', '>', '11', '-4'],
    },
    'pc/1ac-masse-volumique': {
        'buttons': ['eau', 'huile', 'fer'],
        'guide': [('num', '24'), ('num', '2,5'), ('opt', 'coule')],
        'seul': ['250', '7,9', '2000', 'flotte'],
    },
    'pc/2ac-combustions': {
        'sliders': [2],
        'guide': [('opt', 'soufre et dioxygène'), ('opt', 'le dioxyde de soufre'), ('opt', 'soufre + dioxygène → dioxyde')],
        'seul': ['du dioxyde de carbone', 'carbone et dioxygène', 'une combustion incomplète', 'aérer'],
    },
    'pc/3ac-materiaux-electricite': {
        'buttons': ['cuivre', 'aluminium', 'plastique', 'verre'],
        'guide': [('opt', 'un conducteur'), ('opt', 'isoler'), ('opt', 'des électrons libres')],
        'seul': ['le verre', 'conducteur', "d'électrons libres", 'parce que le plastique'],
    },
    'svt/1ac-regimes-alimentaires': {
        'buttons': ['chèvre', 'renard', 'Homme'],
        'guide': [('opt', 'attraper'), ('opt', 'carnivore'), ('opt', 'un chacal')],
        'seul': ['herbivore', 'omnivore', 'herbivore', 'change avec'],
    },
    'svt/2ac-reproduction-plantes': {
        'sliders': [3],
        'guide': [('opt', 'les insectes'), ('opt', 'fécondation'), ('opt', 'la pollinisation puis')],
        'seul': ["l'étamine", 'la pollinisation', 'le fruit', 'Les abeilles assurent'],
    },
    'svt/3ac-sang': {
        'buttons': ['Centrifuger', 'plasma', 'globules rouges', 'globules blancs', 'plaquettes'],
        'guide': [('opt', 'le dioxygène'), ('opt', 'moins de dioxygène'), ('opt', 'vite fatiguée')],
        'seul': ['les globules blancs', 'le plasma', '5,5', 'des capillaires'],
    },
    'maths/1ac-fractions': {
        'guide': [('opt', '6'), ('num', '2'), ('num', '3')],
        'seul': ['4', '7/9', '2/3 < 5/6', 'Amine'],
    },
    'maths/2ac-rationnels': {
        'sliders': [-5, 2],
        'guide': [('opt', 'négatif'), ('num', '−3'), ('opt', '−1 et 0')],
        'seul': ['-3', 'négatif', '−3/4 < −1/2', '-2,25'],
    },
    'maths/3ac-identites': {
        'sliders': [7, 2],
        'guide': [('opt', '(a + b)² = a² + 2ab + b²'), ('opt', '4x²'), ('num', '20'), ('num', '25')],
        'seul': ['441', '25', '9999', '(x − 7)(x + 7)'],
    },
    'pc/1ac-etats-matiere': {
        'sliders': [25],
        'guide': [('opt', 'solide'), ('opt', 'liquide'), ('num', '250')],
        'seul': ['ni forme propre', 'plane et horizontale', '1500', 'un solide en petits grains'],
    },
    'pc/2ac-molecules': {
        'buttons': ['+ H', '+ H', '+ O', 'Vider', '+ O', '+ O'],
        'guide': [('num', '3'), ('opt', 'un corps composé'), ('num', '6')],
        'seul': ['5', 'un corps simple', 'H₂O', '10'],
    },
    'pc/3ac-materiaux': {
        'buttons': ['canette de sardines', 'Test aimant', 'Test courant', 'canette de soda', 'Test aimant', 'Test courant', 'bocal', 'Test aimant', 'Test courant'],
        'guide': [('opt', 'un métal'), ('opt', 'du fer'), ('opt', "de l'aluminium")],
        'seul': ['le fer', 'verre ou plastique', 'Le cuivre conduit', 'verre'],
    },
    'svt/1ac-respiration': {
        'buttons': ['Homme', 'poisson', 'criquet', 'grenouille'],
        'guide': [('opt', 'du dioxyde de carbone'), ('opt', 'de la respiration de la souris'), ('opt', 'rejette du dioxyde')],
        'seul': ['du dioxyde de carbone', 'les branchies', 'La plante respire', 'branchies puis poumons'],
    },
    'svt/2ac-reproduction-animaux': {
        'sliders': [12],
        'guide': [('opt', 'externe'), ('opt', 'interne'), ('opt', 'direct')],
        'seul': ['les spermatozoïdes', "l'union", 'ovipare', 'une métamorphose'],
    },
    'svt/3ac-respiration-homme': {
        'sliders': [3],
        'guide': [('num', '5'), ('opt', 'dans les alvéoles'), ('opt', 'dioxyde de carbone')],
        'seul': ['descend', 'au niveau des alvéoles', '150', 'Pour faciliter'],
    },
    'maths/1ac-priorites': {
        'clicks': ['[aria-label="Opération × numéro 2"]', '[aria-label="Opération ÷ numéro 3"]', '[aria-label="Opération + numéro 1"]', '[aria-label="Opération − numéro 1"]'],
        'guide': [('opt', '4 + 2'), ('num', '12'), ('num', '6')],
        'seul': ['24', '15', '20', '29'],
    },
    'maths/3ac-racines-carrees': {
        'sliders': [64],
        'guide': [('opt', '50 = 25 × 2'), ('opt', '√25 × √2'), ('num', '5')],
        'seul': ['9', '0,4', '7', '2'],
    },
    'pc/1ac-eau-nature': {
        'buttons': ['salée', 'douce gelée', 'douce liquide'],
        'guide': [('tap', 'mer'), ('opt', 'fines gouttelettes'), ('opt', 'solide')],
        'seul': ['de l\'état liquide à l\'état gazeux', 'le Soleil', 'évaporation, condensation, précipitations', '97'],
    },
    'pc/2ac-air': {
        'sliders': [20],
        'guide': [('opt', 'reste le même'), ('opt', 'la distance entre'), ('num', '21')],
        'seul': ['le diazote', 'diminue', '42', 'beaucoup d\'espace vide'],
    },
    'svt/1ac-milieu-naturel': {
        'sliders': [20],
        'guide': [('opt', 'du biotope'), ('opt', 'de la biocénose'), ('opt', 'un hygromètre')],
        'seul': ['la température', 'du biotope et de la biocénose', 'à 200 lux', 'plus éclairé et plus sec'],
    },
    'svt/2ac-tectonique': {
        'sliders': [20],
        'guide': [('num', '200'), ('num', '2'), ('opt', 'le rapprochement de deux plaques')],
        'seul': ['de plaques qui bougent', 'la formation de montagnes', '20', 'Des roches formées'],
    },
    'maths/2ac-pythagore': {
        'sliders': [6, 8],
        'guide': [('tap', 'DF'), ('opt', 'DF² = DE² + EF²'), ('num', '169'), ('num', '13')],
        'seul': ['10', '15', '8', '4'],
    },
    'pc/3ac-vitesse-moyenne': {
        'sliders': [90, 90],
        'guide': [('opt', '1,5 h'), ('opt', 'v = d ÷ t'), ('num', '20'), ('num', '5,6')],
        'seul': ['60', '5', '20', '60'],
    },
    'svt/3ac-digestion': {
        'cut': 5,
        'guide': [('opt', 'Dans la bouche'), ('tap', 'intestin grêle'), ('opt', 'Parce qu\'il est très petit')],
        'seul': ['du glucose', 'couper les grosses molécules en petites',
                 'le passage des nutriments de l\'intestin grêle vers le sang', 'Dans le sang qui sort de l\'intestin grêle'],
    },
}


def csp_of(d):
    m = re.search(r'Content-Security-Policy: (.+)', (d / '_headers').read_text())
    return m.group(1).strip()


class Handler(http.server.SimpleHTTPRequestHandler):
    csp = ''

    def end_headers(self):
        self.send_header('Content-Security-Policy', self.csp)
        super().end_headers()

    def log_message(self, *a):
        pass


def serve(d, port):
    h = type('H', (Handler,), {'csp': csp_of(d)})
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', port), functools.partial(h, directory=str(d)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def fail(msg):
    FAILS.append(msg)
    print('FAIL', msg)


async def nexts(pg, n):
    for _ in range(n):
        await pg.click('section.on [data-next]')
        await pg.wait_for_timeout(250)


async def shot(pg, name):
    if SHOTS:
        await pg.wait_for_timeout(1300)
        await pg.screenshot(path=str(SHOTS / f'{name}.png'))


async def lesson(pg, base, key, plan):
    s, lid = key.split('/')
    await pg.goto(base)
    if await pg.locator(f'a[data-lesson="{lid}"]').count() != 1:
        fail(f'{key}: lien absent de l\'accueil')
    await shot(pg, f'{lid}-home')
    await pg.click(f'a[data-lesson="{lid}"]')
    await pg.wait_for_selector('section.on .cap')
    # 1. ouverture : toutes les étapes
    n = await pg.locator('section.on .dots i').count()
    await shot(pg, f'{lid}-1-ouverture-a')
    await nexts(pg, n - 1)
    await shot(pg, f'{lid}-1-ouverture-b')
    await nexts(pg, 1)
    # prédiction facultative : on choisit la première réponse, puis on continue
    if await pg.locator('section.on .pred').count():
        await pg.locator('section.on .pred .opt').first.click()
        await pg.locator('section.on .pred .btn.pri').click()
        await pg.wait_for_timeout(250)
        if await pg.locator('section.on .tf').count() == 0:
            fail(f'{key}: la prédiction ne mène pas à « Je me prépare »')
    # 2. je me prépare : on répond « Vrai » partout, le bouton suivant doit apparaître
    for i in range(await pg.locator('section.on .tf').count()):
        await pg.locator('section.on .tf').nth(i).get_by_text('Vrai', exact=True).click()
    if not await pg.locator('section.on .btn.pri').is_visible():
        fail(f'{key}: bouton « Je regarde » invisible')
    await pg.locator('section.on .btn.pri').click()
    # 3. je regarde
    n = await pg.locator('section.on .dots i').count()
    for k in range(n):
        if k in (1, n // 2, n - 1):
            await shot(pg, f'{lid}-3-regarde-{k}')
        if k < n - 1:
            await nexts(pg, 1)
    if await pg.locator('section.on .verdict').count() and not await pg.locator('section.on .verdict').is_visible():
        fail(f'{key}: verdict de prédiction invisible à la dernière étape')
    await nexts(pg, 1)
    # 4. nous faisons
    sec = pg.locator('section.on')
    for i, v in enumerate(plan.get('sliders', [])):
        await sec.locator('input[type=range]').nth(i).fill(str(v))
    for sel in plan.get('clicks', []):
        await sec.locator(sel).dispatch_event('click')
        await pg.wait_for_timeout(150)
    for txt in plan.get('buttons', []):
        await sec.locator('button', has_text=txt).first.click()
    if 'cut' in plan:
        for i in range(plan['cut']):
            await sec.locator(f'[aria-label="Couper le lien {i + 1}"]').dispatch_event('click')
        await sec.get_by_text('Faire passer', exact=True).click()
        await pg.wait_for_timeout(900)
    await shot(pg, f'{lid}-4-faisons-a')
    for kind, val in plan['guide']:
        await pg.wait_for_timeout(450)
        if kind == 'tap':
            await sec.locator(f'[aria-label="{val}"]').dispatch_event('click')
        elif kind == 'opt':
            await sec.locator('.opt', has_text=val).last.click()
        else:
            box = sec.locator('input.num:not([disabled])').first
            await box.fill(val)
            await box.press('Enter')
    await pg.wait_for_timeout(500)
    oks = await sec.locator('.fb.ok').count()
    if oks < len(plan['guide']):
        fail(f'{key}: guide incomplet ({oks}/{len(plan["guide"])})')
    await shot(pg, f'{lid}-4-faisons-b')
    btn = sec.get_by_text('Je fais seul ▶')
    if not await btn.is_visible():
        fail(f'{key}: bouton « Je fais seul » absent')
        return
    await btn.click()
    # 5. je fais seul
    sec = pg.locator('section.on')
    items = sec.locator('.card > div:not(.eyebrow):not(.row)')
    for i, val in enumerate(plan['seul']):
        it = items.nth(i)
        if await it.locator('input.num').count():
            box = it.locator('input.num')
            await box.fill(val)
            await box.press('Enter')
        else:
            await it.locator('.opt', has_text=val).first.click()
    if await sec.locator('.fb.ok').count() != len(plan['seul']):
        fail(f'{key}: « Je fais seul » incomplet')
    await sec.get_by_text('Bilan ▶').click()
    # 6. bilan
    n = await pg.locator('section.on .dots i').count()
    await nexts(pg, n - 1)
    await shot(pg, f'{lid}-6-bilan')
    if await pg.locator('section.on .retenir').count() < 2:
        fail(f'{key}: « À retenir » incomplet')
    # retour à l'accueil : la leçon est cochée
    await pg.goto(base)
    if (await pg.locator(f'a[data-lesson="{lid}"] .n').inner_text()).strip() != '✓':
        fail(f'{key}: leçon non cochée à l\'accueil')


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        only = [k for k in os.environ.get('MV_ONLY', '').split(',') if k]
        for port, key in enumerate(PLAN, 8811):
            if only and key not in only:
                continue
            s = key.split('/')[0]
            srv = serve(DIST / s, port)
            pg = await b.new_page(viewport={'width': 420, 'height': 860}, device_scale_factor=2)
            await pg.route('https://taalim-relay.abderrahim-habz.workers.dev/**', lambda r: r.fulfill(status=200, body='ok'))  # relais Telegram simulé
            for host in ('https://static.cloudflareinsights.com/**', 'https://cloudflareinsights.com/**'):  # mesure d'audience simulée
                await pg.route(host, lambda r: r.fulfill(status=200, content_type='text/javascript', body=''))
            errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
            try:
                await lesson(pg, f'http://127.0.0.1:{port}/', key, PLAN[key])
            except Exception as e:  # noqa: BLE001
                fail(f'{key}: {e}')
            for e in errs:
                fail(f'{key}: erreur JS ou CSP : {e}')
            await pg.close()
            srv.shutdown()
            print(key, 'ok' if not any(f.startswith(key) for f in FAILS) else 'KO')
        await b.close()
    print(f'FAILS: {len(FAILS)}')
    sys.exit(1 if FAILS else 0)


if __name__ == '__main__':
    asyncio.run(main())
