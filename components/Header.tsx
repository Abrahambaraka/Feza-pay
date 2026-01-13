
import React from 'react';

interface HeaderProps {
  onBack?: () => void;
  title?: string;
  showBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onBack, title, showBack = false }) => {
  return (
    <div className="flex items-center justify-between px-6 py-5 z-20">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 dark:bg-surface-dark text-slate-700 dark:text-gray-300">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
        )}
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title || "Feza Pay"}
        </span>
      </div>

      {!title && (
        <button className="flex items-center gap-1 rounded-full bg-slate-200 dark:bg-surface-dark px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-white/10 transition">
          <span className="text-primary">FR</span>
          <span className="opacity-30">|</span>
          <span className="">EN</span>
        </button>
      )}
    </div>
  );
};

export default Header;
