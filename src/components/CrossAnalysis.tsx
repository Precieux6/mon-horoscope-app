import React from 'react';
import { CalendarCheck, Calculator, ListChecks, Scale, Target } from 'lucide-react';
import type { ProfileResult } from '../lib/profile';

const BAR_COLORS = ['bg-purple-600', 'bg-indigo-500', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500'];

/** « Méthode des Trois Clés » : ciel sidéral + nombres pythagoriciens + nombre cabalistique du nom. */
export default function CrossAnalysis({ profile }: { profile: ProfileResult }) {
  const { analysis: a, cabal } = profile;
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white border border-purple-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 shadow-xs">
        <h4 className="text-purple-900 font-black text-base sm:text-lg uppercase tracking-wider flex items-center gap-2">
          <Scale size={20} className="text-purple-700" /> Analyse croisée des trois clés
        </h4>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Votre ciel de naissance sidéral, vos nombres pythagoriciens et le nombre cabalistique de votre nom sont calculés séparément, puis comparés sur cinq axes de vie.
        </p>

        <div className="space-y-2.5">
          {a.axes.map((ax, i) => (
            <div key={ax.axis}>
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                <span>{ax.label}</span>
                <span className="text-slate-500">{ax.score}/100</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden" role="img" aria-label={`${ax.label} : ${ax.score} sur 100`}>
                <div className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`} style={{ width: `${ax.score}%` }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Ciel {ax.bySystem.astro}% · Nombres {ax.bySystem.pyth}% · Nom {ax.bySystem.cabal}%</p>
            </div>
          ))}
        </div>

        {a.convergences.length > 0 && (
          <ul className="space-y-1.5">
            {a.convergences.map((c) => (
              <li key={c.axis} className={`text-xs sm:text-sm leading-relaxed rounded-xl px-3 py-2 ${c.level === 'forte' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-sky-50 text-sky-900 border border-sky-200'}`}>
                {c.text}
              </li>
            ))}
          </ul>
        )}
        {a.tensions.map((t, i) => (
          <p key={i} className="text-xs sm:text-sm leading-relaxed rounded-xl px-3 py-2 bg-amber-50 text-amber-900 border border-amber-200">{t}</p>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3">
        <h4 className="text-amber-300 font-black text-sm sm:text-base uppercase tracking-wider">Signature cabalistique de votre nom</h4>
        <p className="text-purple-100 text-xs sm:text-sm leading-relaxed font-medium">{cabal.keyPhrase}</p>
        <ul className="space-y-1.5 text-xs sm:text-sm text-purple-100 leading-relaxed">
          {cabal.parts.map((p) => (
            <li key={p.n}>
              <span className="font-bold text-amber-200">{p.n}</span>
              {p.display ? <span className="text-purple-300"> · {p.display}</span> : null}
              {' — '}{p.modern}
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-purple-300">Total du nom : {cabal.total}{cabal.droppedThousands ? ` (milliers retirés → ${cabal.retained})` : ''} · Sephira : {cabal.sephira.name}</p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
        <h4 className="text-slate-900 font-bold text-sm sm:text-base">Votre portrait</h4>
        {a.portrait.map((p, i) => (<p key={i} className="text-xs sm:text-sm text-slate-700 leading-relaxed">{p}</p>))}
        {a.pitfalls.map((p, i) => (<p key={i} className="text-xs sm:text-sm text-rose-800 leading-relaxed">{p}</p>))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
        <h4 className="text-slate-900 font-bold text-sm sm:text-base flex items-center gap-2">
          <CalendarCheck size={18} className="text-purple-700" /> Plan d'action de 30 jours
        </h4>
        {a.plan.map((w) => (
          <div key={w.week} className="border-l-4 border-purple-300 pl-3">
            <p className="text-xs sm:text-sm font-bold text-purple-900">{w.title}</p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{w.text}</p>
          </div>
        ))}
        <h5 className="text-slate-900 font-bold text-xs sm:text-sm flex items-center gap-2 pt-1">
          <ListChecks size={16} className="text-emerald-600" /> Trois habitudes quotidiennes
        </h5>
        <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {a.daily.map((d, i) => (<li key={i}>{d}</li>))}
        </ul>
      </div>

      <details className="bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5">
        <summary className="cursor-pointer text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
          <Calculator size={16} className="text-slate-600" /> Fiche de calcul (transparence)
        </summary>
        <ul className="mt-3 space-y-1 text-[11px] sm:text-xs text-slate-600 leading-relaxed font-mono">
          {a.sheet.map((l, i) => (<li key={i}>{l}</li>))}
        </ul>
        <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
          Fiabilité : Soleil {a.confidence.sun} · Lune {a.confidence.moon}.
          {' '}<Target size={11} className="inline -mt-0.5" /> {profile.astro.note}
        </p>
      </details>
    </div>
  );
}
