import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Lang = 'fr' | 'en';

type Dictionary = Record<string, { fr: string; en: string }>;

const DICT: Dictionary = {
  // HomeView
  home_title_prefix: { fr: 'Votre Carte Virtuelle', en: 'Your Virtual Card' },
  home_title_highlight: { fr: 'Instantanée', en: 'Instant' },
  home_subtitle: {
    fr: 'Utilisez M-Pesa, Orange Money ou Airtel pour obtenir une carte Visa en 2 minutes. Payez en ligne sans limites.',
    en: 'Use M‑Pesa, Orange Money or Airtel to get a Visa card in 2 minutes. Pay online without limits.'
  },
  cta_signup: { fr: "S'inscrire", en: 'Sign up' },
  cta_login: { fr: 'Se Connecter', en: 'Log in' },
  compatible_with: { fr: 'Compatible avec', en: 'Compatible with' },
  // Navigation
  nav_home: { fr: 'Accueil', en: 'Home' },
  nav_cards: { fr: 'Cartes', en: 'Cards' },
  nav_activity: { fr: 'Activités', en: 'Activity' },
  nav_profile: { fr: 'Profil', en: 'Profile' },
  // Dashboard
  greeting_hello: { fr: 'Bonjour,', en: 'Hello,' },
  balance_available: { fr: 'Solde Disponible', en: 'Available Balance' },
  action_recharge: { fr: 'Recharger', en: 'Top up' },
  action_send: { fr: 'Envoyer', en: 'Send' },
  my_cards: { fr: 'Mes Cartes', en: 'My Cards' },
  view_details: { fr: 'Voir Détails', en: 'View Details' },
  activities: { fr: 'Activités', en: 'Activity' },
  history: { fr: 'Historique', en: 'History' },
  // Transactions List
  search_placeholder: { fr: 'Rechercher un marchand ou service...', en: 'Search a merchant or service…' },
  filter_all: { fr: 'Tout', en: 'All' },
  filter_deposits: { fr: 'Dépôts', en: 'Deposits' },
  filter_purchases: { fr: 'Achats', en: 'Purchases' },
  filter_transfers: { fr: 'Envois', en: 'Transfers' },
  full_history: { fr: 'Historique complet', en: 'Full history' },
  transfer_label: { fr: 'Transfert', en: 'Transfer' },
  // Card Details
  my_card: { fr: 'Ma Carte', en: 'My Card' },
  virtual_card: { fr: 'Carte Virtuelle', en: 'Virtual Card' },
  holder: { fr: 'Titulaire', en: 'Holder' },
  expires: { fr: 'Expire', en: 'Expires' },
  card_frozen: { fr: 'Carte Gelée', en: 'Card Frozen' },
  info: { fr: 'Infos', en: 'Info' },
  freeze: { fr: 'Geler', en: 'Freeze' },
  unfreeze: { fr: 'Dégeler', en: 'Unfreeze' },
  settings: { fr: 'Réglages', en: 'Settings' },
  // Profile
  profile: { fr: 'Profil', en: 'Profile' },
  verified_account: { fr: 'Compte Vérifié', en: 'Verified Account' },
  current_level: { fr: 'Niveau Actuel', en: 'Current Level' },
  daily_limit: { fr: 'Limite Jour', en: 'Daily Limit' },
  account: { fr: 'Compte', en: 'Account' },
  personal_info: { fr: 'Informations personnelles', en: 'Personal information' },
  name_email_address: { fr: 'Nom, Email, Adresse', en: 'Name, Email, Address' },
  payment_methods: { fr: 'Méthodes de paiement', en: 'Payment methods' },
  logout: { fr: 'Déconnexion', en: 'Log out' },
  // Generic
  loading: { fr: 'Chargement…', en: 'Loading…' },
  error_title: { fr: 'Un problème est survenu', en: 'Something went wrong' },
  error_msg: {
    fr: 'Veuillez recharger la page. Si le problème persiste, contactez le support.',
    en: 'Please reload the page. If the problem persists, contact support.'
  }
};

type I18nContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof DICT) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved === 'fr' || saved === 'en') return saved;
    // fallback by browser
    const nav = navigator.language?.toLowerCase() || 'en';
    return nav.startsWith('fr') ? 'fr' : 'en';
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  useEffect(() => {
    // reflect in <html lang>
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const t = useMemo(() => (key: keyof typeof DICT) => DICT[key][lang], [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider');
  return ctx;
};
