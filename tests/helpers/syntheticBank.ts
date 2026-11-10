import { HOUSES, MONTHLY_RECIPES } from '../../source/config';
import type { DailyBank, DailyCategory, MonthlyBank, PlanetKey } from '../../source/types';

/** Banques synthétiques : chaque phrase est unique et lisible (ex. « H3-amour-017. »). */
export function syntheticDaily(P: number, conseilP = 24): DailyBank {
  const bank: DailyBank = {};
  for (const h of HOUSES) {
    bank[h] = {};
    for (const c of ['amour', 'travail', 'argent', 'sante'] as const) bank[h]![c] = Array.from({ length: P }, (_, i) => `H${h}-${c}-${String(i).padStart(3, '0')}.`);
    bank[h]!.conseil = Array.from({ length: conseilP }, (_, i) => `H${h}-conseil-${String(i).padStart(3, '0')}.`);
  }
  return bank;
}

export function syntheticMonthly(P = 24): MonthlyBank {
  const bank: MonthlyBank = { planets: {}, mercuryRetro: {}, lunation: { new: {}, full: {} } };
  const planets = new Set<PlanetKey>();
  (Object.keys(MONTHLY_RECIPES) as DailyCategory[]).forEach((c) => MONTHLY_RECIPES[c].forEach((r) => planets.add(r.planet)));
  for (const p of planets) {
    bank.planets[p] = {};
    for (const h of HOUSES) {
      bank.planets[p]![h] = {};
      for (const c of Object.keys(MONTHLY_RECIPES) as DailyCategory[]) {
        if (MONTHLY_RECIPES[c].some((r) => r.planet === p)) bank.planets[p]![h]![c] = Array.from({ length: P }, (_, i) => `${p}${h}-${c}-${String(i).padStart(3, '0')}.`);
      }
    }
  }
  for (const h of HOUSES) {
    bank.mercuryRetro[h] = Array.from({ length: 8 }, (_, i) => `retro${h}-${i}.`);
    bank.lunation.new[h] = Array.from({ length: 12 }, (_, i) => `new${h}-${i} le {date}.`);
    bank.lunation.full[h] = Array.from({ length: 12 }, (_, i) => `full${h}-${i} le {date}.`);
  }
  return bank;
}
