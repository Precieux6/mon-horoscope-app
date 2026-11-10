import * as Astronomy from 'astronomy-engine';
import type { BodyKey, Ephemeris } from '../types';
import { eqjToSidereal } from './ephemeris';

const BODY_MAP: Record<BodyKey, Astronomy.Body> = {
  sun: Astronomy.Body.Sun,
  moon: Astronomy.Body.Moon,
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
  mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn: Astronomy.Body.Saturn,
};

/** Positions réelles (astronomy-engine, précision ≈ 1 minute d'arc), 100 % hors-ligne. */
export const astronomyEphemeris: Ephemeris = {
  siderealLongitude(body, at) {
    const v = Astronomy.GeoVector(BODY_MAP[body], at, true); // géocentrique, repère équatorial J2000
    return eqjToSidereal(v.x, v.y, v.z);
  },
};
