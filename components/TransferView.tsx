
import React, { useState } from 'react';

interface TransferViewProps {
  onBack: () => void;
  onSuccess: (amount: number, recipient: string) => void;
  balance?: number;
}

const RECENT_CONTACTS = [
  { id: '1', name: 'Maman', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9nug1ZccQH_hLbqGAlL0sGO6VGKbBvYS5PJjLkbCkrdpZaLB45koIcHYX_BFvra4L1xQk51mlrRVezNChSohHwxPw3jqYIB-I7QazELaen0B1qwULHziGJnw3befN7sdTjCjNop2qEjKqgUv26nAC9rRKYoS4fuPgbyzoq0w8ABmq0A1zeSvGEnvX4cyKDLdoi2BYEyGW3wggmmF9-nNWV1_B2PC9KqSXq6swJ8UPbPTX6U7q01Gof7uf9rs32iu_4Has2rayc6c' },
  { id: '2', name: 'Papa', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5rrKzTopM-5pk3TBWiBUnkAwG-nSDQpm4_zDlbTXeqwjCXm2oJ6eKGsgrR3PnSd6_W6t6Oazirq5gWsT03ry6_KtXW3oIr3_MCqzMgrFRI1BUi8Lgm0bRwDoJ9wCel-qj6OSzEKqHGD0yJJkQhyIltwB7I0UhEf3FpdAnTN2z_lk8eayPMUeVYEIzhq3tqIF3VoeELTw3U9Y6vJzn4vQOM-z3bFYIl-qFzAuiUdGYyUQU0YMfMBZHJiTtfItVz2aNTkLL1MUwUq8' },
  { id: '3', name: 'Marie', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpvG-7ryRLQqqnYrZnD7NtQOtJdCnQ4eHWsFtkhmQVI8GgQFx8c_hHh0Cs14PyoBWsvBPkkOZclBvLN6Od5QKZK0DSg4hyQO4e6EHOR_LxSlAHY__TlsD6ZuPStIwA763MAHaAOdeGdgFOYxLu3_-666-sztGs4KXiWKx6RFeumQenais4qjZ-0zeoueZE0i_zA8fAzzI2F3JEWhGmdLBwV7oGBg2ZA0ZhoIyPxsNJCLv4TGqd6L0c9GytRSkyTPKzONvjjh0JtLw' },
  { id: '4', name: 'Jean', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDikrb2euwiFOBGQqP27G0nrROD_Kyc-R8c0NNlJfctRXftQVzlIyfM_tUT4xipUF2RqBzzBPJevWmEa9vRpKwgeYd9vk4nwELymDf8HZVhc88LyxsPyIl4wXg7AQ7hGnl3z38p3miypHXCPSSUEgoCb6ziYyQ_VC3hO3lpn_9eOdhCP4Jq2dDVpedxP_GvBDz6_bDSskIVO0rI1bQZyyvWgc92j96tFT1RP7okFcHZ2CrQAhdcQh25Oui1jX9xxNBvFpK-RaNz1Uk' },
];

const TransferView: React.FC<TransferViewProps> = ({ onBack, onSuccess, balance = 1250.00 }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'CDF'>('USD');
  const [note, setNote] = useState('');

  const handleSend = () => {
    if (recipient && amount) {
      onSuccess(Number(amount), recipient);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark animate-in slide-in-from-right duration-300 overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between p-4 pb-2 bg-background-light dark:bg-background-dark z-10 sticky top-0">
        <button 
          onClick={onBack}
          className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-white"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back_ios_new</span>
        </button>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Envoyer de l'argent</h2>
      </header>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-32 px-4">
        {/* Balance Indicator */}
        <div className="flex justify-center w-full py-4">
          <div className="flex items-center gap-x-2 rounded-full bg-surface-dark border border-white/10 px-4 py-2 shadow-sm">
            <span className="material-symbols-outlined text-primary text-sm">account_balance_wallet</span>
            <p className="text-white text-sm font-medium leading-normal">Solde: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        {/* Recent Contacts Carousel */}
        <div className="mt-2 mb-6">
          <div className="flex justify-between items-end mb-3 px-1">
            <p className="text-slate-900 dark:text-white text-base font-medium">Récents</p>
            <button className="text-primary text-xs font-semibold uppercase tracking-wide">Voir tout</button>
          </div>
          <div className="flex w-full overflow-x-auto no-scrollbar gap-4 pb-2">
            {/* Add New Contact */}
            <div className="flex flex-col items-center gap-2 min-w-[64px]">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center bg-surface-dark hover:bg-white/5 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-primary">add</span>
              </div>
              <p className="text-slate-500 dark:text-gray-400 text-xs font-medium truncate w-full text-center">Nouveau</p>
            </div>
            {/* Contacts */}
            {RECENT_CONTACTS.map(contact => (
              <div 
                key={contact.id} 
                className="flex flex-col items-center gap-2 min-w-[64px] cursor-pointer"
                onClick={() => setRecipient(contact.name)}
              >
                <div 
                  className={`w-16 h-16 rounded-full bg-surface-dark bg-cover bg-center border-2 transition-all ${recipient === contact.name ? 'border-primary scale-105' : 'border-transparent'}`}
                  style={{ backgroundImage: `url('${contact.avatar}')` }}
                ></div>
                <p className={`text-xs font-medium truncate w-full text-center ${recipient === contact.name ? 'text-primary' : 'text-slate-700 dark:text-white'}`}>
                  {contact.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recipient Input */}
        <div className="mb-8">
          <label className="block text-slate-900 dark:text-white text-base font-medium mb-3 px-1">À qui envoyez-vous ?</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input 
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="block w-full pl-12 pr-12 py-4 rounded-xl border-none bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition-all text-base" 
              placeholder="Nom d'utilisateur, téléphone..." 
              type="text"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer hover:opacity-80">
              <span className="material-symbols-outlined text-primary">contacts</span>
            </div>
          </div>
          {/* Verification Feedback (Simulated) */}
          <div className={`flex items-center gap-1 mt-2 pl-1 transition-opacity duration-300 ${recipient.length > 3 ? 'opacity-100' : 'opacity-0'}`}>
            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
            <span className="text-primary text-xs font-medium">Utilisateur reconnu: {recipient}</span>
          </div>
        </div>

        {/* Amount & Currency Section */}
        <div className="flex flex-col items-center justify-center mb-8 gap-6">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Montant à transférer</p>
          <div className="flex items-baseline justify-center gap-2 relative w-full">
            <span className="text-4xl text-slate-900 dark:text-white font-bold">{currency === 'USD' ? '$' : 'FC'}</span>
            <input 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent border-none p-0 text-center text-6xl font-extrabold text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-gray-700 focus:ring-0 w-3/4" 
              inputMode="decimal" 
              placeholder="0.00" 
              type="number"
            />
          </div>
          {/* Currency Toggle */}
          <div className="flex bg-gray-200 dark:bg-surface-dark p-1 rounded-lg w-auto">
            <button 
              onClick={() => setCurrency('USD')}
              className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${currency === 'USD' ? 'bg-white dark:bg-background-dark text-slate-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
            >
              USD
            </button>
            <button 
              onClick={() => setCurrency('CDF')}
              className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${currency === 'CDF' ? 'bg-white dark:bg-background-dark text-slate-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
            >
              CDF
            </button>
          </div>
        </div>

        {/* Note Input */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none top-0 pt-4">
              <span className="material-symbols-outlined text-gray-400">edit_note</span>
            </div>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition-all text-sm resize-none" 
              placeholder="Ajouter une note (optionnel)" 
              rows={2}
            ></textarea>
          </div>
        </div>
      </main>

      {/* Fixed Footer Action */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background-light dark:bg-background-dark bg-opacity-90 dark:bg-opacity-90 backdrop-blur-md z-20 border-t border-black/5 dark:border-white/5 max-w-md mx-auto">
        <div className="flex flex-col gap-3 w-full">
          <div className="flex justify-between items-center px-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Frais de transaction</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">$0.00</span>
          </div>
          <button 
            onClick={handleSend}
            disabled={!recipient || !amount}
            className="w-full bg-primary hover:bg-primary-dark active:scale-[0.98] transition-all h-14 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:grayscale"
          >
            <span className="text-background-dark text-lg font-bold">Envoyer Maintenant</span>
            <span className="material-symbols-outlined text-background-dark">send</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default TransferView;
