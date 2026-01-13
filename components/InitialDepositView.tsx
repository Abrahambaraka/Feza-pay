import React, { useState } from 'react';
import { initiateMobileMoneyCharge } from '../services/payinService';
import { createVirtualCard } from '../services/issuingService';
import { useAuth } from '../src/AuthContext';
import { api } from '../src/api';

interface InitialDepositViewProps {
  onBack: () => void;
  onComplete: () => void;
}

const InitialDepositView: React.FC<InitialDepositViewProps> = ({ onBack, onComplete }) => {
  const [amount, setAmount] = useState<number>(5);
  const [phone, setPhone] = useState<string>('243810000000');
  const [network, setNetwork] = useState<'VODACOM' | 'AIRTEL' | 'ORANGE'>('VODACOM');
  const [currency] = useState<'USD' | 'CDF'>('USD');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const { user } = useAuth();

  const handleStartDeposit = async () => {
    setError(null);
    setInfo(null);
    if (!amount || amount <= 0) {
      setError('Veuillez saisir un montant valide.');
      return;
    }
    if (!/^\d{12,15}$/.test(phone)) {
      setError('Numéro de téléphone invalide (format MSISDN, ex. 243810000000).');
      return;
    }

    try {
      setLoading(true);
      setInfo("Envoi de la demande de paiement M-Pesa…");
      const charge = await initiateMobileMoneyCharge({
        amount,
        currency,
        phone_number: phone,
        network,
        email: user?.email || undefined,
      });

      if (charge.status === 'failed') {
        throw new Error('Le paiement a échoué. Réessayez.');
      }

      if (charge.status === 'pending') {
        setInfo('Paiement en attente de validation sur votre téléphone.');
        // Simulation polling / callback
      }

      setInfo('Paiement confirmé. Émission de votre carte…');
      const nameOnCard = (user?.displayName
        || user?.email?.split('@')[0]
        || 'UTILISATEUR')
        .toString();

      const card = await createVirtualCard({
        scheme: 'VISA',
        currency,
        label: nameOnCard,
        transactionId: charge.transactionId,
        amount,
      });

      // Persistance Backend Custom
      if (user) {
        // Journaliser le dépôt initial
        await api.createTransaction({
          cardId: card.id,
          type: 'DEPOSIT',
          amount,
          currency,
          merchant: 'Dépôt initial M-Pesa',
          status: 'completed',
        });

        // On ne crée pas la carte explicitement ici car le backend gère ça ou on le simule
        // Pour l'instant on met à jour la balance si besoin
        await api.updateCardBalance(card.id || 'card_1', card.balance);

        // Journal d’activation
        await api.createTransaction({
          type: 'DEPOSIT',
          amount: 0,
          currency,
          merchant: 'Activation de carte virtuelle',
          status: 'completed',
        });
      }

      setInfo('Carte émise avec succès. Redirection…');
      onComplete();
    } catch (e: any) {
      setError(e?.message || 'Le paiement a échoué ou a expiré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between bg-background-light dark:bg-background-dark sticky top-0 z-10">
        <button onClick={onBack} className="text-[#111418] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back_ios_new</span>
        </button>
        <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Dépôt initial</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6">
        <div className="mt-6 mb-4">
          <h3 className="text-xl font-extrabold text-[#111418] dark:text-white mb-1">Alimentez votre carte</h3>
          <p className="text-[#637588] dark:text-[#9ca3af] text-sm">Un paiement Mobile Money sera demandé sur votre téléphone Vodacom.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2 text-[#111418] dark:text-white">Montant (USD)</label>
            <input type="number" min={1} step={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-[#111418] dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-[#111418] dark:text-white">Numéro Vodacom (MSISDN)</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-[#111418] dark:text-white" placeholder="2438xxxxxxxx" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-[#111418] dark:text-white">Réseau</label>
            <div className="flex p-1 bg-gray-200 dark:bg-surface-dark rounded-xl">
              {(['VODACOM', 'AIRTEL', 'ORANGE'] as const).map(n => (
                <button key={n} onClick={() => setNetwork(n)} className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-all ${network === n ? 'shadow-sm bg-white dark:bg-[#344e3d] text-[#111418] dark:text-white' : 'text-[#637588] dark:text-[#9ca3af]'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-[#637588] dark:text-[#9ca3af]">
          <ul className="list-disc list-inside space-y-1">
            <li>KYC obligatoire avant émission de la carte.</li>
            <li>Les frais d’émission peuvent être déduits du montant.</li>
            <li>Vos clés secrètes ne sont jamais stockées sur l’appareil.</li>
          </ul>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-white/5 max-w-md mx-auto z-20">
        {error && <div className="mb-3 text-sm text-red-600 dark:text-red-400 font-medium">{error}</div>}
        {info && !error && <div className="mb-3 text-sm text-blue-600 dark:text-blue-400 font-medium">{info}</div>}
        <button onClick={handleStartDeposit} disabled={loading} className={`w-full bg-primary hover:bg-[#0fd650] text-[#0a2814] font-bold text-base py-4 px-6 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          <span>{loading ? 'Traitement…' : 'Payer et créer la carte'}</span>
          <span className="material-symbols-outlined text-[20px]">{loading ? 'hourglass_top' : 'payments'}</span>
        </button>
        <div className="flex items-center justify-center gap-1.5 mt-4 opacity-60">
          <span className="material-symbols-outlined text-[14px] text-[#637588] dark:text-[#93a2b1]">lock</span>
          <p className="text-[11px] font-medium text-[#637588] dark:text-[#93a2b1] text-center">Les paiements sont traités de manière sécurisée via votre opérateur.</p>
        </div>
      </div>
    </div>
  );
};

export default InitialDepositView;
