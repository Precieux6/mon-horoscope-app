import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Heart, Briefcase, Wallet, Activity, Calendar, Search, 
  Star, Award, CheckCircle2, Info, TrendingUp, Compass, Gift, ExternalLink
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
// BASES DE TEXTES QUOTIDIENS ÉLARGIES (12 TEXTES UNIQUES DE 3 À 4 PHRASES)
// ============================================================================

const DAILY_TEXTS = {
  amour: [
    "Vénus accentue la douceur de vos échanges affectifs aujourd'hui. En couple, l'écoute mutuelle permettra de dénouer un léger malentendu récent. Pour les célibataires, une rencontre imprévue au détour d'une activité habituelle pourrait éveiller une vive curiosité.",
    "Un vent de passion souffle sur votre ciel sentimental dès les premières lueurs du jour. Les moments partagés avec votre partenaire seront empreints de complicité et de sensualité pure. Si vous cherchez l'amour, vos charmes naturels se révèleront particulièrement redoutables.",
    "Les alignements planétaires favorisent grandement la clarté et l'harmonie amoureuse. C'est la journée idéale pour aborder sereinement les sujets profonds et clarifier vos attentes mutuelles. Votre cœur s'ouvre à de nouvelles perspectives relationnelles réjouissantes.",
    "Votre sensibilité affective est décuplée sous une influence astrale très bienveillante. Vous saurez apporter le réconfort et l'attention indispensables à l'épanouissement de votre partenaire. Osez exprimer vos sentiments les plus sincères sans aucune hésitation.",
    "Le dialogue constructif est mis à l'honneur dans votre sphère intime aujourd'hui. Vos projets à deux reçoivent des ondes positives très encourageantes pour l'avenir. Profitez de cette belle énergie pour raviver la flamme de la complicité.",
    "Une atmosphère de tendresse inattendue enveloppe votre vie sentimentale au quotidien. Si des tensions existaient, elles se dissipent naturellement grâce à votre empathie. Les célibataires pourraient vivre un coup de cœur mémorable et inspirant.",
    "L'audace relationnelle est récompensée par des retours affectifs très chaleureux. Prenez l'initiative d'organiser une soirée privilégiée avec l'élu de votre cœur. Votre pouvoir de séduction atteint des sommets qu'il serait dommage d'ignorer.",
    "La journée invite à l'introspection romantique pour mieux comprendre vos désirs profonds. En couple, la complicité s'approfondit à travers des rires partagés et des projets simples. Laissez parler votre intuition première pour guider vos élans du cœur.",
    "De belles surprises émotionnelles illuminent votre journée sur le plan du cœur. Votre bienveillance naturelle attire des ondes affectives hautement constructives. Savourez pleinement chaque instant de douceur partagée avec les vôtres.",
    "Les astres vous incitent à lâcher prise sur vos exigences relationnelles excessives. Acceptez l'autre dans sa différence pour cultiver une paix intérieure durable. Une belle nouvelle conversation renforcera l'amour et la confiance mutuelle.",
    "La passion s'invite dans votre quotidien amoureux avec une intensité remarquable. Exprimez haut et fort ce que vous ressentez au fond de votre âme. Votre partenaire saura se montrer à la hauteur de vos attentes les plus chères.",
    "Un climat de sérénité et de complicité profonde embellit votre journée sentimentale. Profitez de ce répit astral pour consolider vos liens affectifs essentiels. La simplicité sera la clé de votre bonheur relationnel aujourd'hui."
  ],
  travail: [
    "Mercure stimule activement votre acuité intellectuelle et votre efficacité professionnelle. Vos propositions lors des réunions retiendront l'attention de vos supérieurs. C'est le moment idéal pour concrétiser des dossiers importants.",
    "Votre persévérance porte enfin ses fruits et débloque un projet bloqué depuis longtemps. Vous saurez faire preuve d'un leadership rassembleur face à des défis méthodologiques. Vos efforts soutenus sont enfin reconnus à leur juste valeur.",
    "Une journée très dynamique s'annonce sur le plan professionnel et carrieriste. Votre créativité débordante et votre réactivité immédiate seront vos meilleurs atouts. N'hésitez pas à porter des innovations audacieuses.",
    "L'ambiance au bureau est particulièrement collaborative et propice aux synergies efficaces. Vous trouverez des solutions originales pour rationaliser votre emploi du temps chargé. Votre rigueur fait l'unanimité auprès de vos collègues.",
    "Des opportunités inattendues se présentent dans votre sphère professionnelle aujourd'hui. Restez à l'affût des moindres signaux pour positionner vos pions stratégiquement. Votre intuition d'entrepreneur fera des merveilles absolues.",
    "La gestion de vos priorités professionnelles demande une concentration de tous les instants. Ne vous laissez pas disperser par des sollicitations superflues et chronophages. Votre efficacité finale impressionnera votre entourage.",
    "Un vent de nouveauté souffle sur vos activités professionnelles habituelles. Prenez des initiatives calculées pour réorienter un dossier vers le succès. Votre audace sera saluée par les décideurs clés de votre structure.",
    "La journée favorise grandement le travail d'équipe et le partage d'expertises pointues. Vos compétences techniques feront merveille pour résoudre un problème épineux. Restez ouvert aux suggestions constructives de vos pairs.",
    "Une belle reconnaissance hiérarchique vient valider vos efforts passés au travail. Restez fidèle à votre éthique professionnelle et continuez sur cette lancée victorieuse. Vos perspectives d'évolution s'annoncent particulièrement radieuses.",
    "Organisez méthodiquement votre journée pour venir à bout de vos échéances urgentes. Votre concentration infaillible vous permettra d'abattre un travail considérable. Savourez la satisfaction du devoir accompli ce soir.",
    "Les astres favorisent les négociations et la signature de nouveaux accords professionnels. Exposez vos arguments avec clarté, diplomatie et conviction assurée. Le succès est à portée de main si vous osez vous affirmer.",
    "Votre créativité professionnelle trouve un écho extrêmement favorable auprès de votre équipe. C'est le moment idéal pour lancer un nouveau concept novateur. Foncez avec enthousiasme et méthode."
  ],
  argent: [
    "Sur le plan financier, la prudence et la méthode vous permettent de consolider vos acquis. C'est une excellente journée pour réviser et optimiser votre budget global. Anticipez vos dépenses futures pour garder l'esprit totalement serein.",
    "Vos finances affichent une belle stabilité grâce à votre gestion méthodique récente. Une rentrée d'argent inattendue pourrait agréablement venir pimenter votre journée. Profitez de cette aisance passagère pour gâter vos proches.",
    "Les aspects astrologiques incitent à une réflexion stratégique concernant votre patrimoine. C'est le moment opportun pour comparer des contrats et réduire vos charges. Votre sens pratique vous évite des erreurs d'appréciation.",
    "La gestion de votre budget requiert de la vigilance face aux tentations du moment. Résistez aux achats impulsifs qui déséquilibreraient vos comptes bancaires. La modération financière est la clé de votre tranquillité future.",
    "Une opportunité financière intéressante se profile à l'horizon de votre journée. Étudiez minutieusement chaque détail avant de vous engager sur le long terme. Votre perspicacité pécuniaire fera des merveilles.",
    "Vos efforts d'épargne commencent à porter leurs fruits de manière très encourageante. Maintenez cette discipline rigoureuse pour concrétiser vos projets d'avenir. Votre sécurité matérielle se renforce de jour en jour.",
    "Un équilibre monétaire parfait caractérise votre situation financière actuelle. Vous savez exactement où placer vos pions pour faire fructifier vos deniers. Conservez cette belle clairvoyance pragmatique.",
    "Soyez vigilant lors de transactions ou d'achats en ligne effectués ce jour. Prenez le temps de vérifier toutes les garanties avant de valider vos paiements. La prudence est votre meilleure assurance contre les imprévus.",
    "Une rentrée pécuniaire liée à un travail ou un investissement passé se concrétise enfin. De quoi aborder les semaines à venir avec un large sourire aux lèvres. Réinvestissez intelligemment cette somme.",
    "Votre intuition financière est particulièrement affûtée en cette période astrale. Écoutez vos impressions intérieures avant de prendre une décision d'achat majeure. Le bon sens paysan sera votre meilleur conseiller.",
    "Consolidez votre épargne de précaution pour parer à toute éventualité matérielle. Les astres favorisent une gestion économe mais avisée de vos ressources. Votre avenir financier se construit sur des bases solides.",
    "La chance sourit aux audacieux avisés dans le domaine de vos investissements. Analysez les opportunités du marché avec calme et discernement. Votre prospérité matérielle progresse régulièrement."
  ],
  sante: [
    "Votre niveau d'énergie vitale est en nette hausse sous cette configuration astrale stimulante. Pensez à bien vous hydrater tout au long de cette journée active. Une activité physique modérée complètera idéalement votre bien-être.",
    "Une très bonne résistance physique générale vous accompagne durant toute cette journée. Privilégiez des repas légers et équilibrés pour préserver votre légèreté digestive. Votre corps vous remercie pour cette attention bienveillante.",
    "Forme et vitalité sont au rendez-vous, vous vous sentez capable de déplacer des montagnes. Canalisez cet enthousiasme débordant à travers une séance de sport intense. Votre tonus musculaire rayonne de mille feux.",
    "Votre capital santé bénéficie d'influences protectrices qui renforcent votre tonus immunitaire. La pratique de la respiration consciente vous apportera une grande clarté mentale. Accordez-vous des pauses de déconnexion totale.",
    "L'écoute de votre corps doit devenir votre priorité absolue en ce jour. Offrez-vous une nuit de sommeil réparatrice pour recharger vos batteries à bloc. Votre organisme réclame un peu de calme et de douceur.",
    "Un regain de dynamisme physique vous incite à reprendre une activité en plein air. Oxygénez vos poumons au contact de la nature pour chasser le stress accumulé. Votre vitalité retrouvée fait plaisir à voir.",
    "Surveillez votre posture si vous passez des heures prolongées assis à un bureau. Des étirements réguliers soulageront efficacement vos tensions dorsales. Prenez soin de votre anatomie avec rigueur.",
    "L'équilibre entre corps et esprit s'établit harmonieusement grâce aux astres. Pratiquez une activité relaxante comme le yoga ou la méditation guidée. Votre système nerveux vous en sera extrêmement reconnaissant.",
    "Votre tonus est resplendissant et vous communiquez une joie de vivre communicative. Maintenez cette hygiène de vie saine qui constitue votre bouclier protecteur. Profitez de cette forme olympique pour bouger.",
    "Une légère baisse de régime en fin de journée vous invite à lever le pied. Préparez-vous une infusion apaisante et couchez-vous plus tôt que prévu. Le repos est le meilleur des médicaments.",
    "Votre vitalité physique s'accorde magnifiquement avec votre clarté psychologique. C'est le moment idéal pour démarrer une cure de vitamines ou de bien-être. Prenez soin de votre enveloppe corporelle.",
    "L'énergie circule librement en vous, éliminant les toxines et les tensions superflues. Profitez de cette belle dynamique tonique pour accomplir vos objectifs sportifs. Votre corps rayonne d'une santé insolente."
  ],
  conseils: [
    "Accordez-vous dix minutes de méditation en début de matinée pour fixer vos intentions calmes. Cette discipline matinale guidera vos pas vers la sérénité la plus absolue. Restez centré sur l'essentiel en toute circonstance.",
    "Exprimez votre gratitude sincère envers une personne qui vous a soutenu discrètement. Cet élan de générosité du cœur transformera positivement votre journée. Le bonheur se nourrit de ces petits gestes simples.",
    "Osez dire un 'non' ferme et constructif aux demandes abusives de votre entourage. Préservez jalousement votre précieux temps personnel pour vous ressourcer. Votre équilibre mental dépend directement de cette autonomie.",
    "Faites confiance à votre intuition première avant de vous perdre dans une sur-analyse stérile. Votre instinct possède une longueur d'avance que la logique pure ignore. Suivez votre petite voix intérieure.",
    "Cultivez le lâcher-prise face aux petits tracas matériels indépendants de votre volonté. Tout finit toujours par trouver sa juste place au moment opportun. Souriez aux difficultés pour mieux les surmonter.",
    "Prenez le temps d'écouter un proche qui traverse une période de questionnement. Votre écoute bienveillante et sans jugement fera des miracles relationnels. La solidarité humaine est votre plus grande force.",
    "Simplifiez votre environnement immédiat pour clarifier instantanément vos pensées. Le rangement extérieur engendre l'apaisement intérieur. Offrez-vous ce bol d'air salutaire dès aujourd'hui.",
    "Ne remettez pas au lendemain ce que vous pouvez accomplir avec joie dès à présent. L'action immédiate libère l'esprit du poids de la procrastination. Vous vous sentirez tellement plus léger ce soir.",
    "Pratiquez l'auto-compassion et cessez d'être votre propre juge le plus sévère. Vous faites de votre mieux avec les ressources du moment présent. Traitez-vous avec la douceur d'un ami cher.",
    "Ouvrez grand vos yeux face aux petites beautés ordinaires qui peuplent votre quotidien. Un rayon de soleil, un sourire ou un chant d'oiseau suffisent à illuminer l'âme. Émerveillez-vous sans compter.",
    "Affirmez vos convictions intimes avec calme, élégance et une totale assurance. Vous avez le droit d'occuper pleinement votre espace d'expression légitime. Ne vous effacez plus jamais pour plaire.",
    "Offrez-vous un moment de silence absolu, loin des écrans et des bruits parasites. Votre esprit a besoin de cette parenthèse enchantée pour se régénérer. La paix de l'âme commence ici."
  ]
};

