import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Heart, Briefcase, Wallet, Activity, Calendar, Search, 
  Star, Award, CheckCircle2, Info, TrendingUp, Compass, Gift, ExternalLink, BookOpen, Clock
} from 'lucide-react';

// ============================================================================
// BASE DE DONNÉES SIDÉRALE ET TROPICALE (12 SIGNES DU ZODIAQUE)
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

// ============================================================================
// MOTEUR DE CONVERSION SIDÉRALE (AYANAMSA LAHIRI)
// ============================================================================

const getSiderealSignFromDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  // Calcul astronomique approximatif de la déviation sidérale (Ayanamsa ~24 degrés)
  // Décalage d'environ 24 jours en arrière par rapport au zodiaque tropical
  const siderealDate = new Date(date.getTime());
  siderealDate.setUTCDate(siderealDate.getUTCDate() - 24);

  const day = siderealDate.getUTCDate();
  const month = siderealDate.getUTCMonth() + 1;

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

// ============================================================================
// MOTEUR DE NUMÉROLOGIE AVANCÉE
// ============================================================================

const reduceNumber = (num) => {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num.toString().split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
  }
  return num;
};

const getLetterValue = (char) => {
  const map = {
    a: 1, j: 1, s: 1, b: 2, k: 2, t: 2, c: 3, l: 3, u: 3,
    d: 4, m: 4, v: 4, e: 5, n: 5, w: 5, f: 6, o: 6, x: 6,
    g: 7, p: 7, y: 7, h: 8, q: 8, z: 8, i: 9, r: 9
  };
  return map[char.toLowerCase()] || 0;
};

