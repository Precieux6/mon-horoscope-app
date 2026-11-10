import type { ZodiacSign } from '../types';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { id: 'belier', name: 'Bélier', de: 'du Bélier', symbol: '♈', dates: '14 avril - 14 mai', element: 'Feu', planet: 'Mars', color: 'from-rose-500 to-amber-500' },
  { id: 'taureau', name: 'Taureau', de: 'du Taureau', symbol: '♉', dates: '15 mai - 14 juin', element: 'Terre', planet: 'Vénus', color: 'from-emerald-500 to-teal-600' },
  { id: 'gemeaux', name: 'Gémeaux', de: 'des Gémeaux', symbol: '♊', dates: '15 juin - 15 juillet', element: 'Air', planet: 'Mercure', color: 'from-sky-400 to-indigo-500' },
  { id: 'cancer', name: 'Cancer', de: 'du Cancer', symbol: '♋', dates: '16 juillet - 16 août', element: 'Eau', planet: 'Lune', color: 'from-indigo-400 to-purple-500' },
  { id: 'lion', name: 'Lion', de: 'du Lion', symbol: '♌', dates: '17 août - 16 septembre', element: 'Feu', planet: 'Soleil', color: 'from-amber-400 to-orange-600' },
  { id: 'vierge', name: 'Vierge', de: 'de la Vierge', symbol: '♍', dates: '17 septembre - 17 octobre', element: 'Terre', planet: 'Mercure', color: 'from-teal-500 to-emerald-600' },
  { id: 'balance', name: 'Balance', de: 'de la Balance', symbol: '♎', dates: '18 octobre - 16 novembre', element: 'Air', planet: 'Vénus', color: 'from-pink-400 to-rose-500' },
  { id: 'scorpion', name: 'Scorpion', de: 'du Scorpion', symbol: '♏', dates: '17 novembre - 15 décembre', element: 'Eau', planet: 'Mars', color: 'from-purple-600 to-indigo-900' },
  { id: 'sagittaire', name: 'Sagittaire', de: 'du Sagittaire', symbol: '♐', dates: '16 décembre - 14 janvier', element: 'Feu', planet: 'Jupiter', color: 'from-violet-500 to-purple-700' },
  { id: 'capricorne', name: 'Capricorne', de: 'du Capricorne', symbol: '♑', dates: '15 janvier - 12 février', element: 'Terre', planet: 'Saturne', color: 'from-slate-600 to-slate-800' },
  { id: 'verseau', name: 'Verseau', de: 'du Verseau', symbol: '♒', dates: '13 février - 14 mars', element: 'Air', planet: 'Saturne', color: 'from-cyan-400 to-blue-600' },
  { id: 'poissons', name: 'Poissons', de: 'des Poissons', symbol: '♓', dates: '15 mars - 13 avril', element: 'Eau', planet: 'Jupiter', color: 'from-blue-400 to-indigo-600' },
];

export const signIndexById = (id: string): number => {
  const i = ZODIAC_SIGNS.findIndex((s) => s.id === id);
  if (i === -1) throw new RangeError(`Signe inconnu : ${id}`);
  return i;
};

export const HOUSE_THEMES = [
  'la personnalité et le corps',
  'les finances et les ressources',
  'la communication et les échanges',
  'le foyer et la famille',
  "l'amour et la créativité",
  'le travail quotidien et la santé',
  'les relations et les partenariats',
  'les transformations et les ressources partagées',
  'les voyages, les études et la chance',
  'la carrière et la reconnaissance',
  'les amitiés et les projets',
  "le repos, l'intériorité et les épreuves cachées",
];

/** Affinité « maison × rubrique » (convention de l'app, à affiner) : -15 … +20 */
export const HOUSE_AFFINITY: Record<'amour' | 'travail' | 'argent' | 'sante', number[]> = {
  amour:   [6, 0, 3, 5, 18, -6, 16, -10, 6, 0, 10, -8],
  travail: [8, 2, 8, 0, 2, 16, 4, 0, 6, 18, 10, -10],
  argent:  [4, 18, 2, 4, 6, 0, 4, 6, 8, 10, 18, -8],
  sante:   [14, 0, 2, 4, 2, -10, 2, -14, 6, 4, 6, -6],
};
