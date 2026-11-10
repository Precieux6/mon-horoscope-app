import { EXPRESSION, INTIMATE, KARMIC, LIFE_PATH, MATURITY, PERSONAL_YEAR, SOUL, type NumTexts } from '../data/numerologyTexts';
import { isValidISODate } from './dates';

const MASTERS = new Set([11, 22, 33]);
const digitSum = (n: number) => String(Math.abs(n)).split('').reduce((a, c) => a + Number(c), 0);

/** Réduit à un chiffre ; conserve 11, 22 et 33 si keepMasters. */
export function reduceNumber(n: number, keepMasters = true): number {
  while (n > 9 && !(keepMasters && MASTERS.has(n))) n = digitSum(n);
  return n;
}

const LETTER_VALUES: Record<string, number> = {
  a: 1, j: 1, s: 1, b: 2, k: 2, t: 2, c: 3, l: 3, u: 3, d: 4, m: 4, v: 4, e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6, g: 7, p: 7, y: 7, h: 8, q: 8, z: 8, i: 9, r: 9,
};
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);

/** « Précieux Trésor » -> « precieuxtresor » : accents, cédille, ligatures et tout ce qui n'est pas a–z éliminés. */
export function normalizeName(name: string): string {
  return name
    .replace(/œ/gi, 'oe').replace(/æ/gi, 'ae').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z]/g, '');
}

const pick = (map: NumTexts, n: number): string => map[n] ?? map[reduceNumber(n, false)] ?? '';

export interface NumerologyResult {
  lifePath: number; lifePathText: string;
  expression: number; expressionText: string;
  soul: number; soulText: string;
  intimate: number; intimateText: string;
  /** Toujours réduite à 1–9 : le badge et le texte utilisent la même valeur. */
  personalYear: number; personalYearText: string;
  /** « 13/4 » quand la somme avant réduction est ≥ 10, sinon « 4 » */
  personalYearLabel: string;
  maturity: number; maturityText: string;
  missingNumbers: number[]; inclusionText: string;
  /** Rempli par buildProfile (profile.ts) */
  summaryText: string;
}

export function computeNumerology(dateISO: string, fullName: string, currentYear: number): NumerologyResult | null {
  if (!isValidISODate(dateISO)) return null;
  const letters = normalizeName(fullName);
  if (letters.length < 2) return null;

  const [y, m, d] = dateISO.split('-').map(Number) as [number, number, number];
  const lifePath = reduceNumber(reduceNumber(d) + reduceNumber(m) + reduceNumber(y));

  let exp = 0, soul = 0, intimate = 0;
  const freq: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (const ch of letters) {
    const v = LETTER_VALUES[ch] as number;
    exp += v; freq[v] = (freq[v] ?? 0) + 1;
    if (VOWELS.has(ch)) soul += v; else intimate += v;
  }
  const expression = reduceNumber(exp);
  const soulN = reduceNumber(soul);
  const intimateN = reduceNumber(intimate);

  // Année personnelle : jour + mois + année en cours, chacun réduit à 1–9, puis total réduit à 1–9.
  const compound = reduceNumber(d, false) + reduceNumber(m, false) + reduceNumber(currentYear, false);
  const personalYear = reduceNumber(compound, false);
  const personalYearLabel = compound >= 10 ? `${compound}/${personalYear}` : String(personalYear);

  const maturity = reduceNumber(lifePath + expression);
  const missingNumbers = Object.keys(freq).map(Number).filter((k) => freq[k] === 0);
  const inclusionText = missingNumbers.length
    ? `Grille d'inclusion sidérale : leçons karmiques à intégrer [${missingNumbers.join(', ')}]. ${missingNumbers.slice(0, 3).map((n) => KARMIC[n]).join(' ')}`
    : "Grille d'inclusion sidérale : tous les nombres de 1 à 9 sont présents dans votre nom, signe d'une belle harmonie générale.";

  return {
    lifePath, lifePathText: pick(LIFE_PATH, lifePath),
    expression, expressionText: pick(EXPRESSION, expression),
    soul: soulN, soulText: pick(SOUL, soulN),
    intimate: intimateN, intimateText: pick(INTIMATE, intimateN),
    personalYear, personalYearText: pick(PERSONAL_YEAR, personalYear), personalYearLabel,
    maturity, maturityText: `Nombre de maturité (${maturity}) : ce nombre ${MATURITY[maturity] ?? MATURITY[reduceNumber(maturity, false)]}.`,
    missingNumbers, inclusionText, summaryText: '',
  };
}
