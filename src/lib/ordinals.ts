import type { PlanetKey } from '../types';
import { monthIndex, assertSupported, noonUTC, addDays } from './dates';
import { LAHIRI_AYANAMSA_J2000, onEphemerisChange, signIndexOf, siderealOnDay } from './ephemeris';

/**
 * ORDINAL = numéro de la « visite » d'un astre dans un signe, depuis 2000.
 * Il sert de curseur : chaque nouvelle visite avance dans la banque de phrases,
 * ce qui évite de resservir les phrases de la visite précédente.
 */

/** Longitude moyenne sidérale de la Lune (monotone, non repliée) : sert uniquement à compter les révolutions. */
function meanMoonSiderealLon(iso: string): number {
  const d = (noonUTC(iso).getTime() - Date.UTC(2000, 0, 1, 12)) / 86_400_000;
  return 218.3164477 + 13.17639648 * d - LAHIRI_AYANAMSA_J2000 - 3.8247e-5 * d;
}

export interface MoonVisit { moonSignIndex: number; ordinal: number }

/**
 * Ordinal d'un JOUR de séjour de la Lune dans un signe : (numéro de révolution × 3) + rang du jour dans le séjour.
 * La Lune reste 2 à 3 jours dans un signe -> rang 0, 1 ou 2.
 * Calcul direct (≈ 4 positions lunaires), sans table ni état.
 */
export function moonVisit(iso: string): MoonVisit {
  assertSupported(iso);
  const X = signIndexOf(siderealOnDay('moon', iso));
  const k = Math.round((meanMoonSiderealLon(iso) - (30 * X + 15)) / 360);
  let rank = 0;
  for (let back = 1; back <= 3; back++) {
    if (signIndexOf(siderealOnDay('moon', addDays(iso, -back))) === X) rank++;
    else break;
  }
  if (rank > 2) rank = 2;
  return { moonSignIndex: X, ordinal: k * 3 + rank };
}

// ---- Planètes : visite = mois ----------------------------------------------------------------

const series = new Map<PlanetKey, number[]>();
onEphemerisChange(() => series.clear());

function ensureSeries(planet: PlanetKey, upToMonth: number): number[] {
  let s = series.get(planet);
  if (!s) { s = []; series.set(planet, s); }
  for (let m = s.length; m <= upToMonth; m++) {
    const y = 2000 + Math.floor(m / 12);
    const mo = String((m % 12) + 1).padStart(2, '0');
    s.push(signIndexOf(siderealOnDay(planet, `${y}-${mo}-15`)));
  }
  return s;
}

export function planetSignAtMonth(planet: PlanetKey, yearMonth: string): number {
  const m = monthIndex(yearMonth);
  if (m < 0) throw new RangeError(`Mois hors plage : ${yearMonth}`);
  return (ensureSeries(planet, m)[m]) as number;
}

/** Nombre de mois précédents (depuis 2000) où la planète était dans le même signe. */
export function planetMonthOrdinal(planet: PlanetKey, yearMonth: string): number {
  const m = monthIndex(yearMonth);
  if (m < 0) throw new RangeError(`Mois hors plage : ${yearMonth}`);
  const s = ensureSeries(planet, m);
  const X = s[m];
  let n = 0;
  for (let j = 0; j < m; j++) if (s[j] === X) n++;
  return n;
}
