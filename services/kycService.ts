// Simple KYC service wrapper with mock fallback
// Real-world: delegate to a backend that integrates a KYC provider (e.g., Smile Identity, Onfido)

export type DocumentType = 'voter' | 'passport';

export interface KycPayload {
  documentType: DocumentType;
  frontImageUrl?: string;
  backImageUrl?: string;
}

export interface KycResult {
  approved: boolean;
  referenceId: string;
  riskScore?: number;
  reason?: string;
}

const KYC_URL = (import.meta as any).env?.VITE_BACKEND_KYC_URL as string | undefined;

// Helper to get Auth token from localStorage if needed
async function getAuthToken(): Promise<string | null> {
  return localStorage.getItem('auth_token');
}

export async function verifyKyc(payload: KycPayload): Promise<KycResult> {
  // Basic validation
  if (!payload.frontImageUrl) {
    throw new Error('Veuillez fournir une photo du recto du document.');
  }

  if (KYC_URL) {
    const token = await getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${KYC_URL}/kyc/verify`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Échec de la vérification KYC.');
    }
    const response = await res.json();
    return response.data || response;
  }

  // Mock fallback: approve if we have frontImageUrl; add small delay
  await new Promise((r) => setTimeout(r, 800));
  return {
    approved: true,
    referenceId: `kyc_${Math.random().toString(36).slice(2, 10)}`,
    riskScore: 0.02,
  };
}
