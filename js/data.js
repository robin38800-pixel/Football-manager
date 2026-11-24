/* Contenu du staff : tactiques, recrutement, entraînement, matchs, guide.
   Les noms de rôles varient selon la langue et la version du jeu :
   on donne le nom français le plus courant + le nom anglais entre parenthèses. */

const STATUTS = [
  { id: 'favori', label: 'Favori au titre' },
  { id: 'haut', label: 'Haut de tableau / Europe' },
  { id: 'milieu', label: 'Milieu de tableau' },
  { id: 'maintien', label: 'Lutte pour le maintien' },
  { id: 'promu', label: 'Promu / petit budget' },
];

const STYLES = [
  { id: 'pressing', label: 'Pressing haut' },
  { id: 'possession', label: 'Possession' },
  { id: 'contre', label: 'Contre-attaque' },
  { id: 'direct', label: 'Jeu direct' },
  { id: 'equilibre', label: 'Je ne sais pas encore' },
];

const FORCES = [
  { id: 'ailes', label: 'Ailiers rapides' },
  { id: 'milieu', label: 'Milieux techniques' },
  { id: 'attaque', label: 'Deux bons attaquants' },
  { id: 'defense', label: 'Défense solide / grands DC' },
  { id: 'physique', label: 'Effectif jeune et endurant' },
];

