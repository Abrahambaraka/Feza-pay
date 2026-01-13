// Pay-in (collecte) service wrapper for Mobile Money (Vodacom M-Pesa RDC)
// Toutes les clés secrètes doivent rester côté serveur. Ce wrapper appelle un backend proxy.

export interface MobileMoneyChargePayload {
  amount: number; // en USD ou CDF selon currency
  currency: 'USD' | 'CDF';
  phone_number: string; // ex. 243810000000 (format MSISDN)
  network: 'VODACOM' | 'AIRTEL' | 'ORANGE';
  email?: string;
}

export interface MobileMoneyChargeResult {
  transactionId: string; // ex. tx_ref ou id de la charge provider
  status: 'pending' | 'successful' | 'failed';
  message?: string;
}

const PAYIN_URL = (import.meta as any).env?.VITE_BACKEND_PAYIN_URL as string | undefined;

// Helper to get Auth token from localStorage if needed (handled by api client usually)
async function getAuthToken(): Promise<string | null> {
  return localStorage.getItem('auth_token');
}

// Démarre une charge Mobile Money côté backend (ex: Flutterwave Charges mobile_money_franco)
export async function initiateMobileMoneyCharge(payload: MobileMoneyChargePayload): Promise<MobileMoneyChargeResult> {
  if (PAYIN_URL) {
    const token = await getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${PAYIN_URL}/payin/mobile-money`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Échec de l\'initiation du paiement Mobile Money.');
    }
    const response = await res.json();
    return response.data || response;
  }

  // Mock: simuler un push STK puis un succès rapide
  await new Promise((r) => setTimeout(r, 1000));
  return {
    transactionId: `tx_${Math.random().toString(36).slice(2, 10)}`,
    status: 'successful',
    message: 'Paiement simulé validé',
  };
}
