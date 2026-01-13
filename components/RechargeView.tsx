
import React, { useState } from 'react';
import { VirtualCard } from '../types';

interface RechargeViewProps {
  card: VirtualCard;
  onBack: () => void;
  onSuccess: (amount: number) => void;
}

const RechargeView: React.FC<RechargeViewProps> = ({ card, onBack, onSuccess }) => {
  const [amount, setAmount] = useState<number>(50);
  const [provider, setProvider] = useState<'mpesa' | 'airtel' | 'orange'>('mpesa');
  const [phone, setPhone] = useState('81 000 0000');

  const fee = amount * 0.01;
  const total = amount + fee;

  const handlePay = () => {
    // Simulate payment logic
    onSuccess(amount);
  };

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark animate-in slide-in-from-right duration-300">
      {/* Top App Bar */}
      <div className="sticky top-0 z-50 bg-background-light dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-900 dark:text-white" style={{ fontSize: '24px' }}>arrow_back_ios_new</span>
          </button>
          <h1 className="text-lg font-bold text-center flex-1 pr-10">Recharger ma carte</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-4 pt-6 pb-32 max-w-md mx-auto w-full no-scrollbar overflow-y-auto">
        {/* Virtual Card Preview */}
        <div className="w-full aspect-[1.586/1] rounded-2xl relative overflow-hidden shadow-2xl mb-8 group transition-transform duration-300 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('https://picsum.photos/seed/cardbg/800/500')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent z-0"></div>
          
          <div className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">Solde actuel</p>
                <p className="text-2xl font-bold tracking-tight">${card.balance.toFixed(2)}</p>
              </div>
              <span className="material-symbols-outlined text-white/90" style={{ fontSize: '32px' }}>contactless</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
                </div>
                <span className="text-lg font-mono tracking-widest">{card.number.slice(-4)}</span>
              </div>
              <div className="flex justify-between items-end">
                <p className="font-medium text-sm text-white/90">{card.type} Virtuelle</p>
                <div className="italic font-black text-2xl tracking-tighter leading-none text-white">{card.type}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Amount Input Section */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 ml-1">Montant à recharger ($)</h3>
          <div className="relative flex items-center mb-4">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>attach_money</span>
            </div>
            <input 
              className="w-full bg-white dark:bg-surface-dark border-2 border-transparent focus:border-primary text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 rounded-xl py-4 pl-12 pr-4 text-3xl font-bold tracking-tight outline-none shadow-sm transition-all focus:ring-0" 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0.00"
            />
          </div>
          {/* Chips */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {[10, 50, 100, 200].map((val) => (
              <button 
                key={val}
                onClick={() => setAmount(val)}
                className={`flex-shrink-0 px-5 py-2 rounded-lg border transition-all text-sm font-semibold shadow-sm ${
                  amount === val 
                    ? 'bg-primary text-black border-primary shadow-primary/20' 
                    : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-white/10 text-slate-700 dark:text-gray-300'
                }`}
              >
                ${val}
              </button>
            ))}
          </div>
        </div>

        {/* Provider Selection */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 ml-1">Moyen de paiement</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'airtel', label: 'Airtel Money', color: 'bg-red-600', initial: 'A' },
              { id: 'mpesa', label: 'M-Pesa', color: 'bg-red-500', initial: 'M' },
              { id: 'orange', label: 'Orange Money', color: 'bg-orange-500', initial: 'O' }
            ].map((p) => (
              <label key={p.id} className="cursor-pointer group relative">
                <input 
                  className="peer sr-only" 
                  name="provider" 
                  type="radio" 
                  checked={provider === p.id}
                  onChange={() => setProvider(p.id as any)}
                />
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-surface-dark border-2 border-gray-100 dark:border-white/5 peer-checked:border-primary peer-checked:bg-primary/5 transition-all h-24">
                  <div className={`w-10 h-10 rounded-full ${p.color} flex items-center justify-center mb-2 text-white font-bold text-xs border-2 border-white`}>{p.initial}</div>
                  <span className="text-[10px] font-bold text-center leading-tight uppercase">{p.label}</span>
                </div>
                <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 ml-1">Numéro Mobile Money</h3>
          <div className="flex rounded-xl bg-white dark:bg-surface-dark overflow-hidden border border-gray-200 dark:border-white/10 focus-within:border-primary transition-all">
            <div className="flex items-center pl-4 pr-3 border-r border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
              <span className="text-slate-900 dark:text-white font-semibold text-base">+243</span>
            </div>
            <input 
              className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder-gray-400 p-4 font-medium text-lg outline-none focus:ring-0" 
              placeholder="81 000 0000" 
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div className="pr-4 flex items-center text-primary">
              <span className="material-symbols-outlined">smartphone</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-auto bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-200 dark:border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Recharge</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">Frais (1%)</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">${fee.toFixed(2)}</span>
          </div>
          <div className="h-px bg-gray-200 dark:bg-white/10 w-full mb-3"></div>
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-slate-900 dark:text-white">Total à payer</span>
            <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark/95 backdrop-blur-md p-4 border-t border-gray-200 dark:border-white/5 z-40 max-w-md mx-auto">
        <button 
          onClick={handlePay}
          className="w-full bg-primary hover:bg-[#0fdc52] active:scale-[0.98] transition-all text-black font-bold text-lg h-14 rounded-xl flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(19,236,91,0.3)]"
        >
          <span className="material-symbols-outlined">lock</span>
          Payer ${total.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default RechargeView;