/* Positions sur le terrain : x = 0 (gauche) → 100 (droite), y = 0 (but adverse) → 100 (notre but). */
const SYSTEMES = [
  {
    id: 'equilibre',
    nom: "L'Équilibré",
    ip: '4-3-3',
    oop: '4-1-4-1',
    mentalite: 'Équilibrée',
    statuts: ['milieu', 'haut', 'maintien', 'promu', 'favori'],
    styles: ['equilibre', 'possession'],
    forces: ['milieu', 'ailes'],
    resume: "Le système le plus sûr pour débuter. Une sentinelle protège la défense, deux milieux font le lien et trois attaquants occupent la largeur. Il pardonne beaucoup d'erreurs.",
    consignes: {
      ip: ['Passes : mixtes (réglage par défaut)', 'Largeur : normale', 'Laisse le reste par défaut, ajoute une consigne à la fois'],
      transition: ['À la perte : contre-pressing', 'À la récupération : laisse par défaut'],
      oop: ["Ligne d'engagement : moyenne", 'Ligne défensive : normale', 'Pressing : normal'],
    },
    postes: [
      { p: 'GB', ip: [50, 94], oop: [50, 94], rip: 'Gardien (Goalkeeper)', roop: 'Gardien' },
      { p: 'DG', ip: [14, 66], oop: [14, 76], rip: 'Latéral (Full-Back)', roop: 'Latéral' },
      { p: 'DC', ip: [37, 78], oop: [37, 80], rip: 'Défenseur central (Centre-Back)', roop: 'Défenseur central' },
      { p: 'DC', ip: [63, 78], oop: [63, 80], rip: 'Défenseur central (Centre-Back)', roop: 'Défenseur central' },
      { p: 'DD', ip: [86, 66], oop: [86, 76], rip: 'Latéral (Full-Back)', roop: 'Latéral' },
      { p: 'MDC', ip: [50, 62], oop: [50, 66], rip: 'Milieu défensif (Defensive Midfielder)', roop: 'Milieu écran (Screening)' },
      { p: 'MC', ip: [33, 46], oop: [33, 52], rip: 'Box-to-box (Box-to-Box Midfielder)', roop: 'Milieu presseur (Pressing CM)' },
      { p: 'MC', ip: [67, 46], oop: [67, 52], rip: 'Milieu créateur (Playmaker)', roop: 'Milieu (tient sa zone)' },
      { p: 'AG', ip: [14, 24], oop: [12, 50], rip: 'Ailier (Winger)', roop: 'Ailier replié (Tracking Winger)' },
      { p: 'AD', ip: [86, 24], oop: [88, 50], rip: 'Attaquant intérieur (Inside Forward)', roop: 'Ailier replié (Tracking Winger)' },
      { p: 'BU', ip: [50, 14], oop: [50, 32], rip: 'Attaquant complet (Complete Forward)', roop: 'Attaquant presseur (Pressing Forward)' },
    ],
    forcesTxt: ['Solide au milieu grâce à la sentinelle', 'Facile à comprendre pour les joueurs', 'Marche avec presque tous les effectifs'],
    faiblessesTxt: ["L'attaquant peut se retrouver isolé", 'Demande des ailiers qui défendent'],
    profils: "Une sentinelle disciplinée (Placement, Concentration), un milieu endurant (Volume de jeu, Endurance), deux ailiers rapides.",
  },
  {
    id: 'bloc',
    nom: 'Le Bloc qui contre',
    ip: '4-4-2',
    oop: '4-4-2 bloc bas',
    mentalite: 'Prudente',
    statuts: ['maintien', 'promu', 'milieu'],
    styles: ['contre', 'direct'],
    forces: ['attaque', 'defense'],
    resume: "Deux lignes de quatre très compactes, on laisse le ballon à l'adversaire et on frappe en contre avec un duo d'attaquants complémentaires. Idéal quand ton équipe est moins forte que les autres.",
    consignes: {
      ip: ['Passes : plus directes', 'Viser la profondeur derrière la défense', 'Centrer tôt depuis les ailes'],
      transition: ['À la perte : se replier (regroup)', 'À la récupération : contre-attaquer', 'Gardien : relance rapide vers les ailiers'],
      oop: ["Ligne d'engagement : basse", 'Ligne défensive : plus basse', 'Pressing : moins souvent', 'Rester en place plutôt que sortir'],
    },
    postes: [
      { p: 'GB', ip: [50, 94], oop: [50, 94], rip: 'Gardien (Goalkeeper)', roop: 'Gardien' },
      { p: 'DG', ip: [14, 70], oop: [16, 80], rip: 'Latéral (Full-Back)', roop: 'Latéral défensif' },
      { p: 'DC', ip: [37, 80], oop: [38, 84], rip: 'Défenseur central (Centre-Back)', roop: 'Stoppeur / couverture' },
      { p: 'DC', ip: [63, 80], oop: [62, 84], rip: 'Défenseur central (Centre-Back)', roop: 'Stoppeur / couverture' },
      { p: 'DD', ip: [86, 70], oop: [84, 80], rip: 'Latéral (Full-Back)', roop: 'Latéral défensif' },
      { p: 'MG', ip: [12, 36], oop: [16, 64], rip: 'Ailier (Winger)', roop: 'Ailier replié (Tracking Winger)' },
      { p: 'MC', ip: [38, 52], oop: [39, 66], rip: 'Box-to-box (Box-to-Box Midfielder)', roop: 'Milieu écran (Screening)' },
      { p: 'MC', ip: [62, 56], oop: [61, 66], rip: 'Meneur reculé (Deep-Lying Playmaker)', roop: 'Milieu écran (Screening)' },
      { p: 'MD', ip: [88, 36], oop: [84, 64], rip: 'Ailier (Winger)', roop: 'Ailier replié (Tracking Winger)' },
      { p: 'BU', ip: [40, 14], oop: [42, 44], rip: 'Pivot (Target Forward)', roop: 'Attaquant (reste haut)' },
      { p: 'BU', ip: [60, 18], oop: [58, 46], rip: 'Attaquant de profondeur (Channel Forward)', roop: 'Attaquant presseur (Pressing Forward)' },
    ],
    forcesTxt: ['Très dur à percer quand le bloc est en place', 'Contres rapides et dangereux', 'Peu exigeant techniquement'],
    faiblessesTxt: ['Peu de possession, beaucoup de défense', 'Souffre contre les équipes qui centrent beaucoup', 'Les milieux doivent être endurants'],
    profils: "Un attaquant grand et fort (Jeu de tête, Puissance) + un attaquant rapide (Accélération, Déplacement). Milieux avec Volume de jeu et Endurance.",
  },
  {
    id: 'pressing',
    nom: 'Le Pressing Rouge',
    ip: '4-2-3-1',
    oop: '4-4-2 pressing haut',
    mentalite: 'Positive',
    statuts: ['favori', 'haut'],
    styles: ['pressing', 'direct'],
    forces: ['physique', 'ailes'],
    resume: "On étouffe l'adversaire dans son camp. Le meneur offensif monte presser à côté de l'attaquant, et on récupère le ballon haut pour marquer vite. Très efficace, mais ça fatigue énormément.",
    consignes: {
      ip: ['Tempo : plus élevé', 'Passes : mixtes à directes', "Laisser s'exprimer les joueurs offensifs"],
      transition: ['À la perte : contre-pressing', 'À la récupération : contre-attaquer'],
      oop: ["Ligne d'engagement : haute", 'Ligne défensive : plus haute', 'Pressing : beaucoup plus souvent', 'Piège du hors-jeu : activé'],
    },
    postes: [
      { p: 'GB', ip: [50, 94], oop: [50, 92], rip: 'Gardien relanceur (Ball-Playing GK)', roop: 'Gardien libéro (Sweeper Keeper)' },
      { p: 'DG', ip: [12, 52], oop: [14, 66], rip: 'Latéral offensif (Wing-Back)', roop: 'Latéral' },
      { p: 'DC', ip: [36, 74], oop: [37, 70], rip: 'Défenseur relanceur (Ball-Playing CB)', roop: 'Défenseur central' },
      { p: 'DC', ip: [64, 74], oop: [63, 70], rip: 'Défenseur central (Centre-Back)', roop: 'Défenseur central' },
      { p: 'DD', ip: [88, 56], oop: [86, 66], rip: 'Latéral (Full-Back)', roop: 'Latéral' },
      { p: 'MDC', ip: [40, 58], oop: [38, 52], rip: 'Récupérateur (Ball-Winning Midfielder)', roop: 'Milieu presseur (Pressing CM)' },
      { p: 'MDC', ip: [60, 60], oop: [62, 54], rip: 'Meneur reculé (Deep-Lying Playmaker)', roop: 'Milieu écran (Screening)' },
      { p: 'AG', ip: [16, 24], oop: [14, 46], rip: 'Ailier (Winger)', roop: 'Ailier presseur' },
      { p: 'MO', ip: [50, 34], oop: [40, 26], rip: 'Milieu offensif créateur (Attacking Midfielder)', roop: 'Attaquant presseur (monte d’un cran)' },
      { p: 'AD', ip: [82, 22], oop: [86, 46], rip: 'Attaquant intérieur (Inside Forward)', roop: 'Ailier presseur' },
      { p: 'BU', ip: [50, 12], oop: [60, 24], rip: 'Attaquant complet (Complete Forward)', roop: 'Attaquant presseur (Pressing Forward)' },
    ],
    forcesTxt: ['Beaucoup de ballons récupérés près du but adverse', "L'adversaire n'a pas le temps de construire", 'Domine les équipes plus faibles'],
    faiblessesTxt: ['Fatigue élevée : rotation obligatoire', 'Espace dans le dos de la défense', 'Risque de blessures si mal géré'],
    profils: 'Des joueurs avec Volume de jeu, Endurance, Agressivité et Accélération. Des défenseurs rapides pour couvrir la profondeur.',
  },
  {
    id: 'possession',
    nom: 'La Toile',
    ip: '2-3-5 (depuis un 4-3-3)',
    oop: '4-1-4-1',
    mentalite: 'Positive',
    statuts: ['favori', 'haut'],
    styles: ['possession', 'equilibre'],
    forces: ['milieu'],
    resume: "On garde le ballon et on fait courir l'adversaire. En possession, un latéral rentre au milieu et les ailiers restent très larges : 2 derrière, 3 au milieu, 5 devant. Sans ballon, on se replie en 4-1-4-1.",
    consignes: {
      ip: ['Passes : plus courtes', 'Tempo : plus lent', 'Jouer en partant de derrière', 'Travailler le ballon jusque dans la surface'],
      transition: ['À la perte : contre-pressing', 'À la récupération : garder le ballon (pas de contre précipité)'],
      oop: ["Ligne d'engagement : moyenne à haute", 'Ligne défensive : plus haute', 'Pressing : plus souvent'],
    },
    postes: [
      { p: 'GB', ip: [50, 94], oop: [50, 94], rip: 'Gardien relanceur (Ball-Playing GK)', roop: 'Gardien' },
      { p: 'DG', ip: [10, 48], oop: [14, 74], rip: 'Latéral (Full-Back)', roop: 'Latéral' },
      { p: 'DC', ip: [34, 74], oop: [37, 78], rip: 'Défenseur relanceur (Ball-Playing CB)', roop: 'Défenseur central' },
      { p: 'DC', ip: [66, 74], oop: [63, 78], rip: 'Défenseur relanceur (Ball-Playing CB)', roop: 'Défenseur central' },
      { p: 'DD', ip: [62, 58], oop: [86, 74], rip: 'Latéral inversé (Inverted Full-Back)', roop: 'Latéral' },
      { p: 'MDC', ip: [42, 58], oop: [50, 64], rip: 'Meneur reculé (Deep-Lying Playmaker)', roop: 'Milieu écran (Screening)' },
      { p: 'MC', ip: [32, 32], oop: [34, 50], rip: 'Milieu de couloir (Channel Midfielder)', roop: 'Milieu presseur (Pressing CM)' },
      { p: 'MC', ip: [66, 34], oop: [66, 50], rip: 'Milieu créateur (Playmaker)', roop: 'Milieu (tient sa zone)' },
      { p: 'AG', ip: [12, 18], oop: [12, 48], rip: 'Ailier (Winger)', roop: 'Ailier replié (Tracking Winger)' },
      { p: 'AD', ip: [88, 18], oop: [88, 48], rip: 'Attaquant intérieur (Inside Forward)', roop: 'Ailier replié (Tracking Winger)' },
      { p: 'BU', ip: [50, 12], oop: [50, 30], rip: 'Attaquant en retrait (Deep-Lying Forward)', roop: 'Attaquant presseur (Pressing Forward)' },
    ],
    forcesTxt: ["L'adversaire court après le ballon", 'Peu de contres subis si le contre-pressing marche', 'Superbe contre les blocs moyens'],
    faiblessesTxt: ['Demande des joueurs techniques', 'Peut tourner en rond face à un bloc bas', 'Familiarité tactique longue à construire'],
    profils: 'Des défenseurs à l’aise balle au pied (Passes, Sang-froid), un meneur avec Vision et Décisions, des ailiers qui dribblent.',
  },
  {
    id: 'pistons',
    nom: 'Les Pistons',
    ip: '3-5-2',
    oop: '5-3-2',
    mentalite: 'Équilibrée',
    statuts: ['milieu', 'maintien', 'haut'],
    styles: ['contre', 'equilibre', 'direct'],
    forces: ['defense', 'attaque'],
    resume: 'Trois défenseurs centraux, deux pistons qui font tout le couloir et un duo en attaque. Sans ballon, les pistons redescendent et on défend à cinq. Parfait si tu as plus de bons défenseurs centraux que de bons ailiers.',
    consignes: {
      ip: ['Passes : mixtes', 'Centres : depuis les pistons', 'Viser la profondeur pour le duo offensif'],
      transition: ['À la perte : se replier', 'À la récupération : contre-attaquer'],
      oop: ["Ligne d'engagement : moyenne", 'Ligne défensive : normale', 'Pressing : normal'],
    },
    postes: [
      { p: 'GB', ip: [50, 94], oop: [50, 94], rip: 'Gardien (Goalkeeper)', roop: 'Gardien' },
      { p: 'DC', ip: [26, 76], oop: [30, 80], rip: 'Défenseur central débordant (Overlapping CB)', roop: 'Défenseur central' },
      { p: 'DC', ip: [50, 80], oop: [50, 82], rip: 'Défenseur central (Centre-Back)', roop: 'Couverture' },
      { p: 'DC', ip: [74, 76], oop: [70, 80], rip: 'Défenseur relanceur (Ball-Playing CB)', roop: 'Défenseur central' },
      { p: 'PG', ip: [8, 38], oop: [10, 76], rip: 'Piston (Wing-Back)', roop: 'Latéral (ligne de 5)' },
      { p: 'MDC', ip: [50, 62], oop: [50, 62], rip: 'Meneur reculé (Deep-Lying Playmaker)', roop: 'Milieu écran (Screening)' },
      { p: 'MC', ip: [32, 46], oop: [30, 56], rip: 'Box-to-box (Box-to-Box Midfielder)', roop: 'Milieu presseur (Pressing CM)' },
      { p: 'MC', ip: [68, 44], oop: [70, 56], rip: 'Milieu créateur (Playmaker)', roop: 'Milieu (tient sa zone)' },
      { p: 'PD', ip: [92, 38], oop: [90, 76], rip: 'Piston (Wing-Back)', roop: 'Latéral (ligne de 5)' },
      { p: 'BU', ip: [40, 14], oop: [40, 36], rip: 'Pivot (Target Forward)', roop: 'Attaquant (reste haut)' },
      { p: 'BU', ip: [60, 16], oop: [60, 36], rip: 'Second attaquant (Second Striker)', roop: 'Attaquant presseur (Pressing Forward)' },
    ],
    forcesTxt: ['Très solide dans l’axe', 'Supériorité au milieu', 'Un duo offensif toujours servi'],
    faiblessesTxt: ['Les pistons doivent avoir énormément d’endurance', 'Couloirs exposés si les pistons sont fatigués'],
    profils: "Trois défenseurs centraux, dont un à l'aise balle au pied. Des pistons avec Endurance, Volume de jeu, Centres et Vitesse.",
  },
];

