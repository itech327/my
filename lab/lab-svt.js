/* Configuration des défis : SVT en mouvement (1AC, 2AC, 3AC) */
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
    ],
    mic: [
      [1, 'Quel microbe n’a pas de structure cellulaire ?', ['le virus', 'la bactérie', 'le protozoaire'], 0, 'Un virus se multiplie seulement dans une cellule vivante.'],
      [1, 'Un microbe qui provoque une maladie est :', ['pathogène', 'utile', 'digestif'], 0, 'Pathogène veut dire qui rend malade.'],
      [1, 'Les antibiotiques agissent contre :', ['les bactéries', 'les virus', 'les rayons du soleil'], 0, 'Ils sont inefficaces contre les virus.'],
      [2, 'Les bactéries sont des êtres :', ['unicellulaires sans noyau', 'sans cellule', 'pluricellulaires'], 0, 'Elles sont visibles seulement au microscope.'],
      [2, 'La grippe est causée par :', ['un virus', 'une bactérie', 'un champignon'], 0, 'Les antibiotiques ne la soignent pas.'],
      [2, 'Un microbe peut entrer dans l’organisme par :', ['le nez, la bouche ou une plaie', 'seulement les yeux fermés', 'les ongles uniquement'], 0, 'Ce sont des portes d’entrée.'],
      [2, 'Le geste le plus simple contre les microbes est :', ['se laver les mains au savon', 'partager sa bouteille', 'mâcher des crayons'], 0, 'L’hygiène des mains limite beaucoup d’infections.'],
      [3, 'Pourquoi finir un traitement antibiotique prescrit ?', ['pour éliminer toutes les bactéries', 'pour fatiguer le médecin', 'pour devenir immunisé contre tout'], 0, 'Un arrêt trop tôt laisse des bactéries survivantes.'],
      [3, 'La contagion est :', ['le passage d’une maladie d’une personne à une autre', 'une réaction de la peau au soleil', 'un type de vaccin'], 0, 'Le microbe passe d’un malade à une personne saine.'],
      [3, 'Pourquoi désinfecter une plaie ?', ['pour empêcher l’entrée de microbes', 'pour la faire grandir', 'pour la rendre douloureuse'], 0, 'La peau abîmée est une porte d’entrée.']
    ],
    rim: [
      [1, 'Les phagocytes :', ['ingèrent et détruisent les microbes', 'fabriquent les anticorps', 'transportent le dioxygène'], 0, 'C’est la phagocytose.'],
      [1, 'Les plasmocytes fabriquent :', ['des anticorps', 'du glucose', 'de l’urée'], 0, 'Ils dérivent des lymphocytes B.'],
      [1, 'Où les lymphocytes T mûrissent-ils ?', ['dans le thymus', 'dans le foie', 'dans l’estomac'], 0, 'Le thymus est un organe lymphoïde.'],
      [2, 'La réaction inflammatoire provoque :', ['rougeur, chaleur, gonflement et douleur', 'un refroidissement de la zone', 'une disparition du sang'], 0, 'C’est un signe de défense locale.'],
      [2, 'La réponse non spécifique est :', ['la même pour tous les microbes', 'propre à un seul microbe', 'toujours retardée'], 0, 'Elle est immédiate.'],
      [2, 'Un lymphocyte B reconnaît :', ['un antigène précis', 'tous les antigènes', 'aucun antigène'], 0, 'Sa reconnaissance est spécifique.'],
      [2, 'La moelle osseuse :', ['produit les lymphocytes', 'filtre l’urine', 'digère les protéines'], 0, 'Tous les lymphocytes y naissent.'],
      [3, 'Les anticorps agissent :', ['dans le sang et les liquides', 'à l’intérieur des cellules', 'seulement dans les os'], 0, 'C’est la médiation humorale.'],
      [3, 'Les lymphocytes T8 cytotoxiques détruisent :', ['les cellules infectées', 'les globules rouges sains', 'les anticorps'], 0, 'C’est la médiation cellulaire.'],
      [3, 'Le rôle des lymphocytes T4 est :', ['coordonner la réponse immunitaire', 'transporter le dioxygène', 'fabriquer la bile'], 0, 'On les appelle lymphocytes auxiliaires.'],
      [3, 'Les ganglions gonflent en cas d’infection car :', ['les lymphocytes s’y multiplient', 'ils se remplissent d’air', 'les os y entrent'], 0, 'Ce sont des lieux de rencontre avec les antigènes.']
    ],
    dys: [
      [1, 'Le VIH infecte surtout :', ['les lymphocytes T4', 'les globules rouges', 'les plaquettes'], 0, 'Il affaiblit les défenses.'],
      [1, 'Le SIDA est :', ['un affaiblissement grave des défenses', 'une allergie', 'une carence en vitamine'], 0, 'Syndrome d’immunodéficience acquise.'],
      [1, 'Le VIH se transmet par :', ['des rapports sexuels non protégés', 'une poignée de main', 'un moustique'], 0, 'Aussi par le sang et de la mère à l’enfant.'],
      [2, 'Une allergie est :', ['une réponse excessive à une substance inoffensive', 'une infection par un virus', 'un manque de globules rouges'], 0, 'La substance s’appelle allergène.'],
      [2, 'Une allergie apparaît :', ['au deuxième contact avec l’allergène', 'sans aucun contact', 'seulement à la naissance'], 0, 'Le premier contact sensibilise l’organisme.'],
      [2, 'La substance libérée pendant une allergie est :', ['l’histamine', 'l’insuline', 'la bile'], 0, 'Elle provoque démangeaisons et gonflement.'],
      [2, 'Un moyen de prévenir le SIDA est :', ['utiliser un préservatif', 'éviter la vie en classe', 'ne plus serrer la main'], 0, 'Aussi objets coupants à usage unique et dépistage.'],
      [3, 'Une transfusion incompatible provoque :', ['une agglutination des globules rouges', 'une digestion du sang', 'une baisse de la fièvre'], 0, 'Les anticorps du receveur se fixent sur les antigènes du donneur.'],
      [3, 'Une personne du groupe AB a :', ['les antigènes A et B sur les globules rouges', 'les anticorps anti-A et anti-B', 'aucun antigène'], 0, 'Elle n’a pas d’anticorps anti-A ni anti-B.'],
      [3, 'Le groupe O a dans son plasma :', ['les anticorps anti-A et anti-B', 'les antigènes A et B', 'aucun anticorps'], 0, 'Ses globules rouges n’ont aucun antigène.'],
      [3, 'Pourquoi consulter en cas d’écoulement inhabituel ?', ['pour dépister une infection et la soigner tôt', 'pour éviter la toilette', 'pour attendre sans rien faire'], 0, 'Un traitement précoce évite les complications.']
    ],
    tec: [
      [1, 'Quelle couche de la Terre est liquide ?', ['Le noyau externe', 'Le manteau', 'La croûte'], 0, 'Le noyau externe est fait de fer et de nickel liquides.'],
      [1, 'La lithosphère est découpée en :', ['plaques', 'couches de sable', 'nappes'], 0, 'Les plaques bougent de quelques centimètres par an.'],
      [1, 'Le point de rupture d’un séisme en profondeur est :', ['le foyer', 'l’épicentre', 'le cratère'], 0, 'L’épicentre est juste au-dessus, en surface.'],
      [2, 'Deux plaques qui s’écartent forment une limite :', ['divergente', 'convergente', 'transformante'], 0, 'De la nouvelle lithosphère se forme.'],
      [2, 'La subduction est :', ['la plongée d’une plaque sous une autre', 'l’écartement de deux plaques', 'le glissement de deux plaques'], 0, 'Elle se produit aux limites convergentes.'],
      [2, 'Que crache un volcan en éruption ?', ['du magma, des gaz et des cendres', 'de l’eau salée', 'du sable'], 0, 'Le magma en surface s’appelle lave.'],
      [2, 'Wegener propose en 1912 :', ['la dérive des continents', 'la tectonique des plaques complète', 'la formation des volcans'], 0, 'Il manquait alors une explication de la force.'],
      [3, 'Un argument de Wegener pour la dérive des continents est :', ['les mêmes fossiles sur deux continents éloignés', 'la forme des nuages', 'la couleur des océans'], 0, 'Mesosaurus vivait en Amérique du Sud et en Afrique.'],
      [3, 'Une chaîne de montagnes se forme surtout à une limite :', ['convergente', 'divergente', 'sans plaques'], 0, 'La compression plie et casse les roches.'],
      [3, 'Pendant un séisme, il faut :', ['se mettre à l’abri loin des fenêtres', 'prendre l’ascenseur', 'courir vers le balcon'], 0, 'L’ascenseur est dangereux.'],
      [3, 'Quelle mesure décrit l’énergie libérée par un séisme ?', ['la magnitude', 'l’intensité', 'l’altitude'], 0, 'L’intensité décrit les effets en un lieu.']
    ],
    rea: [
      [1, 'Un animal ovipare :', ['pond des œufs', 'garde le petit dans son corps', 'n’a pas de gamètes'], 0, 'L’embryon se développe dans l’œuf.'],
      [1, 'Le spermatozoïde est le gamète :', ['mâle', 'femelle', 'neutre'], 0, 'L’ovule est le gamète femelle.'],
      [1, 'Un animal vivipare est :', ['le chat', 'la poule', 'la tortue'], 0, 'Le petit se développe dans le corps de la mère.'],
      [2, 'La fécondation de la grenouille est :', ['externe', 'interne', 'impossible'], 0, 'Les gamètes se rencontrent dans l’eau.'],
      [2, 'La fusion d’un spermatozoïde et d’un ovule donne :', ['une cellule-œuf', 'un gamète', 'un têtard'], 0, 'Elle se divise ensuite pour former l’embryon.'],
      [2, 'La métamorphose est le passage :', ['du têtard à la grenouille', 'de l’œuf au spermatozoïde', 'de la fleur au fruit'], 0, 'Elle change l’aspect de l’animal.'],
      [2, 'Pourquoi la grenouille pond-elle beaucoup d’œufs ?', ['beaucoup sont perdus dans l’eau', 'elle aime pondre', 'les œufs sont très petits seulement'], 0, 'La fécondation externe est peu efficace.'],
      [3, 'Un œuf de poule acheté au marché :', ['n’est pas fécondé', 'contient un poussin', 'est une cellule-œuf fécondée'], 0, 'Il n’y a pas eu de coq.'],
      [3, 'La fécondation interne a lieu chez :', ['les mammifères', 'la plupart des poissons osseux', 'les têtards'], 0, 'Elle a lieu dans les voies génitales de la femelle.'],
      [3, 'La cellule-œuf contient :', ['des informations des deux parents', 'seulement celles de la mère', 'aucune information'], 0, 'Elle résulte de la fusion de deux gamètes.']
    ],
    rep: [
      [1, 'L’anthère contient :', ['le pollen', 'l’ovule', 'la graine'], 0, 'Elle fait partie de l’étamine.'],
      [1, 'Après la fécondation, l’ovaire devient :', ['un fruit', 'un pétale', 'une racine'], 0, 'Il protège les graines.'],
      [1, 'Les pétales sont souvent colorés pour :', ['attirer les insectes', 'protéger les racines', 'faire de l’ombre'], 0, 'Ils favorisent la pollinisation.'],
      [2, 'Le pistil est :', ['l’organe femelle', 'l’organe mâle', 'un pétale'], 0, 'Il contient l’ovule dans l’ovaire.'],
      [2, 'La pollinisation est :', ['le transport du pollen vers le stigmate', 'la chute de la graine', 'la formation du fruit'], 0, 'Le vent ou les insectes y participent.'],
      [2, 'Le tube pollinique descend dans :', ['le style', 'la racine', 'le pétale'], 0, 'Il arrive à l’ovule.'],
      [2, 'L’ovule fécondé devient :', ['une graine', 'un fruit', 'une feuille'], 0, 'La graine contient la plantule.'],
      [3, 'La germination d’une graine demande :', ['de l’eau, de l’air et une température convenable', 'seulement de la lumière', 'du sel'], 0, 'La lumière n’est pas indispensable à la germination.'],
      [3, 'Le rôle du fruit est :', ['protéger les graines et aider leur dissémination', 'fabriquer le pollen', 'attirer les insectes'], 0, 'Les animaux et le vent transportent graines et fruits.'],
      [3, 'Une fleur est dite hermaphrodite si elle porte :', ['étamines et pistil', 'seulement des pétales', 'seulement un ovaire'], 0, 'Elle a des organes mâles et femelles.']
    ],
    reh: [
      [1, 'Les testicules fabriquent :', ['les spermatozoïdes', 'les ovules', 'le lait'], 0, 'Ils fabriquent aussi la testostérone.'],
      [1, 'L’utérus accueille :', ['l’embryon', 'le spermatozoïde seul', 'les aliments'], 0, 'Il se développe pendant la grossesse.'],
      [1, 'La fécondation a lieu en général dans :', ['la trompe', 'le vagin', 'l’estomac'], 0, 'L’œuf descend ensuite vers l’utérus.'],
      [2, 'La nidation est :', ['l’installation de l’embryon dans l’utérus', 'la naissance', 'la libération de l’ovule'], 0, 'Elle a lieu environ une semaine après la fécondation.'],
      [2, 'Le placenta permet :', ['les échanges entre mère et fœtus', 'la digestion du bébé', 'la respiration par les poumons du fœtus'], 0, 'Il apporte dioxygène et nutriments.'],
      [2, 'La grossesse dure environ :', ['neuf mois', 'trois mois', 'douze mois'], 0, 'Elle se termine par l’accouchement.'],
      [2, 'Le seul moyen de contraception qui protège aussi des IST est :', ['le préservatif', 'la pilule', 'le stérilet'], 0, 'Il évite le contact entre les liquides.'],
      [3, 'L’ovulation est :', ['la libération d’un ovule par l’ovaire', 'la formation du sperme', 'la naissance'], 0, 'Elle a lieu environ une fois par mois.'],
      [3, 'Pourquoi demander l’avis d’un médecin avant une contraception médicale ?', ['pour choisir une méthode adaptée à sa santé', 'pour payer moins', 'pour retarder la puberté'], 0, 'Chaque méthode a ses indications.'],
      [3, 'Le cordon ombilical relie :', ['le fœtus au placenta', 'la mère à la trompe', 'l’ovaire à l’utérus'], 0, 'Les échanges passent par lui.']
    ],
    her: [
      [1, 'Combien de chromosomes a une cellule humaine ?', ['46', '23', '92'], 0, 'Cela fait 23 paires.'],
      [1, 'Un spermatozoïde humain contient :', ['23 chromosomes', '46 chromosomes', '2 chromosomes'], 0, 'La cellule-œuf retrouve 46 chromosomes.'],
      [1, 'Le caryotype est :', ['le classement des chromosomes par paires', 'une maladie', 'un organe'], 0, 'On y repère des anomalies.'],
      [2, 'Un enfant XY est :', ['un garçon', 'une fille', 'cela dépend de la mère'], 0, 'Il a reçu un Y de son père.'],
      [2, 'L’ovule porte toujours :', ['un X', 'un Y', 'un X ou un Y'], 0, 'Le sexe dépend du spermatozoïde.'],
      [2, 'La chance d’avoir une fille est de :', ['une sur deux', 'une sur dix', 'toujours'], 0, 'La moitié des spermatozoïdes portent X.'],
      [2, 'La trisomie 21 correspond à :', ['trois chromosomes 21', 'un chromosome Y en trop', 'un seul chromosome 21'], 0, 'Elle est le plus souvent non transmise par les parents.'],
      [3, 'Parmi ces exemples, un caractère héréditaire est :', ['la couleur des yeux', 'un tatouage', 'une cicatrice'], 0, 'Les caractères acquis ne se transmettent pas.'],
      [3, 'Le conseil génétique sert à :', ['informer sur le risque de maladie héréditaire', 'guérir la maladie', 'changer les chromosomes'], 0, 'Il aide les couples à décider.'],
      [3, 'L’hémophilie est une maladie :', ['héréditaire', 'contagieuse', 'alimentaire'], 0, 'Le sang coagule mal.']
    ],
    mil: [
      [1, 'Les composantes non vivantes d’un milieu sont :', ['abiotiques', 'biotiques', 'pluricellulaires'], 0, 'Exemples : eau, air, sol, lumière.'],
      [1, 'Quelle structure existe seulement dans la cellule végétale ?', ['la paroi', 'le noyau', 'la membrane'], 0, 'Elle est rigide.'],
      [1, 'La cellule est :', ['l’unité de base du vivant', 'un organe', 'un tissu'], 0, 'Tous les êtres vivants sont faits de cellules.'],
      [2, 'Les chloroplastes permettent :', ['la photosynthèse', 'la digestion', 'la division'], 0, 'Ils contiennent la chlorophylle.'],
      [2, 'Un être vivant formé d’une seule cellule est :', ['unicellulaire', 'pluricellulaire', 'minéral'], 0, 'Exemple : la bactérie.'],
      [2, 'Le noyau de la cellule :', ['contrôle la cellule', 'fabrique la paroi', 'stocke l’eau'], 0, 'Il contient l’information héréditaire.'],
      [2, 'Le grossissement total d’un microscope est :', ['le produit des grossissements de l’oculaire et de l’objectif', 'la somme des deux', 'la différence des deux'], 0, 'Exemple : 10 fois 40 donne 400.'],
      [3, 'Pourquoi un désert et une forêt abritent-ils des espèces différentes ?', ['leurs conditions sont différentes', 'les espèces choisissent au hasard', 'la lumière manque partout'], 0, 'Chaque espèce est adaptée à son milieu.'],
      [3, 'Une cellule d’épiderme d’oignon observée au microscope montre :', ['une paroi et un noyau', 'des chloroplastes toujours', 'aucun noyau'], 0, 'Les cellules de bulbe n’ont pas de chloroplastes.'],
      [3, 'La vacuole de la cellule végétale :', ['stocke de l’eau et des substances', 'fabrique des spermatozoïdes', 'digère les protéines'], 0, 'Elle est souvent grande.']
    ],
    rsp: [
      [1, 'Le poisson respire par :', ['des branchies', 'des poumons', 'la peau seulement'], 0, 'Les branchies prennent le dioxygène dissous.'],
      [1, 'Le ver de terre respire par :', ['la peau', 'les poumons', 'les trachées'], 0, 'Sa peau doit rester humide.'],
      [1, 'Les plantes respirent :', ['jour et nuit', 'seulement la nuit', 'seulement le jour'], 0, 'Elles respirent en permanence.'],
      [2, 'Les insectes respirent grâce à :', ['des trachées', 'des poumons', 'des branchies'], 0, 'L’air entre par les stigmates.'],
      [2, 'Les gaz entrent dans une feuille par :', ['les stomates', 'les racines', 'les fruits'], 0, 'Ce sont de petits pores.'],
      [2, 'À la lumière, une plante verte rejette surtout :', ['du dioxygène', 'de l’azote', 'du méthane'], 0, 'C’est le résultat de la photosynthèse.'],
      [2, 'Pourquoi un ver de terre sort-il à la surface après une grosse pluie ?', ['l’eau remplit le sol et l’air manque', 'il cherche du soleil', 'il veut boire'], 0, 'Il manque de dioxygène dans la terre inondée.'],
      [3, 'Un têtard respire par :', ['des branchies', 'des poumons', 'la trachée'], 0, 'Il se transforme ensuite.'],
      [3, 'La respiration consomme :', ['du dioxygène et rejette du dioxyde de carbone', 'du dioxyde de carbone et rejette du dioxygène', 'de l’azote'], 0, 'La photosynthèse fait l’inverse.'],
      [3, 'Une grenouille adulte respire par :', ['la peau et les poumons', 'des branchies seulement', 'des trachées'], 0, 'Sa peau est humide.']
    ],
    ntr: [
      [1, 'Le régime de l’Homme est :', ['omnivore', 'herbivore', 'carnivore'], 0, 'Il mange des aliments d’origine animale et végétale.'],
      [1, 'La photosynthèse a lieu dans :', ['les parties vertes de la plante', 'les racines', 'les graines sèches'], 0, 'Les chloroplastes contiennent la chlorophylle.'],
      [1, 'Un herbivore mange :', ['des végétaux', 'de la chair', 'du sable'], 0, 'Exemple : le mouton.'],
      [2, 'La sève brute contient :', ['de l’eau et des sels minéraux', 'du glucose', 'du dioxygène seulement'], 0, 'Elle monte des racines vers les feuilles.'],
      [2, 'La sève élaborée contient :', ['des substances organiques fabriquées', 'seulement de l’eau', 'seulement des sels minéraux'], 0, 'Elle est distribuée à toute la plante.'],
      [2, 'Un animal à molaires plates est :', ['herbivore', 'carnivore', 'insectivore'], 0, 'Elles servent à broyer.'],
      [2, 'Pour fabriquer sa matière, la plante verte a besoin de :', ['lumière, eau et dioxyde de carbone', 'seulement d’eau', 'de viande'], 0, 'C’est la photosynthèse.'],
      [3, 'Pourquoi les besoins alimentaires d’un adolescent sportif sont-ils plus élevés ?', ['il dépense plus d’énergie', 'il dort plus', 'il boit moins'], 0, 'Les besoins dépendent de l’âge et de l’activité.'],
      [3, 'Les canines pointues sont caractéristiques :', ['d’un carnivore', 'd’un herbivore', 'd’une plante'], 0, 'Elles servent à déchirer la chair.'],
      [3, 'L’amidon est :', ['une réserve fabriquée par la plante', 'un sel minéral', 'un gaz'], 0, 'Il est stocké dans graines et tubercules.']
    ],
    cha: [
      [1, 'Dans une chaîne alimentaire, le producteur est :', ['la plante verte', 'le lion', 'la bactérie'], 0, 'Il fabrique sa matière organique.'],
      [1, 'Les décomposeurs sont surtout :', ['des bactéries et des champignons', 'des oiseaux', 'des herbivores'], 0, 'Ils transforment la matière morte.'],
      [1, 'L’énergie d’une chaîne alimentaire vient :', ['du Soleil', 'de la Lune', 'du sol seul'], 0, 'Les plantes captent la lumière.'],
      [2, 'Un consommateur de premier ordre est :', ['un herbivore', 'un carnivore', 'un décomposeur'], 0, 'Il mange le producteur.'],
      [2, 'Si les grenouilles disparaissent, les sauterelles :', ['se multiplient', 'disparaissent aussi', 'ne changent pas'], 0, 'Elles ne sont plus mangées.'],
      [2, 'Un équilibre naturel est :', ['une situation stable entre les espèces', 'un milieu sans êtres vivants', 'une chaîne sans producteur'], 0, 'Les effectifs varient peu.'],
      [2, 'Quelle action peut rompre un équilibre naturel ?', ['la pêche excessive', 'la pluie normale', 'la nuit'], 0, 'Une espèce devient trop rare.'],
      [3, 'Dans le réseau, un animal peut appartenir à :', ['plusieurs chaînes', 'une seule chaîne', 'aucune chaîne'], 0, 'Les chaînes se croisent.'],
      [3, 'Pourquoi les décomposeurs sont-ils indispensables ?', ['ils rendent des éléments minéraux aux plantes', 'ils fabriquent la lumière', 'ils mangent les producteurs seulement'], 0, 'La matière circule.'],
      [3, 'Quelle mesure protège la nature ?', ['créer des parcs nationaux', 'brûler les forêts', 'chasser sans limite'], 0, 'Exemple : Souss-Massa.']
    ],
    cla: [
      [1, 'Un animal à poils et à mamelles est :', ['un mammifère', 'un reptile', 'un poisson'], 0, 'Les mamelles produisent du lait.'],
      [1, 'Combien de pattes a un insecte ?', ['6', '8', '10'], 0, 'L’araignée a 8 pattes.'],
      [1, 'Un animal à plumes est :', ['un oiseau', 'un reptile', 'un mammifère'], 0, 'Les oiseaux ont aussi un bec.'],
      [2, 'La grenouille est :', ['un amphibien', 'un reptile', 'un poisson'], 0, 'Sa peau est nue et humide.'],
      [2, 'Les vertébrés ont :', ['une colonne vertébrale', 'une coquille', 'six pattes'], 0, 'Le squelette est interne.'],
      [2, 'L’araignée est :', ['un arachnide', 'un insecte', 'un crustacé'], 0, 'Elle a huit pattes et pas d’antennes.'],
      [2, 'Les reptiles ont la peau couverte :', ['d’écailles sèches', 'de poils', 'de plumes'], 0, 'Ils sont presque tous ovipares.'],
      [3, 'Le crabe est :', ['un crustacé', 'un insecte', 'un mollusque'], 0, 'Il a une carapace et vit dans l’eau.'],
      [3, 'Quel critère sépare les mammifères des reptiles ?', ['les poils et les mamelles', 'la couleur', 'la taille'], 0, 'C’est un critère de classification.'],
      [3, 'Le dauphin est :', ['un mammifère', 'un poisson', 'un reptile'], 0, 'Il allaite ses petits et respire par des poumons.']
    ],
    sed: [
      [1, 'Les fragments de roches sont déplacés par :', ['l’eau, le vent et la glace', 'le Soleil seul', 'les volcans seulement'], 0, 'C’est le transport.'],
      [1, 'Quelle roche fait effervescence avec un acide ?', ['le calcaire', 'le grès', 'le sel gemme'], 0, 'C’est le test du calcaire.'],
      [1, 'Un fossile est :', ['la trace ou le reste d’un être vivant dans une roche', 'une pierre précieuse', 'un volcan éteint'], 0, 'On en trouve dans les roches sédimentaires.'],
      [2, 'Dans des couches non déformées, la plus ancienne est :', ['celle du bas', 'celle du haut', 'celle du milieu'], 0, 'Principe de superposition.'],
      [2, 'Le grès est formé de :', ['grains de sable collés', 'coquilles seulement', 'lave refroidie'], 0, 'C’est une roche détritique.'],
      [2, 'Les évaporites se forment :', ['quand l’eau s’évapore', 'sous un volcan', 'dans le ciel'], 0, 'Exemples : sel gemme, gypse.'],
      [2, 'La sédimentation est :', ['le dépôt de particules en couches', 'la destruction des roches', 'la formation de volcans'], 0, 'Elle suit le transport.'],
      [3, 'Un fossile stratigraphique permet de :', ['dater les couches', 'mesurer la température', 'trouver du pétrole sans preuve'], 0, 'Son espèce a vécu peu de temps et sur de grandes zones.'],
      [3, 'Quelle étape suit la compaction et la cimentation ?', ['la formation de la roche sédimentaire', 'l’érosion', 'le transport'], 0, 'Les sédiments deviennent roche.'],
      [3, 'Dans un cycle sédimentaire, que devient une roche sédimentaire remontée en surface ?', ['elle est érodée à son tour', 'elle disparaît', 'elle devient liquide'], 0, 'Le cycle recommence.']
    ],
    eau: [
      [1, 'Une roche qui laisse passer l’eau est :', ['perméable', 'imperméable', 'magmatique'], 0, 'L’eau s’y infiltre.'],
      [1, 'Quelle action économise l’eau ?', ['le goutte-à-goutte', 'arroser en plein midi', 'laisser le robinet ouvert'], 0, 'Il apporte l’eau aux racines.'],
      [1, 'Une nappe d’eau souterraine se forme au-dessus d’une couche :', ['imperméable', 'perméable', 'de sable sec'], 0, 'L’eau s’y accumule.'],
      [2, 'Le bassin versant est :', ['la zone qui draine l’eau vers un cours d’eau', 'un barrage', 'une nappe seulement'], 0, 'Il alimente la rivière.'],
      [2, 'Une cause de pollution de l’eau est :', ['les eaux usées', 'la pluie', 'la neige'], 0, 'Il y a aussi engrais et pesticides.'],
      [2, 'Un barrage sert à :', ['stocker l’eau', 'creuser une nappe', 'salir l’eau'], 0, 'Il régularise l’eau des rivières.'],
      [2, 'Une source apparaît quand :', ['une nappe affleure à la surface', 'il pleut', 'on creuse un barrage'], 0, 'L’eau sort de terre.'],
      [3, 'Pourquoi la surexploitation d’une nappe est-elle dangereuse ?', ['son niveau baisse', 'elle gèle', 'elle devient salée par la pluie'], 0, 'On pompe plus qu’elle n’en reçoit.'],
      [3, 'Le stress hydrique signifie :', ['les besoins en eau dépassent les ressources', 'l’eau est abondante', 'l’eau est gelée'], 0, 'Le Maroc est concerné.'],
      [3, 'Quelle mesure réduit les pertes d’eau ?', ['réparer les fuites', 'arroser en plein soleil', 'creuser plus de puits sans contrôle'], 0, 'Les fuites gaspillent beaucoup d’eau.']
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
  M1['s1-1'] = { topics: ['b:mil'] };
  M1['s1-2'] = { topics: ['b:rsp'] };
  M1['s1-3'] = { topics: ['b:ntr'] };
  M1['s1-4'] = { topics: ['b:cha'] };
  M1['s1-5'] = { topics: ['b:cla'] };
  M1['s1-6'] = { topics: ['b:sed'] };
  M1['s1-7'] = { topics: ['b:eau'] };
  M1['s2-1'] = { topics: ['b:tec'] };
  M1['s2-2'] = { topics: ['b:rea'] };
  M1['s2-3'] = { topics: ['b:rep'] };
  M1['s2-4'] = { topics: ['b:reh'] };
  M1['s2-5'] = { topics: ['b:her'] };
  M1['s3-1'] = { topics: ['b:dig', 'b:dig', 'g:energie'] };
  M1['s3-2'] = { topics: ['b:resp', 'b:resp', 'g:vent'] };
  M1['s3-3'] = { topics: ['b:circ', 'b:circ', 'g:debit'] };
  M1['s3-4'] = { topics: ['b:exc', 'b:exc', 'g:urine'] };
  M1['s3-5'] = { topics: ['b:imm'] };
  M1['s3-6'] = { topics: ['b:nut', 'b:nut', 'g:energie'] };
  M1['s3-7'] = { topics: ['b:nerv'] };
  M1['s3-8'] = { topics: ['b:musc'] };
  M1['s3-9'] = { topics: ['b:mic'] };
  M1['s3-10'] = { topics: ['b:rim'] };
  M1['s3-11'] = { topics: ['b:dys'] };
  window.LAB_CONFIG = {
    app: 'svt', appName: 'SVT en mouvement', map: M1,
    gen: function (key, d) {
      var k = key.slice(2);
      if (key.charAt(0) === 'b') return fromBank(k, d === 4 ? 3 : d);
      return G[k](d);
    }
  };
})();
