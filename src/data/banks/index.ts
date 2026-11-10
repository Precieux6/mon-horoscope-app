/// <reference types="vite/client" />
import { buildDailyBank, buildMonthlyBank } from '../../lib/banks';

/**
 * Chaque fichier JSON déposé dans daily/ ou monthly/ est chargé automatiquement (Vite).
 * Ajouter des phrases = éditer ces fichiers, sans toucher au code.
 */
const dailyFiles = import.meta.glob('./daily/h*.json', { eager: true, import: 'default' });
const monthlyFiles = import.meta.glob('./monthly/*.json', { eager: true, import: 'default' });

export const DAILY_BANK = buildDailyBank(dailyFiles);
export const MONTHLY_BANK = buildMonthlyBank(monthlyFiles);