const DIAGNOSTICS = [
  {
    q: "On encaisse sur des centres",
    a: ["Mets des ailiers qui défendent (rôle d'ailier replié hors possession).", 'Baisse un peu la ligne défensive pour ne pas être pris de vitesse.', 'Dans les consignes adverses, demande de presser leurs latéraux / ailiers les plus dangereux.', 'Vérifie le Jeu de tête et la Détente de tes défenseurs centraux.'],
  },
  {
    q: 'On ne se crée aucune occasion',
    a: ['Passe la mentalité un cran au-dessus (Équilibrée → Positive).', 'Ajoute un joueur qui part dans la surface (box-to-box, attaquant intérieur).', "Utilise les nouvelles consignes d'attaque de la surface de FM27 : demande des arrivées tardives ou des appels au premier poteau.", 'Si ton attaquant est isolé, rapproche le meneur ou passe à deux attaquants.'],
  },
  {
    q: 'On se fait punir en contre',
    a: ['Active le contre-pressing à la perte du ballon.', 'Garde au moins un milieu défensif qui reste en place (sentinelle / écran).', 'Ne fais pas monter les deux latéraux en même temps.', 'Baisse le tempo : moins de passes risquées.'],
  },
  {
    q: 'On domine mais on ne marque pas',
    a: ['Regarde la qualité des tirs : beaucoup de frappes de loin ? Demande de travailler le ballon jusque dans la surface.', 'Ton attaquant a-t-il une bonne Finition et du Sang-froid ? Sinon, cible-en un au mercato.', 'Ajoute de la largeur pour étirer le bloc adverse.', 'Patience : sur 5 matchs, la chance tourne souvent.'],
  },
  {
    q: 'Mes joueurs sont épuisés en fin de match',
    a: ['Baisse le pressing d’un cran.', 'Fais 3 à 5 changements par match, dès la 60e minute pour les postes qui courent le plus.', 'Allège l’entraînement les jours qui suivent un match.', 'Fais tourner l’effectif quand il y a deux matchs par semaine.'],
  },
  {
    q: 'On perd tous les duels au milieu',
    a: ['Mets un récupérateur (Agressivité, Tacles, Bravoure).', 'Passe à trois milieux axiaux si tu n’en as que deux.', 'Rends le bloc plus compact : ligne défensive et ligne d’engagement plus proches.'],
  },
  {
    q: 'Mon équipe joue mal alors que la tactique est bonne',
    a: ["Regarde l'Efficacité tactique (FM27) : les joueurs comprennent-ils le système ? Il faut du temps et de l'entraînement.", 'Garde la même tactique plusieurs semaines : la familiarité monte avec les matchs.', 'Vérifie le moral et la dynamique d’équipe : un vestiaire qui gronde joue mal.', 'Évite de changer 5 titulaires à chaque match.'],
  },
  {
    q: 'On encaisse sur coups de pied arrêtés',
    a: ['Programme une séance de préparation de match « Coups de pied arrêtés » avant le match.', 'Place tes meilleurs joueurs de la tête au marquage des adversaires dangereux.', 'Demande à un adjoint de gérer les CPA s’il est meilleur que toi dans ce domaine.'],
  },
];

const REGLES_TACTIQUES = [
  'Commence avec UNE tactique principale et UNE de secours. Pas plus.',
  "En possession et hors possession sont deux formes différentes depuis FM26 : construis d'abord la forme hors possession, c'est elle qui évite les défaites.",
  'Change une seule chose à la fois, puis observe 3 à 5 matchs.',
  "Adapte la tactique à tes joueurs, pas l'inverse. Le système parfait sur le papier ne sert à rien si personne ne sait le jouer.",
  "Garde un œil sur l'Efficacité tactique (FM27) : elle te dit si ton équipe est capable de jouer ce que tu demandes.",
];

/* ------------------------------------------------------------------ */
/* Recrutement */

