
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AppAssistant from './components/AppAssistant';
import SignupView from './components/SignupView';
import KYCView from './components/KYCView';
import InitialDepositView from './components/InitialDepositView';
import DashboardView from './components/DashboardView';
import RechargeView from './components/RechargeView';
import CardDetailsView from './components/CardDetailsView';
import HomeView from './components/HomeView';
import TransactionsListView from './components/TransactionsListView';
import TransferView from './components/TransferView';
import ProfileView from './components/ProfileView';
import { View, Transaction, VirtualCard, TransactionType, CardStatus } from './types';
import { useAuth } from './src/AuthContext';
import { api } from './src/api';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: TransactionType.PAYMENT, amount: 15.00, currency: 'USD', merchant: 'Netflix Premium', date: 'Aujourd\'hui', status: 'completed' },
  { id: '2', type: TransactionType.DEPOSIT, amount: 50.00, currency: 'USD', merchant: 'M-Pesa Deposit', date: 'Hier', status: 'completed' },
  { id: '3', type: TransactionType.PAYMENT, amount: 8.40, currency: 'USD', merchant: 'AWS Services', date: '15 Nov 2023', status: 'completed' },
  { id: '4', type: TransactionType.PAYMENT, amount: 45.00, currency: 'USD', merchant: 'Uber Trip', date: '12 Nov 2023', status: 'completed' },
];

const INITIAL_CARDS: VirtualCard[] = [
  {
    id: 'card_1',
    number: '4532827100349982',
    expiry: '12/26',
    cvv: '123',
    balance: 1250.00,
    label: 'UTILISATEUR',
    status: CardStatus.ACTIVE,
    type: 'VISA'
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<View>('HOME');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [cards, setCards] = useState<VirtualCard[]>(INITIAL_CARDS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const { user, logout, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync with Backend when logged in
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const fetchedCards = await api.getCards();
          const fetchedTx = await api.getTransactions();

          if (fetchedCards && fetchedCards.length > 0) {
            setCards(fetchedCards);
          } else {
            // Personalize fallback card with user's name
            const nameOnCard = (user.displayName || user.email?.split('@')[0] || 'UTILISATEUR').toUpperCase();
            setCards([{ ...INITIAL_CARDS[0], label: nameOnCard }]);
          }

          if (fetchedTx && fetchedTx.length > 0) {
            setTransactions(fetchedTx);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données:', error);
        }
      };

      fetchData();
    } else {
      // Signed out: keep demo data
      setCards(INITIAL_CARDS);
      setTransactions(MOCK_TRANSACTIONS);
    }
  }, [user]);

  const handleRechargeSuccess = async (amount: number) => {
    const updatedCards = [...cards];
    updatedCards[0].balance += amount;
    setCards(updatedCards);

    const newTx: Transaction = {
      id: Math.random().toString(36).substring(2, 11),
      type: TransactionType.DEPOSIT,
      amount: amount,
      currency: 'USD',
      merchant: 'Recharge M-Pesa',
      date: 'Maintenant',
      status: 'completed'
    };
    setTransactions([newTx, ...transactions]);
    setView('DASHBOARD');

    // Persist to Backend
    if (user) {
      try {
        await api.createTransaction({
          cardId: cards[0].id,
          type: TransactionType.DEPOSIT,
          amount,
          currency: 'USD',
          merchant: 'Recharge M-Pesa',
          status: 'completed'
        });

        await api.updateCardBalance(cards[0].id || 'card_1', updatedCards[0].balance);
      } catch (error) {
        console.error('Erreur lors de la persistance de la recharge:', error);
      }
    }
  };

  const handleTransferSuccess = async (amount: number, recipient: string) => {
    const updatedCards = [...cards];
    updatedCards[0].balance -= amount;
    setCards(updatedCards);

    const newTx: Transaction = {
      id: Math.random().toString(36).substring(2, 11),
      type: TransactionType.TRANSFER,
      amount: amount,
      currency: 'USD',
      merchant: `Transfert à ${recipient}`,
      date: 'Maintenant',
      status: 'completed'
    };
    setTransactions([newTx, ...transactions]);
    setView('DASHBOARD');

    // Persist to Backend
    if (user) {
      try {
        await api.createTransaction({
          cardId: cards[0].id,
          type: TransactionType.TRANSFER,
          amount,
          currency: 'USD',
          merchant: `Transfert à ${recipient}`,
          status: 'completed'
        });

        await api.updateCardBalance(cards[0].id || 'card_1', updatedCards[0].balance);
      } catch (error) {
        console.error('Erreur lors de la persistance du transfert:', error);
      }
    }
  };

  const navigate = (v: View) => setView(v);

  if (authLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-background-dark text-white">Chargement...</div>;
  }


  return (
    <Layout>
      {view === 'HOME' && (
        <HomeView
          onStart={() => navigate('AUTH')}
          onLogin={() => navigate('DASHBOARD')}
          currentUserName={user?.displayName || user?.email?.split('@')[0]}
        />
      )}
      {view === 'AUTH' && <SignupView onBack={() => navigate('HOME')} onSuccess={() => navigate('KYC')} onLogin={() => navigate('DASHBOARD')} />}
      {view === 'KYC' && <KYCView onBack={() => navigate('AUTH')} onComplete={() => navigate('INITIAL_DEPOSIT')} />}
      {view === 'INITIAL_DEPOSIT' && (
        <InitialDepositView
          onBack={() => navigate('DASHBOARD')}
          onComplete={() => navigate('DASHBOARD')}
        />
      )}

      {/* Vues Principales avec Navigation */}
      {view === 'DASHBOARD' && (
        <DashboardView
          userBalance={cards[0].balance}
          transactions={transactions}
          cards={cards}
          onNavigate={navigate}
          currentUserName={user?.displayName || user?.email?.split('@')[0]}
        />
      )}
      {view === 'CARD_DETAILS' && (
        <CardDetailsView
          card={cards[0]}
          transactions={transactions}
          onBack={() => navigate('DASHBOARD')}
          onNavigate={navigate}
        />
      )}
      {view === 'TRANSACTIONS_LIST' && (
        <TransactionsListView
          transactions={transactions}
          onBack={() => navigate('DASHBOARD')}
          onNavigate={navigate}
        />
      )}
      {view === 'PROFILE' && (
        <ProfileView
          currentUser={user}
          onBack={() => navigate('DASHBOARD')}
          onLogout={async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error);
            }
            navigate('HOME');
          }}
          onNavigate={navigate}
        />
      )}

      {/* Tunnels de transaction (sans nav bar basse) */}
      {view === 'RECHARGE' && (
        <RechargeView
          card={cards[0]}
          onBack={() => navigate('DASHBOARD')}
          onSuccess={handleRechargeSuccess}
        />
      )}
      {view === 'TRANSFER' && (
        <TransferView
          onBack={() => navigate('DASHBOARD')}
          onSuccess={handleTransferSuccess}
          balance={cards[0].balance}
        />
      )}

      <AppAssistant />
    </Layout>
  );
};

export default App;
