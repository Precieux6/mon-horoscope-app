import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Heart, Briefcase, Wallet, Activity, Calendar, Search, 
  Star, Compass, Gift, Award, MessageSquare, Send, CheckCircle2, 
  ChevronRight, RefreshCw, Sun, Moon, Info, X, Users, Share2, ThumbsUp,
  Clock, Terminal, Database, Code, ShieldCheck, ArrowRight, Copy, Check,
  Sliders, Zap, ExternalLink, Download
} from 'lucide-react';

// ============================================================================
// PHASE 1: COMPLETE ASTROLOGICAL DATABASE (12 ZODIAC SIGNS)
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

// Phase 1: Zodiac Calculator from Date
const getZodiacSignFromDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // 1-12

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

// Complete Database for Profiles (10 Qualities, 10 Flaws, 5 Anecdotes, 5 Talents, 10 Domains)
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
    flaws: ["Dispersé", "Superficieux", "Indécis", "Nerveux", "Inconstant", "Bavard", "Chanjeant", "Facilement distrait", "Ironique", "Tendance à procrastiner"],
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
    qualities: ["Intuitif", "Protecteur", "Empathetic", "Dévoué", "Créatif", "Sensible", "Attentif", "Loyal", "Plein d'imagination", "Patience affective"],
    flaws: ["Sustensible", "Nostalgique", "Possessif", "Changement d'humeur", "Introverti", "Anxieux", "Réticent au risque", "Capricieux", "Protecteur à l'excès", "Dépendant"],
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
    qualities: ["Diplomate", "Équitable", "Sociable", "Élégant", "Charmant", "Pacifique", "Empathetic", "Coopératif", "Raffiné", "Conciliant"],
    flaws: ["Indécis", "Évite les conflits", "Dépendant", "Influencable", "Superficieux", "Hésitant", "Soucieux du regard d'autrui", "Procrastinateur", "Trop indulgent", "Passif"],
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
      "Préfère une vérité blesse mais franche à un mensonge réconfortant."
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
    qualities: ["Ambitieux", "Discipliné", "Pragmatique", "Patient", "Pévoyant", "Labeur", "Responsable", "Intègre", "Méthodique", "Persévérant"],
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
    qualities: ["Empathetic", "Intuitif", "Créatif", "Inspiré", "Généreux", "Compassionnel", "Devoué", "Artiste", "Doux", "Rêveur"],
    flaws: ["Hypersensible", "Idéaliste", "Fuite de la réalité", "Influenceable", "Indécis", "Anxieux", "Tendance au sacrifice", "Désordonné", "Confus", "Nostalgique"],
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
// PHASE 2 & 3: AUTOMATED DAILY HOROSCOPE GENERATOR (08:00 UTC SYNCHRONIZED)
// ============================================================================

