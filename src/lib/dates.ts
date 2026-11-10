import { CONFIG } from '../config';

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_DAY = 86_400_000;

/** Date LOCALE de l'appareil (et non UTC : corrige le décalage de minuit au Bénin, UTC+1). */
export function toLocalISODate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const toYearMonth = (iso: string) => iso.slice(0, 7);

export function isValidISODate(iso: string): boolean {
  const m = ISO_RE.exec(iso);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}

/** Instant de référence d'un jour : 12:00 UTC (identique pour tous les fuseaux). */
export function noonUTC(iso: string): Date {
  if (!isValidISODate(iso)) throw new RangeError(`Date invalide : ${iso}`);
  return new Date(`${iso}T12:00:00Z`);
}

export function addDays(iso: string, n: number): string {
  return new Date(noonUTC(iso).getTime() + n * MS_DAY).toISOString().slice(0, 10);
}

export function assertSupported(iso: string): void {
  const y = Number(iso.slice(0, 4));
  if (!isValidISODate(iso) || iso < CONFIG.EPOCH_ISO || y > CONFIG.LAST_YEAR) {
    throw new RangeError(`Date hors plage supportée (${CONFIG.EPOCH_ISO} → ${CONFIG.LAST_YEAR}) : ${iso}`);
  }
}

/** Mois écoulés depuis janvier 2000 (janvier 2000 = 0). */
export function monthIndex(yearMonth: string): number {
  const [y, m] = yearMonth.split('-').map(Number) as [number, number];
  return (y - 2000) * 12 + (m - 1);
}

export function daysInMonth(yearMonth: string): number {
  const [y, m] = yearMonth.split('-').map(Number) as [number, number];
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export function formatDayMonthFr(iso: string): string {
  return noonUTC(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', timeZone: 'UTC' });
}

export function monthNameFr(yearMonth: string): string {
  return noonUTC(`${yearMonth}-15`).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}