const getNumerologyData = (dateString, fullName) => {
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  const sumDigits = (n) => n.toString().split('').reduce((a, b) => a + parseInt(b, 10), 0);
  const lifePath = reduceNumber(sumDigits(day) + sumDigits(month) + sumDigits(year));

  const sanitizedName = (fullName || "Anonyme").trim().toLowerCase().replace(/[^a-zàâäéèêëîïôöùûüç]/g, '');
  
  let expressionSum = 0;
  let soulSum = 0;
  let intimateSum = 0;
  const vowels = ['a', 'e', 'i', 'o', 'u', 'y', 'à', 'â', 'ä', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'ö', 'ù', 'û', 'ü'];
  const frequencies = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

  for (let char of sanitizedName) {
    const val = getLetterValue(char);
    if (val >= 1 && val <= 9) {
      expressionSum += val;
      frequencies[val]++;
      if (vowels.includes(char)) soulSum += val;
      else intimateSum += val;
    }
  }

  const expression = reduceNumber(expressionSum || 1);
  const soul = reduceNumber(soulSum || 1);
  const intimate = reduceNumber(intimateSum || 1);
  const currentYear = new Date().getUTCFullYear();
  const personalYear = reduceNumber(sumDigits(day) + sumDigits(month) + sumDigits(currentYear));

  const lifePathInterpretations = {
    1: "Votre chemin de vie 1 est celui du pionnier et du leader indépendant. Bâtisseur de destinées, vous avancez hors des sentiers battus avec audace.",
    2: "Le chemin de vie 2 place la coopération, l'écoute et l'harmonie au centre de votre existence. Vous fédérez les énergies avec tact et diplomatie.",
    3: "Votre chemin de vie 3 est guidé par l'expression créative, la communication et la joie communicative. Vous inspirez durablement vos contemporains.",
    4: "Le chemin de vie 4 incarne la structure, la rigueur et la construction pérenne. Vos bases solides garantissent des réalisations hautement durables.",
    5: "Votre chemin de vie 5 célèbre la liberté, le mouvement et l'adaptabilité face aux mutations du monde et des constellations.",
    6: "Le chemin de vie 6 est placé sous le signe de l'amour, de la famille, de la responsabilité et de l'harmonie des structures humaines.",
    7: "Votre chemin de vie 7 est une quête spirituelle profonde, intellectuelle et philosophique au cœur des mystères cosmiques.",
    8: "Le chemin de vie 8 symbolise la puissance matérielle, l'ambition, la justice et la maîtrise des grands projets d'envergure.",
    9: "Votre chemin de vie 9 est celui de l'humanisme universel, de la compassion et de l'élévation de la conscience collective."
  };

  const expressionInterpretations = {
    1: "Tempérament de battant et esprit direct, vous vous imposez naturellement avec assurance.",
    2: "Profil diplomate et collaboratif, vous excellez dans l'art de la négociation et de l'écoute active.",
    3: "Éloquence remarquable et sens artistique inné, vous brillez par votre capacité à communiquer.",
    4: "Organisation minutieuse et pragmatisme sans faille, vous concrétisez les idées en réalités.",
    5: "Grande polyvalence et magnétisme irrésistible face au changement et aux nouveaux horizons.",
    6: "Sens aigu des responsabilités et amour inconditionnel du travail bien fait et esthétique.",
    7: "Esprit analytique perçant et grande profondeur d'analyse en quête permanente d'excellence.",
    8: "Autorité naturelle et sens stratégique majeur pour mener à terme des entreprises ambitieuses.",
    9: "Largeur d'esprit et empathie universelle pour apporter une contribution positive à la société."
  };

  const soulInterpretations = {
    1: "Votre âme aspire à l'autonomie totale, à l'innovation et à la maîtrise de son propre destin sidéral.",
    2: "Votre âme recherche la fusion affective, la paix, la complicité et la douceur relationnelle.",
    3: "Votre âme réclame de la couleur, des échanges riches, de la création artistique et de la joie.",
    4: "Votre âme trouve la paix dans la sécurité matérielle, l'ordre et la stabilité bien ancrée.",
    5: "Votre âme aspire au grand air, aux expériences inédites et à la transformation perpétuelle.",
    6: "Votre âme se sent accomplie lorsqu'elle protège, conseille et prend soin de son entourage.",
    7: "Votre âme recherche la vérité absolue, le calme méditatif et la connaissance supérieure.",
    8: "Votre âme aspire au succès tangible, à la réussite matérielle et à l'impact économique durable.",
    9: "Votre âme vibre pour la fraternité universelle, la guérison et le don de soi désintéressé."
  };

  const intimateInterpretations = {
    1: "Votre apparence sociale dégage une fermeté volontaire et un leadership naturel intimidant.",
    2: "Vous projetez une image douce, abordable, chaleureuse et spontanément bienveillante.",
    3: "Votre aura est pétillante, souriante, dotée d'un sens de l'humour et d'une élégance naturelle.",
    4: "Vous dégagez une impression de sérieux, de solidité et de grand professionnalisme rassurant.",
    5: "Votre allure exprime un dynamisme contagieux, du magnétisme et une grande modernité.",
    6: "Vous projetez l'image d'une personne de confiance, protectrice, élégante et attentionnée.",
    7: "Votre prestance transmet distinction, mystère et profondeur intellectuelle raffinée.",
    8: "Vous imposez le respect par un statut rigoureux, élégant et une maîtrise totale.",
    9: "Vous dégagez une bienveillance magnétique, une noblesse d'âme et un charisme inspirant."
  };

  const personalYearInterpretations = {
    1: "Année personnelle 1 : Lancement d'un tout nouveau cycle de 9 ans, initiatives audacieuses et autonomie.",
    2: "Année personnelle 2 : Patience, association, diplomatie et consolidation des partenariats.",
    3: "Année personnelle 3 : Vague de créativité, sorties, rencontres inspirantes et expansion sociale.",
    4: "Année personnelle 4 : Effort, structure, rigueur et construction concrète des fondations d'avenir.",
    5: "Année personnelle 5 : Vent du changement, voyages, opportunités inattendues et liberté retrouvée.",
    6: "Année personnelle 6 : Focus sur le foyer, responsabilités familiales et choix affectifs structurants.",
    7: "Année personnelle 7 : Parenthèse d'introspection, études, repos et bilan spirituel majeur.",
    8: "Année personnelle 8 : Récoltes matérielles, réussite financière et concrétisation de projets d'envergure.",
    9: "Année personnelle 9 : Achèvement d'un grand cycle, grand nettoyage et préparation de la renaissance."
  };

  const missingNumbers = Object.keys(frequencies).filter(k => frequencies[k] === 0);
  const inclusionText = `Grille d'inclusion sidérale : ${missingNumbers.length > 0 ? `Leçons karmiques à intégrer [${missingNumbers.join(', ')}].` : 'Belle harmonie générale des nombres.'}`;
  const maturity = reduceNumber(lifePath + expression);
  const maturityText = `Nombre de maturité (${maturity}) : orientation vers la sagesse acquise et la transmission.`;

  const summaryText = `Votre configuration sidérale et numérologique (Chemin de vie ${lifePath}, Expression ${expression}, Année personnelle ${personalYear}) fusionne l'exactitude des constellations réelles et la vibration de votre identité pour tracer une trajectoire d'exception.`;

  return {
    lifePath, lifePathText: lifePathInterpretations[lifePath] || lifePathInterpretations[1],
    expression, expressionText: expressionInterpretations[expression] || expressionInterpretations[1],
    soul, soulText: soulInterpretations[soul] || soulInterpretations[1],
    intimate, intimateText: intimateInterpretations[intimate] || intimateInterpretations[1],
    personalYear, personalYearText: personalYearInterpretations[personalYear] || personalYearInterpretations[1],
    inclusionText, maturityText, summaryText
  };
};

// ============================================================================
// BASES DE DONNÉES DES PROFILS SIDÉRAUX COMPLETS
// ============================================================================

