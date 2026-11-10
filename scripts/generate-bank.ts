/**
 * Rédaction automatique des banques de phrases avec l'API Claude, avec contrôle qualité intégré.
 *
 *   export ANTHROPIC_API_KEY=sk-ant-...            (Windows PowerShell : $env:ANTHROPIC_API_KEY="sk-ant-...")
 *   npx tsx scripts/generate-bank.ts --daily --dry-run     # voir ce qui sera généré, sans rien appeler
 *   npx tsx scripts/generate-bank.ts --daily               # toutes les maisons du quotidien (objectif 72 / 24)
 *   npx tsx scripts/generate-bank.ts --daily --house 3     # une seule maison
 *   npx tsx scripts/generate-bank.ts --monthly --level min # mensuel, taille minimale seulement
 *   npx tsx scripts/generate-bank.ts --monthly --planet venus
 *
 * Le script ne touche qu'aux banques incomplètes, ne supprime jamais une phrase existante,
 * rejette les phrases invalides ou en doublon (dans TOUTES les banques) et peut être relancé sans risque.
 * Relisez toujours un échantillon avant de déployer : `npm run banks:check` puis une lecture humaine.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONFIG, MONTHLY_RECIPES } from '../source/config';
import { HOUSE_THEMES } from '../source/data/zodiac';
import { monthlyMinPool } from '../source/lib/banks';
import type { DailyCategory, PlanetKey } from '../source/types';

const ROOT = join(process.cwd(), 'source', 'data', 'banks');
const args = process.argv.slice(2);
const flag = (n: string) => args.includes(`--${n}`);
const opt = (n: string) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const DRY = flag('dry-run');
const LEVEL = (opt('level') ?? 'target') as 'min' | 'target';
const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-5-5';
const BATCH = 30;
const MAX_ROUNDS = 8;

const CAT_MEANING: Record<DailyCategory, string> = {
  amour: 'la vie affective, le couple, les rencontres, les amitiés et la famille',
  travail: 'la vie professionnelle, les études, les projets et les relations de travail',
  argent: 'les finances personnelles, la gestion, les dépenses, les revenus et la sécurité matérielle',
  sante: "le bien-être physique et mental : énergie, sommeil, alimentation, stress, mouvement, repos (conseils de bon sens, jamais de diagnostic ni de promesse médicale)",
  conseil: 'un conseil bref, concret et bienveillant pour la journée ou le mois',
};
const PLANET_MEANING: Record<PlanetKey, string> = {
  sun: "le Soleil : la vitalité, l'identité, le thème dominant du mois",
  mercury: 'Mercure : la communication, les idées, les déplacements, les contrats et les échanges',
  venus: "Vénus : l'amour, l'harmonie, le plaisir, l'esthétique et l'argent",
  mars: "Mars : l'action, l'énergie, le courage, la motivation et les conflits",
  jupiter: 'Jupiter : la croissance, la chance, la confiance, les opportunités et la générosité',
  saturn: 'Saturne : la discipline, les limites, la responsabilité et la construction à long terme',
};
const SIGNS = 'bélier taureau gémeaux cancer lion vierge balance scorpion sagittaire capricorne verseau poissons'.split(' ');
const BANNED_ALL = ["aujourd'hui", 'cela', 'ceci', 'ensuite', 'enfin', "d'abord", 'par ailleurs', 'en outre', 'précédent', 'comme dit', 'mentionné', ...SIGNS];

// ---- Contrôle qualité d'une phrase (exporté pour les tests)
export function validateSentence(s: string, kind: 'daily' | 'monthly' | 'lunation', seen: Set<string>): string | null {
  const t = s.trim();
  const words = t.split(/\s+/).length;
  if (words < 6 || words > 40) return `longueur (${words} mots)`;
  if (!/[.!»]$/.test(t)) return 'ne finit pas par un point';
  const low = t.toLowerCase();
  for (const b of BANNED_ALL) if (new RegExp(`(^|[^\\p{L}])${b.replace(/'/g, "['’]")}`, 'iu').test(low)) return `mot interdit « ${b} »`;
  if (kind === 'daily' && /ce mois/i.test(t)) return 'référence au mois dans une phrase du jour';
  if (kind === 'lunation' && !t.includes('{date}')) return 'marqueur {date} manquant';
  if (kind !== 'lunation' && t.includes('{')) return 'accolades interdites';
  if (/\d/.test(t)) return 'chiffres interdits';
  if (seen.has(low)) return 'doublon';
  return null;
}

function loadJson(path: string): any { return existsSync(path) ? JSON.parse(readFileSync(path, 'utf-8')) : {}; }
function allExisting(): Set<string> {
  const seen = new Set<string>();
  const walk = (x: unknown) => { if (typeof x === 'string') seen.add(x.toLowerCase()); else if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === 'object') Object.values(x).forEach(walk); };
  for (const dir of ['daily', 'monthly']) for (const f of readdirSync(join(ROOT, dir)).filter((n) => n.endsWith('.json'))) walk(loadJson(join(ROOT, dir, f)));
  return seen;
}

async function callClaude(system: string, user: string): Promise<string> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY ?? '', 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 4096, temperature: 1, system, messages: [{ role: 'user', content: user }] }),
    });
    if (res.status === 429 || res.status >= 500) { await new Promise((r) => setTimeout(r, 2000 * (attempt + 1))); continue; }
    if (!res.ok) throw new Error(`API ${res.status} : ${await res.text()}`);
    const data: any = await res.json();
    return (data.content ?? []).map((c: any) => c.text ?? '').join('');
  }
  throw new Error("API indisponible après plusieurs essais");
}

const SYSTEM = `Tu es un rédacteur francophone d'horoscopes bienveillants et pratiques. Tu écris des phrases AUTONOMES : chaque phrase sera tirée au hasard et assemblée avec d'autres dans un ordre aléatoire, donc elle doit se comprendre seule.
Règles strictes :
- vouvoiement ("vous"), ton chaleureux, concret, nuancé ; jamais de prédiction catastrophiste, de diagnostic médical, de promesse de gain ou d'avenir certain ;
- 8 à 30 mots, une seule phrase, qui finit par un point ;
- aucun connecteur qui dépend d'une autre phrase (ensuite, enfin, d'abord, de plus, par ailleurs, cela, ceci…), aucun nom de signe du zodiaque, aucun chiffre ;
- varie fortement les débuts de phrase (pas plus de 15 % de phrases commençant par le même mot) et les structures (conseil, constat, question rhétorique évitée, image, nuance) ;
- chaque phrase est différente par le sens, pas seulement par les mots.
Réponds UNIQUEMENT par un tableau JSON de chaînes, sans texte autour.`;

interface Pool { label: string; kind: 'daily' | 'monthly' | 'lunation'; get(): string[]; set(v: string[]): void; need: number; brief: string }

function buildPools(): Pool[] {
  const pools: Pool[] = [];
  const tgt = (min: number, target: number) => (LEVEL === 'min' ? min : target);

  if (flag('daily') || !flag('monthly')) {
    for (let h = 1; h <= 12; h++) {
      if (opt('house') && Number(opt('house')) !== h) continue;
      const path = join(ROOT, 'daily', `h${String(h).padStart(2, '0')}.json`);
      for (const cat of ['amour', 'travail', 'argent', 'sante', 'conseil'] as DailyCategory[]) {
        const want = cat === 'conseil' ? tgt(CONFIG.DAILY_CONSEIL_MIN_POOL, CONFIG.DAILY_CONSEIL_TARGET_POOL) : tgt(CONFIG.DAILY_MIN_POOL, CONFIG.DAILY_TARGET_POOL);
        pools.push({
          label: `daily/h${String(h).padStart(2, '0')}/${cat}`, kind: 'daily', need: want,
          get: () => loadJson(path)[cat] ?? [],
          set: (v) => { const d = loadJson(path); d[cat] = v; writeFileSync(path, JSON.stringify(d, null, 2), 'utf-8'); },
          brief: `Horoscope DU JOUR. La Lune traverse la maison ${h} du lecteur, celle de ${HOUSE_THEMES[h - 1]}. Rubrique : ${CAT_MEANING[cat]}. ${cat === 'conseil' ? 'Chaque phrase est un conseil court (8 à 16 mots), à l\'impératif ou à l\'infinitif.' : 'La Lune apporte de la sensibilité, de l\'émotion et des besoins de confort liés à ce thème.'}`,
        });
      }
    }
  }

  if (flag('monthly')) {
    const planets = new Set<PlanetKey>();
    const need = new Map<string, number>();
    for (const cat of Object.keys(MONTHLY_RECIPES) as DailyCategory[]) for (const { planet, n } of MONTHLY_RECIPES[cat]) { planets.add(planet); need.set(`${planet}|${cat}`, n); }
    for (const planet of planets) {
      if (opt('planet') && opt('planet') !== planet) continue;
      const path = join(ROOT, 'monthly', `${planet}.json`);
      for (let h = 1; h <= 12; h++) for (const cat of Object.keys(MONTHLY_RECIPES) as DailyCategory[]) {
        const n = need.get(`${planet}|${cat}`); if (!n) continue;
        const min = monthlyMinPool(n);
        pools.push({
          label: `monthly/${planet}/${h}/${cat}`, kind: 'monthly', need: tgt(min, min * 2),
          get: () => loadJson(path)[String(h)]?.[cat] ?? [],
          set: (v) => { const d = loadJson(path); d[String(h)] = d[String(h)] ?? {}; d[String(h)][cat] = v; writeFileSync(path, JSON.stringify(d, null, 2), 'utf-8'); },
          brief: `Tendance du MOIS. ${PLANET_MEANING[planet]}, traverse la maison ${h} du lecteur, celle de ${HOUSE_THEMES[h - 1]}. Rubrique : ${CAT_MEANING[cat]}. Les phrases décrivent l'effet de cette planète sur ce thème et suggèrent une attitude concrète pour le mois.`,
        });
      }
    }
    if (!opt('planet')) {
      const rp = join(ROOT, 'monthly', 'mercury-retro.json');
      const lp = join(ROOT, 'monthly', 'lunations.json');
      for (let h = 1; h <= 12; h++) {
        pools.push({ label: `monthly/mercury-retro/${h}`, kind: 'monthly', need: tgt(CONFIG.RETRO_MIN_POOL, CONFIG.RETRO_MIN_POOL * 2),
          get: () => loadJson(rp)[String(h)] ?? [], set: (v) => { const d = loadJson(rp); d[String(h)] = v; writeFileSync(rp, JSON.stringify(d, null, 2), 'utf-8'); },
          brief: `Mercure est rétrograde ce mois-ci dans la maison ${h} du lecteur (${HOUSE_THEMES[h - 1]}). Phrases de prudence et de conseils pratiques (relire, vérifier, patienter, reprendre) liés à ce thème.` });
        for (const kind of ['new', 'full'] as const) {
          pools.push({ label: `monthly/lunations/${kind}/${h}`, kind: 'lunation', need: tgt(CONFIG.LUNATION_MIN_POOL, CONFIG.LUNATION_MIN_POOL * 2),
            get: () => loadJson(lp)[kind]?.[String(h)] ?? [],
            set: (v) => { const d = loadJson(lp); d[kind] = d[kind] ?? {}; d[kind][String(h)] = v; writeFileSync(lp, JSON.stringify(d, null, 2), 'utf-8'); },
            brief: `${kind === 'new' ? 'Nouvelle lune' : 'Pleine lune'} du {date}, qui tombe dans la maison ${h} du lecteur (${HOUSE_THEMES[h - 1]}). Chaque phrase DOIT contenir exactement le marqueur {date} et ${kind === 'new' ? 'invite à semer une intention' : 'invite à faire un bilan et à lâcher prise'} sur ce thème.` });
        }
      }
    }
  }
  return pools;
}

async function main() {
  const seen = allExisting();
  const pools = buildPools().filter((p) => p.get().length < p.need);
  const missing = pools.reduce((a, p) => a + (p.need - p.get().length), 0);
  console.log(`${pools.length} banque(s) à compléter, ${missing} phrases à rédiger (modèle ${MODEL}, niveau ${LEVEL}).`);
  if (DRY || pools.length === 0) { pools.slice(0, 8).forEach((p) => console.log(`  - ${p.label} : ${p.get().length}/${p.need}`)); return; }
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('Définissez ANTHROPIC_API_KEY.');

  let done = 0;
  for (const p of pools) {
    const current = p.get();
    const firstWords = new Map<string, number>();
    current.forEach((s) => { const w = s.split(/\s+/)[0]!.toLowerCase(); firstWords.set(w, (firstWords.get(w) ?? 0) + 1); });
    const maxPerOpener = Math.max(3, Math.floor(p.need * 0.2));
    for (let round = 0; round < MAX_ROUNDS && current.length < p.need; round++) {
      const ask = Math.min(BATCH, p.need - current.length + 6);
      const sample = current.slice(-12);
      const user = `${p.brief}\n\nÉcris ${ask} phrases NOUVELLES.${sample.length ? `\nPhrases déjà écrites (ne pas répéter ni paraphraser, varier les débuts) :\n${sample.map((s) => `- ${s}`).join('\n')}` : ''}`;
      let batch: unknown;
      try {
        const text = await callClaude(SYSTEM, user);
        batch = JSON.parse(text.slice(text.indexOf('['), text.lastIndexOf(']') + 1));
      } catch (e) { console.warn(`  ${p.label} : réponse inexploitable (${(e as Error).message}), nouvel essai`); continue; }
      if (!Array.isArray(batch)) continue;
      let accepted = 0;
      for (const raw of batch) {
        if (typeof raw !== 'string' || current.length >= p.need) continue;
        const s = raw.trim();
        const why = validateSentence(s, p.kind, seen);
        if (why) continue;
        const w = s.split(/\s+/)[0]!.toLowerCase();
        if ((firstWords.get(w) ?? 0) >= maxPerOpener) continue;
        firstWords.set(w, (firstWords.get(w) ?? 0) + 1);
        seen.add(s.toLowerCase());
        current.push(s);
        accepted++;
      }
      p.set(current);
      console.log(`  ${p.label} : +${accepted} (${current.length}/${p.need})`);
    }
    if (current.length < p.need) console.warn(`  ⚠ ${p.label} reste incomplète (${current.length}/${p.need}) : relancez le script.`);
    done++;
    console.log(`[${done}/${pools.length}] ${p.label}`);
  }
  console.log('\nTerminé. Lancez maintenant : npm run banks:check');
}

if (process.argv[1] && /generate-bank/.test(process.argv[1])) main().catch((e) => { console.error(e.message); process.exit(1); });
