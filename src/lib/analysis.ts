import { AXES, AXIS_LABEL, type Axis, type AxisVector } from '../data/axes';
import { ACTION, ELEMENT_AXES, MODES, NUMBER_AXES, PITFALL, PLANET_AXES, STRENGTH } from '../data/analysisTexts';
import { PERSONAL_YEAR_ADVICE } from '../data/numerologyTexts';
import { HOUSE_THEMES, ZODIAC_SIGNS } from '../data/zodiac';
import type { Element } from '../types';
import type { CabalResult } from './cabal';
import { houseOf } from './ephemeris';
import { planetSignAtMonth } from './ordinals';
import type { NumerologyResult } from './numerology';
import { hashString } from './rng';

export interface AstroInput {
  signIndex: number; signName: string; element: Element; ruler: string;
  decan: 1 | 2 | 3; decanRuler: string;
  moonCertain: boolean; moonElement?: Element; moonName?: string;
}

export type SystemKey = 'astro' | 'pyth' | 'cabal';
export interface AxisResult { axis: Axis; label: string; score: number; bySystem: Record<SystemKey, number> }
export interface CrossAnalysis {
  keyPhrase: string;
  axes: AxisResult[];
  convergences: Array<{ axis: Axis; label: string; level: 'forte' | 'partielle'; text: string }>;
  tensions: string[];
  portrait: string[];
  pitfalls: string[];
  plan: Array<{ week: number; title: string; text: string }>;
  daily: string[];
  sheet: string[];
  confidence: { sun: 'sûr' | 'à la frontière'; moon: 'sûr' | 'incertain (heure inconnue)' };
}

const emptyVec = (): Record<Axis, number> => ({ relations: 0, carriere: 0, argent: 0, sante: 0, sens: 0 });
function add(target: Record<Axis, number>, v: AxisVector | undefined, w: number) {
  if (!v) return;
  for (const a of AXES) target[a] += (v[a] ?? 0) * w;
}
const normalize = (v: Record<Axis, number>): Record<Axis, number> => {
  const sum = AXES.reduce((a, k) => a + v[k], 0) || 1;
  const out = emptyVec();
  for (const k of AXES) out[k] = v[k] / sum;
  return out;
};
const top = (v: Record<Axis, number>, n: number): Axis[] =>
  [...AXES].sort((a, b) => v[b] - v[a] || AXES.indexOf(a) - AXES.indexOf(b)).slice(0, n);
const pick3 = <T,>(arr: readonly [T, T, T], seed: string): T => arr[hashString(seed) % 3] as T;

export interface AnalysisInput {
  dateISO: string; fullName: string;
  astro: AstroInput; num: NumerologyResult; cabal: CabalResult;
  sunBorderline: boolean; yearMonth: string;
}

/**
 * MÉTHODE DES TROIS CLÉS : trois systèmes indépendants projetés sur cinq axes de vie,
 * puis croisés pour dégager convergences (forces sûres), tensions (points d'attention) et un plan d'action.
 */
