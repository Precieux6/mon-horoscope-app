export type NumTexts = Record<number, string>;

export const LIFE_PATH: NumTexts = {
  1: "Votre chemin de vie 1 est celui du pionnier et du leader indépendant. Bâtisseur de destinées, vous avancez hors des sentiers battus avec audace.",
  2: "Le chemin de vie 2 place la coopération, l'écoute et l'harmonie au centre de votre existence. Vous fédérez les énergies avec tact et diplomatie.",
  3: "Votre chemin de vie 3 est guidé par l'expression créative, la communication et la joie communicative. Vous inspirez durablement vos contemporains.",
  4: "Le chemin de vie 4 incarne la structure, la rigueur et la construction pérenne. Vos bases solides garantissent des réalisations hautement durables.",
  5: "Votre chemin de vie 5 célèbre la liberté, le mouvement et l'adaptabilité face aux mutations du monde et des constellations.",
  6: "Le chemin de vie 6 est placé sous le signe de l'amour, de la famille, de la responsabilité et de l'harmonie des structures humaines.",
  7: "Votre chemin de vie 7 est une quête spirituelle profonde, intellectuelle et philosophique au cœur des mystères cosmiques.",
  8: "Le chemin de vie 8 symbolise la puissance matérielle, l'ambition, la justice et la maîtrise des grands projets d'envergure.",
  9: "Votre chemin de vie 9 est celui de l'humanisme universel, de la compassion et de l'élévation de la conscience collective.",
  11: "Votre chemin de vie 11, nombre maître de l'illumination, vous dote d'une intuition hors norme et d'une sensibilité spirituelle qui vous poussent à inspirer et à éclairer les autres.",
  22: "Le chemin de vie 22, celui du maître bâtisseur, vous donne la capacité de transformer une vision ambitieuse en réalisations concrètes et durables au service du collectif.",
  33: "Le chemin de vie 33, celui du maître guérisseur, place le dévouement, l'enseignement et l'amour inconditionnel au centre de votre mission.",
};

export const EXPRESSION: NumTexts = {
  1: "Tempérament de battant et esprit direct, vous vous imposez naturellement avec assurance.",
  2: "Profil diplomate et collaboratif, vous excellez dans l'art de la négociation et de l'écoute active.",
  3: "Éloquence remarquable et sens artistique inné, vous brillez par votre capacité à communiquer.",
  4: "Organisation minutieuse et pragmatisme sans faille, vous concrétisez les idées en réalités.",
  5: "Grande polyvalence et magnétisme irrésistible face au changement et aux nouveaux horizons.",
  6: "Sens aigu des responsabilités et amour inconditionnel du travail bien fait et esthétique.",
  7: "Esprit analytique perçant et grande profondeur d'analyse en quête permanente d'excellence.",
  8: "Autorité naturelle et sens stratégique majeur pour mener à terme des entreprises ambitieuses.",
  9: "Largeur d'esprit et empathie universelle pour apporter une contribution positive à la société.",
  11: "Nombre d'expression maître 11 : une inspiration rare et un talent pour révéler aux autres ce qu'ils ressentent sans pouvoir le dire.",
  22: "Nombre d'expression maître 22 : une aptitude exceptionnelle à organiser, bâtir et mener de très grands projets collectifs.",
  33: "Nombre d'expression maître 33 : un don pour enseigner, soigner et élever les autres par l'exemple et la bienveillance.",
};

export const SOUL: NumTexts = {
  1: "Votre âme aspire à l'autonomie totale, à l'innovation et à la maîtrise de son propre destin sidéral.",
  2: "Votre âme recherche la fusion affective, la paix, la complicité et la douceur relationnelle.",
  3: "Votre âme réclame de la couleur, des échanges riches, de la création artistique et de la joie.",
  4: "Votre âme trouve la paix dans la sécurité matérielle, l'ordre et la stabilité bien ancrée.",
  5: "Votre âme aspire au grand air, aux expériences inédites et à la transformation perpétuelle.",
  6: "Votre âme se sent accomplie lorsqu'elle protège, conseille et prend soin de son entourage.",
  7: "Votre âme recherche la vérité absolue, le calme méditatif et la connaissance supérieure.",
  8: "Votre âme aspire au succès tangible, à la réussite matérielle et à l'impact économique durable.",
  9: "Votre âme vibre pour la fraternité universelle, la guérison et le don de soi désintéressé.",
  11: "Votre élan spirituel 11 révèle une âme visionnaire, en quête d'élévation, sensible aux signes et aux inspirations subtiles.",
  22: "Votre élan spirituel 22 révèle une âme qui rêve grand et veut laisser une œuvre tangible et utile aux générations à venir.",
  33: "Votre élan spirituel 33 révèle une âme dévouée, tournée vers le service, la guérison et l'amour inconditionnel.",
};

