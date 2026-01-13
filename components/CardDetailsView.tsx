
import React, { useState } from 'react';
import { useI18n } from './i18n';
import Navigation from './Navigation';
import { VirtualCard, Transaction, TransactionType, View } from '../types';

interface CardDetailsViewProps {
  card: VirtualCard;
  transactions: Transaction[];
  onBack: () => void;
  onNavigate: (view: View) => void;
}

const CardDetailsView: React.FC<CardDetailsViewProps> = ({ card, transactions, onBack, onNavigate }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isFrozen, setIsFrozen] = useState(card.status === 'FROZEN');
  const { t } = useI18n();

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark animate-in slide-in-from-bottom-4 duration-500">
      <header className="sticky top-0 z-50 bg-background-light dark:bg-background-dark/95 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-gray-200 dark:border-white/5">
        <button 
          onClick={onBack}
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-slate-900 dark:text-white">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] absolute left-1/2 -translate-x-1/2">{t('my_card')}</h1>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto flex flex-col gap-6 p-4 no-scrollbar overflow-y-auto pb-32">
        <div className="relative w-full aspect-[1.586/1] rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e22] to-[#0d1a11]"></div>
          <div className="relative z-10 p-6 flex flex-col justify-between h-full text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-1">{t('virtual_card')}</p>
                <p className="text-3xl font-black tracking-tight">${card.balance.toFixed(2)}</p>
              </div>
              <div className="h-8 w-12 bg-white/10 rounded flex items-center justify-center italic font-black text-lg">
                {card.type}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <p className="font-mono text-xl tracking-widest text-white/90">
                  {showDetails ? card.number.replace(/\d{4}(?=.)/g, '$& ') : '•••• •••• •••• ' + card.number.slice(-4)}
                </p>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">{t('holder')}</span>
                  <span className="text-xs font-bold tracking-wide uppercase">{card.label}</span>
                </div>
                <div className="flex gap-4 text-right">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">{t('expires')}</span>
                    <span className="text-xs font-bold tracking-wide">{card.expiry}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isFrozen && (
            <div className="absolute inset-0 bg-background-dark/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
              <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">ac_unit</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white">{t('card_frozen')}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => setShowDetails(!showDetails)} className="flex flex-col items-center gap-2 p-2 group transition-all">
            <div className="size-12 rounded-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 flex items-center justify-center text-primary shadow-sm group-active:scale-90">
              <span className="material-symbols-outlined">{showDetails ? 'visibility_off' : 'visibility'}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('info')}</span>
          </button>
          <button onClick={() => onNavigate('RECHARGE')} className="flex flex-col items-center gap-2 p-2 group transition-all">
            <div className="size-12 rounded-full bg-primary flex items-center justify-center text-black shadow-lg shadow-primary/20 group-active:scale-90">
              <span className="material-symbols-outlined">add</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('action_recharge')}</span>
          </button>
          <button onClick={() => setIsFrozen(!isFrozen)} className="flex flex-col items-center gap-2 p-2 group transition-all">
            <div className={`size-12 rounded-full border flex items-center justify-center shadow-sm group-active:scale-90 ${isFrozen ? 'bg-primary text-black border-primary' : 'bg-white dark:bg-surface-dark text-primary border-gray-100 dark:border-white/5'}`}>
              <span className="material-symbols-outlined">ac_unit</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{isFrozen ? t('unfreeze') : t('freeze')}</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-2 group transition-all">
            <div className="size-12 rounded-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 flex items-center justify-center text-primary shadow-sm group-active:scale-90">
              <span className="material-symbols-outlined">settings</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('settings')}</span>
          </button>
        </div>
      </main>

      <Navigation currentView="CARD_DETAILS" onNavigate={onNavigate} />
    </div>
  );
};

export default CardDetailsView;