const COMPLETE_PROFILES_DATABASE = {
  belier: {
    qualities: ["Audacieux", "Sidéralement pionnier", "Franc", "Énergique", "Leader", "Spontané", "Déterminé", "Visionnaire", "Instantané", "Optimiste"],
    flaws: ["Impulsif", "Impatient", "Autoritaire", "Têtu", "Téméraire", "Susceptible", "Compétitif", "Individualiste", "Brûlant", "Imprévisible"],
    anecdotes: [
      "En astrologie sidérale, le Bélier incarne l'impulsion pure du feu originel des constellations.",
      "Il préfère l'action immédiate aux longues tergiversations théoriques.",
      "Sa franchise directe et naturelle est un catalyseur d'énergie vitale.",
      "Possède la faculté unique de rebondir instantanément après un obstacle.",
      "S'adapte à la vitesse de la lumière lorsque le défi le stimule."
    ],
    talents: ["Prise de décision sous haute pression", "Impulsion de projets novateurs", "Inspiration d'enthousiasme", "Courage face à l'inconnu", "Réactivité cosmique"],
    excellenceDomains: ["Entrepreneuriat", "Gestion de crise", "Sport de haut niveau", "Innovation", "Aéronautique", "Chirurgie", "Stratégie", "Startup", "Défense", "Exploration"]
  },
  taureau: {
    qualities: ["Loyal", "Patient", "Pragmatique", "Fiable", "Constante sidérale", "Épicurien", "Ancré", "Protecteur", "Solide", "Méthodique"],
    flaws: ["Rancunier", "Possessif", "Têtu", "Réticent au changement", "Matérialiste", "Rigide", "Lent", "Gourmand", "Inflexible", "Méfiant"],
    anecdotes: [
      "Ancré dans la constellation réelle du Taureau, son sens de la matière est absolu.",
      "Sa loyauté amicale et professionnelle est inébranlable.",
      "Ses rituels quotidiens sont sa source sacrée de paix intérieure.",
      "A un instinct infaillible pour sécuriser les investissements de valeur.",
      "Sa patience est immense, mais sa détermination l'est encore plus."
    ],
    talents: ["Sécurisation patrimoniale", "Constance dans l'effort", "Matérialisation des concepts", "Sens esthétique tactile", "Stabilité émotionnelle"],
    excellenceDomains: ["Finance", "Immobilier", "Gastronomie", "Architecture", "Artisanat d'art", "Agriculture", "Musique", "Gestion de fonds", "Ressources Humaines", "Patrimoine"]
  },
  gemeaux: {
    qualities: ["Adaptable", "Éloquent", "Curieux", "Vif", "Sociable", "Polyvalent", "Enthousiaste", "Perspicace", "Inventif", "Pétillant"],
    flaws: ["Dispersé", "Superficiel", "Indécis", "Nerveux", "Inconstant", "Bavard", "Changeant", "Distrait", "Ironique", "Impatient"],
    anecdotes: [
      "Sa connexion sidérale avec Mercure amplifie sa vitesse de traitement mental.",
      "Peut lier conversation et captiver n'importe quel auditoire instantanément.",
      "Intègre de nouveaux savoirs à une vitesse déconcertante.",
      "Privilégie la multiplicité des expériences enrichissantes.",
      "Conserve un esprit éternellement jeune et curieux."
    ],
    talents: ["Synthèse rapide", "Polyglotte", "Improvisation oratoire", "Mise en réseau", "Multitâche fluide"],
    excellenceDomains: ["Journalisme", "Relations Publiques", "Marketing", "Enseignement", "Traduction", "Développement", "Commerce", "Événementiel", "Médias", "Médiation"]
  },
  cancer: {
    qualities: ["Intuitif", "Protecteur", "Empathique", "Dévoué", "Créatif", "Sensible", "Attentif", "Loyal", "Imaginatif", "Profond"],
    flaws: ["Susceptible", "Nostalgique", "Possessif", "Lunatique", "Introverti", "Anxieux", "Prudent", "Capricieux", "Protecteur excessif", "Dépendant"],
    anecdotes: [
      "Perçoit les vibrations émotionnelles d'un lieu en une fraction de seconde.",
      "Conserve les souvenirs précieux comme des reliques sacrées.",
      "Son foyer est le temple où il puise sa force lunaire.",
      "Son instinct surpasse la logique rationnelle dans les choix de vie.",
      "Offre un réconfort inconditionnel aux âmes en peine."
    ],
    talents: ["Accompagnement émotionnel", "Mémoire visuelle et affective", "Création de sanctuaires", "Écoute intuitive", "Poésie introspective"],
    excellenceDomains: ["Psychologie", "Hôtellerie", "Pédiatrie", "Décoration", "Histoire", "Archéologie", "Écriture", "Fondations", "Soins", "Immobilier"]
  },
  lion: {
    qualities: ["Généreux", "Charmant", "Charismatique", "Loyal", "Protecteur", "Ambitieux", "Magnanime", "Créatif", "Sûr de soi", "Rayonnant"],
    flaws: ["Orgueilleux", "Théâtral", "Dominant", "Exigeant", "Égocentré", "Têtu", "Susceptible", "Impétueux", "Extravagant", "Intolérant"],
    anecdotes: [
      "Sous l'influence sidérale du Soleil, son rayonnement naturel illumine son entourage.",
      "Aime célébrer les grands accomplissements avec panache et générosité.",
      "Défend farouchement les personnes opprimées ou vulnérables.",
      "Exige l'excellence dans chaque projet qu'il touche.",
      "Sa présence sur scène ou en société ne laisse personne indifférent."
    ],
    talents: ["Leadership inspirant", "Aise scénique magistrale", "Direction artistique", "Redistribution d'énergie", "Gestion de grands projets"],
    excellenceDomains: ["Direction générale", "Arts du spectacle", "Luxe", "Politique", "Diplomatie", "Cinéma", "Mentorat", "Événementiel", "Mode", "Haute direction"]
  },
  vierge: {
    qualities: ["Méthodique", "Précis", "Analytique", "Serviable", "Organisé", "Modeste", "Fiable", "Pragmatique", "Réfléchi", "Discret"],
    flaws: ["Perfectionniste", "Critique", "Anxieux", "Réservé", "Rigide", "Surmené", "Minutieux", "Inquiet", "Pessimiste", "Tatillon"],
    anecdotes: [
      "Repère instantanément la moindre faille dans un système complexe.",
      "Possède des méthodes d'organisation d'une efficacité redoutable.",
      "Trouve son accomplissement dans l'utilité concrète de ses actions.",
      "Son érudition cachée force le respect de ses pairs.",
      "Optimise chaque processus pour atteindre la perfection opérationnelle."
    ],
    talents: ["Audit et contrôle qualité", "Organisation méthodique", "Détection d'anomalies", "Esprit de synthèse", "Richesse analytique"],
    excellenceDomains: ["Audit", "Recherche", "Comptabilité", "Ingénierie", "Qualité", "Data Science", "Édition", "Logistique", "Santé", "Archivage"]
  },
  balance: {
    qualities: ["Diplomate", "Équitable", "Sociable", "Élégant", "Charmant", "Pacifique", "Empathique", "Coopératif", "Raffiné", "Conciliant"],
    flaws: ["Indécis", "Évite les conflits", "Dépendant", "Influençable", "Superficiel", "Hésitant", "Soucieux du regard", "Procrastinateur", "Indulgent", "Passif"],
    anecdotes: [
      "Cherche perpétuellement l'équilibre cosmique et l'harmonie des formes.",
      "Maître incontesté dans l'art de désamorcer les conflits par la grâce.",
      "L'esthétique de son cadre de vie nourrit directement son équilibre.",
      "Possède un sens inné de l'étiquette et du partenariat.",
      "Facilite les accords là où tout semblait bloqué."
    ],
    talents: ["Médiation pacifique", "Sens raffiné de l'esthétique", "Vision multilatérale", "Création d'alliances", "Diplomatie subtile"],
    excellenceDomains: ["Droit", "Médiation", "Diplomatie", "Design", "Mode", "Relations Internationales", "Ressources Humaines", "Coaching", "Galerie d'art", "Conseil"]
  },
  scorpion: {
    qualities: ["Intense", "Passionné", "Perspicace", "Déterminé", "Loyal", "Magnétique", "Courageux", "Intuitif", "Ressource", "Profond"],
    flaws: ["Méfiant", "Rancunier", "Possessif", "Secret", "Impérieux", "Jaloux", "Intransigeant", "Extrême", "Manipulateur", "Implacable"],
    anecdotes: [
      "Plongé dans les mystères sidéraux de Pluton, il sonde l'invisible en un regard.",
      "Garde ses secrets les plus intimes sous une armure d'acier.",
      "S'investit corps et âme dans les causes qu'il choisit de défendre.",
      "Capacité de résurrection légendaire après les épreuves.",
      "Exige la vérité absolue, quitte à bousculer les conforts illusoires."
    ],
    talents: ["Investigation profonde", "Psychologie des profondeurs", "Gestion de crises extrêmes", "Transformation personnelle", "Stratégie occulte"],
    excellenceDomains: ["Psychanalyse", "Criminologie", "Chirurgie", "Cybersécurité", "Capital-Risque", "Recherche", "Astrophysique", "Gestion de crise", "Stratégie", "Investigations"]
  },
  sagittaire: {
    qualities: ["Optimiste", "Enthousiaste", "Chaleureux", "Philosophe", "Franc", "Indépendant", "Généreux", "Aventurier", "Visionnaire", "Tolérant"],
    flaws: ["Imprudent", "Sans filtre", "Impatient", "Prometteur", "Nerveux", "Dispersé", "Moralisateur", "Insoumis", "Inconstant", "Exubérant"],
    anecdotes: [
      "Porté par la flèche sidérale du Centaure, il vise toujours l'horizon lointain.",
      "Son optimisme est un phare qui ins insuffle l'espoir dans les tempêtes.",
      "Passionné par la philosophie, les voyages et la découverte des lois universelles.",
      "Exprime ses pensées sans calcul ni hypocrisie.",
      "A besoin d'expansion et de liberté absolue pour respirer."
    ],
    talents: ["Vision globale stratégique", "Transmission de savoirs", "Adaptation interculturelle", "Enthousiasme contagieux", "Prospection d'avenir"],
    excellenceDomains: ["Enseignement supérieur", "Exploration", "Philosophie", "Commerce International", "Diplomatie culturelle", "Aventure", "Coaching", "Droit international", "Édition", "Conférences"]
  },
  capricorne: {
    qualities: ["Ambitieux", "Discipliné", "Pragmatique", "Patient", "Prévoyant", "Bâtisseur", "Responsable", "Intègre", "Méthodique", "Persévérant"],
    flaws: ["Austère", "Pessimiste", "Rigide", "Réservé", "Perfectionniste", "Méfiant", "Implacable", "Sévère", "Solitaire", "Retiré"],
    anecdotes: [
      "Bâtit son empire pierre par pierre avec une rigueur implacable et millimétrée.",
      "Son sens de l'humour, subtil et caustique, se révèle dans l'intimité.",
      "Privilégie la pérennité intemporelle aux modes éphémères.",
      "Plus les années passent, plus son rayonnement intérieur s'épanouit.",
      "Le roc solide sur lequel toute une organisation peut s'appuyer."
    ],
    talents: ["Planification à long terme", "Endurance exceptionnelle", "Gestion institutionnelle", "Sang-froid inaltérable", "Intégrité morale"],
    excellenceDomains: ["Direction d'entreprise", "Administration", "BTP", "Ingénierie civile", "Finance", "Gestion de fonds", "Politique économique", "Architecture", "Magistrature", "Gouvernance"]
  },
  verseau: {
    qualities: ["Innovateur", "Humaniste", "Indépendant", "Original", "Visionnaire", "Fraternel", "Altruiste", "Brillant", "Créatif", "Avant-gardiste"],
    flaws: ["Détaché", "Imprévisible", "Entêté", "Rebelle", "Utopique", "Froid", "Individualiste", "Paradoxal", "Iconoclaste", "Insaisissable"],
    anecdotes: [
      "Connecté au futur sidéral, il anticipe les révolutions technologiques et sociales.",
      "Sa liberté d'esprit est un absolu non négociable.",
      "Refuse les dogmes figés du passé au profit de l'intelligence collective.",
      "S'implique corps et âme pour le progrès de l'humanité entière.",
      "Surprend toujours là où personne ne l'attendait."
    ],
    talents: ["Anticipation des tendances", "Conception de systèmes disruptifs", "Fédération de réseaux", "Génie conceptuel", "Indépendance critique"],
    excellenceDomains: ["Technologies de pointe", "Aéronautique", "Écologie", "Sociologie", "Intelligence Artificielle", "Action humanitaire", "Réseaux", "Invention", "Civisme", "E-Sport"]
  },
  poissons: {
    qualities: ["Empathique", "Intuitif", "Créatif", "Inspiré", "Généreux", "Compassionnel", "Dévoué", "Artiste", "Doux", "Rêveur"],
    flaws: ["Hypersensible", "Idéaliste", "Fugueur de réalité", "Influençable", "Indécis", "Anxieux", "Martyr", "Désordonné", "Confus", "Nostalgique"],
    anecdotes: [
      "Navigue dans les dimensions subtiles de l'océan sidéral de Neptune.",
      "Ressent la souffrance du monde et déploie des trésors de compassion.",
      "Ses intuitions nocturnes s'avèrent d'une exactitude troublante.",
      "S'unit à l'univers à travers la musique, l'art et la poésie.",
      "Possède une sagesse mystique insoupçonnée."
    ],
    talents: ["Inspiration artistique illimitée", "Connexion empathique immédiate", "Fluidité adaptative", "Méditation et guérison", "Imagination narrative"],
    excellenceDomains: ["Musique", "Cinéma", "Psychothérapie", "Soins palliatifs", "Poésie", "Holistique", "Humanitaire", "Océanographie", "Arts visuels", "Spiritualité"]
  }
};

