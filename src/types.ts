export type CategoryKey = 'amour' | 'travail' | 'argent' | 'sante';
export type DailyCategory = CategoryKey | 'conseil';
export type PlanetKey = 'sun' | 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn';
export type BodyKey = PlanetKey | 'moon';
export type Element = 'Feu' | 'Terre' | 'Air' | 'Eau';

export interface ZodiacSign {
  id: string;
  name: string;
  /** Forme avec préposition : "du Bélier", "des Gémeaux", "de la Vierge" */
  de: string;
  symbol: string;
  /** Dates SIDÉRALES approximatives (±1 jour selon l'année) */
  dates: string;
  element: Element;
  /** Régent traditionnel (utilisé en astrologie sidérale) */
  planet: string;
  color: string;
}

export interface CategoryReading {
  text: string;
  score: number;
}

export interface ReadingMeta {
  /** true si une banque est trop petite : l'unicité n'est alors plus garantie */
  degraded: boolean;
  houses: Partial<Record<BodyKey, number>>;
}

export interface DailyReading {
  amour: CategoryReading;
  travail: CategoryReading;
  argent: CategoryReading;
  sante: CategoryReading;
  conseil: string;
  headline: string;
  meta: ReadingMeta & { moonSign: string };
}

export interface MonthlyReading {
  amour: CategoryReading;
  travail: CategoryReading;
  argent: CategoryReading;
  sante: CategoryReading;
  /** 10 à 15 phrases */
  conseil: string;
  headline: string;
  meta: ReadingMeta & { mercuryRetrograde: boolean; newMoon?: string; fullMoon?: string };
}

/** Longitudes SIDÉRALES (0–360°) des astres. Interchangeable (tests, autre librairie). */
export interface Ephemeris {
  siderealLongitude(body: BodyKey, at: Date): number;
}

export type Pool = string[];
export type DailyBank = Record<number, Partial<Record<DailyCategory, Pool>>>;
export interface MonthlyBank {
  /** planète -> maison (1..12) -> catégorie -> phrases */
  planets: Partial<Record<PlanetKey, Record<number, Partial<Record<DailyCategory, Pool>>>>>;
  /** maison -> phrases (rétrograde de Mercure) */
  mercuryRetro: Record<number, Pool>;
  /** maison -> phrases avec le marqueur {date} */
  lunation: { new: Record<number, Pool>; full: Record<number, Pool> };
}
