import { beforeAll, describe, expect, it } from 'vitest';
import { computeCabal, decompose } from '../source/lib/cabal';
import { setEphemeris } from '../source/lib/ephemeris';
import { computeNumerology, normalizeName, reduceNumber } from '../source/lib/numerology';
import { buildProfile } from '../source/lib/profile';
import { addDays } from '../source/lib/dates';
import { CABAL_BY_N } from '../source/data/cabalTable';
import { EXPRESSION, INTIMATE, LIFE_PATH, PERSONAL_YEAR, SOUL } from '../source/data/numerologyTexts';
import { fakeEphemeris } from './helpers/fakeEphemeris';

beforeAll(() => setEphemeris(fakeEphemeris));
const NOW = new Date('2026-10-29T10:00:00Z');

describe('numérologie pythagoricienne', () => {
  it('ignore les accents', () => {
    expect(normalizeName('Précieux Trésor TOSSOU')).toBe('precieuxtresortossou');
    const a = computeNumerology('1995-07-23', 'Précieux Trésor TOSSOU', 2026)!;
    const b = computeNumerology('1995-07-23', 'Precieux Tresor TOSSOU', 2026)!;
    expect(a).toEqual(b);
  });
  it('chemin de vie du 1995-07-23 = 9 ; année personnelle 2026 = 4 (13/4)', () => {
    const n = computeNumerology('1995-07-23', 'Jean Dupont', 2026)!;
    expect(n.lifePath).toBe(9);
    expect(n.personalYear).toBe(4);
    expect(n.personalYearLabel).toBe('13/4');
  });
  it('réduction et nombres maîtres', () => {
    expect(reduceNumber(29)).toBe(11);
    expect(reduceNumber(22)).toBe(22);
    expect(reduceNumber(22, false)).toBe(4);
    expect(reduceNumber(33)).toBe(33);
  });
  it('jamais de texte manquant (11, 22, 33 compris)', () => {
    const names = ['Jean Dupont', 'Marie Curie', 'Précieux Trésor TOSSOU', 'Aïssatou Diallo', 'Kofi Annan', 'Zoé Ngo', 'Yves Éric', 'Li Wei', 'Folly Valère', 'Ève Œuvre'];
    let masters = 0;
    for (let y = 1950; y <= 2005; y++) for (let m = 1; m <= 12; m += 5) for (const d of [3, 11, 22, 29]) {
      for (const nm of names) {
        const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const r = computeNumerology(iso, nm, 2026)!;
        for (const [n, map] of [[r.lifePath, LIFE_PATH], [r.expression, EXPRESSION], [r.soul, SOUL], [r.intimate, INTIMATE]] as const) {
          expect(map[n]).toBeTruthy();
          if ([11, 22, 33].includes(n)) masters++;
        }
        expect(PERSONAL_YEAR[r.personalYear]).toBeTruthy();
        expect(r.maturityText.length).toBeGreaterThan(20);
      }
    }
    expect(masters).toBeGreaterThan(0);
  });
});

describe('méthode cabalistique du livre (pp. 185-191)', () => {
  it('reproduit l’exemple Jean-Jacques Rousseau : 646 + 969 + 716 = 2331 -> 331 -> 300 + 31', () => {
    const c = computeCabal('Jean-Jacques Rousseau')!;
    expect(c.words.map((w) => w.sum)).toEqual([646, 969, 716]);
    expect(c.total).toBe(2331);
    expect(c.retained).toBe(331);
    expect(c.parts.map((p) => p.n)).toEqual([300, 31]);
    expect(c.keyPhrase).toContain('salut');
  });
  it('reproduit l’exemple César : 179 -> 100 + 70 + 9', () => {
    const c = computeCabal('César')!;
    expect(c.total).toBe(179);
    expect(c.parts.map((p) => p.n)).toEqual([100, 70, 9]);
  });
  it('règles de décomposition', () => {
    expect(decompose(19).parts).toEqual([10, 9]);   // « Nul » -> décomposé
    expect(decompose(313).parts).toEqual([313]);    // présent dans la table
    expect(decompose(1095).parts).toEqual([1095]);
    expect(decompose(2000).parts).toEqual([1000]);
    expect(decompose(5).parts).toEqual([5]);
  });
  it('tous les totaux 1..5000 donnent des significations existantes', () => {
    for (let n = 1; n <= 5000; n++) {
      const d = decompose(n);
      expect(d.parts.length).toBeGreaterThan(0);
      for (const p of d.parts) { expect(CABAL_BY_N[p]).toBeTruthy(); expect(CABAL_BY_N[p]!.trad).not.toBeNull(); }
    }
  });
  it('accents et tirets traités comme dans le livre', () => {
    expect(computeCabal('Jean Jacques')!.words.length).toBe(2);
    expect(computeCabal('')).toBeNull();
  });
});

describe('profil complet', () => {
  it('structure, 13 à 15 phrases de synthèse, analyse croisée', () => {
    const p = buildProfile('1995-07-23', 'Précieux Trésor TOSSOU', NOW)!;
    expect(p).toBeTruthy();
    const n = (p.numerology.summaryText.match(/[.!?](\s|$)/g) ?? []).length;
    expect(n).toBeGreaterThanOrEqual(13);
    expect(n).toBeLessThanOrEqual(15);
    expect(p.qualities).toHaveLength(10);
    expect(p.flaws).toHaveLength(10);
    expect(p.excellenceDomains.length).toBeGreaterThanOrEqual(3);
    expect(p.analysis.plan).toHaveLength(4);
    expect(p.analysis.axes).toHaveLength(5);
    expect(p.analysis.sheet.length).toBeGreaterThan(5);
    expect(p.numerology.personalYearText).toContain(`Année personnelle ${p.numerology.personalYear}`);
  });
  it('refuse les entrées invalides', () => {
    expect(buildProfile('2026-02-30', 'Jean Dupont', NOW)).toBeNull();
    expect(buildProfile('1995-07-23', '', NOW)).toBeNull();
    expect(buildProfile('2030-01-01', 'Jean Dupont', NOW)).toBeNull();
    expect(buildProfile('1850-01-01', 'Jean Dupont', NOW)).toBeNull();
  });
  it('deux dates de naissance différentes ne donnent jamais la même synthèse (1950-2005)', () => {
    const seen = new Set<string>();
    let d = '1950-01-01';
    let count = 0;
    while (d <= '2005-12-31') {
      const p = buildProfile(d, 'Jean Dupont', NOW)!;
      const key = p.numerology.summaryText;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
      d = addDays(d, 1);
      count++;
    }
    expect(count).toBeGreaterThan(20000);
  });
  it('deux noms différents (même date) donnent des analyses différentes', () => {
    const a = buildProfile('1995-07-23', 'Jean Dupont', NOW)!;
    const b = buildProfile('1995-07-23', 'Marie Curie', NOW)!;
    expect(a.analysis.sheet).not.toEqual(b.analysis.sheet);
    expect(a.numerology.summaryText).not.toBe(b.numerology.summaryText);
  });
  it('stable : même entrée, même résultat', () => {
    expect(buildProfile('1988-03-14', 'Awa Sow', NOW)).toEqual(buildProfile('1988-03-14', 'Awa Sow', NOW));
  });
});