const getDetailedProfileForDate = (dateString, fullName) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  // Utilisation de l'astrologie sidérale calculée
  const sign = getSiderealSignFromDate(dateString);
  if (!sign) return null;

  const baseProfile = COMPLETE_PROFILES_DATABASE[sign.id] || COMPLETE_PROFILES_DATABASE.belier;
  const year = date.getUTCFullYear();

  let yearHash = 0;
  const yearStr = year.toString();
  for (let i = 0; i < yearStr.length; i++) {
    yearHash = (yearHash << 5) - yearHash + yearStr.charCodeAt(i);
    yearHash |= 0;
  }
  yearHash = Math.abs(yearHash);

  const qualityShift = yearHash % baseProfile.qualities.length;
  const rotatedQualities = [...baseProfile.qualities.slice(qualityShift), ...baseProfile.qualities.slice(0, qualityShift)];
  const talentShift = (yearHash + 2) % baseProfile.talents.length;
  const rotatedTalents = [...baseProfile.talents.slice(talentShift), ...baseProfile.talents.slice(0, talentShift)];

  const planetaryInfluences = [
    "Transit de Jupiter Sidéral : Année majeure d'expansion, de réussite et d'opportunités structurantes.",
    "Transit de Saturne Sidéral : Année de consolidation, de maturité, de discipline et de construction durable.",
    "Transit d'Uranus Sidéral : Année d'innovation fulgurante, d'indépendance et de ruptures créatives salvatrices.",
    "Transit de Neptune Sidéral : Année d'éveil intuitif, de sensibilité artistique et de profondeur spirituelle.",
    "Transit de Pluton Sidéral : Année de métamorphose intérieure profonde et de régénération des forces vitales."
  ];
  const dominantPlanet = planetaryInfluences[yearHash % planetaryInfluences.length];
  const numerology = getNumerologyData(dateString, fullName);

  return {
    sign,
    birthYear: year,
    dominantPlanet,
    numerology,
    qualities: rotatedQualities,
    flaws: baseProfile.flaws,
    anecdotes: baseProfile.anecdotes,
    talents: rotatedTalents,
    excellenceDomains: baseProfile.excellenceDomains
  };
};

