# Staff de Poche FM27

Un site qui joue le rôle de ton staff pour une carrière sur **Football Manager 27** avec l'Olympique Lyonnais. Il se présente comme un jeu en pixel art : tu te déplaces dans le centre d'entraînement aux couleurs du club, en cliquant sur le sol ou avec les flèches du clavier, et tu cliques sur un membre du staff pour lui parler. Le personnage apparaît alors en grand à gauche, la discussion et ses outils à droite :

| Staff | Rôle | Ce qu'il fait pour toi |
|---|---|---|
| Margaux | Secrétaire générale | Fiche du club (statut, budget, style) et carnet de saison |
| Bernard | Entraîneur adjoint | Assistant tactique, 5 systèmes avec formes en possession / hors possession, diagnostic, règles d'or |
| Sami | Recruteur en chef | Profils proposés tirés des listes de la communauté FM27 (sources citées), fiche joueur notée selon le rôle et le budget, liens Transfermarkt / FMInside / FM Scout / Sortitoutsi, fiche de poste, calculateur de coût, liste de cibles, conseils mercato |
| Inès | Préparatrice physique | Planning type de la semaine, entraînement individuel, jeunes, fatigue |
| Théo | Analyste vidéo | Avant-match, ajustements en match, causeries |
| Jacques | Mentor | Premiers pas (check-list), interface de FM27, nouveautés, glossaire, pièges |

Les données (fiche du club, notes, liste de cibles, check-list) restent dans le navigateur (localStorage).

## Importer les données de ta partie

Margaux (onglet « Importer depuis FM ») accepte un export de FM au format CSV, HTML ou texte, ou un tableau collé. Les colonnes sont reconnues automatiquement (abréviations anglaises de FM comme `Fin`, `OtB`, `Cmp`, noms anglais ou français) et peuvent être corrigées à la main. L'effectif importé est analysé par Bernard (« Mon effectif ») et chaque joueur peut être chargé dans la fiche joueur de Sami.

## Lancer le site

Aucun outil à installer : ouvre `index.html` dans un navigateur, ou active GitHub Pages sur la branche.