export const INTIMATE: NumTexts = {
  1: "Votre apparence sociale dégage une fermeté volontaire et un leadership naturel intimidant.",
  2: "Vous projetez une image douce, abordable, chaleureuse et spontanément bienveillante.",
  3: "Votre aura est pétillante, souriante, dotée d'un sens de l'humour et d'une élégance naturelle.",
  4: "Vous dégagez une impression de sérieux, de solidité et de grand professionnalisme rassurant.",
  5: "Votre allure exprime un dynamisme contagieux, du magnétisme et une grande modernité.",
  6: "Vous projetez l'image d'une personne de confiance, protectrice, élégante et attentionnée.",
  7: "Votre prestance transmet distinction, mystère et profondeur intellectuelle raffinée.",
  8: "Vous imposez le respect par un statut rigoureux, élégant et une maîtrise totale.",
  9: "Vous dégagez une bienveillance magnétique, une noblesse d'âme et un charisme inspirant.",
  11: "Votre nombre intime 11 donne une présence lumineuse et intuitive : on vous perçoit comme quelqu'un d'inspirant et un peu hors du commun.",
  22: "Votre nombre intime 22 donne une présence solide et ambitieuse : on vous perçoit comme quelqu'un capable de réaliser de grandes choses.",
  33: "Votre nombre intime 33 donne une présence chaleureuse et rassurante : on vous perçoit comme une personne généreuse et profondément bienveillante.",
};

/** Année personnelle : toujours réduite à 1–9 (la cause du bug « 22 → texte du 1 »). */
export const PERSONAL_YEAR: NumTexts = {
  1: "Année personnelle 1 : Lancement d'un tout nouveau cycle de 9 ans, initiatives audacieuses et autonomie.",
  2: "Année personnelle 2 : Patience, association, diplomatie et consolidation des partenariats.",
  3: "Année personnelle 3 : Vague de créativité, sorties, rencontres inspirantes et expansion sociale.",
  4: "Année personnelle 4 : Effort, structure, rigueur et construction concrète des fondations d'avenir.",
  5: "Année personnelle 5 : Vent du changement, voyages, opportunités inattendues et liberté retrouvée.",
  6: "Année personnelle 6 : Focus sur le foyer, responsabilités familiales et choix affectifs structurants.",
  7: "Année personnelle 7 : Parenthèse d'introspection, études, repos et bilan spirituel majeur.",
  8: "Année personnelle 8 : Récoltes matérielles, réussite financière et concrétisation de projets d'envergure.",
  9: "Année personnelle 9 : Achèvement d'un grand cycle, grand nettoyage et préparation de la renaissance.",
};

export const MATURITY: NumTexts = {
  1: "vous invite, avec l'âge, à assumer pleinement votre autonomie et votre leadership",
  2: "oriente vos années de maturité vers la coopération, la paix et les liens profonds",
  3: "ouvre vos années de maturité à l'expression créative et à la joie de transmettre",
  4: "ancre votre maturité dans la construction durable et la sécurité",
  5: "promet une maturité libre, mobile et riche en expériences nouvelles",
  6: "tourne votre maturité vers la famille, l'enseignement et le soin des autres",
  7: "oriente votre maturité vers la sagesse acquise, l'étude et la transmission",
  8: "annonce une maturité de réalisation, d'autorité et de réussite matérielle",
  9: "annonce une maturité d'humanisme, de générosité et de transmission universelle",
  11: "élève votre maturité vers l'inspiration spirituelle et l'accompagnement des autres",
  22: "destine votre maturité aux grands projets structurants et durables",
  33: "voue votre maturité au service, à l'enseignement et au soin d'autrui",
};

export const KARMIC: NumTexts = {
  1: "Le 1 est absent de votre nom : apprenez à affirmer vos choix et à prendre des initiatives.",
  2: "Le 2 est absent de votre nom : cultivez la patience, l'écoute et la coopération.",
  3: "Le 3 est absent de votre nom : apprenez à exprimer vos émotions et à communiquer plus librement.",
  4: "Le 4 est absent de votre nom : apprenez à structurer votre travail et à tenir la durée.",
  5: "Le 5 est absent de votre nom : apprenez à accueillir le changement et à vous adapter.",
  6: "Le 6 est absent de votre nom : apprenez à assumer vos responsabilités envers vos proches.",
  7: "Le 7 est absent de votre nom : faites une place au silence, à l'étude et à la réflexion.",
  8: "Le 8 est absent de votre nom : apprenez à gérer l'argent et à assumer votre pouvoir.",
  9: "Le 9 est absent de votre nom : apprenez à pardonner, à donner et à clore les cycles.",
};