// ============================================================================
// TEXTES QUOTIDIENS ET MENSUELS DYNAMIQUES
// ============================================================================

const DAILY_TEXTS = {
  amour: [
    "Les influences sidérales de Vénus apportent une clarté remarquable dans vos échanges affectifs. En couple, l'écoute mutuelle dissipe les derniers non-dits. Célibataire, une rencontre magnétique pourrait marquer un tournant inspirant.",
    "Un climat passionnel et constructif enveloppe votre sphère sentimentale. Les astres récompensent l'audace du cœur et la sincérité des intentions partagées.",
    "La configuration céleste invite à la tendresse et à la consolidation de vos liens essentiels. Exprimez vos sentiments avec authenticité.",
    "Une vague d'empathie et de complicité profonde illumine votre journée relationnelle. Profitez de ces ondes bienveillantes pour raviver la flamme.",
    "L'alignement planétaire favorise le dialogue intime et l'apaisement des tensions passées. Ouvrez grand votre cœur aux belles surprises."
  ],
  travail: [
    "Votre acuité intellectuelle stimulée par les transits favorise l'aboutissement de vos dossiers prioritaires. Vos idées novatrices retiennent l'attention.",
    "La persévérance professionnelle porte ses fruits. Un leadership naturel vous permet de mobiliser efficacement vos collaborateurs autour d'un projet clé.",
    "Dynamisme et réactivité caractérisent votre journée professionnelle. Osez porter des propositions audacieuses auprès des décideurs.",
    "L'ambiance de travail est propice aux synergies constructives. Votre rigueur technique fait l'unanimité.",
    "Des opportunités stratégiques se profilent. Restez concentré sur vos objectifs à long terme pour maximiser vos succès."
  ],
  argent: [
    "La gestion rigoureuse de vos finances consolide votre assise matérielle. C'est le moment idéal pour optimiser votre budget avec clairvoyance.",
    "Stabilité pécuniaire et opportunité d'investissement judicieux. Analysez chaque détail avant de vous engager sur le long terme.",
    "Vos efforts d'épargne et votre pragmatisme vous mettent à l'abri des imprévus. Maintenez cette discipline éclairée.",
    "Une rentrée d'argent inattendue ou un réajustement budgétaire favorable allège vos charges. Gérez vos acquis avec sagesse.",
    "L'intuition financière est au rendez-vous. Écoutez votre bon sens pour sécuriser votre prospérité future."
  ],
  sante: [
    "Niveau d'énergie vitale en hausse. Une activité physique modérée et une hydratation soignée complètent votre bien-être.",
    "Résistance physique remarquable. Privilégiez des moments de respiration consciente pour un équilibre corps-esprit parfait.",
    "Capital santé renforcé par des influences protectrices. Accordez-vous des pauses de déconnexion salutaires.",
    "Vitalité resplendissante. C'est le moment idéal pour canaliser votre dynamisme dans une pratique sportive stimulante.",
    "Équilibre harmonieux. Écoutez les signaux de votre organisme pour préserver votre capital énergétique."
  ],
  conseils: [
    "Fixez vos intentions dès le matin dans le calme pour guider votre journée vers l'essentiel.",
    "Cultivez la gratitude et osez poser des limites saines face aux sollicitations superflues.",
    "Faites confiance à votre intuition première : elle possède une longueur d'avance.",
    "Simplifiez votre environnement pour clarifier instantanément vos pensées profondes.",
    "Accordez-vous un moment de silence absolu pour régénérer votre paix intérieure."
  ]
};

