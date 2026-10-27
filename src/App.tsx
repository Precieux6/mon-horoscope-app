import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Heart, Briefcase, Wallet, Activity, Calendar, Search, 
  Star, Award, CheckCircle2, Info, TrendingUp, Compass, Gift
} from 'lucide-react';

// ============================================================================
// BASE DE DONNÉES ASTROLOGIQUE (12 SIGNES DU ZODIAQUE)
// ============================================================================

const ZODIAC_SIGNS = [
  { id: 'belier', name: 'Bélier', symbol: '♈', dates: '21 mars - 19 avril', element: 'Feu', planet: 'Mars', color: 'from-rose-500 to-amber-500' },
  { id: 'taureau', name: 'Taureau', symbol: '♉', dates: '20 avril - 20 mai', element: 'Terre', planet: 'Vénus', color: 'from-emerald-500 to-teal-600' },
  { id: 'gemeaux', name: 'Gémeaux', symbol: '♊', dates: '21 mai - 20 juin', element: 'Air', planet: 'Mercure', color: 'from-sky-400 to-indigo-500' },
  { id: 'cancer', name: 'Cancer', symbol: '♋', dates: '21 juin - 22 juillet', element: 'Eau', planet: 'Lune', color: 'from-indigo-400 to-purple-500' },
  { id: 'lion', name: 'Lion', symbol: '♌', dates: '23 juillet - 22 août', element: 'Feu', planet: 'Soleil', color: 'from-amber-400 to-orange-600' },
  { id: 'vierge', name: 'Vierge', symbol: '♍', dates: '23 août - 22 septembre', element: 'Terre', planet: 'Mercure', color: 'from-teal-500 to-emerald-600' },
  { id: 'balance', name: 'Balance', symbol: '♎', dates: '23 septembre - 22 octobre', element: 'Air', planet: 'Vénus', color: 'from-pink-400 to-rose-500' },
  { id: 'scorpion', name: 'Scorpion', symbol: '♏', dates: '23 octobre - 21 novembre', element: 'Eau', planet: 'Pluton', color: 'from-purple-600 to-indigo-900' },
  { id: 'sagittaire', name: 'Sagittaire', symbol: '♐', dates: '22 novembre - 21 décembre', element: 'Feu', planet: 'Jupiter', color: 'from-violet-500 to-purple-700' },
  { id: 'capricorne', name: 'Capricorne', symbol: '♑', dates: '22 décembre - 19 janvier', element: 'Terre', planet: 'Saturne', color: 'from-slate-600 to-slate-800' },
  { id: 'verseau', name: 'Verseau', symbol: '♒', dates: '20 janvier - 18 février', element: 'Air', planet: 'Uranus', color: 'from-cyan-400 to-blue-600' },
  { id: 'poissons', name: 'Poissons', symbol: '♓', dates: '19 février - 20 mars', element: 'Eau', planet: 'Neptune', color: 'from-blue-400 to-indigo-600' }
];

const getZodiacSignFromDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_SIGNS[0];
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_SIGNS[1];
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_SIGNS[2];
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_SIGNS[3];
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_SIGNS[4];
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_SIGNS[5];
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_SIGNS[6];
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_SIGNS[7];
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC_SIGNS[8];
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIAC_SIGNS[9];
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_SIGNS[10];
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return ZODIAC_SIGNS[11];
  return ZODIAC_SIGNS[0];
};

