/* Configuration des défis : SVT en mouvement (3AC) */
(function () {
  'use strict';
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function fm(x, d) { var s = (+x).toFixed(d === undefined ? 1 : d); if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, ''); return s.replace('.', ','); }
  function num(q, a, u, e, h, tol) { return { t: 'num', q: q, a: a, u: u || '', e: e, h: h || '', tol: tol === undefined ? (Math.abs(a - Math.round(a)) < 1e-9 ? 0.5 : 0.006) : tol, sol: fm(a, 2) + (u ? ' ' + u : '') }; }

  /* [niveau, question, options, bonne réponse, explication] */
  var B = {
    dig: [
      [1, 'Quel organe fabrique la bile ?', ['Le foie', 'Le pancréas', 'L’estomac'], 0, 'La bile est fabriquée par le foie.'],
      [1, 'Où se termine la digestion ?', ['Dans la bouche', 'Dans l’estomac', 'Dans l’intestin grêle'], 2, 'L’intestin grêle achève la digestion.'],
      [1, 'Les petites molécules issues de la digestion s’appellent :', ['des nutriments', 'des déchets', 'des enzymes'], 0, 'Les nutriments passent dans le sang et la lymphe.'],
      [1, 'Quel organe absorbe surtout l’eau des déchets ?', ['L’œsophage', 'Le gros intestin', 'L’estomac'], 1, 'Le gros intestin absorbe l’eau et forme les excréments.'],
      [2, 'L’amylase salivaire transforme :', ['l’amidon en maltose', 'les protéines en peptides', 'les lipides en acides gras'], 0, 'Elle agit sur l’amidon dans la bouche.'],
      [2, 'Le suc gastrique contient de l’acide chlorhydrique et :', ['la lipase', 'la pepsine', 'l’amylase'], 1, 'La pepsine commence la digestion des protéines.'],
      [2, 'Les villosités intestinales servent à :', ['produire la bile', 'augmenter la surface d’absorption', 'broyer les aliments'], 1, 'Elles agrandissent la surface d’échange.'],
      [2, 'Quel suc est fabriqué par le pancréas ?', ['Le suc pancréatique', 'Le suc gastrique', 'La bile'], 0, 'Le pancréas fabrique le suc pancréatique.'],
      [3, 'La bile facilite la digestion des lipides parce qu’elle :', ['contient la lipase', 'émulsionne les graisses en fines gouttelettes', 'neutralise l’amidon'], 1, 'L’émulsion augmente la surface d’action de la lipase.'],
      [3, 'Les acides gras et le glycérol passent surtout dans :', ['les capillaires sanguins', 'la lymphe', 'la salive'], 1, 'Ils sont surtout absorbés par les vaisseaux lymphatiques.'],
      [3, 'Une enzyme est spécifique : cela signifie qu’elle :', ['agit sur un seul type d’aliment', 'agit sur tous les aliments', 'agit à toute température'], 0, 'Chaque enzyme agit sur un type de molécule.'],
      [3, 'Dans l’estomac, la pepsine agit en milieu :', ['acide', 'basique', 'neutre'], 0, 'Le suc gastrique est acide.']
    ],
    resp: [
      [1, 'Le gaz utilisé par l’organisme pour respirer est :', ['le dioxyde de carbone', 'le dioxygène', 'le diazote'], 1, 'Le dioxygène est consommé par les cellules.'],
      [1, 'Les échanges gazeux se font dans :', ['la trachée', 'les alvéoles pulmonaires', 'les bronches'], 1, 'Les alvéoles sont entourées de capillaires.'],
      [1, 'Le muscle principal de l’inspiration est :', ['le diaphragme', 'le cœur', 'l’estomac'], 0, 'Le diaphragme s’abaisse à l’inspiration.'],
      [1, 'L’air inspiré passe par les fosses nasales, le pharynx, le larynx, puis :', ['la trachée', 'l’œsophage', 'l’estomac'], 0, 'La trachée conduit l’air vers les bronches.'],
      [2, 'À l’expiration, le volume du thorax :', ['augmente', 'diminue', 'ne change pas'], 1, 'Le diaphragme remonte et les côtes s’abaissent.'],
      [2, 'L’eau de chaux se trouble avec :', ['l’air inspiré', 'l’air expiré', 'le dioxygène pur'], 1, 'L’air expiré contient plus de CO₂.'],
      [2, 'Par rapport à l’air inspiré, l’air expiré contient :', ['plus de CO₂', 'moins de CO₂', 'la même quantité de CO₂'], 0, 'Les cellules ont rejeté du CO₂.'],
      [2, 'Le CO₂ rejeté par les poumons est produit :', ['par l’air inspiré', 'par le fonctionnement des cellules', 'par la trachée'], 1, 'Les cellules consomment du O₂ et produisent du CO₂.'],
      [3, 'On respire plus vite pendant un effort car les muscles :', ['consomment plus de O₂ et produisent plus de CO₂', 'ont besoin de moins de O₂', 'bloquent la trachée'], 0, 'Le besoin en O₂ augmente.'],
      [3, 'Le monoxyde de carbone est dangereux car il :', ['se fixe sur l’hémoglobine à la place du O₂', 'détruit les globules blancs', 'est un gaz inerte'], 0, 'Le sang transporte alors moins de O₂.'],
      [3, 'Les alvéoles facilitent les échanges car elles ont :', ['une grande surface et une paroi très mince', 'un petit nombre de cavités', 'une paroi épaisse'], 0, 'Surface d’échange importante et paroi fine.'],
      [3, 'La fumée de cigarette est dangereuse car elle :', ['contient des substances toxiques et abîme les poumons', 'augmente le volume des alvéoles', 'nettoie les bronches'], 0, 'Goudrons, monoxyde de carbone et autres substances toxiques.']
    ],
    circ: [
      [1, 'Les vaisseaux qui quittent le cœur sont :', ['les veines', 'les artères', 'les capillaires'], 1, 'Tout vaisseau qui part du cœur est une artère.'],
      [1, 'Combien de cavités possède le cœur humain ?', ['2', '4', '6'], 1, 'Deux oreillettes et deux ventricules.'],
      [1, 'Le sang circule dans :', ['un circuit fermé', 'un circuit ouvert', 'les poumons seulement'], 0, 'La circulation est fermée.'],
      [1, 'Les globules rouges transportent :', ['le dioxygène', 'les anticorps', 'les enzymes'], 0, 'Grâce à l’hémoglobine.'],
      [2, 'L’artère pulmonaire transporte du sang :', ['riche en O₂', 'riche en CO₂', 'sans cellules'], 1, 'Elle conduit le sang du cœur vers les poumons.'],
      [2, 'Les veines pulmonaires arrivent :', ['à l’oreillette droite', 'à l’oreillette gauche', 'au ventricule droit'], 1, 'Elles ramènent le sang des poumons au cœur gauche.'],
      [2, 'Les échanges entre le sang et les organes se font dans :', ['les artères', 'les capillaires', 'les veines'], 1, 'Les capillaires ont une paroi très fine.'],
      [2, 'Le pouls correspond :', ['aux battements du cœur sentis dans une artère', 'au passage de l’air', 'à la digestion'], 0, 'On le sent au poignet ou au cou.'],
      [3, 'Le ventricule gauche a une paroi plus épaisse car il :', ['envoie le sang dans tout le corps', 'envoie le sang aux poumons', 'reçoit le sang des veines caves'], 0, 'Il pousse le sang dans la grande circulation.'],
      [3, 'Le sang qui arrive à l’oreillette droite vient :', ['des poumons', 'des organes par les veines caves', 'du ventricule gauche'], 1, 'C’est la fin de la grande circulation.'],
      [3, 'Les valvules du cœur servent à :', ['empêcher le retour du sang en arrière', 'produire les globules rouges', 'filtrer le sang'], 0, 'Elles imposent un sens au sang.'],
      [3, 'À l’effort, le débit cardiaque augmente car les organes ont besoin de :', ['plus de O₂ et de nutriments', 'moins de O₂', 'plus de lymphe'], 0, 'Le cœur bat plus vite et envoie plus de sang.']
    ],
    exc: [
      [1, 'Quel organe fabrique l’urine ?', ['La vessie', 'Le rein', 'Le foie'], 1, 'Le rein filtre le sang et forme l’urine.'],
      [1, 'La vessie sert à :', ['stocker l’urine', 'filtrer le sang', 'produire l’urée'], 0, 'L’urine s’y accumule avant d’être évacuée.'],
      [1, 'Le conduit qui évacue l’urine à l’extérieur est :', ['l’urètre', 'l’uretère', 'la trachée'], 0, 'L’urètre part de la vessie.'],
      [1, 'Combien de reins possède l’être humain ?', ['1', '2', '4'], 1, 'Deux reins.'],
      [2, 'L’urée est :', ['un déchet produit par l’organisme', 'un nutriment', 'un gaz respiratoire'], 0, 'Elle provient surtout de la dégradation des protéines.'],
      [2, 'Le sang qui sort du rein par la veine rénale est :', ['plus pauvre en urée', 'plus riche en urée', 'sans eau'], 0, 'Le rein a éliminé l’urée.'],
      [2, 'Les uretères relient :', ['les reins à la vessie', 'la vessie à l’extérieur', 'les reins au cœur'], 0, 'Un uretère par rein.'],
      [2, 'Normalement, l’urine ne contient pas de :', ['urée', 'glucose', 'eau'], 1, 'Le glucose est normalement réabsorbé.'],
      [3, 'La présence de glucose dans l’urine peut indiquer :', ['un diabète', 'une fracture', 'un excès de sommeil'], 0, 'On parle de glycosurie.'],
      [3, 'En cas de forte transpiration, l’urine devient :', ['plus abondante et diluée', 'moins abondante et plus concentrée', 'sans urée'], 1, 'Le corps économise l’eau.'],
      [3, 'La présence de protéines dans l’urine indique :', ['un fonctionnement normal du rein', 'un problème de filtration du rein', 'un excès d’eau bue'], 1, 'Les protéines ne passent pas dans l’urine normalement.'],
      [3, 'Pour protéger ses reins, il faut :', ['boire suffisamment d’eau et limiter l’excès de sel', 'ne jamais boire d’eau', 'manger uniquement des protéines'], 0, 'Une bonne hygiène de vie protège les reins.']
    ],
    imm: [
      [1, 'Quelle barrière naturelle empêche l’entrée des microbes ?', ['La peau', 'Les os', 'Les cheveux'], 0, 'La peau intacte est une barrière.'],
      [1, 'La phagocytose est réalisée par :', ['les phagocytes', 'les globules rouges', 'les plaquettes'], 0, 'Ce sont des globules blancs.'],
      [1, 'Les anticorps sont fabriqués par :', ['les lymphocytes', 'les globules rouges', 'les reins'], 0, 'Ce sont des cellules de l’immunité.'],
      [1, 'Un vaccin protège contre :', ['une maladie infectieuse', 'une fracture', 'le manque de sommeil'], 0, 'Il prépare le système immunitaire.'],
      [2, 'Un antigène est :', ['une molécule étrangère reconnue par l’organisme', 'un anticorps', 'un globule rouge'], 0, 'Il déclenche la réponse immunitaire.'],
      [2, 'Les anticorps sont :', ['spécifiques d’un antigène', 'actifs contre tous les microbes', 'des microbes'], 0, 'Un anticorps ne reconnaît qu’un antigène.'],
      [2, 'Un vaccin contient :', ['un antigène inoffensif', 'des anticorps déjà prêts', 'un antibiotique'], 0, 'Microbe atténué ou tué, ou fragments de microbe.'],
      [2, 'Les globules blancs participent à :', ['la défense de l’organisme', 'le transport du O₂', 'la digestion'], 0, 'Ils assurent la défense.'],
      [3, 'La sérothérapie apporte :', ['des anticorps déjà fabriqués', 'un antigène', 'des globules rouges'], 0, 'La protection est immédiate mais temporaire.'],
      [3, 'Le rappel de vaccin est utile car il :', ['renforce la mémoire immunitaire', 'remplace la phagocytose', 'détruit les anticorps'], 0, 'La réponse secondaire est plus rapide et plus forte.'],
      [3, 'Un antibiotique agit contre :', ['les bactéries', 'les virus', 'les deux'], 0, 'Il est inefficace contre les virus.'],
      [3, 'Le VIH attaque :', ['des lymphocytes du système immunitaire', 'les globules rouges', 'les reins'], 0, 'Il affaiblit les défenses de l’organisme.']
    ],
    nut: [
      [1, 'Les aliments riches en glucides et en lipides sont surtout :', ['énergétiques', 'constructeurs', 'protecteurs'], 0, 'Ils fournissent surtout de l’énergie.'],
      [1, 'Les fruits et les légumes sont surtout riches en :', ['vitamines et sels minéraux', 'lipides', 'protéines'], 0, 'Ce sont des aliments protecteurs.'],
      [1, 'Le lait, les œufs et la viande sont riches en :', ['protéines', 'sucres rapides', 'sels minéraux seulement'], 0, 'Ce sont des aliments constructeurs.'],
      [1, 'Une carence alimentaire est :', ['un apport insuffisant en un nutriment', 'un excès de sel', 'une maladie microbienne'], 0, 'Elle provoque une maladie de carence.'],
      [2, 'Le scorbut est dû à une carence en :', ['vitamine C', 'vitamine D', 'iode'], 0, 'On le prévient avec des fruits et des légumes frais.'],
      [2, 'Le rachitisme touche surtout :', ['les os de l’enfant', 'les reins', 'les poumons'], 0, 'Il est dû à une carence en vitamine D et en calcium.'],
      [2, 'Le goitre est dû à une carence en :', ['iode', 'fer', 'vitamine C'], 0, 'L’iode est nécessaire à la glande thyroïde.'],
      [2, 'Pour prévenir l’anémie, on mange des aliments riches en :', ['fer', 'iode', 'lipides'], 0, 'Viande, foie, lentilles.'],
      [3, 'Une ration alimentaire équilibrée :', ['couvre les besoins en énergie et en nutriments', 'contient seulement des protéines', 'supprime tous les lipides'], 0, 'Elle est variée et adaptée à la personne.'],
      [3, 'Un sportif a besoin d’une ration :', ['plus riche en énergie qu’une personne peu active', 'moins riche en énergie', 'sans glucides'], 0, 'Son activité consomme plus d’énergie.'],
      [3, 'Un excès d’énergie dans la ration, avec peu d’activité, peut conduire à :', ['l’obésité', 'le scorbut', 'le goitre'], 0, 'L’excès d’énergie est stocké sous forme de graisses.'],
      [3, 'Il faut varier son alimentation parce que :', ['aucun aliment seul ne fournit tous les nutriments', 'tous les aliments sont identiques', 'un seul aliment suffit'], 0, 'Chaque groupe d’aliments a un rôle différent.']
    ],
    nerv: [
      [1, 'Le message nerveux est élaboré au niveau :', ['des récepteurs', 'des os', 'des reins'], 0, 'Les récepteurs transforment le stimulus en message nerveux.'],
      [1, 'L’œil et l’oreille sont :', ['des organes des sens', 'des muscles', 'des centres nerveux'], 0, 'Ils contiennent des récepteurs sensoriels.'],
      [1, 'La moelle épinière est située :', ['dans la colonne vertébrale', 'dans le thorax', 'dans l’estomac'], 0, 'Elle est protégée par les vertèbres.'],
      [1, 'Les nerfs sont :', ['des conducteurs du message nerveux', 'des vaisseaux sanguins', 'des muscles'], 0, 'Ils relient les organes aux centres nerveux.'],
      [2, 'Un nerf sensitif conduit le message :', ['des récepteurs vers un centre nerveux', 'du centre nerveux vers un muscle', 'du muscle vers l’os'], 0, 'Sens du récepteur vers le centre.'],
      [2, 'Un nerf moteur conduit le message :', ['du centre nerveux vers un muscle', 'des récepteurs vers le cerveau', 'du sang vers le muscle'], 0, 'Il commande l’effecteur.'],
      [2, 'La sensation consciente se forme dans :', ['le cerveau', 'la moelle épinière', 'le muscle'], 0, 'Dans les aires sensitives du cerveau.'],
      [2, 'Un mouvement volontaire est commandé par :', ['le cerveau', 'les récepteurs de la peau', 'les tendons'], 0, 'La commande part du cerveau.'],
      [3, 'Dans un réflexe, le centre nerveux est généralement :', ['la moelle épinière', 'le cerveau', 'le muscle'], 0, 'Le cerveau est informé ensuite.'],
      [3, 'Le trajet d’un réflexe s’appelle :', ['l’arc réflexe', 'la grande circulation', 'le tube digestif'], 0, 'Récepteur, nerf sensitif, centre nerveux, nerf moteur, effecteur.'],
      [3, 'Un réflexe est plus rapide qu’un mouvement volontaire car :', ['le trajet est plus court et évite le cerveau', 'il n’utilise pas de nerfs', 'il n’utilise pas de muscle'], 0, 'La moelle épinière commande directement.'],
      [3, 'Pour protéger son système nerveux, il faut :', ['dormir assez et éviter alcool et drogues', 'dormir très peu', 'consommer de l’alcool pour se détendre'], 0, 'Ces produits perturbent le fonctionnement des neurones.']
    ],
    musc: [
      [1, 'Un muscle squelettique est relié à l’os par :', ['un tendon', 'un nerf', 'une artère'], 0, 'Les tendons relient les muscles aux os.'],
      [1, 'Quand un muscle se contracte, il :', ['se raccourcit et s’épaissit', 's’allonge et s’amincit', 'ne change pas'], 0, 'C’est la contractilité.'],
      [1, 'La capacité du muscle à reprendre sa forme est :', ['l’élasticité', 'l’excitabilité', 'la digestion'], 0, 'Après la contraction il retrouve sa longueur.'],
      [1, 'La capacité du muscle à répondre à une stimulation est :', ['l’excitabilité', 'l’élasticité', 'la circulation'], 0, 'Un muscle excitable se contracte quand il est stimulé.'],
      [2, 'Un muscle se contracte quand il reçoit :', ['un message nerveux', 'de la bile', 'un anticorps'], 0, 'Par un nerf moteur.'],
      [2, 'Pour se contracter, le muscle utilise :', ['du glucose et du dioxygène', 'seulement de l’eau', 'de l’urée'], 0, 'Ils sont apportés par le sang.'],
      [2, 'Un muscle qui travaille rejette :', ['du CO₂, des déchets et de la chaleur', 'du dioxygène', 'des enzymes digestives'], 0, 'Ce sont des produits de son fonctionnement.'],
      [2, 'Le muscle reçoit glucose et dioxygène par :', ['le sang', 'l’air directement', 'les tendons'], 0, 'Les vaisseaux sanguins irriguent le muscle.'],
      [3, 'La fatigue musculaire apparaît quand :', ['les déchets s’accumulent et les réserves diminuent', 'le muscle se repose trop', 'le sang cesse de circuler partout'], 0, 'Un effort prolongé épuise le muscle.'],
      [3, 'Pendant un effort, la température du corps augmente car :', ['la contraction libère de la chaleur', 'les os produisent de la chaleur', 'le muscle consomme de la chaleur'], 0, 'Une partie de l’énergie est libérée sous forme de chaleur.'],
      [3, 'Un échauffement avant l’effort sert à :', ['préparer les muscles et prévenir les blessures', 'fatiguer les muscles', 'supprimer le besoin de dioxygène'], 0, 'Il fait partie de l’hygiène musculaire.'],
      [3, 'Porter un cartable lourd sur une seule épaule risque de :', ['déformer la colonne vertébrale', 'renforcer tous les muscles de façon égale', 'diminuer le poids du cartable'], 0, 'Il faut répartir la charge.']
    ]
  };
  function fromBank(key, d) {
    var q = B[key]; if (!q) return null;
    var pool = q.filter(function (x) { return d === 1 ? x[0] <= 2 : (d === 2 ? true : x[0] >= 2); });
    var x = pick(pool), idx = shuffle(x[2].map(function (_, i) { return i; }));
    return { t: 'mcq', q: x[1], o: idx.map(function (i) { return x[2][i]; }), a: idx.indexOf(x[3]), e: x[4], h: 'Relis la leçon du chapitre.' };
  }

  var G = {
    energie: function (d) {
      var g = ri(2, 9) * 50, l = ri(1, 6) * 10, p = ri(1, 8) * 10;
      var info = ' (glucides : 17 kJ/g ; lipides : 38 kJ/g ; protéines : 17 kJ/g)';
      if (d === 1) return num('Quelle énergie fournissent ' + g + ' g de glucides ?' + info, g * 17, 'kJ', g + ' × 17 = ' + (g * 17) + ' kJ.', 'Multiplie la masse par 17 kJ/g.');
      if (d === 2) return num('Une ration contient ' + g + ' g de glucides et ' + l + ' g de lipides. Quelle énergie fournit-elle ?' + info, g * 17 + l * 38, 'kJ', g + ' × 17 + ' + l + ' × 38 = ' + (g * 17) + ' + ' + (l * 38) + ' = ' + (g * 17 + l * 38) + ' kJ.', 'Calcule l’énergie de chaque nutriment, puis additionne.');
      var tot = g * 17 + l * 38 + p * 17;
      if (d === 3) return num('Une ration contient ' + g + ' g de glucides, ' + l + ' g de lipides et ' + p + ' g de protéines. Quelle est son énergie totale ?' + info, tot, 'kJ', g + ' × 17 + ' + l + ' × 38 + ' + p + ' × 17 = ' + tot + ' kJ.', 'Additionne l’énergie des trois nutriments.');
      return num('Une ration contient ' + g + ' g de glucides, ' + l + ' g de lipides et ' + p + ' g de protéines' + info + '. Quel pourcentage de l’énergie vient des lipides ? (arrondi à l’unité)', Math.round(l * 38 / tot * 100), '%', 'Énergie des lipides : ' + (l * 38) + ' kJ ; énergie totale : ' + tot + ' kJ. ' + (l * 38) + ' ÷ ' + tot + ' ≈ ' + Math.round(l * 38 / tot * 100) + ' %.', 'Calcule l’énergie totale puis la part des lipides.', 0.6);
    },
    vent: function (d) {
      var fr = ri(10, 24), vt = pick([0.4, 0.5, 0.6]);
      if (d === 1) return num('Une personne fait ' + fr + ' mouvements respiratoires par minute avec un volume courant de ' + fm(vt, 1) + ' L. Quel est son débit ventilatoire ?', fr * vt, 'L/min', fr + ' × ' + fm(vt, 1) + ' = ' + fm(fr * vt, 1) + ' L/min.', 'Débit = fréquence × volume courant.');
      if (d === 2) { var f2 = ri(12, 20); return num('Le débit ventilatoire d’une personne est ' + fm(f2 * 0.5, 1) + ' L/min et son volume courant 0,5 L. Quelle est sa fréquence respiratoire (mouvements par minute) ?', f2, '/min', fm(f2 * 0.5, 1) + ' ÷ 0,5 = ' + f2 + '.', 'Fréquence = débit ÷ volume courant.'); }
      var v3 = ri(40, 70) * 10;
      if (d === 3) return num('Volume courant : ' + v3 + ' mL ; fréquence : ' + fr + ' par minute. Quel est le débit ventilatoire en L/min ?', fr * v3 / 1000, 'L/min', v3 + ' mL = ' + fm(v3 / 1000, 2) + ' L ; ' + fr + ' × ' + fm(v3 / 1000, 2) + ' = ' + fm(fr * v3 / 1000, 2) + ' L/min.', 'Convertis les mL en L avant de multiplier.');
      var fe = ri(30, 40), ve = pick([1.2, 1.5, 2]), rest = 16 * 0.5;
      return num('Au repos : 16 mouvements par minute et 0,5 L par mouvement. À l’effort : ' + fe + ' mouvements par minute et ' + fm(ve, 1) + ' L par mouvement. De combien de L/min le débit ventilatoire augmente-t-il ?', fe * ve - rest, 'L/min', 'Effort : ' + fe + ' × ' + fm(ve, 1) + ' = ' + fm(fe * ve, 1) + ' L/min. Repos : 8 L/min. Écart : ' + fm(fe * ve - rest, 1) + ' L/min.', 'Calcule les deux débits puis fais la différence.', 0.06);
    },
    debit: function (d) {
      var fc = pick([60, 65, 70, 75, 80]), ves = pick([60, 70, 80]);
      if (d === 1) return num('Le cœur bat ' + fc + ' fois par minute et éjecte ' + ves + ' mL à chaque battement. Quel est le débit cardiaque en mL/min ?', fc * ves, 'mL/min', fc + ' × ' + ves + ' = ' + (fc * ves) + ' mL/min.', 'Débit = fréquence × volume d’éjection.');
      if (d === 2) return num('Même situation : ' + fc + ' battements/min et ' + ves + ' mL par battement. Quel est le débit cardiaque en L/min ?', fc * ves / 1000, 'L/min', fc + ' × ' + ves + ' = ' + (fc * ves) + ' mL/min = ' + fm(fc * ves / 1000, 2) + ' L/min.', 'Divise par 1 000 pour passer des mL aux L.');
      if (d === 3) return num('Le débit cardiaque est de ' + fm(fc * ves / 1000, 2) + ' L/min pour ' + fc + ' battements/min. Quel est le volume d’éjection par battement, en mL ?', ves, 'mL', fm(fc * ves / 1000, 2) + ' L = ' + (fc * ves) + ' mL ; ' + (fc * ves) + ' ÷ ' + fc + ' = ' + ves + ' mL.', 'Volume d’éjection = débit ÷ fréquence.');
      var fe = ri(130, 170), ve = pick([90, 100, 110]);
      return num('Au repos : ' + fc + ' battements/min et ' + ves + ' mL par battement. À l’effort : ' + fe + ' battements/min et ' + ve + ' mL par battement. De combien de L/min le débit cardiaque augmente-t-il ?', (fe * ve - fc * ves) / 1000, 'L/min', 'Effort : ' + fm(fe * ve / 1000, 2) + ' L/min. Repos : ' + fm(fc * ves / 1000, 2) + ' L/min. Écart : ' + fm((fe * ve - fc * ves) / 1000, 2) + ' L/min.', 'Calcule les deux débits en L/min puis fais la différence.', 0.06);
    },
    urine: function (d) {
      var cp = pick([0.2, 0.25, 0.3, 0.4]), cu = pick([12, 15, 20, 24]), vol = pick([1, 1.2, 1.5, 2]);
      if (d === 1) return num('L’urine contient ' + fm(cu, 0) + ' g d’urée par litre. Un adulte produit ' + fm(vol, 1) + ' L d’urine par jour. Quelle masse d’urée élimine-t-il par jour ?', cu * vol, 'g', fm(cu, 0) + ' × ' + fm(vol, 1) + ' = ' + fm(cu * vol, 1) + ' g.', 'Masse = concentration × volume.');
      if (d === 2) return num('Le plasma contient ' + fm(cp, 2) + ' g/L d’urée et l’urine ' + fm(cu, 0) + ' g/L. Combien de fois l’urine est-elle plus concentrée en urée ? (arrondi à l’unité)', Math.round(cu / cp), 'fois', fm(cu, 0) + ' ÷ ' + fm(cp, 2) + ' ≈ ' + Math.round(cu / cp) + '.', 'Divise la concentration de l’urine par celle du plasma.', 0.6);
      if (d === 3) return num('Un adulte élimine ' + fm(cu * vol, 1) + ' g d’urée par jour dans ' + fm(vol, 1) + ' L d’urine. Quelle est la concentration de l’urine en g/L ?', cu, 'g/L', fm(cu * vol, 1) + ' ÷ ' + fm(vol, 1) + ' = ' + fm(cu, 0) + ' g/L.', 'Concentration = masse ÷ volume.');
      var v2 = pick([0.6, 0.8]);
      return num('Une personne élimine ' + fm(cu * vol, 1) + ' g d’urée par jour. Un jour de forte chaleur, son urine ne fait que ' + fm(v2, 1) + ' L pour la même masse d’urée. Quelle est alors sa concentration en urée (g/L, arrondie au dixième) ?', Math.round(cu * vol / v2 * 10) / 10, 'g/L', fm(cu * vol, 1) + ' ÷ ' + fm(v2, 1) + ' ≈ ' + fm(cu * vol / v2, 1) + ' g/L : l’urine est plus concentrée.', 'La masse d’urée reste la même, le volume diminue.', 0.06);
    }
  };

  var M1 = {};
  M1['s3-1'] = { topics: ['b:dig', 'b:dig', 'g:energie'] };
  M1['s3-2'] = { topics: ['b:resp', 'b:resp', 'g:vent'] };
  M1['s3-3'] = { topics: ['b:circ', 'b:circ', 'g:debit'] };
  M1['s3-4'] = { topics: ['b:exc', 'b:exc', 'g:urine'] };
  M1['s3-5'] = { topics: ['b:imm'] };
  M1['s3-6'] = { topics: ['b:nut', 'b:nut', 'g:energie'] };
  M1['s3-7'] = { topics: ['b:nerv'] };
  M1['s3-8'] = { topics: ['b:musc'] };
  window.LAB_CONFIG = {
    app: 'svt', appName: 'SVT en mouvement', map: M1,
    gen: function (key, d) {
      var k = key.slice(2);
      if (key.charAt(0) === 'b') return fromBank(k, d === 4 ? 3 : d);
      return G[k](d);
    }
  };
})();