const generateAutomatedHoroscope = (signId, dateStr) => {
  const signIndex = ZODIAC_SIGNS.findIndex(s => s.id === signId);
  const safeIndex = signIndex !== -1 ? signIndex : 0;

  let dateHash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    dateHash = (dateHash << 5) - dateHash + dateStr.charCodeAt(i);
    dateHash |= 0;
  }
  dateHash = Math.abs(dateHash);

  const idxAmour = (safeIndex + dateHash) % DAILY_TEXTS.amour.length;
  const idxTravail = (safeIndex + dateHash + 1) % DAILY_TEXTS.travail.length;
  const idxArgent = (safeIndex + dateHash + 2) % DAILY_TEXTS.argent.length;
  const idxSante = (safeIndex + dateHash + 3) % DAILY_TEXTS.sante.length;
  const idxConseil = (safeIndex + dateHash + 4) % DAILY_TEXTS.conseils.length;

  return {
    amour: { text: DAILY_TEXTS.amour[idxAmour], score: 75 + (idxAmour * 3) % 22 },
    travail: { text: DAILY_TEXTS.travail[idxTravail], score: 72 + (idxTravail * 4) % 25 },
    argent: { text: DAILY_TEXTS.argent[idxArgent], score: 78 + (idxArgent * 2) % 20 },
    sante: { text: DAILY_TEXTS.sante[idxSante], score: 80 + (idxSante * 3) % 18 },
    conseil: DAILY_TEXTS.conseils[idxConseil]
  };
};

const MONTHLY_TRENDS_DATABASE = [
  "Ce mois-ci, les configurations sidérales majeures encouragent la consolidation des acquis et la clarté dans les ambitions. Votre capacité d'adaptation aux transits planétaires fera toute la différence dans vos projets personnels et professionnels. Restez à l'écoute de votre intuition profonde.",
  "Une période hautement transformatrice s'ouvre à vous. Les énergies cosmiques favorisent la concrétisation des aspirations de long terme, le renforcement des liens affectifs et la maîtrise de vos ressources matérielles. Cultivez la persévérance.",
  "Sous l'impulsion des cycles sidéraux réels, ce mois met en lumière votre potentiel créatif et votre leadership. C'est le moment idéal pour réajuster vos priorités, entreprendre de nouveaux projets et rayonner dans vos domaines d'excellence."
];

