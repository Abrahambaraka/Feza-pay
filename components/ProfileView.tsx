
import React, { useState, useMemo } from 'react';
import { useI18n } from './i18n';
import Navigation from './Navigation';
import { View } from '../types';
import { useAuth } from '../src/AuthContext';
import { api } from '../src/api';

interface ProfileViewProps {
  onBack: () => void;
  onLogout: () => void;
  onNavigate: (view: View) => void;
  currentUser: any; // Using custom user type from AuthContext
}

const ProfileView: React.FC<ProfileViewProps> = ({ onBack, onLogout, onNavigate, currentUser }) => {
  const { t } = useI18n();
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [localName, setLocalName] = useState<string | null>(null);

  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Utilisateur';
  const displayName = localName ?? userDisplayName;
  const phone = '+243 81 234 5678'; // Fallback as we don't store phone yet in custom DB
  const email = currentUser?.email || '';
  const photoURL = currentUser?.photoURL ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAgIEb74coB3blg6M11UeUqhW07iLWrtmpeATamPX41nbY8idI1x_A-eD4oIVWelqs1QYmsQ6RVktC3wlb1GjFyMR2cXuI4rmlUvEO4nUVKDnKIPrEXnDf55NxP7rAM0vAY1FRcTTghM6MNBQCOr9uNXZHQRrGkZLsud417uzU56SLLfWCUD5cQe0UYpgHBtxrb8BS9GQc2Spfsv9AUuREHK4DzDdX_70xBk3tI1CzQEguSVeaqIx8tRscuaGSHvEhTq_m43ShABGc';

  const initials = useMemo(() => {
    const base = (displayName || '').trim() || (email?.split('@')[0] ?? 'U');
    const parts = base.split(/\s+/).filter(Boolean);
    const letters = (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
    const res = letters.toUpperCase() || (base[0]?.toUpperCase() || 'U');
    return res;
  }, [displayName, email]);

  const providerType = useMemo(() => {
    return currentUser?.googleId ? 'google' : null;
  }, [currentUser]);

  const handleLogout = async () => {
    if (loggingOut) return;
    try {
      setLoggingOut(true);
      await logout();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleEditName = async () => {
    const proposed = prompt('Nouveau nom complet', displayName);
    if (!proposed) return;
    const newName = proposed.trim();
    if (!newName || newName === displayName) return;
    try {
      await api.updateProfile(newName);
      setLocalName(newName);
    } catch (e) {
      alert("Impossible de mettre à jour le nom. Veuillez réessayer.");
    }
  };
  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark animate-in slide-in-from-bottom-4 duration-500 overflow-y-auto no-scrollbar pb-24">
      {/* Top App Bar */}
      <div className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-200 dark:border-white/5">
        <button
          onClick={onBack}
          className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">{t('profile')}</h2>
        <div className="size-10"></div>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center pt-6 px-4 pb-6">
        <div className="relative mb-4 group cursor-pointer">
          {currentUser?.photoURL ? (
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 ring-4 ring-primary/20"
              style={{ backgroundImage: `url("${photoURL}")` }}
            />
          ) : (
            <div className="rounded-full h-32 w-32 ring-4 ring-primary/20 bg-gradient-to-br from-primary/80 to-[#0e8a38] flex items-center justify-center">
              <span className="text-4xl font-extrabold text-black">{initials}</span>
            </div>
          )}
          <div className="absolute bottom-1 right-1 bg-primary text-black rounded-full p-1.5 border-4 border-background-light dark:border-background-dark flex items-center justify-center shadow-lg">
            {providerType === 'google' ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"></path>
                <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8455 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"></path>
                <path d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC05"></path>
                <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"></path>
              </svg>
            ) : providerType === 'apple' ? (
              <span className="material-symbols-outlined text-sm font-bold">ios</span>
            ) : (
              <span className="material-symbols-outlined text-sm font-bold">check</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold leading-tight">{displayName}</h1>
            {currentUser && (
              <button
                type="button"
                onClick={handleEditName}
                className="size-8 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 grid place-items-center text-gray-500 dark:text-gray-300"
                title="Modifier le nom"
              >
                <span className="material-symbols-outlined text-base">edit</span>
              </button>
            )}
          </div>
          {email && <p className="text-gray-500 dark:text-gray-400 text-sm">{email}</p>}
          <p className="text-primary font-medium text-base tracking-wide">{phone}</p>
          <div className="flex items-center gap-1 mt-1 px-3 py-1 rounded-full bg-primary/10">
            <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
            <span className="text-primary text-sm font-semibold">{t('verified_account')}</span>
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="px-4 mb-8">
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1 rounded-2xl bg-white dark:bg-surface-dark p-4 items-center text-center shadow-sm border border-gray-100 dark:border-white/5">
            <span className="material-symbols-outlined text-primary mb-1">workspace_premium</span>
            <p className="text-slate-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">{t('current_level')}</p>
            <p className="text-xl font-bold">Gold</p>
          </div>
          <div className="flex flex-1 flex-col gap-1 rounded-2xl bg-white dark:bg-surface-dark p-4 items-center text-center shadow-sm border border-gray-100 dark:border-white/5">
            <span className="material-symbols-outlined text-primary mb-1">account_balance_wallet</span>
            <p className="text-slate-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">{t('daily_limit')}</p>
            <p className="text-xl font-bold">$2,500</p>
          </div>
        </div>
      </div>

      {/* Settings Groups */}
      <div className="flex flex-col gap-6 px-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 px-2">{t('account')}</h3>
          <div className="flex flex-col bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5">
            <button className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left w-full group">
              <div className="flex items-center justify-center rounded-xl bg-gray-100 dark:bg-primary/10 text-slate-900 dark:text-primary shrink-0 size-10 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold truncate">{t('personal_info')}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 truncate">{t('name_email_address')}</p>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
            <div className="h-px bg-gray-100 dark:bg-white/5 mx-4"></div>
            <button className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left w-full group">
              <div className="flex items-center justify-center rounded-xl bg-gray-100 dark:bg-primary/10 text-slate-900 dark:text-primary shrink-0 size-10 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold truncate">{t('payment_methods')}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 truncate">M-Pesa, Orange Money</p>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-500 hover:bg-red-500/20 active:scale-[0.98] transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">logout</span>
          {loggingOut ? 'Déconnexion…' : t('logout')}
        </button>
      </div>

      <Navigation currentView="PROFILE" onNavigate={onNavigate} />
    </div>
  );
};

export default ProfileView;
