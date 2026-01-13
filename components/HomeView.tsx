
import React from 'react';
import { useI18n } from './i18n';

interface HomeViewProps {
  onStart: () => void;
  onLogin: () => void;
  // Nom affiché si l'utilisateur est déjà authentifié (Google/Apple iCloud)
  currentUserName?: string;
}

const HomeView: React.FC<HomeViewProps> = ({ onStart, onLogin, currentUserName }) => {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="flex-1 flex flex-col animate-in fade-in duration-700">
      {/* Header / Nav */}
      <div className="flex items-center justify-between px-6 py-5 z-20">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Feza Pay</span>
        </div>
        {/* Language Toggle */}
        <div className="flex items-center gap-1 rounded-full bg-slate-200 dark:bg-surface-dark px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-gray-300">
          <button
            aria-label="Français"
            onClick={() => setLang('fr')}
            className={(lang === 'fr' ? 'text-primary' : 'opacity-70 hover:opacity-100') + ' transition'}
          >
            FR
          </button>
          <span className="opacity-30">|</span>
          <button
            aria-label="English"
            onClick={() => setLang('en')}
            className={(lang === 'en' ? 'text-primary' : 'opacity-70 hover:opacity-100') + ' transition'}
          >
            EN
          </button>
        </div>
      </div>

      {/* Main Content Scroll Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-6 relative z-10">
        {/* Hero Illustration */}
        <div className="w-full relative mb-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 blur-[60px] rounded-full -z-10"></div>
          <div className="w-full aspect-square max-h-[340px] rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10 bg-surface-dark relative flex items-center justify-center">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjz1nsiZfN3psHdSzg4WYg_X7SlUv6x20TIO1O1Dga0DDEdb2kvvdb5DgER8I8mA7eCaRHwftFmBySKJYo90rronZmNOsoVgYXzhztoocTIi5MCdikOMCjXShQTofjdNRCPMJaTVYGb5Drni4l6vDxvsyVxnQgTm1ypq6-M36fPKdnSTs4mhHsSZ033_uh_mXzVgtcJ8-t3lP9eOkCbTYb1uMSPArI-Fwe80LIcJcyLF2BWTTFSc3igsWnEf-O6JL-kuZbkq9t6_E')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80"></div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-[320px]">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
            {t('home_title_prefix')} <span className="text-primary">{t('home_title_highlight')}</span>
          </h1>
          <p className="text-slate-600 dark:text-gray-400 text-base font-medium leading-relaxed">
            {t('home_subtitle')}
          </p>
          {currentUserName && (
            <div className="mt-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
              Bonjour, {currentUserName}
            </div>
          )}
        </div>

        {/* Indicators */}
        <div className="flex w-full flex-row items-center justify-center gap-2 py-8">
          <div className="h-1.5 w-6 rounded-full bg-primary shadow-[0_0_10px_rgba(19,236,91,0.5)]"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-surface-dark"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-surface-dark"></div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="w-full px-6 pb-8 pt-2 bg-gradient-to-t from-background-dark to-transparent">
        <div className="flex flex-col gap-3 w-full max-w-[480px] mx-auto">
          <button
            onClick={onStart}
            className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary hover:bg-[#0fd650] text-background-dark text-base font-bold leading-normal tracking-[0.015em] transition-all transform active:scale-[0.98] shadow-lg shadow-primary/25"
          >
            <span className="mr-2">{t('cta_signup')}</span>
            <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
          <button
            onClick={onLogin}
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-transparent border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-[0.98]"
          >
            <span>{t('cta_login')}</span>
          </button>
        </div>

        {/* Trust Signals */}
        <div className="mt-8">
          <p className="text-center text-[10px] uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-3 font-bold">{t('compatible_with')}</p>
          <div className="flex justify-center items-center gap-6 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-red-600"></span>
              <span className="text-xs font-bold font-sans">M-Pesa</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              <span className="text-xs font-bold font-sans">Airtel</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-orange-500"></span>
              <span className="text-xs font-bold font-sans">Orange</span>
            </div>
            <div className="flex items-center gap-1 border-l border-white/10 pl-4">
              <span className="text-sm font-bold font-serif italic text-blue-400">VISA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
