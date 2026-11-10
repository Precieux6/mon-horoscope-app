import { hashString, mulberry32, shuffleInPlace } from './rng';

/**
 * « Paquet » de phrases sans mémoire :
 * l'arrière-plan est une suite infinie de paquets mélangés (graine = clé + numéro de paquet).
 * Dans un paquet, aucune phrase ne se répète. À la jonction de deux paquets, les W premières
 * phrases du nouveau paquet sont réparées pour ne pas répéter les W dernières du précédent.
 *
 * Garantie : deux emplacements distants de moins de (W+1) positions ne portent jamais la même phrase,
 * à condition que la banque contienne au moins 2×W phrases.
 */
const cache = new Map<string, Uint16Array[]>();

function buildDeck(P: number, rnd: () => number, prevTail: Set<number> | null, W: number): Uint16Array {
  const deck = new Uint16Array(P);
  for (let i = 0; i < P; i++) deck[i] = i;
  shuffleInPlace(deck, rnd);
  if (prevTail) {
    for (let i = 0; i < W; i++) {
      if (!prevTail.has(deck[i] as number)) continue;
      let j = W;
      while (j < P && prevTail.has(deck[j] as number)) j++;
      if (j >= P) break; // banque trop petite : dégradé
      const tmp = deck[i] as number;
      deck[i] = deck[j] as number;
      deck[j] = tmp;
    }
  }
  return deck;
}

function getDeck(key: string, P: number, W: number, k: number): Uint16Array {
  const ck = `${key}#${P}#${W}`;
  let decks = cache.get(ck);
  if (!decks) { decks = []; cache.set(ck, decks); }
  while (decks.length <= k) {
    const idx = decks.length;
    const rnd = mulberry32(hashString(`${ck}#${idx}`));
    const prev = idx > 0 ? new Set(Array.from((decks[idx - 1] as Uint16Array).slice(P - W))) : null;
    decks.push(buildDeck(P, rnd, prev, W));
  }
  return decks[k] as Uint16Array;
}

export function clearDeckCache(): void { cache.clear(); }

/**
 * Largeur de protection : `span` visites consécutives (3 pour la Lune qui reste jusqu'à 3 jours dans un signe, 2 pour les mois)
 * ne partagent aucune phrase. Il faut une banque d'au moins 2 × cette largeur.
 */
export const guardWidth = (slots: number, span = 2) => span * slots - 1;

export interface SelectResult { sentences: string[]; degraded: boolean }

/**
 * @param pool     banque de phrases
 * @param key      identifiant stable du flux (ex. "belier|5|amour")
 * @param ordinal  numéro de la « visite » (jour ou mois) : le curseur avance de `slots` à chaque visite
 * @param count    phrases à afficher (≤ slots)
 * @param span     nombre de visites consécutives à garder sans aucune phrase commune
 */
export function selectSentences(pool: readonly string[], key: string, ordinal: number, count: number, slots: number, span = 2): SelectResult {
  const P = pool.length;
  if (P === 0) return { sentences: [], degraded: true };
  const W = guardWidth(slots, span);
  const degraded = P < 2 * W;
  const effW = Math.max(1, Math.min(W, Math.floor(P / 2)));
  const n = Math.min(count, P);
  const start = ordinal * slots;
  const out: string[] = [];
  for (let j = 0; j < n; j++) {
    const p = start + j;
    const deck = getDeck(key, P, effW, Math.floor(p / P));
    out.push(pool[deck[p % P] as number] as string);
  }
  return { sentences: out, degraded: degraded || n < count };
}
