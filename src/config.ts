import type { CategoryKey, DailyCategory, PlanetKey } from './types';

export const CONFIG = {
  /** Premier jour supporté par les moteurs à curseur (ne PAS changer après mise en ligne : cela changerait tous les textes) */
  EPOCH_ISO: '2000-01-01',
  LAST_YEAR: 2199,

  /** Horoscope du jour : phrases par catégorie (amour, travail, argent, santé) */
  DAILY_SENTENCES: { min: 7, max: 9 },
  /** Emplacements réservés par jour dans le « paquet » (= max) */
  DAILY_SLOTS: 9,
  /** Séjour maximal de la Lune dans un signe (jours) : ces jours-là ne partagent aucune phrase */
  DAILY_STAY_DAYS: 3,
  DAILY_CONSEIL_SENTENCES: 2,

  /** Taille minimale d'une banque pour que le nouveau moteur soit activé */
  DAILY_MIN_POOL: 54,
  /** Objectif (≈ 80 jours sans répétition de phrase). 54 = 2 × (3 jours × 9 phrases) : minimum pour protéger tout un séjour de la Lune. */
  DAILY_TARGET_POOL: 72,
  DAILY_CONSEIL_MIN_POOL: 16,
  DAILY_CONSEIL_TARGET_POOL: 24,

  /** Tendances mensuelles : taille minimale = max(MONTHLY_MIN_POOL, 4 × n) */
  MONTHLY_MIN_POOL: 12,
  LUNATION_MIN_POOL: 8,
  RETRO_MIN_POOL: 6,

  /** Profil */
  PROFILE_MIN_YEAR: 1900,
} as const;

/** Combien de phrases chaque planète fournit à chaque rubrique mensuelle. */
export const MONTHLY_RECIPES: Record<DailyCategory, Array<{ planet: PlanetKey; n: number }>> = {
  amour:   [{ planet: 'venus', n: 5 }, { planet: 'sun', n: 2 }, { planet: 'mars', n: 1 }],
  travail: [{ planet: 'mars', n: 3 }, { planet: 'mercury', n: 3 }, { planet: 'saturn', n: 1 }, { planet: 'sun', n: 1 }],
  argent:  [{ planet: 'jupiter', n: 2 }, { planet: 'venus', n: 3 }, { planet: 'saturn', n: 1 }, { planet: 'mercury', n: 2 }],
  sante:   [{ planet: 'mars', n: 3 }, { planet: 'sun', n: 3 }, { planet: 'saturn', n: 1 }, { planet: 'jupiter', n: 1 }],
  // 12 phrases de planètes + 2 phrases de lunaison = 14 phrases
  conseil: [
    { planet: 'sun', n: 3 }, { planet: 'venus', n: 2 }, { planet: 'mercury', n: 2 },
    { planet: 'mars', n: 3 }, { planet: 'jupiter', n: 1 }, { planet: 'saturn', n: 1 },
  ],
};

export const CATEGORIES: CategoryKey[] = ['amour', 'travail', 'argent', 'sante'];
export const HOUSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