const POSTES_RECRUT = [
  {
    id: 'gb', label: 'Gardien',
    styles: {
      classique: { label: 'Gardien classique', cles: ['Réflexes', 'Arrêts réflexes / Un contre un', 'Placement', 'Prise de balle'], bonus: ['Jeu aérien', 'Commandement de la surface', 'Concentration', 'Communication'] },
      relanceur: { label: 'Gardien relanceur', cles: ['Réflexes', 'Jeu au pied', 'Passes', 'Sang-froid'], bonus: ['Sorties', 'Vision', 'Accélération', 'Décisions'] },
    },
  },
  {
    id: 'dc', label: 'Défenseur central',
    styles: {
      stoppeur: { label: 'Défenseur solide', cles: ['Marquage', 'Tacles', 'Jeu de tête', 'Placement'], bonus: ['Détente', 'Puissance', 'Bravoure', 'Concentration'] },
      relanceur: { label: 'Défenseur relanceur', cles: ['Passes', 'Sang-froid', 'Placement', 'Marquage'], bonus: ['Technique', 'Vision', 'Décisions', 'Anticipation'] },
      rapide: { label: 'Défenseur pour ligne haute', cles: ['Vitesse', 'Accélération', 'Anticipation', 'Placement'], bonus: ['Tacles', 'Décisions', 'Concentration'] },
    },
  },
  {
    id: 'lat', label: 'Latéral / Piston',
    styles: {
      offensif: { label: 'Latéral offensif / Piston', cles: ['Endurance', 'Centres', 'Vitesse', 'Volume de jeu'], bonus: ['Accélération', 'Dribbles', 'Déplacement', 'Jeu collectif'] },
      defensif: { label: 'Latéral défensif', cles: ['Marquage', 'Tacles', 'Placement', 'Concentration'], bonus: ['Vitesse', 'Anticipation', 'Endurance'] },
      inverse: { label: 'Latéral inversé', cles: ['Passes', 'Contrôle', 'Décisions', 'Placement'], bonus: ['Sang-froid', 'Technique', 'Vision'] },
    },
  },
  {
    id: 'mdc', label: 'Milieu défensif',
    styles: {
      recup: { label: 'Récupérateur', cles: ['Tacles', 'Agressivité', 'Volume de jeu', 'Endurance'], bonus: ['Anticipation', 'Bravoure', 'Puissance', 'Placement'] },
      meneur: { label: 'Meneur reculé', cles: ['Passes', 'Vision', 'Décisions', 'Sang-froid'], bonus: ['Contrôle', 'Technique', 'Jeu collectif', 'Placement'] },
      sentinelle: { label: 'Sentinelle', cles: ['Placement', 'Anticipation', 'Concentration', 'Tacles'], bonus: ['Marquage', 'Décisions', 'Jeu collectif'] },
    },
  },
  {
    id: 'mc', label: 'Milieu central',
    styles: {
      b2b: { label: 'Box-to-box', cles: ['Endurance', 'Volume de jeu', 'Passes', 'Déplacement'], bonus: ['Tacles', 'Tirs de loin', 'Puissance', 'Détermination'] },
      createur: { label: 'Milieu créateur', cles: ['Passes', 'Vision', 'Technique', 'Décisions'], bonus: ['Contrôle', 'Sang-froid', 'Flair', 'Jeu collectif'] },
    },
  },
  {
    id: 'mo', label: 'Milieu offensif',
    styles: {
      createur: { label: 'Créateur', cles: ['Passes', 'Vision', 'Technique', 'Flair'], bonus: ['Contrôle', 'Dribbles', 'Décisions', 'Sang-froid'] },
      buteur: { label: 'Milieu qui marque', cles: ['Déplacement', 'Finition', 'Tirs de loin', 'Sang-froid'], bonus: ['Anticipation', 'Accélération', 'Contrôle'] },
    },
  },
  {
    id: 'ail', label: 'Ailier',
    styles: {
      classique: { label: 'Ailier de débordement', cles: ['Accélération', 'Vitesse', 'Dribbles', 'Centres'], bonus: ['Agilité', 'Technique', 'Endurance', 'Volume de jeu'] },
      interieur: { label: 'Attaquant intérieur', cles: ['Accélération', 'Dribbles', 'Finition', 'Déplacement'], bonus: ['Sang-froid', 'Tirs de loin', 'Technique', 'Contrôle'] },
    },
  },
  {
    id: 'bu', label: 'Attaquant',
    styles: {
      renard: { label: 'Renard des surfaces', cles: ['Finition', 'Déplacement', 'Sang-froid', 'Anticipation'], bonus: ['Accélération', 'Contrôle', 'Équilibre'] },
      pivot: { label: 'Pivot', cles: ['Jeu de tête', 'Puissance', 'Détente', 'Contrôle'], bonus: ['Finition', 'Bravoure', 'Jeu collectif', 'Équilibre'] },
      complet: { label: 'Attaquant complet', cles: ['Finition', 'Contrôle', 'Déplacement', 'Passes'], bonus: ['Accélération', 'Technique', 'Jeu de tête', 'Puissance'] },
      presseur: { label: 'Attaquant presseur', cles: ['Volume de jeu', 'Endurance', 'Agressivité', 'Accélération'], bonus: ['Finition', 'Déplacement', 'Bravoure'] },
    },
  },
];

const CONSEILS_MERCATO = [
  { t: 'Ne paie jamais le prix demandé', d: "Fais une première offre autour de 60-70 % de la valeur affichée. Le club vendeur fera une contre-proposition : c'est normal." },
  { t: 'Étale les paiements', d: "Paiements échelonnés (sur 12, 24 ou 36 mois), bonus au nombre de matchs, clause de revente : ton budget de l'année reste disponible pour d'autres recrues." },
  { t: 'Les fins de contrat sont des affaires', d: "Un joueur à qui il reste moins de 6 mois de contrat peut signer un pré-contrat avec un club étranger. Les joueurs libres ne coûtent qu'un salaire et une prime à la signature." },
  { t: 'Les prêts sont tes amis', d: "Les gros clubs prêtent des jeunes très bons pour qu'ils jouent. Pour un petit club, c'est la meilleure façon d'avoir du niveau pour pas cher." },
  { t: "Regarde l'Efficacité tactique", d: "Dans FM27, les rapports de recruteurs indiquent si le joueur colle à ta façon de jouer. Un joueur moins fort mais bien adapté peut rendre plus qu'une star." },
  { t: 'Le salaire coûte plus que le transfert', d: 'Un salaire de 20 000 €/semaine sur 4 ans, c’est plus de 4 millions. Calcule toujours le coût total avant de signer.' },
  { t: 'Personnalité et statut', d: "Un joueur « Professionnel » ou « Déterminé » progresse mieux. Fais attention au statut promis dans l'effectif : une promesse non tenue fait chuter le moral." },
  { t: 'Vends avant d’acheter', d: "Libère de la masse salariale en vendant ou prêtant les joueurs qui ne jouent pas. Le conseil d'administration aime les effectifs raisonnables." },
];

/* ------------------------------------------------------------------ */
/* Entraînement */

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

/* Chaque jour : [matin, après-midi, soir] ; '' = libre ; 'MATCH' = jour de match. */
const PLANNINGS = {
  presaison: {
    label: 'Pré-saison',
    intro: "Objectif : remettre les joueurs en forme et faire apprendre la tactique. On charge le physique au début, puis on passe à la tactique et aux matchs amicaux.",
    jours: [
      ['Physique', 'Tactique — en possession', ''],
      ['Physique', 'Tactique — hors possession', ''],
      ['Jeux réduits', 'Récupération', ''],
      ['Physique', 'Tactique — transitions', ''],
      ['Coups de pied arrêtés', 'Préparation de match', ''],
      ['Préparation de match', 'MATCH (amical)', ''],
      ['Repos', 'Repos', ''],
    ],
    conseils: ['Programme 4 à 6 matchs amicaux, de plus en plus difficiles.', "Fais jouer tout le monde : la condition physique ne monte qu'en jouant.", 'Utilise toujours la même tactique : la familiarité commence ici.'],
  },
  saison: {
    label: 'Saison (1 match par semaine)',
    intro: "Le rythme normal. On récupère après le match, on travaille en milieu de semaine, on prépare le match la veille.",
    jours: [
      ['Récupération', 'Repos', ''],
      ['Physique', 'Tactique — en possession', ''],
      ['Jeux réduits', 'Tactique — hors possession', ''],
      ['Attaque / Finition', 'Défense', ''],
      ['Préparation — en possession', 'Préparation — hors possession', 'Préparation — CPA'],
      ['MATCH', '', ''],
      ['Repos', 'Repos', ''],
    ],
    conseils: ['La veille du match, utilise les 3 séances de Préparation de match (FM27) : en possession, hors possession, coups de pied arrêtés.', 'Le lendemain du match, toujours récupération ou repos.', "Si un joueur est marqué « risque de blessure », mets-le au repos individuellement."],
  },
  double: {
    label: 'Calendrier chargé (2 matchs par semaine)',
    intro: "Matchs le mardi et le samedi. On ne s'entraîne presque plus : on récupère et on prépare.",
    jours: [
      ['Récupération', 'Préparation — hors possession', ''],
      ['MATCH', '', ''],
      ['Récupération', 'Repos', ''],
      ['Repos', 'Tactique — en possession', ''],
      ['Préparation — en possession', 'Préparation — CPA', ''],
      ['MATCH', '', ''],
      ['Repos', 'Repos', ''],
    ],
    conseils: ['Fais tourner : 3 à 5 changements de titulaires entre deux matchs rapprochés.', 'Pas de physique intense pendant ces semaines.', 'Les remplaçants gardent le rythme grâce aux matchs de la réserve.'],
  },
};

