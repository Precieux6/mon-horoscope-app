import { CABAL_BY_N, type CabalEntry } from '../data/cabalTable';
import { reduceNumber } from './numerology';

/** Valeurs des lettres (table du livre p.186). J=600, V=700, W=800 ; la case « 900 » du scan est illisible : non utilisée.
 * L'utilisateur indique : case 800 = « HJ », case 900 = « HU ». Ce sont deux lettres chacune : lecture à confirmer (digrammes comptés d'un seul bloc ? repère de lecture du scan ?), donc NON appliquée. */
export const CABAL_VALUES: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  k: 10, l: 20, m: 30, n: 40, o: 50, p: 60, q: 70, r: 80, s: 90,
  t: 100, u: 200, x: 300, y: 400, z: 500, j: 600, v: 700, w: 800,
};

export const SEPHIROTH: Record<number, { name: string; sense: string }> = {
  1: { name: 'Kéther', sense: "la volonté d'origine : poser une intention claire avant d'agir" },
  2: { name: 'Hokhmah', sense: "l'étincelle d'inspiration : noter vos intuitions avant de les analyser" },
  3: { name: 'Binah', sense: "la compréhension : donner forme et structure à vos idées" },
  4: { name: 'Hessed', sense: "la bonté généreuse : donner sans compter, mais avec discernement" },
  5: { name: 'Gevourah', sense: "la rigueur : poser des limites claires et savoir dire non" },
  6: { name: 'Tiphéreth', sense: "l'harmonie : chercher le juste équilibre entre cœur et raison" },
  7: { name: 'Netzah', sense: "la persévérance : tenir dans la durée, une étape après l'autre" },
  8: { name: 'Hod', sense: "la communication : clarifier, expliquer et négocier avec précision" },
  9: { name: 'Yesod', sense: "le lien : relier les personnes et ancrer vos projets dans le concret" },
  11: { name: 'Daath', sense: "la connaissance cachée : creuser jusqu'à comprendre le pourquoi" },
  22: { name: 'les 22 sentiers', sense: "la vue d'ensemble : percevoir le chemin complet d'un projet, du rêve à la forme" },
  33: { name: 'Tiphéreth amplifiée', sense: "l'harmonie mise au service des autres" },
};

function stripLetters(word: string): string {
  return word.replace(/œ/gi, 'oe').replace(/æ/gi, 'ae').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');
}

export interface CabalWord { word: string; letters: Array<{ ch: string; value: number }>; sum: number }
export interface CabalPart { n: number; trad: string | null; display: string | null; modern: string; axes: CabalEntry['axes']; tone: CabalEntry['tone']; hide: boolean }
export interface CabalResult {
  words: CabalWord[];
  total: number;
  /** total après suppression des milliers (si le total n'est pas dans la table) */
  retained: number;
  droppedThousands: number;
  parts: CabalPart[];
  /** « sentence secrète » : mots-clés des significations retenues */
  keyPhrase: string;
  sephira: { number: number; name: string; sense: string };
}

const usable = (n: number): boolean => { const e = CABAL_BY_N[n]; return !!e && e.trad !== null; };

/** Règle du livre : table exacte -> sinon on retire les milliers -> sinon centaines + dizaines + unités (ou nombre à 2 chiffres s'il existe). */
export function decompose(total: number): { retained: number; dropped: number; parts: number[] } {
  if (usable(total)) return { retained: total, dropped: 0, parts: [total] };
  let n = total;
  let dropped = 0;
  if (n >= 1000) { dropped = Math.floor(n / 1000) * 1000; n = n % 1000; if (n === 0) return { retained: 1000, dropped: dropped - 1000, parts: [1000] }; }
  if (usable(n)) return { retained: n, dropped, parts: [n] };
  const parts: number[] = [];
  const h = Math.floor(n / 100) * 100;
  const r = n - h;
  if (h > 0) parts.push(h);
  if (r > 0) {
    if (usable(r)) parts.push(r);
    else {
      const t = Math.floor(r / 10) * 10;
      const u = r % 10;
      if (t > 0) parts.push(t);
      if (u > 0) parts.push(u);
    }
  }
  return { retained: n, dropped, parts };
}

export function computeCabal(fullName: string): CabalResult | null {
  const rawWords = fullName.split(/[\s\-'’]+/).map(stripLetters).filter((w) => w.length > 0);
  if (rawWords.length === 0) return null;
  const words: CabalWord[] = rawWords.map((w) => {
    const letters = [...w].map((ch) => ({ ch, value: CABAL_VALUES[ch] as number }));
    return { word: w, letters, sum: letters.reduce((a, l) => a + l.value, 0) };
  });
  const total = words.reduce((a, w) => a + w.sum, 0);
  const { retained, dropped, parts: nums } = decompose(total);
  const parts: CabalPart[] = nums.map((n) => {
    const e = CABAL_BY_N[n] as CabalEntry;
    return { n, trad: e.trad, display: e.display, modern: e.modern, axes: e.axes, tone: e.tone, hide: !!e.hide };
  });

  const kw = (p: CabalPart) => (p.display ? p.display.split(',').slice(0, 2).map((x) => x.trim().toLowerCase()).join(', ') : p.modern.split(':')[0]!.trim().toLowerCase());
  const keyPhrase = parts.length === 1
    ? `La signature cabalistique de votre nom est « ${kw(parts[0]!)} ».`
    : `La signature cabalistique de votre nom associe « ${parts.map(kw).join(' », « ')} ».`;

  const red = reduceNumber(total);
  const seph = SEPHIROTH[red] ?? SEPHIROTH[reduceNumber(red, false)]!;
  return { words, total, retained, droppedThousands: dropped, parts, keyPhrase, sephira: { number: red, ...seph } };
}