export const PERSONAL_YEAR_ADVICE: NumTexts = {
  1: "lancez enfin le projet que vous repoussez et affirmez vos priorités",
  2: "privilégiez la patience, les alliances et l'écoute plutôt que la précipitation",
  3: "misez sur la créativité, les rencontres et la communication de vos idées",
  4: "consolidez vos bases, structurez votre budget et avancez avec méthode",
  5: "restez souple face aux changements et osez les déplacements ou les opportunités nouvelles",
  6: "consacrez du temps au foyer, à vos proches et aux engagements qui comptent",
  7: "ménagez des temps de retrait, d'étude et de réflexion avant de décider",
  8: "concentrez-vous sur les résultats concrets, la gestion et les négociations importantes",
  9: "terminez ce qui doit l'être, faites le tri et préparez calmement le prochain cycle",
};

export interface TraitSet { qualities: string[]; flaws: string[]; domains: string[] }

export const NUM_TRAITS: Record<number, TraitSet> = {
  1: { qualities: ['Indépendant', 'Pionnier', 'Déterminé', 'Courageux', 'Initiateur', 'Volontaire'], flaws: ['Égocentrique', 'Impatient', 'Dominateur', 'Têtu', 'Solitaire', 'Impulsif'], domains: ['Entrepreneuriat', 'Direction', 'Innovation'] },
  2: { qualities: ['Diplomate', 'Coopératif', "À l'écoute", 'Patient', 'Conciliant', 'Délicat'], flaws: ['Hésitant', 'Dépendant', 'Hypersensible', 'Indécis', 'Effacé', 'Rancunier'], domains: ['Médiation', 'Conseil', 'Diplomatie'] },
  3: { qualities: ['Créatif', 'Communicatif', 'Joyeux', 'Expressif', 'Charismatique', 'Optimiste'], flaws: ['Dispersé', 'Superficiel', 'Bavard', 'Théâtral', 'Inconstant', 'Évitant'], domains: ['Communication', 'Arts', 'Enseignement'] },
  4: { qualities: ['Rigoureux', 'Fiable', 'Organisé', 'Persévérant', 'Méthodique', 'Loyal'], flaws: ['Rigide', 'Borné', 'Méfiant', 'Bourreau de travail', 'Pessimiste', 'Obstiné'], domains: ['Ingénierie', 'Gestion', 'Construction'] },
  5: { qualities: ['Adaptable', 'Curieux', 'Libre', 'Polyvalent', 'Aventureux', 'Magnétique'], flaws: ['Instable', 'Impatient', 'Excessif', 'Dispersé', 'Volage', 'Imprudent'], domains: ['Voyage', 'Commerce', 'Médias'] },
  6: { qualities: ['Responsable', 'Protecteur', 'Aimant', 'Harmonieux', 'Généreux', 'Esthète'], flaws: ['Possessif', 'Perfectionniste', 'Envahissant', 'Sacrificiel', 'Moralisateur', 'Anxieux'], domains: ['Santé', 'Éducation', 'Design'] },
  7: { qualities: ['Analytique', 'Introspectif', 'Sage', 'Intuitif', 'Perspicace', "Indépendant d'esprit"], flaws: ['Secret', 'Distant', 'Sceptique', 'Solitaire', 'Critique', 'Mélancolique'], domains: ['Recherche', 'Philosophie', 'Sciences'] },
  8: { qualities: ['Ambitieux', 'Stratège', 'Organisateur', 'Persévérant', 'Charismatique', 'Résilient'], flaws: ['Matérialiste', 'Dominateur', 'Bourreau de travail', 'Impitoyable', 'Orgueilleux', 'Contrôlant'], domains: ['Finance', 'Direction', 'Entrepreneuriat'] },
  9: { qualities: ['Généreux', 'Humaniste', 'Compatissant', 'Idéaliste', 'Tolérant', 'Inspirant'], flaws: ['Dispersé', 'Naïf', 'Détaché', 'Mélancolique', 'Utopiste', 'Sacrificiel'], domains: ['Action humanitaire', 'Arts', 'Enseignement'] },
  11: { qualities: ['Intuitif', 'Inspirant', 'Visionnaire', 'Sensible', 'Idéaliste', 'Charismatique'], flaws: ['Nerveux', 'Anxieux', 'Irréaliste', 'Hypersensible', 'Tendu', 'Inconstant'], domains: ['Spiritualité', 'Arts', 'Conseil'] },
  22: { qualities: ['Bâtisseur', 'Visionnaire', 'Pragmatique', 'Puissant', 'Discipliné', 'Fédérateur'], flaws: ['Surmené', 'Exigeant', 'Autoritaire', 'Anxieux', 'Perfectionniste', 'Écrasé par la pression'], domains: ['Architecture', 'Grands projets', 'Direction'] },
  33: { qualities: ['Dévoué', 'Bienveillant', 'Guérisseur', 'Pédagogue', 'Lumineux', 'Protecteur'], flaws: ['Sacrificiel', 'Surchargé', 'Idéaliste', 'Tendance au martyre', 'Hypersensible', 'Perfectionniste'], domains: ['Soin', 'Enseignement', 'Action humanitaire'] },
};
