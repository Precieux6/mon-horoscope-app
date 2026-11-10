import { PLANETS, SIGN_RULERS, ELEMENT_EMO, JUPITER_BY_ELEMENT, SATURN_BY_ELEMENT } from '../data/astroTexts';
import { NUM_TRAITS, KARMIC, PERSONAL_YEAR_ADVICE, MATURITY } from '../data/numerologyTexts';
import { SIGN_PROFILES } from '../data/profiles';
import { ZODIAC_SIGNS } from '../data/zodiac';
import { CONFIG } from '../config';
import type { ZodiacSign } from '../types';
import { isValidISODate, toLocalISODate, toYearMonth } from './dates';
import { crossAnalyze, type CrossAnalysis } from './analysis';
import { computeCabal, type CabalResult } from './cabal';
import { signIndexOf, siderealAt, siderealOnDay } from './ephemeris';
import { computeNumerology, type NumerologyResult } from './numerology';
import { hashString } from './rng';
import { sunPlacement } from './sidereal';

export interface ProfileResult {
  sign: ZodiacSign;
  birthYear: number;
  dominantPlanet: string;
  numerology: NumerologyResult;
  cabal: CabalResult;
  analysis: CrossAnalysis;
  qualities: string[];
  flaws: string[];
  anecdotes: string[];
  talents: string[];
  excellenceDomains: string[];
  astro: {
    sunDegree: number; sunMinutes: number; borderline: boolean;
    decan: 1 | 2 | 3; decanRuler: string;
    moon: { certain: boolean; signs: ZodiacSign[] };
    jupiterSign: ZodiacSign; saturnSign: ZodiacSign;
    /** À afficher en petit sous la synthèse */
    note: string;
  };
}

interface Cand { text: string; score: number }

/** Classe les traits issus de plusieurs sources ; l'égalité est départagée par un hash (date + nom + trait). */
function topTraits(sources: Array<{ items: string[]; base: number; step: number }>, seed: string, count: number): string[] {
  const best = new Map<string, Cand>();
  for (const src of sources) {
    src.items.forEach((text, i) => {
      const jitter = hashString(`${seed}|${text}`) % 6;
      const score = src.base - src.step * i + jitter;
      const k = text.toLowerCase();
      const prev = best.get(k);
      if (!prev || score > prev.score) best.set(k, { text, score });
    });
  }
  return [...best.values()].sort((a, b) => b.score - a.score || a.text.localeCompare(b.text, 'fr')).slice(0, count).map((c) => c.text);
}

const pad2 = (n: number) => String(n).padStart(2, '0');

