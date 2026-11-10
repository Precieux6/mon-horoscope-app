import type { BodyKey, Ephemeris } from '../../source/types';

/** Éphéméride approchée (moyens mouvements) : suffit à tester la LOGIQUE des moteurs, pas l'astronomie. */
const rad = Math.PI / 180;
const n360 = (x: number) => ((x % 360) + 360) % 360;
export const fakeEphemeris: Ephemeris = {
  siderealLongitude(body: BodyKey, at: Date): number {
    const d = (at.getTime() - Date.UTC(2000, 0, 1, 12)) / 86_400_000;
    const sun = 280.46646 + 0.9856474 * d + 1.915 * Math.sin(rad * (357.529 + 0.98560028 * d));
    let trop: number;
    switch (body) {
      case 'sun': trop = sun; break;
      case 'moon': trop = 218.3164477 + 13.17639648 * d + 6.289 * Math.sin(rad * (134.963 + 13.06499295 * d)); break;
      case 'mercury': trop = sun + 25 * Math.sin((2 * Math.PI * d) / 116); break;
      case 'venus': trop = sun + 45 * Math.sin((2 * Math.PI * d) / 584 + 1); break;
      case 'mars': trop = 355.43 + 0.524 * d; break;
      case 'jupiter': trop = 34.35 + 0.08309 * d; break;
      default: trop = 50.08 + 0.03346 * d;
    }
    return n360(trop - 23.85306 - 3.8247e-5 * d);
  },
};
