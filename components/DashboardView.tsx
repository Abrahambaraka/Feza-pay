
import React from 'react';
import { useI18n } from './i18n';
import Navigation from './Navigation';
import VirtualCardUI from './VirtualCardUI';
import { Transaction, VirtualCard, TransactionType, View } from '../types';

interface DashboardViewProps {
  userBalance: number;
  transactions: Transaction[];
  cards: VirtualCard[];
  onNavigate: (view: View) => void;
  // Nom affiché (Google/Apple iCloud) pour l’en-tête
  currentUserName?: string;
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  userBalance, 
  transactions, 
  cards, 
  onNavigate,
  currentUserName,
}) => {
  const { t } = useI18n();
  return (
    <div className="flex-1 flex flex-col pb-24 overflow-y-auto no-scrollbar animate-in fade-in duration-500">
      {/* Header Statique */}
      <div className="flex items-center justify-between px-6 py-5 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-lg z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('PROFILE')} className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-emerald-600 p-[2px] active:scale-90 transition-transform">
            <div className="w-full h-full rounded-full bg-background-dark flex items-center justify-center overflow-hidden">
              <span className="material-symbols-outlined text-primary text-xl">person</span>
            </div>
          </button>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">{t('greeting_hello')}</p>
            <p className="text-sm font-bold">{currentUserName || 'Utilisateur'}</p>
          </div>
        </div>
        <button className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-surface-dark flex items-center justify-center text-gray-500 relative">
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-surface-dark"></span>
        </button>
      </div>

      <div className="px-6 space-y-8">
        {/* Solde Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-emerald-500/20 rounded-3xl blur opacity-25"></div>
          <div className="relative bg-white dark:bg-surface-dark rounded-3xl p-7 border border-gray-100 dark:border-white/5 shadow-sm">
            <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">{t('balance_available')}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-primary text-2xl font-black">$</span>
              <span className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                {userBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="mt-8 flex gap-3">
              <button onClick={() => onNavigate('RECHARGE')} className="flex-1 bg-primary text-background-dark h-12 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-lg font-bold">add_circle</span> {t('action_recharge')}
              </button>
              <button onClick={() => onNavigate('TRANSFER')} className="flex-1 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white h-12 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-gray-200 dark:border-white/10 transition-all active:scale-95">
                <span className="material-symbols-outlined text-lg">send</span> {t('action_send')}
              </button>
            </div>
          </div>
        </div>

        {/* Cartes Section */}
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-lg tracking-tight text-slate-900 dark:text-white">{t('my_cards')}</h3>
            <button onClick={() => onNavigate('CARD_DETAILS')} className="text-primary text-[10px] font-black uppercase tracking-widest">{t('view_details')}</button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x pb-2">
            {cards.map((card, idx) => (
              <div key={card.id} className="min-w-[85%] snap-center" onClick={() => onNavigate('CARD_DETAILS')}>
                <VirtualCardUI card={card} focused={idx === 0} />
              </div>
            ))}
          </div>
        </div>

        {/* Transactions Section */}
        <div className="space-y-5 pb-8">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-lg tracking-tight text-slate-900 dark:text-white">{t('activities')}</h3>
            <button onClick={() => onNavigate('TRANSACTIONS_LIST')} className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{t('history')}</button>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tx.type === TransactionType.DEPOSIT ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400'}`}>
                    <span className="material-symbols-outlined text-xl">
                      {tx.type === TransactionType.DEPOSIT ? 'south_west' : tx.type === TransactionType.TRANSFER ? 'send' : 'shopping_bag'}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-gray-100">{tx.merchant || t('transfer_label')}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm ${tx.type === TransactionType.DEPOSIT ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                    {tx.type === TransactionType.DEPOSIT ? '+' : '-'}${tx.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Navigation currentView="DASHBOARD" onNavigate={onNavigate} />
    </div>
  );
};

export default DashboardView;