const COMPLETE_PROFILES_DATABASE = {
  belier: {
    qualities: ["Audacieux", "Passionné", "Franc", "Pionnier", "Énergique", "Leader naturel", "Généreux", "Spontané", "Déterminé", "Optimiste"],
    flaws: ["Impulsif", "Impatient", "Autoritaire", "Têtu", "Téméraire", "Susceptible", "Compétitif", "Individualiste", "Direct à l'excès", "Imprévisible"],
    anecdotes: [
      "Le Bélier est souvent la première personne à se porter volontaire dans les défis impossibles.",
      "Il préfère l'action immédiate aux longues négociations théoriques interminables.",
      "Sa franchise directe et naturelle est souvent perçue comme une fraîcheur revigorante.",
      "Possède la faculté unique de se relever en un temps record après un revers important.",
      "S'ennuie très rapidement si ses projets ne bougent pas à un rythme effréné."
    ],
    talents: ["Prise de décision ultra-rapide sous haute pression", "Capacité à impulsions et démarrer de zéro", "Inspiration d'enthousiasme chez les collaborateurs", "Courage face aux incertitudes majeures", "Réactivité physique et mentale instantanée"],
    excellenceDomains: ["Entrepreneuriat", "Gestion de crise", "Sport de compétition", "Management stratégique", "Innovation disruptive", "Chirurgie & Urgences", "Vente & Négociation", "Aéronautique", "Arts martiaux", "Lancement de startups"]
  },
  taureau: {
    qualities: ["Loyal", "Patient", "Pragmatique", "Fiable", "Persévérant", "Épicurien", "Calme", "Protecteur", "Rationnel", "Méthodique"],
    flaws: ["Rancunier", "Possessif", "Têtu", "Réticent aux changements", "Matérialiste", "Rigide", "Lent au démarrage", "Gourmand excessif", "Indulgent", "Méfiant"],
    anecdotes: [
      "Il peut se souvenir exactement du goût d'un repas partagé il y a plus de 10 ans.",
      "Sa loyauté amicale est solide comme un roc : un ami Taureau l'est pour la vie entière.",
      "Ne bousculez jamais son rituel du matin sous peine de rompre sa sérénité.",
      "A un instinct naturel infaillible pour dénicher les vraies bonnes affaires de valeur.",
      "Sa colère est rarissime mais quand elle éclate, elle balaye tout sur son passage."
    ],
    talents: ["Gestion budgétaire et sécurisation patrimoniale", "Constance à toute épreuve dans l'effort", "Capacité à matérialiser les idées abstraites", "Sens de l'esthétique et du design tactile", "Maintien du calme au milieu de la panique"],
    excellenceDomains: ["Finance & Banque", "Gastronomie & Oenologie", "Architecture & Design", "Gestion immobilière", "Horticulture & Paysage", "Artisanat d'art", "Musique & Composition", "Ressources Humaines", "Investissement financier", "Patrimoine"]
  },
  gemeaux: {
    qualities: ["Adaptable", "Éloquent", "Curieux", "Vif d'esprit", "Sociable", "Polyvalent", "Enthousiaste", "Perspicace", "Inventif", "Pétillant"],
    flaws: ["Dispersé", "Superficiel", "Indécis", "Nerveux", "Inconstant", "Bavard", "Changeant", "Facilement distrait", "Ironique", "Tendance à procrastiner"],
    anecdotes: [
      "Il peut lire trois livres en même temps tout en écoutant un podcast intéressant.",
      "A la capacité d'engager une conversation captivante avec absolument n'importe qui.",
      "Apprend de nouveaux concepts en une vitesse qui déconcerte souvent son entourage.",
      "Préfère cumuler les expériences plutôt que de s'enfermer dans une routine rigide.",
      "Conserve une jeunesse d'esprit et un regard pétillant toute sa vie durant."
    ],
    talents: ["Synthèse rapide d'informations complexes", "Facilité d'apprentissage des langues", "Improvisation scénique et oratoire", "Création de ponts entre personnes différentes", "Multitâche fluide et efficace"],
    excellenceDomains: ["Journalisme & Médias", "Relations Publiques", "Marketing digital", "Enseignement", "Traduction & Interprétariat", "Développement logiciel", "Commerce international", "Animation & Événementiel", "Rédaction créative", "Médiation"]
  },
  cancer: {
    qualities: ["Intuitif", "Protecteur", "Empathique", "Dévoué", "Créatif", "Sensible", "Attentif", "Loyal", "Plein d'imagination", "Patient affectivement"],
    flaws: ["Susceptible", "Nostalgique", "Possessif", "Changement d'humeur", "Introverti", "Anxieux", "Réticent au risque", "Capricieux", "Protecteur à l'excès", "Dépendant"],
    anecdotes: [
      "Ressent l'ambiance émotionnelle d'une pièce en une fraction de seconde.",
      "Gardera précieusement un simple ticket de cinéma qui lui rappelle un bon souvenir.",
      "Son foyer est son sanctuaire où il aime cuisiner pour les gens qu'il aime.",
      "Si un ami a un problème, il sera le premier sur place avec du réconfort.",
      "Son intuition dépasse très souvent la logique pure dans ses grands choix."
    ],
    talents: ["Instinct protecteur et accompagnement", "Sensibilité artistique et poétique", "Mémoire affective et visuelle remarquable", "Création d'espaces chaleureux et sécurisants", "Écoute bienveillante sans jugement"],
    excellenceDomains: ["Psychologie & Thérapie", "Restauration & Hôtellerie", "Pédiatrie & Soins", "Architecture d'intérieur", "Histoire & Archéologie", "Écriture & Poésie", "Gestion de fondations", "Services à la personne", "Muséologie", "Immobilier résidentiel"]
  },
  lion: {
    qualities: ["Généreux", "Charmant", "Charismatique", "Loyal", "Protecteur", "Ambitieux", "Magnanime", "Créatif", "Sûr de lui", "Chaleureux"],
    flaws: ["Orgueilleux", "Théâtral", "Dominant", "Exigeant", "Centré sur soi", "Têtu", "Sensible au jugement", "Impétueux", "Extravagant", "Intolérant aux fautes"],
    anecdotes: [
      "Aime faire des cadeaux grandioses et voir le sourire sur le visage de ses proches.",
      "Sa présence naturelle attire l'attention même lorsqu'il essaye d'être discret.",
      "Ne supporte pas l'injustice commise envers les personnes plus faibles que lui.",
      "Possède une loyauté absolue vers ceux qui ont gagné sa confiance sincère.",
      "Travaillera sans relâche pour transformer un projet ordinaire en chef-d'œuvre."
    ],
    talents: ["Leadership motivant et inspirant", "Aise naturelle sur scène et en public", "Créativité visuelle et scénique", "Capacité à redonner confiance aux autres", "Gestion de projets d'envergure"],
    excellenceDomains: ["Arts du spectacle", "Direction générale", "Luxe & Haute couture", "Politique & Diplomatie", "Relations publiques", "Production cinématographique", "Mentorat de haut niveau", "Organisation de galas", "Design de marque", "Haut conseil"]
  },
  vierge: {
    qualities: ["Méthodique", "Précis", "Analytique", "Serviable", "Organisé", "Modeste", "Fiable", "Pragmatique", "Réfléchi", "Discret"],
    flaws: ["Perfectionniste", "Critique", "Anxieux", "Réservé", "Rigide", "Tendance au surmenage", "Minutieux à l'excès", "Indécis par analyse", "Inquiet", "Pessimiste"],
    anecdotes: [
      "Remarquera immédiatement la moindre coquille dans un document de cinquante pages.",
      "Possède un système d'organisation personnel que personne d'autre ne peut déchiffrer.",
      "Trouve une grande satisfaction à rendre un service utile et concret à autrui.",
      "Son esprit analyse continuellement comment optimiser chaque processus.",
      "Derrière sa discrétion se cache souvent un érudit aux connaissances impressionnantes."
    ],
    talents: ["Analyse de données et contrôle qualité", "Organisation méthodique optimale", "Détection instantanée des anomalies", "Sens du service et de l'amélioration continue", "Clarté de synthèse dans le détail"],
    excellenceDomains: ["Audit & Contrôle", "Médecine & Recherche", "Comptabilité & Analyse", "Ingénierie informatique", "Gestion de la qualité", "Sciences de données", "Édition & Correction", "Organisation logistique", "Diététique & Santé", "Archivage"]
  },
  balance: {
    qualities: ["Diplomate", "Équitable", "Sociable", "Élégant", "Charmant", "Pacifique", "Empathique", "Coopératif", "Raffiné", "Conciliant"],
    flaws: ["Indécis", "Évite les conflits", "Dépendant", "Influençable", "Superficiel", "Hésitant", "Soucieux du regard d'autrui", "Procrastinateur", "Trop indulgent", "Passif"],
    anecdotes: [
      "Peut passer une heure à peser le pour et le contre pour choisir un menu.",
      "A un don inné pour apaiser une dispute houleuse en trouvant le juste milieu.",
      "L'harmonie esthétique de son environnement influe directement sur son moral.",
      "Préférera s'adapter au souhait du groupe plutôt qu'imposer son choix personnel.",
      "Sa politesse et son tact ouvrent les portes les plus difficiles d'accès."
    ],
    talents: ["Négociation et médiation pacifique", "Sens raffiné de l'esthétique et des couleurs", "Capacité à percevoir tous les points de vue", "Création de partenariats durables", "Savoir-vivre et étiquette sociale"],
    excellenceDomains: ["Droit & Justice", "Médiation d'entreprise", "Diplomatie", "Design & Mode", "Conseil en image", "Relations internationales", "Ressources Humaines", "Coaching relationnel", "Muséographie", "Galerie d'art"]
  },
  scorpion: {
    qualities: ["Intense", "Passionné", "Perspicace", "Déterminé", "Loyal", "Magnétique", "Courageux", "Intuitif", "Ressource", "Profond"],
    flaws: ["Méfiant", "Rancunier", "Possessif", "Secret", "Impérieux", "Jaloux", "Intransigeant", "Partisan du tout ou rien", "Manipulateur", "Extrême"],
    anecdotes: [
      "Détecte les mensonges et les omissions en un simple regard attentif.",
      "Conserve ses secrets les plus chers sous une carapace impénétrable.",
      "Quand il s'investit dans une cause, il y met son âme entière sans retenue.",
      "Capacité légendaire à se régénérer après les pires épreuves de l'existence.",
      "Préfère une vérité qui blesse mais franche à un mensonge réconfortant."
    ],
    talents: ["Investigation et recherche approfondie", "Psychologie et détection des motivations", "Gestion de situations extrêmes et critiques", "Capacité de transformation personnelle", "Stratégie secrète et analyse complexe"],
    excellenceDomains: ["Psychiatrie & Psychanalyse", "Criminologie & Enquête", "Chirurgie spécialisée", "Cybersécurité", "Investissement en Capital-Risque", "Recherche scientifique", "Astrophysique", "Gestion de crises majeures", "Stratégie militaire", "Négociation complexe"]
  },
  sagittaire: {
    qualities: ["Optimiste", "Enthousiaste", "Chaleureux", "Philosophe", "Franc", "Indépendant", "Généreux", "Aventurier", "Visionnaire", "Tolérant"],
    flaws: ["Imprudent", "Direct à l'excès", "Impatient", "Promet trop", "Nerveux", "Dispersé", "Moralisateur", "Peur de l'engagement", "Inconstant", "Sans filtre"],
    anecdotes: [
      "Est toujours prêt à faire sa valise en cinq minutes pour une aventure imprévue.",
      "Son optimisme est tellement communicatif qu'il remonte le moral de tout un groupe.",
      "Aime débattre de philosophie, de voyages et de grands concepts jusqu'à l'aube.",
      "Dit exactement ce qu'il pense sans aucune mauvaise intention sous-jacente.",
      "A besoin d'espace et d'indépendance pour s'épanouir pleinement dans son travail."
    ],
    talents: ["Vision globale et réflexion stratégique", "Transmissions de connaissances et enseignement", "Adaptation instantanée aux cultures étrangères", "Enthousiasme communicatif contagieux", "Découverte d'opportunités d'avenir"],
    excellenceDomains: ["Enseignement supérieur", "Tourisme & Exploration", "Édition & Philosophie", "Commerce international", "Diplomatie culturelle", "Sports d'aventure", "Coaching de vie", "Traduction universelle", "Droit international", "Conférences"]
  },
  capricorne: {
    qualities: ["Ambitieux", "Discipliné", "Pragmatique", "Patient", "Prévoyant", "Labeur", "Responsable", "Intègre", "Méthodique", "Persévérant"],
    flaws: ["Austère", "Pessimiste", "Rigide", "Distanciation affective", "Perfectionniste", "Méfiance", "Travailleur compulsif", "Rancunier", "Sévère", "Réticent aux plaisirs"],
    anecdotes: [
      "Planifie souvent sa trajectoire professionnelle avec 10 ans d'avance.",
      "Son humour est d'une finesse et d'un second degré irrésistibles quand il se détend.",
      "Préfère la qualité durable et intemporelle aux tendances passagères.",
      "Plus il vieillit, plus il apprend à profiter sereinement de la vie.",
      "Est le pilier inébranlable sur lequel toute sa famille peut s'appuyer."
    ],
    talents: ["Planification stratégique sur le très long terme", "Endurance exceptionnelle face à l'effort", "Gestion rigoureuse des ressources et institutions", "Sang-froid inaltérable dans les crises", "Incorruptibilité et intégrité"],
    excellenceDomains: ["Direction d'entreprise", "Administration publique", "Bâtiment & Travaux Publics", "Ingénierie civile", "Finance & Comptabilité", "Gestion de fonds", "Politique économique", "Enseignement classique", "Architecture", "Haute magistrature"]
  },
  verseau: {
    qualities: ["Innovateur", "Humaniste", "Indépendant", "Original", "Visionnaire", "Fraternel", "Altruiste", "Intelligent", "Créatif", "Tolérant"],
    flaws: ["Détaché", "Imprévisible", "Entêté dans ses idées", "Rebelle sans cause", "Utopique", "Froid en apparence", "Individualiste", "Paradoxal", "Réticent au cadre", "Iconoclaste"],
    anecdotes: [
      "Pense souvent à des solutions innovantes que le monde ne comprendra que dans 5 ans.",
      "Accorde une valeur suprême à ses amitiés et à sa liberté d'esprit.",
      "Ne fera jamais quelque chose uniquement parce que 'ça s'est toujours fait ainsi'.",
      "Peut paraître distant tout en se passionnant pour le bien-être de l'humanité entière.",
      "Adore casser les codes et surprendre là où on ne l'attend absolument pas."
    ],
    talents: ["Anticipation des tendances futures", "Conception de systèmes disruptifs", "Fédération de communautés diverses", "Créativité technologique et conceptuelle", "Esprit critique indépendant des dogmes"],
    excellenceDomains: ["Technologies avancées", "Aéronautique & Espace", "Sciences de l'environnement", "Sociologie & Recherche", "Intelligence Artificielle", "Action humanitaire", "Ingénierie réseau", "Invention & Brevets", "Mouvements citoyens", "E-Sport"]
  },
  poissons: {
    qualities: ["Empathique", "Intuitif", "Créatif", "Inspiré", "Généreux", "Compassionnel", "Dévoué", "Artiste", "Doux", "Rêveur"],
    flaws: ["Hypersensible", "Idéaliste", "Fuite de la réalité", "Influençable", "Indécis", "Anxieux", "Tendance au sacrifice", "Désordonné", "Confus", "Nostalgique"],
    anecdotes: [
      "Son monde intérieur est une source inépuisable d'histoires et de création.",
      "Ressent tellement la peine d'autrui qu'il fait tout pour essayer de la soulager.",
      "Ses rêves nocturnes lui apportent parfois des réponses claires à ses interrogations.",
      "S'épanouit pleinement au contact de la musique, de la mer et de la poésie.",
      "Possède une sagesse émotionnelle qui surprend ceux qui ne voient que son côté rêveur."
    ],
    talents: ["Inspiration artistique et musicale illimitée", "Compréhension empathique instantanée", "Adaptabilité fluide aux environnements", "Facilité pour la méditation et le soin", "Imagination narrative et poétique"],
    excellenceDomains: ["Musique & Composition", "Cinéma & Réalisation", "Psychologie & Soins palliatifs", "Poésie & Littérature", "Thérapies holistiques", "Bénévolat & Humanitaire", "Océanographie", "Arts visuels", "Danse & Expression corporelle", "Coaching spirituel"]
  }
};

