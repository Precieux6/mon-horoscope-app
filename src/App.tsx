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
// GENERATEURS DÉTERMINISTES
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
