import { CATEGORIES, CONFIG, MONTHLY_RECIPES } from '../config';
import { HOUSE_AFFINITY, HOUSE_THEMES, ZODIAC_SIGNS, signIndexById } from '../data/zodiac';
import type { CategoryKey, DailyCategory, MonthlyBank, MonthlyReading, PlanetKey } from '../types';
import { daysInMonth, formatDayMonthFr, monthIndex, monthNameFr } from './dates';
import { houseOf, norm360, signIndexOf, siderealOnDay } from './ephemeris';
import { planetMonthOrdinal, planetSignAtMonth } from './ordinals';
import { hashString, intInRange, mulberry32 } from './rng';
import { selectSentences } from './deck';

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const PLANETS: PlanetKey[] = ['sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];

function mercuryRetrograde(ym: string): boolean {
  const last = daysInMonth(ym);
  for (const d of [2, 9, 16, 23, Math.min(30, last)]) {
    const day = String(d).padStart(2, '0');
    const prev = String(d - 1).padStart(2, '0');
    const delta = norm360(siderealOnDay('mercury', `${ym}-${day}`) - siderealOnDay('mercury', `${ym}-${prev}`));
    if (delta > 180) return true; // recul apparent
  }
  return false;
}

/** Détection au jour près des nouvelles et pleines lunes du mois. */
function lunations(ym: string): { newMoon?: string; fullMoon?: string } {
  const out: { newMoon?: string; fullMoon?: string } = {};
  const elong = (d: number) => {
    const iso = d === 0 ? previousDay(ym) : `${ym}-${String(d).padStart(2, '0')}`;
    return norm360(siderealOnDay('moon', iso) - siderealOnDay('sun', iso));
  };
  let prev = elong(0);
  for (let d = 1; d <= daysInMonth(ym); d++) {
    const cur = elong(d);
    const iso = `${ym}-${String(d).padStart(2, '0')}`;
    if (!out.newMoon && prev > 300 && cur < 60) out.newMoon = iso;
    if (!out.fullMoon && prev < 180 && cur >= 180) out.fullMoon = iso;
    prev = cur;
  }
  return out;
}
function previousDay(ym: string): string {
  const [y, m] = ym.split('-').map(Number) as [number, number];
  const dt = new Date(Date.UTC(y, m - 1, 1) - 86_400_000);
  return dt.toISOString().slice(0, 10);
}

export function generateMonthlyReading(signId: string, ym: string, bank: MonthlyBank): MonthlyReading {
  if (monthIndex(ym) < 0 || Number(ym.slice(0, 4)) > CONFIG.LAST_YEAR) throw new RangeError(`Mois hors plage : ${ym}`);
  const s = signIndexById(signId);
  const mIdx = monthIndex(ym);
  let degraded = false;

  const houses = {} as Record<PlanetKey, number>;
  for (const p of PLANETS) houses[p] = houseOf(s, planetSignAtMonth(p, ym));
  const retro = mercuryRetrograde(ym);
  const lun = lunations(ym);

  const planetSentences = (planet: PlanetKey, cat: DailyCategory, n: number): string[] => {
    const house = houses[planet];
    const pool = bank.planets[planet]?.[house]?.[cat] ?? [];
    const key = `m|${signId}|${planet}|${house}|${cat}`;
    const r = selectSentences(pool, key, planetMonthOrdinal(planet, ym), n, n);
    if (r.degraded) degraded = true;
    return r.sentences;
  };

  const retroSentence = (): string | null => {
    if (!retro) return null;
    const pool = bank.mercuryRetro[houses.mercury] ?? [];
    const r = selectSentences(pool, `mr|${signId}|${houses.mercury}`, mIdx, 1, 1);
    if (r.degraded) degraded = true;
    return r.sentences[0] ?? null;
  };

  const lunationSentence = (kind: 'new' | 'full'): string | null => {
    const iso = kind === 'new' ? lun.newMoon : lun.fullMoon;
    if (!iso) return null;
    const sunIdx = signIndexOf(siderealOnDay('sun', iso));
    const sIdx = kind === 'new' ? sunIdx : (sunIdx + 6) % 12;
    const house = houseOf(s, sIdx);
    const pool = bank.lunation[kind][house] ?? [];
    const r = selectSentences(pool, `lu|${kind}|${signId}|${house}`, mIdx, 1, 1);
    if (r.degraded) degraded = true;
    const raw = r.sentences[0];
    return raw ? raw.replace(/\{date\}/g, formatDayMonthFr(iso)).replace(/\{signe\}/g, ZODIAC_SIGNS[sIdx]!.name) : null;
  };

  const buildCategory = (cat: CategoryKey) => {
    const parts: string[] = [];
    for (const { planet, n } of MONTHLY_RECIPES[cat]) {
      const sents = planetSentences(planet, cat, n);
      if (planet === 'mercury' && cat === 'travail') {
        const rs = retroSentence();
        if (rs && sents.length) sents[sents.length - 1] = rs; // remplace la dernière phrase de Mercure
      }
      parts.push(...sents);
    }
    const jitter = intInRange(mulberry32(hashString(`mscore|${signId}|${ym}|${cat}`)), -5, 5);
    const lead = cat === 'amour' ? houses.venus : cat === 'travail' ? houses.mars : cat === 'argent' ? houses.jupiter : houses.sun;
    const score = clamp(Math.round(50 + 0.6 * HOUSE_AFFINITY[cat][lead - 1]! + 0.4 * HOUSE_AFFINITY[cat][houses.sun - 1]! + jitter), 28, 98);
    return { text: parts.join(' '), score };
  };

  const [amour, travail, argent, sante] = CATEGORIES.map(buildCategory) as [ReturnType<typeof buildCategory>, ReturnType<typeof buildCategory>, ReturnType<typeof buildCategory>, ReturnType<typeof buildCategory>];

  // Conseil mensuel : 10 à 15 phrases (12 de planètes + jusqu'à 2 de lunaisons)
  const byPlanet: Partial<Record<PlanetKey, string[]>> = {};
  for (const { planet, n } of MONTHLY_RECIPES.conseil) byPlanet[planet] = planetSentences(planet, 'conseil', n);
  if (retro && byPlanet.mercury?.length) {
    const rs = retroSentence();
    if (rs) byPlanet.mercury[byPlanet.mercury.length - 1] = rs;
  }
  const nm = lunationSentence('new');
  const fm = lunationSentence('full');
  const conseil = [
    ...(byPlanet.sun ?? []), ...(nm ? [nm] : []), ...(byPlanet.venus ?? []), ...(byPlanet.mercury ?? []),
    ...(byPlanet.mars ?? []), ...(fm ? [fm] : []), ...(byPlanet.jupiter ?? []), ...(byPlanet.saturn ?? []),
  ].join(' ');

  return {
    amour, travail, argent, sante, conseil,
    headline: `En ${monthNameFr(ym)}, le Soleil traverse votre maison ${houses.sun} (${HOUSE_THEMES[houses.sun - 1]}), Vénus la ${houses.venus} et Mars la ${houses.mars}.`,
    meta: {
      degraded, houses: { ...houses }, mercuryRetrograde: retro,
      newMoon: lun.newMoon, fullMoon: lun.fullMoon,
    },
  };
}
