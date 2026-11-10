import type { Element } from '../types';

export const SIGN_RULERS = ['Mars', 'Vénus', 'Mercure', 'Lune', 'Soleil', 'Mercure', 'Vénus', 'Mars', 'Jupiter', 'Saturne', 'Saturne', 'Jupiter'] as const;

export interface PlanetData { qualities: string[]; flaws: string[]; effect: string }
/** Les sept planètes traditionnelles (maîtres des décans). */
export const PLANETS: Record<string, PlanetData> = {
  Soleil: { qualities: ['Rayonnant', 'Noble', 'Généreux', 'Charismatique', 'Loyal'], flaws: ['Orgueilleux', 'Autoritaire', 'Vaniteux', 'Théâtral', 'Dominateur'], effect: 'apporte rayonnement, fierté et sens du leadership' },
  Lune: { qualities: ['Intuitif', 'Protecteur', 'Empathique', 'Imaginatif', 'Attentionné'], flaws: ['Lunatique', 'Hypersensible', 'Craintif', 'Dépendant', 'Nostalgique'], effect: 'ajoute sensibilité, intuition et besoin de protection' },
  Mars: { qualities: ['Courageux', 'Énergique', 'Combatif', 'Direct', 'Entreprenant'], flaws: ['Colérique', 'Impulsif', 'Agressif', 'Impatient', 'Provocateur'], effect: 'ajoute énergie, courage et goût du défi' },
  Mercure: { qualities: ['Vif', 'Ingénieux', 'Communicatif', 'Curieux', 'Adaptable'], flaws: ['Nerveux', 'Dispersé', 'Critique', 'Superficiel', 'Inquiet'], effect: "ajoute vivacité d'esprit, curiosité et aisance de communication" },
  Jupiter: { qualities: ['Optimiste', 'Généreux', 'Sage', 'Confiant', 'Bienveillant'], flaws: ['Excessif', 'Prétentieux', 'Prodigue', 'Dogmatique', 'Complaisant'], effect: "ajoute optimisme, générosité et appétit de croissance" },
  Vénus: { qualities: ['Charmant', 'Harmonieux', 'Sensuel', 'Artistique', 'Affectueux'], flaws: ['Indolent', 'Capricieux', 'Dépensier', 'Dépendant affectif', 'Vaniteux'], effect: "ajoute charme, sens esthétique et besoin d'harmonie" },
  Saturne: { qualities: ['Discipliné', 'Patient', 'Endurant', 'Sérieux', 'Fiable'], flaws: ['Austère', 'Pessimiste', 'Froid', 'Méfiant', 'Rigide'], effect: 'ajoute sérieux, endurance et sens de la responsabilité' },
};

export const ELEMENT_TEXT: Record<Element, string> = {
  Feu: "votre tempérament est ardent : l'action, l'élan et l'enthousiasme guident vos choix",
  Terre: "votre nature est ancrée dans le concret : la stabilité, la patience et le sens pratique guident vos choix",
  Air: "votre nature est cérébrale : les idées, les échanges et la liberté guident vos choix",
  Eau: "votre nature est émotionnelle : l'intuition, l'empathie et la profondeur guident vos choix",
};
export const ELEMENT_EMO: Record<Element, string> = {
  Feu: 'une émotivité vive et expressive',
  Terre: 'une affectivité calme et fidèle',
  Air: 'une affectivité légère, curieuse et communicative',
  Eau: 'une affectivité profonde, intuitive et protectrice',
};
export const JUPITER_BY_ELEMENT: Record<Element, string> = {
  Feu: 'ce qui nourrit votre goût du risque mesuré et de l\'ambition',
  Terre: 'ce qui nourrit votre sens de la prospérité construite pas à pas',
  Air: 'ce qui nourrit votre ouverture d\'esprit et votre réseau',
  Eau: 'ce qui nourrit votre foi intérieure et votre générosité affective',
};
export const SATURN_BY_ELEMENT: Record<Element, string> = {
  Feu: 'ce qui vous apprend à canaliser votre impulsivité',
  Terre: 'ce qui vous apprend la patience dans la construction matérielle',
  Air: 'ce qui vous apprend à structurer vos idées et vos engagements',
  Eau: 'ce qui vous apprend à maîtriser vos émotions et vos peurs',
};
