
export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  PAYMENT = 'PAYMENT',
  TRANSFER = 'TRANSFER'
}

export enum CardStatus {
  ACTIVE = 'ACTIVE',
  FROZEN = 'FROZEN',
  CANCELLED = 'CANCELLED'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: 'USD' | 'CDF';
  merchant?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface VirtualCard {
  id: string;
  number: string;
  expiry: string;
  cvv: string;
  balance: number;
  label: string;
  status: CardStatus;
  type: 'VISA' | 'MASTERCARD';
}

export interface UserProfile {
  name: string;
  phoneNumber: string;
  balance: number;
  currency: 'USD';
}

export type View = 'HOME' | 'AUTH' | 'KYC' | 'INITIAL_DEPOSIT' | 'DASHBOARD' | 'RECHARGE' | 'CARD_DETAILS' | 'TRANSACTIONS_LIST' | 'TRANSFER' | 'PROFILE';
