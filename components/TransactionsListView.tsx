
import React, { useState } from 'react';
import { useI18n } from './i18n';
import Navigation from './Navigation';
import { Transaction, TransactionType, View } from '../types';

interface TransactionsListViewProps {
  transactions: Transaction[];
  onBack: () => void;
  onNavigate: (view: View) => void;
}

const TransactionsListView: React.FC<TransactionsListViewProps> = ({ transactions, onBack, onNavigate }) => {
  const [filter, setFilter] = useState<'ALL' | TransactionType>('ALL');
  const [search, setSearch] = useState('');
  const { t } = useI18n();

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filter === 'ALL' || t.type === filter;
    const matchesSearch = t.merchant?.toLowerCase().includes(search.toLowerCase()) || 
                         t.type.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark animate-in slide-in-from-right duration-300 overflow-hidden">
      <header className="flex items-center justify-between p-4 pb-2 bg-background-light dark:bg-background-dark z-10 sticky top-0 border-b border-gray-200 dark:border-white/5">
        <button 
          onClick={onBack}
          className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-white"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back_ios_new</span>
        </button>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">{t('activities')}</h2>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6 pb-24">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">search</span>
          </div>
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition-all text-sm" 
            placeholder={t('search_placeholder')}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {['ALL', TransactionType.DEPOSIT, TransactionType.PAYMENT, TransactionType.TRANSFER].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                filter === f 
                  ? 'bg-primary text-background-dark border-primary shadow-lg shadow-primary/20' 
                  : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-white/10 text-gray-500'
              }`}
            >
              {f === 'ALL' ? t('filter_all') : f === TransactionType.DEPOSIT ? t('filter_deposits') : f === TransactionType.PAYMENT ? t('filter_purchases') : t('filter_transfers')}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 px-1">{t('full_history')}</h3>
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === TransactionType.DEPOSIT ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white'}`}>
                  <span className="material-symbols-outlined text-xl">
                    {tx.type === TransactionType.DEPOSIT ? 'south_west' : tx.type === TransactionType.TRANSFER ? 'send' : 'shopping_bag'}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{tx.merchant || t('transfer_label')}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">{tx.date}</p>
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
      </main>

      <Navigation currentView="TRANSACTIONS_LIST" onNavigate={onNavigate} />
    </div>
  );
};

export default TransactionsListView;
