import { CONFIG, MONTHLY_RECIPES } from '../config';
import { HOUSES } from '../config';
import type { DailyBank, DailyCategory, MonthlyBank, PlanetKey, Pool } from '../types';

type Json = Record<string, unknown>;
const PLANET_KEYS: PlanetKey[] = ['sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
const asPool = (x: unknown): Pool => (Array.isArray(x) ? x.filter((s): s is string => typeof s === 'string' && s.trim().length > 0).map((s) => s.trim()) : []);

/** fichiers : { "daily/h05.json": {...}, ... } (clé = nom de fichier, peu importe le préfixe) */
export function buildDailyBank(files: Record<string, unknown>): DailyBank {
  const bank: DailyBank = {};
  for (const [path, data] of Object.entries(files)) {
    const m = /h(\d{2})\.json$/.exec(path);
    if (!m) continue;
    const house = Number(m[1]);
    const d = (data ?? {}) as Json;
    bank[house] = {
      amour: asPool(d.amour), travail: asPool(d.travail), argent: asPool(d.argent), sante: asPool(d.sante), conseil: asPool(d.conseil),
    };
  }
  return bank;
}

export function buildMonthlyBank(files: Record<string, unknown>): MonthlyBank {
  const bank: MonthlyBank = { planets: {}, mercuryRetro: {}, lunation: { new: {}, full: {} } };
  for (const [path, data] of Object.entries(files)) {
    const name = (/([a-z-]+)\.json$/.exec(path)?.[1]) ?? '';
    const d = (data ?? {}) as Json;
    if (name === 'mercury-retro') {
      for (const h of HOUSES) bank.mercuryRetro[h] = asPool(d[String(h)]);
    } else if (name === 'lunations') {
      for (const kind of ['new', 'full'] as const) {
        const k = (d[kind] ?? {}) as Json;
        for (const h of HOUSES) bank.lunation[kind][h] = asPool(k[String(h)]);
      }
    } else if ((PLANET_KEYS as string[]).includes(name)) {
      const planet = name as PlanetKey;
      const byHouse: Record<number, Partial<Record<DailyCategory, Pool>>> = {};
      for (const h of HOUSES) {
        const hd = (d[String(h)] ?? {}) as Json;
        byHouse[h] = { amour: asPool(hd.amour), travail: asPool(hd.travail), argent: asPool(hd.argent), sante: asPool(hd.sante), conseil: asPool(hd.conseil) };
      }
      bank.planets[planet] = byHouse;
    }
  }
  return bank;
}

export interface Shortfall { pool: string; size: number; min: number; target: number }
export interface Readiness { ready: boolean; shortfalls: Shortfall[]; totalPools: number; totalSentences: number; missingSentences: number }

function evaluate(items: Array<{ pool: string; size: number; min: number; target: number }>): Readiness {
  const shortfalls = items.filter((i) => i.size < i.min);
  return {
    ready: shortfalls.length === 0,
    shortfalls,
    totalPools: items.length,
    totalSentences: items.reduce((a, i) => a + i.size, 0),
    missingSentences: items.reduce((a, i) => a + Math.max(0, i.target - i.size), 0),
  };
}

export function dailyReadiness(bank: DailyBank): Readiness {
  const items: Array<{ pool: string; size: number; min: number; target: number }> = [];
  for (const h of HOUSES) {
    for (const cat of ['amour', 'travail', 'argent', 'sante'] as const) {
      items.push({ pool: `daily/h${String(h).padStart(2, '0')}/${cat}`, size: bank[h]?.[cat]?.length ?? 0, min: CONFIG.DAILY_MIN_POOL, target: CONFIG.DAILY_TARGET_POOL });
    }
    items.push({ pool: `daily/h${String(h).padStart(2, '0')}/conseil`, size: bank[h]?.conseil?.length ?? 0, min: CONFIG.DAILY_CONSEIL_MIN_POOL, target: CONFIG.DAILY_CONSEIL_TARGET_POOL });
  }
  return evaluate(items);
}

export const monthlyMinPool = (n: number) => Math.max(CONFIG.MONTHLY_MIN_POOL, 4 * n);

export function monthlyReadiness(bank: MonthlyBank): Readiness {
  const items: Array<{ pool: string; size: number; min: number; target: number }> = [];
  for (const cat of Object.keys(MONTHLY_RECIPES) as DailyCategory[]) {
    for (const { planet, n } of MONTHLY_RECIPES[cat]) {
      for (const h of HOUSES) {
        const min = monthlyMinPool(n);
        items.push({ pool: `monthly/${planet}/${h}/${cat}`, size: bank.planets[planet]?.[h]?.[cat]?.length ?? 0, min, target: min * 2 });
      }
    }
  }
  for (const h of HOUSES) {
    items.push({ pool: `monthly/mercury-retro/${h}`, size: bank.mercuryRetro[h]?.length ?? 0, min: CONFIG.RETRO_MIN_POOL, target: CONFIG.RETRO_MIN_POOL * 2 });
    items.push({ pool: `monthly/lunations/new/${h}`, size: bank.lunation.new[h]?.length ?? 0, min: CONFIG.LUNATION_MIN_POOL, target: CONFIG.LUNATION_MIN_POOL * 2 });
    items.push({ pool: `monthly/lunations/full/${h}`, size: bank.lunation.full[h]?.length ?? 0, min: CONFIG.LUNATION_MIN_POOL, target: CONFIG.LUNATION_MIN_POOL * 2 });
  }
  return evaluate(items);
}