export function buildProfile(dateISO: string, fullName: string, now: Date = new Date()): ProfileResult | null {
  if (!isValidISODate(dateISO)) return null;
  const birthYear = Number(dateISO.slice(0, 4));
  if (birthYear < CONFIG.PROFILE_MIN_YEAR || dateISO > now.toISOString().slice(0, 10)) return null;

  const num = computeNumerology(dateISO, fullName, now.getFullYear());
  const cabal = computeCabal(fullName);
  if (!num || !cabal) return null;

  const sun = sunPlacement(dateISO);
  const sign = ZODIAC_SIGNS[sun.signIndex] as ZodiacSign;
  const decan = Math.min(3, Math.floor(sun.degree / 10) + 1) as 1 | 2 | 3;
  const ruler = SIGN_RULERS[(sun.signIndex + 4 * (decan - 1)) % 12] as string;
  const rulerData = PLANETS[ruler]!;

  const moonStart = signIndexOf(siderealAt('moon', new Date(`${dateISO}T00:00:00Z`)));
  const moonEnd = signIndexOf(siderealAt('moon', new Date(`${dateISO}T23:59:59Z`)));
  const moonCertain = moonStart === moonEnd;
  const moonSigns = moonCertain ? [ZODIAC_SIGNS[moonStart]!] : [ZODIAC_SIGNS[moonStart]!, ZODIAC_SIGNS[moonEnd]!];
  const jupiterSign = ZODIAC_SIGNS[signIndexOf(siderealOnDay('jupiter', dateISO))]!;
  const saturnSign = ZODIAC_SIGNS[signIndexOf(siderealOnDay('saturn', dateISO))]!;

  // ---- Traits : somme pondérée des vraies composantes (signe, chemin de vie, expression, décan, âme)
  const seed = `${dateISO}|${fullName.trim().toLowerCase()}`;
  const signData = SIGN_PROFILES[sign.id];
  const lp = NUM_TRAITS[num.lifePath] ?? NUM_TRAITS[1]!;
  const ex = NUM_TRAITS[num.expression] ?? NUM_TRAITS[1]!;
  const so = NUM_TRAITS[num.soul] ?? NUM_TRAITS[1]!;
  const qualities = topTraits([
    { items: signData?.qualities ?? [], base: 90, step: 3 },
    { items: lp.qualities, base: 86, step: 3 },
    { items: ex.qualities, base: 80, step: 3 },
    { items: rulerData.qualities, base: 74, step: 3 },
    { items: so.qualities, base: 70, step: 3 },
  ], `q|${seed}`, 10);
  const flaws = topTraits([
    { items: signData?.flaws ?? [], base: 90, step: 3 },
    { items: lp.flaws, base: 86, step: 3 },
    { items: ex.flaws, base: 80, step: 3 },
    { items: rulerData.flaws, base: 74, step: 3 },
    { items: so.flaws, base: 70, step: 3 },
  ], `f|${seed}`, 10);
  const excellenceDomains = topTraits([
    { items: signData?.excellenceDomains ?? [], base: 90, step: 2 },
    { items: lp.domains, base: 88, step: 3 },
    { items: ex.domains, base: 84, step: 3 },
  ], `d|${seed}`, 5);

  // ---- Synthèse : 13 à 15 phrases bâties sur des valeurs réellement calculées
  const decanLabel = decan === 1 ? '1er' : `${decan}e`;
  const parts: string[] = [];
  parts.push(`En ${birthYear}, le jour de votre naissance, le Soleil sidéral se trouvait à ${sun.degree}°${pad2(sun.minutes)}′ ${sign.de} : votre signe est donc ${sign.name} (élément ${sign.element}).`);
  if (sun.borderline) parts.push("Le Soleil était alors tout près de la frontière du signe voisin : seule l'heure exacte de votre naissance permettrait de trancher avec certitude.");
  parts.push(`Vous appartenez au ${decanLabel} décan, placé sous l'influence de ${ruler}, qui ${rulerData.effect}.`);
  if (moonCertain) {
    const m = moonSigns[0]!;
    parts.push(`La Lune traversait alors ${m.name} sidéral, ce qui donne à votre vie intérieure ${ELEMENT_EMO[m.element]}.`);
  } else {
    parts.push(`La Lune changeait de signe ce jour-là (de ${moonSigns[0]!.name} à ${moonSigns[1]!.name}) : sans l'heure de naissance, impossible de savoir lequel est le vôtre.`);
  }
  parts.push(`Jupiter, planète de la croissance, se trouvait en ${jupiterSign.name} à votre naissance, ${JUPITER_BY_ELEMENT[jupiterSign.element]}.`);
  parts.push(`Saturne, planète de la discipline, se trouvait en ${saturnSign.name}, ${SATURN_BY_ELEMENT[saturnSign.element]}.`);
  parts.push(num.lifePathText, num.expressionText, num.soulText, num.intimateText, cabal.keyPhrase, num.personalYearText);
  parts.push(`Votre nombre de maturité (${num.maturity}) ${MATURITY[num.maturity]}.`);
  if (num.missingNumbers.length) parts.push(KARMIC[num.missingNumbers[0] as number] as string);
  parts.push(`Conseil de votre année personnelle ${num.personalYearLabel} : ${PERSONAL_YEAR_ADVICE[num.personalYear]}.`);
  const summaryText = parts.slice(0, 15).join(' ');

  const analysis = crossAnalyze({
    dateISO, fullName, num, cabal, sunBorderline: sun.borderline,
    yearMonth: toYearMonth(toLocalISODate(now)),
    astro: {
      signIndex: sun.signIndex, signName: sign.name, element: sign.element, ruler: sign.planet,
      decan, decanRuler: ruler, moonCertain,
      moonElement: moonCertain ? moonSigns[0]!.element : undefined, moonName: moonCertain ? moonSigns[0]!.name : undefined,
    },
  });

  return {
    sign, birthYear,
    dominantPlanet: `Planète dominante : ${ruler}, maître du ${decanLabel} décan, qui ${rulerData.effect}.`,
    numerology: { ...num, summaryText },
    cabal, analysis,
    qualities, flaws,
    anecdotes: signData?.anecdotes ?? [],
    talents: signData?.talents ?? [],
    excellenceDomains,
    astro: {
      sunDegree: sun.degree, sunMinutes: sun.minutes, borderline: sun.borderline,
      decan, decanRuler: ruler,
      moon: { certain: moonCertain, signs: moonSigns },
      jupiterSign, saturnSign,
      note: "Positions planétaires calculées pour votre date de naissance (midi UTC). L'heure et le lieu de naissance permettraient d'affiner la Lune et l'ascendant. Contenu proposé à titre de divertissement.",
    },
  };
}