const SEANCE_COULEUR = (s) => {
  if (!s) return 'free';
  if (s.startsWith('MATCH')) return 'match';
  if (/Repos|Récup/.test(s)) return 'rest';
  if (/Physique/.test(s)) return 'phys';
  if (/Préparation/.test(s)) return 'prep';
  if (/CPA|Coups/.test(s)) return 'prep';
  return 'tact';
};

const INDIVIDUEL = [
  { p: 'Jeune attaquant (18-21 ans)', d: 'Rôle : son rôle dans ta tactique. Focus supplémentaire : Finition ou Sang-froid. Donne-lui un tuteur expérimenté.' },
  { p: 'Ailier', d: 'Focus : Centres si ton système centre beaucoup, sinon Dribbles. Les qualités physiques progressent surtout avant 24 ans.' },
  { p: 'Défenseur central', d: 'Focus : Placement ou Marquage. Pour un défenseur relanceur, Passes.' },
  { p: 'Milieu', d: 'Focus : Passes ou Décisions. Pour un récupérateur, Tacles.' },
  { p: 'Gardien', d: "Le gardien a son propre programme. Focus : Réflexes jeune, Jeu au pied si ta tactique relance court." },
  { p: 'Vétéran (31 ans et +)', d: "Intensité réduite pour limiter les blessures. Son meilleur rôle : tuteur des jeunes." },
];

const JEUNES = [
  'Un jeune doit jouer : vise 15 à 25 matchs par saison, chez toi ou en prêt.',
  'Le tutorat transmet la personnalité : associe un jeune à un pro « Professionnel » ou « Déterminé ».',
  "Un prêt n'est utile que si le jeune joue. Vérifie le statut promis par le club qui l'accueille.",
  "Le potentiel (étoiles grises) n'est qu'une estimation de tes recruteurs. Plus ils sont bons, plus elle est fiable.",
  "Les attributs physiques progressent surtout jeunes. Mentalement, on progresse jusqu'à 30 ans.",
];

/* ------------------------------------------------------------------ */
/* Matchs */

const AVANT_MATCH = [
  "Lis le rapport sur l'adversaire (son système, ses joueurs dangereux).",
  'Choisis ta tactique : principale ou de secours selon le rapport.',
  "Vérifie la condition physique : pas de joueur fatigué ou à risque de blessure dans le onze.",
  'Fixe les consignes adverses : presse leur meneur, ferme le pied fort de leur ailier star.',
  'Programme la préparation de match la veille (en possession / hors possession / CPA).',
  "Fais la causerie d'avant-match, puis regarde la réaction des joueurs.",
];

const SITUATIONS_MATCH = [
  { s: 'On mène 1-0 à 70 minutes', a: "Avec les ajustements tactiques rapides de FM27, demande de défendre le résultat : mentalité un cran plus prudente, tempo plus bas. Remplace l'ailier fatigué par un joueur qui défend." },
  { s: 'On est menés à 60 minutes', a: "Mentalité Positive, puis Offensive à 75'. Fais entrer un deuxième attaquant. Demande plus de largeur et des centres." },
  { s: "L'adversaire a le ballon tout le temps", a: "Ce n'est pas grave si on ne concède pas d'occasions. Sinon : bloc plus bas, plus compact, et contre-attaque à la récupération." },
  { s: "Notre attaquant est seul et isolé", a: 'Rapproche un milieu (meneur offensif ou second attaquant). Ou demande un jeu plus direct vers lui si c’est un pivot.' },
  { s: 'Leurs ailiers nous font mal', a: 'Ailiers repliés hors possession, latéraux plus prudents. Dans les consignes adverses : marquer serré et presser leurs ailiers.' },
  { s: 'Carton rouge pour nous', a: 'Retire un attaquant ou un ailier, garde la défense à 4. Passe en 4-4-1, mentalité plus prudente.' },
  { s: 'Carton rouge pour eux', a: 'Ne t’emballe pas. Garde le ballon, augmente la largeur et sois patient. Mentalité Positive suffit.' },
  { s: "Un joueur a un carton jaune et s'énerve", a: 'Demande-lui de tacler moins fort (consigne individuelle) ou remplace-le avant la pause.' },
];

/* Causeries : contexte → situation → { ton, phrase, pourquoi } */
const CAUSERIES = {
  avant: {
    label: "Avant-match",
    situations: {
      favori: { label: 'On est favoris', ton: 'Calme / Assertif', phrase: "« J'attends une victoire, restez concentrés. »", pourquoi: "Les joueurs peuvent être trop sûrs d'eux. Une attente claire évite le relâchement." },
      egal: { label: 'Match équilibré', ton: 'Assertif', phrase: "« Je crois en vous, allez chercher ce match. »", pourquoi: 'Motive sans mettre une pression excessive.' },
      outsider: { label: 'On est outsiders', ton: 'Calme', phrase: "« Il n'y a aucune pression, jouez libérés. »", pourquoi: 'Enlever la pression aide les joueurs nerveux à bien jouer.' },
      derby: { label: 'Derby / gros match', ton: 'Passionné', phrase: "« Ce match compte pour les supporters, montrez-leur ! »", pourquoi: "Les joueurs déterminés adorent ça. Attention aux plus nerveux : parle-leur individuellement sur un ton calme." },
    },
  },
  mitemps: {
    label: 'Mi-temps',
    situations: {
      mene_bien: { label: 'On mène et on joue bien', ton: 'Calme', phrase: "« Continuez comme ça, ne relâchez pas. »", pourquoi: 'Ne casse pas une bonne dynamique. Pas besoin de crier.' },
      egal_bien: { label: 'Égalité mais on domine', ton: 'Assertif', phrase: "« Le but va venir, continuez. »", pourquoi: 'Valide le travail et donne confiance.' },
      mene_mal: { label: 'On mène mais on joue mal', ton: 'Assertif', phrase: "« Je veux plus de concentration. »", pourquoi: "Tu montres que tu n'es pas dupe du score, sans démoraliser." },
      perd_bien: { label: 'Menés mais on joue bien', ton: 'Calme / Encourageant', phrase: "« Vous jouez bien, le résultat va suivre. »", pourquoi: 'Crier ici serait injuste et ferait chuter le moral.' },
      perd_mal: { label: 'Menés et on joue mal', ton: 'Exigeant (Agressif)', phrase: "« C'est inacceptable, je veux une réaction ! »", pourquoi: "À utiliser rarement. Si tu cries à chaque match, ça ne marche plus." },
    },
  },
  fin: {
    label: 'Après-match',
    situations: {
      victoire: { label: 'Victoire méritée', ton: 'Satisfait', phrase: "« Bien joué, vous l'avez mérité. »", pourquoi: 'Fait monter le moral.' },
      victoire_chance: { label: 'Victoire chanceuse', ton: 'Calme', phrase: "« On a gagné, mais il faudra faire mieux. »", pourquoi: 'Garde les pieds sur terre sans gâcher la joie.' },
      nul: { label: 'Match nul', ton: 'Calme', phrase: "« Un point, c'est un point. On travaille. »", pourquoi: 'Neutre, sûr.' },
      defaite_digne: { label: 'Défaite mais on a bien joué', ton: 'Encourageant', phrase: "« Vous ne méritiez pas de perdre. »", pourquoi: 'Protège le moral après un match frustrant.' },
      defaite_honte: { label: 'Défaite sans rien montrer', ton: 'Déçu', phrase: "« Je suis déçu, ce n'était pas assez. »", pourquoi: 'Montre ton exigence. Évite de viser un joueur en public.' },
    },
  },
};

