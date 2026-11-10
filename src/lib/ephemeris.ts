import type { BodyKey, Ephemeris } from '../types';
import { noonUTC } from './dates';

/**
 * Ayanamsa Lahiri à J2000 (23°51'11"). En fixant le repère écliptique J2000,
 * longitude sidérale = longitude écliptique J2000 − 23,85306° (la précession
 * se compense exactement : plus besoin d'ayanamsa dépendant de l'année).
 */
export const LAHIRI_AYANAMSA_J2000 = 23.85306;
export const OBLIQUITY_J2000 = 23.4392911;

export const norm360 = (x: number) => ((x % 360) + 360) % 360;
export const signIndexOf = (lon: number) => Math.floor(norm360(lon) / 30) % 12;
export const degreeInSign = (lon: number) => norm360(lon) % 30;
/** Maison (1..12) occupée par un astre pour un signe donné (maisons « signes entiers »). */
export const houseOf = (signIdx: number, bodySignIdx: number) => ((bodySignIdx - signIdx + 12) % 12) + 1;

/** Vecteur équatorial J2000 (x, y, z) -> longitude sidérale Lahiri. Fonction pure, testée. */
export function eqjToSidereal(x: number, y: number, z: number): number {
  const eps = (OBLIQUITY_J2000 * Math.PI) / 180;
  const yEcl = y * Math.cos(eps) + z * Math.sin(eps);
  const lon = (Math.atan2(yEcl, x) * 180) / Math.PI;
  return norm360(lon - LAHIRI_AYANAMSA_J2000);
}

let current: Ephemeris | null = null;
const listeners: Array<() => void> = [];

export function setEphemeris(e: Ephemeris): void {
  current = e;
  listeners.forEach((fn) => fn());
}
/** Les caches dépendant des éphémérides s'enregistrent ici pour être vidés au changement de fournisseur. */
export const onEphemerisChange = (fn: () => void) => { listeners.push(fn); };

export function getEphemeris(): Ephemeris {
  if (!current) throw new Error("Aucune éphéméride configurée : appelez setEphemeris() (voir src/lib/api.ts).");
  return current;
}

export const siderealAt = (body: BodyKey, at: Date) => getEphemeris().siderealLongitude(body, at);
/** Longitude sidérale à 12:00 UTC du jour ISO donné. */
export const siderealOnDay = (body: BodyKey, iso: string) => siderealAt(body, noonUTC(iso));
