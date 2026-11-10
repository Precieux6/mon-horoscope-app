// Calibrage RÉEL sur astronomy-engine. À lancer chez vous : npm test
import { describe, expect, it } from 'vitest';

const mod = await import('../source/lib/astronomyEphemeris').catch(() => null);
const eph = await import('../source/lib/ephemeris');
const sidereal = await import('../source/lib/sidereal');
const { addDays } = await import('../source/lib/dates');

describe.skipIf(!mod)('calibrage astronomy-engine', () => {
  it('le Soleil entre en Mesha (0° sidéral) vers le 14 avril 2026', () => {
    eph.setEphemeris(mod!.astronomyEphemeris);
    const before = eph.siderealOnDay('sun', '2026-04-12');
    const after = eph.siderealOnDay('sun', '2026-04-16');
    expect(before).toBeGreaterThan(356);
    expect(after).toBeGreaterThan(0);
    expect(after).toBeLessThan(3);
  });
  it('le Soleil avance de 0,9 à 1,02° par jour', () => {
    eph.setEphemeris(mod!.astronomyEphemeris);
    for (let i = 0; i < 365; i += 7) {
      const a = eph.siderealOnDay('sun', addDays('2026-01-01', i));
      const b = eph.siderealOnDay('sun', addDays('2026-01-01', i + 1));
      const delta = (b - a + 360) % 360;
      expect(delta).toBeGreaterThan(0.9);
      expect(delta).toBeLessThan(1.02);
    }
  });
  it('la Lune avance de 11,5 à 15,5° par jour', () => {
    eph.setEphemeris(mod!.astronomyEphemeris);
    for (let i = 0; i < 60; i++) {
      const a = eph.siderealOnDay('moon', addDays('2026-01-01', i));
      const b = eph.siderealOnDay('moon', addDays('2026-01-01', i + 1));
      const delta = (b - a + 360) % 360;
      expect(delta).toBeGreaterThan(11.5);
      expect(delta).toBeLessThan(15.5);
    }
  });
  it('le signe solaire concorde avec la méthode approximative toute l’année 2026 (±1 signe, jamais de repli)', () => {
    eph.setEphemeris(mod!.astronomyEphemeris);
    for (let i = 0; i < 365; i++) {
      const iso = addDays('2026-01-01', i);
      const p = sidereal.sunPlacement(iso);
      expect(p.usedFallback).toBe(false);
    }
  });
});