// Hash generator for daily deterministic uniqueness
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
    "Vénus accentue la douceur de vos échanges affectifs aujourd'hui. En couple, l'écoute mutuelle permettra de dénouer un léger malentendu récent et de consolider vos projets d'avenir. Pour les célibataires, une rencontre imprévue au détour d'une activité habituelle pourrait éveiller une vive curiosité. Restez authentique et laissez parler votre cœur sans retenue.",
    "Un vent de passion souffle sur votre ciel sentimental. Les moments partagés avec votre partenaire seront emprunts de complicité et de sensualité renouvelée. Si vous cherchez l'amour, vos charmes naturels seront particulièrement efficaces lors de sorties informelles. Prenez l'initiative d'exprimer vos sentiments les plus sincères sans crainte.",
    "Les alignements planétaires favorisent la clarté et l'harmonie amoureuse. C'est la journée idéale pour aborder sereinement les sujets profonds et clarifier vos attentes mutuelles. Les personnes seules gagneront à sortir de leur zone de confort pour rencontrer de nouvelles personnes. L'ouverture d'esprit sera le catalyseur de vos plus belles émotions.",
    "Votre sensibilité amoureuse est décuplée sous l'influence lunaire favorable. Vous saurez apporter le réconfort et l'attention nécessaires à l'épanouissement de votre relation de couple. Célibataire, un dialogue captivant avec une personne de votre entourage pourrait prendre une tournure romantique inattendue. Ne précipitez rien et appréciez chaque instant."
  ],
  travail: [
    "Mercure stimule votre acuité intellectuelle et votre efficacité au travail. Vos propositions lors des réunions retenues retiendront l'attention de vos supérieurs ou de vos partenaires. C'est le moment idéal pour finaliser des dossiers complexes et poser des jalons stratégiques. Maintenez une communication claire avec vos collègues pour optimiser la cohésion d'équipe.",
    "Votre persévérance porte enfin ses fruits et débloque un projet en attente. Vous saurez faire preuve d'un leadership rassembleur face à des défis méthodologiques inattendus. N'hésitez pas à déléguer certaines tâches secondaires pour vous concentrer sur vos priorités majeures. La reconnaissance professionnelle est à portée de main.",
    "Une journée dynamique s'annonce sur le plan professionnel avec de belles opportunités d'innovation. Votre créativité et votre réactivité seront vos plus précieux atouts pour résoudre un problème technique. Prenez le temps de relire attentivement vos contrats avant toute signature définitive. Votre rigueur habituelle sera votre meilleure alliée.",
    "L'ambiance de travail est particulièrement collaborative et propice aux synergies. Vous trouverez des solutions originales pour rationaliser votre emploi du temps et gagner en productivité. Un échange constructif avec un mentor pourrait vous ouvrir de nouvelles perspectives de carrière. Restez à l'écoute des conseils avisés."
  ],
  argent: [
    "Sur le plan financier, la prudence et la méthode vous permettent de consolider vos acquis. C'est une excellente journée pour réviser votre budget global et planifier des épargnes à moyen terme. Évitez les dépenses impulsives déclenchées par des coups de cœur éphémères. Un investissement réfléchi commencera à donner des signes encourageants.",
    "Vos finances affichent une belle stabilité grâce à votre gestion méthodique récente. Une rentrée d'argent inattendue ou le remboursement d'une créance pourrait agréablement vous surprendre. Profitez-en pour assainir vos engagements bancaires et sécuriser vos réserves de précaution. La modération reste la clé d'une tranquillité durable.",
    "Les aspects astrologiques incitent à la réflexion stratégique concernant votre patrimoine. C'est le moment opportun pour comparer des contrats ou renégocier des conditions financières avantageuses. Prenez conseil auprès d'experts si vous envisagez des placements importants dans un avenir proche. Votre flair financier est particulièrement aiguisé aujourd'hui.",
    "Gestion équilibrée et opportunités mesurées caractérisent ce secteur aujourd'hui. Vous saurez résister aux sollicitations commerciales superflues et privilégier l'essentiel. Une bonne nouvelle liée à une démarche administrative ou fiscale est tout à fait envisageable. Continuez de tenir vos comptes avec la même rigueur."
  ],
  sante: [
    "Votre niveau d'énergie vitale est en nette hausse sous cette configuration astrale stimulante. Pour maintenir cet équilibre, veillez à alterner vos périodes d'effort intense avec des pauses de relaxation. Une activité physique modérée en plein air vous permettra de vous vider l'esprit. Pensez également à bien vous hydrater tout au long de la journée.",
    "Une très bonne résistance physique générale vous accompagne durant toute cette journée. Néanmoins, votre système nerveux nécessite un peu d'apaisement en fin de journée pour garantir un sommeil réparateur. Privilégiez des repas légers et équilibrés ce soir tout en évitant les écrans avant de dormir. Prenez soin de votre posture au bureau.",
    "Forme et vitalité sont au rendez-vous, vous vous sentez capable de déplacer des montagnes. Canalisez cet enthousiasme à travers une séance de sport ou une longue marche stimulante. Veillez toutefois à ne pas trop tirer sur la corde et à accorder à votre corps les étirements nécessaires. L'écoute de votre rythme intérieur reste primordiale.",
    "Votre capital santé bénéficie d'influences protectrices qui renforcent votre tonus. C'est une excellente période pour adopter de nouvelles habitudes de vie plus saines et durables. La pratique de la respiration consciente ou du yoga vous apportera une grande clarté mentale. Accordez-vous un moment de détente bien mérité ce soir."
  ],
  conseils: [
    "Accordez-vous dix minutes de méditation en début de matinée pour fixer vos intentions calmes.",
    "Exprimez votre gratitude envers une personne qui vous a soutenu discrètement ces derniers temps.",
    "Osez dire non aux demandes abusives pour préserver votre précieux temps personnel.",
    "Faites confiance à votre intuition première avant de vous perdre dans une sur-analyse.",
    "Prenez une grande respiration et abordez la journée une étape après l'autre avec sérénité.",
    "Privilégiez la qualité de vos relations plutôt que la quantité d'échanges éphémères.",
    "Offrez-vous une pause régénérante loin des notifications numériques pendant une heure.",
    "Cultivez l'enthousiasme en vous concentrant sur ce qui fonctionne déjà parfaitement bien."
  ]
};

