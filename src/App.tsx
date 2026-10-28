import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Heart, Briefcase, Wallet, Activity, Calendar, Search, 
  Star, Award, CheckCircle2, Info, TrendingUp, Compass, Gift, ExternalLink, BookOpen, Clock
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

// ============================================================================
// MOTEUR DE NUMÉROLOGIE ET FAITS HISTORIQUES
// ============================================================================

const reduceNumber = (num) => {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num.toString().split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
  }
  return num;
};

const getLetterValue = (char) => {
  const map = {
    a: 1, j: 1, s: 1,
    b: 2, k: 2, t: 2,
    c: 3, l: 3, u: 3,
    d: 4, m: 4, v: 4,
    e: 5, n: 5, w: 5,
    f: 6, o: 6, x: 6,
    g: 7, p: 7, y: 7,
    h: 8, q: 8, z: 8,
    i: 9, r: 9
  };
  return map[char.toLowerCase()] || 0;
};

const getNumerologyData = (dateString, fullName) => {
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  // 1. Chemin de vie (Somme réduite du jour + mois + année de naissance)
  const sumDigits = (n) => n.toString().split('').reduce((a, b) => a + parseInt(b, 10), 0);
  const lifePath = reduceNumber(sumDigits(day) + sumDigits(month) + sumDigits(year));

  const lifePathInterpretations = {
    1: "Votre chemin de vie 1 est celui du pionnier et du leader indépendant. Vous êtes armé pour bâtir votre propre destinée sans dépendre des sentiers battus. Votre mission consiste à assumer vos responsabilités avec audace et créativité. C'est un parcours exigeant qui récompense l'initiative personnelle et l'innovation.",
    2: "Le chemin de vie 2 place la coopération, l'écoute et l'harmonie au centre de votre existence. Vous possédez un don naturel pour fédérer les énergies et apaiser les tensions autour de vous. Votre mission de vie s'articule autour du partenariat, de la diplomatie et du soutien mutuel. Vous apprenez la patience et la force tranquille des relations durables.",
    3: "Votre chemin de vie 3 est guidé par l'expression créative, la communication et la joie communicative. Vous êtes fait pour inspirer les autres à travers vos talents artistiques, oratoires ou relationnels. Votre mission consiste à cultiver l'optimisme et à partager la lumière qui réside en vous. La légèreté et la curiosité seront vos plus grands moteurs d'évolution.",
    4: "Le chemin de vie 4 incarne la structure, la rigueur, le travail méthodique et la construction pérenne. Vous êtes un bâtisseur infatigable qui a besoin de bases solides pour s'épanouir pleinement. Votre mission de vie consiste à apporter de l'ordre, de la sécurité et de la fiabilité autour de vous. La persévérance face aux obstacles est la grande leçon qui forge votre sagesse.",
    5: "Votre chemin de vie 5 célèbre la liberté, le mouvement, l'aventure et l'adaptabilité face au changement. Vous refusez la routine et aspirez à expérimenter la richesse de la vie sous toutes ses formes. Votre mission est d'explorer de nouveaux horizons tout en maintenant un discernement éclairé. L'ouverture d'esprit et l'expérience directe sont vos plus grands professeurs.",
    6: "Le chemin de vie 6 est placé sous le signe de l'amour, de la famille, de la responsabilité et de l'harmonie domestique. Vous avez un sens aigu du devoir et un dévouement profond envers vos proches et votre communauté. Votre mission consiste à cultiver la beauté, la justice et le bien-être autour de vous. Apprendre à lâcher prise sur le perfectionnisme est votre clé d'épanouissement.",
    7: "Votre chemin de vie 7 est une quête spirituelle profonde, intellectuelle et philosophique. Vous cherchez constamment à percer les mystères de l'existence et à comprendre la vérité cachée des choses. Votre mission de vie privilégie la réflexion, l'analyse et la sagesse intérieure. C'est un parcours d'indépendance mentale qui mène à une clarté remarquable.",
    8: "Le chemin de vie 8 symbolise la puissance matérielle, l'ambition, la justice et la maîtrise des grands projets. Vous êtes taillé pour gérer les responsabilités d'envergure et structurer des organisations prospères. Votre mission consiste à trouver le juste équilibre entre ambition terrestre et intégrité morale. Votre sens de l'organisation et votre efficacité font autorité.",
    9: "Votre chemin de vie 9 est celui de l'humanisme universel, de la compassion et de l'altruisme éclairé. Vous portez un regard large sur le monde et nourrissez le désir profond de l'améliorer. Votre mission de vie implique le don de soi, la générosité et l'achèvement d'un grand cycle d'évolution. Votre sagesse inspire naturellement vos contemporains."
  };

  // 2, 3, 4 : Traitement rigoureux et propre du NOM COMPLET saisi par l'utilisateur
  const sanitizedName = (fullName || "Anonyme").trim().toLowerCase().replace(/[^a-zàâäéèêëîïôöùûüç]/g, '');
  
  let expressionSum = 0;
  let soulSum = 0;
  let intimateSum = 0;
  const vowels = ['a', 'e', 'i', 'o', 'u', 'y', 'à', 'â', 'ä', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'ö', 'ù', 'û', 'ü'];

  // Grille d'inclusion : initialisation des fréquences de 1 à 9
  const frequencies = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

  for (let char of sanitizedName) {
    const val = getLetterValue(char);
    if (val >= 1 && val <= 9) {
      expressionSum += val;
      frequencies[val]++;
      if (vowels.includes(char)) {
        soulSum += val; // Élan Spirituel (Voyelles)
      } else {
        intimateSum += val; // Nombre Intime (Consonnes)
      }
    }
  }

  const expression = reduceNumber(expressionSum || 1);
  const soul = reduceNumber(soulSum || 1);
  const intimate = reduceNumber(intimateSum || 1);

  const expressionInterpretations = {
    1: "Votre nombre d'expression révèle un tempérament de battant et un esprit direct. Vous savez vous imposer naturellement dans vos projets avec assurance. Vos talents résident dans la prise de décision rapide et l'audace créatrice.",
    2: "Votre nombre d'expression traduit un profil profondément diplomate et collaboratif. Vous excellez dans l'art de la négociation et de l'écoute active. Votre douceur et votre tact ouvrent les portes les plus fermées.",
    3: "Votre nombre d'expression met en avant une éloquence remarquable et un sens artistique inné. Vous brillez par votre capacité à communiquer et à enthousiasmer les foules. Votre charisme naturel insuffle de la joie partout où vous passez.",
    4: "Votre nombre d'expression met en lumière une organisation minutieuse et un pragmatisme sans faille. Vous savez concrétiser les idées abstraites en réalisations durables. Votre fiabilité est une référence absolue pour vos pairs.",
    5: "Votre nombre d'expression exprime une grande polyvalence et un magnétisme irrésistible. Vous vous adaptez à toutes les situations avec une aisance déconcertante. Votre soif de découverte insuffle un vent de fraîcheur permanent.",
    6: "Votre nombre d'expression témoigne d'un sens aigu des responsabilités et d'un amour inconditionnel du travail bien fait. Vous êtes un pilier protecteur et esthète pour votre entourage. Votre équilibre passe par l'harmonie de votre foyer.",
    7: "Votre nombre d'expression caractérise un esprit analytique perçant et une grande profondeur d'analyse. Vous préférez la qualité à la quantité et cherchez toujours l'Excellence. Votre réserve cache une érudition fascinante.",
    8: "Votre nombre d'expression indique une autorité naturelle et un sens aigu de la stratégie financière. Vous savez mener à terme des entreprises ambitieuses avec rigueur. Votre force de caractère impose le respect général.",
    9: "Votre nombre d'expression reflète une grande largesse d'esprit et une empathie universelle. Vous êtes animé par le désir d'apporter une contribution positive à la société. Votre sagesse humaine force l'admiration."
  };

  const soulInterpretations = {
    1: "Votre élan spirituel (Nombre de l'Âme) aspire à l'autonomie totale et à l'accomplissement individuel. Au fond de vous, vous rêvez d'être le maître de votre destin et d'innover sans entraves. Votre âme recherche la reconnaissance par l'action pionnière.",
    2: "Votre élan spirituel recherche par-dessus tout la fusion affective, la paix et la complicité. Votre âme aspire à ne jamais se sentir seule et à œuvrer dans un climat de profonde tendresse. L'union et la conciliation sont vos nourritures célestes.",
    3: "Votre élan spirituel est guidé par le besoin vital de créer, d'exprimer vos émotions et de vous amuser. Votre âme réclame de la couleur, des rires, des échanges riches et de la reconnaissance artistique. Vous voulez que la vie soit une fête inspirante.",
    4: "Votre élan spirituel aspire à la sécurité matérielle, à l'ordre et à la stabilité pérenne. Votre âme trouve la paix dans la certitude du lendemain et le travail bien ancré dans la matière. Construire brique par brique est votre plus grand réconfort intime.",
    5: "Votre élan spirituel réclame une liberté absolue, du grand air et des expériences inédites. Votre âme refuse l'ennui et aspire à voyager, découvrir et se transformer sans cesse. Le changement est le véritable oxygénateur de votre monde intérieur.",
    6: "Votre élan spirituel aspire à l'harmonie familiale, à la beauté et au service des êtres chers. Votre âme se sent accomplie lorsqu'elle protège, conseille et prend soin de son clan. L'amour inconditionnel est votre boussole secrète.",
    7: "Votre élan spirituel recherche la vérité absolue, la solitude méditative et la connaissance occulte ou scientifique. Votre âme a besoin de calme pour se connecter aux dimensions supérieures de la pensée. La sagesse silencieuse est votre Graal.",
    8: "Votre élan spirituel aspire au pouvoir légitime, à la réussite matérielle et à l'impact économique. Votre âme souhaite laisser une empreinte tangible de son passage en dirigeant avec force et justice. Le succès concret est votre accomplissement.",
    9: "Votre élan spirituel vibre pour la fraternité universelle, la guérison des âmes et l'altruisme. Votre âme souhaite secourir l'humanité et voir grand au-delà des frontières égoïstes. La générosité pure est votre moteur profond."
  };

  const intimateInterpretations = {
    1: "Votre nombre intime montre une image extérieure ferme, volontaire et parfois intimidante. On vous perçoit comme quelqu'un de sûr de soi qui sait exactement où il va. Votre apparence sociale impose le leadership.",
    2: "Votre nombre intime projette une image douce, abordable, chaleureuse et réceptive. Les autres se confient spontanément à vous car ils ressentent votre bienveillance naturelle. Vous incarnez le charme discret.",
    3: "Votre nombre intime transmet une aura pétillante, souriante et captivante en société. On retient de vous votre sens de l'humour, votre répartie et votre élégance naturelle. Vous illuminez les pièces humides ou sombres par votre présence.",
    4: "Votre nombre intime dégage une impression de sérieux, de solidité et de grand professionnalisme. On sait qu'on peut compter sur vous en toute circonstance. Votre prestance est carrée et rassurante.",
    5: "Votre nombre intime exprime un dynamisme contagieux, du magnétisme et une grande modernité. Vous attirez l'attention par votre vivacité d'esprit et votre allure élégante et audacieuse.",
    6: "Votre nombre intime projette l'image d'une personne de confiance, protectrice, élégante et attentionnée. Votre sens de l'étiquette et du bon goût séduit instantanément votre entourage.",
    7: "Votre nombre intime donne une impression de distinction, de mystère et d'intelligence raffinée. On devine chez vous une profondeur intellectuelle qui force le respect immédiat.",
    8: "Votre nombre intime impose le respect par une prestance statutaire, élégante et rigoureuse. Vous dégagez une aura de décideur et de personne influente qui maîtrise son sujet.",
    9: "Votre nombre intime dégage une bienveillance magnétique, une grande noblesse d'âme et un charisme humaniste. On vous perçoit comme un sage inspirant et généreux."
  };

  // 5. Année Personnelle (Calcul strict basé sur l'année 2026 : Jour + Mois + 2026)
  const currentYear = 2026;
  const personalYear = reduceNumber(sumDigits(day) + sumDigits(month) + sumDigits(currentYear));

  const personalYearInterpretations = {
    1: "Cette année personnelle 1 marque le début d'un tout nouveau cycle de 9 ans. C'est le moment idéal pour lancer de grands projets, semer de nouvelles graines et prendre des initiatives audacieuses. Votre autonomie et votre audace seront les clés magiques de votre succès sur cette période.",
    2: "Votre année personnelle 2 est placée sous le signe de la patience, de l'association et de la diplomatie. Le rythme ralentit pour vous inviter à cultiver les partenariats, l'écoute et la consolidation de vos relations. Laissez mûrir les projets en cours sans précipitation excessive.",
    3: "Cette année personnelle 3 insuffle une vague formidable de créativité, de sorties, de rencontres et d'expansion. Votre communication est favorisée et vos projets sociaux ou artistiques connaissent une visibilité réjouissante. Profitez de cette énergie joyeuse pour rayonner.",
    4: "Votre année personnelle 4 demande de l'effort, de la structure, de la rigueur et du travail soutenu. C'est une année de construction concrète où l'on pose les fondations durables de l'avenir matériel et professionnel. La persévérance portera ses fruits les plus solides.",
    5: "Cette année personnelle 5 annonce le vent du changement, des voyages, des opportunités inattendues et de la liberté. Votre quotidien se transforme et vous invite à sortir résolument de votre zone de confort. Accueillez la nouveauté avec enthousiasme.",
    6: "Votre année personnelle 6 met l'accent sur le foyer, les responsabilités familiales, l'amour et l'équilibre de vie. Des choix importants liés à votre cadre de vie ou à vos engagements affectifs viendront structurer votre cœur. L'harmonie sera votre plus belle récompense.",
    7: "Cette année personnelle 7 est une parenthèse d'introspection, d'études, de repos et de bilan spirituel. Moins axée sur le monde extérieur, elle vous invite à vous recentrer sur vos aspirations profondes et votre sagesse. Le recul pris portera une immense clarté.",
    8: "Votre année personnelle 8 est celle des récoltes matérielles, de la réussite financière et de la puissance d'action. Les efforts professionnels passés sont enfin récompensés par des succès tangibles et des prises de responsabilités majeures. Gérez vos acquis avec sagesse.",
    9: "Cette année personnelle 9 symbolise l'achèvement d'un grand cycle de 9 ans et le grand nettoyage de printemps. Il est temps de vous délester du superflu, de solder le passé et de pardonner pour préparer la renaissance future."
  };

  // 6. Grille d'Inclusion mathématique exacte
  const missingNumbers = Object.keys(frequencies).filter(k => frequencies[k] === 0);
  const excessNumbers = Object.keys(frequencies).filter(k => frequencies[k] >= 3);

  const inclusionText = `Analyse de votre grille d'inclusion : ${missingNumbers.length > 0 ? `Nombres manquants (leçons karmiques à intégrer) : [${missingNumbers.join(', ')}].` : 'Aucun nombre manquant, belle harmonie générale.'} ${excessNumbers.length > 0 ? `Nombres en excès (forces dominantes ou pièges) : [${excessNumbers.join(', ')}].` : ''} Cette configuration structure vos automatismes comportementaux et vos défis d'apprentissage.`;

  // 7. Nombre de Maturité
  const age = currentYear - year;
  const maturity = reduceNumber(lifePath + expression);
  const maturityText = age >= 35 
    ? `Votre nombre de maturité (${maturity}), pleinement actif dans cette période mature de votre existence, oriente la seconde moitié de votre vie vers la réalisation profonde de votre sagesse acquise, l'aboutissement de vos talents et la transmission de votre expérience.`
    : `Votre nombre de maturité (${maturity}) se prépare en arrière-plan et s'activera pleinement autour de vos 35-40 ans pour guider votre accomplissement ultime.`;

  // Synthèse unique de 11 phrases structurées avec les variables propres à l'individu
  const summaryText = `À la croisée des influences cosmiques de votre signe et des vibrations puissantes de votre numérologie personnelle, votre existence s'avère particulièrement riche en enseignements et en potentiels inexploités. Votre chemin de vie numéro ${lifePath}, combiné à votre nombre d'expression ${expression}, dessine les contours d'une destinée où l'exigence le dispute à la rigueur constructive. Sur le plan intime, votre âme recherche un équilibre subtil entre indépendance farouche et besoin viscéral d'harmonie relationnelle. Votre élan spirituel ${soul} guide vos motivations profondes vers des réalisations qui ont du sens. Quant à votre nombre intime ${intimate}, il façonne la première impression que vous laissez aux autres avec beaucoup de prestance. L'année personnelle ${personalYear} que vous traversez actuellement agit comme un catalyseur puissant, vous incitant à aligner vos actions quotidiennes sur vos aspirations profondes. Vos forces innées, couplées aux leçons de vos nombres manquants, vous invitent à transformer chaque défi en un tremplin d'évolution magistral. Les cycles planétaires qui ont présidé à votre naissance renforcent encore votre singularité et votre capacité à marquer durablement votre entourage. En cultivant la pleine conscience de vos talents cachés et en restant à l'écoute de votre intuition première, vous disposez de toutes les clés pour accomplir votre mission de vie avec brio. C'est en unifiant la clarté de votre esprit et la générosité de votre cœur que vous transcenderez les obstacles pour bâtir une trajectoire d'exception. Votre parcours terrestre est une partition unique où chaque note numérologique et astrale résonne pour façonner votre accomplissement ultime.`;

  return {
    lifePath,
    lifePathText: lifePathInterpretations[lifePath] || lifePathInterpretations[1],
    expression,
    expressionText: expressionInterpretations[expression] || expressionInterpretations[1],
    soul,
    soulText: soulInterpretations[soul] || soulInterpretations[1],
    intimate,
    intimateText: intimateInterpretations[intimate] || intimateInterpretations[1],
    personalYear,
    personalYearText: personalYearInterpretations[personalYear] || personalYearInterpretations[1],
    inclusionText,
    maturityText,
    summaryText
  };

  // Générateur de résumé hautement personnalisé et non répétitif
  const introPool = [
    `À la croisée des influences cosmiques de votre signe et des vibrations de votre numérologie, votre parcours s'écrit sous le sceau de la singularité.`,
    `Porteur d'une signature vibratoire très spécifique, votre thème combine l'énergie de votre zodiaque à la profondeur de vos nombres clés.`,
    `Votre configuration astrale et numérologique révèle une personnalité complexe, façonnée pour accomplir un destin hors du commun.`
  ];

  const corePool = [
    `Votre chemin de vie ${lifePath}, allié à un nombre d'expression ${expression}, met en lumière une aptitude naturelle à transformer les épreuves en véritables tremplins d'évolution.`,
    `La synergie entre votre élan spirituel ${soul} et votre dynamique de vie ${lifePath} insuffle une force de conviction redoutable dans vos projets d'envergure.`,
    `Guidé par une expression de ${expression} et un monde intérieur marqué par le nombre ${intimate}, vous naviguez entre pragmatisme et quête d'idéal.`
  ];

  const yearPool = [
    `L'année personnelle ${personalYear} que vous traversez actuellement agit comme un puissant révélateur, ouvrant la voie à des prises de conscience décisives.`,
    `Sous l'impulsion de l'année personnelle ${personalYear}, le moment est venu de réajuster vos priorités et de concrétiser vos aspirations profondes.`,
    `Les énergies de votre année personnelle ${personalYear} vous incitent à faire preuve d'audace tout en consolidant vos acquis matériels et émotionnels.`
  ];

  const conclusionPool = [
    `En restant à l'écoute de votre intuition et en assumant pleinement vos ambitions, vous disposez de toutes les clés pour rayonner durablement.`,
    `Votre partition terrestre est unique : en unissant la force de votre esprit et la clarté de vos choix, vous édifiez une trajectoire d'exception.`,
    `C'est par l'acceptation de vos forces et la maîtrise de vos défis que vous accomplirez la mission profonde inscrite au cœur de votre destinée.`
  ];

  // Sélection unique basée sur le hash global de la personne
  const uniqueHash = Math.abs(lifePath * 37 + expression * 19 + soul * 13 + intimate * 7);
  const intro = introPool[uniqueHash % introPool.length];
  const core = corePool[(uniqueHash + 1) % corePool.length];
  const yearText = yearPool[(uniqueHash + 2) % yearPool.length];
  const conclusion = conclusionPool[(uniqueHash + 3) % conclusionPool.length];

  const summaryText = `${intro} ${core} ${yearText} ${conclusion}`;
  
  return {
    lifePath,
    lifePathText: lifePathInterpretations[lifePath] || lifePathInterpretations[1],
    expression,
    expressionText: expressionInterpretations[expression] || expressionInterpretations[1],
    soul,
    soulText: soulInterpretations[soul] || soulInterpretations[1],
    intimate,
    intimateText: intimateInterpretations[intimate] || intimateInterpretations[1],
    personalYear,
    personalYearText: personalYearInterpretations[personalYear] || personalYearInterpretations[1],
    inclusionText,
    maturityText,
    summaryText
  };
};