// ============================================================================
// SELECTION GARANTIE 100% UNIQUE SANS COLLISION PAR INDEX DE SIGNE
// ============================================================================

const generateAutomatedHoroscope = (signId, dateStr) => {
  const signIndex = ZODIAC_SIGNS.findIndex(s => s.id === signId);
  const safeIndex = signIndex !== -1 ? signIndex : 0;

  let dateHash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    dateHash = (dateHash << 5) - dateHash + dateStr.charCodeAt(i);
    dateHash |= 0;
  }
  dateHash = Math.abs(dateHash);

  const idxAmour = (safeIndex + dateHash) % 12;
  const idxTravail = (safeIndex + dateHash + 3) % 12;
  const idxArgent = (safeIndex + dateHash + 6) % 12;
  const idxSante = (safeIndex + dateHash + 9) % 12;
  const idxConseil = (safeIndex + dateHash + 2) % 12;

  return {
    amour: { text: DAILY_TEXTS.amour[idxAmour], score: 70 + (idxAmour * 2) % 28 },
    travail: { text: DAILY_TEXTS.travail[idxTravail], score: 68 + (idxTravail * 2) % 30 },
    argent: { text: DAILY_TEXTS.argent[idxArgent], score: 72 + (idxArgent * 2) % 26 },
    sante: { text: DAILY_TEXTS.sante[idxSante], score: 75 + (idxSante * 2) % 23 },
    conseil: DAILY_TEXTS.conseils[idxConseil]
  };
};

