import { beforeAll, describe, expect, it } from 'vitest';
import { CONFIG } from '../source/config';
import { ZODIAC_SIGNS } from '../source/data/zodiac';
import { addDays } from '../source/lib/dates';
import { clearDeckCache, selectSentences } from '../source/lib/deck';
import { eqjToSidereal, setEphemeris } from '../source/lib/ephemeris';
import { generateDailyReading } from '../source/lib/horoscope';
import { generateMonthlyReading } from '../source/lib/monthly';
import { approxSunSignIndex } from '../source/lib/sidereal';
import { dailyReadiness, monthlyReadiness } from '../source/lib/banks';
import { fakeEphemeris } from './helpers/fakeEphemeris';
import { syntheticDaily, syntheticMonthly } from './helpers/syntheticBank';

beforeAll(() => { setEphemeris(fakeEphemeris); clearDeckCache(); });

const sents = (text: string) => text.split(' ').filter(Boolean);
const dailySet = (r: ReturnType<typeof generateDailyReading>) => new Set([...sents(r.amour.text), ...sents(r.travail.text), ...sents(r.argent.text), ...sents(r.sante.text), ...sents(r.conseil)]);

describe('conversion éphéméride', () => {
  it('convertit un vecteur équatorial J2000 en longitude sidérale Lahiri', () => {
    const eps = (23.4392911 * Math.PI) / 180;
    // longitude écliptique J2000 = 90°  =>  (0, cos ε, sin ε)
    expect(eqjToSidereal(0, Math.cos(eps), Math.sin(eps))).toBeCloseTo(90 - 23.85306, 4);
    expect(eqjToSidereal(1, 0, 0)).toBeCloseTo(360 - 23.85306, 4);
  });
  it('garde-fou : signe solaire approximatif', () => {
    expect(approxSunSignIndex('2026-04-13')).toBe(11);
    expect(approxSunSignIndex('2026-04-15')).toBe(0);
    expect(approxSunSignIndex('2026-01-01')).toBe(8);
    expect(approxSunSignIndex('2026-01-15')).toBe(9);
  });
});

describe('paquets de phrases', () => {
  for (const P of [54, 72]) {
    it(`3 jours consécutifs (séjour de la Lune) sans phrase commune (banque de ${P})`, () => {
      const pool = Array.from({ length: P }, (_, i) => `s${i}`);
      const days: string[][] = [];
      for (let o = 0; o < 3000; o++) days.push(selectSentences(pool, `k${P}`, o, 9, 9, 3).sentences);
      for (let o = 0; o < days.length; o++) {
        expect(new Set(days[o]).size).toBe(days[o]!.length); // pas de doublon dans un jour
        for (const gap of [1, 2]) {
          const next = days[o + gap];
          if (next) for (const s of next) expect(days[o]!.includes(s)).toBe(false);
        }
      }
    });
  }
  it('est déterministe', () => {
    const pool = Array.from({ length: 48 }, (_, i) => `s${i}`);
    expect(selectSentences(pool, 'a', 17, 8, 9)).toEqual(selectSentences(pool, 'a', 17, 8, 9));
  });
});