export function crossAnalyze(input: AnalysisInput): CrossAnalysis {
  const { astro, num, cabal } = input;
  const seed = `${input.dateISO}|${input.fullName.trim().toLowerCase()}`;

  // --- Clé 1 : astrologie sidérale (positions réelles)
  const A = emptyVec();
  add(A, PLANET_AXES[astro.ruler], 1);
  add(A, PLANET_AXES[astro.decanRuler], 0.7);
  add(A, ELEMENT_AXES[astro.element], 1);
  const mode = MODES[astro.signIndex % 3]!;
  add(A, mode.axes, 0.7);
  if (astro.moonCertain && astro.moonElement) add(A, ELEMENT_AXES[astro.moonElement], 0.5);

  // --- Clé 2 : numérologie pythagoricienne
  const P = emptyVec();
  add(P, NUMBER_AXES[num.lifePath], 1);
  add(P, NUMBER_AXES[num.expression], 0.8);
  add(P, NUMBER_AXES[num.soul], 0.6);
  add(P, NUMBER_AXES[num.intimate], 0.4);
  add(P, NUMBER_AXES[num.personalYear], 0.6);
  add(P, NUMBER_AXES[num.maturity], 0.3);

  // --- Clé 3 : nombre cabalistique du nom (table du livre)
  const C = emptyVec();
  for (const part of cabal.parts) {
    add(C, { [part.axes[0]]: 2, ...(part.axes[1] ? { [part.axes[1]]: 1 } : {}) } as AxisVector, 1);
  }
  add(C, NUMBER_AXES[cabal.sephira.number] ?? NUMBER_AXES[1], 0.5);

  const nA = normalize(A), nP = normalize(P), nC = normalize(C);
  const total = emptyVec();
  for (const a of AXES) total[a] = nA[a] + nP[a] + nC[a];
  const maxTotal = Math.max(...AXES.map((a) => total[a])) || 1;

  const axes: AxisResult[] = [...AXES]
    .sort((a, b) => total[b] - total[a] || AXES.indexOf(a) - AXES.indexOf(b))
    .map((axis) => ({
      axis, label: AXIS_LABEL[axis], score: Math.round((total[axis] / maxTotal) * 100),
      bySystem: { astro: Math.round(nA[axis] * 100), pyth: Math.round(nP[axis] * 100), cabal: Math.round(nC[axis] * 100) },
    }));

  const rankTop = { astro: top(nA, 2), pyth: top(nP, 2), cabal: top(nC, 2) };
  const convergences: CrossAnalysis['convergences'] = [];
  for (const axis of AXES) {
    const n = (['astro', 'pyth', 'cabal'] as SystemKey[]).filter((k) => rankTop[k].includes(axis));
    if (n.length >= 2) {
      const names: Record<SystemKey, string> = {
        astro: `votre ${astro.signName} sidéral (${astro.element}, ${mode.name})`,
        pyth: `vos nombres (chemin de vie ${num.lifePath}, expression ${num.expression})`,
        cabal: `le nombre cabalistique de votre nom (${cabal.total})`,
      };
      convergences.push({
        axis, label: AXIS_LABEL[axis], level: n.length === 3 ? 'forte' : 'partielle',
        text: `${n.length === 3 ? 'Convergence forte' : 'Convergence partielle'} sur « ${AXIS_LABEL[axis]} » : ${n.map((k) => names[k]).join(' et ')} vont dans le même sens.`,
      });
    }
  }
  convergences.sort((a, b) => (a.level === b.level ? 0 : a.level === 'forte' ? -1 : 1));

  // Tensions : l'axe n°1 d'un système est quasi absent d'un autre
  const tensions: string[] = [];
  const sysName: Record<SystemKey, string> = { astro: 'le ciel de naissance', pyth: 'vos nombres', cabal: 'le nombre de votre nom' };
  const vecs: Record<SystemKey, Record<Axis, number>> = { astro: nA, pyth: nP, cabal: nC };
  for (const s1 of ['astro', 'pyth', 'cabal'] as SystemKey[]) {
    const best = top(vecs[s1], 1)[0] as Axis;
    for (const s2 of ['astro', 'pyth', 'cabal'] as SystemKey[]) {
      if (s1 !== s2 && vecs[s2][best] === 0 && tensions.length < 2) {
        tensions.push(`${sysName[s1]} valorise « ${AXIS_LABEL[best]} » alors que ${sysName[s2]} n'en dit rien : c'est un domaine à travailler consciemment plutôt qu'à attendre de la chance.`);
      }
    }
  }

  const ranking = axes.map((a) => a.axis);
  const best = ranking[0] as Axis, second = ranking[1] as Axis, weakest = ranking[ranking.length - 1] as Axis;

  const portrait = [
    pick3(STRENGTH[best], `${seed}|s1`),
    `${astro.signName} (${astro.element}) : ${mode.text}. Votre chemin de vie ${num.lifePath} et votre nombre d'expression ${num.expression} confirment cette orientation vers « ${AXIS_LABEL[best]} ».`,
    pick3(STRENGTH[second], `${seed}|s2`),
    `${cabal.keyPhrase} ${cabal.parts.filter((p) => p.modern).map((p) => p.modern).slice(0, 2).join(' ')}`,
    `Côté Sephiroth, votre nom résonne avec ${cabal.sephira.name} : ${cabal.sephira.sense}.`,
  ];
  const pitfalls = [pick3(PITFALL[best], `${seed}|p1`), pick3(PITFALL[weakest], `${seed}|p2`)];

  // Contexte astral du mois courant pour VOTRE signe
  const sunH = houseOf(astro.signIndex, planetSignAtMonth('sun', input.yearMonth));
  const marsH = houseOf(astro.signIndex, planetSignAtMonth('mars', input.yearMonth));
  const venusH = houseOf(astro.signIndex, planetSignAtMonth('venus', input.yearMonth));
  const plan: CrossAnalysis['plan'] = [
    { week: 1, title: `Semaine 1 : poser l'intention (${AXIS_LABEL[best]})`, text: `Le Soleil traverse votre maison ${sunH}, celle de ${HOUSE_THEMES[sunH - 1]}. Votre axe fort est « ${AXIS_LABEL[best]} » : ${pick3(ACTION[best], `${seed}|a1`)}` },
    { week: 2, title: `Semaine 2 : renforcer le point le plus fragile (${AXIS_LABEL[weakest]})`, text: `C'est l'axe le moins soutenu par vos trois clés : ${pick3(ACTION[weakest], `${seed}|a2`)}` },
    { week: 3, title: `Semaine 3 : profiter de l'énergie du mois`, text: `Mars traverse votre maison ${marsH} (${HOUSE_THEMES[marsH - 1]}) et Vénus votre maison ${venusH} (${HOUSE_THEMES[venusH - 1]}) : engagez vos efforts sur ces thèmes, puis ${pick3(ACTION[second], `${seed}|a3`)}` },
    { week: 4, title: `Semaine 4 : bilan et année personnelle ${num.personalYearLabel}`, text: `${pitfalls[0]} Pour votre année personnelle ${num.personalYear}, ${PERSONAL_YEAR_ADVICE[num.personalYear]}. Notez ce qui a fonctionné et reconduisez-le le mois suivant.` },
  ];
  const daily = [pick3(ACTION[best], `${seed}|d1`), pick3(ACTION[second], `${seed}|d2`), pick3(ACTION[weakest], `${seed}|d3`)]
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));

  const sheet = [
    `Soleil sidéral : ${astro.signName}, ${astro.decan === 1 ? '1er' : astro.decan + 'e'} décan, maître ${astro.decanRuler}`,
    `Lune : ${astro.moonCertain ? astro.moonName : 'signe incertain sans heure de naissance'}`,
    `Chemin de vie ${num.lifePath} · Expression ${num.expression} · Âme ${num.soul} · Intime ${num.intimate} · Maturité ${num.maturity} · Année personnelle ${num.personalYearLabel}`,
    ...cabal.words.map((w) => `${w.word} = ${w.letters.map((l) => l.value).join(' + ')} = ${w.sum}`),
    `Total cabalistique : ${cabal.total}${cabal.droppedThousands ? ` → milliers retirés → ${cabal.retained}` : ''}${cabal.parts.length > 1 || cabal.parts[0]!.n !== cabal.retained ? ` → ${cabal.parts.map((p) => p.n).join(' + ')}` : ''}`,
    `Sephira du nom : ${cabal.sephira.name}`,
  ];

  return {
    keyPhrase: cabal.keyPhrase, axes, convergences, tensions, portrait, pitfalls, plan, daily, sheet,
    confidence: { sun: input.sunBorderline ? 'à la frontière' : 'sûr', moon: astro.moonCertain ? 'sûr' : 'incertain (heure inconnue)' },
  };
}