const generateMonthlyTrends = (signId, yearMonthStr) => {
  const signIndex = ZODIAC_SIGNS.findIndex(s => s.id === signId);
  const safeIndex = signIndex !== -1 ? signIndex : 0;

  let hash = 0;
  for (let i = 0; i < yearMonthStr.length; i++) {
    hash = (hash << 5) - hash + yearMonthStr.charCodeAt(i);
    hash |= 0;
  }
  hash = Math.abs(hash);

  const trend = MONTHLY_TRENDS_DATABASE[(safeIndex + hash) % MONTHLY_TRENDS_DATABASE.length];
  return {
    amour: `Sur le plan affectif : ${trend}`,
    travail: `Sur le plan professionnel : ${trend}`,
    argent: `Sur le plan financier : ${trend}`,
    sante: `Sur le plan de la vitalité : ${trend}`
  };
};

const DeveloperFooter = () => (
  <footer className="mt-8 mb-4 text-center">
    <a
      href="https://precieux6.github.io/mon-portfolio/#contact"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition-colors duration-200 bg-white/60 hover:bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-2xs"
    >
      <span>Développé par Précieux Trésor TOSSOU • Astrologie Sidérale & SaaS</span>
      <ExternalLink size={12} className="opacity-70" />
    </a>
  </footer>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('horoscope');
  const [selectedSign, setSelectedSign] = useState(ZODIAC_SIGNS[0]);
  
  const [birthdateInput, setBirthdateInput] = useState('1995-07-23');
  const [fullNameInput, setFullNameInput] = useState('Précieux Trésor TOSSOU');
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
      const profile = getDetailedProfileForDate(birthdateInput, fullNameInput);
      if (profile) setSearchedProfile(profile);
    }
  }, []);

  const handleProfileSearch = (e) => {
    e.preventDefault();
    if (!birthdateInput) return;
    const profile = getDetailedProfileForDate(birthdateInput, fullNameInput);
    if (profile) setSearchedProfile(profile);
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
                  Sidéral SaaS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden md:block">
                Astrologie Sidérale & Numérologie Avancée
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
              <span>Horoscope Sidéral</span>
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
              <CheckCircle2 size={12} /> Éphémérides Actives
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
                Horoscope Sidéral Quotidien
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
                Prévisions basées sur les constellations réelles pour le {todayFormatted}.
              </p>
            </div>

            <div className="bg-white p-3 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Choisissez votre signe sidéral :
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
                        <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">Sidéral • {sign.element}</p>
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
                  <span className="text-[10px] uppercase bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Constellation Sidérale</span>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">{selectedSign.name}</h3>
                  <p className="text-white/90 text-xs sm:text-sm mt-0.5 font-medium">{selectedSign.dates} • Élément {selectedSign.element}</p>
                  <p className="text-xs text-white/80 mt-0.5">Régent : <strong className="text-white">{selectedSign.planet}</strong></p>
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
                      <span className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase tracking-widest block">Conseil Céleste Sidéral</span>
                      <p className="text-xs sm:text-base italic text-purple-100 mt-0.5">"{currentHoroscope.conseil}"</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            <DeveloperFooter />

          </div>
        )}

        {/* ONGLET 2 : TENDANCES MENSUELLES */}
        {activeTab === 'mensuel' && (
          <div className="space-y-4 sm:space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-3xl mx-auto space-y-1 sm:space-y-2">
              <h2 className="text-xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Tendances Mensuelles Sidérales
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
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">{selectedSign.name} Sidéral</h3>
                  <p className="text-white/90 text-xs sm:text-sm mt-0.5 font-medium">{selectedSign.dates} • Élément {selectedSign.element}</p>
                </div>
              </div>

              <div className="p-4 sm:p-8 space-y-6">
                
                <div className="bg-rose-50/40 border border-rose-100 p-5 sm:p-7 rounded-2xl sm:rounded-3xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl"><Heart size={20} /></div>
                    <h4 className="text-base sm:text-lg font-bold text-rose-950">Amour & relations</h4>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">{currentMonthlyTrends.amour}</p>
                </div>

                <div className="bg-sky-50/40 border border-sky-100 p-5 sm:p-7 rounded-2xl sm:rounded-3xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-sky-100 text-sky-700 rounded-xl"><Briefcase size={20} /></div>
                    <h4 className="text-base sm:text-lg font-bold text-sky-950">Travail & carrière</h4>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">{currentMonthlyTrends.travail}</p>
                </div>

                <div className="bg-emerald-50/40 border border-emerald-100 p-5 sm:p-7 rounded-2xl sm:rounded-3xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl"><Wallet size={20} /></div>
                    <h4 className="text-base sm:text-lg font-bold text-emerald-950">Argent & finances</h4>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">{currentMonthlyTrends.argent}</p>
                </div>

                <div className="bg-amber-50/40 border border-amber-100 p-5 sm:p-7 rounded-2xl sm:rounded-3xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl"><Activity size={20} /></div>
                    <h4 className="text-base sm:text-lg font-bold text-amber-950">Santé & vitalité</h4>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">{currentMonthlyTrends.sante}</p>
                </div>

              </div>

            </div>

            <DeveloperFooter />

          </div>
        )}

        {/* ONGLET 3 : PROFILER SIDÉRAL & NUMÉROLOGIQUE */}
        {activeTab === 'profiler' && (
          <div className="space-y-4 sm:space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-3xl mx-auto space-y-1 sm:space-y-2">
              <h2 className="text-xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Profilage Sidéral & Numérologique
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
                Découvrez votre signe astronomique réel (sidéral) combiné à votre numérologie complète.
              </p>
            </div>

            <div className="max-w-xl mx-auto bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200">
              <form onSubmit={handleProfileSearch} className="space-y-3">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">
                    Nom et Prénoms (pour la numérologie) :
                  </label>
                  <input
                    type="text"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    placeholder="Ex: Précieux Trésor TOSSOU"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-300 focus:ring-2 focus:ring-purple-600 text-xs sm:text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">
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
                </div>
              </form>
            </div>

            {searchedProfile && (
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md border border-slate-200 p-4 sm:p-8 space-y-6 sm:space-y-8 animate-fadeIn">
                
                {/* EN-TÊTE DU PROFIL */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 bg-purple-50 rounded-2xl sm:rounded-3xl border border-purple-100 text-center sm:text-left">
                  <div className="flex items-center gap-4 flex-col sm:flex-row">
                    <span className="text-5xl sm:text-6xl">{searchedProfile.sign.symbol}</span>
                    <div>
                      <span className="text-[10px] sm:text-xs font-extrabold text-purple-700 uppercase">
                        Signe Sidéral Calculé • Année {searchedProfile.birthYear}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{searchedProfile.sign.name} Sidéral</h3>
                      <p className="text-xs text-slate-500">{searchedProfile.sign.dates} • Élément {searchedProfile.sign.element}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3.5 rounded-2xl border border-purple-200 text-xs text-purple-900 max-w-xs shadow-2xs text-left">
                    <strong className="block text-purple-950 font-bold mb-1">🔑 Transit Sidéral :</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{searchedProfile.dominantPlanet}</p>
                  </div>
                </div>

                {/* SECTION NUMÉROLOGIE */}
                <div className="space-y-4">
                  <h4 className="text-slate-900 font-extrabold text-base sm:text-lg flex items-center gap-2 border-b pb-2">
                    <BookOpen className="text-purple-700" size={20} /> ANALYSE NUMÉROLOGIQUE COMPLÈTE
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="bg-indigo-50/40 border border-indigo-100 p-4 sm:p-5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-900 uppercase">Chemin de Vie</span>
                        <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
                          {searchedProfile.numerology.lifePath}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                        {searchedProfile.numerology.lifePathText}
                      </p>
                    </div>

                    <div className="bg-purple-50/40 border border-purple-100 p-4 sm:p-5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-900 uppercase">Nombre d'Expression</span>
                        <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center">
                          {searchedProfile.numerology.expression}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                        {searchedProfile.numerology.expressionText}
                      </p>
                    </div>

                    <div className="bg-rose-50/40 border border-rose-100 p-4 sm:p-5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-900 uppercase">Élan Spirituel (Âme)</span>
                        <span className="w-7 h-7 rounded-full bg-rose-600 text-white font-extrabold text-xs flex items-center justify-center">
                          {searchedProfile.numerology.soul}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                        {searchedProfile.numerology.soulText}
                      </p>
                    </div>

                    <div className="bg-emerald-50/40 border border-emerald-100 p-4 sm:p-5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900 uppercase">Nombre Intime</span>
                        <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">
                          {searchedProfile.numerology.intimate}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                        {searchedProfile.numerology.intimateText}
                      </p>
                    </div>

                    <div className="bg-amber-50/40 border border-amber-100 p-4 sm:p-5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 uppercase">Année Personnelle ({new Date().getUTCFullYear()})</span>
                        <span className="w-7 h-7 rounded-full bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center">
                          {searchedProfile.numerology.personalYear}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                        {searchedProfile.numerology.personalYearText}
                      </p>
                    </div>

                    <div className="bg-sky-50/40 border border-sky-100 p-4 sm:p-5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-900 uppercase">Inclusion & Maturité</span>
                        <Clock size={16} className="text-sky-700" />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                        {searchedProfile.numerology.inclusionText} {searchedProfile.numerology.maturityText}
                      </p>
                    </div>

                  </div>
                </div>

                {/* QUALITÉS & DÉFAUTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
                    <h4 className="text-emerald-950 font-bold text-sm sm:text-base flex items-center gap-2">
                      <Award className="text-emerald-600" size={18} /> TOP 10 QUALITÉS
                    </h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {searchedProfile.qualities.map((item, idx) => (
                        <span key={idx} className="bg-white border border-emerald-200 text-emerald-900 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-lg">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50/50 border border-amber-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
                    <h4 className="text-amber-950 font-bold text-sm sm:text-base flex items-center gap-2">
                      <Info className="text-amber-600" size={18} /> TOP 10 DÉFAUTS
                    </h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {searchedProfile.flaws.map((item, idx) => (
                        <span key={idx} className="bg-white border border-amber-200 text-amber-900 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-lg">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SYNTHÈSE GLOBALE */}
                <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl space-y-3">
                  <h4 className="text-amber-300 font-black text-base sm:text-lg uppercase tracking-wider flex items-center gap-2">
                    <Star size={20} className="text-amber-400 fill-amber-400" /> Synthèse Sidérale & Numérologique
                  </h4>
                  <p className="text-purple-100 text-xs sm:text-sm leading-relaxed text-justify font-medium">
                    {searchedProfile.numerology.summaryText}
                  </p>
                </div>

                {/* DOMAINES D'EXCELLENCE */}
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
