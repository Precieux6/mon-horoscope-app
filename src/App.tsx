import React, { useMemo, useState } from 'react';
import {
  Sparkles, Heart, Briefcase, Wallet, Activity, Calendar, Search,
  Star, Award, CheckCircle2, Info, TrendingUp, ExternalLink, BookOpen, Clock
} from 'lucide-react';
import CrossAnalysis from './components/CrossAnalysis';
import { ZODIAC_SIGNS } from './data/zodiac';
import { generateAutomatedHoroscope as legacyDaily, generateMonthlyTrends as legacyMonthly } from './legacy/legacyTexts';
import { getDailyReading, getMonthlyReading, getProfile, readiness, toLocalISODate, toYearMonth, type ProfileResult } from './lib/api';
import type { DailyReading, MonthlyReading, ZodiacSign } from './types';

const DeveloperFooter = () => (
  <footer className="mt-8 mb-4 text-center">
    <a
      href="https://precieux6.github.io/mon-portfolio/#contact"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition-colors duration-200 bg-white/60 hover:bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-2xs"
    >
      <span>Développé par Précieux Trésor TOSSOU • Astrologie Sidérale & SaaS</span>
      <ExternalLink size={12} className="opacity-70" />
    </a>
  </footer>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('horoscope');
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>(ZODIAC_SIGNS[0] as ZodiacSign);
  
  const [birthdateInput, setBirthdateInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [searchedProfile, setSearchedProfile] = useState<ProfileResult | null>(null);
  const [profileError, setProfileError] = useState('');

  const todayISO = useMemo(() => toLocalISODate(), []);
  const yearMonthISO = useMemo(() => toYearMonth(todayISO), [todayISO]);
  
  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }, []);

  const monthFormatted = useMemo(() => {
    return new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }, []);

  const currentHoroscope = useMemo(() => {
    // Nouveau moteur dès que toutes les banques de phrases atteignent leur taille minimale
    return (readiness.daily.ready ? getDailyReading(selectedSign.id, todayISO) : legacyDaily(selectedSign.id, todayISO)) as DailyReading;
  }, [selectedSign, todayISO]);

  const currentMonthlyTrends = useMemo(() => {
    return (readiness.monthly.ready ? getMonthlyReading(selectedSign.id, yearMonthISO) : legacyMonthly(selectedSign.id, yearMonthISO)) as MonthlyReading;
  }, [selectedSign, yearMonthISO]);

  const handleProfileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = getProfile(birthdateInput, fullNameInput);
    if (profile) {
      setSearchedProfile(profile);
      setProfileError('');
    } else {
      setProfileError("Vérifiez la date (passée, après 1900) et saisissez votre nom complet (2 lettres minimum).");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-24 sm:pb-12 flex flex-col selection:bg-purple-200 selection:text-purple-900 overflow-x-hidden">
      
      {/* HEADER FIXE */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 flex items-center justify-center text-white shadow-md shadow-purple-200">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-900 bg-clip-text text-transparent tracking-tight">
                  ASTRAEA
                </h1>
                <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full font-bold uppercase">
                  Sidéral SaaS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden md:block">
                Astrologie Sidérale & Numérologie Avancée
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('horoscope')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'horoscope' ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles size={15} className={activeTab === 'horoscope' ? 'text-purple-600' : ''} />
              <span>Horoscope journalier</span>
            </button>

            <button
              onClick={() => setActiveTab('mensuel')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'mensuel' ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp size={15} className={activeTab === 'mensuel' ? 'text-purple-600' : ''} />
              <span>Tendances Mensuelles</span>
            </button>

            <button
              onClick={() => setActiveTab('profiler')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'profiler' ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search size={15} className={activeTab === 'profiler' ? 'text-purple-600' : ''} />
              <span>Mon Profil</span>
            </button>
          </nav>

          <div className="text-right hidden lg:block">
            <p className="text-xs font-bold text-slate-700">{todayFormatted}</p>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
              <CheckCircle2 size={12} /> Éphémérides Actives
            </p>
          </div>

        </div>
      </header>

      {/* CONTENEUR PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-8 flex-1 w-full">

        {/* ONGLET 1 : HOROSCOPE DU JOUR */}
        {activeTab === 'horoscope' && (
          <div className="space-y-4 sm:space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-3xl mx-auto space-y-1 sm:space-y-2">
              <h2 className="text-xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Mon horoscope au quotidien avec Maître Folly Valère TOSSOU
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
                Prévisions sidérales pour le {todayFormatted}.
              </p>
              {currentHoroscope.headline && (
                <p className="text-xs sm:text-sm text-purple-800 font-medium mt-1">{currentHoroscope.headline}</p>
              )}
            </div>

            <div className="bg-white p-3 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Choisissez votre signe sidéral :
                </p>
                <span className="text-xs text-purple-700 font-semibold">
                  Actif : <strong className="text-slate-900">{selectedSign.name}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {ZODIAC_SIGNS.map((sign) => {
                  const isSelected = selectedSign.id === sign.id;
                  return (
                    <button
                      key={sign.id}
                      onClick={() => setSelectedSign(sign)}
                      className={`flex items-center gap-2.5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl transition duration-200 border text-left group ${
                        isSelected
                          ? 'bg-purple-50 border-purple-500 text-purple-900 shadow-xs ring-2 ring-purple-500/20'
                          : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl shrink-0">{sign.symbol}</span>
                      <div className="overflow-hidden min-w-0">
                        <p className="text-xs font-bold truncate">{sign.name}</p>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">Sidéral • {sign.element}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md border border-slate-200 overflow-hidden space-y-4 sm:space-y-6">
              
              <div className={`bg-gradient-to-r ${selectedSign.color} text-white p-4 sm:p-8 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left`}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center text-4xl sm:text-5xl border border-white/20 shadow-inner shrink-0">
                  {selectedSign.symbol}
                </div>
                <div>
                  <span className="text-[10px] uppercase bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Constellation Sidérale</span>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">{selectedSign.name}</h3>
                  <p className="text-white/90 text-xs sm:text-sm mt-0.5 font-medium">{selectedSign.dates} • Élément {selectedSign.element}</p>
                  <p className="text-xs text-white/80 mt-0.5">Régent : <strong className="text-white">{selectedSign.planet}</strong></p>
                </div>
              </div>

              <div className="p-4 sm:p-8 space-y-4 sm:space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  
                  <div className="bg-rose-50/40 border border-rose-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-rose-100 text-rose-700 rounded-xl"><Heart size={18} /></div>
                        <h4 className="text-sm sm:text-base font-bold text-rose-950">Amour & relations</h4>
                      </div>
                      <span className="text-xs font-extrabold bg-rose-100 text-rose-900 px-2.5 py-0.5 rounded-full">{currentHoroscope.amour.score}%</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{currentHoroscope.amour.text}</p>
                  </div>

                  <div className="bg-sky-50/40 border border-sky-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-sky-100 text-sky-700 rounded-xl"><Briefcase size={18} /></div>
                        <h4 className="text-sm sm:text-base font-bold text-sky-950">Travail & carrière</h4>
                      </div>
                      <span className="text-xs font-extrabold bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-full">{currentHoroscope.travail.score}%</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{currentHoroscope.travail.text}</p>
                  </div>

                  <div className="bg-emerald-50/40 border border-emerald-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl"><Wallet size={18} /></div>
                        <h4 className="text-sm sm:text-base font-bold text-emerald-950">Argent & finances</h4>
                      </div>
                      <span className="text-xs font-extrabold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">{currentHoroscope.argent.score}%</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{currentHoroscope.argent.text}</p>
                  </div>

                  <div className="bg-amber-50/40 border border-amber-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-amber-100 text-amber-800 rounded-xl"><Activity size={18} /></div>
                        <h4 className="text-sm sm:text-base font-bold text-amber-950">Santé & vitalité</h4>
                      </div>
                      <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">{currentHoroscope.sante.score}%</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{currentHoroscope.sante.text}</p>
                  </div>

                </div>

                <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-lg shrink-0">💡</div>
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase tracking-widest block">Conseil Céleste Sidéral</span>
                      <p className="text-xs sm:text-base italic text-purple-100 mt-0.5">"{currentHoroscope.conseil}"</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            <DeveloperFooter />

          </div>
        )}

        {/* ONGLET 2 : TENDANCES MENSUELLES (Même disposition rigoureuse que le journalier) */}
        {activeTab === 'mensuel' && (
          <div className="space-y-4 sm:space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-3xl mx-auto space-y-1 sm:space-y-2">
              <h2 className="text-xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Tendances mensuelles avec Maître Folly Valère TOSSOU
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
                Bilan global et approfondi pour le mois de <strong className="text-purple-800 capitalize">{monthFormatted}</strong>.
              </p>
              {currentMonthlyTrends.headline && (
                <p className="text-xs sm:text-sm text-purple-800 font-medium mt-1">{currentMonthlyTrends.headline}</p>
              )}
            </div>

            <div className="bg-white p-3 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Choisissez votre signe :
                </p>
                <span className="text-xs text-purple-700 font-semibold">
                  Actif : <strong className="text-slate-900">{selectedSign.name}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {ZODIAC_SIGNS.map((sign) => {
                  const isSelected = selectedSign.id === sign.id;
                  return (
                    <button
                      key={sign.id}
                      onClick={() => setSelectedSign(sign)}
                      className={`flex items-center gap-2.5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl transition duration-200 border text-left group ${
                        isSelected
                          ? 'bg-purple-50 border-purple-500 text-purple-900 shadow-xs ring-2 ring-purple-500/20'
                          : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl shrink-0">{sign.symbol}</span>
                      <div className="overflow-hidden min-w-0">
                        <p className="text-xs font-bold truncate">{sign.name}</p>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">{sign.element}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md border border-slate-200 overflow-hidden space-y-4 sm:space-y-6">
              
              <div className={`bg-gradient-to-r ${selectedSign.color} text-white p-4 sm:p-8 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left`}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center text-4xl sm:text-5xl border border-white/20 shadow-inner shrink-0">
                  {selectedSign.symbol}
                </div>
                <div>
                  <span className="text-[10px] uppercase bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Grand Bilan de {monthFormatted}</span>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">{selectedSign.name} Sidéral</h3>
                  <p className="text-white/90 text-xs sm:text-sm mt-0.5 font-medium">{selectedSign.dates} • Élément {selectedSign.element}</p>
                </div>
              </div>

              <div className="p-4 sm:p-8 space-y-4 sm:space-y-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  
                  <div className="bg-rose-50/40 border border-rose-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-rose-100 text-rose-700 rounded-xl"><Heart size={18} /></div>
                        <h4 className="text-sm sm:text-base font-bold text-rose-950">Amour & relations</h4>
                      </div>
                      <span className="text-xs font-extrabold bg-rose-100 text-rose-900 px-2.5 py-0.5 rounded-full">{currentMonthlyTrends.amour.score}%</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">{currentMonthlyTrends.amour.text}</p>
                  </div>

                  <div className="bg-sky-50/40 border border-sky-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-sky-100 text-sky-700 rounded-xl"><Briefcase size={18} /></div>
                        <h4 className="text-sm sm:text-base font-bold text-sky-950">Travail & carrière</h4>
                      </div>
                      <span className="text-xs font-extrabold bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-full">{currentMonthlyTrends.travail.score}%</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">{currentMonthlyTrends.travail.text}</p>
                  </div>

                  <div className="bg-emerald-50/40 border border-emerald-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl"><Wallet size={18} /></div>
                        <h4 className="text-sm sm:text-base font-bold text-emerald-950">Argent & finances</h4>
                      </div>
                      <span className="text-xs font-extrabold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">{currentMonthlyTrends.argent.score}%</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">{currentMonthlyTrends.argent.text}</p>
                  </div>

                  <div className="bg-amber-50/40 border border-amber-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-amber-100 text-amber-800 rounded-xl"><Activity size={18} /></div>
                        <h4 className="text-sm sm:text-base font-bold text-amber-950">Santé & vitalité</h4>
                      </div>
                      <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">{currentMonthlyTrends.sante.score}%</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">{currentMonthlyTrends.sante.text}</p>
                  </div>

                </div>

                <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-lg shrink-0">💡</div>
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase tracking-widest block">Conseil Mensuel Sidéral</span>
                      <p className="text-xs sm:text-base italic text-purple-100 mt-0.5">"{currentMonthlyTrends.conseil}"</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            <DeveloperFooter />

          </div>
        )}

        {/* ONGLET 3 : PROFILER ASTROLOGIQUE & NUMÉROLOGIQUE */}
        {activeTab === 'profiler' && (
          <div className="space-y-4 sm:space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-3xl mx-auto space-y-1 sm:space-y-2">
              <h2 className="text-xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Profilage astrologique & numérologique
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
                Découvrez votre signe astronomique réel combiné à votre numérologie complète.
              </p>
            </div>

            <div className="max-w-xl mx-auto bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200">
              <form onSubmit={handleProfileSearch} className="space-y-3">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">
                    Nom et Prénoms (pour la numérologie) :
                  </label>
                  <input
                    type="text"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    required
                    placeholder="Ex : Aïcha Dossou Koffi"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-300 focus:ring-2 focus:ring-purple-600 text-xs sm:text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">
                    Date de naissance :
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="relative flex-1">
                      <input
                        type="date"
                        required
                        min="1900-01-01"
                        max={todayISO}
                        value={birthdateInput}
                        onChange={(e) => setBirthdateInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-300 focus:ring-2 focus:ring-purple-600 text-xs sm:text-sm outline-none"
                      />
                      <Calendar className="absolute left-3.5 top-3 text-slate-400" size={16} />
                    </div>
                    <button type="submit" className="bg-purple-800 hover:bg-purple-900 text-white font-bold px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition flex items-center justify-center gap-2 text-xs sm:text-sm">
                      <Search size={16} /> Calculer
                    </button>
                  </div>
                </div>
              </form>
              {profileError && (
                <p role="alert" className="mt-3 text-xs sm:text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">{profileError}</p>
              )}
            </div>

            {searchedProfile && (
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md border border-slate-200 p-4 sm:p-8 space-y-6 sm:space-y-8 animate-fadeIn">
                
                {/* EN-TÊTE DU PROFIL */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 bg-purple-50 rounded-2xl sm:rounded-3xl border border-purple-100 text-center sm:text-left">
                  <div className="flex items-center gap-4 flex-col sm:flex-row">
                    <span className="text-5xl sm:text-6xl">{searchedProfile.sign.symbol}</span>
                    <div>
                      <span className="text-[10px] sm:text-xs font-extrabold text-purple-700 uppercase">
                        Signe astrologique déterminé • Année {searchedProfile.birthYear}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{searchedProfile.sign.name} Sidéral</h3>
                      <p className="text-xs text-slate-500">{searchedProfile.sign.dates} • Élément {searchedProfile.sign.element}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3.5 rounded-2xl border border-purple-200 text-xs text-purple-900 max-w-xs shadow-2xs text-left">
                    <strong className="block text-purple-950 font-bold mb-1">🔑 Transit :</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{searchedProfile.dominantPlanet}</p>
                  </div>
                </div>

                {/* SECTION NUMÉROLOGIE */}
                <div className="space-y-4">
                  <h4 className="text-slate-900 font-extrabold text-base sm:text-lg flex items-center gap-2 border-b pb-2">
                    <BookOpen className="text-purple-700" size={20} /> ANALYSE NUMÉROLOGIQUE COMPLÈTE
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="bg-indigo-50/40 border border-indigo-100 p-4 sm:p-5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-900 uppercase">Chemin de Vie</span>
                        <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
                          {searchedProfile.numerology.lifePath}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                        {searchedProfile.numerology.lifePathText}
                      </p>
                    </div>

                    <div className="bg-purple-50/40 border border-purple-100 p-4 sm:p-5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-900 uppercase">Nombre d'Expression</span>
                        <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center">
                          {searchedProfile.numerology.expression}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                        {searchedProfile.numerology.expressionText}
                      </p>
                    </div>

                    <div className="bg-rose-50/40 border border-rose-100 p-4 sm:p-5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-900 uppercase">Élan Spirituel (Âme)</span>
                        <span className="w-7 h-7 rounded-full bg-rose-600 text-white font-extrabold text-xs flex items-center justify-center">
                          {searchedProfile.numerology.soul}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                        {searchedProfile.numerology.soulText}
                      </p>
                    </div>

                    <div className="bg-emerald-50/40 border border-emerald-100 p-4 sm:p-5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900 uppercase">Nombre Intime</span>
                        <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">
                          {searchedProfile.numerology.intimate}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                        {searchedProfile.numerology.intimateText}
                      </p>
                    </div>

                    <div className="bg-amber-50/40 border border-amber-100 p-4 sm:p-5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 uppercase">Année Personnelle ({new Date().getFullYear()}) · {searchedProfile.numerology.personalYearLabel}</span>
                        <span className="w-7 h-7 rounded-full bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center">
                          {searchedProfile.numerology.personalYear}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                        {searchedProfile.numerology.personalYearText}
                      </p>
                    </div>

                    <div className="bg-sky-50/40 border border-sky-100 p-4 sm:p-5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-900 uppercase">Inclusion & Maturité</span>
                        <Clock size={16} className="text-sky-700" />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                        {searchedProfile.numerology.inclusionText} {searchedProfile.numerology.maturityText}
                      </p>
                    </div>

                  </div>
                </div>

                {/* QUALITÉS & DÉFAUTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
                    <h4 className="text-emerald-950 font-bold text-sm sm:text-base flex items-center gap-2">
                      <Award className="text-emerald-600" size={18} /> TOP 10 QUALITÉS
                    </h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {searchedProfile.qualities.map((item, idx) => (
                        <span key={idx} className="bg-white border border-emerald-200 text-emerald-900 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-lg">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50/50 border border-amber-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
                    <h4 className="text-amber-950 font-bold text-sm sm:text-base flex items-center gap-2">
                      <Info className="text-amber-600" size={18} /> TOP 10 DÉFAUTS
                    </h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {searchedProfile.flaws.map((item, idx) => (
                        <span key={idx} className="bg-white border border-amber-200 text-amber-900 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-lg">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SYNTHÈSE GLOBALE */}
                <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl space-y-3">
                  <h4 className="text-amber-300 font-black text-base sm:text-lg uppercase tracking-wider flex items-center gap-2">
                    <Star size={20} className="text-amber-400 fill-amber-400" /> Synthèse astrologique & numérologique
                  </h4>
                  <p className="text-purple-100 text-xs sm:text-sm leading-relaxed text-justify font-medium">
                    {searchedProfile.numerology.summaryText}
                  </p>
                </div>

                {/* DOMAINES D'EXCELLENCE */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
                  <h4 className="text-slate-900 font-bold text-sm sm:text-base flex items-center gap-2">
                    <Star size={18} className="text-amber-500 fill-amber-500" /> Domaines d'excellence
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {searchedProfile.excellenceDomains.map((domain, idx) => (
                      <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 text-center font-bold text-[11px] sm:text-xs text-slate-800">
                        {domain}
                      </div>
                    ))}
                  </div>
                </div>

                <CrossAnalysis profile={searchedProfile} />

              </div>
            )}

            <DeveloperFooter />

          </div>
        )}

      </main>

      {/* BARRE DE NAVIGATION BOTTOM MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 md:hidden px-3 py-2 shadow-lg">
        <div className="grid grid-cols-3 gap-1 max-w-md mx-auto">
          
          <button
            onClick={() => setActiveTab('horoscope')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition ${
              activeTab === 'horoscope' ? 'text-purple-800 bg-purple-50' : 'text-slate-500'
            }`}
          >
            <Sparkles size={18} className="mb-0.5" />
            <span>Horoscope</span>
          </button>

          <button
            onClick={() => setActiveTab('mensuel')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition ${
              activeTab === 'mensuel' ? 'text-purple-800 bg-purple-50' : 'text-slate-500'
            }`}
          >
            <TrendingUp size={18} className="mb-0.5" />
            <span>Tendances</span>
          </button>

          <button
            onClick={() => setActiveTab('profiler')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition ${
              activeTab === 'profiler' ? 'text-purple-800 bg-purple-50' : 'text-slate-500'
            }`}
          >
            <Search size={18} className="mb-0.5" />
            <span>Mon Profil</span>
          </button>

        </div>
      </div>

    </div>
  );
}