/* ------------------------------------------------------------------ */
/* Guide FM27 */

const CHECKLIST = [
  { t: "Choisis l'expérience « Aucune expérience »", d: 'Au lancement de la carrière : cela active les tutoriels et les explications en jeu.' },
  { t: "Lis les attentes du conseil d'administration", d: "Objectif de la saison, budget, philosophie du club. C'est ce qui décidera si tu es viré." },
  { t: "Demande un rapport d'effectif à ton adjoint", d: 'Il te dit qui sont les meilleurs joueurs, les points faibles et les postes à renforcer.' },
  { t: 'Délègue ce qui t’ennuie', d: 'Dans les responsabilités du staff : conférences de presse, matchs amicaux, contrats des jeunes, entraînement si tu veux.' },
  { t: 'Complète ton staff', d: 'Recruteurs, analystes, kinés, préparateurs. Un bon staff vaut plusieurs recrues.' },
  { t: 'Choisis 1 tactique principale + 1 de secours', d: "Parle à Bernard, l'adjoint, dans ce centre. Construis d'abord la forme hors possession." },
  { t: "Règle l'entraînement (ou délègue-le)", d: 'Inès, la préparatrice, te donne un planning type. Pense à la Préparation de match de FM27.' },
  { t: 'Fixe les statuts des joueurs', d: "Titulaire, rotation, remplaçant, espoir... Le statut définit ce que le joueur attend de toi." },
  { t: 'Libère les joueurs inutiles', d: 'Mets en vente ou en prêt ceux qui ne joueront pas : tu récupères de la masse salariale.' },
  { t: 'Organise le recrutement', d: "Définis les postes à renforcer et envoie tes recruteurs. Sami, le recruteur, t'aide à faire la fiche de poste." },
  { t: 'Planifie les matchs amicaux', d: '4 à 6 matchs de pré-saison, du plus facile au plus difficile.' },
  { t: 'Épingle tes écrans favoris', d: 'Les favoris (en haut à droite, 12 max) : Effectif, Tactique, Entraînement, Recrutement, Finances.' },
];

const NAVIGATION = [
  { t: 'Le Portail', d: "C'est ton écran d'accueil depuis FM26. Il regroupe tes messages, l'actualité, les prochains matchs et les infos importantes. Reviens-y à chaque fois que tu es perdu." },
  { t: 'La barre du haut', d: "Six catégories en haut de l'écran, chacune avec ses sous-menus. Passe la souris dessus pour voir ce qu'elles contiennent." },
  { t: 'La recherche', d: "Le raccourci le plus utile : tape « Entraînement », « Tactique » ou le nom d'un joueur et tu tombes directement sur le bon écran." },
  { t: 'Les favoris', d: "En haut à droite. Tu peux épingler jusqu'à 12 écrans pour y accéder en un clic, depuis n'importe où." },
  { t: 'Tuiles et cartes', d: 'Les écrans sont faits de tuiles (des résumés). Clique sur une tuile pour ouvrir une carte avec tout le détail.' },
  { t: 'FMPedia', d: "Le glossaire intégré au jeu : Fair-play financier, confiance du conseil, nouveautés tactiques... Il explique tout." },
  { t: 'Continuer', d: "Le bouton pour avancer dans le temps. Le jeu s'arrête tout seul quand une décision t'attend." },
];

const NOUVEAUTES_FM27 = [
  { t: 'Efficacité tactique', d: "Nouvelle jauge qui mesure si ton équipe peut jouer ta tactique. Quatre piliers : la qualité des joueurs, les infos sur le prochain match, l'adhésion des joueurs à ton projet et leur compréhension tactique (qui se travaille à l'entraînement). Pas besoin d'atteindre 100 %." },
  { t: 'Ajustements tactiques en match', d: "Tu peux modifier l'approche pendant le match sans ouvrir l'écran Tactique : plus de largeur, chercher un but tardif, défendre un résultat..." },
  { t: "Consignes d'attaque de la surface", d: 'Nouvelles consignes pour les arrivées tardives ou les appels dans le dos de la défense, et pour viser le premier poteau, le second ou le centre.' },
  { t: 'Préparation de match', d: "Jusqu'à 3 séances avant un match : en possession, hors possession et coups de pied arrêtés." },
  { t: 'En possession / Hors possession', d: "Hérité de FM26 : ton équipe a une forme avec le ballon et une autre sans. Chaque joueur a donc deux rôles." },
];

const GLOSSAIRE = [
  { t: 'CA / PA', d: 'Capacité actuelle et potentielle. Les étoiles pleines = niveau actuel, les étoiles grises = potentiel estimé par tes recruteurs.' },
  { t: 'Moral', d: "L'humeur du joueur. Il monte avec les victoires, le temps de jeu et les promesses tenues." },
  { t: "Dynamique d'équipe", d: "L'ambiance du vestiaire. Les leaders (joueurs influents) la tirent vers le haut ou vers le bas." },
  { t: 'Familiarité tactique', d: 'À quel point les joueurs connaissent ta tactique. Elle monte en jouant et en t’entraînant avec la même tactique.' },
  { t: 'Efficacité tactique', d: "Nouveauté FM27 : capacité réelle de l'équipe à appliquer ta philosophie. Dépend du niveau des joueurs, de la préparation, de leur adhésion et de leur compréhension tactique." },
  { t: 'Mentalité', d: "Le niveau de risque global : de Très défensive à Très offensive. Elle influence le tempo, la hauteur des lignes et la prise de risque." },
  { t: 'Rôle', d: "Ce que le joueur fait à son poste. Depuis FM26, chaque joueur a un rôle en possession et un rôle hors possession." },
  { t: "Ligne d'engagement", d: "La hauteur où ton équipe commence à presser. Haute = on presse dans leur camp. Basse = on attend devant notre surface." },
  { t: 'Contre-pressing', d: 'Presser immédiatement après avoir perdu le ballon pour le récupérer vite.' },
  { t: 'Consignes adverses', d: "Des ordres ciblés sur des joueurs adverses : presser, marquer serré, fermer le pied fort." },
  { t: 'Condition physique', d: "L'énergie du joueur. Basse = moins bon et plus de risques de blessure." },
  { t: 'Rythme de match', d: "La forme acquise en jouant. Un joueur qui ne joue jamais perd du rythme, même s'il est en forme." },
  { t: 'Statut dans l’effectif', d: "Titulaire indiscutable, important, rotation, remplaçant, espoir... Le joueur s'attend au temps de jeu qui va avec." },
  { t: 'Promesse', d: "Un engagement pris avec un joueur (temps de jeu, recrue à son poste...). Ne pas la tenir fait chuter son moral et sa confiance." },
  { t: 'Clause libératoire', d: "Montant fixé dans le contrat : si un club l'offre, le joueur peut négocier avec lui. Évite d'en mettre une trop basse." },
  { t: 'Pré-contrat (Bosman)', d: "Un joueur à moins de 6 mois de la fin de son contrat peut s'engager avec un club étranger pour la saison suivante, gratuitement." },
  { t: 'Paiements échelonnés', d: "Payer un transfert en plusieurs fois. Ça préserve le budget de l'année en cours." },
  { t: 'Fair-play financier', d: 'Règles qui limitent les dépenses par rapport aux revenus. Le conseil te prévient si tu t’en approches.' },
  { t: 'Confiance du conseil', d: "Ta note auprès des dirigeants : résultats, finances, style de jeu, gestion des jeunes. Trop basse = licenciement." },
  { t: 'Personnalité', d: "Professionnel, Déterminé, Ambitieux... Elle influence la progression et le comportement. Les « Peu professionnel » progressent mal." },
  { t: 'Tutorat', d: 'Groupe où des joueurs expérimentés transmettent leur personnalité et leur expérience aux jeunes.' },
  { t: 'Rapport de recruteur', d: "La fiche d'un joueur observé : points forts, faibles, prix estimé et, dans FM27, son adéquation à ta tactique." },
];

