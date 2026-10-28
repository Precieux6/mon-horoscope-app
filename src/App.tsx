import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Heart, Briefcase, Wallet, Activity, Calendar, Search, 
  Star, Award, CheckCircle2, Info, TrendingUp, Compass, Gift, ExternalLink, BookOpen, Clock
} from 'lucide-react';

// ============================================================================
// BASE DE DONNÉES SIDÉRALE (12 SIGNES DU ZODIAQUE)
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
    qualities: ["Loyal", "Patient", "Pragmatique", "Fiable", "Constance sidérale", "Épicurien", "Ancré", "Protecteur", "Solide", "Méthodique"],
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
// TEXTES QUOTIDIENS ET MENSUELS (8 à 10 phrases denses)
// ============================================================================

const DAILY_TEXTS = {
  amour: [
    "Les influences sidérales de Vénus apportent une clarté remarquable dans vos échanges affectifs du jour. En couple, l'écoute mutuelle et sincère permettra de dissiper définitivement les derniers non-dits. Célibataire, une rencontre magnétique et inattendue pourrait marquer un tournant émotionnel particulièrement inspirant. Osez exprimer vos sentiments profonds sans craindre le regard des autres. Votre vulnérabilité deviendra votre plus bel atout de séduction.",
    "Un climat passionnel, constructif et chaleureux enveloppe votre sphère sentimentale dès les premières lueurs du jour. Les astres récompensent grandement l'audace du cœur ainsi que la franchise de vos intentions partagées. Prenez le temps d'organiser une parenthèse exclusive avec l'élu de votre cœur pour raviver la flamme. Si vous cherchez l'âme sœur, votre rayonnement naturel attirera les bonnes énergies. La tendresse partagée sera la clé de votre équilibre intime.",
    "La configuration céleste invite à une profonde introspection romantique pour mieux comprendre vos désirs affectifs. En binôme, la complicité s'accroît à travers des projets simples et des rires complaisants. Laissez parler votre intuition première pour guider vos élans passionnés sans calcul excessif. Les tensions récentes s'évaporent naturellement sous l'effet d'une bienveillance réciproque. Profitez pleinement de chaque instant de douceur partagée."
  ],
  travail: [
    "Votre acuité intellectuelle, fortement stimulée par les transits planétaires du moment, favorise l'aboutissement rapide de vos dossiers prioritaires. Vos idées novatrices et audacieuses retiendront l'attention bienveillante de vos supérieurs hiérarchiques. C'est le moment idéal pour poser de nouveaux jalons stratégiques dans votre carrière. Veillez toutefois à maintenir une communication claire et apaisée avec vos collègues de bureau. Votre efficacité opérationnelle fera l'unanimité tout au long de la journée.",
    "La persévérance professionnelle que vous cultivez depuis des semaines porte enfin ses fruits de manière éclatante. Un leadership naturel et rassembleur vous permet de mobiliser efficacement vos collaborateurs autour d'un projet clé. Ne craignez pas de prendre de nouvelles responsabilités, car les astres soutiennent vos ambitions à long terme. Votre réactivité face aux imprévus techniques impressionnera durablement les décideurs. Savourez pleinement la reconnaissance légitime de vos efforts passés.",
    "Une journée très dynamique s'annonce sur le plan professionnel, marquée par des opportunités de collaboration inédites. Prenez des initiatives calculées pour réorienter un dossier complexe vers un succès garanti. Votre créativité technique et votre sens aigu de l'organisation débloqueront des situations figées. Restez ouvert aux suggestions constructives formulées par vos pairs les plus expérimentés. Votre rigueur quotidienne constitue le socle solide de votre ascension future."
  ],
  argent: [
    "La gestion rigoureuse et méthodique de vos finances personnelles consolide durablement votre assise matérielle. C'est une excellente journée pour réviser votre budget global et optimiser vos sources de revenus. Anticipez vos dépenses futures pour garder l'esprit totalement serein face aux fluctuations économiques. Vos efforts d'épargne commencent à payer de plus en plus clairement. La modération financière demeure le meilleur garant de votre tranquillité d'esprit.",
    "Stabilité pécuniaire et opportunité d'investissement judicieux se profilent au cœur de votre journée. Analysez minutieusement chaque petite clause contractuelle avant de vous engager sur le long terme. Votre perspicacité financière vous évitera des erreurs d'appréciation malvenues. Profitez de cette aisance passagère pour sécuriser vos arrières et gâter vos proches. La chance sourit aux esprits avisés qui savent patienter.",
    "Vos efforts d'épargne et votre pragmatisme inné vous mettent résolument à l'abri des mauvaises surprises. Maintenez cette discipline financière éclairée pour concrétiser vos projets d'avenir les plus chers. Une rentrée d'argent inattendue pourrait venir rééquilibrer un vieux poste de dépense. Écoutez votre bon sens paysan avant de valider une transaction importante. Votre prospérité matérielle progresse de façon saine et régulière."
  ],
  sante: [
    "Votre niveau d'énergie vitale est en nette hausse sous cette configuration astrale particulièrement stimulante. Pensez à bien vous hydrater et à vous oxygéner au grand air tout au long de cette journée active. Une activité physique modérée complètera idéalement votre quête de bien-être corporel. Votre organisme vous remercie pour cette attention quotidienne et bienveillante. Profitez de cette forme olympique pour accomplir vos objectifs.",
    "Une très bonne résistance physique générale vous accompagne du matin jusqu'au soir sans faille. Privilégiez des moments de respiration consciente pour évacuer les micro-tensions mentales accumulées. Votre capital santé bénéficie d'influences protectrices qui renforcent votre tonus immunitaire global. Accordez-vous des pauses de déconnexion numérique totale pour apaiser votre système nerveux. Votre corps rayonne d'une vitalité harmonieuse.",
    "L'équilibre entre votre corps et votre esprit s'établit avec une remarquable fluidité. Pratiquez une activité relaxante ou un sport tonique selon vos besoins réels du moment. Votre tonus resplendissant vous permet d'aborder vos tâches avec le sourire. Veillez toutefois à respecter une coupure salutaire dès les premières baisses de régime vespérales. Prenez soin de votre enveloppe corporelle avec douceur."
  ],
  conseils: [
    "Accordez-vous dix minutes de silence absolu en début de matinée pour fixer vos intentions calmes. Cette discipline intérieure guidera vos pas vers la sérénité la plus totale.",
    "Faites confiance à votre intuition première avant de vous perdre dans une sur-analyse stérile. Votre instinct possède une longueur d'avance inestimable.",
    "Simplifiez votre environnement immédiat pour clarifier instantanément vos pensées. Le rangement extérieur engendre toujours un apaisement intérieur profond."
  ]
};

