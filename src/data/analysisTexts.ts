import type { Axis, AxisVector } from './axes';

export const ELEMENT_AXES: Record<string, AxisVector> = {
  Feu: { carriere: 2, sante: 1 },
  Terre: { argent: 2, sante: 1, carriere: 1 },
  Air: { relations: 2, carriere: 1 },
  Eau: { relations: 1, sens: 2 },
};
/** Modalité du signe : index % 3 (0 cardinal, 1 fixe, 2 mutable) */
export const MODES = [
  { name: 'cardinal', axes: { carriere: 1 } as AxisVector, text: 'vous initiez : vous êtes le premier à lancer les mouvements' },
  { name: 'fixe', axes: { argent: 1, sante: 1 } as AxisVector, text: 'vous stabilisez : vous menez à terme et tenez dans la durée' },
  { name: 'mutable', axes: { sens: 1, relations: 1 } as AxisVector, text: "vous adaptez : vous vous ajustez vite aux changements et aux personnes" },
];
export const PLANET_AXES: Record<string, AxisVector> = {
  Soleil: { carriere: 2, sante: 1 },
  Lune: { relations: 2, sens: 1 },
  Mars: { carriere: 2, sante: 1 },
  Mercure: { carriere: 1, argent: 1, relations: 1 },
  Jupiter: { argent: 1, sens: 2 },
  Vénus: { relations: 2, argent: 1 },
  Saturne: { carriere: 2, argent: 1 },
};
export const NUMBER_AXES: Record<number, AxisVector> = {
  1: { carriere: 3 }, 2: { relations: 3 }, 3: { relations: 2, carriere: 1 }, 4: { argent: 2, carriere: 1, sante: 1 },
  5: { carriere: 1, relations: 1, argent: 1 }, 6: { relations: 2, sante: 1 }, 7: { sens: 3 }, 8: { argent: 3, carriere: 1 },
  9: { sens: 2, relations: 1 }, 11: { sens: 3, relations: 1 }, 22: { carriere: 2, argent: 2 }, 33: { relations: 2, sens: 2 },
};

type V3 = [string, string, string];
export const STRENGTH: Record<Axis, V3> = {
  relations: [
    "Votre atout majeur est relationnel : les gens se confient à vous et vos alliances vous font avancer.",
    "Vous réussissez par les liens : un réseau entretenu avec sincérité vous ouvre plus de portes que n'importe quel diplôme.",
    "Votre sens du contact est votre capital : vous apaisez, vous rassemblez, vous fédérez.",
  ],
  carriere: [
    "Votre atout majeur est l'action : vous décidez, vous lancez et vous entraînez les autres derrière un objectif.",
    "Vous progressez par l'initiative : un projet clair, une échéance, et vous livrez.",
    "Votre énergie professionnelle est votre capital : vous transformez les idées en résultats visibles.",
  ],
  argent: [
    "Votre atout majeur est la gestion : vous savez construire pas à pas et protéger ce que vous avez bâti.",
    "Vous avez le sens du concret : budget, patrimoine, opportunités, vous voyez vite ce qui rapporte.",
    "Votre rapport à l'argent est solide : patience et régularité sont vos meilleurs placements.",
  ],
  sante: [
    "Votre atout majeur est la vitalité : votre corps répond bien quand vous respectez son rythme.",
    "Vous avez une bonne capacité de récupération : régularité et bon sommeil vous remettent vite d'aplomb.",
    "Votre équilibre physique est un capital : l'entretenir soutient tous vos autres projets.",
  ],
  sens: [
    "Votre atout majeur est le sens : vous cherchez la profondeur, et cette cohérence intérieure vous donne de la constance.",
    "Vous avez une boussole intérieure : vos valeurs vous guident mieux que les modes ou les pressions.",
    "Votre vie intérieure est une source de force : réflexion, foi ou création vous recentrent.",
  ],
};
export const PITFALL: Record<Axis, V3> = {
  relations: [
    "Piège à éviter : dépendre de l'approbation des autres au point de repousser vos propres décisions.",
    "Piège à éviter : absorber les tensions de votre entourage au détriment de votre énergie.",
    "Piège à éviter : esquiver une explication nécessaire pour préserver la paix à court terme.",
  ],
  carriere: [
    "Piège à éviter : vouloir tout porter seul et vous épuiser avant l'arrivée du résultat.",
    "Piège à éviter : décider trop vite sans mesurer l'effet sur votre équipe ou vos proches.",
    "Piège à éviter : confondre agitation et progrès.",
  ],
  argent: [
    "Piège à éviter : retenir trop par peur du manque et passer à côté d'opportunités.",
    "Piège à éviter : dépenser pour compenser une émotion plutôt que pour un besoin réel.",
    "Piège à éviter : mélanger prêts aux proches et finances personnelles sans règle claire.",
  ],
  sante: [
    "Piège à éviter : négliger le repos sous prétexte que vous tenez encore debout.",
    "Piège à éviter : porter le stress dans le corps (tensions, sommeil) sans le reconnaître.",
    "Piège à éviter : alterner périodes d'excès et périodes de privation.",
  ],
  sens: [
    "Piège à éviter : vous replier dans vos pensées au lieu de passer à l'acte.",
    "Piège à éviter : attendre le moment parfait pour agir.",
    "Piège à éviter : juger sévèrement ceux qui n'ont pas votre exigence intérieure.",
  ],
};
export const ACTION: Record<Axis, V3> = {
  relations: [
    "contactez trois personnes que vous avez négligées et proposez un échange concret (appel, café, message vocal).",
    "planifiez un tête-à-tête sans écran avec une personne qui compte et posez-lui une vraie question ouverte.",
    "réglez une conversation difficile en préparant d'abord, par écrit, ce que vous voulez obtenir.",
  ],
  carriere: [
    "choisissez UN objectif professionnel du mois, écrivez-le en une phrase et découpez-le en trois étapes datées.",
    "bloquez chaque matin 90 minutes sans interruption pour la tâche qui fait vraiment avancer votre projet.",
    "demandez un retour franc à un collègue ou à un mentor sur votre dernier travail et appliquez une seule amélioration.",
  ],
  argent: [
    "listez vos revenus et dépenses du mois et fixez un petit montant d'épargne automatique, même modeste.",
    "identifiez une dépense récurrente inutile, supprimez-la et réaffectez la somme à un objectif précis.",
    "renseignez-vous sur une source de revenu complémentaire réaliste et testez-la avec un petit budget.",
  ],
  sante: [
    "fixez une heure de coucher régulière pendant sept jours et observez l'effet sur votre énergie.",
    "marchez 30 minutes par jour, de préférence à la lumière du jour, et notez votre humeur le soir.",
    "reportez moins vos bilans médicaux de routine, et réduisez cette semaine sucre et excitants.",
  ],
  sens: [
    "consacrez 15 minutes chaque matin au silence, à la prière, à l'écriture ou à la méditation, sans téléphone.",
    "écrivez vos trois valeurs essentielles et vérifiez une décision de la semaine à l'aune de chacune.",
    "entamez ou relisez un livre qui nourrit votre quête de sens et notez-en une idée à appliquer.",
  ],
};