const getProfileForSign = (sign) => {
  return COMPLETE_PROFILES_DATABASE[sign.id] || COMPLETE_PROFILES_DATABASE.belier;
};

// ============================================================================
// GENERATEURS DETERMINISTES
// ============================================================================

const getDailyHash = (signId, dateStr) => {
  let hash = 0;
  const str = signId + "_" + dateStr;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const HOROSCOPE_TEXT_DATABASE = {
  amour: [
    "Vénus accentue la douceur de vos échanges affectifs aujourd'hui. En couple, l'écoute mutuelle permettra de dénouer un léger malentendu récent. Pour les célibataires, une rencontre imprévue au détour d'une activité habituelle pourrait éveiller une vive curiosité.",
    "Un vent de passion souffle sur votre ciel sentimental. Les moments partagés avec votre partenaire seront emprunts de complicité et de sensualité. Si vous cherchez l'amour, vos charmes naturels seront particulièrement efficaces.",
    "Les alignements planétaires favorisent la clarté et l'harmonie amoureuse. C'est la journée idéale pour aborder sereinement les sujets profonds et clarifier vos attentes mutuelles.",
    "Votre sensibilité amoureuse est décuplée sous l'influence lunaire favorable. Vous saurez apporter le réconfort et l'attention nécessaires à l'épanouissement de votre relation."
  ],
  travail: [
    "Mercure stimule votre acuité intellectuelle et votre efficacité au travail. Vos propositions lors des réunions retiendront l'attention de vos supérieurs ou partenaires.",
    "Votre persévérance porte enfin ses fruits et débloque un projet en attente. Vous saurez faire preuve d'un leadership rassembleur face à des défis méthodologiques.",
    "Une journée dynamique s'annonce sur le plan professionnel avec de belles opportunités d'innovation. Votre créativité et votre réactivité seront vos plus précieux atouts.",
    "L'ambiance de travail est particulièrement collaborative et propice aux synergies. Vous trouverez des solutions originales pour rationaliser votre emploi du temps."
  ],
  argent: [
    "Sur le plan financier, la prudence et la méthode vous permettent de consolider vos acquis. C'est une excellente journée pour réviser votre budget global.",
    "Vos finances affichent une belle stabilité grâce à votre gestion méthodique récente. Une rentrée d'argent inattendue pourrait agréablement vous surprendre.",
    "Les aspects astrologiques incitent à la réflexion stratégique concernant votre patrimoine. C'est le moment opportun pour comparer des contrats.",
    "Gestion équilibrée et opportunités mesurées caractérisent ce secteur aujourd'hui. Vous saurez résister aux sollicitations commerciales superflues."
  ],
  sante: [
    "Votre niveau d'énergie vitale est en nette hausse sous cette configuration astrale stimulante. Pensez à bien vous hydrater tout au long de la journée.",
    "Une très bonne résistance physique générale vous accompagne durant toute cette journée. Privilégiez des repas légers et équilibrés ce soir.",
    "Forme et vitalité sont au rendez-vous, vous vous sentez capable de déplacer des montagnes. Canalisez cet enthousiasme à travers une séance de sport.",
    "Votre capital santé bénéficie d'influences protectrices qui renforcent votre tonus. La pratique de la respiration consciente vous apportera une grande clarté."
  ],
  conseils: [
    "Accordez-vous dix minutes de méditation en début de matinée pour fixer vos intentions calmes.",
    "Exprimez votre gratitude envers une personne qui vous a soutenu discrètement ces derniers temps.",
    "Osez dire non aux demandes abusives pour préserver votre précieux temps personnel.",
    "Faites confiance à votre intuition première avant de vous perdre dans une sur-analyse."
  ]
};

const MONTHLY_TRENDS_DATABASE = {
  amour: [
    "Ce mois-ci, les configurations astrales encouragent la consolidation des liens affectifs et la sincérité dans le dialogue. Une période idéale pour dissiper les non-dits.",
    "Un climat passionnel et constructif enveloppe votre vie sentimentale tout au long de ce mois. Les projets à deux prennent une belle impulsion.",
    "La patience et l'écoute seront vos meilleurs atouts relationnels ce mois-ci pour rééquilibrer l'harmonie et renforcer la complicité au sein de votre couple."
  ],
  travail: [
    "Le mois est marqué par une accélération de vos projets professionnels. Votre capacité d'adaptation fera toute la différence face aux nouveaux défis.",
    "Une période faste pour la reconnaissance de vos efforts passés. Des opportunités d'évolution ou de collaboration stratégique se profilent à l'horizon.",
    "Concentrez-vous sur la structuration à long terme de vos dossiers. Ce mois favorise la rigueur méthodologique et la consolidation de vos acquis."
  ],
  argent: [
    "La gestion de vos finances demande de la prévoyance ce mois-ci. Évitez les investissements impulsifs et privilégiez la constitution d'une épargne de sécurité.",
    "Un mois stable sur le plan pécuniaire, propice à la révision de votre budget et à la planification avisée de vos futurs projets d'investissement.",
    "Des rentrées inattendues ou une opportunité de réaménagement budgétaire allègeront vos charges. Profitez-en pour consolider votre patrimoine."
  ],
  sante: [
    "Votre vitalité est en transition ce mois-ci : veillez à accorder une importance capitale à la qualité de votre sommeil et à une récupération physique régulière.",
    "Un regain d'énergie vous pousse à adopter de nouvelles routines de bien-être plus saines. C'est le moment idéal pour démarrer une activité physique.",
    "L'équilibre mental est au premier plan. Prenez du temps pour vous ressourcer loin du stress quotidien et cultivez la sérénité intérieure."
  ]
};

const generateAutomatedHoroscope = (signId, dateStr) => {
  const hash = getDailyHash(signId, dateStr);
  return {
    amour: { text: HOROSCOPE_TEXT_DATABASE.amour[hash % HOROSCOPE_TEXT_DATABASE.amour.length], score: 70 + (hash % 28) },
    travail: { text: HOROSCOPE_TEXT_DATABASE.travail[(hash >> 2) % HOROSCOPE_TEXT_DATABASE.travail.length], score: 68 + ((hash >> 3) % 30) },
    argent: { text: HOROSCOPE_TEXT_DATABASE.argent[(hash >> 4) % HOROSCOPE_TEXT_DATABASE.argent.length], score: 72 + ((hash >> 5) % 26) },
    sante: { text: HOROSCOPE_TEXT_DATABASE.sante[(hash >> 6) % HOROSCOPE_TEXT_DATABASE.sante.length], score: 75 + ((hash >> 7) % 23) },
    conseil: HOROSCOPE_TEXT_DATABASE.conseils[(hash >> 8) % HOROSCOPE_TEXT_DATABASE.conseils.length]
  };
};

const generateMonthlyTrends = (signId, yearMonthStr) => {
  let hash = 0;
  const str = signId + "_" + yearMonthStr;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  hash = Math.abs(hash);

  return {
    amour: MONTHLY_TRENDS_DATABASE.amour[hash % MONTHLY_TRENDS_DATABASE.amour.length],
    travail: MONTHLY_TRENDS_DATABASE.travail[(hash >> 1) % MONTHLY_TRENDS_DATABASE.travail.length],
    argent: MONTHLY_TRENDS_DATABASE.argent[(hash >> 2) % MONTHLY_TRENDS_DATABASE.argent.length],
    sante: MONTHLY_TRENDS_DATABASE.sante[(hash >> 3) % MONTHLY_TRENDS_DATABASE.sante.length],
  };
};

// ============================================================================
// COMPOSANT PRINCIPAL (RESPONSIVE & MOBILE-FIRST)
// ============================================================================

export default function App() {
  const [activeTab, setActiveTab] = useState('horoscope');
  const [selectedSign, setSelectedSign] = useState(ZODIAC_SIGNS[0]);
  
  const [birthdateInput, setBirthdateInput] = useState('1995-07-23');
  const [searchedProfile, setSearchedProfile] = useState(null);

  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);
  const yearMonthISO = useMemo(() => todayISO.slice(0, 7), [todayISO]);
  
  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }, []);

  const monthFormatted = useMemo(() => {
    return new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }, []);

  const currentHoroscope = useMemo(() => {
    return generateAutomatedHoroscope(selectedSign.id, todayISO);
  }, [selectedSign, todayISO]);

  const currentMonthlyTrends = useMemo(() => {
    return generateMonthlyTrends(selectedSign.id, yearMonthISO);
  }, [selectedSign, yearMonthISO]);

  useEffect(() => {
    if (birthdateInput) {
      const sign = getZodiacSignFromDate(birthdateInput);
      if (sign) setSearchedProfile({ sign, ...getProfileForSign(sign) });
    }
  }, []);

  const handleProfileSearch = (e) => {
    e.preventDefault();
    if (!birthdateInput) return;
    const sign = getZodiacSignFromDate(birthdateInput);
    if (sign) setSearchedProfile({ sign, ...getProfileForSign(sign) });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-24 sm:pb-12 flex flex-col selection:bg-purple-200 selection:text-purple-900 overflow-x-hidden">
      
      {/* HEADER FIXE */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 flex items-center justify-center text-white shadow-md shadow-purple-200">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-900 bg-clip-text text-transparent tracking-tight">
                  ASTRAEA
                </h1>
                <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full font-bold uppercase">
                  SaaS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden md:block">
                Astrologie Quotidienne & Mensuelle
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('horoscope')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'horoscope' ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles size={15} className={activeTab === 'horoscope' ? 'text-purple-600' : ''} />
              <span>Horoscope</span>
            </button>

            <button
              onClick={() => setActiveTab('mensuel')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'mensuel' ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp size={15} className={activeTab === 'mensuel' ? 'text-purple-600' : ''} />
              <span>Tendances mensuelles</span>
            </button>

            <button
              onClick={() => setActiveTab('profiler')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'profiler' ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search size={15} className={activeTab === 'profiler' ? 'text-purple-600' : ''} />
              <span>Mon Profil</span>
            </button>
          </nav>

          <div className="text-right hidden lg:block">
            <p className="text-xs font-bold text-slate-700">{todayFormatted}</p>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
              <CheckCircle2 size={12} /> En ligne
            </p>
          </div>

        </div>
      </header>

      {/* CONTENEUR PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-8 flex-1 w-full">

        {/* ONGLET 1 : HOROSCOPE DU JOUR */}
        {activeTab === 'horoscope' && (
          <div className="space-y-4 sm:space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-3xl mx-auto space-y-1 sm:space-y-2">
              <h2 className="text-xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Mon horoscope au quotidien
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
                Analyse détaillée pour le {todayFormatted}.
              </p>
            </div>

            <div className="bg-white p-3 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Choisissez votre signe :
                </p>
                <span className="text-xs text-purple-700 font-semibold">
                  Actif : <strong className="text-slate-900">{selectedSign.name}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {ZODIAC_SIGNS.map((sign) => {
                  const isSelected = selectedSign.id === sign.id;
                  return (
                    <button
                      key={sign.id}
                      onClick={() => setSelectedSign(sign)}
                      className={`flex items-center gap-2.5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl transition duration-200 border text-left group ${
                        isSelected
                          ? 'bg-purple-50 border-purple-500 text-purple-900 shadow-xs ring-2 ring-purple-500/20'
                          : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl shrink-0">{sign.symbol}</span>
                      <div className="overflow-hidden min-w-0">
                        <p className="text-xs font-bold truncate">{sign.name}</p>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">{sign.element}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md border border-slate-200 overflow-hidden space-y-4 sm:space-y-6">
              
              <div className={`bg-gradient-to-r ${selectedSign.color} text-white p-4 sm:p-8 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left`}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center text-4xl sm:text-5xl border border-white/20 shadow-inner shrink-0">
                  {selectedSign.symbol}
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{selectedSign.name}</h3>
                  <p className="text-white/90 text-xs sm:text-sm mt-0.5 font-medium">{selectedSign.dates} • Élément {selectedSign.element}</p>
                  <p className="text-xs text-white/80 mt-0.5">Gouverné par <strong className="text-white">{selectedSign.planet}</strong></p>
                </div>
              </div>

              <div className="p-4 sm:p-8 space-y-4 sm:space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  
                  <div className="bg-rose-50/40 border border-rose-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-rose-100 text-rose-700 rounded-xl"><Heart size={18} /></div>
                        <h4 className="text-sm sm:text-base font-bold text-rose-950">Amour & relations</h4>
                      </div>
                      <span className="text-xs font-extrabold bg-rose-100 text-rose-900 px-2.5 py-0.5 rounded-full">{currentHoroscope.amour.score}%</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{currentHoroscope.amour.text}</p>
                  </div>

                  <div className="bg-sky-50/40 border border-sky-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-sky-100 text-sky-700 rounded-xl"><Briefcase size={18} /></div>
                        <h4 className="text-sm sm:text-base font-bold text-sky-950">Travail & carrière</h4>
                      </div>
                      <span className="text-xs font-extrabold bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-full">{currentHoroscope.travail.score}%</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{currentHoroscope.travail.text}</p>
                  </div>

                  <div className="bg-emerald-50/40 border border-emerald-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl"><Wallet size={18} /></div>
                        <h4 className="text-sm sm:text-base font-bold text-emerald-950">Argent & finances</h4>
                      </div>
                      <span className="text-xs font-extrabold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">{currentHoroscope.argent.score}%</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{currentHoroscope.argent.text}</p>
                  </div>

                  <div className="bg-amber-50/40 border border-amber-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-amber-100 text-amber-800 rounded-xl"><Activity size={18} /></div>
                        <h4 className="text-sm sm:text-base font-bold text-amber-950">Santé & vitalité</h4>
                      </div>
                      <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">{currentHoroscope.sante.score}%</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{currentHoroscope.sante.text}</p>
                  </div>

                </div>

                <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-lg shrink-0">💡</div>
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase tracking-widest block">Conseil du Jour</span>
                      <p className="text-xs sm:text-base italic text-purple-100 mt-0.5">"{currentHoroscope.conseil}"</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ONGLET 2 : TENDANCES MENSUELLES */}
        {activeTab === 'mensuel' && (
          <div className="space-y-4 sm:space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-3xl mx-auto space-y-1 sm:space-y-2">
              <h2 className="text-xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Tendances mensuelles
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
                Bilan global pour le mois de <strong className="text-purple-800 capitalize">{monthFormatted}</strong>.
              </p>
            </div>

            <div className="bg-white p-3 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Choisissez votre signe :
                </p>
                <span className="text-xs text-purple-700 font-semibold">
                  Actif : <strong className="text-slate-900">{selectedSign.name}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {ZODIAC_SIGNS.map((sign) => {
                  const isSelected = selectedSign.id === sign.id;
                  return (
                    <button
                      key={sign.id}
                      onClick={() => setSelectedSign(sign)}
                      className={`flex items-center gap-2.5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl transition duration-200 border text-left group ${
                        isSelected
                          ? 'bg-purple-50 border-purple-500 text-purple-900 shadow-xs ring-2 ring-purple-500/20'
                          : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl shrink-0">{sign.symbol}</span>
                      <div className="overflow-hidden min-w-0">
                        <p className="text-xs font-bold truncate">{sign.name}</p>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">{sign.element}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md border border-slate-200 overflow-hidden space-y-4 sm:space-y-6">
              
              <div className={`bg-gradient-to-r ${selectedSign.color} text-white p-4 sm:p-8 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left`}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center text-4xl sm:text-5xl border border-white/20 shadow-inner shrink-0">
                  {selectedSign.symbol}
                </div>
                <div>
                  <span className="text-[10px] uppercase bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Bilan de {monthFormatted}</span>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">{selectedSign.name}</h3>
                  <p className="text-white/90 text-xs sm:text-sm mt-0.5 font-medium">{selectedSign.dates} • Élément {selectedSign.element}</p>
                </div>
              </div>

              <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  
                  <div className="bg-rose-50/40 border border-rose-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-rose-100 text-rose-700 rounded-xl"><Heart size={18} /></div>
                      <h4 className="text-sm sm:text-base font-bold text-rose-950">Amour du mois</h4>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{currentMonthlyTrends.amour}</p>
                  </div>

                  <div className="bg-sky-50/40 border border-sky-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-sky-100 text-sky-700 rounded-xl"><Briefcase size={18} /></div>
                      <h4 className="text-sm sm:text-base font-bold text-sky-950">Travail du mois</h4>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{currentMonthlyTrends.travail}</p>
                  </div>

                  <div className="bg-emerald-50/40 border border-emerald-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl"><Wallet size={18} /></div>
                      <h4 className="text-sm sm:text-base font-bold text-emerald-950">Argent du mois</h4>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{currentMonthlyTrends.argent}</p>
                  </div>

                  <div className="bg-amber-50/40 border border-amber-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-amber-100 text-amber-800 rounded-xl"><Activity size={18} /></div>
                      <h4 className="text-sm sm:text-base font-bold text-amber-950">Santé du mois</h4>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{currentMonthlyTrends.sante}</p>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

        {/* ONGLET 3 : PROFILER ASTROLOGIQUE */}
        {activeTab === 'profiler' && (
          <div className="space-y-4 sm:space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-3xl mx-auto space-y-1 sm:space-y-2">
              <h2 className="text-xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Profilage Astrologique
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
                Saisissez une date de naissance pour débloquer votre bilan complet.
              </p>
            </div>

            <div className="max-w-xl mx-auto bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200">
              <form onSubmit={handleProfileSearch} className="space-y-3">
                <label className="block text-[10px] sm:text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Date de naissance :
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <input
                      type="date"
                      required
                      value={birthdateInput}
                      onChange={(e) => setBirthdateInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-300 focus:ring-2 focus:ring-purple-600 text-xs sm:text-sm outline-none"
                    />
                    <Calendar className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  </div>
                  <button type="submit" className="bg-purple-800 hover:bg-purple-900 text-white font-bold px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition flex items-center justify-center gap-2 text-xs sm:text-sm">
                    <Search size={16} /> Calculer
                  </button>
                </div>
              </form>
            </div>

            {searchedProfile && (
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md border border-slate-200 p-4 sm:p-8 space-y-6 sm:space-y-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 bg-purple-50 rounded-2xl sm:rounded-3xl border border-purple-100 text-center sm:text-left">
                  <div className="flex items-center gap-4 flex-col sm:flex-row">
                    <span className="text-5xl sm:text-6xl">{searchedProfile.sign.symbol}</span>
                    <div>
                      <span className="text-[10px] sm:text-xs font-extrabold text-purple-700 uppercase">Signe Calculé</span>
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{searchedProfile.sign.name}</h3>
                      <p className="text-xs text-slate-500">{searchedProfile.sign.dates} • Élément {searchedProfile.sign.element}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
                    <h4 className="text-emerald-950 font-bold text-sm sm:text-base flex items-center gap-2">
                      <Award className="text-emerald-600" size={18} /> Top 10 des qualités
                    </h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {searchedProfile.qualities.map((item, idx) => (
                        <span key={idx} className="bg-white border border-emerald-200 text-emerald-900 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-lg sm:rounded-xl">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50/50 border border-amber-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
                    <h4 className="text-amber-950 font-bold text-sm sm:text-base flex items-center gap-2">
                      <Info className="text-amber-600" size={18} /> Top 10 des défauts
                    </h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {searchedProfile.flaws.map((item, idx) => (
                        <span key={idx} className="bg-white border border-amber-200 text-amber-900 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-lg sm:rounded-xl">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-purple-50/50 border border-purple-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
                    <h4 className="text-purple-950 font-bold text-sm sm:text-base flex items-center gap-2">
                      <Gift className="text-purple-600" size={18} /> 5 talents cachés
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                      {searchedProfile.talents.map((talent, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-purple-100">
                          <span className="w-4 h-4 rounded-full bg-purple-200 text-purple-900 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-slate-800">{talent}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
                    <h4 className="text-indigo-950 font-bold text-sm sm:text-base flex items-center gap-2">
                      <Compass className="text-indigo-600" size={18} /> 5 anecdotes particulières
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                      {searchedProfile.anecdotes.map((anecdote, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-indigo-100">
                          <span className="w-4 h-4 rounded-full bg-indigo-200 text-indigo-900 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-slate-800">{anecdote}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
                  <h4 className="text-slate-900 font-bold text-sm sm:text-base flex items-center gap-2">
                    <Star size={18} className="text-amber-500 fill-amber-500" /> Domaines d'excellence
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {searchedProfile.excellenceDomains.map((domain, idx) => (
                      <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 text-center font-bold text-[11px] sm:text-xs text-slate-800">
                        {domain}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* BARRE DE NAVIGATION BOTTOM MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 md:hidden px-3 py-2 shadow-lg">
        <div className="grid grid-cols-3 gap-1 max-w-md mx-auto">
          
          <button
            onClick={() => setActiveTab('horoscope')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition ${
              activeTab === 'horoscope' ? 'text-purple-800 bg-purple-50' : 'text-slate-500'
            }`}
          >
            <Sparkles size={18} className="mb-0.5" />
            <span>Horoscope</span>
          </button>

          <button
            onClick={() => setActiveTab('mensuel')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition ${
              activeTab === 'mensuel' ? 'text-purple-800 bg-purple-50' : 'text-slate-500'
            }`}
          >
            <TrendingUp size={18} className="mb-0.5" />
            <span>Tendances</span>
          </button>

          <button
            onClick={() => setActiveTab('profiler')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition ${
              activeTab === 'profiler' ? 'text-purple-800 bg-purple-50' : 'text-slate-500'
            }`}
          >
            <Search size={18} className="mb-0.5" />
            <span>Mon Profil</span>
          </button>

        </div>
      </div>

    </div>
  );
}
