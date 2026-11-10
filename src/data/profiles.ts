/** Profils par signe (qualités, défauts, anecdotes, talents, domaines) : repris tels quels de l'ancien App.tsx. */
export interface SignProfileData {
  qualities: string[];
  flaws: string[];
  anecdotes: string[];
  talents: string[];
  excellenceDomains: string[];
}

export const SIGN_PROFILES: Record<string, SignProfileData> = {
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
