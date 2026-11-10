import { degreeInSign, signIndexOf, siderealOnDay } from './ephemeris';

/** Dates d'entrée approximatives du Soleil dans chaque signe sidéral (mois*100+jour), triées par date. */
const APPROX_STARTS: Array<{ idx: number; md: number }> = [
  { idx: 9, md: 115 }, { idx: 10, md: 213 }, { idx: 11, md: 315 }, { idx: 0, md: 414 },
  { idx: 1, md: 515 }, { idx: 2, md: 615 }, { idx: 3, md: 716 }, { idx: 4, md: 817 },
  { idx: 5, md: 917 }, { idx: 6, md: 1018 }, { idx: 7, md: 1117 }, { idx: 8, md: 1216 },
];

/** Méthode indépendante (±1 jour) servant de garde-fou contre une éphéméride défaillante. */
export function approxSunSignIndex(iso: string): number {
  const md = Number(iso.slice(5, 7)) * 100 + Number(iso.slice(8, 10));
  let found = 8; // avant le 15 janvier : Dhanus
  for (const s of APPROX_STARTS) if (s.md <= md) found = s.idx;
  return found;
}

const circ = (a: number, b: number) => { const d = Math.abs(a - b) % 12; return Math.min(d, 12 - d); };

export interface SunPlacement { lon: number; signIndex: number; degree: number; minutes: number; borderline: boolean; usedFallback: boolean }

export function sunPlacement(iso: string): SunPlacement {
  const lon = siderealOnDay('sun', iso);
  let signIndex = signIndexOf(lon);
  const approx = approxSunSignIndex(iso);
  let usedFallback = false;
  if (circ(signIndex, approx) > 1) {
    // Éphéméride incohérente : on bascule sur la méthode approximative plutôt que d'afficher un signe faux.
    console.warn(`[ASTRAEA] signe solaire incohérent pour ${iso} (${signIndex} vs ${approx}) : repli approximatif.`);
    signIndex = approx;
    usedFallback = true;
  }
  const deg = degreeInSign(lon);
  const degree = Math.floor(deg);
  const minutes = Math.floor((deg - degree) * 60);
  // Le Soleil parcourt ≈ 1°/jour : à moins de 0,6° d'une frontière, l'heure de naissance décide.
  const borderline = !usedFallback && (deg < 0.6 || deg > 29.4);
  return { lon, signIndex, degree, minutes, borderline, usedFallback };
}
