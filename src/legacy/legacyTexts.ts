// @ts-nocheck
/**
 * ANCIENS générateurs (3 variantes seulement). Utilisés UNIQUEMENT tant que les banques de phrases
 * ne sont pas complètes (voir `readiness` dans src/lib/api.ts). À supprimer une fois les banques remplies.
 */
import { ZODIAC_SIGNS } from '../data/zodiac';

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

export const generateAutomatedHoroscope = (signId, dateStr) => {
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

export const generateMonthlyTrends = (signId, yearMonthStr) => {
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