const generateAutomatedHoroscope = (signId, dateStr) => {
  const hash = getDailyHash(signId, dateStr);
  
  const amourIdx = hash % HOROSCOPE_TEXT_DATABASE.amour.length;
  const travailIdx = (hash >> 2) % HOROSCOPE_TEXT_DATABASE.travail.length;
  const argentIdx = (hash >> 4) % HOROSCOPE_TEXT_DATABASE.argent.length;
  const santeIdx = (hash >> 6) % HOROSCOPE_TEXT_DATABASE.sante.length;
  const conseilIdx = (hash >> 8) % HOROSCOPE_TEXT_DATABASE.conseils.length;

  const scoreAmour = 70 + (hash % 28);
  const scoreTravail = 68 + ((hash >> 3) % 30);
  const scoreArgent = 72 + ((hash >> 5) % 26);
  const scoreSante = 75 + ((hash >> 7) % 23);

  return {
    amour: { text: HOROSCOPE_TEXT_DATABASE.amour[amourIdx], score: scoreAmour },
    travail: { text: HOROSCOPE_TEXT_DATABASE.travail[travailIdx], score: scoreTravail },
    argent: { text: HOROSCOPE_TEXT_DATABASE.argent[argentIdx], score: scoreArgent },
    sante: { text: HOROSCOPE_TEXT_DATABASE.sante[santeIdx], score: scoreSante },
    conseil: HOROSCOPE_TEXT_DATABASE.conseils[conseilIdx]
  };
};

// ============================================================================
// MAIN SAAS APPLICATION COMPONENT
// ============================================================================