const PIEGES = [
  "Changer de tactique après chaque défaite : la familiarité retombe à zéro.",
  "Acheter 8 joueurs l'été : la dynamique d'équipe s'effondre. 3 à 5 recrues ciblées suffisent.",
  'Promettre du temps de jeu à tout le monde.',
  'Oublier la masse salariale : le budget transferts ne fait pas tout.',
  "Faire jouer les mêmes 11 joueurs toute la saison : blessures assurées en mars.",
  'Ignorer les messages du Portail : certains demandent une réponse (joueur mécontent, offre).',
  "Vendre ton capitaine ou un leader du vestiaire sans réfléchir.",
  "Ne pas sauvegarder. Le jeu sauvegarde automatiquement, mais fais aussi des sauvegardes manuelles.",
];

const ASTUCES = [
  "Une victoire 1-0 vaut autant qu'un 5-0. Ne cherche pas le beau jeu tout de suite.",
  "Si un joueur se plaint, parle-lui avant qu'il ne contamine le vestiaire.",
  "Regarde les faits marquants du match, pas seulement le score : les occasions racontent la vérité.",
  "Un bon adjoint peut gérer les matchs amicaux à ta place.",
  "Les jeunes de ton centre de formation arrivent une fois par an : prépare de la place.",
  "Les recruteurs connaissent mieux certains pays : envoie-les là où ils ont de la connaissance.",
  "Ne regarde pas que la note du joueur : un attribut clé pour son rôle vaut mieux que dix attributs moyens.",
];

/* ------------------------------------------------------------------ */
/* Profils repérés par la communauté FM27 (recherches du 24/11/2026).
   Les chiffres sont ceux publiés par chaque site, dans leur devise (€ ou £).
   CA/PA = capacité actuelle / potentielle sur 200, selon la source.
   À vérifier dans ta partie : prix et clubs changent selon la sauvegarde et les mises à jour. */

const SRC = {
  allthings: { t: 'allthings.how — Top 40 pépites FM27', u: 'https://allthings.how/fm27-best-wonderkids/' },
  sortWk: { t: 'Sortitoutsi — Pépites FM27', u: 'https://sortitoutsi.net/best-football-manager-2027-wonderkids' },
  sortBargain: { t: 'Sortitoutsi — Bonnes affaires FM27', u: 'https://sortitoutsi.net/football-manager-2027-bargain-players' },
  sortFree: { t: 'Sortitoutsi — Joueurs libres FM27', u: 'https://sortitoutsi.net/football-manager-2027-free-players' },
  gms: { t: 'GiveMeSport — Pépites FM27', u: 'https://www.givemesport.com/football-manager-27-wonderkids/' },
  lwog: { t: 'Last Word on Gaming — Pépites pas chères', u: 'https://lastwordongaming.com/2026/11/23/fm27-best-bargain-wonderkids-guide/' },
  p4fBargain: { t: 'Passion4FM — Bonnes affaires < 10 M€', u: 'https://www.passion4fm.com/football-manager-27-bargains/' },
  p4fCheapWk: { t: 'Passion4FM — Pépites pas chères', u: 'https://www.passion4fm.com/fm27-best-cheap-wonderkids-bargains/' },
  p4fForwards: { t: 'Passion4FM — Attaquants pépites < 3 M€', u: 'https://www.passion4fm.com/fm27-best-cheap-wonderkid-forwards-top-strikers-under-3m/' },
  p4fFree: { t: 'Passion4FM — Meilleurs joueurs libres', u: 'http://www.passion4fm.com/football-manager-best-free-agents/' },
  fmpBargain: { t: 'FMPortugal — Bonnes affaires FM27', u: 'https://fmportugal.net/en/pechinchas-fm27/' },
  fmuFree: { t: 'FMultimate — 15 joueurs libres', u: 'https://fmultimate.com/fm27-best-free-agents/' },
  htvgFree: { t: 'How To Video Game — Joueurs libres', u: 'https://howtovideogame.com/football-manager-27-best-free-agents/' },
  lsFree: { t: 'LiveScore — Joueurs libres FM27', u: 'https://www.livescore.com/en/news/football/more/fm27-the-best-free-agents-to-sign-in-football-manager-2027-football-muse/' },
};

