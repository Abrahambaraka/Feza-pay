// Virtual card issuing service wrapper with mock fallback
// Provider cible (prioritaire): Flutterwave Issuing.
// Alternatifs compatibles: Marqeta, Union54 (via partenaires), Rapyd.
// Astuce de mapping: certains providers renvoient des clés différentes
//  - PAN: number | pan | card_pan | card_number
//  - CVV: cvv | cvc
//  - Expiration: expiry | expiration | (exp_month + exp_year)
//  - Scheme/Brand: scheme | brand

import { CardStatus } from '../types';

export interface CreateCardPayload {
  scheme: 'VISA' | 'MASTERCARD';
  currency: 'USD' | 'CDF';
  label?: string;
  // transactionId: preuve de paiement (ex. tx_ref / id de charge M-Pesa) confirmée côté backend
  transactionId?: string;
  // amount: montant initial à charger sur la carte lors de l'émission (prélevé du pay-in confirmé)
  amount?: number;
}

export interface IssuedCard {
  id: string;
  number: string;
  expiry: string; // MM/YY
  cvv: string;
  balance: number;
  label: string;
  status: CardStatus;
  type: 'VISA' | 'MASTERCARD';
}

const ISSUING_URL = (import.meta as any).env?.VITE_BACKEND_ISSUING_URL as string | undefined;

// Helper to get Auth token from localStorage if needed
async function getAuthToken(): Promise<string | null> {
  return localStorage.getItem('auth_token');
}

export async function createVirtualCard(payload: CreateCardPayload): Promise<IssuedCard> {
  if (ISSUING_URL) {
    const token = await getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${ISSUING_URL}/issuing/cards`, {
      method: 'POST',
      headers,
      // Transmettre transactionId si présent afin que le backend vérifie que le paiement est bien confirmé
      body: JSON.stringify({
        ...payload,
        billingName: payload.label || 'PayCongo User',
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Échec de création de la carte.');
    }
    const response = await res.json();
    const data = response.data || response;
    return mapProviderCard(data);
  }

  // Mock fallback: generate Luhn-valid Visa PAN-like number
  await new Promise((r) => setTimeout(r, 800));
  const pan = generateVisaPan();
  return {
    id: `card_${Math.random().toString(36).slice(2, 10)}`,
    number: pan,
    expiry: '12/29',
    cvv: `${Math.floor(100 + Math.random() * 900)}`,
    balance: Number(payload.amount ?? 0),
    label: payload.label || 'VIRTUAL CARD',
    status: CardStatus.ACTIVE,
    type: payload.scheme,
  };
}

export async function getCardDetails(cardId: string): Promise<IssuedCard> {
  if (!ISSUING_URL) {
    throw new Error('Non supporté en mode mock.');
  }
  const res = await fetch(`${ISSUING_URL}/issuing/cards/${cardId}`);
  if (!res.ok) throw new Error('Impossible de récupérer la carte.');
  const data = await res.json();
  return mapProviderCard(data);
}

// Helpers
function mapProviderCard(data: any): IssuedCard {
  return {
    id: data.id || data.card_id,
    number: data.number || data.pan || data.card_pan || data.card_number,
    expiry: data.expiry || data.expiration || `${pad2(data.exp_month)}/${String(data.exp_year).slice(-2)}`,
    cvv: data.cvv || data.cvc,
    balance: Number(data.balance ?? 0),
    label: data.label || data.name_on_card || 'VIRTUAL CARD',
    status: (data.status as CardStatus) || CardStatus.ACTIVE,
    type: (data.scheme as 'VISA' | 'MASTERCARD') || (data.brand as 'VISA' | 'MASTERCARD') || 'VISA',
  };
}

function pad2(n: number) { return n < 10 ? `0${n}` : String(n); }

function generateVisaPan(): string {
  // Visa starts with 4, length 16, last is Luhn checksum
  const arr = [4];
  while (arr.length < 15) arr.push(Math.floor(Math.random() * 10));
  const checksum = luhnChecksum(arr);
  return arr.concat(checksum).join('');
}

function luhnChecksum(digits: number[]): number {
  const sum = digits
    .slice()
    .reverse()
    .map((d, i) => (i % 2 === 0 ? d * 2 : d))
    .map((d) => (d > 9 ? d - 9 : d))
    .reduce((a, b) => a + b, 0);
  return (10 - (sum % 10)) % 10;
}