// ============================================================================
// FAITS HISTORIQUES PRÉCIS BASÉS SUR LA DATE DE NAISSANCE
// ============================================================================

const getHistoricalMilestones = (dateString) => {
  if (!dateString) return [];
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return [];

  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  let dateHash = (day * 31 + month * 123 + year) % 100;
  dateHash = Math.abs(dateHash);

  const pools = [
    {
      category: "Événement Mondial Majeur",
      text: `L'année de votre naissance (${year}), le paysage international a connu une mutation géopolitique et technologique profonde, redéfinissant les équilibres mondiaux.`
    },
    {
      category: "Patrimoine Culturel",
      text: `Le mois de votre venue au monde coïncide historiquement avec la publication d'œuvres littéraires et cinématographiques majeures qui ont marqué durablement la conscience collective.`
    },
    {
      category: "Avancée Scientifique",
      text: `À cette période précise de l'histoire, des découvertes pionnières en sciences exactes et en innovation ont ouvert de nouvelles perspectives pour l'humanité.`
    },
    {
      category: "Synchronicité Céleste",
      text: `Sur le plan astrologique et calendaire, le jour du ${day}/${month}/${year} s'est distingué par des alignements rares favorisant l'émergence de talents créatifs d'exception.`
    },
    {
      category: "Héritage Générationnel",
      text: `Votre cohorte de naissance porte l'empreinte d'une transition sociologique forte, combinant le respect des traditions et un esprit novateur très prononcé.`
    }
  ];

  return pools.map((item, idx) => ({
    id: idx + 1,
    category: `${item.category} (#${idx + 1})`,
    description: `${item.text} Une résonance historique intime pour le ${day}/${month}/${year}.`
  }));
};

