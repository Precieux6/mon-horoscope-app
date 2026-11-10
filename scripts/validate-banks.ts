/**
 * Contrôle qualité des banques de phrases.
 *   npx tsx scripts/validate-banks.ts            -> rapport
 *   npx tsx scripts/validate-banks.ts --strict   -> code de sortie 1 si une banque est sous le minimum ou invalide
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildDailyBank, buildMonthlyBank, dailyReadiness, monthlyReadiness } from '../source/lib/banks';

const ROOT = join(process.cwd(), 'source', 'data', 'banks');
const strict = process.argv.includes('--strict');

function load(dir: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of readdirSync(join(ROOT, dir)).filter((x) => x.endsWith('.json'))) {
    out[`${dir}/${f}`] = JSON.parse(readFileSync(join(ROOT, dir, f), 'utf-8'));
  }
  return out;
}

const daily = buildDailyBank(load('daily'));
const monthly = buildMonthlyBank(load('monthly'));
const errors: string[] = [];
const warnings: string[] = [];

// 1) Doublons exacts : dans une banque (erreur) et ENTRE maisons (erreur : casse la garantie « 12 signes, aucune phrase commune »)
const owner = new Map<string, string>();
const check = (pool: string[] | undefined, where: string, scope: string) => {
  const seenHere = new Set<string>();
  for (const s of pool ?? []) {
    const k = s.toLowerCase();
    if (seenHere.has(k)) errors.push(`Doublon dans ${where} : « ${s} »`);
    seenHere.add(k);
    const key = `${scope}::${k}`;
    const prev = owner.get(key);
    if (prev && prev !== where) errors.push(`Phrase partagée entre ${prev} et ${where} : « ${s} »`);
    owner.set(key, where);
    const words = s.trim().split(/\s+/).length;
    if (words < 5 || words > 45) warnings.push(`Longueur inhabituelle (${words} mots) dans ${where} : « ${s.slice(0, 60)}… »`);
  }
  // 2) Variété des débuts de phrase
  const firsts = new Map<string, number>();
  for (const s of pool ?? []) { const w = s.trim().split(/\s+/)[0]!.toLowerCase(); firsts.set(w, (firsts.get(w) ?? 0) + 1); }
  for (const [w, n] of firsts) if ((pool?.length ?? 0) >= 20 && n / pool!.length > 0.2) warnings.push(`${where} : ${Math.round((n / pool!.length) * 100)} % des phrases commencent par « ${w} »`);
};

for (const [h, cats] of Object.entries(daily)) for (const [c, pool] of Object.entries(cats ?? {})) check(pool, `daily/h${String(h).padStart(2, '0')}/${c}`, 'daily');
for (const [p, byHouse] of Object.entries(monthly.planets)) for (const [h, cats] of Object.entries(byHouse ?? {})) for (const [c, pool] of Object.entries(cats ?? {})) check(pool, `monthly/${p}/${h}/${c}`, `monthly-${p}`);
for (const [kind, byHouse] of Object.entries(monthly.lunation)) for (const [h, pool] of Object.entries(byHouse)) {
  check(pool, `monthly/lunations/${kind}/${h}`, 'lunation');
  for (const s of pool) if (!s.includes('{date}')) errors.push(`monthly/lunations/${kind}/${h} : « ${s.slice(0, 50)}… » doit contenir {date}`);
}

const d = dailyReadiness(daily);
const m = monthlyReadiness(monthly);
const show = (title: string, r: ReturnType<typeof dailyReadiness>) => {
  console.log(`\n${title} : ${r.ready ? 'PRÊT ✔' : 'INCOMPLET ✘'} — ${r.totalSentences} phrases dans ${r.totalPools} banques ; il en manque ${r.missingSentences} pour atteindre l'objectif`);
  for (const s of r.shortfalls.slice(0, 15)) console.log(`   ${s.pool}: ${s.size}/${s.min} (objectif ${s.target})`);
  if (r.shortfalls.length > 15) console.log(`   … et ${r.shortfalls.length - 15} autres banques sous le minimum`);
};
show('Horoscope du jour', d);
show('Tendances mensuelles', m);
if (warnings.length) console.log(`\n${warnings.length} avertissement(s) :\n - ${warnings.slice(0, 20).join('\n - ')}`);
if (errors.length) console.log(`\n${errors.length} ERREUR(S) :\n - ${errors.slice(0, 30).join('\n - ')}`);
if (strict && (errors.length || !d.ready || !m.ready)) process.exit(1);