// ============================================================================
// BASE DE TENDANCES MENSUELLES (TEXTES LONGS 6-10 PHRASES)
// ============================================================================

const MONTHLY_TRENDS_DATABASE = {
  amour: [
    "Ce mois-ci, les configurations astrales encouragent profondément la consolidation des liens affectifs et la sincérité absolue dans le dialogue à deux. C'est une période idéale pour dissiper les non-dits et poser de nouvelles bases relationnelles durables. Si vous êtes engagé dans une relation, la complicité se renforcera à travers des projets communs stimulants. Les astres favorisent également les moments d'introspection romantique, permettant de mieux comprendre les besoins cachés de votre partenaire. Pour les célibataires, le mois s'annonce riche en surprises relationnelles et en rencontres enrichissantes. Ne restez pas retranché dans vos habitudes et sortez de votre zone de confort. Votre charme naturel rayonnera intensément, attirant des personnes partageant vos aspirations profondes. Prenez le temps d'observer avant de vous engager émotionnellement, car la patience sera votre meilleure alliée pour bâtir une histoire solide. En fin de mois, un événement inopiné pourrait transformer positivement votre vision de la vie sentimentale.",
    "Un climat passionnel, constructif et profondément transformateur enveloppe votre vie sentimentale tout au long de ce mois. Les projets à deux prennent une impulsion inattendue, vous poussant à concrétiser des envies longtemps remises à plus tard. Les tensions passées s'estompent pour laisser place à une écoute mutuelle et bienveillante. Si vous traversez une phase de doute, ce mois vous offre l'opportunité de clarifier vos sentiments avec beaucoup de sagesse. Pour les cœurs solitaires, une attirance magnétique pourrait naître dans un cadre professionnel ou culturel. L'audace sera récompensée, alors n'hésitez pas à exprimer clairement vos intentions affectives. Les influences de Vénus garantissent des moments de tendresse inoubliables et un renouveau de la flamme. Veillez toutefois à ne pas imposer un rythme trop effréné à votre partenaire, car chacun a besoin de son espace. Cultivez la tolérance et la spontanéité pour traverser ce cycle astral sous les meilleurs auspices.",
    "La patience, la diplomatie et l'écoute attentive seront vos meilleurs atouts relationnels ce mois-ci pour rééquilibrer l'harmonie. Si des désaccords récents ont fragilisé votre couple, les astres vous invitent à renouer le dialogue avec calme et empathie. C'est le moment privilégié pour pardonner, tourner la page et repartir sur des fondations émotionnelles saines. Les célibataires bénéficieront d'un rayonnement discret mais particulièrement captivant pour les esprits curieux. Plutôt que de multiplier les aventures éphémères, vous rechercherez instinctivement la profondeur et l'authenticité chez l'autre. Les discussions nocturnes et les partages intellectuels nourriront votre besoin de connexion vraie. Votre intuition sera un guide infaillible pour repérer les profils toxiques et vous tourner vers les bonnes personnes. Profitez de cette période pour cultiver l'amour de soi, car c'est en étant bien avec vous-même que vous attirerez l'harmonie durable."
  ],
  travail: [
    "Le mois est marqué par une accélération fulgurante de vos projets professionnels et de vos ambitions personnelles. Votre capacité d'adaptation hors du commun fera toute la différence face aux défis complexes qui se présenteront. C'est le moment idéal pour faire valoir vos compétences, proposer des idées novatrices et impressionner votre hiérarchie. Si vous portez un projet de création ou de reconversion, les planètes alignent leurs énergies pour vous soutenir. Ne craignez pas de prendre des responsabilités supplémentaires, car votre leadership naturel saura mobiliser les équipes autour de vous. Restez toutefois vigilant face au stress et veillez à structurer rigoureusement votre emploi du temps pour éviter l'épuisement. Les collaborations à l'international ou les échanges avec des experts extérieurs s'avéreront extrêmement fructueux. En fin de période, une reconnaissance tangible de vos efforts viendra couronner votre persévérance et valider vos choix stratégiques.",
    "Une période particulièrement faste s'ouvre à vous pour la reconnaissance de vos efforts passés et de votre rigueur au quotidien. Des opportunités d'évolution de carrière, de promotion ou de collaboration stratégique se profilent nettement à l'horizon. Votre créativité technique et votre sens de l'analyse vous permettront de résoudre des situations bloquées depuis des semaines. N'hésitez pas à endosser un rôle de mentor ou de guide auprès de collaborateurs plus juniors, cela valorisera votre expertise. Les négociations salariales ou les revalorisations de contrats bénéficient d'un excellent influx astral. Gardez néanmoins les pieds sur terre et conservez une approche méthodique face aux propositions trop séduisantes en apparence. Votre réputation professionnelle sortira grandie de ce cycle, renforçant durablement votre position sur le marché. C'est le moment idéal pour semer les graines de vos succès futurs à long terme.",
    "Concentrez-vous prioritairement sur la structuration à long terme et la consolidation minutieuse de vos dossiers en cours. Ce mois favorise grandement la rigueur méthodologique, l'apurement des tâches administratives et l'optimisation des processus. Si vous ressentez une certaine lassitude dans vos fonctions actuelles, profitez de ce mois pour réévaluer vos objectifs de carrière. Des formations ou l'apprentissage de nouvelles compétences techniques enrichiront grandement votre profil. Les relations avec vos collègues et supérieurs seront empreintes de constructivité, à condition d'éviter l'entêtement stérile. Cultivez la flexibilité mentale lorsque des imprévus viendront bousculer votre planning initial. Votre persévérance silencieuse finira par porter ses fruits de la manière la plus éclatante qui soit. Restez concentré sur l'excellence de votre travail et ne vous laissez pas distraire par les bruits de couloir."
  ],
  argent: [
    "La gestion de vos finances personnelles demande de la prévoyance et de la lucidité tout au long de ce mois. Évitez absolument les investissements impulsifs dictés par des coups de tête ou des sollicitations commerciales agressives. Privilégiez résolument la constitution ou le renforcement d'une épargne de sécurité face aux incertitudes économiques. C'est un cycle propice à l'audit rigoureux de vos abonnements, dépenses superflues et charges fixes. Si vous envisagez un achat immobilier ou un placement financier d'envergure, prenez le temps de consulter des spécialistes. La modération et la discipline budgétaire d'aujourd'hui garantissent votre sérénité matérielle de demain. Une rentrée d'argent inattendue, liée à un vieux dossier ou un remboursement, pourrait vous inciter à la légèreté : résistez à la tentation du gaspillage. En adoptant une posture de gestionnaire avisé, vous consoliderez durablement votre assise patrimoniale.",
    "Un mois globalement stable sur le plan pécuniaire, particulièrement propice à la révision de votre budget et à la planification avisée. Vous bénéficiez d'une lucidité remarquable pour identifier les placements porteurs et sécuriser vos sources de revenus. Si vous gérez une entreprise ou des finances partagées, la transparence sera la clé pour éviter les malentendus. Une opportunité de diversification de vos revenus pourrait se présenter par le biais d'une activité secondaire ou d'un investissement astucieux. Ne précipitez aucune signature de contrat financier sans avoir lu attentivement chaque ligne des petites clauses. Votre patience sera largement récompensée par une croissance progressive et saine de votre capital. Profitez de cette stabilité pour planifier sereinement vos futurs projets de vie ou voyages à venir. L'équilibre monétaire que vous construisez maintenant vous apportera un confort psychologique inestimable.",
    "Des rentrées d'argent inattendues, une prime méritée ou une opportunité de réaménagement budgétaire viendront grandement allèger vos charges ce mois-ci. Profitez de cette bouffée d'oxygène financière pour solder des dettes anciennes et réassainir vos comptes bancaires. Les astres favorisent les transactions honnêtes, les règlements de successions ou les négociations de prêts avantageux. Néanmoins, veillez à ne pas modifier radicalement votre train de vie face à cette amélioration passagère. Restez fidèle aux principes de modération et d'épargne qui font votre force depuis longtemps. C'est également le moment idéal pour faire preuve de générosité mesurée envers vos proches ou soutenir une cause qui vous tient à cœur. Votre rapport à l'argent gagne en maturité et en apaisement profond. La sécurité matérielle n'est plus une source d'anxiété, mais un outil au service de votre liberté d'action."
  ],
  sante: [
    "Votre niveau de vitalité et votre énergie physique sont en phase de transition importante ce mois-ci. Par conséquent, veillez à accorder une importance capitale à la qualité de votre sommeil et à une récupération régulière. Le surmenage professionnel ou l'accumulation de petits stress du quotidien pourraient se faire ressentir sur votre système immunitaire. Intégrez des temps de pause, de silence et de déconnexion numérique absolue dans votre routine quotidienne. Une activité physique douce, comme le yoga, le Pilates ou la natation, vous aidera à relâcher les tensions musculaires accumulées. Soyez également très attentif à votre alimentation en privilégiant des produits frais, de saison et vivants. Votre corps réclame de la bienveillance et un retour aux sources salutaire. En respectant vos limites biologiques, vous traverserez ce mois en conservant un équilibre intérieur remarquable et une sérénité retrouvée.",
    "Un magnifique regain d'énergie globale vous pousse à adopter de nouvelles routines de bien-être beaucoup plus saines et durables. C'est le moment idéal pour entreprendre une détox, reprendre en main votre condition physique ou démarrer un sport stimulant. Votre métabolisme répondra merveilleusement bien aux efforts modérés et réguliers que vous lui proposerez. Sur le plan psychologique, votre optimisme naturel revient en force, chassant les ruminations mentales et l'anxiété. Profitez de ce dynamisme pour passer du temps au grand air, vous oxygéner en forêt ou près de l'eau. Votre clarté d'esprit sera redoutable pour prendre de bonnes résolutions concernant votre hygiène de vie. Veillez toutefois à ne pas dilapider votre capital énergétique dans des excès d'enthousiasme soudains. La clé réside dans la constance, la régularité et l'écoute fine des signaux de votre organisme.",
    "L'équilibre mental, la paix intérieure et la gestion émotionnelle se trouvent au tout premier plan de vos priorités ce mois-ci. Prenez activement du temps pour vous ressourcer loin de l'agitation urbaine, du bruit et du stress relationnel. La pratique de la méditation, de la cohérence cardiaque ou de la lecture au calme apaisera durablement votre système nerveux. Votre corps physique a besoin de douceur, de massages, de bains chauds et d'un repos bien mérité. Si des petits bobos chroniques refaisaient surface, prenez-les en charge avec sérieux sans les négliger. Cultivez la gratitude au quotidien et entourez-vous exclusivement de personnes bienveillantes qui élèvent votre taux vibratoire. Ce mois est une véritable cure de jouvence spirituelle et corporelle si vous acceptez de ralentir la cadence. Votre force intérieure en ressortira magnifiquement régénérée et consolidée pour l'avenir."
  ]
};

