import { DAILY_BANK, MONTHLY_BANK } from '../data/banks';
import { astronomyEphemeris } from './astronomyEphemeris';
import { dailyReadiness, monthlyReadiness } from './banks';
import { setEphemeris } from './ephemeris';
import { generateDailyReading } from './horoscope';
import { generateMonthlyReading } from './monthly';
import { buildProfile } from './profile';

setEphemeris(astronomyEphemeris);

export { toLocalISODate, toYearMonth } from './dates';
export type { ProfileResult } from './profile';

/** Le nouveau moteur n'est activé que lorsque TOUTES les banques atteignent leur taille minimale. */
export const readiness = {
  daily: dailyReadiness(DAILY_BANK),
  monthly: monthlyReadiness(MONTHLY_BANK),
};

export const getDailyReading = (signId: string, iso: string) => generateDailyReading(signId, iso, DAILY_BANK);
export const getMonthlyReading = (signId: string, yearMonth: string) => generateMonthlyReading(signId, yearMonth, MONTHLY_BANK);
export const getProfile = (dateISO: string, fullName: string) => buildProfile(dateISO, fullName);