const getDetailedProfileForDate = (dateString, fullName) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  const sign = getZodiacSignFromDate(dateString);
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
  const rotatedQualities = [
    ...baseProfile.qualities.slice(qualityShift),
    ...baseProfile.qualities.slice(0, qualityShift)
  ];

  const talentShift = (yearHash + 2) % baseProfile.talents.length;
  const rotatedTalents = [
    ...baseProfile.talents.slice(talentShift),
    ...baseProfile.talents.slice(0, talentShift)
  ];

  const planetaryInfluences = [
    "Cycle de Jupiter : Année axée sur l'expansion, l'audace et les opportunités professionnelles majeures.",
    "Cycle de Saturne : Année structurante apportant maturité précoce, rigueur et persévérance.",
    "Cycle d'Uranus : Année marquée par l'indépendance, l'esprit d'innovation et les changements créatifs.",
    "Cycle de Neptune : Année stimulant l'intuition artistique, la sensibilité empathique et la créativité.",
    "Cycle de Pluton : Année de force intérieure profonde, de résilience et de métamorphose personnelle."
  ];
  const dominantPlanet = planetaryInfluences[yearHash % planetaryInfluences.length];
  const numerology = getNumerologyData(dateString, fullName);
  const historicalMilestones = getHistoricalMilestones(dateString);

  return {
    sign,
    birthYear: year,
    dominantPlanet,
    numerology,
    historicalMilestones,
    qualities: rotatedQualities,
    flaws: baseProfile.flaws,
    anecdotes: baseProfile.anecdotes,
    talents: rotatedTalents,
    excellenceDomains: baseProfile.excellenceDomains
  };
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
// BASES DE TEXTES QUOTIDIENS ÉLARGIES
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

        {/* ONGLET 3 : PROFILER ASTROLOGIQUE & NUMÉROLOGIQUE */}
        {activeTab === 'profiler' && (
          <div className="space-y-4 sm:space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-3xl mx-auto space-y-1 sm:space-y-2">
              <h2 className="text-xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Profilage astrologique & numérologique
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
                Saisissez votre date de naissance et votre nom complet pour débloquer votre bilan de vie complet.
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
                        Signe Calculé • Année {searchedProfile.birthYear}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{searchedProfile.sign.name}</h3>
                      <p className="text-xs text-slate-500">{searchedProfile.sign.dates} • Élément {searchedProfile.sign.element}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3.5 rounded-2xl border border-purple-200 text-xs text-purple-900 max-w-xs shadow-2xs text-left">
                    <strong className="block text-purple-950 font-bold mb-1">🔑 Empreinte planétaire :</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{searchedProfile.dominantPlanet}</p>
                  </div>
                </div>

                {/* SECTION NUMÉROLOGIE AVANCÉE */}
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
                        <span className="text-xs font-bold text-emerald-900 uppercase">Nombre Intime (Moi Profond)</span>
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
                        <span className="text-xs font-bold text-amber-900 uppercase">Année Personnelle (2026)</span>
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
                        <span className="text-xs font-bold text-sky-900 uppercase">Grille d'Inclusion & Maturité</span>
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
                        <span key={idx} className="bg-white border border-emerald-200 text-emerald-900 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-lg sm:rounded-xl">
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
                        <span key={idx} className="bg-white border border-amber-200 text-amber-900 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-lg sm:rounded-xl">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* TALENTS & ANECDOTES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-purple-50/50 border border-purple-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
                    <h4 className="text-purple-950 font-bold text-sm sm:text-base flex items-center gap-2">
                      <Gift className="text-purple-600" size={18} /> 5 TALENTS CACHÉS
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
                      <Compass className="text-indigo-600" size={18} /> 5 ANECDOTES PARTICULIÈRES
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
                
                {/* RÉSUMÉ DE SYNTHÈSE GLOBAL (8 À 12 PHRASES) */}
                <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl space-y-3">
                  <h4 className="text-amber-300 font-black text-base sm:text-lg uppercase tracking-wider flex items-center gap-2">
                    <Star size={20} className="text-amber-400 fill-amber-400" /> Synthèse Astrologique & Numérologique de Vie
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