const PROFILS_COMMUNAUTE = [
  // Pépites
  { n: 'Lamine Yamal', age: 19, pos: 'Ailier droit', poste: 'ail', club: 'FC Barcelone', cat: 'pepite', prix: 'Hors de portée', cap: 'Plus gros potentiel des listes (195 dans l’une d’elles)', note: 'Le talent offensif numéro un de FM27. À suivre plutôt qu’à acheter.', src: ['gms'] },
  { n: 'Pau Cubarsí', age: 19, pos: 'Défenseur central', poste: 'dc', club: 'FC Barcelone', cat: 'pepite', prix: 'Très cher', cap: 'CA 165 / PA 185', note: 'Le meilleur jeune défenseur du jeu, déjà au niveau.', src: ['allthings', 'sortWk'] },
  { n: 'Yan Diomandé', age: 19, pos: 'Milieu offensif excentré', poste: 'ail', club: 'Real Madrid', cat: 'pepite', prix: 'Très cher', cap: 'CA 156 / PA 185', note: 'Côté gauche ou droit selon les sources.', src: ['allthings', 'sortWk'] },
  { n: 'Ayyoub Bouaddi', age: 18, pos: 'Milieu central', poste: 'mc', club: 'À vérifier (Manchester City selon une liste)', cat: 'pepite', prix: 'Très cher', cap: 'PA 170 à 200', note: 'Ancien joueur de Lille dans FM26. Vérifie son club dans ta partie.', src: ['allthings'] },
  { n: 'Max Dowman', age: 16, pos: 'Milieu offensif axial', poste: 'mo', club: 'Arsenal', cat: 'pepite', prix: 'Très cher', cap: 'PA 170 à 200', note: 'Le plus jeune du top 40, potentiel parmi les plus hauts.', src: ['allthings'] },
  { n: 'Jorge Domínguez', age: 16, pos: 'Défenseur central', poste: 'dc', club: 'Atlético Madrid', cat: 'pepite', prix: '≈ 1,4 M£ · clause libératoire basse au début', cap: 'CA 100 / PA 166', note: 'À acheter très vite : sa clause est faible en début de partie.', src: ['gms', 'lwog'] },
  { n: 'Holmes Júnior', age: 17, pos: 'Défenseur central', poste: 'dc', club: 'Girona', cat: 'pepite', prix: '≈ 2 M£', cap: '', note: 'Jeune défenseur central au fort potentiel, prix abordable.', src: ['gms'] },
  { n: 'Polli', age: 16, pos: 'Milieu offensif gauche', poste: 'ail', club: 'Espanyol (ou Espanyol B)', cat: 'pepite', prix: '≈ 1 à 5 M€', cap: '', note: 'Pépite cachée citée par plusieurs listes.', src: ['p4fCheapWk'] },
  { n: 'Justin Clarke', age: 17, pos: 'Ailier gauche / attaquant', poste: 'ail', club: 'Everton', cat: 'pepite', prix: '≈ 3,3 M€', cap: '', note: '17 ou 18 ans selon les sources.', src: ['fmpBargain'] },
  { n: 'Tobiás Krejčí', age: 16, pos: 'Attaquant', poste: 'bu', club: 'Sparta Prague', cat: 'pepite', prix: '≈ 1,5 M€', cap: '', note: 'Attaquant pépite à moins de 3 M€.', src: ['p4fForwards'] },
  // Bonnes affaires
  { n: 'Marc Aguado', age: 26, pos: 'Milieu défensif / central', poste: 'mdc', club: 'Elche', cat: 'affaire', prix: '≈ 4 M€', cap: '', note: 'Milieu fiable pour presque rien.', src: ['p4fBargain'] },
  { n: 'Pol Lozano', age: null, pos: 'Milieu central / défensif', poste: 'mc', club: 'Espanyol', cat: 'affaire', prix: '12 à 15 M€', cap: '', note: 'Un peu plus cher, mais titulaire immédiat.', src: ['p4fBargain'] },
  { n: 'Brian Gutiérrez', age: null, pos: 'Milieu offensif / central', poste: 'mo', club: 'Chivas', cat: 'affaire', prix: '5 à 10 M€', cap: '', note: 'Créateur venu du Mexique.', src: ['p4fBargain'] },
  { n: 'Riccardo Sottil', age: 27, pos: 'Ailier gauche', poste: 'ail', club: 'Fiorentina', cat: 'affaire', prix: '≈ 2,2 M€', cap: '', note: 'Ailier expérimenté à petit prix.', src: ['p4fBargain'] },
  { n: 'Roberto Alvarado', age: 27, pos: 'Ailier gauche', poste: 'ail', club: 'Chivas', cat: 'affaire', prix: '≈ 8 M€', cap: '', note: 'Ailier international mexicain.', src: ['p4fBargain'] },
  { n: 'Giorgos Koutsias', age: 22, pos: 'Attaquant', poste: 'bu', club: 'Famalicão', cat: 'affaire', prix: 'Non précisé', cap: '', note: 'Bonne affaire en attaque, surtout pour les clubs moyens.', src: ['p4fBargain'] },
  { n: 'Danilo Cataldi', age: 31, pos: 'Milieu défensif', poste: 'mdc', club: 'Lazio', cat: 'affaire', prix: '≈ 5 M£', cap: '', note: 'Expérience et placement pour protéger la défense.', src: ['sortBargain'] },
  { n: 'Alexis Claude-Maurice', age: 28, pos: 'Milieu offensif', poste: 'mo', club: 'Augsbourg', cat: 'affaire', prix: '≈ 8 M£', cap: '', note: 'Connaît la Ligue 1.', src: ['sortBargain'] },
  { n: 'Stefan de Vrij', age: null, pos: 'Défenseur central', poste: 'dc', club: 'À vérifier', cat: 'affaire', prix: 'Entre 1 et 10 M£', cap: '', note: 'Vétéran solide pour encadrer une défense jeune.', src: ['sortBargain'] },
  { n: 'Marcin Bułka', age: null, pos: 'Gardien', poste: 'gb', club: 'À vérifier', cat: 'affaire', prix: '≈ 5 M£', cap: '', note: 'Ancien gardien de Nice, bon rapport qualité-prix.', src: ['sortBargain'] },
  // Joueurs libres
  { n: 'Raphaël Guerreiro', age: 32, pos: 'Latéral gauche / milieu', poste: 'lat', club: 'Libre', cat: 'libre', prix: 'Gratuit (salaire seulement)', cap: 'Note 72/80 selon FMPortugal', note: 'Polyvalent et très technique. Parmi les meilleurs libres au départ.', src: ['fmpBargain', 'p4fFree'] },
  { n: 'Francesco Acerbi', age: 38, pos: 'Défenseur central', poste: 'dc', club: 'Libre', cat: 'libre', prix: 'Gratuit (salaire seulement)', cap: '', note: 'Pour une saison, si tu n’as pas les moyens d’un défenseur cher.', src: ['fmuFree'] },
  { n: 'Jadon Sancho', age: 26, pos: 'Ailier', poste: 'ail', club: 'Libre', cat: 'libre', prix: 'Gratuit (salaire seulement)', cap: '', note: 'Encore jeune : le libre le plus intéressant sur la durée.', src: ['htvgFree', 'lsFree'] },
  { n: 'Riyad Mahrez', age: 35, pos: 'Ailier droit', poste: 'ail', club: 'Libre', cat: 'libre', prix: 'Gratuit (salaire seulement)', cap: '', note: 'Contrat court uniquement, vu son âge.', src: ['htvgFree', 'lsFree'] },
  { n: 'Christian Eriksen', age: 34, pos: 'Milieu central', poste: 'mc', club: 'Libre', cat: 'libre', prix: 'Gratuit (salaire seulement)', cap: '', note: 'Passeur de grande classe, idéal comme tuteur.', src: ['htvgFree'] },
  { n: 'Oleksandr Zinchenko', age: 29, pos: 'Latéral gauche / milieu', poste: 'lat', club: 'Libre', cat: 'libre', prix: 'Gratuit (salaire seulement)', cap: '', note: 'Parfait en latéral inversé.', src: ['htvgFree', 'lsFree'] },
  { n: 'Anthony Martial', age: 30, pos: 'Attaquant / ailier', poste: 'bu', club: 'Libre', cat: 'libre', prix: 'Gratuit (salaire seulement)', cap: '', note: 'Ancien Lyonnais du centre de formation.', src: ['lsFree'] },
  { n: 'Karim Benzema', age: 38, pos: 'Attaquant', poste: 'bu', club: 'Libre', cat: 'libre', prix: 'Gratuit (salaire seulement)', cap: '', note: 'Formé à l’OL. Une saison de plus pour finir à la maison ?', src: ['htvgFree'] },
];

const CATS_PROFILS = { pepite: 'Pépite', affaire: 'Bonne affaire', libre: 'Libre' };
const PERSONNALITES = ['Inconnue', 'Professionnel', 'Déterminé', 'Ambitieux', 'Leader né', 'Équilibré', 'Peu professionnel', 'Tempérament'];

/* Liens de recherche (s'ouvrent dans un nouvel onglet) */
const LIENS_JOUEUR = (nom) => {
  const q = encodeURIComponent(nom);
  return [
    { t: 'Transfermarkt', u: `https://www.transfermarkt.fr/schnellsuche/ergebnis/schnellsuche?query=${q}` },
    { t: 'FMInside', u: `https://duckduckgo.com/?q=${encodeURIComponent('site:fminside.net ' + nom + ' FM27')}` },
    { t: 'FM Scout', u: `https://duckduckgo.com/?q=${encodeURIComponent('site:fmscout.com ' + nom + ' FM27')}` },
    { t: 'Sortitoutsi', u: `https://duckduckgo.com/?q=${encodeURIComponent('site:sortitoutsi.net ' + nom + ' FM27')}` },
  ];
};