const generateMonthlyTrends = (signId, yearMonthStr) => {
  const signIndex = ZODIAC_SIGNS.findIndex(s => s.id === signId);
  const safeIndex = signIndex !== -1 ? signIndex : 0;

  let hash = 0;
  for (let i = 0; i < yearMonthStr.length; i++) {
    hash = (hash << 5) - hash + yearMonthStr.charCodeAt(i);
    hash |= 0;
  }
  hash = Math.abs(hash);

  return {
    amour: MONTHLY_TRENDS_DATABASE.amour[(safeIndex + hash) % MONTHLY_TRENDS_DATABASE.amour.length],
    travail: MONTHLY_TRENDS_DATABASE.travail[(safeIndex + hash + 1) % MONTHLY_TRENDS_DATABASE.travail.length],
    argent: MONTHLY_TRENDS_DATABASE.argent[(safeIndex + hash + 2) % MONTHLY_TRENDS_DATABASE.argent.length],
    sante: MONTHLY_TRENDS_DATABASE.sante[(safeIndex + hash + 3) % MONTHLY_TRENDS_DATABASE.sante.length],
  };
};

// ============================================================================
// COMPOSANT DE PIED DE PAGE (SIGNATURE DÉVELOPPEUR)
// ============================================================================

const DeveloperFooter = () => (
  <footer className="mt-8 mb-4 text-center">
    <a
      href="https://precieux6.github.io/mon-portfolio/#contact"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition-colors duration-200 bg-white/60 hover:bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-2xs"
    >
      <span>Développé par Précieux Trésor TOSSOU</span>
      <ExternalLink size={12} className="opacity-70" />
    </a>
  </footer>
);

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
              <span>Tendances Mensuelles</span>
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
                Mon horoscope au quotidien avec Maître Folly Valère TOSSOU
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

            <DeveloperFooter />

          </div>
        )}

        {/* ONGLET 2 : TENDANCES MENSUELLES DÉTAILLÉES */}
        {activeTab === 'mensuel' && (
          <div className="space-y-4 sm:space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-3xl mx-auto space-y-1 sm:space-y-2">
              <h2 className="text-xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Tendances mensuelles détaillées avec Maître Folly Valère TOSSOU
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
                Bilan global et approfondi pour le mois de <strong className="text-purple-800 capitalize">{monthFormatted}</strong>.
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
                  <span className="text-[10px] uppercase bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Grand Bilan de {monthFormatted}</span>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">{selectedSign.name}</h3>
                  <p className="text-white/90 text-xs sm:text-sm mt-0.5 font-medium">{selectedSign.dates} • Élément {selectedSign.element}</p>
                </div>
              </div>

              <div className="p-4 sm:p-8 space-y-6">
                
                <div className="bg-rose-50/40 border border-rose-100 p-5 sm:p-7 rounded-2xl sm:rounded-3xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl"><Heart size={20} /></div>
                    <h4 className="text-base sm:text-lg font-bold text-rose-950">Amour & relations : tendances du mois</h4>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">{currentMonthlyTrends.amour}</p>
                </div>

                <div className="bg-sky-50/40 border border-sky-100 p-5 sm:p-7 rounded-2xl sm:rounded-3xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-sky-100 text-sky-700 rounded-xl"><Briefcase size={20} /></div>
                    <h4 className="text-base sm:text-lg font-bold text-sky-950">Travail & carrière : tendances du mois</h4>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">{currentMonthlyTrends.travail}</p>
                </div>

                <div className="bg-emerald-50/40 border border-emerald-100 p-5 sm:p-7 rounded-2xl sm:rounded-3xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl"><Wallet size={20} /></div>
                    <h4 className="text-base sm:text-lg font-bold text-emerald-950">Argent & finances : tendances du mois</h4>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">{currentMonthlyTrends.argent}</p>
                </div>

                <div className="bg-amber-50/40 border border-amber-100 p-5 sm:p-7 rounded-2xl sm:rounded-3xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl"><Activity size={20} /></div>
                    <h4 className="text-base sm:text-lg font-bold text-amber-950">Santé & vitalité : tendances du mois</h4>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">{currentMonthlyTrends.sante}</p>
                </div>

              </div>

            </div>

            <DeveloperFooter />

          </div>
        )}

        {/* ONGLET 3 : PROFILER ASTROLOGIQUE */}
        {activeTab === 'profiler' && (
          <div className="space-y-4 sm:space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-3xl mx-auto space-y-1 sm:space-y-2">
              <h2 className="text-xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Profilage astrologique
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

            <DeveloperFooter />

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