describe('horoscope du jour (banque de 54)', () => {
  const bank = syntheticDaily(54, 16);
  const start = '2026-01-01';
  const days = Array.from({ length: 730 }, (_, i) => addDays(start, i));

  it('les 12 signes n’ont AUCUNE phrase commun le même jour', () => {
    for (const d of days) {
      const sets = ZODIAC_SIGNS.map((s) => dailySet(generateDailyReading(s.id, d, bank)));
      const seen = new Set<string>();
      for (const set of sets) for (const x of set) { expect(seen.has(x)).toBe(false); seen.add(x); }
    }
  });
  it('un même signe : aucune phrase commune entre jours consécutifs ni à 2 jours d’écart, textes jamais identiques', () => {
    for (const sign of ['belier', 'cancer', 'poissons']) {
      let prev: Set<string> | null = null;
      let prev2: Set<string> | null = null;
      const full = new Set<string>();
      for (const d of days) {
        const r = generateDailyReading(sign, d, bank);
        const cur = dailySet(r);
        if (prev) for (const x of cur) expect(prev.has(x)).toBe(false);
        if (prev2) for (const x of cur) expect(prev2.has(x)).toBe(false);
        prev2 = prev;
        prev = cur;
        full.add(r.amour.text + r.travail.text + r.argent.text + r.sante.text + r.conseil);
      }
      expect(full.size).toBe(days.length);
    }
  });
  it('7 à 9 phrases par rubrique, 2 pour le conseil, scores 28–98', () => {
    for (const d of days.slice(0, 120)) {
      const r = generateDailyReading('lion', d, bank);
      for (const c of ['amour', 'travail', 'argent', 'sante'] as const) {
        const n = sents(r[c].text).length;
        expect(n).toBeGreaterThanOrEqual(CONFIG.DAILY_SENTENCES.min);
        expect(n).toBeLessThanOrEqual(CONFIG.DAILY_SENTENCES.max);
        expect(r[c].score).toBeGreaterThanOrEqual(28);
        expect(r[c].score).toBeLessThanOrEqual(98);
      }
      expect(sents(r.conseil).length).toBe(2);
      expect(r.meta.degraded).toBe(false);
    }
  });
  it('mesure : délai minimal avant qu’une phrase revienne (même signe)', () => {
    const last = new Map<string, number>();
    let minGap = Infinity;
    days.forEach((d, i) => {
      for (const cat of ['amour', 'travail', 'argent', 'sante'] as const) {
        for (const s of sents(generateDailyReading('verseau', d, bank)[cat].text)) {
          const prev = last.get(s);
          if (prev !== undefined) minGap = Math.min(minGap, i - prev);
          last.set(s, i);
        }
      }
    });
    console.log(`[mesure] banque 54 -> plus petit écart avant répétition d'une phrase : ${minGap} jours`);
    expect(minGap).toBeGreaterThanOrEqual(24);
  });
  it('banque vide => état dégradé signalé', () => {
    expect(generateDailyReading('lion', '2026-05-05', {}).meta.degraded).toBe(true);
    expect(dailyReadiness({}).ready).toBe(false);
    expect(dailyReadiness(bank).ready).toBe(true);
  });
});

describe('tendances mensuelles', () => {
  const bank = syntheticMonthly(24);
  const months: string[] = [];
  for (let y = 2025; y <= 2030; y++) for (let m = 1; m <= 12; m++) months.push(`${y}-${String(m).padStart(2, '0')}`);
  const set = (r: ReturnType<typeof generateMonthlyReading>) => new Set(sents(`${r.amour.text} ${r.travail.text} ${r.argent.text} ${r.sante.text} ${r.conseil}`).map((s) => s.replace(/\d+ le .*/, '')));

  it('conseil mensuel : 10 à 15 phrases', () => {
    for (const ym of months) {
      const n = (generateMonthlyReading('taureau', ym, bank).conseil.match(/\./g) ?? []).length;
      expect(n).toBeGreaterThanOrEqual(10);
      expect(n).toBeLessThanOrEqual(15);
    }
  });
  it('12 signes : aucune phrase de planète commune le même mois', () => {
    for (const ym of months) {
      const seen = new Set<string>();
      for (const s of ZODIAC_SIGNS) {
        const r = generateMonthlyReading(s.id, ym, bank);
        const planetSents = new Set(sents(`${r.amour.text} ${r.travail.text} ${r.argent.text} ${r.sante.text} ${r.conseil}`).filter((x) => /^(sun|mercury|venus|mars|jupiter|saturn)\d/.test(x)));
        for (const x of planetSents) { expect(seen.has(x)).toBe(false); seen.add(x); }
      }
    }
  });
  it('un même signe : textes de mois consécutifs jamais identiques et sans phrase commune', () => {
    for (const sign of ['belier', 'scorpion']) {
      let prev: Set<string> | null = null;
      for (const ym of months) {
        const r = generateMonthlyReading(sign, ym, bank);
        const cur = new Set(sents(`${r.amour.text} ${r.travail.text} ${r.argent.text} ${r.sante.text} ${r.conseil}`).filter((x) => /^(sun|mercury|venus|mars|jupiter|saturn)\d/.test(x)));
        if (prev) for (const x of cur) expect(prev.has(x)).toBe(false);
        prev = cur;
      }
    }
    void set;
  });
  it('banque suffisante => prête', () => {
    expect(monthlyReadiness(bank).ready).toBe(true);
    expect(monthlyReadiness({ planets: {}, mercuryRetro: {}, lunation: { new: {}, full: {} } }).ready).toBe(false);
  });
});
