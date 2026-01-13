
import React from 'react';
import { useI18n } from './i18n';
import { View } from '../types';

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const { t } = useI18n();
  // Items de navigation alignés sur une seule ligne (icône "Envoyer" inclus)
  const navItems: { view: View; icon: string; label: string }[] = [
    { view: 'DASHBOARD', icon: 'home', label: t('nav_home') },
    { view: 'CARD_DETAILS', icon: 'credit_card', label: t('nav_cards') },
    { view: 'TRANSFER', icon: 'send', label: t('transfer_label') },
    { view: 'TRANSACTIONS_LIST', icon: 'history', label: t('nav_activity') },
    { view: 'PROFILE', icon: 'person', label: t('nav_profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 flex items-center justify-around px-4 z-50 max-w-md mx-auto">
      <div className="flex w-full items-end justify-between">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${
              currentView === item.view ? 'text-primary scale-110' : 'text-slate-400 dark:text-gray-500'
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${currentView === item.view ? 'fill-1 font-bold' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
