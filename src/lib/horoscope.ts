import { CONFIG, CATEGORIES } from '../config';
import { HOUSE_AFFINITY, HOUSE_THEMES, ZODIAC_SIGNS, signIndexById } from '../data/zodiac';
import type { CategoryKey, DailyBank, DailyReading } from '../types';
import { assertSupported } from './dates';
import { houseOf, norm360, siderealOnDay } from './ephemeris';
import { moonVisit } from './ordinals';
import { hashString, intInRange, mulberry32 } from './rng';
import { selectSentences } from './deck';

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

export function generateDailyReading(signId: string, iso: string, bank: DailyBank): DailyReading {
  assertSupported(iso);
  const s = signIndexById(signId);
  const { moonSignIndex, ordinal } = moonVisit(iso);
  const house = houseOf(s, moonSignIndex);
  const sunLon = siderealOnDay('sun', iso);
  const moonLon = siderealOnDay('moon', iso);
  const waxing = norm360(moonLon - sunLon) < 180;
  let degraded = false;

  const build = (cat: CategoryKey) => {
    const key = `${signId}|${house}|${cat}`;
    const pool = bank[house]?.[cat] ?? [];
    const n = intInRange(mulberry32(hashString(`n|${key}|${ordinal}`)), CONFIG.DAILY_SENTENCES.min, CONFIG.DAILY_SENTENCES.max);
    const r = selectSentences(pool, key, ordinal, n, CONFIG.DAILY_SLOTS, CONFIG.DAILY_STAY_DAYS);
    if (r.degraded) degraded = true;
    const jitter = intInRange(mulberry32(hashString(`score|${signId}|${iso}|${cat}`)), -6, 6);
    const score = clamp(50 + HOUSE_AFFINITY[cat][house - 1]! + (waxing ? 4 : 0) + jitter, 28, 98);
    return { text: r.sentences.join(' '), score };
  };

  const [amour, travail, argent, sante] = CATEGORIES.map(build) as [ReturnType<typeof build>, ReturnType<typeof build>, ReturnType<typeof build>, ReturnType<typeof build>];

  const conseilKey = `${signId}|${house}|conseil`;
  const rc = selectSentences(bank[house]?.conseil ?? [], conseilKey, ordinal, CONFIG.DAILY_CONSEIL_SENTENCES, CONFIG.DAILY_CONSEIL_SENTENCES, CONFIG.DAILY_STAY_DAYS);
  if (rc.degraded) degraded = true;

  const moon = ZODIAC_SIGNS[moonSignIndex]!;
  return {
    amour, travail, argent, sante,
    conseil: rc.sentences.join(' '),
    headline: `La Lune ${waxing ? 'croissante' : 'décroissante'} traverse ${moon.name} (sidéral) et éclaire votre maison ${house}, celle de ${HOUSE_THEMES[house - 1]}.`,
    meta: { degraded, houses: { moon: house }, moonSign: moon.name },
  };
}