// Bases spécifiques et distinctes pour chaque domaine des tendances mensuelles (8 à 10 phrases denses)
const MONTHLY_DATABASES = {
  amour: [
    "Ce mois-ci, les configurations sidérales majeures encouragent profondément la consolidation de vos liens affectifs et la sincérité absolue dans le dialogue à deux. C'est une période idéale pour dissiper les non-dits et poser de nouvelles bases relationnelles durables. Si vous êtes engagé dans une relation, la complicité se renforcera à travers des projets communs stimulants et des moments de partage privilégiés. Les astres favorisent également les moments d'introspection romantique, permettant de mieux comprendre les besoins cachés de votre partenaire. Pour les célibataires, le mois s'annonce riche en surprises relationnelles et en rencontres enrichissantes dans des cadres inhabituels. Ne restez pas retranché dans vos habitudes routinières et sortez résolument de votre zone de confort. Votre charme naturel rayonnera intensément, attirant irrésistiblement des personnes partageant vos aspirations profondes. Prenez le temps d'observer avant de vous engager émotionnellement, car la patience sera votre meilleure alliée pour bâtir une histoire solide. En fin de mois, un événement inopiné transformera positivement votre vision de la vie sentimentale.",
    "Un climat passionnel, constructif et profondément transformateur enveloppe votre vie sentimentale tout au long de ce mois. Les projets à deux prennent une impulsion inattendue, vous poussant à concrétiser des envies longtemps remises à plus tard par manque de temps. Les tensions passées s'estompent pour laisser place à une écoute mutuelle et bienveillante de chaque instant. Si vous traversez une phase de doute, ce mois vous offre l'opportunité royale de clarifier vos sentiments avec beaucoup de sagesse. Pour les cœurs solitaires, une attirance magnétique pourrait naître dans un cadre professionnel ou culturel inattendu. L'audace sera amplement récompensée, alors n'hésitez pas à exprimer clairement vos intentions affectives les plus sincères. Les influences bienveillantes de Vénus garantissent des moments de tendresse inoubliables et un magnifique renouveau de la flamme. Veillez toutefois à ne pas imposer un rythme trop effréné à votre partenaire, car chacun a grand besoin de son espace personnel. Cultivez la tolérance et la spontanéité pour traverser ce cycle astral sous les meilleurs auspices.",
    "La patience, la diplomatie et l'écoute attentive seront vos meilleurs atouts relationnels ce mois-ci pour rééquilibrer l'harmonie cosmique. Si des désaccords récents ont fragilisé votre couple, les astres vous invitent à renouer le dialogue avec un calme olympien et beaucoup d'empathie. C'est le moment privilégié pour pardonner, tourner définitivement la page et repartir sur des fondations émotionnelles saines. Les célibataires bénéficieront d'un rayonnement discret mais particulièrement captivant pour les esprits fins et curieux. Plutôt que de multiplier les aventures éphémères, vous rechercherez instinctivement la profondeur et l'authenticité chez l'autre. Les discussions nocturnes et les partages intellectuels nourriront intensément votre besoin de connexion vraie. Votre intuition sera un guide infaillible pour repérer les profils toxiques et vous tourner vers les bonnes personnes. Profitez pleinement de cette période pour cultiver l'amour de soi, car c'est en étant en paix avec vous-même que vous attirerez l'harmonie durable."
  ],
  travail: [
    "Le mois est marqué par une accélération fulgurante de vos projets professionnels et de vos ambitions personnelles les plus chères. Votre capacité d'adaptation hors du commun fera toute la différence face aux défis complexes qui se présenteront à vous. C'est le moment idéal pour faire valoir vos compétences, proposer des idées novatrices et impressionner durablement votre hiérarchie. Si vous portez un projet de création ou de reconversion, les planètes alignent leurs énergies pour vous soutenir sans faille. Ne craignez pas de prendre des responsabilités supplémentaires, car votre leadership naturel saura mobiliser les équipes autour de vous. Restez toutefois vigilant face au stress et veillez à structurer rigoureusement votre emploi du temps pour éviter l'épuisement. Les collaborations à l'international ou les échanges avec des experts extérieurs s'avéreront extrêmement fructueux. En fin de période, une reconnaissance tangible de vos efforts couronnera votre persévérance et validera vos choix stratégiques.",
    "Une période particulièrement faste s'ouvre à vous pour la reconnaissance de vos efforts passés et de votre rigueur quotidienne au bureau. Des opportunités d'évolution de carrière, de promotion fulgurante ou de collaboration stratégique se profilent nettement à l'horizon. Votre créativité technique et votre sens aigu de l'analyse vous permettront de résoudre des situations bloquées depuis des semaines. N'hésitez pas à endosser un rôle de mentor ou de guide auprès de collaborateurs plus juniors, cela valorisera grandement votre expertise. Les négociations salariales ou les revalorisations de contrats bénéficient d'un excellent influx astral qu'il faut saisir. Gardez néanmoins les pieds sur terre et conservez une approche méthodique face aux propositions trop séduisantes en apparence. Votre réputation professionnelle sortira grandie de ce cycle, renforçant durablement votre position sur le marché. C'est le moment idéal pour semer les graines de vos succès futurs à long terme.",
    "Concentrez-vous prioritairement sur la structuration à long terme et la consolidation minutieuse de vos dossiers en cours de traitement. Ce mois favorise grandement la rigueur méthodologique, l'apurement des tâches administratives et l'optimisation des processus de travail. Si vous ressentez une certaine lassitude dans vos fonctions actuelles, profitez de ce mois pour réévaluer sereinement vos objectifs de carrière. Des formations qualifiantes ou l'apprentissage de nouvelles compétences enrichiront grandement votre profil sur le marché. Les relations avec vos collègues et supérieurs seront empreintes de constructivité, à condition d'éviter l'entêtement stérile. Cultivez la flexibilité mentale lorsque des imprévus viendront bousculer votre planning initialement établi. Votre persévérance silencieuse finira par porter ses fruits de la manière la plus éclatante qui soit. Restez concentré sur l'excellence de votre travail et ne vous laissez pas distraire par les bruits de couloir."
  ],
  argent: [
    "La gestion de vos finances personnelles demande de la prévoyance et de la lucidité tout au long de ce mois de transition. Évitez absolument les investissements impulsifs dictés par des coups de tête ou des sollicitations commerciales trop agressives. Privilégiez résolument la constitution ou le renforcement d'une épargne de sécurité face aux incertitudes économiques mondiales. C'est un cycle particulièrement propice à l'audit rigoureux de vos abonnements, dépenses superflues et charges fixes. Si vous envisagez un achat immobilier ou un placement financier d'envergure, prenez le temps de consulter des spécialistes. La modération et la discipline budgétaire d'aujourd'hui garantissent votre sérénité matérielle de demain. Une rentrée d'argent inattendue, liée à un vieux dossier, pourrait vous inciter à la légèreté : résistez à la tentation du gaspillage. En adoptant une posture de gestionnaire avisé, vous consoliderez durablement votre assise patrimoniale.",
    "Un mois globalement stable sur le plan pécuniaire, particulièrement propice à la révision de votre budget et à la planification avisée. Vous bénéficiez d'une lucidité remarquable pour identifier les placements porteurs et sécuriser vos sources de revenus. Si vous gérez une entreprise ou des finances partagées, la transparence totale sera la clé pour éviter les malentendus. Une opportunité de diversification de vos revenus pourrait se présenter par le biais d'une activité secondaire ou d'un investissement astucieux. Ne précipitez aucune signature de contrat financier sans avoir lu attentivement chaque ligne des petites clauses. Votre patience sera largement récompensée par une croissance progressive et saine de votre capital personnel. Profitez de cette stabilité pour planifier sereinement vos futurs projets de vie ou voyages à venir. L'équilibre monétaire que vous construisez maintenant vous apportera un confort psychologique inestimable.",
    "Des rentrées d'argent inattendues, une prime méritée ou une opportunité de réaménagement budgétaire viendront grandement alléger vos charges ce mois-ci. Profitez de cette bouffée d'oxygène financière pour solder des dettes anciennes et réassainir définitivement vos comptes bancaires. Les astres favorisent les transactions honnêtes, les règlements de successions ou les négociations de prêts aux taux avantageux. Néanmoins, veillez à ne pas modifier radicalement votre train de vie face à cette amélioration passagère. Restez fidèle aux principes de modération et d'épargne qui font votre force depuis de longues années. C'est également le moment idéal pour faire preuve de générosité mesurée envers vos proches ou soutenir une cause qui vous tient à cœur. Votre rapport à l'argent gagne en maturité et en apaisement profond. La sécurité matérielle n'est plus une source d'anxiété, mais un outil puissant au service de votre liberté d'action."
  ],
  sante: [
    "Votre niveau de vitalité et votre énergie physique globale sont en phase de transition importante ce mois-ci. Par conséquent, veillez à accorder une importance capitale à la qualité de votre sommeil et à une récupération régulière. Le surmenage professionnel ou l'accumulation de petits stress du quotidien pourraient se faire ressentir sur votre immunité. Intégrez des temps de pause, de silence et de déconnexion numérique absolue dans votre routine quotidienne. Une activité physique douce, comme le yoga ou la natation, vous aidera à relâcher les tensions musculaires. Soyez également très attentif à votre alimentation en privilégiant des produits frais, de saison et vivants. Votre corps réclame de la bienveillance et un retour aux sources salutaire. En respectant vos limites biologiques, vous traverserez ce mois en conservant un équilibre intérieur remarquable et une sérénité retrouvée.",
    "Un magnifique regain d'énergie globale vous pousse à adopter de nouvelles routines de bien-être beaucoup plus saines et durables. C'est le moment idéal pour entreprendre une détox, reprendre en main votre condition physique ou démarrer un sport stimulant. Votre métabolisme répondra merveilleusement bien aux efforts modérés et réguliers que vous lui proposerez. Sur le plan psychologique, votre optimisme naturel revient en force, chassant les ruminations mentales et l'anxiété. Profitez de ce dynamisme pour passer du temps au grand air, vous oxygéner en forêt ou près de l'eau. Votre clarté d'esprit sera redoutable pour prendre de bonnes résolutions concernant votre hygiène de vie. Veillez toutefois à ne pas dilapider votre capital énergétique dans des excès d'enthousiasme soudains. La clé réside dans la constance, la régularité et l'écoute fine des signaux de votre organisme.",
    "L'équilibre mental, la paix intérieure et la gestion émotionnelle se trouvent au tout premier plan de vos priorités ce mois-ci. Prenez activement du temps pour vous ressourcer loin de l'agitation urbaine, du bruit et du stress relationnel. La pratique de la méditation, de la cohérence cardiaque ou de la lecture au calme apaisera durablement votre système nerveux. Votre corps physique a besoin de douceur, de massages, de bains chauds et d'un repos bien mérité. Si des petits bobos chroniques refaisaient surface, prenez-les en charge avec sérieux sans les négliger. Cultivez la gratitude au quotidien et entourez-vous exclusivement de personnes bienveillantes qui élèvent votre taux vibratoire. Ce mois est une véritable cure de jouvence spirituelle et corporelle si vous acceptez de ralentir la cadence. Votre force intérieure en ressortira magnifiquement régénérée et consolidée pour l'avenir."
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

const generateMonthlyTrends = (signId, yearMonthStr) => {
  const signIndex = ZODIAC_SIGNS.findIndex(s => s.id === signId);
  const safeIndex = signIndex !== -1 ? signIndex : 0;

  let hash = 0;
  for (let i = 0; i < yearMonthStr.length; i++) {
    hash = (hash << 5) - hash + yearMonthStr.charCodeAt(i);
    hash |= 0;
  }
  hash = Math.abs(hash);

  const idxAmour = (safeIndex + hash) % MONTHLY_DATABASES.amour.length;
  const idxTravail = (safeIndex + hash + 1) % MONTHLY_DATABASES.travail.length;
  const idxArgent = (safeIndex + hash + 2) % MONTHLY_DATABASES.argent.length;
  const idxSante = (safeIndex + hash + 3) % MONTHLY_DATABASES.sante.length;
  const idxConseil = (safeIndex + hash + 4) % DAILY_TEXTS.conseils.length;

  return {
    amour: { text: MONTHLY_DATABASES.amour[idxAmour], score: 78 + (idxAmour * 2) % 20 },
    travail: { text: MONTHLY_DATABASES.travail[idxTravail], score: 74 + (idxTravail * 3) % 23 },
    argent: { text: MONTHLY_DATABASES.argent[idxArgent], score: 76 + (idxArgent * 4) % 21 },
    sante: { text: MONTHLY_DATABASES.sante[idxSante], score: 81 + (idxSante * 2) % 17 },
    conseil: DAILY_TEXTS.conseils[idxConseil]
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

        {/* ONGLET 2 : TENDANCES MENSUELLES (Même disposition rigoureuse que le journalier) */}
        {activeTab === 'mensuel' && (
          <div className="space-y-4 sm:space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-3xl mx-auto space-y-1 sm:space-y-2">
              <h2 className="text-xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Tendances Mensuelles Sidérales
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
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">{selectedSign.name} Sidéral</h3>
                  <p className="text-white/90 text-xs sm:text-sm mt-0.5 font-medium">{selectedSign.dates} • Élément {selectedSign.element}</p>
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
                      <span className="text-xs font-extrabold bg-rose-100 text-rose-900 px-2.5 py-0.5 rounded-full">{currentMonthlyTrends.amour.score}%</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">{currentMonthlyTrends.amour.text}</p>
                  </div>

                  <div className="bg-sky-50/40 border border-sky-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-sky-100 text-sky-700 rounded-xl"><Briefcase size={18} /></div>
                        <h4 className="text-sm sm:text-base font-bold text-sky-950">Travail & carrière</h4>
                      </div>
                      <span className="text-xs font-extrabold bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-full">{currentMonthlyTrends.travail.score}%</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">{currentMonthlyTrends.travail.text}</p>
                  </div>

                  <div className="bg-emerald-50/40 border border-emerald-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl"><Wallet size={18} /></div>
                        <h4 className="text-sm sm:text-base font-bold text-emerald-950">Argent & finances</h4>
                      </div>
                      <span className="text-xs font-extrabold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">{currentMonthlyTrends.argent.score}%</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">{currentMonthlyTrends.argent.text}</p>
                  </div>

                  <div className="bg-amber-50/40 border border-amber-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-amber-100 text-amber-800 rounded-xl"><Activity size={18} /></div>
                        <h4 className="text-sm sm:text-base font-bold text-amber-950">Santé & vitalité</h4>
                      </div>
                      <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">{currentMonthlyTrends.sante.score}%</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">{currentMonthlyTrends.sante.text}</p>
                  </div>

                </div>

                <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-lg shrink-0">💡</div>
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase tracking-widest block">Conseil Mensuel Sidéral</span>
                      <p className="text-xs sm:text-base italic text-purple-100 mt-0.5">"{currentMonthlyTrends.conseil}"</p>
                    </div>
                  </div>
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