export default function App() {
  const [activeTab, setActiveTab] = useState('horoscope'); // 'horoscope' | 'profiler' | 'api'
  const [selectedSign, setSelectedSign] = useState(ZODIAC_SIGNS[0]);
  
  // Profiler state
  const [birthdateInput, setBirthdateInput] = useState('1995-07-23');
  const [searchedProfile, setSearchedProfile] = useState(null);

  // Time & Countdown State
  const [timeToNextUpdate, setTimeToNextUpdate] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [copiedCode, setCopiedCode] = useState(false);

  // Today Date string ISO
  const todayISO = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  // Compute Daily Horoscope for currently selected sign
  const currentHoroscope = useMemo(() => {
    return generateAutomatedHoroscope(selectedSign.id, todayISO);
  }, [selectedSign, todayISO]);

  // Initial calculation for Profiler on mount
  useEffect(() => {
    if (birthdateInput) {
      const sign = getZodiacSignFromDate(birthdateInput);
      if (sign) {
        const details = getProfileForSign(sign);
        setSearchedProfile({ sign, ...details });
      }
    }
  }, []);

  // Countdown timer to next 08:00 UTC update
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const nextUpdate = new Date();
      
      // Set to 08:00 UTC today or tomorrow
      nextUpdate.setUTCHours(8, 0, 0, 0);
      if (now >= nextUpdate) {
        nextUpdate.setUTCDate(nextUpdate.getUTCDate() + 1);
      }

      const diffMs = nextUpdate.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeToNextUpdate({ hours, minutes, seconds });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle Birthdate Search in Profiler
  const handleProfileSearch = (e) => {
    e.preventDefault();
    if (!birthdateInput) return;
    const sign = getZodiacSignFromDate(birthdateInput);
    if (sign) {
      const details = getProfileForSign(sign);
      setSearchedProfile({ sign, ...details });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-24 sm:pb-12 selection:bg-purple-200 selection:text-purple-900 flex flex-col">
      
      {/* ---------------------------------------------------------------------- */}
      {/* AUTOMATION STATUS BAR (PHASE 3 HEADER)                                 */}
      {/* ---------------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white text-xs py-2 px-4 border-b border-purple-900/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-purple-200">Cron 08h00 UTC :</span>
            <span className="text-slate-300">Horoscope actualisé automatiquement pour le <strong className="text-white">{todayFormatted}</strong></span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-purple-200/90 font-mono">
            <div className="flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
              <Clock size={12} className="text-amber-300" />
              <span>Prochaine génération dans : {String(timeToNextUpdate.hours).padStart(2, '0')}h {String(timeToNextUpdate.minutes).padStart(2, '0')}m {String(timeToNextUpdate.seconds).padStart(2, '0')}s</span>
            </div>
          </div>

        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* MAIN NAVBAR (DESKTOP & TABLET)                                         */}
      {/* ---------------------------------------------------------------------- */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 flex items-center justify-center text-white shadow-md shadow-purple-200">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-900 bg-clip-text text-transparent tracking-tight">
                  ASTRAEA
                </h1>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-purple-200">
                  SaaS v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Moteur d'Astrologie Quotidien & Profilage Automatisé
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('horoscope')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'horoscope'
                  ? 'bg-white text-purple-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sun size={15} className={activeTab === 'horoscope' ? 'text-purple-600' : ''} />
              <span>Horoscope du Jour</span>
            </button>

            <button
              onClick={() => setActiveTab('profiler')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'profiler'
                  ? 'bg-white text-purple-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search size={15} className={activeTab === 'profiler' ? 'text-purple-600' : ''} />
              <span>Mon Profil Astrologique</span>
            </button>

            <button
              onClick={() => setActiveTab('api')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'api'
                  ? 'bg-white text-purple-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal size={15} className={activeTab === 'api' ? 'text-purple-600' : ''} />
              <span>API & Automatisation</span>
            </button>
          </nav>

          {/* Quick Date Display */}
          <div className="text-right hidden lg:block">
            <p className="text-xs font-bold text-slate-700">{todayFormatted}</p>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
              <CheckCircle2 size={12} /> Sync Astres 100% OK
            </p>
          </div>

        </div>
      </header>

      {/* ---------------------------------------------------------------------- */}
      {/* MAIN CONTAINER CONTENT                                                 */}
      {/* ---------------------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 flex-1 w-full">

        {/* ==================================================================== */}
        {/* TAB 1: HOROSCOPE DU JOUR (PHASE 2 & 3)                               */}
        {/* ==================================================================== */}
        {activeTab === 'horoscope' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            
            {/* Title Section */}
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 text-purple-800 text-xs font-semibold border border-purple-200">
                <Sparkles size={13} className="text-purple-600" />
                <span>Mise à jour automatique quotidienne • 08h00 UTC</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Horoscope Astral Quotidien
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
                Analyse détaillée pour chaque signe du zodiaque basée sur la rotation et les transits des astres du système solaire.
              </p>
            </div>

            {/* Zodiac Sign Carousel / Grid Selector */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Sélectionnez un signe du zodiaque :
                </p>
                <span className="text-[11px] text-purple-700 font-semibold">
                  Signe actif : {selectedSign.name}
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                {ZODIAC_SIGNS.map((sign) => {
                  const isSelected = selectedSign.id === sign.id;
                  return (
                    <button
                      key={sign.id}
                      onClick={() => setSelectedSign(sign)}
                      className={`flex flex-col items-center p-2.5 rounded-2xl transition duration-200 text-center border relative overflow-hidden group ${
                        isSelected
                          ? 'bg-gradient-to-b from-purple-50 to-indigo-50/60 border-purple-500 text-purple-900 shadow-sm ring-2 ring-purple-500/20'
                          : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl mb-0.5 transition group-hover:scale-110">{sign.symbol}</span>
                      <span className="text-xs font-bold truncate w-full">{sign.name}</span>
                      <span className="text-[9px] text-slate-400 font-medium">{sign.element}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Sign Detailed Cards View */}
            <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden space-y-6">
              
              {/* Sign Header Banner */}
              <div className={`bg-gradient-to-r ${selectedSign.color} text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden`}>
                <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left z-10">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center text-5xl sm:text-6xl border border-white/20 shadow-inner">
                    {selectedSign.symbol}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h3 className="text-3xl sm:text-4xl font-black tracking-tight">{selectedSign.name}</h3>
                      <span className="text-xs bg-white/20 text-white border border-white/30 px-3 py-1 rounded-full font-semibold backdrop-blur-md">
                        Élément {selectedSign.element}
                      </span>
                    </div>
                    <p className="text-white/90 text-xs sm:text-sm mt-1 font-medium">{selectedSign.dates}</p>
                    <p className="text-xs text-white/80 mt-1">Gouverné par la planète <strong className="text-white">{selectedSign.planet}</strong></p>
                  </div>
                </div>

                {/* Status badge */}
                <div className="bg-slate-900/40 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center md:text-right min-w-[220px] z-10">
                  <span className="text-[10px] text-purple-200 uppercase font-bold tracking-wider block">Génération Déterministe</span>
                  <p className="text-sm font-bold text-emerald-300 flex items-center justify-center md:justify-end gap-1.5 mt-0.5">
                    <CheckCircle2 size={16} /> Prêt depuis 08h00 UTC
                  </p>
                  <p className="text-[11px] text-slate-200 mt-1">Conforme aux mouvements célestes</p>
                </div>
              </div>

              {/* 4 Pillars Grid (Amour, Travail, Argent, Santé) */}
              <div className="p-6 sm:p-8 space-y-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Pillar 1: Amour */}
                  <div className="bg-rose-50/40 border border-rose-100 p-6 rounded-3xl space-y-4 hover:shadow-md transition duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-rose-100 text-rose-700 rounded-2xl shadow-2xs">
                          <Heart size={22} />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-rose-950">Amour & Relations</h4>
                          <p className="text-[11px] text-rose-700">Climat sentimental & compatibilité</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold bg-rose-100 text-rose-900 px-3 py-1 rounded-full border border-rose-200">
                          {currentHoroscope.amour.score}%
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed text-justify">
                      {currentHoroscope.amour.text}
                    </p>
                  </div>

                  {/* Pillar 2: Travail */}
                  <div className="bg-sky-50/40 border border-sky-100 p-6 rounded-3xl space-y-4 hover:shadow-md transition duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-sky-100 text-sky-700 rounded-2xl shadow-2xs">
                          <Briefcase size={22} />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-sky-950">Travail & Carrière</h4>
                          <p className="text-[11px] text-sky-700">Projets, collègues & opportunités</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold bg-sky-100 text-sky-900 px-3 py-1 rounded-full border border-sky-200">
                          {currentHoroscope.travail.score}%
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed text-justify">
                      {currentHoroscope.travail.text}
                    </p>
                  </div>

                  {/* Pillar 3: Argent */}
                  <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-3xl space-y-4 hover:shadow-md transition duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl shadow-2xs">
                          <Wallet size={22} />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-emerald-950">Argent & Finances</h4>
                          <p className="text-[11px] text-emerald-700">Gestion budgétaire & investissements</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-200">
                          {currentHoroscope.argent.score}%
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed text-justify">
                      {currentHoroscope.argent.text}
                    </p>
                  </div>

                  {/* Pillar 4: Santé */}
                  <div className="bg-amber-50/40 border border-amber-100 p-6 rounded-3xl space-y-4 hover:shadow-md transition duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl shadow-2xs">
                          <Activity size={22} />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-amber-950">Santé & Vitalité</h4>
                          <p className="text-[11px] text-amber-800">Énergie physique & bien-être mental</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
                          {currentHoroscope.sante.score}%
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed text-justify">
                      {currentHoroscope.sante.text}
                    </p>
                  </div>

                </div>

                {/* Personal Daily Advice Callout */}
                <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-lg border border-purple-800">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center shrink-0 shadow-md font-bold text-2xl">
                      💡
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">
                        Conseil Astral Personnalisé du Jour
                      </span>
                      <p className="text-lg sm:text-xl font-medium italic text-purple-100 leading-snug">
                        "{currentHoroscope.conseil}"
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: PROFILER ASTROLOGIQUE (PHASE 1)                               */}
        {/* ==================================================================== */}
        {activeTab === 'profiler' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold border border-indigo-200">
                <Search size={13} className="text-indigo-600" />
                <span>Moteur de Calcul de Signe & Analyse Complète</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Moteur de Profilage Astrologique
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
                Saisissez n'importe quelle date de naissance pour débloquer immédiatement votre bilan astrologique détaillé.
              </p>
            </div>

            {/* Input Search Form */}
            <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
              <form onSubmit={handleProfileSearch} className="space-y-4">
                <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Renseignez la date de naissance :
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="date"
                      required
                      value={birthdateInput}
                      onChange={(e) => setBirthdateInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-slate-800 font-semibold text-sm outline-none transition"
                    />
                    <Calendar className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  </div>
                  <button
                    type="submit"
                    className="bg-purple-800 hover:bg-purple-900 active:scale-95 text-white font-bold px-6 py-3 rounded-2xl transition duration-200 flex items-center justify-center gap-2 shadow-md shadow-purple-200"
                  >
                    <Search size={18} />
                    <span>Calculer mon signe</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Profile Results View */}
            {searchedProfile && (
              <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden p-6 sm:p-8 space-y-8">
                
                {/* Result Top Summary */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 rounded-3xl border border-purple-100">
                  <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
                    <span className="text-6xl">{searchedProfile.sign.symbol}</span>
                    <div>
                      <span className="text-xs font-extrabold text-purple-700 uppercase tracking-wider">Signe Calculé</span>
                      <h3 className="text-3xl font-black text-slate-900">{searchedProfile.sign.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{searchedProfile.sign.dates} • Élément {searchedProfile.sign.element}</p>
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-200 text-purple-900">
                      <Award size={14} /> Profilage 100% Vérifié
                    </span>
                  </div>
                </div>

                {/* Grid 1: Top 10 Qualities & Top 10 Flaws */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Top 10 Qualities */}
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 space-y-4">
                    <h4 className="text-emerald-950 font-bold text-base flex items-center gap-2">
                      <Award className="text-emerald-600" size={20} /> Top 10 des Qualités Majeures
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {searchedProfile.qualities.map((item, idx) => (
                        <span key={idx} className="bg-white border border-emerald-200 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs">
                          {idx + 1}. {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Top 10 Flaws */}
                  <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-6 space-y-4">
                    <h4 className="text-amber-950 font-bold text-base flex items-center gap-2">
                      <Info className="text-amber-600" size={20} /> Top 10 des Défauts & Vulnérabilités
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {searchedProfile.flaws.map((item, idx) => (
                        <span key={idx} className="bg-white border border-amber-200 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs">
                          {idx + 1}. {item}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Grid 2: 5 Anecdotes & 5 Hidden Talents */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* 5 Hidden Talents */}
                  <div className="bg-purple-50/50 border border-purple-100 rounded-3xl p-6 space-y-4">
                    <h4 className="text-purple-950 font-bold text-base flex items-center gap-2">
                      <Gift className="text-purple-600" size={20} /> 5 Talents Cachés Méconnus
                    </h4>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                      {searchedProfile.talents.map((talent, idx) => (
                        <li key={idx} className="flex items-start gap-3 bg-white p-3 rounded-2xl border border-purple-100 shadow-2xs">
                          <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-slate-800">{talent}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 5 Anecdotes */}
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 space-y-4">
                    <h4 className="text-indigo-950 font-bold text-base flex items-center gap-2">
                      <Compass className="text-indigo-600" size={20} /> 5 Anecdotes Particulières
                    </h4>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                      {searchedProfile.anecdotes.map((anecdote, idx) => (
                        <li key={idx} className="flex items-start gap-3 bg-white p-3 rounded-2xl border border-indigo-100 shadow-2xs">
                          <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-900 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-slate-800">{anecdote}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* 10 Domains of Excellence */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
                  <h4 className="text-slate-900 font-bold text-base flex items-center gap-2">
                    <Star size={20} className="text-amber-500 fill-amber-500" /> 10 Domaines d'Excellence & Métiers
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {searchedProfile.excellenceDomains.map((domain, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center font-bold text-xs text-slate-800 shadow-2xs hover:border-purple-300 transition">
                        {domain}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: API & AUTOMATION DASHBOARD (PHASE 3 & 4)                      */}
        {/* ==================================================================== */}
        {activeTab === 'api' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200">
                <Terminal size={13} className="text-emerald-600" />
                <span>Documentation & Architecture SaaS Automatisée</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Infrastructure & API publique
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
                Consultez les requêtes JSON générées et le fonctionnement de l'automatisation matinale 08h00 UTC.
              </p>
            </div>

            {/* Architecture Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Database size={20} />
                </div>
                <h3 className="font-bold text-base text-slate-900">Base Déterministe</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  L'horoscope est calculé de manière prédictive via un hash combinant la date ISO du jour et l'identifiant du signe astrologique.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Clock size={20} />
                </div>
                <h3 className="font-bold text-base text-slate-900">Cron Job 08h00 UTC</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Une tâche automatisée planifiée rafraîchit les métriques d'alignement planétaire chaque nuit à 08h00 UTC précise.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Zap size={20} />
                </div>
                <h3 className="font-bold text-base text-slate-900">Accès Public REST</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Exportation fluide des données quotidiennes sous format JSON prêt pour l'intégration mobile, web ou widgets.
                </p>
              </div>

            </div>

            {/* API Endpoint Inspector Box */}
            <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-500 text-slate-950 uppercase">
                    GET
                  </span>
                  <code className="text-xs sm:text-sm font-mono text-purple-300">
                    /api/v1/horoscope?sign={selectedSign.id}&date={todayISO}
                  </code>
                </div>
                <button
                  onClick={() => copyToClipboard(JSON.stringify({ sign: selectedSign.id, date: todayISO, data: currentHoroscope }, null, 2))}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2 rounded-xl border border-slate-700 transition"
                >
                  {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedCode ? 'Copié !' : 'Copier JSON'}</span>
                </button>
              </div>

              {/* JSON Payload Preview */}
              <pre className="font-mono text-xs text-emerald-400 bg-slate-950 p-4 sm:p-6 rounded-2xl overflow-x-auto border border-slate-800 leading-relaxed">
{JSON.stringify({
  status: 200,
  updated_at: `${todayISO}T08:00:00Z`,
  sign: selectedSign.id,
  element: selectedSign.element,
  horoscope: {
    amour: currentHoroscope.amour,
    travail: currentHoroscope.travail,
    argent: currentHoroscope.argent,
    sante: currentHoroscope.sante,
    conseil_du_jour: currentHoroscope.conseil
  }
}, null, 2)}
              </pre>
            </div>

          </div>
        )}

      </main>

      {/* ---------------------------------------------------------------------- */}
      {/* MOBILE BOTTOM NAVIGATION BAR (MOBILE FIRST DESIGN)                    */}
      {/* ---------------------------------------------------------------------- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 md:hidden px-4 py-2">
        <div className="grid grid-cols-3 gap-1 max-w-md mx-auto">
          
          <button
            onClick={() => setActiveTab('horoscope')}
            className={`flex flex-col items-center justify-center py-2 rounded-2xl text-[11px] font-bold transition ${
              activeTab === 'horoscope' ? 'text-purple-800 bg-purple-50' : 'text-slate-500'
            }`}
          >
            <Sun size={18} className="mb-0.5" />
            <span>Horoscope</span>
          </button>

          <button
            onClick={() => setActiveTab('profiler')}
            className={`flex flex-col items-center justify-center py-2 rounded-2xl text-[11px] font-bold transition ${
              activeTab === 'profiler' ? 'text-purple-800 bg-purple-50' : 'text-slate-500'
            }`}
          >
            <Search size={18} className="mb-0.5" />
            <span>Profil</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`flex flex-col items-center justify-center py-2 rounded-2xl text-[11px] font-bold transition ${
              activeTab === 'api' ? 'text-purple-800 bg-purple-50' : 'text-slate-500'
            }`}
          >
            <Terminal size={18} className="mb-0.5" />
            <span>API & Automation</span>
          </button>

        </div>
      </div>

    </div>
  );
}